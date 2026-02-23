import sp from "../db/supabase.js"

export const URLGenerateFile = async (Filename) => {
    const { data, error } = await sp.storage.from("PostsImg").createSignedUploadUrl(Filename)

    if (!data)
        return false
    return data
}