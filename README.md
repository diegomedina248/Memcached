# Memcached
Memcached implementation in NodeJS

## Usage

### Starting the server

To run, simply execute:

```console
NODE_ENV=production node index.js
```

&nbsp;

The following environment variables are accepted:

| Variable | Description | Values | Default |
|----------|-------------|--------|---------|
| ADDRESS | The IP address from where to start the server | IP address | 127.0.0.1 |
| PORT | The port the server will be listening | 0 to 65535 | 4000 |
| NODE_ENV | The environment configuration | development, production, test | - |
| LOGGER_LEVEL | The severity of the generated log | error, warn, info, verbose, debug, silly | info |

### Example
You can use `telnet` or any other similar program to connect via TCP:

```console
telnet localhost 4000
```