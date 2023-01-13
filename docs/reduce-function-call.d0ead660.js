/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkyagss"] = self["webpackChunkyagss"] || []).push([["reduce-function-call"],{

/***/ "./node_modules/reduce-function-call/index.js":
/*!****************************************************!*\
  !*** ./node_modules/reduce-function-call/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*\n * Module dependencies\n */\nvar balanced = __webpack_require__(/*! balanced-match */ \"./node_modules/balanced-match/index.js\")\n\n/**\n * Expose `reduceFunctionCall`\n *\n * @type {Function}\n */\nmodule.exports = reduceFunctionCall\n\n/**\n * Walkthrough all expressions, evaluate them and insert them into the declaration\n *\n * @param {Array} expressions\n * @param {Object} declaration\n */\n\nfunction reduceFunctionCall(string, functionRE, callback) {\n  var call = string\n  return getFunctionCalls(string, functionRE).reduce(function(string, obj) {\n    return string.replace(obj.functionIdentifier + \"(\" + obj.matches.body + \")\", evalFunctionCall(obj.matches.body, obj.functionIdentifier, callback, call, functionRE))\n  }, string)\n}\n\n/**\n * Parses expressions in a value\n *\n * @param {String} value\n * @returns {Array}\n * @api private\n */\n\nfunction getFunctionCalls(call, functionRE) {\n  var expressions = []\n\n  var fnRE = typeof functionRE === \"string\" ? new RegExp(\"\\\\b(\" + functionRE + \")\\\\(\") : functionRE\n  do {\n    var searchMatch = fnRE.exec(call)\n    if (!searchMatch) {\n      return expressions\n    }\n    if (searchMatch[1] === undefined) {\n      throw new Error(\"Missing the first couple of parenthesis to get the function identifier in \" + functionRE)\n    }\n    var fn = searchMatch[1]\n    var startIndex = searchMatch.index\n    var matches = balanced(\"(\", \")\", call.substring(startIndex))\n\n    if (!matches || matches.start !== searchMatch[0].length - 1) {\n      throw new SyntaxError(fn + \"(): missing closing ')' in the value '\" + call + \"'\")\n    }\n\n    expressions.push({matches: matches, functionIdentifier: fn})\n    call = matches.post\n  }\n  while (fnRE.test(call))\n\n  return expressions\n}\n\n/**\n * Evaluates an expression\n *\n * @param {String} expression\n * @returns {String}\n * @api private\n */\n\nfunction evalFunctionCall (string, functionIdentifier, callback, call, functionRE) {\n  // allow recursivity\n  return callback(reduceFunctionCall(string, functionRE, callback), functionIdentifier, call)\n}\n\n\n//# sourceURL=webpack://yagss/./node_modules/reduce-function-call/index.js?");

/***/ })

}]);