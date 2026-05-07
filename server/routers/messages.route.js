import { Router } from "express"
import { auth } from "../middlewares/sessions.js"

const messagesR = Router()

messagesR.get("/messages/direct", auth, (req, res) => {
    res.send("Hello")
})

export default messagesR