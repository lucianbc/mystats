import { Token } from "./auth";
import { promises as fs } from "fs";

export interface RefreshTokenManager {
  persistToken: (token: Token) => Promise<void>;
  fetchToken: () => Promise<Token>;
}

const FILE_NAME = "token.txt";
const encoding = "utf-8";

const FileTokenManager: RefreshTokenManager = {
  persistToken: async (token) => {
    await fs.writeFile(FILE_NAME, token, encoding);
  },
  fetchToken: async () => {
    const token = await fs.readFile(FILE_NAME, encoding);
    return token;
  },
};
