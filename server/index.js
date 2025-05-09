import express, { json } from "express";
import { v4 as uuidv4 } from "uuid";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
const app = express();
const server=http.createServer(app)
const io=new Server(server,{
  cors:{
    origin:"*"
  }
})
app.use(json());
app.use(cors())
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

 
  socket.on("post-vote", async ({ pollId, userId, optionValue }) => {
    try {
      console.log(pollId,userId,optionValue)
      if (!polls.has(pollId)) {
        throw new Error("Poll not found");
      }

      const poll = polls.get(pollId);


      if (
        poll.option1Votes.includes(userId) ||
        poll.option2Votes.includes(userId)
      ) {
        throw new Error("User has already voted");
      }

      if (optionValue === "option1") {
        poll.option1Votes.push(userId);
      } else if (optionValue === "option2") {
        poll.option2Votes.push(userId);
      } else {
        throw new Error("Invalid option");
      }

 
      polls.set(pollId, poll);

    
      io.to(pollId).emit("vote-updated", poll);
    } catch (error) {
      console.error("Vote error:", error.message);
      socket.emit("vote-error", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const users = new Map();

const polls= new Map()


app.get("/poll-data/:id", (req, res) => {
  const id = req.params.id;



  if (!polls.has(id)) {
    return res.status(404).json({
      success: false,
      message: "Poll not found",
    });
  }



  return res.status(200).json({
    success: true,
   poll:polls.get(id)
  });
});

app.post("/create-poll", (req, res) => {
  const { question, roomId, option1, option2, creatorId } = req.body;

  if (polls.has(roomId)) {
    return res.status(409).json({
      message: "Poll With roomId already exists",
      success: false,
    });
  }

  const newPoll = {
    roomId,
    question,
    option1,
    option2,
    status: "running",
    time: 60,
    option1Votes: [],
    option2Votes: [],
    creatorId,
  };

  polls.set(roomId, newPoll);

  
  const interval = setInterval(() => {
    const poll = polls.get(roomId);
    if (poll && poll.time > 0) {
      poll.time -= 1;
      polls.set(roomId, poll);
      io.to(roomId).emit("poll-timer", poll.time);
    }
  }, 1000);

 
  setTimeout(() => {
    const poll = polls.get(roomId);
    if (poll) {
      poll.status = "ended";
      polls.set(roomId, poll);
      io.to(roomId).emit("poll-ended", { message: "Voting has ended", poll });
    }
    clearInterval(interval);
  }, 60000);

  return res.status(201).json({
    success: true,
    message: "Poll Created Successfully",
    newPoll,
  });
});

app.post("/create-user", (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== "string" || username.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Username must be at least 3 characters",
    });
  }

  const trimmedUsername = username.trim();

  
  const usernameExists = [...users.values()].some(
    (user) => user.username.toLowerCase() === trimmedUsername.toLowerCase()
  );

  if (usernameExists) {
    return res.status(409).json({
      success: false,
      message: "Username already exists",
    });
  }


  const newUser = {
    id: uuidv4(),
    username: trimmedUsername,
    createdAt: new Date(),
  };

  users.set(newUser.id, newUser);


  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: { id: newUser.id, username: newUser.username },
  });
});

app.post("/join-poll",(req,res)=>{

const{roomId}=req.body
console.log("join-poll")
if(!polls.has(roomId)){
  return res.status(400).json({
    success:false,
    message:"Invalid Room Id"
  })
}
return res.status(200).json({
  success:true,
  message:"Joined room successFully"
})

})



server.listen(9000, () => {
  console.log("Server running on port 9000");
});
