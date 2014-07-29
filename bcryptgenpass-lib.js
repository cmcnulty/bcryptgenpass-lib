/*!
 * bCryptGenPass library
 * https://github.com/cmcnulty/bcryptgenpass-lib
 * License: GPLv2
 */

'use strict';

var sha512 = require('crypto-js/sha512');
var encBase64 = require('crypto-js/enc-base64');
var bcrypt = require('bcryptjs');
var z85 = require('./z85');

var opts = {};

var defaults = {
	secret: '',
	length: 12,
	costFactor: 12
};

var generatePassword = function ( hashInput, salt ) {
	if( opts.callback ) {
		bcrypt.hash( hashInput, salt, processPassword, opts.progress );
	} else {
		return processPassword.call( null, null, bcrypt.hashSync( hashInput, salt ) );
	}
};

var generateSalt = function( cost, domain, secret ) {
	return '$2a$' + formatCost( cost ) + '$' + sha512( domain + secret + 'ed6abeb33d6191a6acdc7f55ea93e0e2' ).toString( encBase64 ).replace('+','.').substr( 0, 21 ) + '.';
};

// sha512 the incoming string, the convert to bytearray for converting into z85.
var hashEncode = function( s, l ){
	var sha512ed = sha512( s ).toString(),
		z85ed = z85.encode( sha512ed );

	// firefox 3.0 (?!) doesn't support undefined second param to substring
	return z85ed.substring( 0, l || z85ed.length );
	
};

// Generate initial password using bcrypt, then base85 re-encode until
// password policy is satisfied.
var processPassword = function ( err, generatedPassword ) {
	if ( err instanceof Error ){
		throw err;
	}

	// Hash until password is valid.
	do {
		generatedPassword = hashEncode( generatedPassword, opts.length );
	} while ( !validatePassword( generatedPassword ) );

	if( opts.callback ) {
		opts.callback( generatedPassword );
	}
	return generatedPassword;
};

var validateCost = function ( cost ) {
	if( !(cost >= 4 && cost <= 31) ) {
		throw new Error("Cost must be a number between 4 and 31");
	}
	return cost;
};

// will zero pad the cost, this *assumes* that cost is valid, if it's not, bCrypt will handle throwing the error
var formatCost = function ( cost ) {
	return ( '0' + cost ).slice( -2 );
};

// removed rule that first character must be lower-case letter
// added rule that password must contain at least one non-alphanumeric character (from z85)
var passwordTests = [
	/[0-9]/,
	/[A-Z]/,
	/[a-z]/,
	/[\x2e\x2d\x3a\x2b\x3d\x5e\x21\x2f\x2a\x3f\x26\x3c\x3e\x28\x29\x5b\x5d\x7b\x7d\x40\x25\x24\x23]/
];

var validatePassword = function ( password ) {
	for( var l = passwordTests.length, i = 0;  i < l; i++) {
		if( password.search(passwordTests[i]) === -1 ) {
			return false;
		};
	}
	return true;
};

var validatePasswordInput = function (str) {
	var type = typeof str;
	if (type !== 'string') {
		throw new Error('Password must be a string, received ' + type);
	}
};

var validateCombinedPasswordInput = function (str) {
	if (!str.length) {
		throw new Error('Combined password input must not be empty');
	}
};

var validateLength = function (num) {
	var max = hashEncode('a').length;
	if (num !== parseInt(num, 10) || num < passwordTests.length || max < num) {
		throw new Error('Length must be an integer between ' + passwordTests.length + ' and ' + max + ': ' + num);
	}
};

var validateOptions = function ( options ) {

	options = options || {};

	// Loop through defaults and test for undefined options.
	for (var option in defaults) {
		if (typeof options[option] === 'undefined') {
			options[option] = defaults[option];
		}
	}

	validatePasswordInput(options.secret);
	validateLength(options.length);
	validateCost(options.costFactor);

	return options;
};

// url is assumed to have already been validated on being passed in.
var api = function (masterPassword, url, options) {
	opts = validateOptions(options); 

	validatePasswordInput(masterPassword);
	validateCombinedPasswordInput(masterPassword + opts.secret);

	var input = masterPassword + opts.secret + ':' + url;
	var salt = generateSalt( opts.costFactor, url, opts.secret );

	return generatePassword( input, salt );
};

api.hostname = function () {
    throw new Error('hostname() function is not implemented.');
};

module.exports = api;