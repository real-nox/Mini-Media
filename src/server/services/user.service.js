import ErrorHandler from "../middlewares/errorsHandler.js"
import { hasUsername } from "../repositories/login.repositories.js"
import { URLGenerateFile } from "../repositories/supabase.repositories.js"

export const LoadUser = async (user) => {
    const result = await hasUsername(user)

    if (!result)
        return false
    return result
}

export const GeneratePublicURL = async (filetype) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"]

    if (!allowedTypes.includes(filetype))
        throw new ErrorHandler("Unsupported type!", 400)

    const resultat = await URLGenerateFile(filetype, "UserAvatar")

    console.log(resultat)
    return resultat
}