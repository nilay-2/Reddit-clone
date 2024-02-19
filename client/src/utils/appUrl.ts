const devBackendUrl = "http://localhost:5000";
const prodBackendUrl = "https://reddit-clone-q6r2.vercel.app";
const devFrontendUrl = "http://localhost:3000";
const prodFrontendUrl = "https://reddit-clone-rosy-six.vercel.app";

export const getFetchUrl = (): string => {
  if (process.env.NODE_ENV === "production") return prodBackendUrl;
  return devBackendUrl;
};

export const getAccessControlAllowOriginUrl = (): string => {
  if (process.env.NODE_ENV === "production") return prodFrontendUrl;
  return devFrontendUrl;
};
