"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import { getRecentLessons } from "@/utils/recentLessons";
import CourseCard from "@/components/cards/CourseCard";
import { Course, FetchCoursesParams } from "@/types/course";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getRecommendedCourses } from "@/utils/RecommendedCourses";
import { AppDispatch, RootState } from "@/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchCourses } from "@/store/course/courseThunks";
import LoaderCard from "@/components/loaders/LoaderCard";
import SearchCTA from "@/components/Cta/searchCTA";
import CTA from "@/components/Cta/CTA";
import HowItWork from "@/components/howItWork";
import Hero from "@/components/hero";
import CourseType from "@/components/courseType";
import { isLoggedIn } from "@/store/auth/authSlice";

export default function HomePage() {
  const { t, language } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [recentLessons, setRecentLessons] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const loggedIn = useSelector(isLoggedIn);
  const { courses, loading } = useSelector((state: RootState) => state.course);

  useEffect(() => {
    const pageParams: FetchCoursesParams = {
      pageNumber: 1,
      pageSize: 25,
    };

    dispatch(fetchCourses(pageParams));
  }, [dispatch, language]);
  useEffect(() => {
    const recent = getRecentLessons();
    setRecentLessons(recent);

    const recommended = getRecommendedCourses(courses);
    setRecommendedCourses(recommended);
  }, [courses]);

  return (
    <div className="  min-h-screen">
      {/* Hero Section */}
      <Hero />
      <SearchCTA />
      {!loggedIn ? (
        <CourseType />
      ) : (
        <>
          {/* complete Section */}
          <section className="py-10 bg-white dark:bg-secondary pt-[250px] ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("homePage.complete")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {t("homePage.complete_description")}
                </p>
              </div>

              <div className="relative w-full">
                <Carousel className="w-full overflow-hidden" dir="ltr">
                  <CarouselContent className="overflow-visible">
                    {recentLessons?.map((course: Course) => (
                      <CarouselItem
                        key={course.id}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <CourseCard
                          id={course.id}
                          title={course.title}
                          image={course.image}
                          duration={course.duration}
                          courseDuration={course.courseDuration || 30 * 60}
                          description={course.description}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
                </Carousel>
              </div>
            </div>
          </section>
          {/* recommended Section */}
          <section className="py-10 bg-white dark:bg-secondary ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("homePage.recommended")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {t("homePage.recommended_description")}
                </p>
              </div>

              <div className="relative w-full">
                <Carousel className="w-full overflow-hidden" dir="ltr">
                  <CarouselContent className="overflow-visible">
                    {loading
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <CarouselItem
                            key={index}
                            className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
                          >
                            <div className="w-[300px]">
                              <LoaderCard />
                            </div>
                          </CarouselItem>
                        ))
                      : recommendedCourses?.map((course: Course) => (
                          <CarouselItem
                            key={course.id}
                            className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
                          >
                            <div className="w-[300px]">
                              <CourseCard
                                id={course.id}
                                title={course.title}
                                image={course.image}
                                duration={course.duration}
                                courseDuration={
                                  course.courseDuration || 30 * 60
                                }
                                description={course.description}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                  </CarouselContent>

                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
                </Carousel>
              </div>
            </div>
          </section>
        </>
      )}
      <div className="py-10 bg-white dark:bg-secondary  px-1 md:px-10 text-white">
        <CTA />
      </div>
      <HowItWork />
    </div>
  );
}
