import {Router} from "express"
import { authU } from "../middlewares/sessions.js"
import { postCreate, PostDelete, PostPut } from "../controllers/posts.controler.js"
import { modes } from "../middlewares/user_login.js"
import { postsRate } from "../middlewares/rate-limit.js"
import { asyncHandler } from "../middlewares/errorsHandler.js"

const postR = Router()

postR.post("/posts/create", authU, modes, asyncHandler(postCreate))

postR.delete("/posts/:post", postsRate, asyncHandler(PostDelete))

postR.put("/posts/:post", postsRate, asyncHandler(PostPut))

export default postR