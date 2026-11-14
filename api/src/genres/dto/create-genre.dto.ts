import { IsString, IsNotEmpty, Matches } from "class-validator";

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: "slug can only have lowercase letters, numbers and dashes",
  })
  slug!: string;
}