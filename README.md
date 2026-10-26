<hgroup>
  <h1 align="center">a cold-email engine that never loses track of a contact</h1>
</hgroup>

## 🖥️ System Requirements & Prerequisites

Before running the application, ensure you have the following prerequisites installed for your specific operating system:

### For Windows 11
*   **Node.js & pnpm:** Install via the [Node.js official website](https://nodejs.org) or via terminal: `winget install OpenJS.NodeJS`. Then install pnpm globally: `npm i -g pnpm`.
*   **Docker:** Download and install **Docker Desktop for Windows**. Ensure the WSL 2 backend option is enabled during setup.
*   **Terminal:** Use **PowerShell** or **Windows Terminal** (avoid legacy Command Prompt).

### For macOS
*   **Node.js & pnpm:** Install via [Homebrew](https://brew.sh): `brew install node && npm i -g pnpm`.
*   **Docker:** Download and install **Docker Desktop for Mac** (make sure to select the correct installer for your Mac: Apple Silicon or Intel chip).
*   **Terminal:** Use the native **Terminal app** or **iTerm2**.

---

## 🛠️ Setup and Run Locally

### 1. Install Dependencies
Open your terminal application and execute:
```shell
pnpm i
```
 

### 2. Start Database Using Docker
The database container requires Docker running in the background.

*   **Windows 11:** Launch **Docker Desktop** from your Start Menu and wait for the dashboard engine indicator to turn green.
*   **macOS:** Launch **Docker** from your Applications folder (or via Spotlight: `Cmd + Space` -> "Docker") and wait for the whale icon in the top menu bar to stop animating.

Once Docker is fully active, open a dedicated terminal window/tab and run:
```shell
docker compose up
```
*(Keep this terminal open to keep the database active.)*

### 3. Start API Server
Open a **new** dedicated terminal window/tab and run:
```shell
pnpm run start-server
```
*(Leave this terminal open to keep the backend server alive.)*

### 5. Start Web-Client Server
Open another **new** dedicated terminal window/tab to start the frontend application:
```shell
pnpm run start-react
```
*(Leave this terminal open. Your default browser should automatically open the app's local interface.)*
