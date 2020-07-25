import axios from "axios";
import qs from "qs";
import { debug } from "console";

export interface AuthKey {
  url: string;
  apiKey: string;
  apiSecret: string;
}

export interface AccessToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

type Token = string;

export function auth({ url, apiKey, apiSecret }: AuthKey) {
  async function authenticate() {
    const token = new Buffer(`${apiKey}:${apiSecret}`).toString("base64");
    const payload = {
      grant_type: "client_credentials",
      expires_in: 3600,
    };
    const result = await axios.post(url, qs.stringify(payload), {
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return result.data as AccessToken;
  }

  return { authenticate };
}
