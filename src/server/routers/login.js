import { Router } from "express"
import { login, logout, refresh, singin } from "../controllers/login.controler.js"
import { userLM } from "../middlewares/user_login.js"
import { isAuth, authU } from "../middlewares/sessions.js"
import { authRate } from "../middlewares/rate-limit.js"

const loginR = Router()

loginR.use(userLM)

loginR.get("/login", isAuth, (req, res) => {
    res.render("logins/login")
})

loginR.post("/login", authRate, login)

loginR.get("/sign-in", isAuth, (req, res) => {
    res.render("logins/signin")
})

loginR.post("/sign-in", authRate, singin)

loginR.get("/logout", authU, logout)

loginR.get("/refresh", authU, refresh)

export default loginR