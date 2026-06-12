require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./src/graphql/schema");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.send("Users API is running");
});

/*
|--------------------------------------------------------------------------
| Socket.IO Setup
|--------------------------------------------------------------------------
*/
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let connectedUsers = 0;

io.on("connection", (socket) => {
  connectedUsers++;

  console.log(`User connected. Total: ${connectedUsers}`);

  io.emit("usersCount", connectedUsers);

  socket.on("disconnect", () => {
    connectedUsers--;

    console.log(`User disconnected. Total: ${connectedUsers}`);

    io.emit("usersCount", connectedUsers);
  });
});

/*
|--------------------------------------------------------------------------
| Database Connection & Server Start
|--------------------------------------------------------------------------
*/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });