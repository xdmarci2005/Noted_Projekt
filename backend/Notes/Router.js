import { Router } from 'express'
import * as notes from './Notes-model.js'
import auth from '../app/auth.js'

const router = Router()

router.get('/getNotes', auth, notes.getNotesFromToken)
router.get('/getNote/:JegyzetId', auth, notes.getNoteById)
router.post('/createNote', auth, notes.createNoteWithToken)
router.put('/updateNote/:JegyzetId', auth, notes.updateNoteById)
router.delete('/deleteNote/:JegyzetId', auth, notes.deleteNoteById)
export default router
