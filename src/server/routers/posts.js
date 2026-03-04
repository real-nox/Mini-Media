import {Router} from "express"
import { auth } from "../middlewares/sessions.js"
import { postCreate, PostDelete, PostPut } from "../controllers/posts.controler.js"
import { modes } from "../middlewares/user_login.js"
import { postsRate } from "../middlewares/rate-limit.js"
import { asyncHandler } from "../middlewares/errorsHandler.js"

const postR = Router()

postR.use(auth)
postR.use(postsRate)

postR.post("/posts/create", modes, asyncHandler(postCreate))

postR.delete("/posts/:post", asyncHandler(PostDelete))

postR.put("/posts/:post", asyncHandler(PostPut))

export default postR