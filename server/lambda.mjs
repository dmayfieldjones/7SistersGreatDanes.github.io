// AWS Lambda entry point. Settings come from the stack's environment variables.
import { makeHandler } from './handler.mjs';
import { makeVerifier, fetchingKeys } from './auth.mjs';
import { dynamoStore, realDynamoClient } from './store-dynamo.mjs';

const { REGION, POOL_ID, CLIENT_ID, TABLE, ADMIN_USERS = 'dmj', ALLOW_ORIGIN = '*' } = process.env;
let handler = null;

export async function handle(event) {
  if (!handler) {
    handler = makeHandler({
      store: dynamoStore({ client: await realDynamoClient(REGION), table: TABLE }),
      verify: makeVerifier({ region: REGION, poolId: POOL_ID, clientId: CLIENT_ID, getKeys: fetchingKeys() }),
      adminUsers: ADMIN_USERS.split(',').map((s) => s.trim()).filter(Boolean),
      allowOrigin: ALLOW_ORIGIN,
    });
  }
  return handler(event);
}
