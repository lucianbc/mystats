import auth, { AuthKey, Token } from "./auth";
import * as metrics from "./metrics";
import { Persistor } from "../persistence";
import { RefreshTokenManager } from "./refreshTokenManager";

export interface Api {
  sleep: (date: String) => Promise<void>;
}

export async function create(
  key: AuthKey,
  refreshTokenManager: RefreshTokenManager,
  userId: String,
  persistor: Persistor
): Promise<Api> {
  const token = await auth.authenticate(key, refreshTokenManager);
  return {
    sleep: async (date: metrics.Date) => {
      const path = `/fitbit/sleep/${date}/data.json`;
      const sleep = await metrics.sleep(token.access_token, userId, date);
      persistor.persist(path, sleep);
    },
  };
}
