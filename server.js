import express from 'express'
import { config } from 'dotenv'
import router from './routes.js'
import path from 'path'
import cors from 'cors'
import CONNECT_DB from './database.js'
import cookieParser from 'cookie-parser'
import http from 'http'
import { Server } from 'socket.io'
import { ACTIONS } from './actions.js'


// Server()
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

// http
const server = http.createServer(app)

// socket.io
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
})

/**
 * App uses
 */

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/storage', express.static('storage'))


/**
 * Routes
 */

app.get("/", (req, res) => {
    res.send("This is backend")
})

app.use(router)

// Sockets

const socketUserMapping = {

}

io.on('connection', (socket) => {
    // console.log("new connection", socket.id)
    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMapping[roomId] = user

        // new Map
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user
            })
        })

        socket.emit(ACTIONS.ADD_PEER, {
            peerId: clientId,
            createOffer: true,
            user: socketUserMapping[clientId]
        })
        socket.join(roomId)

    })

    // Handle relay Ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.RELAY_ICE, {
            peerId: socket.id,
            icecandidate
        })
    })

    // Handle relay SDP

    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.RELAY_SDP, { peerId: socket.id, sessionDescription })
    })

})



server.listen(PORT, () => console.log(`Server Started on ${PORT}...`))