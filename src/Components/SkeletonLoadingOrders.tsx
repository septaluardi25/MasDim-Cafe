const SkeletonLoadingOrder = () => {
  return (
    <div className="bg-gray-100 rounded-xl flex flex-col animate-pulse shadow-sm p-4">
      <div className=" w-full h-32  bg-gray-200 mb-10"></div>
    </div>
  );
};

const OrderGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonLoadingOrder key={index} />
      ))}
    </div>
  );
};
export default OrderGridSkeleton;
