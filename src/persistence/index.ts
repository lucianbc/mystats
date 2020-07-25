export interface Persistor {
  persist: (path: String, data: object) => Promise<void>;
}
