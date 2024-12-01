import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectOnReload = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      navigate(savedPage); 
    }
  }, [navigate]);

  return null; 
};

export default RedirectOnReload;
