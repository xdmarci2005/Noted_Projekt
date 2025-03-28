import { Router } from "express";
import * as Shared from "./Share-model.js";
import auth from '../app/auth.js'

const router = Router();
router.get("/sharedWith", auth,Shared.getSharedWithUserNotesFromToken);
router.get("/sharedBy", auth,Shared.getSharedByUserNotesFromToken);
router.post("/newShare", auth,Shared.ShareNewNoteWithToken);
router.put("/updateShare", auth,Shared.UpdateSharePermissions);
router.delete("/deleteShare", auth,Shared.DeleteShare);

export default router;