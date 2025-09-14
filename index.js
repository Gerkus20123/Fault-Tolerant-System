"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
// Main task queue (simulating SQS)
const taskQueue = [];
// Dead-letter queue (simulating SQS DLQ)
const dlq = [];
const MAX_RETRIES = 2;
const PROCESSING_FAILURE_RATE = 0.3;
console.log("System initialization started...");
// --- API Endpoint ---
// Step 1: Task Submission
app.post('/submit-task', (req, res) => {
    const { taskId, payload } = req.body;
    if (!taskId || !payload) {
        return res.status(400).send({ message: 'taskId and payload are required.' });
    }
    const task = {
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
const processTask = (task) => {
    return new Promise((resolve, reject) => {
        // Simulate a random processing failure
        const isFailure = Math.random() < PROCESSING_FAILURE_RATE;
        setTimeout(() => {
            if (isFailure) {
                const errorMessage = 'Simulated processing error.';
                console.error(`[Processor] Task ${task.taskId} failed.`);
                reject(new Error(errorMessage));
            }
            else {
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
    if (!task)
        return;
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
        }
        else {
            // Step 3 & 4: Move to DLQ
            console.error(`[DLQ] Task ${task.taskId} failed after ${MAX_RETRIES} retries. Moving to DLQ.`);
            dlq.push({
                taskId: task.taskId,
                payload: task.payload,
                error: error.message,
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
//# sourceMappingURL=index.js.map