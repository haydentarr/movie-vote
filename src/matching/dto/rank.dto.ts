import { Min, IsNotEmpty } from 'class-validator';

export class RankDTO {
   @IsNotEmpty()
   @Min(0)
   public movies: number[];
}

