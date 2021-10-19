import { isEmailBurner } from 'burner-email-providers'
import { minMispelledLevensteinDistance, popularEmailProviders } from './email.constants'
import levenshtein from 'fast-levenshtein'
import dns from 'dns'

export type EmailValidationResult = {
  // whether the email is a temporary email address from a throw away email service
  temp: boolean
  // true if the email is a likely misspelling of a popular email service like gmail, hotmail, send back what we think it should be
  misspelled: boolean
  // if misspelled is false then this is null, if it is true, then return what we think the correct spelling should be.
  autocorrect: null | string
  // whether the email is invalid, we will do this by checking the DNS MX records
  invalid: boolean
}

export const checkEmail = async (email: string): Promise<EmailValidationResult> => {
  const isValid = validateEmail(email)

  let autocorrect: null | string = null
  let isValidDNS = false

  if (isValid) {
    const [emailName, domain] = email.split('@')
    const suggested = popularEmailProviders.find(
      provider => levenshtein.get(domain, provider) <= minMispelledLevensteinDistance
    )
    if (suggested && suggested !== domain) {
      autocorrect = `${emailName}@${suggested}`
    }

    try {
      await dns.promises.resolve(domain, 'MX')
      isValidDNS = true
    } catch (error) {
      isValidDNS = false
    }
  }

  return {
    temp: isValid ? isEmailBurner(email) : false,
    misspelled: Boolean(autocorrect),
    autocorrect,
    invalid: !isValid || !isValidDNS,
  }
}

// from here: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toLowerCase())
}
