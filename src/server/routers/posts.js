import {Router} from "express"
import { authU } from "../middlewares/sessions.js"
import { postCreate } from "../controllers/posts.controler.js"
import { modes } from "../middlewares/user_login.js"

const postR = Router()

postR.post("/create-post", modes, authU, postCreate)

export default postR