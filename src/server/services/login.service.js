import * as login_repositories from "../repositories/login.repositories.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const singinUser = async (nickname, username, email, password) => {

    if (!nickname || !username || !email || !password)
        return { success: false, error: "Complete the fields" }

    username = username.toLowerCase()

    const hasUsername = await login_repositories.hasUsername(username)

    if (hasUsername)
        return { success: false, error: "There is an account matching your information" }

    email = email.toLowerCase()

    const hasEmail = await login_repositories.hasEmail(email)

    if (hasEmail)
        return { success: false, error: "There is an account matching your information" }

    password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

    const result = await login_repositories.save_User(nickname, username, email, password)

    if (result)
        return { success: true, error: null };
}

export const loginUser = async (email, password) => {

    if (!email || !password)
        return { success: false, error: "Complete the fields" }

    email = email.toLowerCase()

    const foundbyEmail = await login_repositories.hasEmail(email)
    const foundbyUsername = await login_repositories.hasUsername(email)

    if (!foundbyEmail && !foundbyUsername)
        return { success: false, error: "Incorrect Email/Password" }

    let user = null

    foundbyEmail ? user = foundbyEmail : user = foundbyUsername

    const oldPassword = user[0].password

    const isthepwd = bcrypt.compareSync(password, oldPassword)

    password = oldPassword

    if (!isthepwd)
        return { success: false, error: "Incorrect Email/Password" }

    const result = await login_repositories.log_User(email, password)

    if (!result)
        return { success: false, error: "Please try again!" };

    const LToken = jwt.sign(
        { user_id: user[0].user_id, username: user[0].username },
        process.env.LkeyToken,
        { expiresIn: "30d" })

    const SToken = jwt.sign(
        { user_id: user[0].user_id, username: user[0].username },
        process.env.SkeyToken,
        { expiresIn: "15m" })

    await login_repositories.saveTokens(user[0].user_id, LToken)

    return { success: true, error: null, Tokens: { short: SToken, long: LToken } }
}

export const logoutUser = async (user_id, token) => {
    jwt.verify(token, process.env.LkeyToken)

    const user = await login_repositories.hasIdUser(user_id)

    if (!user) return false
    
    await login_repositories.deleteToken(user_id, token)
}

export const refreshT = async (refreshToken) => {

    const foundToken = jwt.verify(refreshToken, process.env.LkeyToken)
    const findUser = await login_repositories.hasIdUser(foundToken.user_id)

    if (!findUser)
        return false;

    const SToken = jwt.sign(
        { user_id: findUser[0].user_id, username: findUser[0].username },
        process.env.SkeyToken,
        { expiresIn: "15m" })

    return SToken
}