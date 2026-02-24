import sp from "../db/supabase.js"
import ErrorHandler from "../middlewares/errorsHandler.js"

export const URLGenerateFile = async (type) => {
    const filename = `${crypto.randomUUID()}.${(type.split("/"))[1]}`

    const { data, error } = await sp.storage.from("PostsImg")
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

export const FetchURLFile = async (path) => {
    const { data } = sp.storage.from("PostsImg").getPublicUrl(path)

    if (!data)
        throw new ErrorHandler("Couldn't find URL", 500)

    return data
}

export const delFile = async (path) => {
    const { data, error } = await sp.storage.from("PostsImg").remove([path])

    if (error)
        throw new ErrorHandler(error, error.status)

    return data
}