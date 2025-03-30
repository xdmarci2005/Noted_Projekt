import { Router } from "express";
import * as Shared from "./Share-model.js";
import auth from '../app/auth.js'

const router = Router();
router.get("/sharedWithUser", auth,Shared.getSharedWithUserNotesFromToken);
router.get("/sharedWithGroup/:MegosztottCsopId", auth,Shared.getSharedWithGroupNotesFromToken);
router.get("/sharesBy", auth,Shared.getSharedByUserNotesFromToken);
router.post("/newShare", auth,Shared.ShareNewNoteWithToken);
router.put("/updateShare", auth,Shared.UpdateSharePermissions);
router.delete("/deleteShare", auth,Shared.DeleteShare);

export default router;