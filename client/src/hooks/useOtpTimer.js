import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage OTP resend countdown timers and prevent race conditions.
 * @param {number} initialSeconds - Default duration in seconds (default: 60)
 */
export const useOtpTimer = (initialSeconds = 60) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  const startTimer = useCallback((duration = initialSeconds) => {
    setSecondsLeft(duration);
  }, [initialSeconds]);

  const resetTimer = useCallback(() => {
    setSecondsLeft(0);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const canResend = secondsLeft === 0;

  const formattedTime = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return {
    secondsLeft,
    canResend,
    formattedTime,
    startTimer,
    resetTimer,
  };
};

export default useOtpTimer;
