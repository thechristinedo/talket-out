import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Inbox, LogOut, Settings, User } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <header className="backdrop-blur-lg fixed w-full top-0 z-100 bg-blue-100 border-b-2 border-blue-200">
      <div className="container mx-auto px-4 h-16">
        <div className="flex justify-between items-center h-full">
          {/* left side */}
          <Link to="/" className="flex items-center gap-2">
            <Inbox className="size-6" />
            <h1 className="text-md font-semibold">Talket Out!</h1>
          </Link>

          {/* right side */}
          <div className="flex items-center lg:gap-6 gap-4">
            <a
              href="http://www.github.com/thechristinedo"
              target="_blank"
              className="flex items-center gap-1"
            >
              <Settings className="size-6" />
              <span className="hidden sm:inline font-semibold">Settings</span>
            </a>

            {/* <Link
              to={"/settings"}
              className={`btn btn-sm gap-1 flex transition-colors items-center `}
            >
              <Settings className="size-6" />
              <span className="hidden sm:inline font-semibold">Settings</span>
            </Link> */}
            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className={`btn btn-sm flex gap-1 items-center`}
                >
                  <User className="size-6" />
                  <span className="hidden sm:inline font-semibold">
                    Profile
                  </span>
                </Link>
                <button className="flex gap-1 items-center" onClick={logout}>
                  <LogOut className="size-6" />
                  <span className="hidden sm:inline font-semibold">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
