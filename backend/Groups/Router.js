import auth from "../app/auth.js"
import { Router } from 'express'
import * as groups from './Group-Model.js'

const router = Router()

router.get('/admGetGroup/:GroupId', auth, groups.getGroupById)
router.get('/admGetGroups', auth, groups.getGroups)
router.get('/GroupMembers/:GroupId',auth, groups.getGroupMembersByGroupId)
router.get('/GetOwnedGroups', auth, groups.getOwnedGroupsFromToken)
router.post('/newGroup', auth, groups.createGroup)
router.put('/updateGroup/:GroupId', auth, groups.UpdateGroup)
router.delete('/deleteGroup/:GroupId', auth, groups.DeleteGroup)

export default router;