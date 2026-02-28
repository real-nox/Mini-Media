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

    const fields = []
    const values = []
    let index = 1

    for (const key in info) {
        if (key === "user_id") continue
        console.log(key)
        fields.push(`${key} = $${index}`)
        values.push(info[key])
        index++
    }

    if (fields.length === 0) return false

    const result = await UpdateUser({user_id : info.user_id, index: index}, fields, values)
    return result
}