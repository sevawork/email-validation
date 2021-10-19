import { checkEmail } from './email.service'
import dns from 'dns'

jest.mock('dns', () => ({
  promises: {
    resolve: jest.fn(),
  },
}))

const mockedResolveDNS = dns.promises.resolve as jest.MockedFunction<typeof dns.promises.resolve>

describe('checkEmail', () => {
  it('should set temp to true if email domain is known as temporary', async () => {
    const { temp } = await checkEmail('email@temp-mail.org')
    expect(temp).toBe(true)
  })

  it('should set temp to false if email domain is not temporary', async () => {
    const { temp } = await checkEmail('email@gmail.com')
    expect(temp).toBe(false)
  })

  it('should set misspelled to true and set autocorrect value for misspelled email', async () => {
    const { misspelled, autocorrect } = await checkEmail('email@hatmail.co.up')
    expect(misspelled).toBe(true)
    expect(autocorrect).toBe('email@hotmail.co.uk')
  })

  it("should set misspelled to false and autocorrect to null when we can't recognize email", async () => {
    const { misspelled, autocorrect } = await checkEmail('email@hatmall.co.up')
    expect(misspelled).toBe(false)
    expect(autocorrect).toBe(null)
  })

  it('should set invalid to true for incorrect email without checking DNS', async () => {
    const { invalid } = await checkEmail('lalala')
    expect(mockedResolveDNS).not.toBeCalled()
    expect(invalid).toBe(true)
  })

  it('should set invalid to true if can not resolve DNS', async () => {
    mockedResolveDNS.mockRejectedValueOnce(new Error('Address not found'))

    const { invalid } = await checkEmail('email@mail.com')
    expect(invalid).toBe(true)
  })
})
