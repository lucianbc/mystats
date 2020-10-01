import axios from "axios";
import * as qs from "qs";
import { RefreshTokenManager } from "./refreshTokenManager";

export interface AuthKey {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface AccessToken {
  access_token: Token;
  refresh_token: Token;
  expires_in: number;
  scope: string;
  token_type: string;
}

export type Token = string;

/**
 * Performs a client credentials grant authentication.
 * Fitbit does not allow user-related operations by authenticating with this flow.
 * @param key the Authentication key.
 *            Register a new app at the following link to get a key: https://dev.fitbit.com/apps
 */
export async function clientCredentials(key: AuthKey) {
  const payload = {
    grant_type: "client_credentials",
    expires_in: 3600,
  };
  return tokenRequest(key, payload);
}

/**
 * Redeems a refresh token from the Authorization Code Flow.
 * @param key the Authentication key.
 *            Register a new app at the following link to get a key: https://dev.fitbit.com/apps
 * @param refreshTokenManager token manager that provides a valid refresh token.
 *            The first token must be provided by following the tutorial on fitbit page:
 *            https://dev.fitbit.com/apps/oauthinteractivetutorial
 *            From there on, refresh tokens are invalidated as they are used, so one must keep
 *            the new ones for future usage.
 */
export async function authorizationCode(
  key: AuthKey,
  refreshTokenManager: RefreshTokenManager
) {
  const refreshToken = await refreshTokenManager.fetchToken();
  const payload = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };
  const token = await tokenRequest(key, payload);
  await refreshTokenManager.persistToken(token.refresh_token);
  return token;
}

const tokenRequest = async (key: AuthKey, payload: any) => {
  const { clientId, clientSecret, tokenUrl } = key;
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const result = await axios.post(tokenUrl, qs.stringify(payload), {
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return result.data as AccessToken;
};

export default {
  authenticate: authorizationCode,
};
