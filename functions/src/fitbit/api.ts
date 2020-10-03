import auth, { AuthKey } from "./auth";
import * as metrics from "./metrics";
import { Persistor } from "../persistence";
import { RefreshTokenManager } from "./refreshTokenManager";

export interface Api {
  sleep: (date: string) => Promise<void>;
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
      const path = `/fitbit/sleep/byDay/${date}.json`;
      const sleep = await metrics.sleep(token.access_token, userId, date);
      await persistor.persist(path, sleep);
    },
  };
}
