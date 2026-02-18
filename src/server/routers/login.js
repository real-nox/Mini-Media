import { Router } from "express"
import { login, singin } from "../controllers/login.controler.js"
import { userLM } from "../middlewares/user_login.js"

const loginR = Router()

loginR.use(userLM)

loginR.post("/sign-in", singin)
loginR.post("/login", login)

export default loginR