import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const PROCESSING_FAILURE_RATE = 0.3;

const sqsClient = new SQSClient({ region: 'us-east-1' });

// Główna funkcja handlera, wywoływana przez SQS
export const handler = async (event: any) => {
  // Iteracja przez wiadomości SQS
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const { taskId, payload, retryCount } = body;

    // Symulacja błędu przetwarzania
    const isFailure = Math.random() < PROCESSING_FAILURE_RATE;

    console.log(`[Processor] Picking up task ${taskId} for processing.`);

    if (isFailure) {
      const errorMessage = 'Simulated processing error.';
      console.error(`[Processor] Task ${taskId} failed.`);

      // Logika przeniesienia zadania do DLQ jest obsługiwana automatycznie przez SQS.
      // SQS automatycznie ponawia próbę (zgodnie z konfiguracją w serverless.yml)
      // i przenosi do DLQ po wyczerpaniu limitu.
      
      throw new Error(errorMessage);

    } else {
      console.log(`[Processor] Task ${taskId} processed successfully.`);
      // Jeśli zadanie się powiedzie, funkcja kończy działanie bez błędu.
      // SQS automatycznie usunie wiadomość z kolejki.
    }
  }
};
