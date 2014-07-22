# bcryptgenpass-lib

[![Build Status][build-status]][travis-ci]
[![Dependencies Status][dependencies-status]][gemnasium]

This is alternative password generator for [SuperGenPass][sgp]. It can be used as a drop-in replacement with minor modifications to the parent project.

There are two questions when evaluating a password generator, how hard would it be to crack the generated password, and how hard would it be to determine the master password if you know one of the generated passwords?
This fork is designed to make both of those tasks more difficult for an attacker.  

First, we make it hard for an attacker to crack one of your passwords by generating a password that uses 85 characters rather than 64, and ensuring that all generated passwords contain some symbols.  

Second, if one of your passwords *does* get cracked, the next problem is preventing the user from using the password for one site to determine your master password.  In order to do that we use bcrypt to slow down any attempt to crack the master password, so that it will be virtually impossible to determine your master password.



## NPM module

```shell
npm install bcryptgenpass-lib
```


## Usage

```javascript
var bcryptgenpass = require('bcryptgenpass-lib');

// A string containing the user's master password.
var masterPassword = 'master-password';

// A URI or hostname of the site being visited.
var URI = 'http://www.example.com/page.html';

// Generate the password.
var generatedPassword = bcryptgenpass(masterPassword, URI, {/* options */});
```


## Options

As shown above, `bcryptgenpass-lib` optionally accepts a hash map of options.

### secret

* Default `''`
* Expects `String`

A secret password to be appended to the master password before generating the
password. This option is provided for convenience, as the same output can be
produced by manually concatenating the master and secret passwords.

### length

* Default `12`
* Expects `Number`

Length of the generated password. Valid lengths are integers between 4 and 24
inclusive.

### costFactor

* Default `12`
* Expects `Number`

Work factor for the bCrypt algorithm.  You'll want to experiment with this value to determine the maximum you can tolerate based on the length of time it takes the browser to calculate the password.


## Browser environments

To use `bcryptgenpass-lib` in browser environments, run `gulp browserify`. Take
the created `dist/bcryptgenpass-lib.browser.js` and include it on your page. Use
the global `bcryptgenpass` as documented above.


## Explanation of the algorithm

bCryptGenPass employs the simple password hashing scheme of SuperGenPass. At its essence, it takes
a master password and a hostname and concatenates them together:

```
masterpassword:example.com
```

It uses this as the input for the bCrypt hashing algorithm. The resulting bcrypt hash is itself run through sha512, and then finally encoded with the [z85] derivative of Ascii85.

For more detail, please see the (well-commented and concise) source code.


## Dependencies and license

Hash functions are provided by [crypto-js][crypto-js]. All original code is
released under the [GPLv2][gplv2].


## Thanks

A huge thank you to [SuperGenPass][sgp] author [Chris Zarate][chriszarate] who with his generous work has made maintaining good password policy insanely easy.


[sgp]: http://supergenpass.com
[build-status]: https://secure.travis-ci.org/cmcnulty/bcryptgenpass-lib.svg?branch=master
[dependencies-status]: https://gemnasium.com/cmcnulty/bcryptgenpass-lib.svg
[travis-ci]: http://travis-ci.org/cmcnulty/bcryptgenpass-lib
[gemnasium]: https://gemnasium.com/cmcnulty/bcryptgenpass-lib
[crypto-js]: https://www.npmjs.org/package/crypto-js
[chriszarate]: https://github.com/chriszarate/
[gplv2]: http://www.gnu.org/licenses/gpl-2.0.html
[z85]: http://rfc.zeromq.org/spec:32
