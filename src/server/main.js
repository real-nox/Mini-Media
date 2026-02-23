import express from "express"

import { join, dirname } from "path"; import { fileURLToPath } from "url"
import cookieParser from "cookie-parser";

import loginR from "./routers/login.js";
import { authS } from "./middlewares/sessions.js";
import userR from "./routers/user.js";
import { modes } from "./middlewares/user_login.js";
import api from "./routers/api.js";
import postR from "./routers/posts.js";

const app = express()

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set("views", join(__dirname, "../client/views"))

app.use(express.static(join(__dirname, "../client/public")))

app.use(loginR)
app.use(userR)
app.use(api)
app.use(postR)

app.get("/", modes, authS, (req, res) => {
    const user = req.user
    const mode = req.mode
    return res.render("home", { user, mode })
})

app.use((req, res, next) => {
    res.status(404).send("404")
})

app.listen(process.env.port, () => {
    console.info("Running on http://localhost:5500")
})

app.use((err, req, res, next) => {
    console.error(err)

    const status = err.status || 500

    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
})