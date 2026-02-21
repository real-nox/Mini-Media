import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { LikePost, modeApi, postsList } from "../controllers/api.controler.js"

const api = Router()

api.post("/api/modes/toggle", modeApi)

api.get("/api/posts", authU, postsList)

api.post("/api/post/like/:post", authU, LikePost)

export default api