import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { uploadImageToCloud } from "@/lib/client/upload"
import { AppState } from "./store"
import { postProcessImage } from "@/lib/client/processing"
import { FetchJsonError } from "@/lib/utils"
import { ReplicateStatus } from "@/lib/data/entities"

type ImageProcessingState = {
  inputImageUrl: string
  resultImageUrl: string
  uploading: boolean
  processing: boolean
  predictionId?: string
  currentModelName?: string
  replicateStatus?: keyof typeof ReplicateStatus
}

const initialState: ImageProcessingState = {
  inputImageUrl: null,
  resultImageUrl: null,
  uploading: false,
  processing: false,
  predictionId: null,
  currentModelName: null,
  replicateStatus: null,
}

type ThunkArgs<T, E = any> = {
  value: T
  onError?: (e: E) => void
  onSuccess?: (result: any) => void
}

export const uploadImage = createAsyncThunk(
  "imageProcessing/upload",
  async ({ value: file, onError, onSuccess }: ThunkArgs<File>, { rejectWithValue }) => {
    try {
      const uploadedImageUrl = await uploadImageToCloud(file)
      onSuccess?.(uploadedImageUrl)
      return uploadedImageUrl
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
    { value, onError, onSuccess }: ThunkArgs<any, FetchJsonError>,
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
    setInputImage: (state, { payload }) => {
      state.inputImageUrl = payload
    },
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
    setReplicateStatus: (
      state,
      { payload }: { payload: keyof typeof ReplicateStatus },
    ) => {
      state.replicateStatus = payload
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
