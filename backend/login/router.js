import { Router } from 'express'

import signIn from './login-model.js'
const router = Router()

router.post('/login', signIn)


export default router