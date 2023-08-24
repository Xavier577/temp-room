export enum AppEnv {
  PRODUCTION = 'production',
  STAGING = 'staging',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

export enum LOGIN_MODE {
  USERNAME = 'username',
  EMAIL = 'email',
}

export enum Duration {
  SECOND = 1_000,
  MINUTE = 60 * SECOND,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR,
}
