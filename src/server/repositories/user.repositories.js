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