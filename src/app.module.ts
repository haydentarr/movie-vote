import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MatchingModule } from './matching/matching.module';

@Module({
  imports: [MoviesModule, AuthModule, UsersModule, MatchingModule],
})
export class AppModule {}
