/*
 * module implementing Bloom Filter operation i.e. addWord and hasWord
 */
var BloomFilters = (function () {
    // crypto API to perform hashing
    var crypto = require('crypto');

    // JavaScript ArrayBuffer used as bit array
    var _bitMap = new Int32Array(new ArrayBuffer(64*1024));
    var _hashAlgos = ['md5', 'sha1', 'sha256', 'sha512'];

    // method to add a word to the dictionary
    var addWord = function (word) {
        _hashAlgos.forEach(function (hashAlgo) {
            _bitMap[crypto.createHash(hashAlgo).update(word).digest('binary')] = 1;
        });
    };

    // method to search a word in the dictionary
    var hasWord = function (word) {
        return _hashAlgos.every(function (hashAlgo) {
            return _bitMap[crypto.createHash(hashAlgo).update(word).digest('binary')] !== undefined;
        });
    };

    return {add: addWord, search: hasWord};
}());

init();

function init() {
    var fs = require('fs');
    var liner = require('../Utils/liner');

    fs.createReadStream('wordlist.txt').pipe(liner);
    console.log('Started populating words from wordlist.txt file.');
    liner
        .on('readable', function () {
            var line;
            while (word = liner.read()) {
                BloomFilters.add(word);
            }
        })
        .on('end', function () {
            console.log('Finished populating words from wordlist.txt file.');
            console.log('Searching for word "found": ' + (BloomFilters.search('found') ? 'Found' : 'Not Found'));
            console.log('Searching for word "notfound": ' + (BloomFilters.search('NotFound') ? 'Found' : 'Not Found'));
        });
}