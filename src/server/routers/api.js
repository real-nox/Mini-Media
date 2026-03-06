import { Router } from "express"
import { auth } from "../middlewares/sessions.js"
import { CommentsAdd, CommentsDelete, CommentsGet, DeleteAvatar, Followed, Following, generateURL, getURL, LikePost, modeApi, postsList } from "../controllers/api.controler.js"
import { authRate, commentsRate, followingRate, likesRate, postsRate } from "../middlewares/rate-limit.js"
import { asyncHandler } from "../middlewares/errorsHandler.js"

const api = Router()

api.use(auth)
api.post("/api/modes/toggle", authRate, modeApi)

api.get("/api/posts", asyncHandler(postsList))

api.post("/api/post/:post/like", likesRate, asyncHandler(LikePost))

api.get("/api/post/:post/comments", asyncHandler(CommentsGet))

api.post("/api/post/:post/comments", commentsRate, asyncHandler(CommentsAdd))

api.get("/api/user", (req, res) => {
    if (req.user)
        return res.json(req.user.user_id)
})

api.delete("/api/comments/:post", commentsRate, asyncHandler(CommentsDelete))

api.post("/api/files/upload", postsRate, asyncHandler(generateURL))

api.post("/api/file/URL", asyncHandler(getURL))

api.post("/api/file/delete", asyncHandler(DeleteAvatar))

api.post("/api/post/followed", asyncHandler(Followed))

api.post("/api/post/un_follow", followingRate, asyncHandler(Following))

export default api