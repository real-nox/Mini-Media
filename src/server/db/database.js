import { config } from "dotenv"; config({quiet:true})
import { Client } from "pg"

const client = await new Client({
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

const query = (instruction, arg) => client.query(instruction, arg)

export default query;