import React from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { log } from "firebase/firestore/pipelines";

type Props = { unknown: unknown };

const GoogleLogin = (props: Props) => {
  const login = async () => {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    console.log(user);

    const token = await user.getIdToken();

    await fetch("/api/users", {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  return (
    <Button onClick={login} variant="outline">
      Google login <FaGoogle />
    </Button>
  );
};

export default GoogleLogin;
