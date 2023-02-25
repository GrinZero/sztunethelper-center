export default class JwtConfig {
  public static readonly secret = process.env.JWT_SECRET as string
}
