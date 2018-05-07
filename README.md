# Memcached
![CircleCI shield](https://circleci.com/gh/diegomedina248/Memcached.svg?style=shield&circle-token=fda17d386979f6a1394caf225d14987601b44b0a)
&nbsp; ![NodeJS shield](https://img.shields.io/badge/node-%3E=9.9.0-blue.svg?style=flat)
&nbsp; [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Memcached](https://memcached.org/) partial implementation in NodeJS.

## Supported commands

The memcached protocol specification can be found [here](https://github.com/memcached/memcached/blob/master/doc/protocol.txt).

`Only` the *storage* and *retrieval* commands are implemented.

## Usage

### Starting the server

To run, simply execute:

```console
npm start
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
set myKey 0 0 4
test
```

## Testing

All tests can be found under the *tests* directory.

Unit tests use `jest` and can be found under the *unit* directory. To run them, type the following:

```console
npm test
```

Stress tests use `artillery` and can be found under the *load* directory. To run them, type the following:

```console
artillery run tests/load/load-tests.yml
```
