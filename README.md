[![Build Status](https://travis-ci.org/ExcelsiorIO/cdn.svg)](https://travis-ci.org/ExcelsiorIO/cdn)

###About
A simple CDN server with `mongodb` for read content and `memcached` for fast cache

---

###Dependencies
- [nodejs](https://nodejs.org/)
- [npm](https://www.npmjs.com/)*
- [memcached](http://memcached.org/)**

---

###Setup
1. Install nodejs
2. Install npm
3. Install memcached
4. Install NPM dependencies ```npm install```
5. Change directory to ```cd ./tools```
6. Run command ```./download-assets-bower.sh```. This command will download some bower packages.
7. Return to root project directory ```cd ..```

---

###Use

```shell
	node index.js
```

or with specific port

```shell
	PORT=80 node index.js
```

or running with single process

```shell
	CONCURRENCE_PROCESS=1 PORT=80 node index.js
```

---

###Tests

```shell
	npm test
```

or

```shell
	gulp watch
```

---

## Stress test

```shell
apt-get install siege
siege -c100 -t1M http://localhost:9999/vendors/jquery/2.1.3/jquery.min.js
```

or with ab (apache)

```shell
ab -c 100 -t 60 http://localhost:9999/vendors/jquery/2.1.3/jquery.min.js
```

---

## Release History
* 0.1.0 Initial release
* 0.1.1 Reading packages from directory and cache in memorycache

---

code with :heart: and keep :muscle: ...
