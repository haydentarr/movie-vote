import {
  IsOptional,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  IsNumber,
  Min, 
  Max,
  IsUrl,
  ArrayUnique,
  ArrayMaxSize, 
  } from 'class-validator';
  
export class CreateMovieDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 200) 
  public name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1900) 
  public year: number;

  @IsNotEmpty()
  @Min(0)
  @Max(100) 
  public rottentomatoes: number;

  @IsNotEmpty()
  @Min(0)
  @Max(100) 
  public metacritic: number;

  @IsNotEmpty()
  @IsUrl()
  @Length(11, 200) 
  public image: string;

  @IsOptional()
  @ArrayUnique()
  @ArrayMaxSize(50)
  @MaxLength(100, { each: true, message: "Tag is too long. Maximal length is $value characters" })
  public tags: string[];
}
