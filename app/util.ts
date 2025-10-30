export function timeSincePastDate(pastDateString: string | Date, endDate: Date = new Date()) {
  // Create Date objects for the past date and the current time
  const pastDate = new Date(pastDateString)
  // Set both dates to start of day to avoid time differences
  pastDate.setHours(0, 0, 0, 0)
  const now = new Date(endDate)
  now.setHours(0, 0, 0, 0)

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = now.getTime() - pastDate.getTime()

  if (differenceInMilliseconds < 0) {
    return 'Please select a date after the birth date.'
  }

  // Calculate the number of full years
  let years = 0
  let tempDate = new Date(pastDate)
  while (tempDate < now) {
    tempDate.setFullYear(tempDate.getFullYear() + 1)
    if (tempDate <= now) {
      years++
    } else {
      tempDate.setFullYear(tempDate.getFullYear() - 1) // Revert the last increment
      break
    }
  }

  // Calculate the remaining time after accounting for full years
  let remainingMilliseconds = now.getTime() - tempDate.getTime()

  // Calculate the number of full months
  let months = 0
  let tempDateMonths = new Date(tempDate)
  while (tempDateMonths < now) {
    tempDateMonths.setMonth(tempDateMonths.getMonth() + 1)
    if (tempDateMonths <= now) {
      months++
    } else {
      tempDateMonths.setMonth(tempDateMonths.getMonth() - 1) // Revert the last increment
      break
    }
  }

  // Calculate the remaining time after accounting for full months
  remainingMilliseconds = now.getTime() - tempDateMonths.getTime()

  // Calculate the number of full days
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

  // Remove the trailing comma and space if present
  if (resultString.endsWith(', ')) {
    resultString = resultString.slice(0, -2)
  }

  return resultString || '0 days'
}
