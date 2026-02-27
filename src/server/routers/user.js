import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { modes } from "../middlewares/user_login.js"
import { UpdateUser, User } from "../controllers/user.controler.js"
import { asyncHandler } from "../middlewares/errorsHandler.js"

const userR = Router()

userR.get("/:username", modes, authU, asyncHandler(User))

userR.patch("/user/update", authU, asyncHandler(UpdateUser))

export default userR