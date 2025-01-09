const EmptyChatBox = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4 text-center px-3">
      {/* <Inbox className="size-10 animate-pulse" /> */}
      <p className="text-xl font-medium lg:text-2xl">
        Welcome to <span className="font-bold animate-pulse">Talket Out</span>,
        your space for easy, real-time conversations!
      </p>
      <p className="text-md lg:text-lg font-medium">
        Connect, chat, and engage with ease.
      </p>
    </div>
  );
};

export default EmptyChatBox;
