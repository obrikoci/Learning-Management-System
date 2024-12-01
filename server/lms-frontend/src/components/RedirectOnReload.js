import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectOnReload = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      navigate(savedPage); // Navigate to the saved page
    }
  }, [navigate]);

  return null; // This component doesn’t render anything
};

export default RedirectOnReload;
