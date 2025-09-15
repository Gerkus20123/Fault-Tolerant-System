Logi w VSC:





Logi w aws.amazon.com/cloudwatch (logs/log groups):

| Data | ID Zadania |	Logi CloudWatch | Wniosek | 
| :--- | :--- | :--- | :--- |
| 2025-09-15T09:52:34.997+02:00 | `task-nr_1`	| `INFO [Processor] Picking up task task-nr_1...<br>INFO [Processor] Task task-nr_1 processed successfully.`	| Pomyślne przetworzenie. Zadanie zostało odebrane i pomyślnie zakończone. | 
| 2025-09-15T09:52:44.774+02:00 | `task-nr_2`	| `INFO [Processor] Picking up task task-nr_2...<br>INFO [Processor] Task task-nr_2 processed successfully.`	| Pomyślne przetworzenie. | 
| 2025-09-15T09:52:54.742+02:00 | `task-nr_3`	| `INFO [Processor] Picking up task task-nr_3...<br>ERROR [Processor] Task task-nr_3 failed.<br>ERROR Invoke Error { ... "errorMessage": "Simulated processing error." ... }<br><br>(Po chwili, druga próba)<br><br>INFO [Processor] Picking up task task-nr_3...<br>ERROR [Processor] Task task-nr_3 failed.	Symulowany błąd i ponowna próba. Pierwsza próba zakończyła się błędem. SQS automatycznie ponowiło próbę, która również się nie powiodła. To zadanie prawdopodobnie trafiło do DLQ.` | Symulowany błąd i ponowna próba. Pierwsza próba zakończyła się błędem. SQS automatycznie ponowiło próbę, która również się nie powiodła. To zadanie prawdopodobnie trafiło do DLQ. |
| 2025-09-15T09:53:03.082+02:00 | `task-nr_4`	| `INFO [Processor] Picking up task task-nr_4...<br>INFO [Processor] Task task-nr_4 processed successfully.`	| Pomyślne przetworzenie. | 
| 2025-09-15T09:53:11.534+02:00 | `task-nr_5`	| `INFO [Processor] Picking up task task-nr_5...<br>INFO [Processor] Task task-nr_5 processed successfully.`	| Pomyślne przetworzenie. | 
| 2025-09-15T09:53:20.479+02:00 | `task-nr_6`	| `INFO [Processor] Picking up task task-nr_6...<br>INFO [Processor] Task task-nr_6 processed successfully.`	| Pomyślne przetworzenie. | 

