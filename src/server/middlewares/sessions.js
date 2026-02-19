import jwt from "jsonwebtoken"

export const authS = (req, res, next) => {
    const token = req.cookies?.ssid

    res.locals.user = []
    if (!token)
        return res.redirect("/")

    try {
        const decoded = jwt.decode(token, process.env.LkeyToken)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
    }
}