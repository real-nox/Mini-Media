import { hasIdUser } from "../repositories/login.repositories.js"
import { addLike, get_like, getPostLikes, listPosts, removeLike } from "../repositories/posts.repositories.js"

export const Lposts = async (limit) => {

    if (typeof (parseFloat(limit)) !== "number")
        return false

    const result = await listPosts(limit)

    if (!result)
        return 0

    return result
}

export const LikesPost = async (post_id) => {

    post_id = parseFloat(post_id)
    if (typeof (post_id) !== "number")
        return false

    const result = await getPostLikes(post_id)

    if (!result)
        return 0

    return result
}

export const OwnerPost = async (post_owner_id) => {

    post_owner_id = parseFloat(post_owner_id)
    if (typeof (post_owner_id) !== "number")
        return false

    const result = await hasIdUser(post_owner_id)

    if (!result)
        return 0

    return result[0].username
}

export const Like = async (liker, post_id) => {

    post_id = parseFloat(post_id)
    liker = parseFloat(liker)
    if (typeof (post_id) !== "number" || typeof (liker) !== "number")
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
