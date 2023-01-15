"use strict";(self.webpackChunkyagss=self.webpackChunkyagss||[]).push([[736],{8849:(e,t,r)=>{function i(e,t,r){e.prototype=t.prototype=r,r.constructor=e}function n(e,t){var r=Object.create(e.prototype);for(var i in t)r[i]=t[i];return r}function a(){}r.d(t,{ZP:()=>k,B8:()=>M});var s=.7,o=1/s,l="\\s*([+-]?\\d+)\\s*",h="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",u="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",g=/^#([0-9a-f]{3,8})$/,c=new RegExp(`^rgb\\(${l},${l},${l}\\)$`),d=new RegExp(`^rgb\\(${u},${u},${u}\\)$`),p=new RegExp(`^rgba\\(${l},${l},${l},${h}\\)$`),b=new RegExp(`^rgba\\(${u},${u},${u},${h}\\)$`),y=new RegExp(`^hsl\\(${h},${u},${u}\\)$`),m=new RegExp(`^hsla\\(${h},${u},${u},${h}\\)$`),w={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function f(){return this.rgb().formatHex()}function $(){return this.rgb().formatRgb()}function k(e){var t,r;return e=(e+"").trim().toLowerCase(),(t=g.exec(e))?(r=t[1].length,t=parseInt(t[1],16),6===r?N(t):3===r?new q(t>>8&15|t>>4&240,t>>4&15|240&t,(15&t)<<4|15&t,1):8===r?x(t>>24&255,t>>16&255,t>>8&255,(255&t)/255):4===r?x(t>>12&15|t>>8&240,t>>8&15|t>>4&240,t>>4&15|240&t,((15&t)<<4|15&t)/255):null):(t=c.exec(e))?new q(t[1],t[2],t[3],1):(t=d.exec(e))?new q(255*t[1]/100,255*t[2]/100,255*t[3]/100,1):(t=p.exec(e))?x(t[1],t[2],t[3],t[4]):(t=b.exec(e))?x(255*t[1]/100,255*t[2]/100,255*t[3]/100,t[4]):(t=y.exec(e))?O(t[1],t[2]/100,t[3]/100,1):(t=m.exec(e))?O(t[1],t[2]/100,t[3]/100,t[4]):w.hasOwnProperty(e)?N(w[e]):"transparent"===e?new q(NaN,NaN,NaN,0):null}function N(e){return new q(e>>16&255,e>>8&255,255&e,1)}function x(e,t,r,i){return i<=0&&(e=t=r=NaN),new q(e,t,r,i)}function v(e){return e instanceof a||(e=k(e)),e?new q((e=e.rgb()).r,e.g,e.b,e.opacity):new q}function M(e,t,r,i){return 1===arguments.length?v(e):new q(e,t,r,null==i?1:i)}function q(e,t,r,i){this.r=+e,this.g=+t,this.b=+r,this.opacity=+i}function H(){return`#${C(this.r)}${C(this.g)}${C(this.b)}`}function R(){const e=E(this.opacity);return`${1===e?"rgb(":"rgba("}${j(this.r)}, ${j(this.g)}, ${j(this.b)}${1===e?")":`, ${e})`}`}function E(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function j(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function C(e){return((e=j(e))<16?"0":"")+e.toString(16)}function O(e,t,r,i){return i<=0?e=t=r=NaN:r<=0||r>=1?e=t=NaN:t<=0&&(e=NaN),new P(e,t,r,i)}function S(e){if(e instanceof P)return new P(e.h,e.s,e.l,e.opacity);if(e instanceof a||(e=k(e)),!e)return new P;if(e instanceof P)return e;var t=(e=e.rgb()).r/255,r=e.g/255,i=e.b/255,n=Math.min(t,r,i),s=Math.max(t,r,i),o=NaN,l=s-n,h=(s+n)/2;return l?(o=t===s?(r-i)/l+6*(r<i):r===s?(i-t)/l+2:(t-r)/l+4,l/=h<.5?s+n:2-s-n,o*=60):l=h>0&&h<1?0:o,new P(o,l,h,e.opacity)}function P(e,t,r,i){this.h=+e,this.s=+t,this.l=+r,this.opacity=+i}function z(e){return(e=(e||0)%360)<0?e+360:e}function B(e){return Math.max(0,Math.min(1,e||0))}function I(e,t,r){return 255*(e<60?t+(r-t)*e/60:e<180?r:e<240?t+(r-t)*(240-e)/60:t)}i(a,k,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:f,formatHex:f,formatHex8:function(){return this.rgb().formatHex8()},formatHsl:function(){return S(this).formatHsl()},formatRgb:$,toString:$}),i(q,M,n(a,{brighter(e){return e=null==e?o:Math.pow(o,e),new q(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=null==e?s:Math.pow(s,e),new q(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new q(j(this.r),j(this.g),j(this.b),E(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:H,formatHex:H,formatHex8:function(){return`#${C(this.r)}${C(this.g)}${C(this.b)}${C(255*(isNaN(this.opacity)?1:this.opacity))}`},formatRgb:R,toString:R})),i(P,(function(e,t,r,i){return 1===arguments.length?S(e):new P(e,t,r,null==i?1:i)}),n(a,{brighter(e){return e=null==e?o:Math.pow(o,e),new P(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=null==e?s:Math.pow(s,e),new P(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+360*(this.h<0),t=isNaN(e)||isNaN(this.s)?0:this.s,r=this.l,i=r+(r<.5?r:1-r)*t,n=2*r-i;return new q(I(e>=240?e-240:e+120,n,i),I(e,n,i),I(e<120?e+240:e-120,n,i),this.opacity)},clamp(){return new P(z(this.h),B(this.s),B(this.l),E(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=E(this.opacity);return`${1===e?"hsl(":"hsla("}${z(this.h)}, ${100*B(this.s)}%, ${100*B(this.l)}%${1===e?")":`, ${e})`}`}}))}}]);