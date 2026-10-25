<hgroup>
    <h1 align="center">a cold-email engine that never
loses track of a contact</h1>
</hgroup>

## Setup and Run Locally

### Install Dependencies

```shell
pnpm i
```

### Build - react bundle

```shell
pnpm run build
```

### Start database using docker

For Windows, start Docker Desktop.

In a dedicated terminal run,

```shell
docker compose up
```

### Start API Server

In a dedicated terminal run this command, and leave the terminal open.

```shell
pnpm run start-server
```

### Start Web-Client Server

In a dedicated terminal run this command, and leave the terminal open.

```shell
pnpm run start-react
```
