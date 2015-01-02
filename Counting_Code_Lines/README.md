#Counting Code Lines

This is a program written in Node.js to calculate number of code lines. The problem description can be found here:

http://codekata.com/kata/kata13-counting-code-lines/

#Running

Clone the directory structure.
Install Node.js (if not present already)
```
node loc.js
```
Provide the file name (including path) and press enter.

#Mention

The code for liner (stream API parsing file line by line) is taken from here:

http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

Readline could have been used, but not because of stability issues as mentioned in the API docs:

http://nodejs.org/api/readline.html