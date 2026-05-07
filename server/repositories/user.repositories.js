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

export const GetUserFollowers = async (user_id) => {
    const result = await query(
        "select * from follows where following_id = $1",
        [user_id]
    )

    if (result?.rowCount)
        return {count: result?.rowCount, result : result.rows[0]}
    return {count: 0, result : null}
}

export const GetUserFollowings = async (user_id) => {
    const result = await query(
        "select * from follows where follower_id = $1",
        [user_id]
    )

    if (result?.rowCount)
        return {count: result?.rowCount, result : result.rows[0]}
    return {count: 0, result : null}
}