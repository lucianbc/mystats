import "firebase-admin";
import * as pathUtils from "path";

export interface Persistor {
  persist: (path: string, data: object) => Promise<void>;
}

export const createFirebasePersistor = (
  firestore: FirebaseFirestore.Firestore
): Persistor => ({
  persist: async (path, data) => {
    const collection = pathUtils.dirname(path);
    const key = pathUtils.basename(path);
    await firestore.collection(collection).doc(key).set(data);
  },
});

export const createLogPersistor = (): Persistor => ({
  persist: (path, data) => {
    console.debug(`Write: ${path} -> ${JSON.stringify(data, null, 2)}`);
    return Promise.resolve();
  },
});
