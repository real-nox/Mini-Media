import ErrorHandler from "../middlewares/errorsHandler.js"
import { hasIdUser } from "../repositories/login.repositories.js"
import { addcmt, addLike, delcmt, delpost, get_like, getcmt, getPost, listPosts, putpost, removeLike } from "../repositories/posts.repositories.js"
import { delFile, FetchURLFile, URLGenerateFile } from "../repositories/supabase.repositories.js"

export const Lposts = async (limit) => {

    if (!limit || isNaN(Number(limit)))
        throw new ErrorHandler("Limit isn't set as number", 404)

    const result = await listPosts(limit)

    if (!result)
        throw new ErrorHandler("Post not found!", 404)

    return result
}

export const Like = async (liker, post_id) => {

    if (!post_id || !liker)
        throw new ErrorHandler("Something unexpected happened!", 500)

    const findUser = await hasIdUser(liker)

    if (!findUser)
        throw new ErrorHandler("User not found!", 404)

    const hasLike = await get_like(post_id, liker)

    let result = null

    if (hasLike)
        result = await removeLike(post_id, liker)
    else
        result = await addLike(post_id, liker)

    return result
}

export const Getcomments = async (post_id, limit, cursor) => {
    const foundpost = await getPost(post_id)

    if (!foundpost || foundpost.length === 0)
        throw new ErrorHandler("Post not found!", 404)

    const comment = await getcmt(post_id, limit, cursor)

    if (!comment)
        throw new ErrorHandler("Comment not found!", 404)

    return { owner: foundpost[0].post_owner_id, cmt: comment }
}

export const AddComment = async (post_id, user_id, content) => {
    const foundpost = await getPost(post_id)

    if (!foundpost || foundpost.length === 0)
        throw new ErrorHandler("Post not found!", 404)

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        throw new ErrorHandler("User not found!", 404)

    const isAdded = await addcmt(post_id, user_id, content)

    if (!isAdded)
        throw new ErrorHandler("Database request failed!", 500)

    return findUser[0].username
}

export const DeleteComment = async (post_id, user_id) => {
    const foundpost = await getPost(post_id)

    if (!foundpost || foundpost.length === 0)
        throw new ErrorHandler("Post not found!", 404)

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        throw new ErrorHandler("User not found!", 404)

    const isDeleted = await delcmt(post_id, user_id)

    if (!isDeleted)
        throw new ErrorHandler("Database request failed!", 500)

    return isDeleted
}

export const DeletePost = async (post_id, user_id) => {

    const foundpost = await getPost(post_id)

    if (!foundpost || foundpost.length === 0)
        throw new ErrorHandler("Post not found!", 404)

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        throw new ErrorHandler("User not found!", 404)

    if (foundpost && foundpost.length > 0)
        if (foundpost[0].post_owner_id !== user_id)
            throw new ErrorHandler("Unauthorized request!", 403)

    if (foundpost[0].post_path && foundpost[0].post_img)
        await delFile(foundpost[0].post_path)

    const isDeleted = await delpost(post_id, user_id)

    if (!isDeleted)
        throw new ErrorHandler("Database request failed!", 500)

    return isDeleted
}

export const UpdatePost = async (newcontent, post_id, user_id) => {

    const foundpost = await getPost(post_id)

    if (!foundpost || foundpost.length === 0)
        throw new ErrorHandler("Post not found!", 404)

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        throw new ErrorHandler("User not found!", 404)

    if (foundpost && foundpost.length > 0)
        if (foundpost[0].post_owner_id !== user_id)
            throw new ErrorHandler("Unauthorized request!", 403)

    const isUpdated = await putpost(newcontent, post_id, user_id)

    if (!isUpdated)
        throw new ErrorHandler("Database request failed!", 500)

    return isUpdated
}

export const GenerateURLFile = async (type) => {
    const PermitedTypes = ["image/jpeg", "image/webp", "image/png"]

    if (!PermitedTypes.includes(type))
        throw new ErrorHandler("Invalid type!", 500)

    const result = await URLGenerateFile(type)
    return result
}

export const GetPublicURL = async (path) => {
    const result = FetchURLFile(path)

    return result
}