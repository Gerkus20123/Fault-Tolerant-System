import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Interfaces for type safety
interface TaskPayload {
    [key: string]: any;
}

interface Task {
    taskId: string;
    payload: TaskPayload;
    retryCount: number;
    initialTimestamp: number;
}

interface FailedTask {
    taskId: string;
    payload: TaskPayload;
    error: string;
    timestamp: string;
}

// Main task queue (simulating SQS)
const taskQueue: Task[] = [];
// Dead-letter queue (simulating SQS DLQ)
const dlq: FailedTask[] = [];
const MAX_RETRIES = 2;
const PROCESSING_FAILURE_RATE = 0.3;

console.log("System initialization started...");

// --- API Endpoint ---
// Step 1: Task Submission
app.post('/submit-task', (req: Request, res: Response) => {
    const { taskId, payload } = req.body as { taskId: string; payload: TaskPayload };
    
    if (!taskId || !payload) {
        return res.status(400).send({ message: 'taskId and payload are required.' });
    }

    const task: Task = {
        taskId,
        payload,
        retryCount: 0,
        initialTimestamp: Date.now()
    };
    taskQueue.push(task);
    console.log(`[API] Task ${taskId} submitted to queue.`);
    res.status(202).send({ message: 'Task accepted for processing.' });
});

// --- Task Processing Logic ---
// Step 2 & 3: Task Processing & Failure Handling
const processTask = (task: Task): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Simulate a random processing failure
        const isFailure = Math.random() < PROCESSING_FAILURE_RATE;
        setTimeout(() => {
            if (isFailure) {
                const errorMessage = 'Simulated processing error.';
                console.error(`[Processor] Task ${task.taskId} failed.`);
                reject(new Error(errorMessage));
            } else {
                console.log(`[Processor] Task ${task.taskId} processed successfully.`);
                resolve();
            }
        }, 1000); // Simulate processing time
    });
};

const processQueue = () => {
    if (taskQueue.length === 0) {
        return;
    }

    const task = taskQueue.shift();
    
    if (!task) return;

    console.log(`[Processor] Picking up task ${task.taskId} for processing.`);

    processTask(task)
        .then(() => {
            // Success
        })
        .catch(error => {
            // Step 3: Failure Handling
            if (task.retryCount < MAX_RETRIES) {
                const delay = Math.pow(2, task.retryCount) * 1000;
                task.retryCount++;
                console.warn(`[Retry] Task ${task.taskId} failed. Retrying in ${delay / 1000}s. Retry attempt: ${task.retryCount}.`);
                setTimeout(() => {
                    taskQueue.push(task);
                }, delay);
            } else {
                // Step 3 & 4: Move to DLQ
                console.error(`[DLQ] Task ${task.taskId} failed after ${MAX_RETRIES} retries. Moving to DLQ.`);
                dlq.push({
                    taskId: task.taskId,
                    payload: task.payload,
                    error: (error as Error).message,
                    timestamp: new Date().toISOString()
                });
                monitorDLQ();
            }
        });
};

// --- Monitoring DLQ ---
// Step 4: DLQ Monitoring
const monitorDLQ = () => {
    if (dlq.length > 0) {
        console.log("-----------------------------------------");
        console.log("[DLQ Monitoring] New failed tasks detected:");
        dlq.forEach(failedTask => {
            console.log(`- Task ID: ${failedTask.taskId}`);
            console.log(`  Payload: ${JSON.stringify(failedTask.payload)}`);
            console.log(`  Error: ${failedTask.error}`);
            console.log(`  Timestamp: ${failedTask.timestamp}`);
        });
        console.log("-----------------------------------------");
        dlq.length = 0;
    }
};

// Start processing the queue periodically
setInterval(processQueue, 500);

// --- Server Start ---
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log("System is ready to accept tasks. Simulate failures by submitting tasks.");
});