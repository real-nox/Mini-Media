import { Router } from "express"
import { authU } from "../middlewares/sessions.js"

const userR = Router()

userR.get("/:username", authU, (req, res) => {
    const user = req.user
    res.render("user/profile", {user})
})

export default userR