import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { imageGenerationSlice } from "./imageProcessingSlice"
import { themeSlice } from "./themeSlice"

export function makeStore() {
  return configureStore({
    reducer: {
      imageProcessing: imageGenerationSlice.reducer,
      theme: themeSlice.reducer,
    },
  })
}

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

const store = makeStore()

export const ReduxProvider = ({ children }) => (
  <Provider {...{ store }}>{children}</Provider>
)
