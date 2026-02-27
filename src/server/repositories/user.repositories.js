import query from "../db/database.js"

export const UpdateUser = async (info) => {
    const result = await query("update users set nickname = $1, email = $2, bio = $3, updated_at = now(), avatar = $4, avatar_path = $5 where user_id = $6", 
        [info.nickname, info.email, info.bio, info.url, info.path, info.user_id]
    )

    if (result?.rowCount)
        return true
    return false
}