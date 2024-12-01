const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Routes
routes(app);

// Connect to MongoDB
mongoose
    .connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log("Connected to MongoDB successfully!");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
    });

// WebSocket setup
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Thay * bằng domain của bạn nếu cần
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Lắng nghe sự kiện từ client
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// Export WebSocket notify function
const notifyOrderCancellation = (data) => {
    io.emit("order-cancellation", data); // Gửi sự kiện tới tất cả client
    console.log("Notification sent:", data);
};

module.exports = { notifyOrderCancellation };

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
