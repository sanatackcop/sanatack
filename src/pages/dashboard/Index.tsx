import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function MainDashboard() {
  const userContext = useContext(UserContext);
  const auth = userContext?.auth;
  const navigate = useNavigate();
  const logout = userContext?.logout;

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate("/login");
    }
  };
  return (
    <>
      <h1>HELLO WORLD MY NAME ISS?</h1>
      <p>{auth?.user.email}</p>
      <Button onClick={() => handleLogout()}>Logout</Button>
    </>
  );
}
