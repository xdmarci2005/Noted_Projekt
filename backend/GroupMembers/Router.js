import auth from '../app/auth.js'
import { Router } from 'express'
import * as GroupMembers from './GroupMember-model.js'

const router = Router()
/*
    router.get("/getGroupsByMember,auth,GroupMembers.getGroupsByMember")
    router.post("/addMember",auth,GroupMembers.AddNewMember)
    router.put("/updateMember",auth,GroupMembers.UpdateMember)
    router.delete("/deleteMember",auth,GroupMemebers.RemoveMember)
*/
export default router;