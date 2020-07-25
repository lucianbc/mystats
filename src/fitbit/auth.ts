import axios from "axios";
import qs from "qs";

export interface AuthKey {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface AccessToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export type Token = String;

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
 * @param refreshToken the refresh token obtained by following the oauth tutorial on fitbit website.
 */
export async function authorizationCode(key: AuthKey, refreshToken: Token) {
  const payload = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };
  return tokenRequest(key, payload);
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
