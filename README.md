# Fault-Tolerant System v1

To jest skalowalny i odporny na błędy system przetwarzania zadań, zbudowany w oparciu o architekturę event-driven z użyciem usług Amazon Web Services (AWS). System symuluje przetwarzanie danych, gdzie błędy są automatycznie 

## 🚀 Wymagania wstępne

* **Node.js** (v14.x lub nowszy)
* **npm**
* **AWS CLI**
* **Serverless Framework**
* Skonfigurowane konto AWS z uprawnieniami do tworzenia zasobów (IAM, Lambda, SQS, API Gateway).

## 🛠️ Instrukcje konfiguracji i wdrożenia

1.  **Zaloguj się** do konsoli AWS.
2.  Przejdź do serwisu **IAM** (Identity and Access Management).
3.  Stwórz nowego **użytkownika IAM** i nadaj mu uprawnienia `AdministratorAccess` (dla uproszczenia w celach deweloperskich).
4.  Wygeneruj **klucze dostępu** (Access Key ID i Secret Access Key) dla tego użytkownika.
5.  Zainstaluj **AWS CLI** i skonfiguruj go za pomocą wygenerowanych kluczy. Otwórz terminal i wprowadź:
    ```bash
    aws configure
    ```
    Postępuj zgodnie z instrukcjami, wprowadzając swoje klucze i wybierając domyślny region (np. `us-east-1`).

---

### 2. Instalacja Serverless Framework i zależności

1.  Zainstaluj **Serverless Framework** globalnie:
    ```bash
    npm install -g serverless
    ```
2.  **Sklonuj** repozytorium na swój komputer.
3.  Przejdź do katalogu projektu.
4.  Zainstaluj zależności npm:
    ```bash
    npm install
    ```
5.  Jeśli używasz specyficznego profilu AWS, zdefiniuj go w pliku `serverless.yml`:
    ```yaml
    provider:
      name: aws
      profile: nazwa-twojego-profilu
      ...
    ```

---

### 3. Wdrożenie na AWS

Wdróż cały stos Serverless, uruchamiając komendę w katalogu projektu:
```bash
serverless deploy
```

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
```
Aby zobaczyć pełne logi z testowania własnego, przejdź do [pliku logów](test_logs.md).

 ## 🧠 Wkład sztucznej inteligencji
Ten projekt został stworzony przy wsparciu sztucznej inteligencji, która pełniła rolę asystenta programistycznego. AI pomagała w:

* Generowaniu struktury projektu: Tworzenie początkowej architektury i plików konfiguracyjnych.
* Debugowaniu i rozwiązywaniu błędów: Analizowanie logów i sugerowanie poprawek dla błędów wdrożeniowych oraz problemów z kodem.
* Dokumentacji: Tworzenie opisów architektonicznych i instrukcji testowania.
Wykorzystanie AI w tym projekcie pozwoliło na szybsze i bardziej efektywne rozwiązanie złożonych problemów technicznych, co jest zgodne z nowoczesnymi praktykami inżynierii oprogramowania.


