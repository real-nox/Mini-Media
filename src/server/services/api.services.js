import { hasIdUser } from "../repositories/login.repositories.js"
import { addcmt, addLike, delcmt, delpost, get_like, getcmt, getPost, listPosts, removeLike } from "../repositories/posts.repositories.js"

export const Lposts = async (limit) => {

    if (typeof (parseFloat(limit)) !== "number")
        return false

    const result = await listPosts(limit)

    if (!result)
        return 0

    return result
}

export const Like = async (liker, post_id) => {

    if (!post_id && !liker)
        return false

    const findUser = await hasIdUser(liker)

    if (!findUser)
        return false

    const hasLike = await get_like(post_id, liker)

    let result = null

    if (hasLike)
        result = await removeLike(post_id, liker)
    else
        result = await addLike(post_id, liker)

    if (!result)
        return 0

    return result
}

export const Getcomments = async (post_id, limit, cursor) => {
    const foundpost = await getPost(post_id)

    if (!foundpost)
        return false

    return { owner: foundpost[0].post_owner_id, cmt: await getcmt(post_id, limit, cursor) }
}

export const AddComment = async (post_id, user_id, content) => {
    const foundpost = await getPost(post_id)

    if (!foundpost)
        return false

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        return false

    return { fct: await addcmt(post_id, user_id, content), user: findUser[0].username }
}

export const DeleteComment = async (post_id, user_id) => {

    const foundpost = await getPost(post_id)

    if (!foundpost)
        return false

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        return false

    return await delcmt(post_id, user_id)
}

export const DeletePost = async (post_id, user_id) => {

    const foundpost = await getPost(post_id)

    if (!foundpost)
        return { code: 402, error: ["Unfound Post"] }

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        return { code: 402, error: ["Unfound User"] }

    if (foundpost[0].post_owner_id !== user_id)
        return { code: 403, error: ["Forbiden!"] }

    const deleted = await delpost(post_id, user_id)
    if (!deleted)
        return { code: 503, error: ["Couldn't delete post!"] }
    else
        return { code: 200, error: [] }
}