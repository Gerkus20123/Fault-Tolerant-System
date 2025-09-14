# Fault-Tolerant System v1

To jest skalowalny i odporny na błędy system przetwarzania zadań, zbudowany w oparciu o architekturę event-driven z użyciem usług AWS. System symuluje przetwarzanie danych, gdzie błędy są automatycznie obsługiwane, a zadania, które nie mogą być przetworzone, trafiają do kolejki DLQ.
W procesie budowania tego systemu wykorzystałem AI do przyspieszenia niektórych etapów, takich jak generowanie początkowego szablonu i debugowanie problemów z konfiguracją. Jednak ostateczne rozwiązanie, a także zrozumienie i poprawienie błędów, było wynikiem moich własnych umiejętności.

## 🚀 Wymagania wstępne

* **Node.js** (v14.x lub nowszy)
* **npm**
* **AWS CLI**
* **Serverless Framework**
* Skonfigurowane konto AWS z uprawnieniami do tworzenia zasobów (IAM, Lambda, SQS, API Gateway).

## 🛠️ Instrukcje konfiguracji i wdrożenia

1.  **Sklonuj repozytorium** na swój lokalny komputer.
2.  Przejdź do katalogu projektu.
3.  Zainstaluj zależności npm:
    ```bash
    npm install
    ```
4.  Wdróż cały stos Serverless na AWS:
    ```bash
    serverless deploy
    ```
    Po wdrożeniu w konsoli pojawi się URL do punktu końcowego API.

## 🏗️ Przegląd architektury

System składa się z trzech głównych komponentów w pełni zarządzanych przez AWS:

* **API Gateway**: Przyjmuje żądania POST do punktu końcowego `/submit-task` i przekazuje je do funkcji `submitTask`.
* **submitTask Lambda**: Funkcja Lambda, która przyjmuje zadanie, waliduje je i umieszcza wiadomość w kolejce SQS.
* **SQS (Simple Queue Service)**: Kolejka "TaskQueue" buforuje zadania. Jest połączona z kolejką DLQ (`DeadLetterQueue`) z polityką redrive, która ponawia próbę wykonania zadania 2 razy, zanim przeniesie je do DLQ.
* **processTask Lambda**: Funkcja, która nasłuchuje na "TaskQueue" i asynchronicznie przetwarza zadania. Symuluje błędy, aby przetestować odporność systemu na awarie.
* **dlqMonitor Lambda**: Funkcja, która monitoruje kolejkę DLQ i loguje szczegóły nieprzetworzonych zadań do CloudWatch, aby umożliwić ich dalszą inspekcję.



## 🧪 Instrukcje testowania

Aby przetestować system, użyj `curl` lub innej aplikacji, takiej jak Postman, aby wysłać żądanie POST do punktu końcowego API.

### Testowanie pomyślnego przetwarzania

Wyślij zadanie do API, aby zobaczyć, jak jest pomyślnie przetwarzane.

```bash
curl -X POST -H "Content-Type: application/json" -d '{"taskId": "test-1", "payload": {"user": "test-user", "action": "test-success"}}' [URL_TWOJEGO_API_GATEWAY]/submit-task
