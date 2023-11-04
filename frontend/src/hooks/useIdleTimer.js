import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";

function useIdle({ onIdle, idleTime }) {
  const [isIdle, setIsIdle] = useState(null);

  const handleOnIdle = (event) => {
    
    setIsIdle(true);
    const currentTime = new Date();
    const formattedCurrentTime = currentTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    });

    console.log("user is idle", event);
    console.log("Last Active time", getLastActiveTime());
    console.log("Current time", formattedCurrentTime);
    
    onIdle();
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * idleTime,
    onIdle: handleOnIdle,
    debounce: 2000,
  });
  return { getRemainingTime, getLastActiveTime, isIdle };
}

export default useIdle;