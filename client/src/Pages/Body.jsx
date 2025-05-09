import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Body = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      navigate("/name");
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default Body;
