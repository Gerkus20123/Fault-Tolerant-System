// submitTask.ts

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const sqsClient = new SQSClient({});

export const handler = async (event) => {
  const queueUrl = process.env.QUEUE_URL; // Get the URL from the environment variable
  if (!queueUrl) {
    throw new Error("QUEUE_URL environment variable is not set.");
  }

  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(JSON.parse(event.body)),
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error sending message to queue." };
  }
};