import express from 'express'
import { config } from 'dotenv'
import router from './routes.js'
import path from 'path'
import cors from 'cors'
import CONNECT_DB from './database.js'

/**
 * Dotenv configuration
 */

config({
    path: path.join(process.cwd(), ".env")
})


const PORT = process.env.PORT || 7575

/**
 * DATABASE
 */
CONNECT_DB()

const app = express()

/**
 * App uses
 */

app.use(cors({
    origin:["http://localhost:5173"],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


/**
 * Routes
 */

app.get("/", (req, res) => {
    res.send("This is backend")
})

app.use(router)



app.listen(PORT, () => console.log(`Server Started on ${PORT}...`))