import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getImageUrl, uploadUserImage } from "@/lib/client/upload"
import { AppState } from "./store"
import { postProcessImage } from "@/lib/client/processing"

type ImageProcessingState = {
  inputImageUrl: string
  resultImageUrl: string
  displayImageUrl: string
  uploading: boolean
  processing: boolean
}

const initialState: ImageProcessingState = {
  inputImageUrl: null,
  resultImageUrl: null,
  displayImageUrl: null,
  uploading: false,
  processing: false,
}

type ThunkArgs<T> = {
  value: T
  onError?: (e: Error) => void
  onSuccess?: (e: any) => void
}
export const uploadImage = createAsyncThunk(
  "imageProcessing/upload",
  async ({ value: file, onError }: ThunkArgs<File>, { rejectWithValue }) => {
    try {
      const { imagePath } = await uploadUserImage(file)
      return await getImageUrl(imagePath)
    } catch (error) {
      onError?.(error)
      return rejectWithValue("something went bad")
    }
  },
)

export const processImage = createAsyncThunk(
  "imageProcessing/process",
  async (
    { value, onError, onSuccess }: ThunkArgs<any>,
    { getState, rejectWithValue },
  ) => {
    const {
      imageProcessing: { inputImageUrl },
    } = getState() as AppState
    try {
      const result = await postProcessImage({ ...value, input: inputImageUrl })
      onSuccess?.(result)
      return result
    } catch (error) {
      onError?.(error)
      return rejectWithValue(error?.toString())
    }
  },
)

export const imageGenerationSlice = createSlice({
  name: "imageProcessing",
  initialState,
  reducers: {
    clearImages: (state) => {
      state.inputImageUrl = state.displayImageUrl = state.resultImageUrl = null
    },
    setDisplayImageFromFile: (state, { payload }) => {
      state.displayImageUrl = state.inputImageUrl = payload
    },
    setResultImage: (state, { payload }) => {
      state.displayImageUrl = state.resultImageUrl = payload

      state.processing = false
    },
    stopProcessing: (state) => {
      state.processing = false
    },
  },
  extraReducers: (builder) => {
    // uploadImage
    builder.addCase(uploadImage.pending, (state, { meta: { arg } }) => {
      state.displayImageUrl = URL.createObjectURL(arg.value)
      state.uploading = true
    })
    builder.addCase(uploadImage.fulfilled, (state, { payload }) => {
      state.inputImageUrl = state.displayImageUrl = payload
      state.uploading = false
    })
    builder.addCase(uploadImage.rejected, (state, action) => {
      state.uploading = false
      state.displayImageUrl = null
    })

    // processImage
    builder.addCase(processImage.pending, (state, { payload }) => {
      state.processing = true
    })
    builder.addCase(processImage.rejected, (state, action) => {
      state.processing = false
    })
  },
})
