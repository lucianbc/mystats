import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { create } from "./fitbit/api";
import { AuthKey } from "./fitbit/auth";
import { createFirebaseTokenManager } from "./fitbit/refreshTokenManager";
import { createFirebasePersistor } from "./persistence";
import { isValidDate } from "./validators";
import * as moment from "moment";
import { DATE_FORMAT } from "./fitbit/metrics";

const config = functions.config();
const adminInstance = admin.initializeApp(config.firebase);
const firestore = adminInstance.firestore();

export const myStats = functions.https.onRequest(async (request, response) => {
  const date = request.query["date"] as string;
  const validation = isValidDate(date);
  if (validation !== true) {
    response.status(400).send(validation);
    return;
  }

  const fitbit = await createFitbit(config, firestore);
  await fitbit.sleep(date);

  response.send("Succesfully performed fitbit stuff for date " + date);
});

export const setToken = functions.https.onRequest(async (request, response) => {
  const fitbit = createFirebaseTokenManager(firestore);
  const token = request.query["token"] as string;
  await fitbit.persistToken(token);
  response.send("Succesfully written token");
});

const timeZone = "Europe/London";
export const scheduledStats = functions.pubsub
  .schedule("00 23 * * *")
  .onRun(async () => {
    const date = moment(
      new Date().toLocaleString("en-UK", { timeZone })
    ).format(DATE_FORMAT);
    functions.logger.info(`Mystats schedule running now with date ${date}`);
    const fitbit = await createFitbit(config, firestore);
    await fitbit.sleep(date);
    functions.logger.info(`Finished running for date ${date}`);
  });

const createFitbit = async (
  config: ReturnType<typeof functions.config>,
  firestore: FirebaseFirestore.Firestore
) => {
  const key: AuthKey = {
    tokenUrl: config.key.url,
    clientId: config.key.id,
    clientSecret: config.key.secret,
  };
  const userId = config.user.id;
  const tokenMgr = createFirebaseTokenManager(firestore);
  const persistor = createFirebasePersistor(firestore);
  const fitbitApi = await create(key, tokenMgr, userId, persistor);
  return fitbitApi;
};
