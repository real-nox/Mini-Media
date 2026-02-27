import ErrorHandler from "../middlewares/errorsHandler.js"
import { hasIdUser, hasUsername } from "../repositories/login.repositories.js"
import { UpdateUser } from "../repositories/user.repositories.js"

export const LoadUser = async (user) => {
    const result = await hasUsername(user)

    if (!result)
        return false
    return result
}

export const updateUser = async (info) => {
    const isUser = await hasIdUser(info.user_id)

    if (!isUser)
        throw new ErrorHandler("Unfound user", 500)

    return await UpdateUser(info)
}