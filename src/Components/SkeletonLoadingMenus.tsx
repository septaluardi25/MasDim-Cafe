const SkeletonLoading = () => {
  return (
    <div className="bg-gray-100 rounded-xl flex flex-col animate-pulse shadow-sm p-4">
      <div className=" w-full h-32  bg-gray-200 mb-10"></div>

      <div className="bg-gray-200 h-5 mb-2"></div>
      <div className="bg-gray-200 h-20"></div>
    </div>
  );
};

const MenuGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {Array.from({ length: 9 }).map((_, index) => (
        <SkeletonLoading key={index} />
      ))}
    </div>
  );
};
export default MenuGridSkeleton;
