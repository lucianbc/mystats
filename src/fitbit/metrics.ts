import { Token } from "./auth";
import axios from "axios";

export async function sleep(accessToken: Token, userId: String) {
  const URL = `https://api.fitbit.com/1.2/user/${userId}/sleep/date/2020-07-25.json`;
  const result = await axios.get(URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result;
}
