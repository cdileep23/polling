import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/utils";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Name = () => {
  const navigate=useNavigate()
  const [name, setName] = useState("");

  const handleSubmit =async() => {
    try {
      const username=name.trim()
const res=await axios.post(`${BASE_URL}/create-user`, {username})
console.log(res)
if(res.data.success){
  sessionStorage.setItem("user",JSON.stringify(res.data.user))
  toast.success(res.data.message)
}
navigate('/')

      
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }



  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex w-80 flex-col space-y-4">
        <h1 className="text-center text-2xl font-medium">Enter Your Name</h1>
        <Input
          className="rounded-lg border-gray-300 py-6 text-center text-lg shadow-sm focus:border-black focus:ring-black"
          placeholder="Type your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
        <Button
          onClick={handleSubmit}
          className="w-full bg-black py-6 text-lg font-medium text-white hover:bg-gray-800"
          disabled={!name.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Name;
