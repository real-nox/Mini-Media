import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { CommentsAdd, CommentsDelete, CommentsGet, LikePost, modeApi, PostDelete, PostPut, postsList } from "../controllers/api.controler.js"

const api = Router()

api.post("/api/modes/toggle", modeApi)

api.get("/api/posts", authU, postsList)

api.post("/api/post/:post/like", authU, LikePost)

api.get("/api/post/:post/comments", authU, CommentsGet)

api.post("/api/post/:post/comments", authU, CommentsAdd)

api.get("/api/user", authU, (req, res) => {
    if (req.user)
        return res.json(req.user.user_id)
})

api.delete("/api/comments/:post/:author_id", authU, CommentsDelete)

api.delete("/api/posts/:post/delete", authU, PostDelete)

api.put("/api/posts/:post/edit", authU, PostPut)

export default api