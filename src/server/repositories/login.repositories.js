import query from "../db/database.js"

export const hasUsername = async (username) => {
    try {
        const result = await query("select username from users where username = $1", [username])


        if (!result?.rows.length)
            return false

        return true
    } catch (err) {
        console.log(err)
    }
}

export const hasEmail = async (email) => {
    try {
        const result = await query("select * from users where emails = $1", [email])

        if (!result?.rows.length)
            return false

        return result?.rows
    } catch (err) {
        console.log(err)
    }
}

export const save_User = async (nickname, username, email, password) => {
    const result = await query("insert into users (nickname, username, emails, password) values ($1, $2, $3, $4)", [nickname, username, email, password])
    if (!result?.rows.length)
        return false

    return true
}

export const hasIdUser = async (id) => {
    try {
        const result = await query("select * from users where user_id = $1", [id])

        if (!result?.rows.length)
            return false

        return result?.rows
    } catch (err) {
        console.log(err)
    }
}

export const log_User = async (email, password) => {
    const result = await query("select * from users where emails = $1 and password = $2", [email, password])

    if (!result?.rows.length)
        return false

    return true
}

export const saveTokens = async (user_id, LToken) => {
    const result = await query("insert into sessions(refresht_id, user_id, expires_at) values($1,$2,$3)",
        [LToken, user_id, new Date(Date.now() + 24 * 24 * 60 * 60 * 1000)])

    if (!result?.rows.length)
        return false

    return true
}

export const deleteToken = async (user_id, Token) => {
    const result = await query("delete from sessions where refresht_id = $1 and user_id = $2",
        [Token, user_id])

    if (!result?.rows.length)
        return false

    return true
}