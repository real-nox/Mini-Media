import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { CommentsAdd, CommentsDelete, CommentsGet, LikePost, modeApi, PostDelete, PostPut, postsList } from "../controllers/api.controler.js"
import { authRate, commentsRate, postsRate } from "../middlewares/rate-limit.js"

const api = Router()

api.post("/api/modes/toggle", authRate, modeApi)

api.get("/api/posts", authU, postsList)

api.post("/api/post/:post/like", authU, LikePost)

api.get("/api/post/:post/comments", authU, CommentsGet)

api.post("/api/post/:post/comments", commentsRate, authU, CommentsAdd)

api.get("/api/user", authU, (req, res) => {
    if (req.user)
        return res.json(req.user.user_id)
})

api.delete("/api/comments/:post/:author_id", commentsRate, authU, CommentsDelete)

api.delete("/api/posts/:post", postsRate, authU, PostDelete)

api.put("/api/posts/:post", postsRate, authU, PostPut)

export default api