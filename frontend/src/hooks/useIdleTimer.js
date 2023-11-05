import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";

function useIdle({ onIdle, idleTime }) {
  const [isIdle, setIsIdle] = useState(null);

  const handleOnIdle = (event) => {
    
    setIsIdle(true);
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