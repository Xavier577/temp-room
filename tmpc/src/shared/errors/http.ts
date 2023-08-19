export class HttpException extends Error {
  constructor(
    public readonly code: number,
    public readonly message: string,
  ) {
    super(message);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(public readonly customMessage?: string) {
    super(500, customMessage ?? 'Internal Server Error');
  }
}

export class ConflictException extends HttpException {
  constructor(public readonly customMessage?: string) {
    super(409, customMessage ?? 'conflict');
  }
}

export class BadException extends HttpException {
  constructor(public readonly customMessage?: string) {
    super(400, customMessage ?? 'Bad Request');
  }
}

export class ForbiddenException extends HttpException {
  constructor(public readonly customMessage?: string) {
    super(403, customMessage ?? 'Forbidden');
  }
}

export class UnAuthorizedException extends HttpException {
  constructor(public readonly customMessage?: string) {
    super(401, customMessage ?? 'UNAUTHORIZED');
  }
}

export class NotFoundException extends HttpException {
  constructor(public readonly customMessage?: string) {
    super(404, customMessage ?? 'Not Found');
  }
}
