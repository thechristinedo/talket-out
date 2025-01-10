import { Camera, LoaderCircle, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const {
    authUser,
    isUpdatingProfile,
    updateProfile,
    isGettingProfile,
    getProfile,
  } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  if (isGettingProfile)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="h-[calc(100vh-4rem-2px)] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 py-8 rounded-lg h-[calc(100vh-8rem)] xl:h-auto xl:bg-gray-100 ">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImg || authUser?.profilePic || "img/avatar.jpg"}
              alt="Profile Picture"
              className="size-32 rounded-full object-cover border-4"
            />
            <label
              htmlFor="profile-upload"
              className={`absolute p-1.5 bottom-0 right-0 cursor-pointer hover:scale-125 transition-all duration-200 rounded-full bg-gray-300 ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="size-5" />
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e)}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-md italic">
            {isUpdatingProfile ? "Uploading..." : "Upload a new selfie!"}
          </p>
        </div>

        <div className="flex flex-col gap-6 mt-8 ">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="size-5" />
              <p className="text-md font-semibold">Full Name</p>
            </div>
            <p className="w-full px-2 py-1.5 rounded-md bg-slate-200">
              {authUser?.fullName}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="size-5" />
              <p className="text-md font-semibold">Email</p>
            </div>
            <p className="w-full px-2 py-1.5 rounded-md bg-slate-200">
              {authUser?.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <div className="flex justify-between">
            <p className="text-md font-semibold">Account Created</p>
            <p className="text-md">{authUser?.createdAt?.slice(0, 10)}</p>
          </div>
          <div className="flex justify-between">
            {/* <p className="text-md font-semibold">Account Status</p>
            {authUser?.isVerified ? (
              <p className="text-green-700 font-medium">Verified</p>
            ) : (
              <p className="text-red-700 font-medium">Not Verified</p>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
