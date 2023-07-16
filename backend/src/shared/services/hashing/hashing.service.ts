import bcrypt from 'bcrypt';

export interface HashingService {
  hash(data: string, salt?: string): Promise<string>;
  compare(data: string, hash: string): Promise<boolean>;
  genSalt(rounds: number): Promise<string>;
}

export class HashingServiceImpl implements HashingService {
  private readonly saltRound = 10;

  public async genSalt(rounds: number): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  public async hash(
    data: string,
    salt = bcrypt.genSaltSync(this.saltRound),
  ): Promise<string> {
    return bcrypt.hash(data, salt);
  }

  public async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}

const hashingService: HashingService = new HashingServiceImpl();

export default hashingService;
