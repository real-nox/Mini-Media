import * as apiServices from "../services/api.services.js"

export const modeApi = (req, res, next) => {
    let mode = "white"
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

export const postsList = async (req, res, next) => {
    try {
        const limit = req.query?.limit

        const list = await apiServices.Lposts(limit)

        if (!list)
            return res.json("")

        return res.json(list)
    } catch (err) {
        console.log(err)
    }
}

export const postLikes = async (req, res, next) => {
    try {
        const post_id = req.params.post

        const likes = await apiServices.LikesPost(post_id)

        console.log(likes)

        res.json(likes)
    } catch (err) {
        console.log(err)
    }
}

export const postOwner = async (req, res, next) => {
    try {
        const post_owner_id = req.params.owner

        const owner = await apiServices.OwnerPost(post_owner_id)

        res.json(owner)
    } catch (err) {
        console.log(err)
    }
}

export const LikePost = async (req, res, next) => {
    try {
        const post_id = req.params.post
        const liker = req.user.user_id

        const result = await apiServices.Like(liker, post_id)

        res.json(result)
    } catch (err) {
        console.log(err)
    }
}