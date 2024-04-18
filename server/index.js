const express = require("express")
const app = express()
const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")
const { Socket } = require("dgram")


app.use(cors());
const server = http.createServer(app)

//helps resolve any cors issues and allows communication with our localhost 
const io = new Server(server, {
    cors : {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

//listening for someone who wants to connect
io.on("connection", (socket) =>{
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) =>{//sent from the frontend to backend. no need for http request
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data} `)
    })
    socket.on("send_message", (data) =>{
        socket.to(data.room).emit("receive_message",data)
        console.log(data);
    })
    
    socket.on("disconnect", () =>{
        console.log("User Disconnected ", socket.id);
    });
});



server.listen(3001, () =>{
    console.log("SERVER RUNNING")
});