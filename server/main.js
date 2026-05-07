import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"

import { config } from "dotenv"
config({override:true, quiet:true})

import { join, dirname } from "path"; 
import { fileURLToPath } from "url"

import sp from "./db/supabase.js";

import loginR from "./routers/login.route.js";
import userR from "./routers/user.route.js";
import api from "./routers/api.route.js";
import postR from "./routers/posts.route.js";
import messagesR from "./routers/messages.route.js";

import { auth } from "./middlewares/sessions.js";
import { modes } from "./middlewares/user_login.js";

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.get("/", modes, auth, (req, res) => {
    const user = req?.user
    const mode = req?.mode

    return res.json({ user, mode })
})

app.use(loginR)
app.use(userR)
app.use(api)
app.use(postR)
app.use(messagesR)

app.use((req, res, next) => {
    res.status(404).send("404")
})

app.use((err, req, res, next) => {
    console.error(err)

    const status = err.status || 500

    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
    next()
})

app.listen(process.env.port, () => {
    console.info("Running on http://localhost:" + process.env.port)
})