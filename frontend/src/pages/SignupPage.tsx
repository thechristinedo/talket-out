import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeClosed, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required.");
    if (!formData.email.trim()) return toast.error("Email is required.");
    if (!formData.password) return toast.error("Password is required");

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left column */}
      <div className=" flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-8">
          {/* header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-semibold">Create an account</h1>
              <p className="text-lg">Get started with a free account today</p>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-6 px-6 ">
            <div className="relative border shadow-sm rounded-lg py-2 px-4">
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <User className="size-5" />
              </div>
              <input
                type="text"
                className="w-full pl-5 outline-none"
                placeholder="Full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

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
                isSigningUp ? "bg-blue-300" : "bg-blue-400"
              } flex items-center justify-center`}
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <LoaderCircle className="animate-spin" />
                </>
              ) : (
                <p className="text-lg">Sign up</p>
              )}
            </button>

            {/* TODO: PASSWORD STRENGTH METER */}
          </form>

          {/* login redirect */}
          <div className="text-center">
            <p className="text-lg">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 underline">
                Sign in
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

export default SignupPage;
