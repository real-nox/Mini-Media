import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { modes } from "../middlewares/user_login.js"

const userR = Router()

userR.get("/:username", modes, authU, (req, res) => {
    const user = req.user
    res.render("user/profile", {user})
})

export default userR