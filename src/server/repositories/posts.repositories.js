import query from "../db/database.js"

export const savePost = async (user_id, content) => {
    console.log(user_id, content)
    await query("insert into posts (post_owner_id, p_content) values ($1, $2)", [user_id, content])

    return true
}

export const listPosts = async (limit) => {
    const result = await query("select * from posts order by created_at desc limit $1", [limit])

    if (result?.rows)
        return result?.rows

    return false
}

export const getPostLikes = async (post_id) => {
    const result = await query("select * from likes where post_id = $1", [post_id])

    return result?.rowCount
}

export const get_like = async (post_id, liker) => {
    const result = await query("select * from likes where post_id = $1 and user_id = $2", [post_id, liker])

    if (result?.rowCount)
        return true
    return false
}

export const addLike = async (post_id, liker) => {
    const result = await query("insert into likes (user_id, post_id) values($1, $2)", [liker, post_id])

    if (result?.rowCount)
        return true
    return false
}

export const removeLike = async (post_id, liker) => {
    await query("delete from likes where post_id = $1 and user_id = $2", [post_id, liker])

    return true
}