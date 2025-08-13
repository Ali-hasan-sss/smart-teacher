import { AppDispatch, RootState } from "@/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchAllGrades,
  fetchGradesWithPagination,
} from "@/store/grade/gradeThunk";
import { useTranslation } from "@/hooks/useTranslation";
import GradeCard from "./cards/gradeCard";
import { Grade } from "@/types/grade";
import LoaderGradeCard from "./loaders/LoaderGradeCard";

export default function CourseType() {
  const { t, language } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { grades, loading } = useSelector((state: RootState) => state.grades);

  useEffect(() => {
    dispatch(fetchGradesWithPagination({ PageNumber: 1, PageSize: 10 }));
    dispatch(fetchAllGrades());
  }, [dispatch, language]);

  const loaderCount = 3;
  return (
    <section className="w-full bg-white dark:bg-secondary px-1 md:px-10 py-10 pt-[250px]">
      <div className="w-full flex flex-col items-center gap-5 p-5 bg-third py-10 rounded-lg">
        <h1 className="text-3xl font-bold text-center">
          أنواع الكورسات التي تجدها على{" "}
          <span className="text-blue-600 mx-1">smart teacher</span>
        </h1>
        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
          اختر المجال الذي يناسب اهتماماتك
        </p>

        <div className="relative w-full">
          <Carousel className="w-full overflow-hidden" dir="ltr">
            <CarouselContent className="overflow-visible">
              {loading
                ? Array.from({ length: loaderCount }).map((_, idx) => (
                    <CarouselItem
                      key={idx}
                      className="basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
                    >
                      <LoaderGradeCard />
                    </CarouselItem>
                  ))
                : grades.map((grade: Grade) => (
                    <CarouselItem
                      key={grade.id}
                      className="basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
                    >
                      <GradeCard grade={grade} />
                    </CarouselItem>
                  ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
