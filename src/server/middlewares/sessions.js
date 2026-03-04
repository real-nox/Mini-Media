import jwt from "jsonwebtoken"

const Decoding = (token, keyToken) => {
    try {
        const decoded = jwt.verify(token, process.env.LkeyToken)
        return decoded
    } catch (error) {
        console.error(error)
        req.user = null
        return next()
    }
}

export const auth = (req, res, next) => {
    const token = req.cookies?.ssid
    req.user = token ? Decoding(token, process.env.LkeyToken) : null
    return next()
}

export const isAuth = (req, res, next) => {
    const token = req.cookies?.ssid
    if (!token) return next()
    req.user = token ? Decoding(token, process.env.LkeyToken) : null
    return next()
}