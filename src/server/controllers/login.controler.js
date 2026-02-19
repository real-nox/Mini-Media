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

        if (!success)
            return res.render("logins/login", { error })

        res.cookie("shssid", result.Tokens.short, {
            maxAge: 900000,
            path: "/",
            httpOnly: true
        })

        res.cookie("ssid", result.Tokens.long, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
            httpOnly: true
        })

        return res.redirect("/")
    } catch (err) {
        console.log(err)
    }
}

export const logout = async(req, res, next) => {
    try {
        if (!req.cookies)
            res.status(401).json("Unauthorized method")


        //Removal from db
        await login_service.logoutUser(req.user.user_id, req.cookies.ssid)

        //clear cookies
        res.clearCookie("ssid")
        res.clearCookie("shssid")
        res.redirect("/")
    } catch (err) {
        console.log(err)
    }
}

export const refresh = async (req, res, next) => {
    try {
        if (!req.cookies.ssid)
            return res.status(401).json("No token provided")

        const refreshT = await login_service.refreshT(req.cookies.ssid)

        res.cookie("shssid", refreshT, {
            maxAge: 900000,
            path: "/",
            httpOnly: true
        })

        return res.json(refreshT)
    } catch (err) {
        console.log(err)
    }
}