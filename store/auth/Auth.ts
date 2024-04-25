import { isLocalStorageAvailable, safeDecodeJson } from "@/lib/utils"
import { proxy, subscribe } from "valtio"

const AUTH_STORAGE_KEY = "authData"

// Load auth data from localStorage on application start (if available)
const savedAuthData = isLocalStorageAvailable ? safeDecodeJson(localStorage.getItem(AUTH_STORAGE_KEY)) : null

// Initialize authStore with localStorage data if available
const authStore = proxy<{
    isAuthenticated: boolean
    user: {
        id: string
        email: string
    } | null
    token: string | null
}>(
    savedAuthData || {
        isAuthenticated: false,
        user: null,
        token: null,
    }
)

// Function to set authentication data and update localStorage (if available)
const setAuthData = (
    user: {
        id: string
        email: string
    },
    token: string
) => {
    authStore.isAuthenticated = !!(user.email || user.id) && !!token
    authStore.user = user
    authStore.token = token

    // Save auth data to localStorage (if available)
    if (isLocalStorageAvailable) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore))
    }
}

// Function to clear authentication data and update localStorage (if available)
const clearAuthData = () => {
    authStore.isAuthenticated = false
    authStore.user = null
    authStore.token = null

    // Remove auth data from localStorage (if available)
    if (isLocalStorageAvailable) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
    }
}

// Example usage of subscribing to changes
subscribe(authStore, () => {
    // Save to localStorage when auth state changes (if available)
    if (isLocalStorageAvailable) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore))
    }
})

export { authStore, clearAuthData, setAuthData }
