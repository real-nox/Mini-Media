import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { CommentsAdd, CommentsDelete, CommentsGet, generateURL, getURL, LikePost, modeApi, PostDelete, PostPut, postsList } from "../controllers/api.controler.js"
import { authRate, commentsRate, postsRate } from "../middlewares/rate-limit.js"
import { asyncHandler } from "../middlewares/errorsHandler.js"

const api = Router()

api.post("/api/modes/toggle", authRate, modeApi)

api.get("/api/posts", authU, asyncHandler(postsList))

api.post("/api/post/:post/like", authU, modeApi, asyncHandler(LikePost))

api.get("/api/post/:post/comments", authU, asyncHandler(CommentsGet))

api.post("/api/post/:post/comments", commentsRate, authU, modeApi, asyncHandler(CommentsAdd))

api.get("/api/user", authU, (req, res) => {
    if (req.user)
        return res.json(req.user.user_id)
})

api.delete("/api/comments/:post", commentsRate, authU, asyncHandler(CommentsDelete))

api.delete("/api/posts/:post", postsRate, authU, asyncHandler(PostDelete))

api.put("/api/posts/:post", postsRate, authU, asyncHandler(PostPut))

api.post("/api/files/upload", authU, postsRate, asyncHandler(generateURL))

api.post("/api/file/URL", authU, asyncHandler(getURL))

export default api