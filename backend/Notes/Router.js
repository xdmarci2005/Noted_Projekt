import { Router } from 'express'
import * as notes from './Notes-model.js'
import auth from '../app/auth.js'

const router = Router()

router.get('/getNotes', auth, notes.getNotesFromToken)
router.get('/getNote/:JegyzetId', auth, notes.getNoteById)
router.get('/getNoteByName/:Name',auth,notes.getPublicNotesByName)
router.post('/saveNote/:JegyzetId', auth, notes.saveNoteWithToken)
router.delete('/deleteNote/:JegyzetId', auth, notes.deleteNoteById)
export default router
