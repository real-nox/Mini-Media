import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { CommentsAdd, CommentsGet, LikePost, modeApi, postsList } from "../controllers/api.controler.js"

const api = Router()

api.post("/api/modes/toggle", modeApi)

api.get("/api/posts", authU, postsList)

api.post("/api/post/:post/like", authU, LikePost)

api.get("/api/post/:post/comments", authU, CommentsGet)

api.post("/api/post/:post/comments", authU, CommentsAdd)

export default api