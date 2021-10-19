import { Handler } from 'express'
import { z } from 'zod'
import * as service from './email.service'

const checkEmailSchema = z.object({
  email: z.string(),
})

export const checkEmail: Handler = async (req, res) => {
  const { email } = checkEmailSchema.parse(req.body)

  const result = await service.checkEmail(email)

  res.send(result)
}
