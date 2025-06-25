import { useEffect } from "react";
import { toast } from "react-toastify";
import socket from "../socket";

const useBookingReminders = (userId) => {
  useEffect(() => {
    if (!userId) return;

    // 👂 Handlers
    const handleBookingReminder = (data) => {
      toast.info(data?.message || "🚗 Your parking is starting soon!");
    };

    const handleEndReminder = (data) => {
      toast.warn(data?.message || "⏱️ Your parking ends in 15 minutes!");
    };

    const handleBookingEnded = (data) => {
      toast.error(data?.message || "❌ Your parking time has ended.");
    };

    // ✅ Register event listeners (ensuring no duplicates)
    socket.off("booking-reminder").on("booking-reminder", handleBookingReminder);
    socket.off("booking-end-reminder").on("booking-end-reminder", handleEndReminder);
    socket.off("booking-ended").on("booking-ended", handleBookingEnded);

    // 🧹 Cleanup
    return () => {
      socket.off("booking-reminder", handleBookingReminder);
      socket.off("booking-end-reminder", handleEndReminder);
      socket.off("booking-ended", handleBookingEnded);
    };
  }, [userId]);
};

export default useBookingReminders;