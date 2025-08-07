export default function Footer() {
  return (
    <div className="relative flex items-center flex-col md:flex-row gap-5 px-1 md:px-10 w-full rounded-t-[40px] h-[400px] py-5 bg-primary">
      <div className="absolute bottom-3 right-1/2  w-[200px] h-32 bg-white opacity-20 blur-xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/2  w-32 h-[200px] bg-white opacity-20 blur-xl rounded-full pointer-events-none"></div>
    </div>
  );
}
