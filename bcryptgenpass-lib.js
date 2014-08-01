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
		return processPassword( null, bcrypt.hashSync( hashInput, salt ) );
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
	if( !(parseInt(cost, 10).toString() === cost.toString() && cost >= 4 && cost <= 31) ) {
		throw new Error("Work factor must be a number between 4 and 31");
	}
	return cost;
};

// will zero pad the cost, this *assumes* that cost has already been validated
var formatCost = function ( cost ) {
	return ( '0' + cost ).slice( -2 );
};

// The symbol test is ascii85 encoding agnostic, 
// it just checks that one of the printable ASCII symbols is present,
// not all of the symbols that it tests for are in the z85 encoding
var passwordTests = [
	/[0-9]/,
	/[A-Z]/,
	/[a-z]/,
	/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/
];

var validatePassword = function ( password ) {
	var l = passwordTests.length;
		
	// keep looping as long as we keep passing tests
	for(; l-- && passwordTests[ l ].test( password ); ) {}
	
	// If all tests have passed l will equal -1, 
	// If while loop was broken out of l will be 0,1,2 or 3
	return l < 0;
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