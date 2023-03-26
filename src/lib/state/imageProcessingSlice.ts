import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getImageUrl, uploadUserImage } from "@/lib/client/upload"
import { AppState } from "./store"
import { postProcessImage } from "@/lib/client/processing"

type ImageProcessingState = {
  inputImageUrl: string
  resultImageUrl: string
  uploading: boolean
  processing: boolean
  predictionId?: string
  currentModelName?: string
}

const initialState: ImageProcessingState = {
  inputImageUrl: null,
  resultImageUrl: null,
  uploading: false,
  processing: false,
  predictionId: null,
  currentModelName: null,
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
      console.log(error)
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
      state.inputImageUrl = state.resultImageUrl = null
      state.predictionId = null
    },
    setResultImage: (state, { payload: { output, predictionId } }) => {
      state.resultImageUrl = output
      state.processing = false
      state.predictionId = predictionId
    },
    stopProcessing: (state) => {
      state.processing = false
    },
    setCurrentModelName: (state, { payload }) => {
      state.currentModelName = payload
    },
  },
  extraReducers: (builder) => {
    // uploadImage
    builder.addCase(uploadImage.pending, (state, { meta: { arg } }) => {
      state.inputImageUrl = URL.createObjectURL(arg.value)
      state.uploading = true
      state.resultImageUrl = null
      state.predictionId = null
    })
    builder.addCase(uploadImage.fulfilled, (state, { payload }) => {
      state.inputImageUrl = payload
      state.uploading = false
    })
    builder.addCase(uploadImage.rejected, (state, action) => {
      state.inputImageUrl = null
      state.uploading = false
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
