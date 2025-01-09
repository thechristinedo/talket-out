import { Send, X, Image } from "lucide-react";
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { sendMessage } = useChatStore();

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Not an image file!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() && !imagePreview) return;

    try {
      await sendMessage({ text: message.trim(), image: imagePreview });

      //   reset inputs
      setMessage("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="w-full">
      {imagePreview && (
        <div className="px-3 pt-2 flex">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="size-24 object-cover rounded-lg "
            />
            <div className="bg-slate-300   rounded-full size-5 absolute -top-1 -right-1 flex items-center justify-center hover:scale-110 duration-300 transition-all">
              <button onClick={handleRemoveImage}>
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSendMessage}
        className="w-full px-3 py-4 flex gap-4 items-center"
      >
        <input
          className="border border-gray-200 px-3 py-2 w-full rounded-xl focus:outline-slate-300 flex-1"
          placeholder="Type a message..."
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleChangeImage}
          className="hidden"
        />
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          <Image
            className={`size-6 ${
              imagePreview ? "stroke-blue-400" : "stroke-slate-400"
            }  duration-300 transition-all`}
          />
        </button>
        <button
          type="submit"
          disabled={!message.trim() && !imagePreview}
          className="text-blue-400 transition-all duration-300 disabled:text-slate-300"
        >
          <Send />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
