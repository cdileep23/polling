
import { Button } from "@/components/ui/button";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/utils";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
const [isCreating,setIsCreating]=useState(false)
const[joinRoomId,setJoinRoomId]=useState('')
const[isJoining,setIsJoining]=useState(false)
  const[polldata,setPolldata]=useState({
    roomId:'',
    question:'',
    option1:'',
    option2:''
    

  })

  const navigate=useNavigate()

const handleSubmit=async()=>{
  try {
    const {roomId,question,option1,option2}=polldata

    setIsCreating(true)
if(!roomId||!question||  !option1 || !option2 ){

  toast.error("Fill all the fields")
}
const creatorId=user.id
const res=await axios.post(`${BASE_URL}/create-poll`,{roomId,creatorId, question,option1,option2});
if(res.data.success){
console.log(res.data)
  toast.success(res.data.message)
  navigate(`/poll/${res.data.newPoll.roomId}`)
}



  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }finally{
    setIsCreating(false)
    setPolldata({
      roomId: "",
      question: "",
      option1: "",
      option2: "",
    });
  }
}

const HandleJoinSubmit=async()=>{
  try {
    setIsJoining(true)
    const roomId=joinRoomId
    const res = await axios.post(`${BASE_URL}/join-poll`, { roomId });
    if(res.data.success){
     
     navigate(`/poll/${roomId}`)
    }
    
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }finally{
    setIsJoining(false)
  }
}

    console.log(polldata);
const HandleChange=(event)=>{

  setPolldata((prev)=>({

    ...prev, [event.target.name]:event.target.value
  }))

}
  useEffect(() => {
    const loadUserFromSession = () => {
      try {
        const userData = sessionStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse user data from sessionStorage", error);
        sessionStorage.removeItem("user");
      }
    };

    loadUserFromSession();
  }, []);
  

  return (
    <div className="max-w-6xl mx-auto min-h-screen flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          
          <h2 className="text-2xl font-bold text-gray-800"> Polls</h2>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <p className="font-medium text-gray-800 pr-2">{user.username}</p>
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Poll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a question with Two options</DialogTitle>
                <DialogDescription className="space-y-2">
                  <Label>Enter The rommId Unique</Label>
                  <Input
                    onChange={HandleChange}
                    name="roomId"
                    value={polldata.roomId}
                  />
                  <Label>Enter The question</Label>
                  <Input
                    onChange={HandleChange}
                    name="question"
                    value={polldata.question}
                  />
                  <Label>Enter The Option1</Label>
                  <Input
                    onChange={HandleChange}
                    name="option1"
                    value={polldata.option1}
                  />
                  <Label>Enter The Option2</Label>
                  <Input
                    onChange={HandleChange}
                    name="option2"
                    value={polldata.option2}
                  />

                  <Button onClick={handleSubmit}>
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                join Poll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Poll By entering Room Id</DialogTitle>
                <DialogDescription className="space-y-2">
                  <Label>Enter The Valid roomId</Label>
                  <Input
                    onChange={(e) => {
                      setJoinRoomId(e.target.value);
                    }}
                    name="roomId"
                    value={joinRoomId}
                  />

                  <Button onClick={HandleJoinSubmit}>
                    {isJoining ? "Joining..." : "Join"}
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Home;
