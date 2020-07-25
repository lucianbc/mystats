import auth, { AuthKey, Token } from "./auth";
import * as metrics from "./metrics";
import { Persistor } from "../persistence";

export interface Api {
  sleep: (date: String) => Promise<void>;
}

async function create(
  key: AuthKey,
  refreshToken: Token,
  userId: String,
  persistor: Persistor
): Promise<Api> {
  const token = await auth.authenticate(key, refreshToken);
  return {
    sleep: async (date: String) => {
      const path = `/fitbit/sleep/${date}/data.json`;
      const sleep = await metrics.sleep(token.access_token, userId);
      persistor.persist(path, sleep);
    },
  };
}
