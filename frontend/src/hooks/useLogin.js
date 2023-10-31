import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

import { accountLogin } from "../apis/exportedAPIs";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await accountLogin({ email: email, password: password });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {

      // Save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // Update the auth context
      dispatch({ type: "LOGIN", payload: json });

      // Update loading state
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
