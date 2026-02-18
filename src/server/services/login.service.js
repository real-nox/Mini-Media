import * as login_repositories from "../repositories/login.repositories.js"
import bcrypt from "bcrypt"

export const singinUser = async (username, email, password) => {

    if (!username || !email || !password)
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

    const hasPassword = await login_repositories.hasPassword(password)

    if (hasPassword)
        return { success: false, error: "There is an account matching your information" }

    const result = await login_repositories.save_User(username, email, password)

    if (result)
        return { success: true, error: null };
}

export const loginUser = async (email, password) => {

    if (!email || !password)
        return { success: false, error: "Complete the fields" }

    //email = email.toLowerCase()

    const hasEmail = await login_repositories.hasEmail(email)

    console.log(!hasEmail)
    if (!hasEmail)
        return { success: false, error: "Incorrect Email/Password" }

    const oldPassword = await login_repositories.getPassword(email)

    //continue here
    const hasPassword = await login_repositories.hasPassword(password)

    console.log(password)
    console.log((!hasPassword))
    if (!hasPassword)
        return { success: false, error: "Incorrect Email/Password" }

    const result = await login_repositories.log_User(email, password)

    if (result)
        return { success: true, error: null };
}