import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { Movie } from './movies.model';
import { CreateMovieDTO } from './dto/create-movies.dto';
import { UpdateMovieDTO } from './dto/update-movies.dto';

// TODO
// Move to database
// Insert movie conflict check

@Injectable()
export class MoviesService implements OnModuleInit {
  private movies: Movie[] = [];

  // Seed movies with default movie list
  async onModuleInit(): Promise<void> {
    const rawdata = fs.readFileSync('./src/common/seed/movies.data.json');
    const movieList = JSON.parse(rawdata.toString());

    let k = Object.keys(movieList).length - 1;
    do {
      this.insertMovie(movieList[k]);
      k -= 1;
    } while (k > -1);
  }

  insertMovie(movie: CreateMovieDTO): Movie {
    // Mising validation pipe
    const movieId = this.movies.length;
    const newMovie = new Movie(
      movieId,
      movie.name,
      movie.year,
      movie.rottentomatoes,
      movie.metacritic,
      movie.image,
      movie.tags,
    );
    this.movies.push(newMovie);
    return newMovie;
  }

  getMovies(): object[] {
    return [...this.movies];
  }

  getMovie(movieId: number): Movie {
    const movie = this.findMovie(movieId)[0];
    return { ...movie };
  }

  updateMovie(movieId: number, movieData: UpdateMovieDTO): void {
    const [movie, index] = this.findMovie(movieId);
    const updatedMovie = { ...movie, ...movieData};

    this.movies[index] = updatedMovie;
  }

  private findMovie(id: number): [Movie, number] {
    // ID param is passed as string, needs to be a iterated id.
    const movieIndex = this.movies.findIndex(movie => movie.id === id);
    const movie = this.movies[movieIndex];
    if (!movie) {
      throw new NotFoundException('Could not find movie.');
    }
    return [movie, movieIndex];
  }
}
