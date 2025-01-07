import { Inbox } from "lucide-react";

const EmptyChatBox = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6 text-center">
      {/* <Inbox className="size-10 animate-pulse" /> */}
      <p className="text-2xl font-medium">
        Welcome to <span className="font-bold animate-pulse">Talket Out</span>,
        your space for easy, real-time conversations!
      </p>
      <p className="text-lg font-medium">
        Connect, chat, and engage with ease.
      </p>
    </div>
  );
};

export default EmptyChatBox;
