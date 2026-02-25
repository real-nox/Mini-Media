import ErrorHandler from "../middlewares/errorsHandler.js"
import { hasIdUser } from "../repositories/login.repositories.js"
import * as postsRep from "../repositories/posts.repositories.js"
import { delFile } from "../repositories/supabase.repositories.js"

export const createPost = async (user_id, content, path, url) => {

    if (content < 5 && !url)
        throw new ErrorHandler("Short content!", 400)

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        throw new ErrorHandler("Unfound user, contact staff!", 500)

    const response = await postsRep.savePost(user_id, content, path, url)

    if (!response)
        throw new ErrorHandler("Database request failed!", 500)

    return { username: findUser[0].username, link: url, ctn: content, post_id: response.post_id, created_at: response.created_at, likes: 0, user_id: user_id }
}

export const deletePost = async (post_id, user_id) => {

    const foundpost = await postsRep.getPost(post_id)

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

    const isDeleted = await postsRep.delpost(post_id, user_id)

    if (!isDeleted)
        throw new ErrorHandler("Database request failed!", 500)

    return isDeleted
}

export const updatePost = async (newcontent, post_id, user_id) => {

    const foundpost = await postsRep.getPost(post_id)

    if (!foundpost || foundpost.length === 0)
        throw new ErrorHandler("Post not found!", 404)

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        throw new ErrorHandler("User not found!", 404)

    if (foundpost && foundpost.length > 0)
        if (foundpost[0].post_owner_id !== user_id)
            throw new ErrorHandler("Unauthorized request!", 403)

    const isUpdated = await postsRep.putpost(newcontent, post_id, user_id)

    if (!isUpdated)
        throw new ErrorHandler("Database request failed!", 500)

    return isUpdated
}