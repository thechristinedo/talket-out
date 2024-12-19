import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <div className="bg-slate-500">
      {authUser && (
        <>
          <Link to="/profile">
            <span>Profile</span>
          </Link>
          <button onClick={logout}>
            <span>Logout</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Navbar;
