import auth from '../app/auth.js'
import { Router } from 'express'
import * as GroupMembers from './GroupMember-model.js'

const router = Router()

    router.get("/getGroupsByMember",auth,GroupMembers.getGroupsByMemberFromToken)
    router.post("/addMember",auth,GroupMembers.addMemberToGroup)
    router.put("/updateMember",auth,GroupMembers.updateGroupMember)
    router.delete("/removeMember",auth,GroupMembers.RemoveMember)

export default router;