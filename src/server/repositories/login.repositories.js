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
        const result = await query("select emails from users where emails = $1", [email])

        if (!result?.rows.length)
            return false

        return true
    } catch (err) {
        console.log(err)
    }
}

export const hasPassword = async (pwd) => {
    try {
        const result = await query("select password from users where password = $1", [pwd])

        if (!result?.rows.length)
            return false

        return true
    } catch (err) {
        console.log(err)
    }
}

export const getPassword = async (email) => {

}

export const save_User = async (username, email, password) => {
    const result = await query("insert into users (username, emails, password) values ($1, $2, $3)", [username, email, password])
    if (!result?.rows.length)
        return false

    return true
}

export const hasIdUser = async (username) => {
    try {
        const result = await query("select * from users where emails = $1", [email])

        if (!result?.rows.length)
            return false

        console.log(result?.rows)
        return result?.rows
    } catch (err) {
        console.log(err)
    }
}

export const log_User = async (email, password) => {
    const result = await query("select * from users where emails and password = $1, $2", [email, password])

    console.log(result)
}