import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { modes } from "../middlewares/user_login.js"
import { User } from "../controllers/user.controler.js"

const userR = Router()

userR.get("/:username", modes, authU, User)

export default userR