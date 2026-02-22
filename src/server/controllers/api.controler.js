import * as apiServices from "../services/api.services.js"

export const modeApi = (req, res, next) => {
    let mode = "light"
    if (!req.cookies.ssmodes) {
        res.cookie("ssmodes", "dark")
    }

    if (req.cookies.ssmodes && req.cookies.ssmodes === "dark") {
        res.clearCookie("ssmodes")
        res.cookie("ssmodes", "light", {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
            httpOnly: true
        })
    } else {
        mode = "dark"
        res.clearCookie("ssmodes")
        res.cookie("ssmodes", "dark", {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
            httpOnly: true
        })
    }

    res.json(mode)
}

export const getmodeApi = (req, res, next) => {
    let mode = "light"
    if (!req.cookies.ssmodes) {
        res.cookie("ssmodes", "dark")
    }

    if (req.cookies.ssmodes && req.cookies.ssmodes === "dark")
        mode = "dark"

    res.json(mode)
}

export const postsList = async (req, res, next) => {
    try {
        const limit = req.query?.limit

        const list = await apiServices.Lposts(limit)

        if (!list)
            return res.json("")

        return res.json(list)
    } catch (err) {
        console.error(err)
    }
}

export const postLikes = async (req, res, next) => {
    try {
        const post_id = req.params.post

        const likes = await apiServices.LikesPost(post_id)

        res.json(likes)
    } catch (err) {
        console.error(err)
    }
}

export const postOwner = async (req, res, next) => {
    try {
        const post_owner_id = req.params.owner

        const owner = await apiServices.OwnerPost(post_owner_id)

        res.json(owner)
    } catch (err) {
        console.error(err)
    }
}

export const LikePost = async (req, res, next) => {
    try {
        const post_id = req.params.post
        const liker = req.user.user_id

        const result = await apiServices.Like(liker, post_id)

        res.json(result)
    } catch (err) {
        console.error(err)
    }
}

export const CommentsGet = async (req, res, next) => {
    try {
        const post_id = req.params.post
        const limit = parseInt(req.query.limit) || null
        const cursor = req.query.cursor || null

        const result = await apiServices.Getcomments(post_id, limit, cursor)

        res.json(result)
    } catch (err) {
        console.error(err)
    }
}

export const CommentsAdd = async (req, res, next) => {
    try {
        const post_id = req.params.post
        const user_id = req.user.user_id
        const content = req.body.content

        const result = await apiServices.AddComment(post_id, user_id, content)

        const { fct, user } = result

        res.json({ post_id, user_id, content, user })
    } catch (err) {
        console.error(err)
    }
}

export const CommentsDelete = async (req, res, next) => {
    try {
        const post_id = req.params.post
        const user_id = req.params.author_id

        const result = await apiServices.DeleteComment(post_id, user_id)

        res.json(result)
    } catch (err) {
        console.error(err)
    }
}

export const PostDelete = async (req, res, next) => {
    try {
        const post_id = req.params.post
        const user_id = req.user.user_id

        const result = await apiServices.DeletePost(post_id, user_id)

        const { code, error } = result

        if (error.length > 0)
            return res.status(code).json(error)

        return res.json(result)
    } catch (err) {
        console.error(err)
    }
}

export const PostPut = async (req, res, next) => {
    try {
        const post_id = req.params.post
        const user_id = req.user.user_id
        const content = req.body.content

        const result = await apiServices.UpdatePost(content, post_id, user_id)

        const { success, code, error } = result

        if (error.length > 0)
            return res.status(code).json(error)

        return res.json(result)
    } catch (err) {
        console.error(err)
    }
}