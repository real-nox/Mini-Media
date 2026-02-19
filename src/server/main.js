import express from "express"

import { join, dirname } from "path"; import { fileURLToPath } from "url"
import cookieParser from "cookie-parser";

import db from "./db/database.js";
import loginR from "./routers/login.js";
import { authS } from "./middlewares/sessions.js";
import userR from "./routers/user.js";

const app = express()

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set("views", join(__dirname, "../client/views"))

app.use(express.static(join(__dirname, "../client/public")))

app.use(loginR)
app.use(userR)

app.get("/", authS, (req, res) => {
    const user = req.user
    return res.render("home", { user })
})

app.use((req, res, next) => {
    res.status(404).send("404")
})

app.listen(process.env.port, () => {
    console.log("Running on http://localhost:5500")
})