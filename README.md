CDN
===

A simple CDN server with `mongodb` for read content and `memcached` for fast cache

## ENV Params
 - PORT: (Usage: PORT=80) Define listen port server
 - CONCURRENCE_PROCESS: (Usage: CONCURRENCE_PROCESS=4) Define count of process running the server

## Use

```shell
	node index.js
```

or with specific port

```shell
	PORT=80 node index.js
```

running with single process

```shell
	CONCURRENCE_PROCESS=1 PORT=80 node index.js
```

## Tests

```shell
	npm test
```

or

```shell
	gulp watch
```

## Stress test

```shell
apt-get install siege
siege -c100 -t1M http://localhost:9999/
```

## Release History
* 0.1.0 Initial release