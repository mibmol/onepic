import { compose, flatten, pluck, prop, propEq } from "ramda"

type ModelField = {
  name: string
  type?: "file" | "text" | "select" | "integer" | "float" | "boolean"
  values?: any[]
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
  replicateURL: string
  version: string
  modelInputType: ModelInputType
  fields?: ModelField[]
}

type AIFeature = {
  featureId: string
  path: string
  titleToken: string
  descriptionToken: string
  models: Model[]
}

export const aiFeatures: AIFeature[] = [
  {
    path: "restore-photo-image",
    featureId: "restorePhoto",
    titleToken: "feature.restorePhotos",
    descriptionToken: "feature.restorePhotosDescription",
    models: [
      {
        name: "GFPGAN",
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
            type: "integer",
            labelToken: "fieldLabel.scale",
            defaultValue: 2,
            min: 1,
            max: 10,
          },
        ],
      },
      {
        name: "CodeFormer",
        replicateURL: "https://replicate.com/sczhou/codeformer",
        version: "7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
        modelInputType: {
          name: "image",
          type: "file",
        },
        fields: [
          {
            name: "codeformer_fidelity",
            type: "float",
            labelToken: "fieldLabel.codeformerFidelity",
            defaultValue: 0.5,
            min: 0.1,
            max: 1,
          },
          {
            name: "background_enhance",
            type: "boolean",
            labelToken: "fieldLabel.backgroundEnhance",
            defaultValue: false,
          },
          {
            name: "face_upsample",
            type: "boolean",
            labelToken: "fieldLabel.faceUpsample",
            defaultValue: true,
          },
          {
            name: "upscale",
            type: "integer",
            labelToken: "fieldLabel.upscale",
            defaultValue: 2,
            min: 1,
            max: 10,
          },
        ],
      },
      {
        name: "CVPR 2020",
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
    titleToken: "feature.qualityEnhancer",
    descriptionToken: "feature.qualityEnhancerDescription",
    models: [
      {
        name: "REAL-ESRGAN",
        replicateURL: "https://replicate.com/nightmareai/real-esrgan",
        version: "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
        modelInputType: {
          name: "image",
          type: "file",
        },
        fields: [
          {
            name: "scale",
            type: "integer",
            labelToken: "fieldLabel.scale",
            defaultValue: 5,
            min: 1,
            max: 10,
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
    titleToken: "feature.removeBackground",
    descriptionToken: "feature.removeBackgroundDescription",
    models: [
      {
        name: "ModNET",
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
    titleToken: "feature.colorizeImage",
    descriptionToken: "feature.colorizeImageDescription",
    models: [
      {
        name: "Deoldify",
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

const allModels = compose(flatten, pluck("models") as any)(aiFeatures)

export const getModelByName = (modelName: string, models?: Model[]): Model =>
  models
    ? models.find(propEq("name", modelName))
    : allModels.find(propEq("name", modelName))
