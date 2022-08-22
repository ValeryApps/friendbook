import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/login/index";

const LoggedInRoute = () => {
  const { user } = useSelector((state) => ({ ...state }));

  return user ? <Outlet /> : <Login />;
};

export default LoggedInRoute;
