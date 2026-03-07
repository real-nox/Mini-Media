import { Router } from "express"
import { auth } from "../middlewares/sessions.js"
import { modes } from "../middlewares/user_login.js"
import { Getfollowers, Getfollowings, GetUser, UpdateUser, User } from "../controllers/user.controler.js"
import { asyncHandler } from "../middlewares/errorsHandler.js"
import { Following } from "../controllers/api.controler.js"

const userR = Router()

userR.use(auth)

userR.get("/:username", modes, asyncHandler(User))

userR.patch("/user/update", asyncHandler(UpdateUser))

userR.post("/user/followings", asyncHandler(Getfollowings))

userR.post("/user/followers", asyncHandler(Getfollowers))

userR.post("/user/getUser", asyncHandler(GetUser))

userR.post("/user/follow_unfollow", asyncHandler(Following))

export default userR