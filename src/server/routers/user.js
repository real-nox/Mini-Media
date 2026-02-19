import { Router } from "express"
import { authS } from "../middlewares/sessions.js"

const userR = Router()

userR.get("/users/:username", authS, (req, res) => {
    res.render("user/profile")
})

export default userR