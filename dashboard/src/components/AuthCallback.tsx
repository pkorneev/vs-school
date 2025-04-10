import { useState } from "react";
import { useSetAtom } from "jotai";
import { tokenAtom, userAtom } from "../store/store";
import { fetchUserData } from "../utils/http";
import { API_BASE_URL } from "../consts/consts";

const AuthCallback = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);

  const handleLogin = () => {
    // Open the new window for OAuth authentication
    const authWindow = window.open(
      `${API_BASE_URL}/auth/university`,
      "_blank",
      "width=600,height=600"
    );

    // Optionally, show the manual input field after opening the window
    setIsInputVisible(true);

    // Set up the message listener to receive the token once the user authenticates
    const handleMessage = (event: MessageEvent) => {
      // Ensure that the message is coming from a trusted origin
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === "auth-token" && event.data.token) {
        const token = event.data.token;

        // Set the token in your application state (Jotai or localStorage)
        setToken(token);

        // Fetch user data with the token
        fetchUserData(token).then((data) => {
          setUser(data.user);
        });

        // Close the auth window after receiving the token
        if (authWindow) {
          authWindow.close();
        }
      }
    };

    // Add the message event listener
    window.addEventListener("message", handleMessage);

    // Optionally, handle window closure or timeout
    setTimeout(() => {
      if (authWindow && !authWindow.closed) {
        console.log("Auth window closed or timed out");
        authWindow.close();
      }
    }, 60000); // 1 minute timeout to close the window if not authenticated

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  };

  const handleManualTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setManualToken(event.target.value);
  };

  const handleSubmitToken = () => {
    // Use the manual token to set the application state
    setToken(manualToken);

    fetchUserData(manualToken).then((data) => {
      setUser(data.user);
    });
  };

  return (
    <div>
      <button onClick={handleLogin}>Continue with VUT</button>

      {isInputVisible && (
        <div>
          <p>Paste your token below:</p>
          <input
            type="text"
            value={manualToken}
            onChange={handleManualTokenChange}
            placeholder="Enter token"
          />
          <button onClick={handleSubmitToken}>Submit Token</button>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
