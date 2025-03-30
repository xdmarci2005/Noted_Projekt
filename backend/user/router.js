import { Router } from 'express'
import * as user from './user-model.js'
import auth from '../app/auth.js'

const router = Router()

router.post('/register', user.Register)
router.get('/getUser', auth, user.getUserFromToken)
//router.get('/getUser/:Name', auth,)
router.put('/updateuser', auth, user.updateUserWithToken)
//Admin Műveletek
router.get('/Admgetuserbyid/:UserId', auth, user.getUserByIdAdmin)
router.get('/Admgetusers', auth, user.getUsersAdmin)
router.put('/Admupdateuser/:UserId', auth, user.updateUserByIdAdmin)
router.delete('/Admdeleteuser/:UserId', auth, user.deleteUserByIdAdmin)

export default router
