// components/loaders/LoaderPage.tsx
import LoaderCard from "./LoaderCard";

export default function LoaderPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 pt-[100px]  lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse mb-8 h-10 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoaderCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
