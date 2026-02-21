import jwt from "jsonwebtoken"

export const authS = (req, res, next) => {
    const token = req.cookies?.ssid

    if (!token) {
        req.user = null
        return next()
    }

    try {
        const decoded = jwt.verify(token, process.env.LkeyToken)
        req.user = decoded
        return next()
    } catch (error) {
        console.error(error)
        req.user = null
        next()
    }
}

export const authU = (req, res, next) => {
    const token = req.cookies?.ssid

    if (!token)
        return res.redirect("/")

    try {
        const decoded = jwt.verify(token, process.env.LkeyToken)
        req.user = decoded

        return next()
    } catch (error) {
        console.error(error)
        return res.redirect("/")
    }
}

export const isAuth = (req, res, next) => {
    const token = req.cookies?.ssid

    if (!token)
        return next()

    try {
        const decoded = jwt.verify(token, process.env.LkeyToken)
        req.user = decoded
        return next()
    } catch (error) {
        console.error(error)
        return res.redirect("/")
    }
}