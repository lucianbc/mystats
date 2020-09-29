/**
 * Fitbit metrics requests
 * Docs: https://dev.fitbit.com/build/reference/web-api/
 */
import { Token } from "./auth";
import axios from "axios";

/**
 * The date of records to be returned. In the format yyyy-MM-dd
 */
export type Date = string;

export async function sleep(accessToken: Token, userId: String, date: Date) {
  const URL = `https://api.fitbit.com/1.2/user/${userId}/sleep/date/${date}.json`;
  const result = await axios.get(URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result;
}
