export class Movie {
  constructor(
    public id: number,
    public name: string,
    public year: number,
    public rottentomatoes: number,
    public metacritic: number,
    public image: string,
    public tags: string[],
  ) {}
}
