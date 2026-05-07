import { createClient } from "@supabase/supabase-js"
import ErrorHandler from "../middlewares/errorsHandler.js"
import { config } from "dotenv"
config({override:true, quiet:true})

const url = process.env.SupaPublic
const secAPIKey = process.env.secretAPIKey

const sp = createClient(url, secAPIKey)

if (sp)
    console.log("Connected to Supabase")
else 
    throw new ErrorHandler("Couldn't load supabase!", 500)

export default sp