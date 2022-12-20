import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../Contexts/UserContext";

const Logout = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
        console.log("logged out")
    })
    .catch((error) => {
      console.log(error)
    });
}

export default Logout;
