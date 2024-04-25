"use client"
import { configureStore } from "@reduxjs/toolkit/react"
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query"
import { authApiQ } from "./apis/authApiQ"
import { notificationsApiQ } from "./apis/notificationsApiQ"
import { patientApiQ } from "./apis/patientApiQ"
import { questionnairesApiQ } from "./apis/questionnairesApiQ"
import { rewardsApiQ } from "./apis/rewardsApiQ"
import { fileUploadApiQ } from "./apis/uploadApiQ"
export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [authApiQ.reducerPath]: authApiQ.reducer,
        [questionnairesApiQ.reducerPath]: questionnairesApiQ.reducer,
        [patientApiQ.reducerPath]: patientApiQ.reducer,
        [notificationsApiQ.reducerPath]: notificationsApiQ.reducer,
        [rewardsApiQ.reducerPath]: rewardsApiQ.reducer,
        [fileUploadApiQ.reducerPath]: fileUploadApiQ.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            authApiQ.middleware,
            questionnairesApiQ.middleware,
            patientApiQ.middleware,
            notificationsApiQ.middleware,
            fileUploadApiQ.middleware,
            rewardsApiQ.middleware,
        ]),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
