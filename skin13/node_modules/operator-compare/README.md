# operator-compare

[![NPM version](https://img.shields.io/npm/v/operator-compare.svg?style=flat-square)](http://badge.fury.io/js/operator-compare)
[![Dependency Status](https://img.shields.io/gemnasium/Carrooi/Node-OperatorCompare.svg?style=flat-square)](https://gemnasium.com/Carrooi/Node-OperatorCompare)
[![Build Status](https://img.shields.io/travis/Carrooi/Node-OperatorCompare.svg?style=flat-square)](https://travis-ci.org/Carrooi/Node-OperatorCompare)

[![Donate](https://img.shields.io/badge/donate-PayPal-brightgreen.svg?style=flat-square)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7MLNUGKRU7XQU)

## Abandoned

Unfortunately I don't have any more time to maintain this repository :-( 

![sad cat](https://raw.githubusercontent.com/sakren/sakren.github.io/master/images/sad-kitten.jpg)

Comparing two variables with operator as argument.

## Usage

```
var compare = require('compare');

compare(5, '<', 10);			// result: true
```

As you can see, this is just simple function, which compare two variables by operator as second argument. List of available
operators is bellow.

## Operators

There are just classic operators with some others.

```
   Operator   |   Equivalent
--------------+----------------
      >       |          >
      >=      |          >=
      <       |          <
      <=      |          <=
     =, ==    |         ===
   !, !=, <>  |         !==
```

Last two lines are sets of operators, so operator `<>` is the same one as `!=`.

If you will try to set some unknown operator, exception will be thrown.

## Changelog

* 1.0.3
	+ Abandon project

* 1.0.2
	+ Move under Carrooi organization
	+ Abandon repository
	+ Rewrite to pure javascript
	+ Fix typos
	+ Add to travis
	+ Update dependencies

* 1.0.1
	+ Typo in readme

* 1.0.0
	+ Initial commit
