import { isLocalStorageAvailable } from "@/lib/utils"
import { authStore, clearAuthData } from "@/store/auth/Auth"
import { fetchBaseQuery as fetchBaseQueryHelper } from "@reduxjs/toolkit/query"

export const loginRedirectMessage = "loginRedirectMessage"

export const fetchBaseQuery = () => {
    return fetchBaseQueryHelper({
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE + "/api/v1",
        prepareHeaders: (headers) => {
            if (authStore.token) {
                headers.set("Authorization", "Bearer " + authStore.token)
            }
            return headers
        },
        validateStatus: (response) => {
            if (response.status === 401) {
                console.log("handling error")
                clearAuthData()
                if (isLocalStorageAvailable) {
                    localStorage.setItem(loginRedirectMessage, "Authentication expired. Please login again.")
                }
                window.location.replace("/auth/login")
            }
            return response.ok
        },
    })
}
