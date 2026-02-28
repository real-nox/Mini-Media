import ErrorHandler from "../middlewares/errorsHandler.js"
import * as userService from "../services/user.service.js"

export const User = async (req, res, next) => {
    const user = req?.params?.username
    const mode = req.mode

    if (!user)
        return res.status(404).send("Unfound page")

    const result = await userService.LoadUser(user)

    if (!result)
        return res.status(404).send("Unfound page")

    return res.render("user/profile", { user: result[0], mode: mode })
}

export const UpdateUser = async (req, res, next) => {
    const userInfo = req.body?.userInfo

    if (!userInfo)
        throw new ErrorHandler("Unfound user info", 400)

    return await userService.updateUser(userInfo)
}