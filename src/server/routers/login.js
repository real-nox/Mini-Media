import { Router } from "express"
import { login, logout, refresh, singin } from "../controllers/login.controler.js"
import { userLM } from "../middlewares/user_login.js"
import { authS } from "../middlewares/sessions.js"

const loginR = Router()

loginR.use(userLM)

loginR.get("/login", (req, res) => {
    res.render("logins/login")
})

loginR.post("/login", login)

loginR.get("/sign-in", (req, res) => {
    res.render("logins/signin")
})

loginR.post("/sign-in", singin)

loginR.get("/logout", authS, logout)

loginR.post("/refresh", refresh)

export default loginR