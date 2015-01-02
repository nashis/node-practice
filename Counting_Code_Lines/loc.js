/**
 * all global variables
 */
var isMultiLineComment = false;
var codeLinesCnt = 0;

/**
 * Starting point
 */
init();

/**
 * @summary: Entry point to the application that accepts an user input for filename and initiates the logic of calculating code lines
 * @args: {Null}
 * @return: {Undefined}
 */
function init() {
    var stdin = process.stdin;
    var domain = require('domain').create();

    domain.on('error', function (e) {
        console.log(e);
    });

    console.log('Enter the file location');

    stdin.resume();
    stdin.setEncoding('utf8');

    stdin.once('data', function (data) {
        _processUserInput(data.trim());
    });
}

/**
 * @summary: Works on the user supplied file name and calculates the number of code lines
 * @args: {String} file name
 * @return: {Undefined}
 */
function _processUserInput(fileName) {
    var fs = require('fs');
    var liner = require('./liner');
    fs.createReadStream(fileName)
        .on('error', function (e) {
            console.log('Unable to open the specified file. Please check the path and try again');
            process.exit();
        })
        .pipe(liner);

    liner
        .on('readable', function () {
            var line;
            while (line = liner.read()) {
                _processLine(line);
            }
        })
        .on('end', function (err) {
            if (err) console.log(err);
            console.log('Total number of code lines in file "' + fileName + '": ' + codeLinesCnt);
            process.exit();
        });
}

/**
 * @summary: For a given line, checks if it is a comment line or a code line, and accordingly sets the global code lines count
 * @args: {String} line to be processed
 * @return: {Undefined}
 */
function _processLine(line) {
    var lineProcessed = line.trim();
    if (lineProcessed === '') {
        return;
    }

    if (!isMultiLineComment) {
        if (_isSingleLineComment(lineProcessed)) {
            return;
        }

        if (_isStartOfMultiLineComment(lineProcessed)) {
            isMultiLineComment = true;
        }
    }

    if (isMultiLineComment) {
        if (_isEndOfMultiLineComment(lineProcessed)) {
            isMultiLineComment = false;
            lineProcessed = line.substring(line.indexOf('*/') + 2);
            if (lineProcessed.trim() !== '') {
                _processLine(lineProcessed);
            }
        }
    } else {
        //console.log(line);
        codeLinesCnt++;
    }
}

/**
 * @summary: For a given line checks if it is a single line comment i.e. starts with //
 * @args: {String} line to be processed
 * @return: {Boolean} true if it's a single line comment, false otherwise
 */
function _isSingleLineComment(line) {
    return line.indexOf('//') === 0;
}

/**
 * @summary: For a given line checks if it is the beginning of a multi line comment i.e. starts with /*
 * @args: {String} line to be processed
 * @return: {Boolean} true if it's beginning of a multi line comment, false otherwise
 */
function _isStartOfMultiLineComment(line) {
    return line.indexOf('/*') === 0;
}

/**
 * @summary: For a given line checks if it has the ending of a multi line comment
 * @args: {String} line to be processed
 * @return: {Boolean} true if it has ending of a multi line comment, false otherwise
 */
function _isEndOfMultiLineComment(line) {
    return line.indexOf('*/') > -1;
}