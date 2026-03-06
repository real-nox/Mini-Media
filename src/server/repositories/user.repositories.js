import query from "../db/database.js"

export const UpdateUser = async (user, fields, values) => {
    const result = await query(`update users 
        set ${fields.join(", ")}, updated_at = now()
        where user_id = $${user.index}`,
        [...values, user.user_id]
    )

    if (result?.rowCount)
        return true
    return false
}

export const GetFollower = async (user_id, owner_post_id) => {
    const result = await query(
        "select * from follows where follower_id = $1 and following_id = $2",
        [user_id, owner_post_id]
    )

    if (result?.rowCount)
        return true
    return false
}

export const Unfollow = async (user_id, owner_post_id) => {
    const result = await query(
        "delete from follows where follower_id = $1 and following_id = $2",
        [user_id, owner_post_id]
    )

    if (result?.rowCount)
        return true
    return false
}

export const Follow = async (user_id, owner_post_id) => {
    const result = await query(
        "insert into follows (follower_id, following_id) values ($1, $2)",
        [user_id, owner_post_id]
    )

    if (result?.rowCount)
        return true
    return false
}