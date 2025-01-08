const ChatBoxSkeleton = () => {
  const skeletonMessages = Array(6).fill(0);

  return (
    <div className="w-full overflow-y-auto px-3 mt-auto">
      {skeletonMessages.map((_, i) => (
        <div
          key={i}
          className={`py-4 flex items-start gap-3 ${
            i % 2 === 0 ? "" : "flex-row-reverse"
          }`}
        >
          <div className="size-12 rounded-full bg-slate-300 animate-pulse"></div>
          <div
            className={`flex flex-col w-full ${
              i % 2 === 0 ? "items-start" : "items-end"
            }`}
          >
            <div
              className={`bg-slate-300 h-8 w-full max-w-64 mb-2 animate-pulse rounded-2xl ${
                i % 2 === 0 ? "rounded-bl-none" : "rounded-br-none"
              }`}
            ></div>
            <div
              className={`bg-slate-300 h-4 w-1/5 rounded-md animate-pulse ${
                i % 2 === 0 ? "rounded-bl-none" : "rounded-br-none"
              }`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBoxSkeleton;
