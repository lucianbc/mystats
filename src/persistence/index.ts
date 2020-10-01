import "firebase-admin";

export interface Persistor {
  persist: (path: String, data: object) => Promise<void>;
}

export const createFirebasePersistor = (
  firestore: FirebaseFirestore.Firestore
): Persistor => ({
  persist: async (path, data) => {
    await firestore.collection(String(path)).add(data);
  },
});

export const createLogPersistor = (): Persistor => ({
  persist: (path, data) => {
    console.debug(`Write: ${path} -> ${JSON.stringify(data, null, 2)}`);
    return Promise.resolve();
  },
});
