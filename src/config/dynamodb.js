const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const rawEndpoint = process.env.DYNAMODB_ENDPOINT || "http://127.0.0.1:8000";
let normalizedEndpoint = rawEndpoint;
try {
  const endpointUrl = new URL(rawEndpoint);
  if (endpointUrl.hostname === "localhost") {
    endpointUrl.hostname = "127.0.0.1";
    normalizedEndpoint = endpointUrl.toString();
  }
} catch (error) {
  normalizedEndpoint = rawEndpoint;
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: normalizedEndpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

module.exports = { client, docClient };
