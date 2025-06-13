import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const useAuthRedirect = (expectedType) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/verify", {
        method: "GET",
        credentials: "include",
        headers: {
            "Cache-Control": "no-cache"
        }
        });

        const data = await res.json();

        if (!res.ok || data.type !== expectedType) {
          navigate(`/login?type=${expectedType}`);
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        navigate(`/login?type=${expectedType}`);
      }
    };

    checkAuth();
  }, [navigate, expectedType]);
};

export default useAuthRedirect;

