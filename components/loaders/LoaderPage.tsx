// components/loaders/LoaderPage.tsx
import { AnimatePresence, motion } from "framer-motion";
import LoaderCard from "./LoaderCard";

export default function LoaderPage() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
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
      </motion.div>
    </AnimatePresence>
  );
}
