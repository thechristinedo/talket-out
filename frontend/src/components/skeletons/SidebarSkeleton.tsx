import { Contact } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(6).fill(0);

  return (
    <aside className="lg:w-80 w-20 bg-gray-200 h-full flex flex-col">
      <div className="flex items-center gap-2 p-5 justify-center drop-shadow-sm shadow">
        <Contact className="size-6" />
        <p className="text-md font-semibold lg:block hidden">Friends</p>
      </div>

      <div className="overflow-y-auto w-full">
        {/* user skeleton */}
        {skeletonContacts.map((_, i) => (
          <div key={i} className="w-full p-3 flex items-center gap-3">
            <div className="mx-auto lg:mx-0">
              <div className="size-12 rounded-full bg-slate-300 animate-pulse"></div>
            </div>
            <div className="hidden lg:block w-full">
              <div className="bg-slate-300 h-4 w-40 mb-2 animate-pulse"></div>
              <div className="bg-slate-300 h-3 w-2/5 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
