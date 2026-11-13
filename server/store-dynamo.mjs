// The saved state in DynamoDB: one item holding the whole state, gzip-compressed, with a version number.
// A save succeeds only if the stored version is still the one that was read (a conditional write), so two people saving at once
// cannot overwrite each other: the loser reads again and redoes its call.
import { gzipSync, gunzipSync } from 'node:zlib';

export function dynamoStore({ client, table, key = 'state' }) {
  // client: { send(command) } with the AWS SDK v3 DynamoDB commands; commands are passed in so tests can fake them
  const { GetItemCommand, PutItemCommand } = client.commands;
  return {
    async get() {
      const r = await client.send(new GetItemCommand({ TableName: table, Key: { pk: { S: key } }, ConsistentRead: true }));
      if (!r.Item) return { version: 0, state: null };
      return { version: Number(r.Item.version.N), state: JSON.parse(gunzipSync(Buffer.from(r.Item.data.B)).toString()) };
    },
    async put(expectedVersion, next) {
      const data = gzipSync(Buffer.from(JSON.stringify(next)));
      if (data.length > 350000) throw new Error('saved state is too large');   // DynamoDB items stop at 400 KB
      try {
        await client.send(new PutItemCommand({
          TableName: table,
          Item: { pk: { S: key }, version: { N: String(expectedVersion + 1) }, data: { B: data }, saved: { S: new Date().toISOString() } },
          ConditionExpression: expectedVersion === 0 ? 'attribute_not_exists(pk)' : '#v = :v',
          ...(expectedVersion === 0 ? {} : { ExpressionAttributeNames: { '#v': 'version' }, ExpressionAttributeValues: { ':v': { N: String(expectedVersion) } } }),
        }));
        return true;
      } catch (e) {
        if (e && e.name === 'ConditionalCheckFailedException') return false;
        throw e;
      }
    },
  };
}

// the real client, built from the SDK that comes with the Lambda runtime
export async function realDynamoClient(region) {
  const sdk = await import('@aws-sdk/client-dynamodb');
  const c = new sdk.DynamoDBClient({ region });
  c.commands = { GetItemCommand: sdk.GetItemCommand, PutItemCommand: sdk.PutItemCommand };
  return c;
}
