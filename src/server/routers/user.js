import { Router } from "express"
import { auth } from "../middlewares/sessions.js"
import { modes } from "../middlewares/user_login.js"
import { UpdateUser, User } from "../controllers/user.controler.js"
import { asyncHandler } from "../middlewares/errorsHandler.js"

const userR = Router()

userR.get("/:username", modes, auth, asyncHandler(User))

userR.patch("/user/update", auth, asyncHandler(UpdateUser))

export default userR