Logi w VSC:

| Żądanie | ID Zadania | Odpowiedź API Gateway / SQS | Wniosek |
| :--- | :--- | :--- | :--- |
| `curl ... task-1` | `task-1` | `{"...":"401b6898..."}` | Sukces: API Gateway przekazało żądanie, a `submitTask` wysłało wiadomość do SQS. |
| `curl ... task-2` | `task-2` | `{"...":"df04ca56..."}`` | Sukces: Kolejne zadanie wysłane. |
| `curl ... task-3` | `task-3` | `{"...":"927ff8ab..."}` | Sukces: Kolejne zadanie wysłane. |
| `curl ... task-4` | `task-4` | `{"...":"404d4b67..."}` | Sukces: Kolejne zadanie wysłane. |
| `curl ... task-5` | `task-5` | `{"...":"de1b276c..."}` | Sukces: Kolejne zadanie wysłane. |
| `curl ... task-6` | `task-6` | `{"...":"d2351e0f..."}` | Sukces: Kolejne zadanie wysłane. |

| Data | ID Zadania |	Logi CloudWatch | Wniosek | 
| :--- | :--- | :--- | :--- |
| 2025-09-15T09:52:34.997+02:00 | `task-nr_1`	| `INFO [Processor] Picking up task task-nr_1...<br>INFO [Processor] Task task-nr_1 processed successfully.`	| Pomyślne przetworzenie. Zadanie zostało odebrane i pomyślnie zakończone. | 
| 2025-09-15T09:52:44.774+02:00 | `task-nr_2`	| `INFO [Processor] Picking up task task-nr_2...<br>INFO [Processor] Task task-nr_2 processed successfully.`	| Pomyślne przetworzenie. | 
| 2025-09-15T09:52:54.742+02:00 | `task-nr_3`	| `INFO [Processor] Picking up task task-nr_3...<br>ERROR [Processor] Task task-nr_3 failed.<br>ERROR Invoke Error { ... "errorMessage": "Simulated processing error." ... }<br><br>(Po chwili, druga próba)<br><br>INFO [Processor] Picking up task task-nr_3...<br>ERROR [Processor] Task task-nr_3 failed.	Symulowany błąd i ponowna próba. Pierwsza próba zakończyła się błędem. SQS automatycznie ponowiło próbę, która również się nie powiodła. To zadanie prawdopodobnie trafiło do DLQ.` | Symulowany błąd i ponowna próba. Pierwsza próba zakończyła się błędem. SQS automatycznie ponowiło próbę, która również się nie powiodła. To zadanie prawdopodobnie trafiło do DLQ. |
| 2025-09-15T09:53:03.082+02:00 | `task-nr_4`	| `INFO [Processor] Picking up task task-nr_4...<br>INFO [Processor] Task task-nr_4 processed successfully.`	| Pomyślne przetworzenie. | 
| 2025-09-15T09:53:11.534+02:00 | `task-nr_5`	| `INFO [Processor] Picking up task task-nr_5...<br>INFO [Processor] Task task-nr_5 processed successfully.`	| Pomyślne przetworzenie. | 
| 2025-09-15T09:53:20.479+02:00 | `task-nr_6`	| `INFO [Processor] Picking up task task-nr_6...<br>INFO [Processor] Task task-nr_6 processed successfully.`	| Pomyślne przetworzenie. | 

PS C:\Users\Gerku\Documents\Programming_projects\web_applications\Backend_interview_task> curl -X POST -H "Content-Type: application/json" -d '{"taskId": "task-1", "payload": {"user": "Gerku", "action": "test-aws"}}' https://2pyjnjib0b.execute-api.us-east-1.amazonaws.com/v1/submit-task
{"$metadata":{"httpStatusCode":200,"requestId":"63d78e03-5938-529c-be5a-ef4384bb39a2","attempts":1,"totalRetryDelay":0},"MD5OfMessageBody":"a56a5e6bfbb49b0dd1bf1a472a4c098c","MessageId":"401b6898-4d53-47d3-ac2d-d621e3458e23"}
PS C:\Users\Gerku\Documents\Programming_projects\web_applications\Backend_interview_task> curl -X POST -H "Content-Type: application/json" -d '{"taskId": "task-2", "payload": {"user": "Gerku", "action": "test-aws"}}' https://2pyjnjib0b.execute-api.us-east-1.amazonaws.com/v1/submit-task
{"$metadata":{"httpStatusCode":200,"requestId":"d01fac34-c9f9-5df3-a75c-cd7428c28cb7","attempts":1,"totalRetryDelay":0},"MD5OfMessageBody":"a005ee3aae4b8de968cbe39a16aec710","MessageId":"df04ca56-0c5f-4f50-be5a-e224d3e6de58"}
PS C:\Users\Gerku\Documents\Programming_projects\web_applications\Backend_interview_task> curl -X POST -H "Content-Type: application/json" -d '{"taskId": "task-3", "payload": {"user": "Gerku", "action": "test-aws"}}' https://2pyjnjib0b.execute-api.us-east-1.amazonaws.com/v1/submit-task
{"$metadata":{"httpStatusCode":200,"requestId":"079d0fd5-84b9-5ee7-8307-6e9565fc5fa3","attempts":1,"totalRetryDelay":0},"MD5OfMessageBody":"33de64c96192af2966b533661e4360fe","MessageId":"927ff8ab-e191-4a2b-a461-d8c0e0403f32"}
PS C:\Users\Gerku\Documents\Programming_projects\web_applications\Backend_interview_task> curl -X POST -H "Content-Type: application/json" -d '{"taskId": "task-4", "payload": {"user": "Gerku", "action": "test-aws"}}' https://2pyjnjib0b.execute-api.us-east-1.amazonaws.com/v1/submit-task
{"$metadata":{"httpStatusCode":200,"requestId":"d53b8a49-906a-5f71-92f1-eb09713a9e35","attempts":1,"totalRetryDelay":0},"MD5OfMessageBody":"fecca8384f1b9aa0d6431fc3378d605d","MessageId":"404d4b67-0ca9-46b6-a28d-af3e09ef461a"}
PS C:\Users\Gerku\Documents\Programming_projects\web_applications\Backend_interview_task> curl -X POST -H "Content-Type: application/json" -d '{"taskId": "task-5", "payload": {"user": "Gerku", "action": "test-aws"}}' https://2pyjnjib0b.execute-api.us-east-1.amazonaws.com/v1/submit-task
{"$metadata":{"httpStatusCode":200,"requestId":"7b8a3ed3-8388-516f-aec6-5f9362d5102b","attempts":1,"totalRetryDelay":0},"MD5OfMessageBody":"1bb6b4d568d9e8606030b8ab20e9a368","MessageId":"de1b276c-577c-4d6d-8ed5-6da5ee2a4332"}
PS C:\Users\Gerku\Documents\Programming_projects\web_applications\Backend_interview_task> curl -X POST -H "Content-Type: application/json" -d '{"taskId": "task-6", "payload": {"user": "Gerku", "action": "test-aws"}}' https://2pyjnjib0b.execute-api.us-east-1.amazonaws.com/v1/submit-task

Logi w aws.amazon.com/cloudwatch (logs/log groups):

| ID Zadania | Logi CloudWatch | Wniosek |
| :--- | :--- | :--- |
| **`task-2`** | `INFO [Processor] Picking up task task-2...`<br>`INFO [Processor] Task task-2 processed successfully.` | **Pomyślne przetworzenie.** Zadanie zostało odebrane i pomyślnie zakończone. |
| **`task-3`** | `INFO [Processor] Picking up task task-3...`<br>`ERROR [Processor] Task task-3 failed.`<br>`ERROR Invoke Error { ... "errorMessage": "Simulated processing error." ... }`<br><br>(Po chwili, druga próba)<br><br>`INFO [Processor] Picking up task task-3...`<br>`ERROR [Processor] Task task-3 failed.` | **Symulowany błąd i ponowna próba.** Pierwsza próba zakończyła się błędem. SQS automatycznie ponowiło próbę, która również się nie powiodła. To zadanie prawdopodobnie trafiło do DLQ. |
| **`task-4`** | `INFO [Processor] Picking up task task-4...`<br>`ERROR [Processor] Task task-4 failed.`<br>`ERROR Invoke Error { ... "errorMessage": "Simulated processing error." ... }`<br><br>(Po chwili, druga próba)<br><br>`INFO [Processor] Picking up task task-4...`<br>`INFO [Processor] Task task-4 processed successfully.` | **Błąd, ale ponowna próba zakończona sukcesem.** Pierwsza próba nie powiodła się, ale system był odporny i druga próba zakończyła się sukcesem. |
| **`task-5`** | `INFO [Processor] Picking up task task-5...`<br>`INFO [Processor] Task task-5 processed successfully.` | **Pomyślne przetworzenie.** |
| **`task-6`** | `INFO [Processor] Picking up task task-6...`<br>`ERROR [Processor] Task task-6 failed.`<br>`INFO [Processor] Picking up task task-6...`<br>`INFO [Processor] Task task-6 processed successfully.` | **Błąd, ale ponowna próba zakończona sukcesem.** |

2025-09-14T17:27:56.049+02:00
INIT_START Runtime Version: nodejs:20.v75	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:1ffa4c233e75382c8a39aa96770f3b81af75cba9794a5c2a1750c1ee63cdfe10

INIT_START Runtime Version: nodejs:20.v75 Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:1ffa4c233e75382c8a39aa96770f3b81af75cba9794a5c2a1750c1ee63cdfe10
2025-09-14T17:27:56.456+02:00
START RequestId: 164d481c-d334-5db8-af2e-295c321bca0f Version: $LATEST

START RequestId: 164d481c-d334-5db8-af2e-295c321bca0f Version: $LATEST
2025-09-14T17:27:56.457+02:00
2025-09-14T15:27:56.457Z	164d481c-d334-5db8-af2e-295c321bca0f	INFO	[Processor] Picking up task task-2 for processing.

2025-09-14T15:27:56.457Z 164d481c-d334-5db8-af2e-295c321bca0f INFO [Processor] Picking up task task-2 for processing.
2025-09-14T17:27:56.460+02:00
2025-09-14T15:27:56.460Z	164d481c-d334-5db8-af2e-295c321bca0f	INFO	[Processor] Task task-2 processed successfully.

2025-09-14T15:27:56.460Z 164d481c-d334-5db8-af2e-295c321bca0f INFO [Processor] Task task-2 processed successfully.
2025-09-14T17:27:56.463+02:00
END RequestId: 164d481c-d334-5db8-af2e-295c321bca0f

END RequestId: 164d481c-d334-5db8-af2e-295c321bca0f
2025-09-14T17:27:56.463+02:00
REPORT RequestId: 164d481c-d334-5db8-af2e-295c321bca0f	Duration: 6.49 ms	Billed Duration: 410 ms	Memory Size: 1024 MB	Max Memory Used: 92 MB	Init Duration: 403.20 ms	

REPORT RequestId: 164d481c-d334-5db8-af2e-295c321bca0f Duration: 6.49 ms Billed Duration: 410 ms Memory Size: 1024 MB Max Memory Used: 92 MB Init Duration: 403.20 ms
2025-09-14T17:28:06.040+02:00
START RequestId: 7d6cfdd3-bd26-5365-b14b-9c935c64b5f3 Version: $LATEST

START RequestId: 7d6cfdd3-bd26-5365-b14b-9c935c64b5f3 Version: $LATEST
2025-09-14T17:28:06.048+02:00
2025-09-14T15:28:06.048Z	7d6cfdd3-bd26-5365-b14b-9c935c64b5f3	INFO	[Processor] Picking up task task-3 for processing.

2025-09-14T15:28:06.048Z 7d6cfdd3-bd26-5365-b14b-9c935c64b5f3 INFO [Processor] Picking up task task-3 for processing.
2025-09-14T17:28:06.048+02:00
2025-09-14T15:28:06.048Z	7d6cfdd3-bd26-5365-b14b-9c935c64b5f3	ERROR	[Processor] Task task-3 failed.

2025-09-14T15:28:06.048Z 7d6cfdd3-bd26-5365-b14b-9c935c64b5f3 ERROR [Processor] Task task-3 failed.
2025-09-14T17:28:06.050+02:00
2025-09-14T15:28:06.050Z	7d6cfdd3-bd26-5365-b14b-9c935c64b5f3	ERROR	Invoke Error 	
{
    "errorType": "Error",
    "errorMessage": "Simulated processing error.",
    "stack": [
        "Error: Simulated processing error.",
        "    at Runtime.handler (/src/processTask.ts:27:13)",
        "    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1206:29)"
    ]
}


2025-09-14T15:28:06.050Z 7d6cfdd3-bd26-5365-b14b-9c935c64b5f3 ERROR Invoke Error {"errorType":"Error","errorMessage":"Simulated processing error.","stack":["Error: Simulated processing error."," at Runtime.handler (/src/processTask.ts:27:13)"," at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1206:29)"]}
2025-09-14T17:28:06.066+02:00
END RequestId: 7d6cfdd3-bd26-5365-b14b-9c935c64b5f3

END RequestId: 7d6cfdd3-bd26-5365-b14b-9c935c64b5f3
2025-09-14T17:28:06.066+02:00
REPORT RequestId: 7d6cfdd3-bd26-5365-b14b-9c935c64b5f3	Duration: 25.11 ms	Billed Duration: 26 ms	Memory Size: 1024 MB	Max Memory Used: 92 MB	

REPORT RequestId: 7d6cfdd3-bd26-5365-b14b-9c935c64b5f3 Duration: 25.11 ms Billed Duration: 26 ms Memory Size: 1024 MB Max Memory Used: 92 MB
2025-09-14T17:28:16.899+02:00
START RequestId: dacea543-d814-5214-99fe-c403395475e0 Version: $LATEST

START RequestId: dacea543-d814-5214-99fe-c403395475e0 Version: $LATEST
2025-09-14T17:28:16.904+02:00
2025-09-14T15:28:16.904Z	dacea543-d814-5214-99fe-c403395475e0	INFO	[Processor] Picking up task task-4 for processing.

2025-09-14T15:28:16.904Z dacea543-d814-5214-99fe-c403395475e0 INFO [Processor] Picking up task task-4 for processing.
2025-09-14T17:28:16.904+02:00
2025-09-14T15:28:16.904Z	dacea543-d814-5214-99fe-c403395475e0	ERROR	[Processor] Task task-4 failed.

2025-09-14T15:28:16.904Z dacea543-d814-5214-99fe-c403395475e0 ERROR [Processor] Task task-4 failed.
2025-09-14T17:28:16.904+02:00
2025-09-14T15:28:16.904Z	dacea543-d814-5214-99fe-c403395475e0	ERROR	Invoke Error 	
{
    "errorType": "Error",
    "errorMessage": "Simulated processing error.",
    "stack": [
        "Error: Simulated processing error.",
        "    at Runtime.handler (/src/processTask.ts:27:13)",
        "    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1206:29)"
    ]
}


2025-09-14T15:28:16.904Z dacea543-d814-5214-99fe-c403395475e0 ERROR Invoke Error {"errorType":"Error","errorMessage":"Simulated processing error.","stack":["Error: Simulated processing error."," at Runtime.handler (/src/processTask.ts:27:13)"," at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1206:29)"]}
2025-09-14T17:28:16.907+02:00
END RequestId: dacea543-d814-5214-99fe-c403395475e0

END RequestId: dacea543-d814-5214-99fe-c403395475e0
2025-09-14T17:28:16.907+02:00
REPORT RequestId: dacea543-d814-5214-99fe-c403395475e0	Duration: 6.72 ms	Billed Duration: 7 ms	Memory Size: 1024 MB	Max Memory Used: 92 MB	

REPORT RequestId: dacea543-d814-5214-99fe-c403395475e0 Duration: 6.72 ms Billed Duration: 7 ms Memory Size: 1024 MB Max Memory Used: 92 MB
2025-09-14T17:28:29.239+02:00
START RequestId: ee13b67a-adbd-55fa-a96f-d73a4ce9c20e Version: $LATEST

START RequestId: ee13b67a-adbd-55fa-a96f-d73a4ce9c20e Version: $LATEST
2025-09-14T17:28:29.240+02:00
2025-09-14T15:28:29.240Z	ee13b67a-adbd-55fa-a96f-d73a4ce9c20e	INFO	[Processor] Picking up task task-5 for processing.

2025-09-14T15:28:29.240Z ee13b67a-adbd-55fa-a96f-d73a4ce9c20e INFO [Processor] Picking up task task-5 for processing.
2025-09-14T17:28:29.240+02:00
2025-09-14T15:28:29.240Z	ee13b67a-adbd-55fa-a96f-d73a4ce9c20e	INFO	[Processor] Task task-5 processed successfully.

2025-09-14T15:28:29.240Z ee13b67a-adbd-55fa-a96f-d73a4ce9c20e INFO [Processor] Task task-5 processed successfully.
2025-09-14T17:28:29.242+02:00
END RequestId: ee13b67a-adbd-55fa-a96f-d73a4ce9c20e

END RequestId: ee13b67a-adbd-55fa-a96f-d73a4ce9c20e
2025-09-14T17:28:29.242+02:00
REPORT RequestId: ee13b67a-adbd-55fa-a96f-d73a4ce9c20e	Duration: 2.07 ms	Billed Duration: 3 ms	Memory Size: 1024 MB	Max Memory Used: 92 MB	

REPORT RequestId: ee13b67a-adbd-55fa-a96f-d73a4ce9c20e Duration: 2.07 ms Billed Duration: 3 ms Memory Size: 1024 MB Max Memory Used: 92 MB
2025-09-14T17:28:36.014+02:00
2025-09-14T15:28:36.014Z	30714bce-340d-597e-ae31-2a8ed5509e8a	INFO	[Processor] Picking up task task-3 for processing.

2025-09-14T15:28:36.014Z 30714bce-340d-597e-ae31-2a8ed5509e8a INFO [Processor] Picking up task task-3 for processing.
2025-09-14T17:28:36.014+02:00
2025-09-14T15:28:36.014Z	30714bce-340d-597e-ae31-2a8ed5509e8a	ERROR	[Processor] Task task-3 failed.

2025-09-14T15:28:36.014Z 30714bce-340d-597e-ae31-2a8ed5509e8a ERROR [Processor] Task task-3 failed.
2025-09-14T17:28:36.014+02:00
2025-09-14T15:28:36.014Z	30714bce-340d-597e-ae31-2a8ed5509e8a	ERROR	Invoke Error 	
{
    "errorType": "Error",
    "errorMessage": "Simulated processing error.",
    "stack": [
        "Error: Simulated processing error.",
        "    at Runtime.handler (/src/processTask.ts:27:13)",
        "    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1206:29)"
    ]
}


2025-09-14T15:28:36.014Z 30714bce-340d-597e-ae31-2a8ed5509e8a ERROR Invoke Error {"errorType":"Error","errorMessage":"Simulated processing error.","stack":["Error: Simulated processing error."," at Runtime.handler (/src/processTask.ts:27:13)"," at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1206:29)"]}
2025-09-14T17:28:36.014+02:00
START RequestId: 30714bce-340d-597e-ae31-2a8ed5509e8a Version: $LATEST

START RequestId: 30714bce-340d-597e-ae31-2a8ed5509e8a Version: $LATEST
2025-09-14T17:28:36.016+02:00
END RequestId: 30714bce-340d-597e-ae31-2a8ed5509e8a

END RequestId: 30714bce-340d-597e-ae31-2a8ed5509e8a
2025-09-14T17:28:36.016+02:00
REPORT RequestId: 30714bce-340d-597e-ae31-2a8ed5509e8a	Duration: 1.97 ms	Billed Duration: 2 ms	Memory Size: 1024 MB	Max Memory Used: 92 MB	

REPORT RequestId: 30714bce-340d-597e-ae31-2a8ed5509e8a Duration: 1.97 ms Billed Duration: 2 ms Memory Size: 1024 MB Max Memory Used: 92 MB
2025-09-14T17:28:40.343+02:00
START RequestId: 6400b44d-8365-5fab-87a6-d50d6200781c Version: $LATEST

START RequestId: 6400b44d-8365-5fab-87a6-d50d6200781c Version: $LATEST
2025-09-14T17:28:40.344+02:00
2025-09-14T15:28:40.344Z	6400b44d-8365-5fab-87a6-d50d6200781c	INFO	[Processor] Picking up task task-6 for processing.

2025-09-14T15:28:40.344Z 6400b44d-8365-5fab-87a6-d50d6200781c INFO [Processor] Picking up task task-6 for processing.
2025-09-14T17:28:40.344+02:00
2025-09-14T15:28:40.344Z	6400b44d-8365-5fab-87a6-d50d6200781c	ERROR	[Processor] Task task-6 failed.

2025-09-14T15:28:40.344Z 6400b44d-8365-5fab-87a6-d50d6200781c ERROR [Processor] Task task-6 failed.
2025-09-14T17:28:40.344+02:00
2025-09-14T15:28:40.344Z	6400b44d-8365-5fab-87a6-d50d6200781c	ERROR	Invoke Error 	
{
    "errorType": "Error",
    "errorMessage": "Simulated processing error.",
    "stack": [
        "Error: Simulated processing error.",
        "    at Runtime.handler (/src/processTask.ts:27:13)",
        "    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1206:29)"
    ]
}


2025-09-14T15:28:40.344Z 6400b44d-8365-5fab-87a6-d50d6200781c ERROR Invoke Error {"errorType":"Error","errorMessage":"Simulated processing error.","stack":["Error: Simulated processing error."," at Runtime.handler (/src/processTask.ts:27:13)"," at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1206:29)"]}
2025-09-14T17:28:40.346+02:00
END RequestId: 6400b44d-8365-5fab-87a6-d50d6200781c

END RequestId: 6400b44d-8365-5fab-87a6-d50d6200781c
2025-09-14T17:28:40.346+02:00
REPORT RequestId: 6400b44d-8365-5fab-87a6-d50d6200781c	Duration: 1.89 ms	Billed Duration: 2 ms	Memory Size: 1024 MB	Max Memory Used: 92 MB	

REPORT RequestId: 6400b44d-8365-5fab-87a6-d50d6200781c Duration: 1.89 ms Billed Duration: 2 ms Memory Size: 1024 MB Max Memory Used: 92 MB
2025-09-14T17:28:46.913+02:00
2025-09-14T15:28:46.913Z	585e61eb-582e-5298-8d8a-00abb944a33b	INFO	[Processor] Picking up task task-4 for processing.

2025-09-14T15:28:46.913Z 585e61eb-582e-5298-8d8a-00abb944a33b INFO [Processor] Picking up task task-4 for processing.
2025-09-14T17:28:46.913+02:00
2025-09-14T15:28:46.913Z	585e61eb-582e-5298-8d8a-00abb944a33b	INFO	[Processor] Task task-4 processed successfully.

2025-09-14T15:28:46.913Z 585e61eb-582e-5298-8d8a-00abb944a33b INFO [Processor] Task task-4 processed successfully.
2025-09-14T17:28:46.913+02:00
START RequestId: 585e61eb-582e-5298-8d8a-00abb944a33b Version: $LATEST

START RequestId: 585e61eb-582e-5298-8d8a-00abb944a33b Version: $LATEST
2025-09-14T17:28:46.915+02:00
END RequestId: 585e61eb-582e-5298-8d8a-00abb944a33b

END RequestId: 585e61eb-582e-5298-8d8a-00abb944a33b
2025-09-14T17:28:46.915+02:00
REPORT RequestId: 585e61eb-582e-5298-8d8a-00abb944a33b	Duration: 1.53 ms	Billed Duration: 2 ms	Memory Size: 1024 MB	Max Memory Used: 92 MB	

REPORT RequestId: 585e61eb-582e-5298-8d8a-00abb944a33b Duration: 1.53 ms Billed Duration: 2 ms Memory Size: 1024 MB Max Memory Used: 92 MB
2025-09-14T17:29:10.356+02:00
START RequestId: 51b8f1b6-5352-55f2-a29c-90f6b22d5d29 Version: $LATEST

START RequestId: 51b8f1b6-5352-55f2-a29c-90f6b22d5d29 Version: $LATEST
2025-09-14T17:29:10.357+02:00
2025-09-14T15:29:10.357Z	51b8f1b6-5352-55f2-a29c-90f6b22d5d29	INFO	[Processor] Picking up task task-6 for processing.

2025-09-14T15:29:10.357Z 51b8f1b6-5352-55f2-a29c-90f6b22d5d29 INFO [Processor] Picking up task task-6 for processing.
2025-09-14T17:29:10.358+02:00
2025-09-14T15:29:10.358Z	51b8f1b6-5352-55f2-a29c-90f6b22d5d29	INFO	[Processor] Task task-6 processed successfully.

2025-09-14T15:29:10.358Z 51b8f1b6-5352-55f2-a29c-90f6b22d5d29 INFO [Processor] Task task-6 processed successfully.
2025-09-14T17:29:10.360+02:00
END RequestId: 51b8f1b6-5352-55f2-a29c-90f6b22d5d29

END RequestId: 51b8f1b6-5352-55f2-a29c-90f6b22d5d29
2025-09-14T17:29:10.360+02:00


