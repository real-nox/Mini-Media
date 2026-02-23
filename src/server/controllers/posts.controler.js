import * as posts_service from "../services/posts.service.js"

export const postCreate = async (req, res, next) => {
    try {
        const user_id = req.user.user_id
        const content = req.body.content
        const path = req.body.path

        const result = await posts_service.createPost(user_id, content, path)
        const { success, error, typeErr } = result

        if (typeErr && typeErr === 5)
            return res.status(503).send(error)

        if (error && typeErr)
            return res.render("home", { error })

        if (success)
            return res.redirect("/")
    } catch (err) {
        console.error(err)
    }
}