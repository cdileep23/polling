import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BASE_URL } from "@/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, Clock } from "lucide-react";

const EachPoll = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    setUser(userData);

    const newSocket = io("http://localhost:9000");
    setSocket(newSocket);
  newSocket.emit("join-room", id);
    newSocket.on("poll-timer", (time) => {
      setTimer(time);
    });

  

    newSocket.on("vote-updated", (poll) => {
      setData(poll);
    });

    newSocket.on("poll-ended", ({ message, poll }) => {
      toast.success(message);
      setData(poll);
      setTimer(0);
    });

    newSocket.on("vote-error", (errmsg) => {
      toast.error(errmsg);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (user && user.id) {
      fetchPolldata();
    }
  }, [user]);

  const fetchPolldata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/poll-data/${id}`);
      if (res.data.success) {
        setData(res.data.poll);
       
      }
    } catch (error) {
      console.error("Error fetching poll data:", error);
      navigate("/");
      toast({
        title: "Error",
        description: "Failed to load poll data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const EmitVoteEvent = (optionValue) => {
    const pollId = data.roomId;
    const userId = user.id;
    socket.emit("post-vote", { pollId, userId, optionValue });
  };

  const totalVotes = data
    ? data.option1Votes.length + data.option2Votes.length
    : 0;
  const option1Percent =
    totalVotes > 0 ? (data?.option1Votes.length / totalVotes) * 100 : 0;
  const option2Percent =
    totalVotes > 0 ? (data?.option2Votes.length / totalVotes) * 100 : 0;

  const hasVoted =
    data && user
      ? data.option1Votes.includes(user.id) ||
        data.option2Votes.includes(user.id)
      : false;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold text-gray-800">Active Poll</h2>
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
      </div>

      <div className="w-full max-w-lg mx-auto">
        {loading ? (
          <Card className="w-full shadow-lg animate-pulse">
            <CardHeader className="h-24 bg-gray-200 rounded-t-lg"></CardHeader>
            <CardContent className="space-y-6 py-6">
              <div className="h-12 bg-gray-200 rounded-md"></div>
              <div className="h-12 bg-gray-200 rounded-md"></div>
            </CardContent>
            <CardFooter className="h-12 bg-gray-100 rounded-b-lg"></CardFooter>
          </Card>
        ) : data ? (
          <Card className="w-full shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-white border-b pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800 flex justify-between items-center">
                <h1 className="tracking-tight">{data.question}</h1>
                {timer !== null && (
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-base text-gray-700">
                      {timer}
                    </span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">
              <div className="space-y-3">
                <Label className="text-lg font-medium text-gray-700">
                  {data.option1}
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    className={`min-w-24 transition-all ${
                      data.option1Votes.includes(user?.id)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={() => EmitVoteEvent("option1")}
                    disabled={data.status === "ended" || hasVoted}
                  >
                    {data.option1Votes.includes(user?.id) ? "Voted ✓" : "Vote"}
                  </Button>
                  <div className="flex-1 relative">
                    <Progress
                      value={option1Percent}
                      className="h-6 bg-gray-200"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium">
                      {Math.round(option1Percent)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 pl-2">
                  {data.option1Votes.length} vote
                  {data.option1Votes.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-medium text-gray-700">
                  {data.option2}
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    className={`min-w-24 transition-all ${
                      data.option2Votes.includes(user?.id)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={data.status === "ended" || hasVoted}
                    onClick={() => EmitVoteEvent("option2")}
                  >
                    {data.option2Votes.includes(user?.id) ? "Voted ✓" : "Vote"}
                  </Button>
                  <div className="flex-1 relative">
                    <Progress
                      value={option2Percent}
                      className="h-6 bg-gray-200"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium">
                      {Math.round(option2Percent)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 pl-2">
                  {data.option2Votes.length} vote
                  {data.option2Votes.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between text-sm text-gray-500 border-t py-4 mt-4 bg-gray-50">
              <span className="font-medium">
                {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
              </span>
              <span className="font-mono">Poll ID: {id}</span>
            </CardFooter>

            {data.status === "ended" && (
              <div className="bg-yellow-50 border-t border-yellow-200 py-3 px-6 text-center">
                <p className="text-yellow-800 font-medium">
                  This poll has ended
                </p>
              </div>
            )}
          </Card>
        ) : (
          <Card className="w-full p-8 text-center shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading poll data...</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EachPoll;
