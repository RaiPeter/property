import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { verifyAuth } from "../features/slices/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const auth = useSelector((state) => state.auth);

  console.log(auth, "line 11");
  console.log(isAuthenticated, "line 12");

  useEffect(() => {
    dispatch(verifyAuth()); // Check authentication when component loads
  }, [dispatch]);


  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
