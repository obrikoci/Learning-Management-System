import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TrackPage = () => {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("currentPage", location.pathname);
  }, [location]);

  return null; // This component doesn’t render anything
};

export default TrackPage;
