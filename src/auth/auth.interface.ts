export interface Jwt {
  sub: string,
  email?: string,
  iat: number,
  exp: number
}

export interface Tokens {
  refreshToken?: string,
  accessToken?: string
}