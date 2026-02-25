import { hasUsername } from "../repositories/login.repositories.js"

export const LoadUser = async (user) => {
    const result = await hasUsername(user)

    if (!result)
        return false
    return result
}