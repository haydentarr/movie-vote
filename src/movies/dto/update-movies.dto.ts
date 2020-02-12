import {
    IsOptional,
    IsString,
    Length,
    MaxLength,
    MinLength,
    IsNumber,
    Min, 
    Max,
    IsUrl,
    ArrayUnique,
    ArrayMaxSize, 
    } from 'class-validator';

// Min, Max relate to numeric values
// Length checks string length falls between min and max value

export class UpdateMovieDTO {
  @IsOptional()
  @IsNumber() 
  public id: number;

  @IsOptional()
  @IsString()
  @Length(1, 200) 
  public name: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  public year: number;

  @IsOptional()
  @Min(0)
  @Max(100) 
  public rottentomatoes: number;

  @IsOptional()
  @Min(0)
  @Max(100) 
  public metacritic: number;

  @IsOptional()
  @IsUrl()
  @Length(11, 200) 
  public image: string;

  @IsOptional()
  @ArrayUnique()
  @ArrayMaxSize(50)
  @MinLength(3, { each: true, message: "Tag is too short. Minimal length is $value characters" })
  @MaxLength(100, { each: true, message: "Tag is too long. Maximal length is $value characters" })
  public tags: string[];
}
