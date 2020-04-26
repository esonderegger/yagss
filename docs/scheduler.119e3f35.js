/*! For license information please see scheduler.119e3f35.js.LICENSE.txt */
(window.webpackJsonpyagss=window.webpackJsonpyagss||[]).push([[935],{53:(n,e)=>{"use strict";var t,r,o,a,l;if("undefined"==typeof window||"function"!=typeof MessageChannel){var i=null,u=null,s=function(){if(null!==i)try{var n=e.unstable_now();i(!0,n),i=null}catch(n){throw setTimeout(s,0),n}},c=Date.now();e.unstable_now=function(){return Date.now()-c},t=function(n){null!==i?setTimeout(t,0,n):(i=n,setTimeout(s,0))},r=function(n,e){u=setTimeout(n,e)},o=function(){clearTimeout(u)},a=function(){return!1},l=e.unstable_forceFrameRate=function(){}}else{var f=window.performance,b=window.Date,p=window.setTimeout,w=window.clearTimeout;if("undefined"!=typeof console){var d=window.cancelAnimationFrame;"function"!=typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"),"function"!=typeof d&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills")}if("object"==typeof f&&"function"==typeof f.now)e.unstable_now=function(){return f.now()};else{var v=b.now();e.unstable_now=function(){return b.now()-v}}var m=!1,y=null,_=-1,h=5,k=0;a=function(){return e.unstable_now()>=k},l=function(){},e.unstable_forceFrameRate=function(n){0>n||125<n?console.error("forceFrameRate takes a positive int between 0 and 125, forcing framerates higher than 125 fps is not unsupported"):h=0<n?Math.floor(1e3/n):5};var T=new MessageChannel,g=T.port2;T.port1.onmessage=function(){if(null!==y){var n=e.unstable_now();k=n+h;try{y(!0,n)?g.postMessage(null):(m=!1,y=null)}catch(n){throw g.postMessage(null),n}}else m=!1},t=function(n){y=n,m||(m=!0,g.postMessage(null))},r=function(n,t){_=p((function(){n(e.unstable_now())}),t)},o=function(){w(_),_=-1}}function x(n,e){var t=n.length;n.push(e);n:for(;;){var r=t-1>>>1,o=n[r];if(!(void 0!==o&&0<I(o,e)))break n;n[r]=e,n[t]=o,t=r}}function P(n){return void 0===(n=n[0])?null:n}function F(n){var e=n[0];if(void 0!==e){var t=n.pop();if(t!==e){n[0]=t;n:for(var r=0,o=n.length;r<o;){var a=2*(r+1)-1,l=n[a],i=a+1,u=n[i];if(void 0!==l&&0>I(l,t))void 0!==u&&0>I(u,l)?(n[r]=u,n[i]=t,r=i):(n[r]=l,n[a]=t,r=a);else{if(!(void 0!==u&&0>I(u,t)))break n;n[r]=u,n[i]=t,r=i}}}return e}return null}function I(n,e){var t=n.sortIndex-e.sortIndex;return 0!==t?t:n.id-e.id}var M=[],C=[],A=1,L=null,q=3,D=!1,R=!1,j=!1;function E(n){for(var e=P(C);null!==e;){if(null===e.callback)F(C);else{if(!(e.startTime<=n))break;F(C),e.sortIndex=e.expirationTime,x(M,e)}e=P(C)}}function J(n){if(j=!1,E(n),!R)if(null!==P(M))R=!0,t(N);else{var e=P(C);null!==e&&r(J,e.startTime-n)}}function N(n,t){R=!1,j&&(j=!1,o()),D=!0;var l=q;try{for(E(t),L=P(M);null!==L&&(!(L.expirationTime>t)||n&&!a());){var i=L.callback;if(null!==i){L.callback=null,q=L.priorityLevel;var u=i(L.expirationTime<=t);t=e.unstable_now(),"function"==typeof u?L.callback=u:L===P(M)&&F(M),E(t)}else F(M);L=P(M)}if(null!==L)var s=!0;else{var c=P(C);null!==c&&r(J,c.startTime-t),s=!1}return s}finally{L=null,q=l,D=!1}}function B(n){switch(n){case 1:return-1;case 2:return 250;case 5:return 1073741823;case 4:return 1e4;default:return 5e3}}var U=l;e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(n){n.callback=null},e.unstable_continueExecution=function(){R||D||(R=!0,t(N))},e.unstable_getCurrentPriorityLevel=function(){return q},e.unstable_getFirstCallbackNode=function(){return P(M)},e.unstable_next=function(n){switch(q){case 1:case 2:case 3:var e=3;break;default:e=q}var t=q;q=e;try{return n()}finally{q=t}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=U,e.unstable_runWithPriority=function(n,e){switch(n){case 1:case 2:case 3:case 4:case 5:break;default:n=3}var t=q;q=n;try{return e()}finally{q=t}},e.unstable_scheduleCallback=function(n,a,l){var i=e.unstable_now();if("object"==typeof l&&null!==l){var u=l.delay;u="number"==typeof u&&0<u?i+u:i,l="number"==typeof l.timeout?l.timeout:B(n)}else l=B(n),u=i;return n={id:A++,callback:a,priorityLevel:n,startTime:u,expirationTime:l=u+l,sortIndex:-1},u>i?(n.sortIndex=u,x(C,n),null===P(M)&&n===P(C)&&(j?o():j=!0,r(J,u-i))):(n.sortIndex=l,x(M,n),R||D||(R=!0,t(N))),n},e.unstable_shouldYield=function(){var n=e.unstable_now();E(n);var t=P(M);return t!==L&&null!==L&&null!==t&&null!==t.callback&&t.startTime<=n&&t.expirationTime<L.expirationTime||a()},e.unstable_wrapCallback=function(n){var e=q;return function(){var t=q;q=e;try{return n.apply(this,arguments)}finally{q=t}}}},3840:(n,e,t)=>{"use strict";n.exports=t(53)}}]);