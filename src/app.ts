import express, { Request, Response, NextFunction } from 'express'
import { AppError } from './types'
import * as emailController from './email/email.controller'
import 'express-async-errors'

const app = express()

app.use(express.json())

app.post('/check', emailController.checkEmail)

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  })
})

export default app
