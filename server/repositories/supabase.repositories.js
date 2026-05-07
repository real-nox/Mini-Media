import sp from "../db/supabase.js"
import ErrorHandler from "../middlewares/errorsHandler.js"

export const URLGenerateFile = async (type, path = "PostsImg") => {
    const filename = `${crypto.randomUUID()}.${(type.split("/"))[1]}`

    const { data, error } = await sp.storage.from(path)
        .createSignedUploadUrl(filename)

    if (error) {
        if (error.statusCode === 409)
            return await FetchURLFile(filename);

        throw new ErrorHandler(error, error.status || 500)
    }

    if (!data)
        return false
    return data
}

export const FetchURLFile = async (path, folder) => {
    const { data } = sp.storage.from(folder).getPublicUrl(path)

    if (!data)
        throw new ErrorHandler("Couldn't find URL", 500)

    return data
}

export const delFile = async (path, folder = "PostsImg") => {
    console.log(path, folder)
    const { data, error } = await sp.storage.from(folder).remove(path)

    if (error)
        return false

    return data
}