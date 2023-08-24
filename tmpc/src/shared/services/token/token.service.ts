import jwt from 'jsonwebtoken';
import Env from '../../utils/env';
import { Duration } from '../../enums';
export interface TokenService {
  generate(data: string | Buffer | object, expiresIn?: string | number): string;
  generateAsync(
    data: string | Buffer | object,
    expiresIn?: string | number,
  ): Promise<string>;
  verify(token: string): string | jwt.JwtPayload;
  verifyAsync(token: string): Promise<string | jwt.JwtPayload>;
}

export interface TokenServiceOptions {
  secret: string;
  expiresIn?: string | number;
}

export class TokenServiceImpl implements TokenService {
  constructor(private readonly options: TokenServiceOptions) {}
  public generate(
    data: string | Buffer | object,
    expiresIn?: string | number,
  ): string {
    return jwt.sign(data, this.options.secret, {
      expiresIn: expiresIn ?? this.options.expiresIn ?? Duration.HOUR,
    });
  }

  public generateAsync(
    data: string | Buffer | object,
    expiresIn?: string | number,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        data,
        this.options.secret,
        { expiresIn: expiresIn ?? this.options.expiresIn ?? Duration.HOUR },
        (err, encoded) => {
          if (err != null) {
            reject(err);
          }

          if (encoded != null) {
            resolve(encoded);
          }
        },
      );
    });
  }

  public verify<T extends string | jwt.JwtPayload>(token: string): T {
    return <T>jwt.verify(token, this.options.secret);
  }

  public async verifyAsync<T extends string | jwt.JwtPayload>(
    token: string,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      jwt.verify(token, this.options.secret, (err, decoded) => {
        if (err != null) {
          reject(err);
        }

        resolve(<T>decoded);
      });
    });
  }
}

const tokenService = new TokenServiceImpl({
  secret: Env.get<string>('JWT_SECRET'),
});

export default tokenService;
