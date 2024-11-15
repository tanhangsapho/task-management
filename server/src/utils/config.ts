import dotenv from "dotenv";
// import APIError from "../errors/api-error";
import path from "path";

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  // Validate essential configuration
  const requiredConfig = [
    "NODE_ENV",
    "PORT",
    "MONGODB_URL",
    "LOG_LEVEL",
    "GITHUB_CLIENTID",
    "GITHUB_CLIENTSECRET",
    "GITHUB_URL",
    "GITHUB_CALLBACK",
    "GOOGLE_CLIENTID",
    "GOOGLE_CALLBACK",
    "GOOGLE_URL",
    "GOOGLE_CLIENTSECRET",
    "COOKIE_SECRET_KEY",
    "SMTP_HOST",
    "SMTP_PORT",
    "FRONTEND_URL",
    "APP_URL",
    "SMTP_APIKEY_PUBLIC",
    "SMTP_APIKEY_PRIVATE",
    "JWT_SECRET",
  ];
  const missingConfig = requiredConfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingConfig.join(", ")}`
    );
  }

  // Return configuration object
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    appUrl: process.env.APP_URL,
    githubClientId: process.env.GITHUB_CLIENTID,
    githubClientSecret: process.env.GITHUB_CLIENTSECRET,
    githubUrl: process.env.GITHUB_URL,
    githubCallBack: process.env.GITHUB_CALLBACK,
    frontend_Url: process.env.FRONTEND_URL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpApikeyPublic: process.env.SMTP_APIKEY_PUBLIC,
    smtpApikeyPrivate: process.env.SMTP_APIKEY_PRIVATE,
    cookieSecretKey: process.env.COOKIE_SECRET_KEY,
    googleClientId: process.env.GOOGLE_CLIENTID,
    googleSecret: process.env.GOOGLE_CLIENTSECRET,
    googleUrl: process.env.GOOGLE_URL,
    googleCallback: process.env.GOOGLE_CALLBACK,
    jwt_secret: process.env.JWT_SECRET,
    logLevel: process.env.LOG_LEVEL,
    mongoUrl: process.env.MONGODB_URL,
  };
}

const getConfig = (currentEnv: string = "development") => {
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../../configs/.env`)
      : path.join(__dirname, `../../configs/.env.${currentEnv}`);
  return createConfig(configPath);
};

export default getConfig;
