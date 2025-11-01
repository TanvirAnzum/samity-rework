export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  );
}
