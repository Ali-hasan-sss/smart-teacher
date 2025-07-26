"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useEffect } from "react"

export default function CoursesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login`)
    }
  }, [isAuthenticated, isLoading, router, locale])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Mathematics</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Learn advanced mathematics concepts</p>
            <div className="bg-blue-600 text-white px-4 py-2 rounded text-center cursor-pointer hover:bg-blue-700">
              Start Learning
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
