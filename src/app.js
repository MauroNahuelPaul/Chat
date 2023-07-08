import express from "express";
import handlebars from "express-handlebars"
import mongoose from "mongoose";
import { Server } from 'socket.io'

import productRouter from "./routers/product.router.js"
import chatRouter from "./routers/chat.router.js"
import viewsProductsRouter from "./routers/views.router.js";



const app = express()
app.use(express.json())


try {
    await mongoose.connect('mongodb+srv://mauro:mauro@ecommerce.wnnj4ej.mongodb.net/?retryWrites=true&w=majority')
    const serverHttp = app.listen(8080, () => console.log("Server Up"))
    const io = new Server(serverHttp)
    app.set("socketio", io);

    app.engine("handlebars", handlebars.engine());
    app.set("views", "./src/views");
    app.set("view engine", "handlebars");

    app.use("/", viewsProductsRouter);
    app.use("/api/chat", chatRouter);
    app.use("/api/products", productRouter);



    io.on('connection', async socket => {
        //Chat
        const resultChat = await fetch("http://localhost:8080/api/chat")
        const dataChat = await resultChat.json()
        io.emit("updatedChat",dataChat.payload);
        socket.on("updatedChat", async () => {
            const resultChat = await fetch("http://localhost:8080/api/chat")
            const dataChat = await resultChat.json()
            io.emit("updatedChat", dataChat.payload);
        });
        //Products
        const resultProducts = await fetch("http://localhost:8080/api/products")
        const dataProducts = await resultProducts.json()
        io.emit("updatedProducts",dataProducts.payload);
        socket.on("productList", async () => {
            const resultProducts = await fetch("http://localhost:8080/api/products")
            const dataProducts = await resultProducts.json()
            io.emit("updatedProducts", dataProducts.payload);
        });
    })
} catch (err) {
    console.log(err)
}


