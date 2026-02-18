import express from "express"

import { join, dirname } from "path"
import { fileURLToPath } from "url"

import db from "./db/database.js";
import loginR from "./routers/login.js";

const app = express()
const port = 5500

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.urlencoded({extended:true}))

app.set("view engine", "ejs")
app.set("views", join(__dirname, "../client/views"))

app.use(express.static(join(__dirname, "../client/public")))

app.use(loginR)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("logins/login")
})

app.get("/sign-in", (req, res) => {
    res.render("logins/signin")
})

app.listen(port, () => {
    db
    console.log("running on http://localhost:5500")
})