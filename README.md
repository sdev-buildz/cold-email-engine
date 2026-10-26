<hgroup>
  <h1 align="center">a cold-email engine that never loses track of a contact</h1>
</hgroup>

It has mock 10000 prospects.
Conversion rates, reply rates, bounce rates, and waiting interval between mails can be configured through UI dashboard.

Fast forward takes around 50 seconds for 50000 active prospects per day.

## 🖥️ System Requirements & Prerequisites

Before running the application, ensure you have the following prerequisites installed for your specific operating system:

### For Windows 11

- **Node.js & pnpm:** Install via the [Node.js official website](https://nodejs.org) or via terminal: `winget install OpenJS.NodeJS`. Then install pnpm globally: `npm i -g pnpm`.
- **Docker:** Download and install **Docker Desktop for Windows**. Ensure the WSL 2 backend option is enabled during setup.
- **Terminal:** Use **PowerShell** or **Windows Terminal** (avoid legacy Command Prompt).

### For macOS

- **Node.js & pnpm:** Install via [Homebrew](https://brew.sh): `brew install node && npm i -g pnpm`.
- **Docker:** Download and install **Docker Desktop for Mac** (make sure to select the correct installer for your Mac: Apple Silicon or Intel chip).
- **Terminal:** Use the native **Terminal app** or **iTerm2**.

---

## 🛠️ Setup and Run Locally

### 1. Install Dependencies

Open your terminal application and execute:

```shell
pnpm i
```

### 2. Start Database Using Docker

In the folder ./packages/db, add a .env file using ./packages/.env.example as reference.

The database container requires Docker running in the background.

- **Windows 11:** Launch **Docker Desktop** from your Start Menu and wait for the dashboard engine indicator to turn green.
- **macOS:** Launch **Docker** from your Applications folder (or via Spotlight: `Cmd + Space` -> "Docker") and wait for the whale icon in the top menu bar to stop animating.

Once Docker is fully active, open a dedicated terminal window/tab and run:

```shell
docker compose up
```

_(Keep this terminal open to keep the database active.)_

### 3. Seed the database

```shell
pnpm run prisma:seed
```

### 4. Start API Server

Open a **new** dedicated terminal window/tab and run:

```shell
pnpm run start-server
```

It opens at "https://localhost:443". So make sure the port is not occupied.

_(Leave this terminal open to keep the backend server alive.)_

### 5. Start React Server

Open another **new** dedicated terminal window/tab to start the frontend application:

```shell
pnpm run start-react
```

It opens at "https://localhost:3000". So make sure the port is not occupied.

_(Leave this terminal open. Your default browser should automatically open the app's local interface.)_

### 6. Ignore browser cert errors

Launch the browser using "--ignore-certificate-errors" flag (or equivalent.).

Or else

1. In browser, open https://localhost:443 and click allow (or trust, or equivalent).
2. In browser, open https://localhost:3000 and click allow (or trust, or equivalent).

### 7. Use the website

Open the url "https://localhost:3000" in the same browser where you ignored the errors.

Use navbar at top to navigate across dashboard or prospects list.

In dashboards page, you can input any number of days and fast forward.
Other configs are also in dashboards page only.

## When I ran,

It took 50 seconds to run once across 5000 active prospects. I have intel core ultra 5 225H processor, and 16 GB RAM.

## Persistence

I used database to persist state and data across runs. So data will not be lost. This stops double sending.

## AI model

Currently I mocked the AI API calls.
