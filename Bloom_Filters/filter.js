var BloomFilters = (function () {
    var BitArray = require('node-bitarray');
    var crypto = require('crypto');

    var _bitMap = new BitArray(2 ^ 20);
    var _hashAlgos = ['md5', 'sha1', 'sha256', 'sha512'];

    var addWord = function (word) {
        _hashAlgos.forEach(function (hashAlgo) {
            _bitMap[crypto.createHash(hashAlgo).update(word).digest('binary')] = 1;
        });
    };

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
            console.log('Search for word "ABD": ' + (BloomFilters.search('ABD') ? 'Found' : 'Not Found'));
            console.log('Search for word "ABD": ' + (BloomFilters.search('ABDDBA') ? 'Found' : 'Not Found'));
        });
}