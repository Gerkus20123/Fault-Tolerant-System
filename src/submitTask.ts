// submitTask.ts

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const sqsClient = new SQSClient({});

export const handler = async (event) => {
  
  const queueUrl = process.env.QUEUE_URL; // adres URL kolejki SQS, do której wiadomość ma zostać wysłana. Zmienna queueUrl musi zawierać poprawny adres URL, aby operacja się powiodła.

  {/* Sprawdzamy, czy queueUrl jest wartością sensownej, czyli nie NaN, null, 0 itd. */}
  if (!queueUrl) {
    throw new Error("QUEUE_URL environment variable is not set.");
  }

  {/* Tworzymy obiekt */}
  const params = {
    QueueUrl: queueUrl, // Adres URL kolejki SQS
    MessageBody: JSON.stringify(JSON.parse(event.body)), // Walidacja: Konwertujemy event.body (treść żądania HTTP od klienta) na obiekt JavaScript, a następnie z powrotem na string JSON
  };

  {/* Odsyłamy do SQS */}
  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error sending message to queue." };
  }
};