import { Router } from "express";
import * as Shared from "./Share-model.js";
import auth from '../app/auth.js'

const router = Router();
router.get("/sharedWith", auth,Shared.getSharedWithUserNotesFromToken);
router.get("/sharedBy", auth,Shared.getSharedByUserNotesFromToken);
router.post("/shares", auth,Shared.ShareNewNoteWithToken);

export default router;