const {
  CreateTableCommand,
  DescribeTableCommand,
} = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { client, docClient } = require("../config/dynamodb");

const tableName = process.env.DYNAMODB_TABLE || "Products";

const NETWORK_ERROR_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "EHOSTUNREACH",
  "ENOTFOUND",
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isTransientDynamoError(error) {
  if (!error) {
    return false;
  }
  if (error.name === "TimeoutError") {
    return true;
  }
  if (error.code && NETWORK_ERROR_CODES.has(error.code)) {
    return true;
  }
  return false;
}

async function ensureTableExists() {
  const maxAttempts = Number(process.env.DYNAMODB_CONNECT_RETRIES || 10);
  const delayMs = Number(process.env.DYNAMODB_CONNECT_DELAY_MS || 1000);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await client.send(new DescribeTableCommand({ TableName: tableName }));
      return;
    } catch (error) {
      if (error.name === "ResourceNotFoundException") {
        try {
          await client.send(
            new CreateTableCommand({
              TableName: tableName,
              AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
              KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
              BillingMode: "PAY_PER_REQUEST",
            })
          );
          return;
        } catch (createError) {
          if (!isTransientDynamoError(createError) || attempt === maxAttempts) {
            throw createError;
          }
        }
      } else if (!isTransientDynamoError(error) || attempt === maxAttempts) {
        throw error;
      }
    }

    await sleep(delayMs);
  }
}

async function createProduct(product) {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: product,
    })
  );
  return product;
}

async function getProductById(id) {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    })
  );
  return result.Item || null;
}

async function listProducts() {
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
    })
  );
  return result.Items || [];
}

async function updateProduct(id, data) {
  const updateExpression = [];
  const expressionAttributeValues = {};
  const expressionAttributeNames = {};

  if (data.name !== undefined) {
    updateExpression.push("#name = :name");
    expressionAttributeValues[":name"] = data.name;
    expressionAttributeNames["#name"] = "name";
  }
  if (data.price !== undefined) {
    updateExpression.push("price = :price");
    expressionAttributeValues[":price"] = data.price;
  }
  if (data.url_image !== undefined) {
    updateExpression.push("url_image = :url_image");
    expressionAttributeValues[":url_image"] = data.url_image;
  }

  if (updateExpression.length === 0) {
    return getProductById(id);
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  return result.Attributes || null;
}

async function deleteProduct(id) {
  await docClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id },
    })
  );
  return true;
}

module.exports = {
  ensureTableExists,
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  deleteProduct,
};
