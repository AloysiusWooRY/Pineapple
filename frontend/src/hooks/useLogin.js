import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useCsrfContext } from "./useCsrfContext";

import { login as APILogin } from "../apis/exportedAPIs";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const { csrfToken, setCsrfToken } = useCsrfContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await APILogin(csrfToken, email, password);
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {

      // Update new csrf
      setCsrfToken(json.csrfToken)

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
