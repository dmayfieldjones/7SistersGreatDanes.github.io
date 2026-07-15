export function timeSincePastDate(
  pastDateString: string | Date,
  endDate: Date = new Date(),
) {
  const pastDate = new Date(pastDateString)
  pastDate.setUTCHours(0, 0, 0, 0)

  const now = new Date(endDate)
  now.setUTCHours(0, 0, 0, 0)

  const differenceInMilliseconds = now.getTime() - pastDate.getTime()

  if (differenceInMilliseconds < 0) {
    return 'Please select a date after the birth date.'
  }

  let years = 0
  const tempDate = new Date(pastDate)
  while (tempDate < now) {
    tempDate.setUTCFullYear(tempDate.getUTCFullYear() + 1)
    if (tempDate <= now) {
      years++
    } else {
      tempDate.setUTCFullYear(tempDate.getUTCFullYear() - 1)
      break
    }
  }

  let months = 0
  const tempDateMonths = new Date(tempDate)
  while (tempDateMonths < now) {
    tempDateMonths.setUTCMonth(tempDateMonths.getUTCMonth() + 1)
    if (tempDateMonths <= now) {
      months++
    } else {
      tempDateMonths.setUTCMonth(tempDateMonths.getUTCMonth() - 1)
      break
    }
  }

  const remainingMilliseconds = now.getTime() - tempDateMonths.getTime()
  const days = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24))

  let resultString = ''
  if (years > 0) {
    resultString += `${years} year${years > 1 ? 's' : ''}, `
  }
  if (months > 0) {
    resultString += `${months} month${months > 1 ? 's' : ''}, `
  }
  if (days >= 0) {
    resultString += `${days} day${days !== 1 ? 's' : ''}`
  }

  if (resultString.endsWith(', ')) {
    resultString = resultString.slice(0, -2)
  }

  return resultString || '0 days'
}
