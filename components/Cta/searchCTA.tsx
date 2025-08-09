import SearchBar from "../forms/SearchBar";

export default function SearchCTA() {
  return (
    <section className="relative flex  items-center justify-center">
      <div className="px-2 w-full md:w-[80%] h-[200px] rounded-[40px] absolute top-[-40px] bg-third flex flex-col items-center justify-center text-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ابحث عن الكورس المناسب لك
        </h2>
        <p className="text-xs mt-1 font-bold text-gray-600 dark:text-blue-200">
          استخدم مساعد الذكاء الاصطناعي للعثور على الكورسات المثالية{" "}
        </p>
        <div className="w-full  md:w-[60%]">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
