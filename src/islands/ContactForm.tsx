import { useState } from 'react'

interface Part1Data {
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  state: string
  timeline: string
  purposeCompanion: boolean
  purposeShow: boolean
  purposeOpenToShows: boolean
  purposeBreeding: boolean
  purposeTherapy: boolean
  purposeDogSports: boolean
  purposeDogSportsDetails: string
  purposeOther: boolean
  purposeOtherDetails: string
  previousDogsGreatDane: boolean
  previousDogsExtraLarge: boolean
  previousDogsLarge: boolean
  previousDogsMedium: boolean
  previousDogsSmall: boolean
  previousDogsNone: boolean
  questions: string
  howDidYouHear: string
}

export default function ContactForm() {
  const [part1Submitted, setPart1Submitted] = useState(false)

  const [part1Data, setPart1Data] = useState<Part1Data>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    timeline: '',
    purposeCompanion: false,
    purposeShow: false,
    purposeOpenToShows: false,
    purposeBreeding: false,
    purposeTherapy: false,
    purposeDogSports: false,
    purposeDogSportsDetails: '',
    purposeOther: false,
    purposeOtherDetails: '',
    previousDogsGreatDane: false,
    previousDogsExtraLarge: false,
    previousDogsLarge: false,
    previousDogsMedium: false,
    previousDogsSmall: false,
    previousDogsNone: false,
    questions: '',
    howDidYouHear: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [part1Errors, setPart1Errors] = useState<Partial<Record<keyof Part1Data, string>>>({})

  const handlePart1Change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      // If "None" is checked, uncheck all others
      if (name === 'previousDogsNone' && checked) {
        setPart1Data(prev => ({
          ...prev,
          previousDogsGreatDane: false,
          previousDogsExtraLarge: false,
          previousDogsLarge: false,
          previousDogsMedium: false,
          previousDogsSmall: false,
          previousDogsNone: true,
        }))
      } else if (name !== 'previousDogsNone') {
        // If any other option is checked, uncheck "None"
        setPart1Data(prev => ({
          ...prev,
          [name]: checked,
          previousDogsNone: false,
        }))
      } else {
        setPart1Data(prev => ({ ...prev, [name]: checked }))
      }
    } else {
      setPart1Data(prev => ({ ...prev, [name]: value }))
    }
    if (part1Errors[name as keyof Part1Data]) {
      setPart1Errors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validatePart1 = (): boolean => {
    const newErrors: Partial<Record<keyof Part1Data, string>> = {}

    if (!part1Data.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!part1Data.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!part1Data.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(part1Data.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!part1Data.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!part1Data.city.trim()) newErrors.city = 'City is required'
    if (!part1Data.state.trim()) newErrors.state = 'State is required'

    setPart1Errors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getHowDidYouHearText = (value: string): string => {
    const map: Record<string, string> = {
      website: 'Website',
      tiktok: 'TikTok',
      referral: 'Referral from another family',
      show: 'Dog show',
      search: 'Internet search',
      gdca: 'Great Dane Club of America',
      'social-media': 'Social media',
      other: 'Other',
    }
    return map[value] || value || ''
  }

  const getPreviousDogsText = (): string => {
    const options: string[] = []
    if (part1Data.previousDogsGreatDane) options.push('Great Dane(s)')
    if (part1Data.previousDogsExtraLarge)
      options.push(
        'Other Extra Large breed(s) - e.g., Mastiff, Saint Bernard, Newfoundland, Great Pyrenees',
      )
    if (part1Data.previousDogsLarge)
      options.push('Large breed(s) - e.g., German Shepherd, Labrador, Golden Retriever, Boxer')
    if (part1Data.previousDogsMedium)
      options.push('Medium breed(s) - e.g., Border Collie, Australian Shepherd, Beagle, Bulldog')
    if (part1Data.previousDogsSmall)
      options.push('Small breed(s) - e.g., Dachshund, Cocker Spaniel, French Bulldog, Poodle')
    if (part1Data.previousDogsNone) options.push('No previous dogs')
    return options.length > 0 ? options.join(', ') : 'N/A'
  }

  const getPurposeText = (): string => {
    const options: string[] = []
    if (part1Data.purposeCompanion) options.push('Companion/Pet')
    if (part1Data.purposeShow) options.push('Show/Conformation (actively planning)')
    if (part1Data.purposeOpenToShows)
      options.push('Open to shows/conformation (may consider in future)')
    if (part1Data.purposeBreeding) options.push('Breeding (with contract)')
    if (part1Data.purposeTherapy) options.push('Therapy/Service work')
    if (part1Data.purposeDogSports) {
      const sports = part1Data.purposeDogSportsDetails.trim()
        ? `Dog sports (${part1Data.purposeDogSportsDetails})`
        : 'Dog sports (Agility, Obedience, Rally, etc.)'
      options.push(sports)
    }
    if (part1Data.purposeOther) {
      const other = part1Data.purposeOtherDetails.trim()
        ? `Other: ${part1Data.purposeOtherDetails}`
        : 'Other'
      options.push(other)
    }
    return options.length > 0 ? options.join(', ') : 'N/A'
  }

  const handlePart1Submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePart1()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const emailEntries: string[] = []

      emailEntries.push(`First Name: ${part1Data.firstName || 'N/A'}`)
      emailEntries.push(`Last Name: ${part1Data.lastName || 'N/A'}`)
      emailEntries.push(`Email: ${part1Data.email || 'N/A'}`)
      emailEntries.push(`Phone: ${part1Data.phone || 'N/A'}`)
      emailEntries.push(`City: ${part1Data.city || 'N/A'}`)
      emailEntries.push(`State: ${part1Data.state || 'N/A'}`)
      emailEntries.push(`Timeline: ${part1Data.timeline || 'N/A'}`)
      emailEntries.push(`Purpose: ${getPurposeText()}`)
      emailEntries.push(`Previous Dogs: ${getPreviousDogsText()}`)
      emailEntries.push(`Questions: ${part1Data.questions || 'N/A'}`)

      const howDidYouHearText = part1Data.howDidYouHear
        ? getHowDidYouHearText(part1Data.howDidYouHear)
        : 'N/A'
      emailEntries.push(`Primary Way You Heard About Us: ${howDidYouHearText}`)

      const emailBody = `INQUIRY\n\n${emailEntries.join('\n')}`

      // Use FormSubmit service to send email directly to both recipients
      const formData = new FormData()
      formData.append('email', part1Data.email)
      formData.append('name', `${part1Data.firstName} ${part1Data.lastName}`)
      formData.append(
        'subject',
        `7Sisters Farm - Inquiry from ${part1Data.firstName} ${part1Data.lastName}`,
      )
      formData.append('message', emailBody)
      formData.append('_cc', part1Data.email)
      formData.append('_replyto', part1Data.email)
      formData.append('_template', 'box')
      formData.append('_captcha', 'false')
      formData.append(
        '_autoresponse',
        `Thank you for your inquiry to 7Sisters Farm, ${part1Data.firstName}! We've received your information and will be in touch soon.`,
      )

      const response1 = await fetch('https://formsubmit.co/ajax/dustin@mayfieldjones.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      const formData2 = new FormData()
      formData2.append('email', part1Data.email)
      formData2.append('name', `${part1Data.firstName} ${part1Data.lastName}`)
      formData2.append(
        'subject',
        `7Sisters Farm - Inquiry from ${part1Data.firstName} ${part1Data.lastName}`,
      )
      formData2.append('message', emailBody)
      formData2.append('_cc', part1Data.email)
      formData2.append('_replyto', part1Data.email)
      formData2.append('_template', 'box')
      formData2.append('_captcha', 'false')

      const response2 = await fetch(
        'https://formsubmit.co/ajax/karenmayfieldjones@gmail.com',
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData2,
        },
      )

      const result1 = await response1.json()
      const result2 = await response2.json()

      const needsVerification =
        result1.message?.includes('verify') ||
        result2.message?.includes('verify') ||
        result1.message?.includes('confirmation') ||
        result2.message?.includes('confirmation')

      if (response1.ok && result1.success && response2.ok && result2.success) {
        setPart1Submitted(true)
        setSubmitStatus('success')
        setIsSubmitting(false)
      } else if (needsVerification) {
        setPart1Submitted(true)
        setSubmitStatus('success')
        setIsSubmitting(false)
        console.log('Verification emails have been sent. Please check your inbox.')
      } else if ((response1.ok && result1.success) || (response2.ok && result2.success)) {
        setPart1Submitted(true)
        setSubmitStatus('success')
        setIsSubmitting(false)
      } else {
        const errorMsg = result1.message || result2.message || 'Failed to send email'
        console.error('FormSubmit error:', errorMsg, result1, result2)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error sending form:', error)
      setSubmitStatus('error')
      setIsSubmitting(false)
    }
  }

  if (part1Submitted) {
    return (
      <div className="contact-form-container">
        <div className="part1-success">
          <h2>Thank you for your interest!</h2>
          <p>
            We've received your inquiry and will review your information. We'll be in touch
            soon to discuss next steps.
          </p>
          <p>
            <a href="/PlacementProcess">Read our placement process</a> to see what happens
            next.
          </p>
          <p className="skip-note" style={{ marginTop: '1.5rem' }}>
            <a href="/">Return to homepage</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="contact-form-container">
      <form onSubmit={handlePart1Submit} className="contact-form">
        <div className="form-section">
          <h2 className="form-section-title">Contact Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={part1Data.firstName || ''}
                onChange={handlePart1Change}
                className={part1Errors.firstName ? 'error' : ''}
                required
              />
              {part1Errors.firstName && (
                <span className="error-message">{part1Errors.firstName}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={part1Data.lastName || ''}
                onChange={handlePart1Change}
                className={part1Errors.lastName ? 'error' : ''}
                required
              />
              {part1Errors.lastName && (
                <span className="error-message">{part1Errors.lastName}</span>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={part1Data.email || ''}
                onChange={handlePart1Change}
                className={part1Errors.email ? 'error' : ''}
                required
              />
              {part1Errors.email && <span className="error-message">{part1Errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">
                Phone <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={part1Data.phone || ''}
                onChange={handlePart1Change}
                className={part1Errors.phone ? 'error' : ''}
                required
              />
              {part1Errors.phone && <span className="error-message">{part1Errors.phone}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={part1Data.city || ''}
                onChange={handlePart1Change}
                className={part1Errors.city ? 'error' : ''}
                required
              />
              {part1Errors.city && <span className="error-message">{part1Errors.city}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="state">
                State <span className="required">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={part1Data.state || ''}
                onChange={handlePart1Change}
                className={part1Errors.state ? 'error' : ''}
                required
              />
              {part1Errors.state && <span className="error-message">{part1Errors.state}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Basic Information</h2>
          <div className="form-group">
            <label htmlFor="timeline">When are you hoping to bring a puppy home?</label>
            <select
              id="timeline"
              name="timeline"
              value={part1Data.timeline || ''}
              onChange={handlePart1Change}
            >
              <option value="">Select...</option>
              <option value="immediately">Immediately (if available)</option>
              <option value="1-3-months">1-3 months</option>
              <option value="4-6-months">4-6 months</option>
              <option value="6-12-months">6-12 months</option>
              <option value="12+months">12+ months</option>
              <option value="flexible">Flexible - waiting for the right match</option>
            </select>
          </div>
          <div className="form-group">
            <label>What is the purpose for this dog? (Select all that apply)</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="purposeCompanion"
                  checked={part1Data.purposeCompanion}
                  onChange={handlePart1Change}
                />
                <span>Companion/Pet</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="purposeShow"
                  checked={part1Data.purposeShow}
                  onChange={handlePart1Change}
                />
                <span>Show/Conformation (actively planning to show)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="purposeOpenToShows"
                  checked={part1Data.purposeOpenToShows}
                  onChange={handlePart1Change}
                />
                <span>Open to shows/conformation (may consider in the future)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="purposeBreeding"
                  checked={part1Data.purposeBreeding}
                  onChange={handlePart1Change}
                />
                <span>Breeding (with contract)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="purposeTherapy"
                  checked={part1Data.purposeTherapy}
                  onChange={handlePart1Change}
                />
                <span>Therapy/Service work</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="purposeDogSports"
                  checked={part1Data.purposeDogSports}
                  onChange={handlePart1Change}
                />
                <span>Dog sports (Agility, Obedience, Rally, etc.)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="purposeOther"
                  checked={part1Data.purposeOther}
                  onChange={handlePart1Change}
                />
                <span>Other purpose</span>
              </label>
            </div>
            {part1Data.purposeDogSports && (
              <div
                className="form-group"
                style={{
                  marginTop: '0.75rem',
                  marginLeft: '1.5rem',
                  paddingLeft: '1rem',
                  borderLeft: '3px solid #bf141c',
                }}
              >
                <label
                  htmlFor="purposeDogSportsDetails"
                  style={{ fontSize: '0.95rem', fontWeight: '500' }}
                >
                  Which dog sports? (optional)
                </label>
                <input
                  type="text"
                  id="purposeDogSportsDetails"
                  name="purposeDogSportsDetails"
                  value={part1Data.purposeDogSportsDetails || ''}
                  onChange={handlePart1Change}
                  placeholder="e.g., Agility, Obedience, Rally, Dock diving..."
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            )}
            {part1Data.purposeOther && (
              <div
                className="form-group"
                style={{
                  marginTop: '0.75rem',
                  marginLeft: '1.5rem',
                  paddingLeft: '1rem',
                  borderLeft: '3px solid #bf141c',
                }}
              >
                <label
                  htmlFor="purposeOtherDetails"
                  style={{ fontSize: '0.95rem', fontWeight: '500' }}
                >
                  Please specify other purpose
                </label>
                <input
                  type="text"
                  id="purposeOtherDetails"
                  name="purposeOtherDetails"
                  value={part1Data.purposeOtherDetails || ''}
                  onChange={handlePart1Change}
                  placeholder="Describe other purpose..."
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>What types of dogs have you owned? (Select all that apply)</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="previousDogsGreatDane"
                  checked={part1Data.previousDogsGreatDane}
                  onChange={handlePart1Change}
                />
                <span>Great Dane(s)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="previousDogsExtraLarge"
                  checked={part1Data.previousDogsExtraLarge}
                  onChange={handlePart1Change}
                />
                <span>
                  Other Extra Large breed(s) - e.g., Mastiff, Saint Bernard, Newfoundland, Great
                  Pyrenees
                </span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="previousDogsLarge"
                  checked={part1Data.previousDogsLarge}
                  onChange={handlePart1Change}
                />
                <span>
                  Large breed(s) - e.g., German Shepherd, Labrador, Golden Retriever, Boxer
                </span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="previousDogsMedium"
                  checked={part1Data.previousDogsMedium}
                  onChange={handlePart1Change}
                />
                <span>
                  Medium breed(s) - e.g., Border Collie, Australian Shepherd, Beagle, Bulldog
                </span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="previousDogsSmall"
                  checked={part1Data.previousDogsSmall}
                  onChange={handlePart1Change}
                />
                <span>
                  Small breed(s) - e.g., Dachshund, Cocker Spaniel, French Bulldog, Poodle
                </span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="previousDogsNone"
                  checked={part1Data.previousDogsNone}
                  onChange={handlePart1Change}
                />
                <span>No, this would be my first dog</span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="questions">Questions for us</label>
            <textarea
              id="questions"
              name="questions"
              value={part1Data.questions || ''}
              onChange={handlePart1Change}
              rows={4}
              placeholder="Any questions about our breeding program, health testing, contracts, etc."
            />
          </div>
          <div className="form-group">
            <label htmlFor="howDidYouHear">Primary way you heard about us?</label>
            <select
              id="howDidYouHear"
              name="howDidYouHear"
              value={part1Data.howDidYouHear || ''}
              onChange={handlePart1Change}
              style={{
                appearance: 'auto',
                WebkitAppearance: 'menulist',
                MozAppearance: 'menulist',
              }}
            >
              <option value="">Select...</option>
              <option value="website">Website</option>
              <option value="tiktok">TikTok</option>
              <option value="referral">Referral from another family</option>
              <option value="show">Dog show</option>
              <option value="search">Internet search</option>
              <option value="gdca">Great Dane Club of America</option>
              <option value="social-media">Social media</option>
              <option value="other">Other</option>
            </select>
            {part1Data.howDidYouHear && (
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#666',
                  fontStyle: 'italic',
                }}
              >
                Selected: {getHowDidYouHearText(part1Data.howDidYouHear)}
              </p>
            )}
          </div>
        </div>

        <div className="form-submit-section">
          {submitStatus === 'error' && (
            <div className="error-message-box">
              <p>
                <strong>There was an error submitting your inquiry.</strong>
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                This might be because the email addresses need to be verified with FormSubmit
                first. Please check the inboxes for{' '}
                <strong>dustin@mayfieldjones.com</strong> and{' '}
                <strong>karenmayfieldjones@gmail.com</strong> for verification emails, or email
                us directly at <a href="mailto:dustin@mayfieldjones.com">dustin@mayfieldjones.com</a>
              </p>
            </div>
          )}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
          </button>
          <p className="form-note">
            We'll review your inquiry and follow up with you soon to discuss next steps.
          </p>
        </div>
      </form>
    </div>
  )
}
