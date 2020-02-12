import { ValidateNested, IsUUID, Min } from 'class-validator';

export class MatchDTO {
  @IsUUID() 
  public uuid: string;

  @Min(0) 
  public movieId: number;

  @ValidateNested({ each: true }) 
  public skill: Array<number>;
}

