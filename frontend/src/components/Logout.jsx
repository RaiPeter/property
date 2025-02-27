import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutAndClearSession } from "../features/slices/authSlice";
import { useNavigate } from "react-router";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutAndClearSession()); // Clear Redux state and session storage
    navigate("/"); // Redirect to home page
  }, [dispatch, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
