/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkyagss"] = self["webpackChunkyagss"] || []).push([["css-unit-converter"],{

/***/ "./node_modules/css-unit-converter/index.js":
/*!**************************************************!*\
  !*** ./node_modules/css-unit-converter/index.js ***!
  \**************************************************/
/***/ ((module) => {

eval("var conversions = {\r\n    // length\r\n    'px': {\r\n        'px': 1,\r\n        'cm': 96.0/2.54,\r\n        'mm': 96.0/25.4,\r\n        'in': 96,\r\n        'pt': 96.0/72.0,\r\n        'pc': 16\r\n    },\r\n    'cm': {\r\n        'px': 2.54/96.0,\r\n        'cm': 1,\r\n        'mm': 0.1,\r\n        'in': 2.54,\r\n        'pt': 2.54/72.0,\r\n        'pc': 2.54/6.0\r\n    },\r\n    'mm': {\r\n        'px': 25.4/96.0,\r\n        'cm': 10,\r\n        'mm': 1,\r\n        'in': 25.4,\r\n        'pt': 25.4/72.0,\r\n        'pc': 25.4/6.0\r\n    },\r\n    'in': {\r\n        'px': 1.0/96.0,\r\n        'cm': 1.0/2.54,\r\n        'mm': 1.0/25.4,\r\n        'in': 1,\r\n        'pt': 1.0/72.0,\r\n        'pc': 1.0/6.0\r\n    },\r\n    'pt': {\r\n        'px': 0.75,\r\n        'cm': 72.0/2.54,\r\n        'mm': 72.0/25.4,\r\n        'in': 72,\r\n        'pt': 1,\r\n        'pc': 12\r\n    },\r\n    'pc': {\r\n        'px': 6.0/96.0,\r\n        'cm': 6.0/2.54,\r\n        'mm': 6.0/25.4,\r\n        'in': 6,\r\n        'pt': 6.0/72.0,\r\n        'pc': 1\r\n    },\r\n    // angle\r\n    'deg': {\r\n        'deg': 1,\r\n        'grad': 0.9,\r\n        'rad': 180/Math.PI,\r\n        'turn': 360\r\n    },\r\n    'grad': {\r\n        'deg': 400/360,\r\n        'grad': 1,\r\n        'rad': 200/Math.PI,\r\n        'turn': 400\r\n    },\r\n    'rad': {\r\n        'deg': Math.PI/180,\r\n        'grad': Math.PI/200,\r\n        'rad': 1,\r\n        'turn': Math.PI*2\r\n    },\r\n    'turn': {\r\n        'deg': 1/360,\r\n        'grad': 1/400,\r\n        'rad': 0.5/Math.PI,\r\n        'turn': 1\r\n    },\r\n    // time\r\n    's': {\r\n        's': 1,\r\n        'ms': 1/1000\r\n    },\r\n    'ms': {\r\n        's': 1000,\r\n        'ms': 1\r\n    },\r\n    // frequency\r\n    'Hz': {\r\n        'Hz': 1,\r\n        'kHz': 1000\r\n    },\r\n    'kHz': {\r\n        'Hz': 1/1000,\r\n        'kHz': 1\r\n    },\r\n    // resolution\r\n    'dpi': {\r\n        'dpi': 1,\r\n        'dpcm': 1.0/2.54,\r\n        'dppx': 1/96\r\n    },\r\n    'dpcm': {\r\n        'dpi': 2.54,\r\n        'dpcm': 1,\r\n        'dppx': 2.54/96.0\r\n    },\r\n    'dppx': {\r\n        'dpi': 96,\r\n        'dpcm': 96.0/2.54,\r\n        'dppx': 1\r\n    }\r\n};\r\n\r\nmodule.exports = function (value, sourceUnit, targetUnit, precision) {\r\n    if (!conversions.hasOwnProperty(targetUnit))\r\n        throw new Error(\"Cannot convert to \" + targetUnit);\r\n\r\n    if (!conversions[targetUnit].hasOwnProperty(sourceUnit))\r\n        throw new Error(\"Cannot convert from \" + sourceUnit + \" to \" + targetUnit);\r\n    \r\n    var converted = conversions[targetUnit][sourceUnit] * value;\r\n    \r\n    if (precision !== false) {\r\n        precision = Math.pow(10, parseInt(precision) || 5);\r\n        return Math.round(converted * precision) / precision;\r\n    }\r\n    \r\n    return converted;\r\n};\r\n\n\n//# sourceURL=webpack://yagss/./node_modules/css-unit-converter/index.js?");

/***/ })

}]);