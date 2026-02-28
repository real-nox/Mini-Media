import ErrorHandler from "../middlewares/errorsHandler.js"
import * as apiServices from "../services/api.services.js"

export const modeApi = (req, res, next) => {
    let mode = "light"
    if (!req.cookies.ssmodes) {
        res.cookie("ssmodes", "dark")
    }

    if (req.cookies.ssmodes && req.cookies.ssmodes === "dark") {
        res.clearCookie("ssmodes")
        res.cookie("ssmodes", "light", {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
            httpOnly: true
        })
    } else {
        mode = "dark"
        res.clearCookie("ssmodes")
        res.cookie("ssmodes", "dark", {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
            httpOnly: true
        })
    }

    return res.json(mode)
}

export const getmodeApi = (req, res, next) => {
    let mode = "light"
    if (!req.cookies.ssmodes) {
        res.cookie("ssmodes", "dark")
    }

    if (req.cookies.ssmodes && req.cookies.ssmodes === "dark")
        mode = "dark"

    return res.json(mode)
}

export const postsList = async (req, res, next) => {
    const limit = req.query?.limit

    if (!limit)
        throw new ErrorHandler("Inspecified limit", 400)

    const list = await apiServices.Lposts(limit)

    if (!list)
        throw new ErrorHandler("Infound posts", 500)

    return res.json(list)
}

export const postLikes = async (req, res, next) => {
    const post_id = req.params.post

    if (!post_id)
        throw new ErrorHandler("Inspecified post_id", 403)

    const likes = await apiServices.LikesPost(post_id)

    if (!likes)
        throw new ErrorHandler("Infound likes", 500)

    return res.json(likes)
}

export const postOwner = async (req, res, next) => {
    const post_owner_id = req.params.owner

    if (!post_owner_id)
        throw new ErrorHandler("Inspecified owner_id", 403)

    const owner = await apiServices.OwnerPost(post_owner_id)

    if (!owner)
        throw new ErrorHandler("Infound owner", 500)

    return res.json(owner)
}

export const LikePost = async (req, res, next) => {
    const post_id = req.params.post
    const liker = req.user.user_id

    if (!post_id || !liker)
        throw new ErrorHandler("Inspecified post_id/liker", 400)

    const result = await apiServices.Like(liker, post_id)

    return res.json(result)
}

export const CommentsGet = async (req, res, next) => {
    const post_id = req.params.post
    const limit = parseInt(req.query.limit) || null
    const cursor = req.query.cursor || null

    if (!post_id)
        throw new ErrorHandler("Inspecified post_id", 400)

    const result = await apiServices.Getcomments(post_id, limit, cursor)

    return res.json(result)
}

export const CommentsAdd = async (req, res, next) => {
    const post_id = req.params.post
    const user = req.user
    const content = req.body.content

    if (!post_id || !user || !content)
        throw new ErrorHandler("Inspecified post_id/user_id/content", 400)

    const result = await apiServices.AddComment(post_id, user.user_id, content)

    return res.json({ post_id, user: user, content, result })
}

export const CommentsDelete = async (req, res, next) => {
    const post_id = req.params.post
    const user_id = req.params.author_id
    const comment_author_id = req.body.author_id

    if (!post_id || !user_id || !comment_author_id)
        throw new ErrorHandler("Inspecified post_id/user_id", 400)

    const result = await apiServices.DeleteComment(post_id, user_id)

    return res.json(result)
}

export const generateURL = async (req, res, next) => {
    const file = req.body

    if (!file)
        throw new ErrorHandler("No file was provided!", 400)

    const type = file?.type
    const path = file?.path

    console.log(type, path)
    if (!type && !path)
        throw new ErrorHandler("No file was provided!", 400)

    const result = await apiServices.GenerateURLFile(type, path)

    return res.json(result)
}

export const getURL = async (req, res, next) => {
    const path = req.body?.path

    if (!path)
        throw new ErrorHandler("No path was provided!", 400)

    const folder = req.body?.folder

    if (!folder)
        throw new ErrorHandler("No folder was provided!", 400)


    const result = await apiServices.GetPublicURL(path, folder)

    return res.json(result)
}

export const DeleteAvatar = async (req, res, next) => {
    const user_id = req.body?.user_id

    if (!user_id)
        throw new ErrorHandler("Unfound user ID", 400)

    const currentUserID = req.user?.user_id

    if (user_id !== currentUserID)
        throw new ErrorHandler("Unauthorized!", 400)

    await apiServices.deleteAvatar(user_id)
    return res.json("perfect!")
}