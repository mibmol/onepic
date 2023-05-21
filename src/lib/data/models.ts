import { compose, flatten, pluck, prop, propEq } from "ramda"
import { isNotNil } from "@/lib/utils"

type ModelField = {
  name: string
  type?: "file" | "text" | "select" | "integer" | "float" | "boolean" | "integer-select"
  values?: { labelToken: string; value: any; credits?: number }[]
  defaultValue?: any
  labelToken?: string
  min?: number
  max?: number
}
type ModelInputType = {
  name: string
  type: "file" | "text"
}

export type Model = {
  name: string
  credits?: number
  labelToken?: string
  replicateURL: string
  version: string
  modelInputType: ModelInputType
  fields?: ModelField[]
  autoSubmit?: boolean
}

type AIFeature = {
  featureId: string
  path: string
  titleToken: string
  actionToken: string
  descriptionToken: string
  models: Model[]
  openGraphImage: string
  openGraphTitle: string
}

export const aiFeatures: AIFeature[] = [
  {
    path: "restore-photo-image",
    featureId: "restorePhoto",
    titleToken: "feature.restorePhotos.title",
    descriptionToken: "feature.restorePhotos.description",
    actionToken: "Restore image",
    openGraphTitle: "Image restoration",
    openGraphImage: "/images/old_og.jpg",
    models: [
      {
        name: "GFPGAN",
        credits: 1,
        labelToken: "feature.restorePhotos.options.faster",
        replicateURL: "https://replicate.com/tencentarc/gfpgan",
        version: "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        modelInputType: {
          name: "img",
          type: "file",
        },
        fields: [
          {
            name: "version",
            defaultValue: "v1.4",
          },
          {
            name: "scale",
            type: "integer-select",
            labelToken: "fieldLabel.scale",
            defaultValue: 2,
            values: [
              { labelToken: "x2", value: 2 },
              { labelToken: "x4", value: 4 },
              { labelToken: "x6", value: 6, credits: 2 },
              { labelToken: "x8", value: 8, credits: 3 },
            ],
          },
        ],
      },
      {
        name: "CVPR 2020",
        credits: 2,
        labelToken: "feature.restorePhotos.options.slower",
        replicateURL: "https://replicate.com/microsoft/bringing-old-photos-back-to-life",
        version: "c75db81db6cbd809d93cc3b7e7a088a351a3349c9fa02b6d393e35e0d51ba799",
        modelInputType: {
          name: "image",
          type: "file",
        },
        fields: [
          {
            name: "HR",
            type: "boolean",
            labelToken: "fieldLabel.inputIsHighResolution",
          },
          {
            name: "with_scratch",
            type: "boolean",
            labelToken: "fieldLabel.withScratch",
          },
        ],
      },
    ],
  },
  {
    path: "quality-resolution-enhancer",
    featureId: "qualityEnhancer",
    titleToken: "feature.qualityEnhancer.title",
    descriptionToken: "feature.qualityEnhancer.description",
    actionToken: "Upscale image",
    openGraphTitle: "Image upscaler & Quality enhancer",
    openGraphImage: "/images/upscaler_og.jpg",
    models: [
      {
        name: "REAL-ESRGAN",
        labelToken: "feature.qualityEnhancer.options.slower",
        credits: 1,
        replicateURL: "https://replicate.com/nightmareai/real-esrgan",
        version: "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
        modelInputType: {
          name: "image",
          type: "file",
        },
        fields: [
          {
            name: "scale",
            type: "integer-select",
            labelToken: "fieldLabel.scale",
            defaultValue: 2,
            values: [
              { labelToken: "x2", value: 2 },
              { labelToken: "x4", value: 4 },
              { labelToken: "x6", value: 6, credits: 2 },
              { labelToken: "x8", value: 8, credits: 3 },
            ],
          },
          {
            name: "face_enhance",
            type: "boolean",
            labelToken: "fieldLabel.faceEnhance",
            defaultValue: false,
          },
        ],
      },
      {
        name: "REAL-ESRGAN-A100",
        labelToken: "feature.qualityEnhancer.options.faster",
        credits: 2,
        replicateURL: "https://replicate.com/daanelson/real-esrgan-a100",
        version: "499940604f95b416c3939423df5c64a5c95cfd32b464d755dacfe2192a2de7ef",
        modelInputType: {
          name: "image",
          type: "file",
        },
        fields: [
          {
            name: "scale",
            type: "integer-select",
            labelToken: "fieldLabel.scale",
            defaultValue: 2,
            values: [
              { labelToken: "x2", value: 2 },
              { labelToken: "x4", value: 4 },
              { labelToken: "x6", value: 6, credits: 2 },
              { labelToken: "x8", value: 8, credits: 3 },
            ],
          },
          {
            name: "face_enhance",
            type: "boolean",
            labelToken: "fieldLabel.faceEnhance",
            defaultValue: false,
          },
        ],
      },
    ],
  },
  {
    path: "remove-background",
    featureId: "removeBackground",
    titleToken: "feature.removeBackground.title",
    descriptionToken: "feature.removeBackground.description",
    actionToken: "Remove background",
    openGraphTitle: "Background Removal",
    openGraphImage: "/images/rembg_og.jpg",
    models: [
      {
        name: "ModNET",
        credits: 0,
        autoSubmit: true,
        replicateURL: "https://replicate.com/pollinations/modnet",
        version: "4f40b36544786857fbc499be0996ba5152627ce61d614eeab7e19a7e1fd61ac6",
        modelInputType: {
          name: "image",
          type: "file",
        },
        fields: [],
      },
      {
        name: "RemBG",
        credits: 0,
        autoSubmit: true,
        replicateURL: "https://replicate.com/cjwbw/rembg",
        version: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        modelInputType: {
          name: "image",
          type: "file",
        },
        fields: [],
      },
    ],
  },
  {
    path: "colorize-image",
    featureId: "colorizeImage",
    titleToken: "feature.colorizeImage.title",
    descriptionToken: "feature.colorizeImage.description",
    actionToken: "Colorize image",
    openGraphTitle: "Image colorization",
    openGraphImage: "/images/colorize_og.jpg",
    models: [
      {
        name: "Deoldify",
        credits: 1,
        replicateURL: "https://replicate.com/arielreplicate/deoldify",
        version: "0bd6fc67227010511fd1b54dc2f3ba3412867ea5a5e5ce92634f45f9ef493665",
        modelInputType: {
          name: "input_image",
          type: "file",
        },
        fields: [],
      },
    ],
  },
]

export const getModelsByFeatureId = (featureId: string) =>
  prop("models", aiFeatures.find(propEq("featureId", featureId)))

export const allModels: Model[] = compose(flatten, pluck("models") as any)(aiFeatures)
export const freeModels: Model[] = allModels.filter(propEq("credits", 0) as any)

export const getModelByName = (modelName: string, models?: Model[]): Model =>
  models
    ? models.find(propEq("name", modelName))
    : allModels.find(propEq("name", modelName))

export function getFeatureByModelName(modelName: string): AIFeature {
  for (const feature of aiFeatures) {
    const model = getModelByName(modelName, feature.models)
    if (model) {
      return feature
    }
  }
  return null
}

export function isFreeModel(modelName: string) {
  return isNotNil(freeModels.find(propEq("name", modelName)))
}
