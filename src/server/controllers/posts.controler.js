import ErrorHandler from "../middlewares/errorsHandler.js"
import * as posts_service from "../services/posts.service.js"

export const postCreate = async (req, res, next) => {
    const user_id = req?.user?.user_id
    const content = req?.body?.content
    const path = req.body?.path
    const url = req.body?.url

    if (!user_id)
        throw new ErrorHandler("Unspecified user", 400)

    if (!url && !content?.trim())
        throw new ErrorHandler("Unspecified content", 400)

    if ((!path && url) || (path && !url))
        throw new ErrorHandler("Unspecified file", 400)

    const result = await posts_service.createPost(user_id, content, path, url)

    return res.json(result)
}

export const PostDelete = async (req, res, next) => {
    const post_id = req.params?.post
    const user_id = req?.user?.user_id

    if (!post_id || !user_id)
        throw new ErrorHandler("Unspecified post_id/user_id", 400)

    const result = await posts_service.deletePost(post_id, user_id)

    return res.json(result)
}

export const PostPut = async (req, res, next) => {
    const post_id = req.params?.post
    const user_id = req?.user?.user_id
    const content = req.body?.content

    if (!post_id || !user_id || !content?.trim())
        throw new ErrorHandler("Unspecified post_id/user_id/content", 400)

    const result = await posts_service.updatePost(content, post_id, user_id)

    return res.json(result)
}