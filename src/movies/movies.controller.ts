import { Controller, Post, Body, Get, Param, Patch, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MoviesService } from './movies.service';
import { CreateMovieDTO } from './dto/create-movies.dto';
import { UpdateMovieDTO } from './dto/update-movies.dto';
import { Movie } from './movies.model';
import { JwtAuthGuard } from '../common/jwt.guard';

// TODO
// Add roles to routes so users can add and update movies

@Controller('/api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  addMovies(@Body() movie: CreateMovieDTO): Movie {
    return this.moviesService.insertMovie(movie);
  }

  // For development only
  // @Get()
  // getAllMovies(): object {
  //   return this.moviesService.getMovies();
  // }

  // Get single movie by movie id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMovie(@Param('id', new ParseIntPipe()) movieId: number): Movie {
    return this.moviesService.getMovie(movieId);
  }

  // ADD ROLE TO THIS ROUTE
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateMovie(@Param('id', new ParseIntPipe()) movieId: number, @Body() movie: UpdateMovieDTO): object {
    this.moviesService.updateMovie(movieId, movie);
    return { message: 'Movie Updated' };
  }
}
