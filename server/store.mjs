// Where the saved state lives. The server saves one versioned document; a save succeeds only if nobody else saved since it was read.
// This in-memory store is for tests and local runs; the AWS one (DynamoDB) has the same two methods.
export function memoryStore() {
  let version = 0, state = null;
  return {
    async get() { return { version, state: state === null ? null : JSON.parse(state) }; },
    async put(expectedVersion, next) {
      if (expectedVersion !== version) return false;
      state = JSON.stringify(next); version += 1; return true;
    },
  };
}
