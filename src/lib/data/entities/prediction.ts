import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
  Max,
  Min,
} from "class-validator"

export class Prediction {
  @Length(4, 64)
  modelName: string

  @IsUrl()
  input: string

  @IsOptional()
  @Length(3, 5)
  version?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  scale?: number

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(1)
  codeformer_fidelity?: number

  @IsOptional()
  @IsBoolean()
  background_enhance?: boolean

  @IsOptional()
  @IsBoolean()
  face_upsample?: boolean

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  upscale?: number

  @IsOptional()
  @IsBoolean()
  HR?: boolean

  @IsOptional()
  @IsBoolean()
  with_scratch?: boolean

  @IsOptional()
  @IsBoolean()
  face_enhance?: boolean

  setValues(values: any) {
    Object.assign(this, values)
    return this
  }
}
