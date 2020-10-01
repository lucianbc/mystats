import { Token } from "./auth";
import { promises as fs } from "fs";
import "firebase-admin";

export interface RefreshTokenManager {
  persistToken: (token: Token) => Promise<void>;
  fetchToken: () => Promise<Token>;
}

const FILE_NAME = "token.txt";
const encoding = "utf-8";

export const FileTokenManager: RefreshTokenManager = {
  persistToken: async (token) => {
    await fs.writeFile(FILE_NAME, token, encoding);
  },
  fetchToken: async () => {
    const token = await fs.readFile(FILE_NAME, encoding);
    return token;
  },
};

export const createFirebaseTokenManager = (
  firestore: FirebaseFirestore.Firestore
): RefreshTokenManager => {
  const path = "/fitbit/utils";
  const id = "refreshToken";
  const docHandle = () => firestore.collection(path).doc(id);
  return {
    persistToken: async (token) => {
      await docHandle().set({
        refreshToken: token,
      });
    },
    fetchToken: async () => {
      const document = await docHandle().get();
      return document.data()?.refreshToken as string;
    },
  };
};
