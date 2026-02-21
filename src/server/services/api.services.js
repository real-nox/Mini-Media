import { hasIdUser } from "../repositories/login.repositories.js"
import { addLike, get_like, listPosts, removeLike } from "../repositories/posts.repositories.js"

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
