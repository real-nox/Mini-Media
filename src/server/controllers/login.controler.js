import * as login_service from "../services/login.service.js";

export const singin = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        const result = await login_service.singinUser(username, email, password)
        const { success, error } = result

        if (success)
            return res.redirect("/")
        else
            return res.render("logins/signin", { error })
    } catch (err) {
        console.log(err)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const result = await login_service.loginUser(email, password)
        const { success, error } = result

        if (success)
            return res.redirect("/")
        else
            return res.render("logins/signin", { error })
    } catch (err) {
        console.log(err)
    }
}