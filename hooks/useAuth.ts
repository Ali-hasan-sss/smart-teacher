"use client"

import { useAuth as useAuthContext } from "@/contexts/auth-context"

// Re-export the useAuth hook for easier imports
export const useAuth = useAuthContext
