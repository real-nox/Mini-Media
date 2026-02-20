import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { LikePost, modeApi, postLikes, postOwner, postsList } from "../controllers/api.controler.js"

const api = Router()

api.get("/api/modes/toggle", modeApi)

api.get("/api/posts", authU, postsList)

api.get("/api/likes/:post", authU, postLikes)

api.get("/api/post/:owner", authU, postOwner)

api.get("/api/post/like/:post", authU, LikePost)

export default api