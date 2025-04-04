import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import userRouter from "../user/router.js"
import loginRouter from "../login/router.js"
import notesRouter from "../Notes/Router.js"
import sharesRouter from "../Shares/router.js"
import groupRouter from "../Groups/Router.js"
import GroupMembersRouter from "../GroupMembers/Router.js"
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRouter)
app.use('/', loginRouter)
app.use('/', notesRouter)
app.use('/', sharesRouter)
app.use('/', groupRouter);
app.use('/', GroupMembersRouter)

export default app;  