export const devFrontendUrl = "http://localhost:3000";
export const prodFrontendUrl = "https://reddit-clone-rosy-six.vercel.app";
export const localDomain = "localhost";
export const prodDomain = "reddit-clone-rosy-six.vercel.app";

interface TsQuery {
  andStr: string;
  orStr: string;
}

export const tsQuery = (query: string): TsQuery => {
  const arr = query.split(" ");

  for (let i = 0; i < arr.length - 1; i++) {
    arr[i] += " &";
  }

  const andStr: string = arr.join(" ");
  const orStr: string = andStr.replace(/&/g, "|");

  return {
    andStr,
    orStr,
  };
};
