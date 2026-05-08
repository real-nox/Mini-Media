import { Pool } from "pg"
import { config } from "dotenv"
config({override:true, quiet:true})

const client = await new Pool({
    database: process.env.database,
    password: process.env.ps,
    host: process.env.host,
    user: "ranox"
}).connect()

try {
    await client.query("select $1::text as message", ["Connected"])
    console.info("Connect to Database!")
} catch (err) {
    console.error(err)
}

const query = async (instruction, arg) => await client.query(instruction, arg)

export default query;