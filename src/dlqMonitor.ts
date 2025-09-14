// Główna funkcja handlera, wywoływana przez SQS (DLQ)
export const handler = async (event: any) => {
  console.log("-----------------------------------------");
  console.log("[DLQ Monitoring] New failed tasks detected:");

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const { taskId, payload, error, timestamp } = body;

    console.log(`- Task ID: ${taskId}`);
    console.log(`  Payload: ${JSON.stringify(payload)}`);
    console.log(`  Error: ${error}`);
    console.log(`  Timestamp: ${timestamp}`);
  }

  console.log("-----------------------------------------");
};