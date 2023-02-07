import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getImageUrl, uploadUserImage } from "@/lib/client/upload"
import { AppState } from "./store"
import { postProcessImage } from "@/lib/client/processing"
import { notification } from "@/lib/utils/notification"

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

export const uploadImage = createAsyncThunk(
  "imageProcessing/upload",
  async (file: File, { rejectWithValue }) => {
    try {
      const { imagePath } = await uploadUserImage(file)
      return await getImageUrl(imagePath)
    } catch (error: any) {
      return rejectWithValue("something went bad")
    }
  },
)

export const processImage = createAsyncThunk(
  "imageProcessing/process",
  async (
    { values, onError, onSuccess }: any,
    { getState, rejectWithValue, dispatch },
  ) => {
    const {
      imageProcessing: { inputImageUrl },
    } = getState() as AppState
    try {
      const result = await postProcessImage({ ...values, input: inputImageUrl })
      onSuccess?.(result)
      return result
    } catch (error) {
      onError?.(error)
      return rejectWithValue(error)
    }
  },
)

export const imageGenerationSlice = createSlice({
  name: "imageProcessing",
  initialState,
  reducers: {
    clearImages: (state) => {
      state.displayImageUrl = null
      state.resultImageUrl = null
    },
    setDisplayImageFromFile: (state, { payload }) => {
      state.displayImageUrl = payload
      state.inputImageUrl = payload
    },
    setResultImage: (state, { payload }) => {
      state.displayImageUrl = payload
      state.resultImageUrl = payload
      state.processing = false
    },
    stopProcessing: (state) => {
      state.processing = false
    },
  },
  extraReducers: (builder) => {
    // uploadImage
    builder.addCase(uploadImage.pending, (state, { meta: { arg } }) => {
      state.displayImageUrl = URL.createObjectURL(arg)
      state.uploading = true
    })
    builder.addCase(uploadImage.fulfilled, (state, { payload }) => {
      state.inputImageUrl = payload
      state.displayImageUrl = payload
      state.uploading = false
    })
    builder.addCase(uploadImage.rejected, (state, action) => {
      state.uploading = false
      notification.error("nooooope")
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
