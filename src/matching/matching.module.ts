import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MoviesService } from '../movies/movies.service';

@Module({
  controllers: [MatchingController],
  providers: [MatchingService, MoviesService],
})
export class MatchingModule {}
