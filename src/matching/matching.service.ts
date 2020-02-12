import { Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/camelcase
import { Rating, quality_1vs1, rate_1vs1, winProbability } from 'ts-trueskill';
import { MoviesService } from '../movies/movies.service';

import { Rank } from './matching.model';
import { MatchDTO } from './dto/matching.dto';
import { RankDTO } from './dto/rank.dto';
import { ok } from 'assert';

// TODO
// Move rankings to database

@Injectable()
export class MatchingService {
  constructor(private readonly moviesService: MoviesService) {}

  private rankList: MatchDTO[] = [];

  async getFullList(): Promise<object> {
    return [...this.rankList];
  }

  async getRankList(uuid: string): Promise<object> {
    const result = [];
    const userList = this.rankList.filter(obj => obj.uuid === uuid);
    if (!userList || !userList.length) throw new NotFoundException(`No movie rankings found`);
    let k = userList.length - 1;
    do {
      const movie = this.moviesService.getMovie(userList[k].movieId);
      result.push({ ...movie, rank: userList[k].skill[0] });
      k -= 1;
    } while (k > -1);
    return result;
  }

  /*
   ** Get two random quality matches and return the movies and winProbability
   */
  async getMatch(uuid: string): Promise<object> {
    const [movie1, winP1, movie2, winP2] = await this.qualityMatch(uuid);

    return [
      { ...movie1, winProbability: winP1, fighting: movie2.id },
      { ...movie2, winProbability: winP2, fighting: movie1.id },
    ];
  }

  async rankMatch(movies: RankDTO['movies'], uuid: string): Promise<object> {
    let k = movies.length - 1;
    const skills = [];
    const index = [];

    do {
      const p = movies[k]; // To avoid referencing inside loop
      index[k] = this.rankList.findIndex(movieg => movieg.movieId === p && movieg.uuid === uuid);
      const movie = this.rankList[index[k]];

      if (!movie) throw new NotFoundException(`Movie with id ${movies[k]} not found`);

      skills[k] = new Rating(movie.skill[0]);

      k -= 1;
    } while (k > -1);

    const ranks = rate_1vs1(skills[0], skills[1]);

    this.rankList[index[0]].skill = [ranks[0].mu, ranks[0].sigma];
    this.rankList[index[1]].skill = [ranks[1].mu, ranks[1].sigma];

    return { status: 'OK', message: 'Rank updated' };
  }

  /*--------------------------------------------------------
   ** HELPER FUNCTIONS BELOW
   **--------------------------------------------------------*/

  /*
   ** Check the quality of a match, make sure it meets a certain bar,
   ** so that the matches are fair.
   */
  private async qualityMatch(uuid: string): Promise<any> {
    let movies: object;
    let winP1: number;
    let winP2: number;
    let q = 0;
    let i = 0;
    const movieList = this.moviesService.getMovies();

    do {
      movies = this.selectPairs(2);
      const [p1Skill, p2Skill] = this.getRating(movies, uuid);
      q = quality_1vs1(p1Skill, p2Skill);
      // Modulo not as accurate on dead even fights, but close enough.
      winP1 = winProbability([p1Skill], [p2Skill]);
      winP2 = 1 % winP1;
      i += 1;

      if (i > movieList.length) q = 0.5;
    } while (q < 0.35); // If quality of the match is less than .3 loop

    return [movies[0], winP1, movies[1], winP2];
  }

  /*
   ** Randomly choose two pairs from the list of movies.
   */
  private selectPairs(k: number): object[] {
    const movieList = this.moviesService.getMovies();

    const n: number = Object.keys(movieList).length;
    const result: object[] = new Array(k);
    const selected = new Set();

    for (let i = 0; i < k; i += 1) {
      /* eslint no-bitwise: ["error", { "int32Hint": true }] */
      let j = (Math.random() * (n - i)) | 0;
      while (selected.has(j)) {
        j = (Math.random() * (n - i)) | 0;
      }
      selected.add(j);
      result[i] = movieList[j];
    }
    return result;
  }

  /*
   ** Get the rating of each movie in the set, if rating doesn't exist
   ** add it with a reference to current user.
   */
  private getRating(movies: object, uuid: string): Rating[] {
    let k = Object.keys(movies).length - 1;
    const skill: Rating[] = [];

    do {
      const p = movies[k]; // To avoid referencing inside loop
      const index = this.rankList.findIndex(movie => movie.movieId === p.id && movie.uuid === uuid);
      let movie = this.rankList[index];

      if (!movie) movie = this.addRank(p.id, uuid);
      skill[k] = new Rating(movie.skill[0]);

      k -= 1;
    } while (k > -1);

    return [skill[0], skill[1]];
  }

  /*
   ** Add new user ranking to ranklist, base skill is [20, 8.33333]
   */

  private addRank(movieId: number, uuid: string, skill: number[] = [25.0, 25 / 3]): MatchDTO {
    const rank = new Rank(uuid, movieId, skill);

    this.rankList.push(rank);
    return rank;
  }
}
