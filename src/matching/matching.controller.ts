import { Controller, Get, Query, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatchingService } from './matching.service';
import { AuthUser, ParseToIntArray } from '../common/custom.decorator';
import { RankDTO } from './dto/rank.dto';

@Controller('/api/matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getMatch(@AuthUser() user): object {
    return this.matchingService.getMatch(user.uuid);
  }

  @Get('fulllist')
  getFullList(): object {
    return this.matchingService.getFullList();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  getRankList(@AuthUser() user): object {
    return this.matchingService.getRankList(user.uuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  rankMatch(@Query('movies', new ParseToIntArray()) movies: RankDTO['movies'], @AuthUser() user): object {
    return this.matchingService.rankMatch(movies, user.uuid);
  }
}
