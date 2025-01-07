import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeClosed, LoaderCircle, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left column */}
      <div className=" flex flex-col justify-center items-center mt-16">
        <div className="w-full max-w-md space-y-8">
          {/* header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-lg">Let's talket out now!</p>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-6 px-6 ">
            <div className="relative border shadow-sm rounded-lg py-2 px-4">
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <Mail className="size-5" />
              </div>
              <input
                type="email"
                className="w-full pl-5 outline-none"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="relative border shadow-sm rounded-lg py-2 pl-4 pr-10">
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <Lock className="size-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-5 outline-none"
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeClosed className="size-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className={`w-full rounded-lg shadow-md py-2 hover:bg-blue-500  transition-colors ${
                isLoggingIn ? "bg-blue-300" : "bg-blue-400"
              } flex items-center justify-center`}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <LoaderCircle className="animate-spin" />
                </>
              ) : (
                <p className="text-lg">Login</p>
              )}
            </button>
          </form>

          {/* login redirect */}
          <div className="text-center">
            <p className="text-lg">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right column */}
      <div className="bg-hero-background bg-cover bg-center bg-no-repeat"></div>
    </div>
  );
};

export default LoginPage;
