import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { modes } from "../middlewares/user_login.js"
import { PublicAvatarURL, UpdateUser, User } from "../controllers/user.controler.js"

const userR = Router()

userR.get("/:username", modes, authU, User)

userR.post("/user/avatar", authU, PublicAvatarURL)
userR.patch("/user/update", authU, UpdateUser)

export default userR