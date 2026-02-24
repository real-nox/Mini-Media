import { Router } from "express"
import { authU } from "../middlewares/sessions.js"
import { CommentsAdd, CommentsDelete, CommentsGet, generateURL, getURL, LikePost, modeApi, postsList } from "../controllers/api.controler.js"
import { authRate, commentsRate, postsRate } from "../middlewares/rate-limit.js"
import { asyncHandler } from "../middlewares/errorsHandler.js"

const api = Router()

api.use(authU)
api.post("/api/modes/toggle", authRate, modeApi)

api.get("/api/posts", asyncHandler(postsList))

api.post("/api/post/:post/like", modeApi, asyncHandler(LikePost))

api.get("/api/post/:post/comments", asyncHandler(CommentsGet))

api.post("/api/post/:post/comments", commentsRate, modeApi, asyncHandler(CommentsAdd))

api.get("/api/user", (req, res) => {
    if (req.user)
        return res.json(req.user.user_id)
})

api.delete("/api/comments/:post", commentsRate, asyncHandler(CommentsDelete))

api.post("/api/files/upload", postsRate, asyncHandler(generateURL))

api.post("/api/file/URL", asyncHandler(getURL))

export default api