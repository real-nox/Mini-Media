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

export const PublicAvatarURL = async (req, res, next) => {
    const filetype = req.body?.filetype

    if (!filetype)
        throw new ErrorHandler("Unfound type", 400)

    const result = await userService.GeneratePublicURL(filetype)
    return result
}

export const UpdateUser = async (req, res, next) => {

}