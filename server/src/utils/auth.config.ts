import getConfig from "./config";

const config = getConfig();
export const authConfig = {
  smtpHost: config.smtpHost,
  smtpPort: config.smtpPort ? parseInt(config.smtpPort, 10) : undefined,
  smtpApikeyPublic: config.smtpApikeyPublic,
  smtpApikeyPrivate: config.smtpApikeyPrivate,
  appUrl: config.appUrl,
  jwtSecret:
    config.jwt_secret ??
    (() => {
      throw new Error("JWT secret is missing");
    })(),
  jwtExpiration: 86400, // 24 hours
  googleClientId:
    config.googleClientId ??
    (() => {
      throw new Error("Google Client ID is missing");
    })(),
  googleClientSecret:
    config.googleSecret ??
    (() => {
      throw new Error("Google Client Secret is missing");
    })(),
  callbackURL:
    config.googleCallback ??
    (() => {
      throw new Error("Google Callback URL is missing");
    })(),
  sessionSecret:
    config.cookieSecretKey ??
    (() => {
      throw new Error("Session secret is missing");
    })(),
};
