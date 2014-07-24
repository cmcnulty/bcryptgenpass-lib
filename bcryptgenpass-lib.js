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

	// for no reason whatsoever, attempt to support firefox 3.0	
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
	// floor should normalize to either a number or NaN, then min/max it to between 4 an 31
	// then left pad it with zeros - can assume that it will only have a length of 1 or 2
	var default_cost = 10;
	return Math.min( 31, Math.max( 4, Math.floor( cost ) || default_cost ) );
};

var formatCost = function ( cost ) {
	return ( '0' + validateCost( cost ) ).slice( -2 );
};

// removed rule that first character must be lower-case letter
// added rule that password must contain at least one non-alphanumeric character (from z85)
var validatePassword = function ( password ) {
	return (
		password.search(/[0-9]/) >= 0 &&
		password.search(/[A-Z]/) >= 0 &&
		password.search(/[a-z]/) >= 0 &&
		password.search(/[\x21-\x2F\x3A-\x40\x5B-\x60]/) >= 0
	);
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
	if (num !== parseInt(num, 10) || num < 4 || max < num) {
		throw new Error('Length must be an integer between 4 and ' + max + ': ' + num);
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
	options.costFactor = validateCost(options.costFactor);

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

api.validateCost = validateCost;

module.exports = api;