import express from 'express'
import payload from 'payload'
import { InitOptions } from 'payload/config'
import { seed } from './seed'


require('dotenv').config()
const app = express()

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

export const start = async (args?: Partial<InitOptions>) => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
    ...(args || {}),
  })

  // Add your own express routes here

  if (process.env.PAYLOAD_SEED === 'true') {
    payload.logger.info('---- SEEDING DATABASE ----')
    await seed(payload)
  }

  app.listen(3000)
}

start()
