import { hasIdUser } from "../repositories/login.repositories.js"
import * as postsRep from "../repositories/posts.repositories.js"

export const createPost = async (user_id, content, path, url) => {

    if (content < 5)
        return { success: false, error: "Short Post!", typeErr: 1 }

    const findUser = await hasIdUser(user_id)

    if (!findUser)
        return { success: false, error: "Unfound user, contact staff!", typeErr: 5 }

    await postsRep.savePost(user_id, content, path, url)

    return { success: "Created Post!", error: false, typeErr: 0 }
}