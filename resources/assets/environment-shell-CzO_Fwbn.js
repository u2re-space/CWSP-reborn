import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{At as t,Gt as n,J as r,Q as i,X as a,a as o,et as s,ft as c,jt as l,nt as u,tt as d,u as f}from"./HistoryManager-D8ebz2Z7.js";import{t as p}from"./src-BQ2lM3dn.js";import{d as m,f as h}from"./registry-DFSCrLsC.js";import{n as g,t as _}from"./preload-helper-NDuSAHbO.js";import{f as v,p as y}from"./views-CgiS38xE.js";import{F as ee,M as te,N as b,k as x,t as S}from"./src-CEYeiPXY.js";import{n as C,t as w}from"./Canvas-2-CXJw6xQl.js";import{t as T}from"./src-C9heO9y9.js";import{n as E}from"./CSSIconRegistry-D88SYH0A.js";import{c as D,l as ne,n as re,o as O,s as k,t as ie}from"./shells-BdXiq-ll.js";import{t as A}from"./src-CMTOGM3X.js";var ae=e((()=>{})),oe,se=e((()=>{oe=(e,t)=>{if(typeof e==`number`){if(t===3)return{mode:`rgb`,r:(e>>8&15|e>>4&240)/255,g:(e>>4&15|e&240)/255,b:(e&15|e<<4&240)/255};if(t===4)return{mode:`rgb`,r:(e>>12&15|e>>8&240)/255,g:(e>>8&15|e>>4&240)/255,b:(e>>4&15|e&240)/255,alpha:(e&15|e<<4&240)/255};if(t===6)return{mode:`rgb`,r:(e>>16&255)/255,g:(e>>8&255)/255,b:(e&255)/255};if(t===8)return{mode:`rgb`,r:(e>>24&255)/255,g:(e>>16&255)/255,b:(e>>8&255)/255,alpha:(e&255)/255}}}})),ce,le=e((()=>{ce={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074}})),ue,de=e((()=>{se(),le(),ue=e=>oe(ce[e.toLowerCase()],6)})),fe,pe,me=e((()=>{se(),fe=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,pe=e=>{let t;return(t=e.match(fe))?oe(parseInt(t[1],16),t[1].length):void 0}})),j,he,ge,_e,ve,ye,be=e((()=>{j=`([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)`,`${j}`,he=`${j}%`,`${j}`,ge=`(?:${j}%|${j})`,_e=`(?:${j}%|${j}|none)`,ve=`(?:${j}(deg|grad|rad|turn)|${j})`,`${j}${j}`,ye=`\\s*,\\s*`,RegExp(`^`+_e+`$`)})),xe,Se,Ce,we=e((()=>{be(),xe=RegExp(`^rgba?\\(\\s*${j}${ye}${j}${ye}${j}\\s*(?:,\\s*${ge}\\s*)?\\)$`),Se=RegExp(`^rgba?\\(\\s*${he}${ye}${he}${ye}${he}\\s*(?:,\\s*${ge}\\s*)?\\)$`),Ce=e=>{let t={mode:`rgb`},n;if(n=e.match(xe))n[1]!==void 0&&(t.r=n[1]/255),n[2]!==void 0&&(t.g=n[2]/255),n[3]!==void 0&&(t.b=n[3]/255);else if(n=e.match(Se))n[1]!==void 0&&(t.r=n[1]/100),n[2]!==void 0&&(t.g=n[2]/100),n[3]!==void 0&&(t.b=n[3]/100);else return;return n[4]===void 0?n[5]!==void 0&&(t.alpha=Math.max(0,Math.min(1,+n[5]))):t.alpha=Math.max(0,Math.min(1,n[4]/100)),t}})),Te,Ee=e((()=>{Xe(),Te=(e,t)=>e===void 0?void 0:typeof e==`object`?e.mode===void 0?t?{...e,mode:t}:void 0:e:Ye(e)})),De,Oe=e((()=>{Fe(),Ee(),De=(e=`rgb`)=>t=>(t=Te(t,e))===void 0?void 0:t.mode===e?t:M[t.mode][e]?M[t.mode][e](t):e===`rgb`?M[t.mode].rgb(t):M.rgb[e](M[t.mode].rgb(t))})),M,ke,Ae,je,Me,N,Ne,Pe,Fe=e((()=>{Oe(),M={},ke={},Ae=[],je={},Me=e=>e,N=e=>(M[e.mode]={...M[e.mode],...e.toMode},Object.keys(e.fromMode||{}).forEach(t=>{M[t]||(M[t]={}),M[t][e.mode]=e.fromMode[t]}),e.ranges||={},e.difference||={},e.channels.forEach(t=>{if(e.ranges[t]===void 0&&(e.ranges[t]=[0,1]),!e.interpolate[t])throw Error(`Missing interpolator for: ${t}`);typeof e.interpolate[t]==`function`&&(e.interpolate[t]={use:e.interpolate[t]}),e.interpolate[t].fixup||(e.interpolate[t].fixup=Me)}),ke[e.mode]=e,(e.parse||[]).forEach(t=>{Pe(t,e.mode)}),De(e.mode)),Ne=e=>ke[e],Pe=(e,t)=>{if(typeof e==`string`){if(!t)throw Error(`'mode' required when 'parser' is a string`);je[e]=t}else typeof e==`function`&&Ae.indexOf(e)<0&&Ae.push(e)}}));function Ie(e){let t=e[F],n=e[F+1];return t===`-`||t===`+`?/\d/.test(n)||n===`.`&&/\d/.test(e[F+2]):t===`.`?/\d/.test(n):/\d/.test(t)}function Le(e){if(F>=e.length)return!1;let t=e[F];if(Ke.test(t))return!0;if(t===`-`){if(e.length-F<2)return!1;let t=e[F+1];return!!(t===`-`||Ke.test(t))}return!1}function Re(e){let t=``;if((e[F]===`-`||e[F]===`+`)&&(t+=e[F++]),t+=ze(e),e[F]===`.`&&/\d/.test(e[F+1])&&(t+=e[F++]+ze(e)),(e[F]===`e`||e[F]===`E`)&&((e[F+1]===`-`||e[F+1]===`+`)&&/\d/.test(e[F+2])?t+=e[F++]+e[F++]+ze(e):/\d/.test(e[F+1])&&(t+=e[F++]+ze(e))),Le(e)){let n=Be(e);return n===`deg`||n===`rad`||n===`turn`||n===`grad`?{type:P.Hue,value:t*Je[n]}:void 0}return e[F]===`%`?(F++,{type:P.Percentage,value:+t}):{type:P.Number,value:+t}}function ze(e){let t=``;for(;/\d/.test(e[F]);)t+=e[F++];return t}function Be(e){let t=``;for(;F<e.length&&qe.test(e[F]);)t+=e[F++];return t}function Ve(e){let t=Be(e);return e[F]===`(`?(F++,{type:P.Function,value:t}):t===`none`?{type:P.None,value:void 0}:{type:P.Ident,value:t}}function He(e=``){let t=e.trim(),n=[],r;for(F=0;F<t.length;){if(r=t[F++],r===`
`||r===`	`||r===` `){for(;F<t.length&&(t[F]===`
`||t[F]===`	`||t[F]===` `);)F++;continue}if(r===`,`)return;if(r===`)`){n.push({type:P.ParenClose});continue}if(r===`+`){if(F--,Ie(t)){n.push(Re(t));continue}return}if(r===`-`){if(F--,Ie(t)){n.push(Re(t));continue}if(Le(t)){n.push({type:P.Ident,value:Be(t)});continue}return}if(r===`.`){if(F--,Ie(t)){n.push(Re(t));continue}return}if(r===`/`){for(;F<t.length&&(t[F]===`
`||t[F]===`	`||t[F]===` `);)F++;let e;if(Ie(t)&&(e=Re(t),e.type!==P.Hue)){n.push({type:P.Alpha,value:e});continue}if(Le(t)&&Be(t)===`none`){n.push({type:P.Alpha,value:{type:P.None,value:void 0}});continue}return}if(/\d/.test(r)){F--,n.push(Re(t));continue}if(Ke.test(r)){F--,n.push(Ve(t));continue}return}return n}function Ue(e){e._i=0;let t=e[e._i++];if(!t||t.type!==P.Function||t.value!==`color`||(t=e[e._i++],t.type!==P.Ident))return;let n=je[t.value];if(!n)return;let r={mode:n},i=We(e,!1);if(!i)return;let a=Ne(n).channels;for(let e=0,t,n;e<a.length;e++)t=i[e],n=a[e],t.type!==P.None&&(r[n]=t.type===P.Number?t.value:t.value/100,n===`alpha`&&(r[n]=Math.max(0,Math.min(1,r[n]))));return r}function We(e,t){let n=[],r;for(;e._i<e.length;){if(r=e[e._i++],r.type===P.None||r.type===P.Number||r.type===P.Alpha||r.type===P.Percentage||t&&r.type===P.Hue){n.push(r);continue}if(r.type===P.ParenClose){if(e._i<e.length)return;continue}return}if(!(n.length<3||n.length>4)){if(n.length===4){if(n[3].type!==P.Alpha)return;n[3]=n[3].value}return n.length===3&&n.push({type:P.None,value:void 0}),n.every(e=>e.type!==P.Alpha)?n:void 0}}function Ge(e,t){e._i=0;let n=e[e._i++];if(!n||n.type!==P.Function)return;let r=We(e,t);if(r)return r.unshift(n.value),r}var Ke,qe,P,F,Je,Ye,Xe=e((()=>{Fe(),Ke=/[^\x00-\x7F]|[a-zA-Z_]/,qe=/[^\x00-\x7F]|[-\w]/,P={Function:`function`,Ident:`ident`,Number:`number`,Percentage:`percentage`,ParenClose:`)`,None:`none`,Hue:`hue`,Alpha:`alpha`},F=0,Je={deg:1,rad:180/Math.PI,grad:9/10,turn:360},Ye=e=>{if(typeof e!=`string`)return;let t=He(e),n=t?Ge(t,!0):void 0,r,i=0,a=Ae.length;for(;i<a;)if((r=Ae[i++](e,n))!==void 0)return r;return t?Ue(t):void 0}}));function Ze(e,t){if(!t||t[0]!==`rgb`&&t[0]!==`rgba`)return;let n={mode:`rgb`},[,r,i,a,o]=t;if(!(r.type===P.Hue||i.type===P.Hue||a.type===P.Hue))return r.type!==P.None&&(n.r=r.type===P.Number?r.value/255:r.value/100),i.type!==P.None&&(n.g=i.type===P.Number?i.value/255:i.value/100),a.type!==P.None&&(n.b=a.type===P.Number?a.value/255:a.value/100),o.type!==P.None&&(n.alpha=Math.min(1,Math.max(0,o.type===P.Number?o.value:o.value/100))),n}var Qe=e((()=>{Xe()})),$e,et=e((()=>{$e=e=>e===`transparent`?{mode:`rgb`,r:0,g:0,b:0,alpha:0}:void 0})),tt,nt=e((()=>{tt=(e,t,n)=>e+n*(t-e)})),rt,it,at=e((()=>{rt=e=>{let t=[];for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1];r===void 0&&i===void 0?t.push(void 0):r!==void 0&&i!==void 0?t.push([r,i]):t.push(r===void 0?[i,i]:[r,r])}return t},it=e=>t=>{let n=rt(t);return t=>{let r=t*n.length,i=t>=1?n.length-1:Math.max(Math.floor(r),0),a=n[i];return a===void 0?void 0:e(a[0],a[1],r-i)}}})),I,L=e((()=>{nt(),at(),I=it(tt)})),R,z=e((()=>{R=e=>{let t=!1,n=e.map(e=>e===void 0?1:(t=!0,e));return t?n:e}})),ot,st=e((()=>{de(),me(),we(),Qe(),et(),L(),z(),ot={mode:`rgb`,channels:[`r`,`g`,`b`,`alpha`],parse:[Ze,pe,Ce,ue,$e,`srgb`],serialize:`srgb`,interpolate:{r:I,g:I,b:I,alpha:{use:I,fixup:R}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}}})),ct,lt,ut=e((()=>{ct=(e=0)=>Math.abs(e)**(563/256)*Math.sign(e),lt=e=>{let t=ct(e.r),n=ct(e.g),r=ct(e.b),i={mode:`xyz65`,x:.5766690429101305*t+.1855582379065463*n+.1882286462349947*r,y:.297344975250536*t+.6273635662554661*n+.0752914584939979*r,z:.0270313613864123*t+.0706888525358272*n+.9913375368376386*r};return e.alpha!==void 0&&(i.alpha=e.alpha),i}})),dt,ft,pt=e((()=>{dt=e=>Math.abs(e)**(256/563)*Math.sign(e),ft=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`a98`,r:dt(e*2.0415879038107465-t*.5650069742788597-.3447313507783297*n),g:dt(e*-.9692436362808798+t*1.8759675015077206+.0415550574071756*n),b:dt(e*.0134442806320312-t*.1183623922310184+1.0151749943912058*n)};return r!==void 0&&(i.alpha=r),i}})),mt,ht,gt=e((()=>{mt=(e=0)=>{let t=Math.abs(e);return t<=.04045?e/12.92:(Math.sign(e)||1)*((t+.055)/1.055)**2.4},ht=({r:e,g:t,b:n,alpha:r})=>{let i={mode:`lrgb`,r:mt(e),g:mt(t),b:mt(n)};return r!==void 0&&(i.alpha=r),i}})),_t,vt=e((()=>{gt(),_t=e=>{let{r:t,g:n,b:r,alpha:i}=ht(e),a={mode:`xyz65`,x:.4123907992659593*t+.357584339383878*n+.1804807884018343*r,y:.2126390058715102*t+.715168678767756*n+.0721923153607337*r,z:.0193308187155918*t+.119194779794626*n+.9505321522496607*r};return i!==void 0&&(a.alpha=i),a}})),yt,bt,xt=e((()=>{yt=(e=0)=>{let t=Math.abs(e);return t>.0031308?(Math.sign(e)||1)*(1.055*t**(1/2.4)-.055):e*12.92},bt=({r:e,g:t,b:n,alpha:r},i=`rgb`)=>{let a={mode:i,r:yt(e),g:yt(t),b:yt(n)};return r!==void 0&&(a.alpha=r),a}})),St,Ct=e((()=>{xt(),St=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=bt({r:e*3.2409699419045226-t*1.537383177570094-.4986107602930034*n,g:e*-.9692436362808796+t*1.8759675015077204+.0415550574071756*n,b:e*.0556300796969936-t*.2039769588889765+1.0569715142428784*n});return r!==void 0&&(i.alpha=r),i}})),wt,Tt=e((()=>{st(),ut(),pt(),vt(),Ct(),wt={...ot,mode:`a98`,parse:[`a98-rgb`],serialize:`a98-rgb`,fromMode:{rgb:e=>ft(_t(e)),xyz65:ft},toMode:{rgb:e=>St(lt(e)),xyz65:lt}}})),B,V=e((()=>{B=e=>(e%=360)<0?e+360:e})),Et,H,U=e((()=>{V(),Et=(e,t)=>e.map((n,r,i)=>{if(n===void 0)return n;let a=B(n);return r===0||e[r-1]===void 0?a:t(a-B(i[r-1]))}).reduce((e,t)=>!e.length||t===void 0||e[e.length-1]===void 0?(e.push(t),e):(e.push(t+e[e.length-1]),e),[]),H=e=>Et(e,e=>Math.abs(e)<=180?e:e-360*Math.sign(e))})),W,Dt,Ot,kt=e((()=>{W=[-.14861,1.78277,-.29227,-.90649,1.97294,0],Dt=Math.PI/180,Ot=180/Math.PI})),At,jt,Mt,Nt,Pt=e((()=>{kt(),At=W[3]*W[4],jt=W[1]*W[4],Mt=W[1]*W[2]-W[0]*W[3],Nt=({r:e,g:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(Mt*n+e*At-t*jt)/(Mt+At-jt),a=n-i,o=(W[4]*(t-i)-W[2]*a)/W[3],s={mode:`cubehelix`,l:i,s:i===0||i===1?void 0:Math.sqrt(a*a+o*o)/(W[4]*i*(1-i))};return s.s&&(s.h=Math.atan2(o,a)*Ot-120),r!==void 0&&(s.alpha=r),s}})),Ft,It=e((()=>{kt(),Ft=({h:e,s:t,l:n,alpha:r})=>{let i={mode:`rgb`};e=(e===void 0?0:e+120)*Dt,n===void 0&&(n=0);let a=t===void 0?0:t*n*(1-n),o=Math.cos(e),s=Math.sin(e);return i.r=n+a*(W[0]*o+W[1]*s),i.g=n+a*(W[2]*o+W[3]*s),i.b=n+a*(W[4]*o+W[5]*s),r!==void 0&&(i.alpha=r),i}})),Lt,Rt,zt,G=e((()=>{V(),Lt=(e,t)=>{if(e.h===void 0||t.h===void 0||!e.s||!t.s)return 0;let n=B(e.h),r=B(t.h),i=Math.sin((r-n+360)/2*Math.PI/180);return 2*Math.sqrt(e.s*t.s)*i},Rt=(e,t)=>{if(e.h===void 0||t.h===void 0)return 0;let n=B(e.h),r=B(t.h);return Math.abs(r-n)>180?n-(r-360*Math.sign(r-n)):r-n},zt=(e,t)=>{if(e.h===void 0||t.h===void 0||!e.c||!t.c)return 0;let n=B(e.h),r=B(t.h),i=Math.sin((r-n+360)/2*Math.PI/180);return 2*Math.sqrt(e.c*t.c)*i}})),K,q=e((()=>{K=e=>{let t=e.reduce((e,t)=>{if(t!==void 0){let n=t*Math.PI/180;e.sin+=Math.sin(n),e.cos+=Math.cos(n)}return e},{sin:0,cos:0}),n=Math.atan2(t.sin,t.cos)*180/Math.PI;return n<0?360+n:n}})),Bt,Vt=e((()=>{U(),z(),L(),Pt(),It(),G(),q(),Bt={mode:`cubehelix`,channels:[`h`,`s`,`l`,`alpha`],parse:[`--cubehelix`],serialize:`--cubehelix`,ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:Nt},toMode:{rgb:Ft},interpolate:{h:{use:I,fixup:H},s:I,l:I,alpha:{use:I,fixup:R}},difference:{h:Lt},average:{h:K}}})),Ht,Ut=e((()=>{V(),Ht=({l:e,a:t,b:n,alpha:r},i=`lch`)=>{t===void 0&&(t=0),n===void 0&&(n=0);let a=Math.sqrt(t*t+n*n),o={mode:i,l:e,c:a};return a&&(o.h=B(Math.atan2(n,t)*180/Math.PI)),r!==void 0&&(o.alpha=r),o}})),Wt,Gt=e((()=>{Wt=({l:e,c:t,h:n,alpha:r},i=`lab`)=>{n===void 0&&(n=0);let a={mode:i,l:e,a:t?t*Math.cos(n/180*Math.PI):0,b:t?t*Math.sin(n/180*Math.PI):0};return r!==void 0&&(a.alpha=r),a}})),Kt,qt,Jt=e((()=>{Kt=29**3/3**3,qt=6**3/29**3})),J,Yt,Xt=e((()=>{J={X:.3457/.3585,Y:1,Z:.2958/.3585},Yt={X:.3127/.329,Y:1,Z:.3583/.329}})),Zt,Qt,$t=e((()=>{Jt(),Xt(),Zt=e=>e**3>qt?e**3:(116*e-16)/Kt,Qt=({l:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(e+16)/116,a=t/500+i,o=i-n/200,s={mode:`xyz65`,x:Zt(a)*Yt.X,y:Zt(i)*Yt.Y,z:Zt(o)*Yt.Z};return r!==void 0&&(s.alpha=r),s}})),en,tn=e((()=>{$t(),Ct(),en=e=>St(Qt(e))})),nn,rn,an=e((()=>{Jt(),Xt(),nn=e=>e>qt?Math.cbrt(e):(Kt*e+16)/116,rn=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=nn(e/Yt.X),a=nn(t/Yt.Y),o=nn(n/Yt.Z),s={mode:`lab65`,l:116*a-16,a:500*(i-a),b:200*(a-o)};return r!==void 0&&(s.alpha=r),s}})),on,sn=e((()=>{vt(),an(),on=e=>{let t=rn(_t(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t}})),cn,ln,un,dn,fn=e((()=>{cn=26/180*Math.PI,ln=Math.cos(cn),un=Math.sin(cn),dn=100/Math.log(139/100)})),pn,mn=e((()=>{fn(),pn=({l:e,c:t,h:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`lab65`,l:(Math.exp(e*1/dn)-1)/.0039},a=(Math.exp(.0435*t*1*1)-1)/.075,o=a*Math.cos(n/180*Math.PI-cn),s=a*Math.sin(n/180*Math.PI-cn);return i.a=o*ln-s/.83*un,i.b=o*un+s/.83*ln,r!==void 0&&(i.alpha=r),i}})),hn,gn=e((()=>{fn(),V(),hn=({l:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=t*ln+n*un,a=.83*(n*ln-t*un),o=Math.sqrt(i*i+a*a),s={mode:`dlch`,l:dn/1*Math.log(1+.0039*e),c:Math.log(1+.075*o)/(.0435*1*1)};return s.c&&(s.h=B((Math.atan2(a,i)+cn)/Math.PI*180)),r!==void 0&&(s.alpha=r),s}})),_n,vn,yn,bn=e((()=>{Ut(),Gt(),tn(),sn(),mn(),gn(),L(),z(),_n=e=>pn(Ht(e,`dlch`)),vn=e=>Wt(hn(e),`dlab`),yn={mode:`dlab`,parse:[`--din99o-lab`],serialize:`--din99o-lab`,toMode:{lab65:_n,rgb:e=>en(_n(e))},fromMode:{lab65:vn,rgb:e=>vn(on(e))},channels:[`l`,`a`,`b`,`alpha`],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:I,a:I,b:I,alpha:{use:I,fixup:R}}}})),xn,Sn=e((()=>{Ut(),Gt(),mn(),gn(),tn(),sn(),U(),z(),L(),G(),q(),xn={mode:`dlch`,parse:[`--din99o-lch`],serialize:`--din99o-lch`,toMode:{lab65:pn,dlab:e=>Wt(e,`dlab`),rgb:e=>en(pn(e))},fromMode:{lab65:hn,dlab:e=>Ht(e,`dlch`),rgb:e=>hn(on(e))},channels:[`l`,`c`,`h`,`alpha`],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:I,c:I,h:{use:I,fixup:H},alpha:{use:I,fixup:R}},difference:{h:zt},average:{h:K}}}));function Cn({h:e,s:t,i:n,alpha:r}){e=B(e===void 0?0:e),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.abs(e/60%2-1),a;switch(Math.floor(e/60)){case 0:a={r:n*(1+t*(3/(2-i)-1)),g:n*(1+t*(3*(1-i)/(2-i)-1)),b:n*(1-t)};break;case 1:a={r:n*(1+t*(3*(1-i)/(2-i)-1)),g:n*(1+t*(3/(2-i)-1)),b:n*(1-t)};break;case 2:a={r:n*(1-t),g:n*(1+t*(3/(2-i)-1)),b:n*(1+t*(3*(1-i)/(2-i)-1))};break;case 3:a={r:n*(1-t),g:n*(1+t*(3*(1-i)/(2-i)-1)),b:n*(1+t*(3/(2-i)-1))};break;case 4:a={r:n*(1+t*(3*(1-i)/(2-i)-1)),g:n*(1-t),b:n*(1+t*(3/(2-i)-1))};break;case 5:a={r:n*(1+t*(3/(2-i)-1)),g:n*(1-t),b:n*(1+t*(3*(1-i)/(2-i)-1))};break;default:a={r:n*(1-t),g:n*(1-t),b:n*(1-t)}}return a.mode=`rgb`,r!==void 0&&(a.alpha=r),a}var wn=e((()=>{V()}));function Tn({r:e,g:t,b:n,alpha:r}){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.max(e,t,n),a=Math.min(e,t,n),o={mode:`hsi`,s:e+t+n===0?0:1-3*a/(e+t+n),i:(e+t+n)/3};return i-a!==0&&(o.h=(i===e?(t-n)/(i-a)+(t<n)*6:i===t?(n-e)/(i-a)+2:(e-t)/(i-a)+4)*60),r!==void 0&&(o.alpha=r),o}var En=e((()=>{})),Dn,On=e((()=>{wn(),En(),U(),z(),L(),G(),q(),Dn={mode:`hsi`,toMode:{rgb:Cn},parse:[`--hsi`],serialize:`--hsi`,fromMode:{rgb:Tn},channels:[`h`,`s`,`i`,`alpha`],ranges:{h:[0,360]},gamut:`rgb`,interpolate:{h:{use:I,fixup:H},s:I,i:I,alpha:{use:I,fixup:R}},difference:{h:Lt},average:{h:K}}}));function kn({h:e,s:t,l:n,alpha:r}){e=B(e===void 0?0:e),t===void 0&&(t=0),n===void 0&&(n=0);let i=n+t*(n<.5?n:1-n),a=i-(i-n)*2*Math.abs(e/60%2-1),o;switch(Math.floor(e/60)){case 0:o={r:i,g:a,b:2*n-i};break;case 1:o={r:a,g:i,b:2*n-i};break;case 2:o={r:2*n-i,g:i,b:a};break;case 3:o={r:2*n-i,g:a,b:i};break;case 4:o={r:a,g:2*n-i,b:i};break;case 5:o={r:i,g:2*n-i,b:a};break;default:o={r:2*n-i,g:2*n-i,b:2*n-i}}return o.mode=`rgb`,r!==void 0&&(o.alpha=r),o}var An=e((()=>{V()}));function jn({r:e,g:t,b:n,alpha:r}){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.max(e,t,n),a=Math.min(e,t,n),o={mode:`hsl`,s:i===a?0:(i-a)/(1-Math.abs(i+a-1)),l:.5*(i+a)};return i-a!==0&&(o.h=(i===e?(t-n)/(i-a)+(t<n)*6:i===t?(n-e)/(i-a)+2:(e-t)/(i-a)+4)*60),r!==void 0&&(o.alpha=r),o}var Mn=e((()=>{})),Nn,Pn=e((()=>{Nn=(e,t)=>{switch(t){case`deg`:return+e;case`rad`:return e/Math.PI*180;case`grad`:return e/10*9;case`turn`:return e*360}}})),Fn,In,Ln=e((()=>{Pn(),be(),Fn=RegExp(`^hsla?\\(\\s*${ve}${ye}${he}${ye}${he}\\s*(?:,\\s*${ge}\\s*)?\\)$`),In=e=>{let t=e.match(Fn);if(!t)return;let n={mode:`hsl`};return t[3]===void 0?t[1]!==void 0&&t[2]!==void 0&&(n.h=Nn(t[1],t[2])):n.h=+t[3],t[4]!==void 0&&(n.s=Math.min(Math.max(0,t[4]/100),1)),t[5]!==void 0&&(n.l=Math.min(Math.max(0,t[5]/100),1)),t[6]===void 0?t[7]!==void 0&&(n.alpha=Math.max(0,Math.min(1,+t[7]))):n.alpha=Math.max(0,Math.min(1,t[6]/100)),n}}));function Rn(e,t){if(!t||t[0]!==`hsl`&&t[0]!==`hsla`)return;let n={mode:`hsl`},[,r,i,a,o]=t;if(r.type!==P.None){if(r.type===P.Percentage)return;n.h=r.value}if(i.type!==P.None){if(i.type===P.Hue)return;n.s=i.value/100}if(a.type!==P.None){if(a.type===P.Hue)return;n.l=a.value/100}return o.type!==P.None&&(n.alpha=Math.min(1,Math.max(0,o.type===P.Number?o.value:o.value/100))),n}var zn=e((()=>{Xe()})),Bn,Vn=e((()=>{An(),Mn(),Ln(),zn(),U(),z(),L(),G(),q(),Bn={mode:`hsl`,toMode:{rgb:kn},fromMode:{rgb:jn},channels:[`h`,`s`,`l`,`alpha`],ranges:{h:[0,360]},gamut:`rgb`,parse:[Rn,In],serialize:e=>`hsl(${e.h===void 0?`none`:e.h} ${e.s===void 0?`none`:e.s*100+`%`} ${e.l===void 0?`none`:e.l*100+`%`}${e.alpha<1?` / ${e.alpha}`:``})`,interpolate:{h:{use:I,fixup:H},s:I,l:I,alpha:{use:I,fixup:R}},difference:{h:Lt},average:{h:K}}}));function Hn({h:e,s:t,v:n,alpha:r}){e=B(e===void 0?0:e),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.abs(e/60%2-1),a;switch(Math.floor(e/60)){case 0:a={r:n,g:n*(1-t*i),b:n*(1-t)};break;case 1:a={r:n*(1-t*i),g:n,b:n*(1-t)};break;case 2:a={r:n*(1-t),g:n,b:n*(1-t*i)};break;case 3:a={r:n*(1-t),g:n*(1-t*i),b:n};break;case 4:a={r:n*(1-t*i),g:n*(1-t),b:n};break;case 5:a={r:n,g:n*(1-t),b:n*(1-t*i)};break;default:a={r:n*(1-t),g:n*(1-t),b:n*(1-t)}}return a.mode=`rgb`,r!==void 0&&(a.alpha=r),a}var Un=e((()=>{V()}));function Wn({r:e,g:t,b:n,alpha:r}){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.max(e,t,n),a=Math.min(e,t,n),o={mode:`hsv`,s:i===0?0:1-a/i,v:i};return i-a!==0&&(o.h=(i===e?(t-n)/(i-a)+(t<n)*6:i===t?(n-e)/(i-a)+2:(e-t)/(i-a)+4)*60),r!==void 0&&(o.alpha=r),o}var Gn=e((()=>{})),Kn,qn=e((()=>{Un(),Gn(),U(),z(),L(),G(),q(),Kn={mode:`hsv`,toMode:{rgb:Hn},parse:[`--hsv`],serialize:`--hsv`,fromMode:{rgb:Wn},channels:[`h`,`s`,`v`,`alpha`],ranges:{h:[0,360]},gamut:`rgb`,interpolate:{h:{use:I,fixup:H},s:I,v:I,alpha:{use:I,fixup:R}},difference:{h:Lt},average:{h:K}}}));function Jn({h:e,w:t,b:n,alpha:r}){if(t===void 0&&(t=0),n===void 0&&(n=0),t+n>1){let e=t+n;t/=e,n/=e}return Hn({h:e,s:n===1?1:1-t/(1-n),v:1-n,alpha:r})}var Yn=e((()=>{Un()}));function Xn(e){let t=Wn(e);if(t===void 0)return;let n=t.s===void 0?0:t.s,r=t.v===void 0?0:t.v,i={mode:`hwb`,w:(1-n)*r,b:1-r};return t.h!==void 0&&(i.h=t.h),t.alpha!==void 0&&(i.alpha=t.alpha),i}var Zn=e((()=>{Gn()}));function Qn(e,t){if(!t||t[0]!==`hwb`)return;let n={mode:`hwb`},[,r,i,a,o]=t;if(r.type!==P.None){if(r.type===P.Percentage)return;n.h=r.value}if(i.type!==P.None){if(i.type===P.Hue)return;n.w=i.value/100}if(a.type!==P.None){if(a.type===P.Hue)return;n.b=a.value/100}return o.type!==P.None&&(n.alpha=Math.min(1,Math.max(0,o.type===P.Number?o.value:o.value/100))),n}var $n=e((()=>{Xe()})),er,tr=e((()=>{Yn(),Zn(),$n(),U(),z(),L(),G(),q(),er={mode:`hwb`,toMode:{rgb:Jn},fromMode:{rgb:Xn},channels:[`h`,`w`,`b`,`alpha`],ranges:{h:[0,360]},gamut:`rgb`,parse:[Qn],serialize:e=>`hwb(${e.h===void 0?`none`:e.h} ${e.w===void 0?`none`:e.w*100+`%`} ${e.b===void 0?`none`:e.b*100+`%`}${e.alpha<1?` / ${e.alpha}`:``})`,interpolate:{h:{use:I,fixup:H},w:I,b:I,alpha:{use:I,fixup:R}},difference:{h:Rt},average:{h:K}}})),nr=e((()=>{}));function rr(e){if(e<0)return 0;let t=e**(1/or);return 1e4*(Math.max(0,t-sr)/(cr-lr*t))**(1/ar)}function ir(e){if(e<0)return 0;let t=(e/1e4)**ar;return((sr+cr*t)/(1+lr*t))**+or}var ar,or,sr,cr,lr,ur=e((()=>{ar=.1593017578125,or=78.84375,sr=.8359375,cr=18.8515625,lr=18.6875})),dr,fr,pr=e((()=>{nr(),ur(),dr=e=>Math.max(e/203,0),fr=({i:e,t,p:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=rr(e+.008609037037932761*t+.11102962500302593*n),a=rr(e-.00860903703793275*t-.11102962500302599*n),o=rr(e+.5600313357106791*t-.32062717498731885*n),s={mode:`xyz65`,x:dr(2.070152218389422*i-1.3263473389671556*a+.2066510476294051*o),y:dr(.3647385209748074*i+.680566024947227*a-.0453045459220346*o),z:dr(-.049747207535812*i-.0492609666966138*a+1.1880659249923042*o)};return r!==void 0&&(s.alpha=r),s}})),mr,hr,gr=e((()=>{nr(),ur(),mr=(e=0)=>Math.max(e*203,0),hr=({x:e,y:t,z:n,alpha:r})=>{let i=mr(e),a=mr(t),o=mr(n),s=ir(.3592832590121217*i+.6976051147779502*a-.0358915932320289*o),c=ir(-.1920808463704995*i+1.1004767970374323*a+.0753748658519118*o),l=ir(.0070797844607477*i+.0748396662186366*a+.8433265453898765*o),u={mode:`itp`,i:.5*s+.5*c,t:1.61376953125*s-3.323486328125*c+1.709716796875*l,p:4.378173828125*s-4.24560546875*c-.132568359375*l};return r!==void 0&&(u.alpha=r),u}})),_r,vr=e((()=>{L(),z(),pr(),gr(),vt(),Ct(),_r={mode:`itp`,channels:[`i`,`t`,`p`,`alpha`],parse:[`--ictcp`],serialize:`--ictcp`,toMode:{xyz65:fr,rgb:e=>St(fr(e))},fromMode:{xyz65:hr,rgb:e=>hr(_t(e))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:I,t:I,p:I,alpha:{use:I,fixup:R}}}})),yr,br,xr,Sr,Cr,wr=e((()=>{ur(),yr=134.03437499999998,br=16295499532821565e-27,xr=e=>{if(e<0)return 0;let t=(e/1e4)**ar;return((sr+cr*t)/(1+lr*t))**+yr},Sr=(e=0)=>Math.max(e*203,0),Cr=({x:e,y:t,z:n,alpha:r})=>{e=Sr(e),t=Sr(t),n=Sr(n);let i=1.15*e-.15*n,a=.66*t+.34*e,o=xr(.41478972*i+.579999*a+.014648*n),s=xr(-.20151*i+1.120649*a+.0531008*n),c=xr(-.0166008*i+.2648*a+.6684799*n),l=(o+s)/2,u={mode:`jab`,j:.44*l/(1-.56*l)-br,a:3.524*o-4.066708*s+.542708*c,b:.199076*o+1.096799*s-1.295875*c};return r!==void 0&&(u.alpha=r),u}})),Tr,Er,Dr,Or,kr,Ar=e((()=>{ur(),Tr=134.03437499999998,Er=16295499532821565e-27,Dr=e=>{if(e<0)return 0;let t=e**(1/Tr);return 1e4*((sr-t)/(lr*t-cr))**(1/ar)},Or=e=>e/203,kr=({j:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(e+Er)/(.44+.56*(e+Er)),a=Dr(i+.13860504*t+.058047316*n),o=Dr(i-.13860504*t-.058047316*n),s=Dr(i-.096019242*t-.8118919*n),c={mode:`xyz65`,x:Or(1.661373024652174*a-.914523081304348*o+.23136208173913045*s),y:Or(-.3250758611844533*a+1.571847026732543*o-.21825383453227928*s),z:Or(-.090982811*a-.31272829*o+1.5227666*s)};return r!==void 0&&(c.alpha=r),c}})),jr,Mr=e((()=>{wr(),vt(),jr=e=>{let t=Cr(_t(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t}})),Nr,Pr=e((()=>{Ct(),Ar(),Nr=e=>St(kr(e))})),Fr,Ir=e((()=>{wr(),Ar(),Mr(),Pr(),L(),z(),Fr={mode:`jab`,channels:[`j`,`a`,`b`,`alpha`],parse:[`--jzazbz`],serialize:`--jzazbz`,fromMode:{rgb:jr,xyz65:Cr},toMode:{rgb:Nr,xyz65:kr},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:I,a:I,b:I,alpha:{use:I,fixup:R}}}})),Lr,Rr=e((()=>{V(),Lr=({j:e,a:t,b:n,alpha:r})=>{t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.sqrt(t*t+n*n),a={mode:`jch`,j:e,c:i};return i&&(a.h=B(Math.atan2(n,t)*180/Math.PI)),r!==void 0&&(a.alpha=r),a}})),zr,Br=e((()=>{zr=({j:e,c:t,h:n,alpha:r})=>{n===void 0&&(n=0);let i={mode:`jab`,j:e,a:t?t*Math.cos(n/180*Math.PI):0,b:t?t*Math.sin(n/180*Math.PI):0};return r!==void 0&&(i.alpha=r),i}})),Vr,Hr=e((()=>{Rr(),Br(),Pr(),Mr(),U(),z(),L(),G(),q(),Vr={mode:`jch`,parse:[`--jzczhz`],serialize:`--jzczhz`,toMode:{jab:zr,rgb:e=>Nr(zr(e))},fromMode:{rgb:e=>Lr(jr(e)),jab:Lr},channels:[`j`,`c`,`h`,`alpha`],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:I,fixup:H},c:I,j:I,alpha:{use:I,fixup:R}},difference:{h:zt},average:{h:K}}})),Ur,Wr,Gr=e((()=>{Ur=29**3/3**3,Wr=6**3/29**3})),Kr,qr,Jr=e((()=>{Gr(),Xt(),Kr=e=>e**3>Wr?e**3:(116*e-16)/Ur,qr=({l:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(e+16)/116,a=t/500+i,o=i-n/200,s={mode:`xyz50`,x:Kr(a)*J.X,y:Kr(i)*J.Y,z:Kr(o)*J.Z};return r!==void 0&&(s.alpha=r),s}})),Yr,Xr=e((()=>{xt(),Yr=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=bt({r:e*3.1341359569958707-t*1.6173863321612538-.4906619460083532*n,g:e*-.978795502912089+t*1.916254567259524+.03344273116131949*n,b:e*.07195537988411677-t*.2289768264158322+1.405386058324125*n});return r!==void 0&&(i.alpha=r),i}})),Zr,Qr=e((()=>{Jr(),Xr(),Zr=e=>Yr(qr(e))})),$r,ei=e((()=>{gt(),$r=e=>{let{r:t,g:n,b:r,alpha:i}=ht(e),a={mode:`xyz50`,x:.436065742824811*t+.3851514688337912*n+.14307845442264197*r,y:.22249319175623702*t+.7168870538238823*n+.06061979053616537*r,z:.013923904500943465*t+.09708128566574634*n+.7140993584005155*r};return i!==void 0&&(a.alpha=i),a}})),ti,ni,ri=e((()=>{Gr(),Xt(),ti=e=>e>Wr?Math.cbrt(e):(Ur*e+16)/116,ni=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=ti(e/J.X),a=ti(t/J.Y),o=ti(n/J.Z),s={mode:`lab`,l:116*a-16,a:500*(i-a),b:200*(a-o)};return r!==void 0&&(s.alpha=r),s}})),ii,ai=e((()=>{ei(),ri(),ii=e=>{let t=ni($r(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t}}));function oi(e,t){if(!t||t[0]!==`lab`)return;let n={mode:`lab`},[,r,i,a,o]=t;if(!(r.type===P.Hue||i.type===P.Hue||a.type===P.Hue))return r.type!==P.None&&(n.l=Math.min(Math.max(0,r.value),100)),i.type!==P.None&&(n.a=i.type===P.Number?i.value:i.value*125/100),a.type!==P.None&&(n.b=a.type===P.Number?a.value:a.value*125/100),o.type!==P.None&&(n.alpha=Math.min(1,Math.max(0,o.type===P.Number?o.value:o.value/100))),n}var si=e((()=>{Xe()})),ci,li=e((()=>{Qr(),Jr(),ai(),ri(),si(),L(),z(),ci={mode:`lab`,toMode:{xyz50:qr,rgb:Zr},fromMode:{xyz50:ni,rgb:ii},channels:[`l`,`a`,`b`,`alpha`],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[oi],serialize:e=>`lab(${e.l===void 0?`none`:e.l} ${e.a===void 0?`none`:e.a} ${e.b===void 0?`none`:e.b}${e.alpha<1?` / ${e.alpha}`:``})`,interpolate:{l:I,a:I,b:I,alpha:{use:I,fixup:R}}}})),ui,di=e((()=>{tn(),$t(),sn(),an(),li(),ui={...ci,mode:`lab65`,parse:[`--lab-d65`],serialize:`--lab-d65`,toMode:{xyz65:Qt,rgb:en},fromMode:{xyz65:rn,rgb:on},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}}}));function fi(e,t){if(!t||t[0]!==`lch`)return;let n={mode:`lch`},[,r,i,a,o]=t;if(r.type!==P.None){if(r.type===P.Hue)return;n.l=Math.min(Math.max(0,r.value),100)}if(i.type!==P.None&&(n.c=Math.max(0,i.type===P.Number?i.value:i.value*150/100)),a.type!==P.None){if(a.type===P.Percentage)return;n.h=a.value}return o.type!==P.None&&(n.alpha=Math.min(1,Math.max(0,o.type===P.Number?o.value:o.value/100))),n}var pi=e((()=>{Xe()})),mi,hi=e((()=>{Ut(),Gt(),Qr(),ai(),pi(),U(),z(),L(),G(),q(),mi={mode:`lch`,toMode:{lab:Wt,rgb:e=>Zr(Wt(e))},fromMode:{rgb:e=>Ht(ii(e)),lab:Ht},channels:[`l`,`c`,`h`,`alpha`],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[fi],serialize:e=>`lch(${e.l===void 0?`none`:e.l} ${e.c===void 0?`none`:e.c} ${e.h===void 0?`none`:e.h}${e.alpha<1?` / ${e.alpha}`:``})`,interpolate:{h:{use:I,fixup:H},c:I,l:I,alpha:{use:I,fixup:R}},difference:{h:zt},average:{h:K}}})),gi,_i=e((()=>{Ut(),Gt(),tn(),sn(),hi(),gi={...mi,mode:`lch65`,parse:[`--lch-d65`],serialize:`--lch-d65`,toMode:{lab65:e=>Wt(e,`lab65`),rgb:e=>en(Wt(e,`lab65`))},fromMode:{rgb:e=>Ht(on(e),`lch65`),lab65:e=>Ht(e,`lch65`)},ranges:{l:[0,100],c:[0,150],h:[0,360]}}})),vi,yi=e((()=>{V(),vi=({l:e,u:t,v:n,alpha:r})=>{t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.sqrt(t*t+n*n),a={mode:`lchuv`,l:e,c:i};return i&&(a.h=B(Math.atan2(n,t)*180/Math.PI)),r!==void 0&&(a.alpha=r),a}})),bi,xi=e((()=>{bi=({l:e,c:t,h:n,alpha:r})=>{n===void 0&&(n=0);let i={mode:`luv`,l:e,u:t?t*Math.cos(n/180*Math.PI):0,v:t?t*Math.sin(n/180*Math.PI):0};return r!==void 0&&(i.alpha=r),i}})),Si,Ci,wi,Ti,Ei,Di,Oi=e((()=>{Gr(),Xt(),Si=(e,t,n)=>4*e/(e+15*t+3*n),Ci=(e,t,n)=>9*t/(e+15*t+3*n),wi=Si(J.X,J.Y,J.Z),Ti=Ci(J.X,J.Y,J.Z),Ei=e=>e<=Wr?Ur*e:116*Math.cbrt(e)-16,Di=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Ei(t/J.Y),a=Si(e,t,n),o=Ci(e,t,n);!isFinite(a)||!isFinite(o)?i=a=o=0:(a=13*i*(a-wi),o=13*i*(o-Ti));let s={mode:`luv`,l:i,u:a,v:o};return r!==void 0&&(s.alpha=r),s}})),ki,Ai,ji,Mi,Ni,Pi=e((()=>{Gr(),Xt(),ki=(e,t,n)=>4*e/(e+15*t+3*n),Ai=(e,t,n)=>9*t/(e+15*t+3*n),ji=ki(J.X,J.Y,J.Z),Mi=Ai(J.X,J.Y,J.Z),Ni=({l:e,u:t,v:n,alpha:r})=>{if(e===void 0&&(e=0),e===0)return{mode:`xyz50`,x:0,y:0,z:0};t===void 0&&(t=0),n===void 0&&(n=0);let i=t/(13*e)+ji,a=n/(13*e)+Mi,o=J.Y*(e<=8?e/Ur:((e+16)/116)**3),s={mode:`xyz50`,x:9*i*o/(4*a),y:o,z:o*(12-3*i-20*a)/(4*a)};return r!==void 0&&(s.alpha=r),s}})),Fi,Ii,Li,Ri=e((()=>{yi(),xi(),Oi(),Pi(),Xr(),ei(),U(),z(),L(),G(),q(),Fi=e=>vi(Di($r(e))),Ii=e=>Yr(Ni(bi(e))),Li={mode:`lchuv`,toMode:{luv:bi,rgb:Ii},fromMode:{rgb:Fi,luv:vi},channels:[`l`,`c`,`h`,`alpha`],parse:[`--lchuv`],serialize:`--lchuv`,ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:I,fixup:H},c:I,l:I,alpha:{use:I,fixup:R}},difference:{h:zt},average:{h:K}}})),zi,Bi=e((()=>{st(),gt(),xt(),zi={...ot,mode:`lrgb`,toMode:{rgb:bt},fromMode:{rgb:ht},parse:[`srgb-linear`],serialize:`srgb-linear`}})),Vi,Hi=e((()=>{Oi(),Pi(),Xr(),ei(),L(),z(),Vi={mode:`luv`,toMode:{xyz50:Ni,rgb:e=>Yr(Ni(e))},fromMode:{xyz50:Di,rgb:e=>Di($r(e))},channels:[`l`,`u`,`v`,`alpha`],parse:[`--luv`],serialize:`--luv`,ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:I,u:I,v:I,alpha:{use:I,fixup:R}}}})),Ui,Wi=e((()=>{Ui=({r:e,g:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=Math.cbrt(.412221469470763*e+.5363325372617348*t+.0514459932675022*n),a=Math.cbrt(.2119034958178252*e+.6806995506452344*t+.1073969535369406*n),o=Math.cbrt(.0883024591900564*e+.2817188391361215*t+.6299787016738222*n),s={mode:`oklab`,l:.210454268309314*i+.7936177747023054*a-.0040720430116193*o,a:1.9779985324311684*i-2.42859224204858*a+.450593709617411*o,b:.0259040424655478*i+.7827717124575296*a-.8086757549230774*o};return r!==void 0&&(s.alpha=r),s}})),Gi,Ki=e((()=>{gt(),Wi(),Gi=e=>{let t=Ui(ht(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t}})),qi,Ji=e((()=>{qi=({l:e,a:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=(e+.3963377773761749*t+.2158037573099136*n)**3,a=(e-.1055613458156586*t-.0638541728258133*n)**3,o=(e-.0894841775298119*t-1.2914855480194092*n)**3,s={mode:`lrgb`,r:4.076741636075957*i-3.3077115392580616*a+.2309699031821044*o,g:-1.2684379732850317*i+2.6097573492876887*a-.3413193760026573*o,b:-.0041960761386756*i-.7034186179359362*a+1.7076146940746117*o};return r!==void 0&&(s.alpha=r),s}})),Yi,Xi=e((()=>{xt(),Ji(),Yi=e=>bt(qi(e))}));function Zi(e){let t=.206,n=1.206/1.03;return .5*(n*e-t+Math.sqrt((n*e-t)*(n*e-t)+4*.03*n*e))}function Qi(e){return(e*e+.206*e)/(1.206/1.03*(e+.03))}function $i(e,t){let n,r,i,a,o,s,c,l;-1.88170328*e-.80936493*t>1?(n=1.19086277,r=1.76576728,i=.59662641,a=.75515197,o=.56771245,s=4.0767416621,c=-3.3077115913,l=.2309699292):1.81444104*e-1.19445276*t>1?(n=.73956515,r=-.45954404,i=.08285427,a=.1254107,o=.14503204,s=-1.2684380046,c=2.6097574011,l=-.3413193965):(n=1.35733652,r=-.00915799,i=-1.1513021,a=-.50559606,o=.00692167,s=-.0041960863,c=-.7034186147,l=1.707614701);let u=n+r*e+i*t+a*e*e+o*e*t,d=.3963377774*e+.2158037573*t,f=-.1055613458*e-.0638541728*t,p=-.0894841775*e-1.291485548*t;{let e=1+u*d,t=1+u*f,n=1+u*p,r=e*e*e,i=t*t*t,a=n*n*n,o=3*d*e*e,m=3*f*t*t,h=3*p*n*n,g=6*d*d*e,_=6*f*f*t,v=6*p*p*n,y=s*r+c*i+l*a,ee=s*o+c*m+l*h,te=s*g+c*_+l*v;u-=y*ee/(ee*ee-.5*y*te)}return u}function ea(e,t){let n=$i(e,t),r=qi({l:1,a:n*e,b:n*t}),i=Math.cbrt(1/Math.max(r.r,r.g,r.b));return[i,i*n]}function ta(e,t,n,r,i,a=null){a||=ea(e,t);let o;if((n-i)*a[1]-(a[0]-i)*r<=0)o=a[1]*i/(r*a[0]+a[1]*(i-n));else{o=a[1]*(i-1)/(r*(a[0]-1)+a[1]*(i-n));{let a=n-i,s=r,c=.3963377774*e+.2158037573*t,l=-.1055613458*e-.0638541728*t,u=-.0894841775*e-1.291485548*t,d=a+s*c,f=a+s*l,p=a+s*u;{let e=i*(1-o)+o*n,t=o*r,a=e+t*c,s=e+t*l,m=e+t*u,h=a*a*a,g=s*s*s,_=m*m*m,v=3*d*a*a,y=3*f*s*s,ee=3*p*m*m,te=6*d*d*a,b=6*f*f*s,x=6*p*p*m,S=4.0767416621*h-3.3077115913*g+.2309699292*_-1,C=4.0767416621*v-3.3077115913*y+.2309699292*ee,w=4.0767416621*te-3.3077115913*b+.2309699292*x,T=C/(C*C-.5*S*w),E=-S*T,D=-1.2684380046*h+2.6097574011*g-.3413193965*_-1,ne=-1.2684380046*v+2.6097574011*y-.3413193965*ee,re=-1.2684380046*te+2.6097574011*b-.3413193965*x,O=ne/(ne*ne-.5*D*re),k=-D*O,ie=-.0041960863*h-.7034186147*g+1.707614701*_-1,A=-.0041960863*v-.7034186147*y+1.707614701*ee,ae=-.0041960863*te-.7034186147*b+1.707614701*x,oe=A/(A*A-.5*ie*ae),se=-ie*oe;E=T>=0?E:1e6,k=O>=0?k:1e6,se=oe>=0?se:1e6,o+=Math.min(E,Math.min(k,se))}}}return o}function na(e,t,n=null){n||=ea(e,t);let r=n[0],i=n[1];return[i/r,i/(1-r)]}function ra(e,t,n){let r=ea(t,n),i=ta(t,n,e,1,e,r),a=na(t,n,r),o=.11516993+1/(7.4477897+4.1590124*n+t*(-2.19557347+1.75198401*n+t*(-2.13704948-10.02301043*n+t*(-4.24894561+5.38770819*n+4.69891013*t)))),s=.11239642+1/(1.6132032-.68124379*n+t*(.40370612+.90148123*n+t*(-.27087943+.6122399*n+t*(.00299215-.45399568*n-.14661872*t)))),c=i/Math.min(e*a[0],(1-e)*a[1]),l=e*o,u=(1-e)*s,d=.9*c*Math.sqrt(Math.sqrt(1/(1/(l*l*l*l)+1/(u*u*u*u))));return l=e*.4,u=(1-e)*.8,[Math.sqrt(1/(1/(l*l)+1/(u*u))),d,i]}var ia=e((()=>{Ji()}));function aa(e){let t=e.l===void 0?0:e.l,n=e.a===void 0?0:e.a,r=e.b===void 0?0:e.b,i={mode:`okhsl`,l:Zi(t)};e.alpha!==void 0&&(i.alpha=e.alpha);let a=Math.sqrt(n*n+r*r);if(!a)return i.s=0,i;let[o,s,c]=ra(t,n/a,r/a),l;if(a<s){let e=.8*o,t=1-e/s;l=(a-0)/(e+t*(a-0))*.8}else{let e=s,t=.2*s*s*1.25*1.25/o,n=1-t/(c-s);l=.8+.2*((a-e)/(t+n*(a-e)))}return l&&(i.s=l,i.h=B(Math.atan2(r,n)*180/Math.PI)),i}var oa=e((()=>{V(),ia()}));function sa(e){let t=e.h===void 0?0:e.h,n=e.s===void 0?0:e.s,r=e.l===void 0?0:e.l,i={mode:`oklab`,l:Qi(r)};if(e.alpha!==void 0&&(i.alpha=e.alpha),!n||r===1)return i.a=i.b=0,i;let a=Math.cos(t/180*Math.PI),o=Math.sin(t/180*Math.PI),[s,c,l]=ra(i.l,a,o),u,d,f,p;n<.8?(u=1.25*n,d=0,f=.8*s,p=1-f/c):(u=5*(n-.8),d=c,f=.2*c*c*1.25*1.25/s,p=1-f/(l-c));let m=d+u*f/(1-p*u);return i.a=m*a,i.b=m*o,i}var ca=e((()=>{ia()})),la,ua=e((()=>{Ki(),Xi(),oa(),ca(),Vn(),la={...Bn,mode:`okhsl`,channels:[`h`,`s`,`l`,`alpha`],parse:[`--okhsl`],serialize:`--okhsl`,fromMode:{oklab:aa,rgb:e=>aa(Gi(e))},toMode:{oklab:sa,rgb:e=>Yi(sa(e))}}}));function da(e){let t=e.l===void 0?0:e.l,n=e.a===void 0?0:e.a,r=e.b===void 0?0:e.b,i=Math.sqrt(n*n+r*r),a=i?n/i:1,o=i?r/i:1,[s,c]=na(a,o),l=.5,u=1-l/s,d=c/(i+t*c),f=d*t,p=d*i,m=Qi(f),h=p*m/f,g=qi({l:m,a:a*h,b:o*h}),_=Math.cbrt(1/Math.max(g.r,g.g,g.b,0));t/=_,i=i/_*Zi(t)/t,t=Zi(t);let v={mode:`okhsv`,s:i?(l+c)*p/(c*l+c*u*p):0,v:t?t/f:0};return v.s&&(v.h=B(Math.atan2(r,n)*180/Math.PI)),e.alpha!==void 0&&(v.alpha=e.alpha),v}var fa=e((()=>{V(),Ji(),ia()}));function pa(e){let t={mode:`oklab`};e.alpha!==void 0&&(t.alpha=e.alpha);let n=e.h===void 0?0:e.h,r=e.s===void 0?0:e.s,i=e.v===void 0?0:e.v,a=Math.cos(n/180*Math.PI),o=Math.sin(n/180*Math.PI),[s,c]=na(a,o),l=.5,u=1-l/s,d=1-r*l/(l+c-c*u*r),f=r*c*l/(l+c-c*u*r),p=Qi(d),m=f*p/d,h=qi({l:p,a:a*m,b:o*m}),g=Math.cbrt(1/Math.max(h.r,h.g,h.b,0)),_=Qi(i*d),v=f*_/d;return t.l=_*g,t.a=v*a*g,t.b=v*o*g,t}var ma=e((()=>{Ji(),ia()})),ha,ga=e((()=>{Ki(),Xi(),fa(),ma(),qn(),ha={...Kn,mode:`okhsv`,channels:[`h`,`s`,`v`,`alpha`],parse:[`--okhsv`],serialize:`--okhsv`,fromMode:{oklab:da,rgb:e=>da(Gi(e))},toMode:{oklab:pa,rgb:e=>Yi(pa(e))}}}));function _a(e,t){if(!t||t[0]!==`oklab`)return;let n={mode:`oklab`},[,r,i,a,o]=t;if(!(r.type===P.Hue||i.type===P.Hue||a.type===P.Hue))return r.type!==P.None&&(n.l=Math.min(Math.max(0,r.type===P.Number?r.value:r.value/100),1)),i.type!==P.None&&(n.a=i.type===P.Number?i.value:i.value*.4/100),a.type!==P.None&&(n.b=a.type===P.Number?a.value:a.value*.4/100),o.type!==P.None&&(n.alpha=Math.min(1,Math.max(0,o.type===P.Number?o.value:o.value/100))),n}var va=e((()=>{Xe()})),ya,ba=e((()=>{Ji(),Wi(),Ki(),Xi(),va(),li(),ya={...ci,mode:`oklab`,toMode:{lrgb:qi,rgb:Yi},fromMode:{lrgb:Ui,rgb:Gi},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[_a],serialize:e=>`oklab(${e.l===void 0?`none`:e.l} ${e.a===void 0?`none`:e.a} ${e.b===void 0?`none`:e.b}${e.alpha<1?` / ${e.alpha}`:``})`}}));function xa(e,t){if(!t||t[0]!==`oklch`)return;let n={mode:`oklch`},[,r,i,a,o]=t;if(r.type!==P.None){if(r.type===P.Hue)return;n.l=Math.min(Math.max(0,r.type===P.Number?r.value:r.value/100),1)}if(i.type!==P.None&&(n.c=Math.max(0,i.type===P.Number?i.value:i.value*.4/100)),a.type!==P.None){if(a.type===P.Percentage)return;n.h=a.value}return o.type!==P.None&&(n.alpha=Math.min(1,Math.max(0,o.type===P.Number?o.value:o.value/100))),n}var Sa=e((()=>{Xe()})),Ca,wa=e((()=>{hi(),Ut(),Gt(),Xi(),Ki(),Sa(),Ca={...mi,mode:`oklch`,toMode:{oklab:e=>Wt(e,`oklab`),rgb:e=>Yi(Wt(e,`oklab`))},fromMode:{rgb:e=>Ht(Gi(e),`oklch`),oklab:e=>Ht(e,`oklch`)},parse:[xa],serialize:e=>`oklch(${e.l===void 0?`none`:e.l} ${e.c===void 0?`none`:e.c} ${e.h===void 0?`none`:e.h}${e.alpha<1?` / ${e.alpha}`:``})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}}})),Ta,Ea=e((()=>{gt(),Ta=e=>{let{r:t,g:n,b:r,alpha:i}=ht(e),a={mode:`xyz65`,x:.486570948648216*t+.265667693169093*n+.1982172852343625*r,y:.2289745640697487*t+.6917385218365062*n+.079286914093745*r,z:0*t+.0451133818589026*n+1.043944368900976*r};return i!==void 0&&(a.alpha=i),a}})),Da,Oa=e((()=>{xt(),Da=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=bt({r:e*2.4934969119414263-t*.9313836179191242-.402710784450717*n,g:e*-.8294889695615749+t*1.7626640603183465+.0236246858419436*n,b:e*.0358458302437845-t*.0761723892680418+.9568845240076871*n},`p3`);return r!==void 0&&(i.alpha=r),i}})),ka,Aa=e((()=>{st(),Ea(),Oa(),vt(),Ct(),ka={...ot,mode:`p3`,parse:[`display-p3`],serialize:`display-p3`,fromMode:{rgb:e=>Da(_t(e)),xyz65:Da},toMode:{rgb:e=>St(Ta(e)),xyz65:Ta}}})),ja,Ma,Na=e((()=>{ja=e=>{let t=Math.abs(e);return t>=1/512?Math.sign(e)*t**(1/1.8):16*e},Ma=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`prophoto`,r:ja(e*1.3457868816471585-t*.2555720873797946-.0511018649755453*n),g:ja(e*-.5446307051249019+t*1.5082477428451466+.0205274474364214*n),b:ja(e*0+t*0+1.2119675456389452*n)};return r!==void 0&&(i.alpha=r),i}})),Pa,Fa,Ia=e((()=>{Pa=(e=0)=>{let t=Math.abs(e);return t>=16/512?Math.sign(e)*t**1.8:e/16},Fa=e=>{let t=Pa(e.r),n=Pa(e.g),r=Pa(e.b),i={mode:`xyz50`,x:.7977666449006423*t+.1351812974005331*n+.0313477341283922*r,y:.2880748288194013*t+.7118352342418731*n+899369387256e-16*r,z:0*t+0*n+.8251046025104602*r};return e.alpha!==void 0&&(i.alpha=e.alpha),i}})),La,Ra=e((()=>{st(),Na(),Ia(),Xr(),ei(),La={...ot,mode:`prophoto`,parse:[`prophoto-rgb`],serialize:`prophoto-rgb`,fromMode:{xyz50:Ma,rgb:e=>Ma($r(e))},toMode:{xyz50:Fa,rgb:e=>Yr(Fa(e))}}})),za,Ba,Va,Ha,Ua=e((()=>{za=1.09929682680944,Ba=.018053968510807,Va=e=>{let t=Math.abs(e);return t>Ba?(Math.sign(e)||1)*(za*t**.45-(za-1)):4.5*e},Ha=({x:e,y:t,z:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`rec2020`,r:Va(e*1.7166511879712683-t*.3556707837763925-.2533662813736599*n),g:Va(e*-.6666843518324893+t*1.6164812366349395+.0157685458139111*n),b:Va(e*.0176398574453108-t*.0427706132578085+.9421031212354739*n)};return r!==void 0&&(i.alpha=r),i}})),Wa,Ga,Ka,qa,Ja=e((()=>{Wa=1.09929682680944,Ga=.018053968510807,Ka=(e=0)=>{let t=Math.abs(e);return t<Ga*4.5?e/4.5:(Math.sign(e)||1)*((t+Wa-1)/Wa)**(1/.45)},qa=e=>{let t=Ka(e.r),n=Ka(e.g),r=Ka(e.b),i={mode:`xyz65`,x:.6369580483012911*t+.1446169035862083*n+.1688809751641721*r,y:.262700212011267*t+.6779980715188708*n+.059301716469862*r,z:0*t+.0280726930490874*n+1.0609850577107909*r};return e.alpha!==void 0&&(i.alpha=e.alpha),i}})),Ya,Xa=e((()=>{st(),Ua(),Ja(),vt(),Ct(),Ya={...ot,mode:`rec2020`,fromMode:{xyz65:Ha,rgb:e=>Ha(_t(e))},toMode:{xyz65:qa,rgb:e=>St(qa(e))},parse:[`rec2020`],serialize:`rec2020`}})),Za,Qa,$a=e((()=>{Za=.0037930732552754493,Qa=Math.cbrt(Za)})),eo,to,no=e((()=>{gt(),$a(),eo=e=>Math.cbrt(e)-Qa,to=e=>{let{r:t,g:n,b:r,alpha:i}=ht(e),a=eo(.3*t+.622*n+.078*r+Za),o=eo(.23*t+.692*n+.078*r+Za),s=eo(.2434226892454782*t+.2047674442449682*n+.5518098665095535*r+Za),c={mode:`xyb`,x:(a-o)/2,y:(a+o)/2,b:s-(a+o)/2};return i!==void 0&&(c.alpha=i),c}})),ro,io,ao=e((()=>{xt(),$a(),ro=e=>(e+Qa)**3,io=({x:e,y:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i=ro(e+t)-Za,a=ro(t-e)-Za,o=ro(n+t)-Za,s=bt({r:11.031566904639861*i-9.866943908131562*a-.16462299650829934*o,g:-3.2541473810744237*i+4.418770377582723*a-.16462299650829934*o,b:-3.6588512867136815*i+2.7129230459360922*a+1.9459282407775895*o});return r!==void 0&&(s.alpha=r),s}})),oo,so=e((()=>{L(),z(),no(),ao(),oo={mode:`xyb`,channels:[`x`,`y`,`b`,`alpha`],parse:[`--xyb`],serialize:`--xyb`,toMode:{rgb:io},fromMode:{rgb:to},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:I,y:I,b:I,alpha:{use:I,fixup:R}}}})),co,lo=e((()=>{Xr(),ri(),ei(),Jr(),L(),z(),co={mode:`xyz50`,parse:[`xyz-d50`],serialize:`xyz-d50`,toMode:{rgb:Yr,lab:ni},fromMode:{rgb:$r,lab:qr},channels:[`x`,`y`,`z`,`alpha`],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:I,y:I,z:I,alpha:{use:I,fixup:R}}}})),uo,fo=e((()=>{uo=e=>{let{x:t,y:n,z:r,alpha:i}=e;t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=0);let a={mode:`xyz50`,x:1.0479298208405488*t+.0229467933410191*n-.0501922295431356*r,y:.0296278156881593*t+.990434484573249*n-.0170738250293851*r,z:-.0092430581525912*t+.0150551448965779*n+.7518742899580008*r};return i!==void 0&&(a.alpha=i),a}})),po,mo=e((()=>{po=e=>{let{x:t,y:n,z:r,alpha:i}=e;t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=0);let a={mode:`xyz65`,x:.9554734527042182*t-.0230985368742614*n+.0632593086610217*r,y:-.0283697069632081*t+1.0099954580058226*n+.021041398966943*r,z:.0123140016883199*t-.0205076964334779*n+1.3303659366080753*r};return i!==void 0&&(a.alpha=i),a}})),ho,go=e((()=>{Ct(),vt(),fo(),mo(),L(),z(),ho={mode:`xyz65`,toMode:{rgb:St,xyz50:uo},fromMode:{rgb:_t,xyz50:po},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:[`x`,`y`,`z`,`alpha`],parse:[`xyz`,`xyz-d65`],serialize:`xyz-d65`,interpolate:{x:I,y:I,z:I,alpha:{use:I,fixup:R}}}})),_o,vo=e((()=>{_o=({r:e,g:t,b:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`yiq`,y:.29889531*e+.58662247*t+.11448223*n,i:.59597799*e-.2741761*t-.32180189*n,q:.21147017*e-.52261711*t+.31114694*n};return r!==void 0&&(i.alpha=r),i}})),yo,bo=e((()=>{yo=({y:e,i:t,q:n,alpha:r})=>{e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0);let i={mode:`rgb`,r:e+.95608445*t+.6208885*n,g:e-.27137664*t-.6486059*n,b:e-1.10561724*t+1.70250126*n};return r!==void 0&&(i.alpha=r),i}})),xo,So=e((()=>{vo(),bo(),L(),z(),xo={mode:`yiq`,toMode:{rgb:yo},fromMode:{rgb:_o},channels:[`y`,`i`,`q`,`alpha`],parse:[`--yiq`],serialize:`--yiq`,ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:I,i:I,q:I,alpha:{use:I,fixup:R}}}})),Co=e((()=>{Tt(),Vt(),bn(),Sn(),On(),Vn(),qn(),tr(),vr(),Ir(),Hr(),li(),di(),hi(),_i(),Ri(),Bi(),Hi(),ua(),ga(),ba(),wa(),Aa(),Ra(),Xa(),st(),so(),lo(),go(),So(),Fe(),Oe(),Ee(),le(),U(),z(),q(),L(),at(),nt(),G(),Xe(),zn(),$n(),si(),pi(),de(),et(),me(),Qe(),Ln(),we(),va(),Sa(),ut(),It(),mn(),wn(),An(),Un(),Yn(),pr(),Rr(),Pr(),Ar(),Br(),gn(),tn(),$t(),Ut(),Qr(),Jr(),Gt(),xi(),Wi(),xt(),yi(),Pi(),ca(),ma(),Ji(),oa(),fa(),Xi(),Ea(),Ia(),Ja(),Pt(),En(),Mn(),Gn(),Zn(),Mr(),ai(),sn(),gt(),Ki(),no(),ei(),vt(),vo(),ao(),ri(),Oi(),Na(),Xr(),mo(),pt(),gr(),wr(),an(),Oa(),Ua(),Ct(),fo(),bo(),N(wt),N(Bt),N(yn),N(xn),N(Dn),N(Bn),N(Kn),N(er),N(_r),N(Fr),N(Vr),N(ci),N(ui),N(mi),N(gi),N(Li),N(zi),N(Vi),N(la),N(ha),N(ya),N(Ca),N(ka),N(La),N(Ya),N(ot),N(oo),N(co),N(ho),N(xo)})),wo=e((()=>{Co()})),To,Eo,Do,Oo,ko,Ao,jo,Mo,No,Po=e((()=>{c(),To=new WeakMap,Eo=n(),Do=e=>e?.naturalWidth||e?.width||1,Oo=e=>e?.naturalHeight||e?.height||1,ko=(e,t,n=1,r,i=0)=>{let a=e.canvas;e.translate(a.width/2,a.height/2),e.rotate((-i||0)*(Math.PI*.5)),e.rotate((1-r)*(Math.PI/2)),e.translate(-(Do(t)/2)*n,-(Oo(t)/2)*n)},Ao=e=>(!To.has(e)&&(e instanceof Blob||e instanceof File||e instanceof OffscreenCanvas||e instanceof ImageBitmap||e instanceof Image)&&To.set(e,createImageBitmap(e)),To.get(e)),jo=new WeakMap,Mo=(e,t)=>jo?.getOrInsertComputed?.(e,()=>e?.bind?.(t)),No=null,No=typeof HTMLCanvasElement<`u`?class extends HTMLCanvasElement{static observedAttributes=[`data-src`,`data-orient`,`orient`];ctx=null;image=null;#e=[1,1];#t=``;#n=``;get#i(){let e=this.getAttribute(`data-orient`)??this.getAttribute(`orient`)??`0`,t=Number.parseInt(e,10);return Number.isFinite(t)?t:0}set#i(e){let t=String(e);this.setAttribute(`data-orient`,t),this.setAttribute(`orient`,t)}attributeChangedCallback(e,t,n){e==`data-src`&&this.#a(n),(e==`data-orient`||e==`orient`)&&this.#o(this.#n)}connectedCallback(){let e=this.parentNode;this.style.setProperty(`max-inline-size`,`min(100%, min(100cqi, 100dvi))`),this.style.setProperty(`max-block-size`,`min(100%, min(100cqb, 100dvb))`),this.#e=[Math.min(Math.min(Math.max(this.clientWidth||e?.clientWidth||1,1),e?.clientWidth||1)*(this.currentCSSZoom||1),screen?.width||1)*(devicePixelRatio||1),Math.min(Math.min(Math.max(this.clientHeight||e?.clientHeight||1,1),e?.clientHeight||1)*(this.currentCSSZoom||1),screen?.height||1)*(devicePixelRatio||1)],this.#a(this.#t=this.dataset.src||this.#t),this.image&&this.#o(this.#n)}constructor(){super();let e=this,t=this.parentNode,n=()=>{let e=this.#e;this.#e=[Math.min(Math.min(Math.max(this.clientWidth||t?.clientWidth||1,1),t?.clientWidth||1)*(this.currentCSSZoom||1),screen?.width||1)*(devicePixelRatio||1),Math.min(Math.min(Math.max(this.clientHeight||t?.clientHeight||1,1),t?.clientHeight||1)*(this.currentCSSZoom||1),screen?.height||1)*(devicePixelRatio||1)],(e?.[0]!=this.#e[0]||e?.[1]!=this.#e[1])&&this.#o(this.#n)};Eo?.shedule?.(()=>{this.ctx=e.getContext(`2d`,{alpha:!0,desynchronized:!0,powerPreference:`high-performance`,preserveDrawingBuffer:!0}),this.inert=!0,this.style.objectFit=`cover`,this.style.objectPosition=`center`,this.classList.add(`u-canvas`),this.classList.add(`u2-canvas`),this.classList.add(`ui-canvas`),this.style.setProperty(`max-inline-size`,`min(100%, min(100cqi, 100dvi))`),this.style.setProperty(`max-block-size`,`min(100%, min(100cqb, 100dvb))`),n(),new ResizeObserver(e=>{for(let t of e){let e=t?.devicePixelContentBoxSize?.[0];if(e){let t=this.#e;this.#e=[Math.max(e.inlineSize||this.width,1),Math.max(e.blockSize||this.height,1)],(t?.[0]!=this.#e[0]||t?.[1]!=this.#e[1])&&this.#o(this.#n)}}}).observe(this,{box:`device-pixel-content-box`}),this.#a(this.#t=this.dataset.src||this.#t)})}async $useImageAsSource(e,t){t||=this.#t;let n=e instanceof ImageBitmap?e:await Ao(e).catch(console.warn.bind(console));return n&&t==this.#t&&(this.image=n,this.#o(t)),e}$renderPass(e){let t=this,n=this.ctx,r=this.image;if(r&&n&&(e==this.#t||!e)){e&&(this.#n=e),this.width!=this.#e[0]&&(this.width=this.#e[0]),this.height!=this.#e[1]&&(this.height=this.#e[1]),this.style.aspectRatio=`${this.width||1} / ${this.height||1}`;let i=this.#i%2||0,a=+(Do(r)<=Oo(r)),o=Math.max(t[[`height`,`width`][i]]/(a?Oo(r):Do(r)),t[[`width`,`height`][i]]/(a?Do(r):Oo(r)));n.save(),n.clearRect(0,0,t.width,t.height),ko(n,r,o,a,this.#i),n.drawImage(r,0,0,r.width*o,r.height*o),n.restore()}}#a(e){let t=e||this.#t;return this.#t=t,fetch(e,{cache:`force-cache`,mode:`same-origin`,priority:`high`})?.then?.(async e=>this.$useImageAsSource(await e.blob(),t)?.catch(console.warn.bind(console)))?.catch?.(console.warn.bind(console))}#o(e){let t=this.ctx;this.image&&t&&(e==this.#t||!e)&&Eo?.shedule?.(Mo(this.$renderPass,this))}}:class{constructor(){}$renderPass(e){}$useImageAsSource(e,t){return e}ctx=null;image=null};try{customElements.define(`ui-canvas`,No,{extends:`canvas`})}catch{}})),Fo=e((()=>{ae(),wo(),Po(),w()}));function Io(e){return e.connection}function Lo(e){let t=e.toLowerCase();return t===`slow-2g`?`wifi-low`:t===`2g`?`wifi-medium`:`wifi-high`}function Ro(){let e=u(`wifi-high`),t=u(``),n=u(`battery-full`),r=u(``),i=u(``),a=()=>{if(!navigator.onLine){e.value=`wifi-slash`,t.value=`Offline`;return}let n=Io(navigator);if(!n||typeof n.effectiveType!=`string`){e.value=`globe`,t.value=`Online (connection details unavailable)`;return}let r=String(n.effectiveType||``).toLowerCase(),i=typeof n.downlink==`number`?`${n.downlink} Mb/s`:``,a=n.saveData?` · Data saver`:``;t.value=[r.toUpperCase(),i].filter(Boolean).join(` · `)+a,e.value=Lo(r)},o=null,s=null,c=null,l=(e,t)=>{let a=Math.max(0,Math.min(100,Math.round(e*100)));if(i.value=`${a}%`,t){n.value=`battery-charging-vertical`,r.value=`Charging · ${i.value}`;return}r.value=`Battery · ${i.value}`,e<=.08?n.value=`battery-warning`:e<=.22?n.value=`battery-low`:e<=.5?n.value=`battery-medium`:e<=.8?n.value=`battery-high`:n.value=`battery-full`};a(),window.addEventListener(`online`,a),window.addEventListener(`offline`,a);let d=Io(navigator);return d?.addEventListener?.(`change`,a),typeof navigator.getBattery==`function`?navigator.getBattery().then(e=>{c=e,o=()=>l(e.level,e.charging),s=o,e.addEventListener(`levelchange`,o),e.addEventListener(`chargingchange`,s),l(e.level,e.charging)}):(n.value=`question`,r.value=`Battery status not supported in this browser`,i.value=`—`),{networkIcon:e,networkTitle:t,batteryIcon:n,batteryTitle:r,batteryPct:i,dispose:()=>{window.removeEventListener(`online`,a),window.removeEventListener(`offline`,a),d?.removeEventListener?.(`change`,a),c&&o&&s&&(c.removeEventListener(`levelchange`,o),c.removeEventListener(`chargingchange`,s))}}}function zo(e,t){let n=o`<div class="env-status-bar__tray ${t}">
        <span class="env-status-bar__chip" title=${e.networkTitle} aria-label=${e.networkTitle}>
            <ui-icon icon=${e.networkIcon} aria-hidden="true"></ui-icon>
        </span>
        <span class="env-status-bar__chip" title=${e.batteryTitle} aria-label=${e.batteryTitle}>
            <ui-icon icon=${e.batteryIcon} aria-hidden="true"></ui-icon>
            <span class="env-status-bar__pct"></span>
        </span>
    </div>`,r=n.querySelector(`.env-status-bar__pct`);return r instanceof HTMLElement&&f(r,{properties:{textContent:e.batteryPct}}),n}function Bo(e,t,n){let r=document.createElement(`ui-statusbar`);r.className=`env-ui-statusbar wf-chrome-no-select`,r.setAttribute(`part`,`status-bar`);let i=document.createElement(`div`);i.slot=`left`,i.className=`env-ui-statusbar__intro`,t&&(i.innerHTML=t);let o=document.createElement(`div`);o.slot=`center`;let s=document.createElement(`p`);s.className=`env-status-bar__meta`,o.appendChild(s);let c=document.createElement(`div`);return c.slot=`right`,c.className=`env-ui-statusbar__right`,c.appendChild(zo(n,`env-device-tray env-device-tray--footer`)),r.append(i,o,c),a(()=>{let t=e.navEcho.value?` │ ${e.navEcho.value}`:``;s.textContent=`doc=${e.selectedPath.value} │ viewer=${e.viewerStatus.value} │ layout=${e.mqLabel.value}${t}`},[e.selectedPath,e.viewerStatus,e.mqLabel,e.navEcho],{triggerImmediately:!0}),{element:r,dispose:()=>{}}}var Vo=e((()=>{A(),S(),r()})),Ho=e((()=>{r(),p(),S()}));function Uo(e,t){let n=typeof matchMedia<`u`&&matchMedia(`(prefers-color-scheme: light)`).matches;e.style.setProperty(`position`,`fixed`,Q),e.style.setProperty(`box-sizing`,`border-box`,Q),e.style.setProperty(`min-width`,t?`188px`:`220px`,Q),e.style.setProperty(`max-width`,`min(320px, calc(100vw - 24px))`,Q),e.style.setProperty(`padding`,t?`0.3rem`:`0.4rem`,Q),e.style.setProperty(`border-radius`,`14px`,Q),e.style.setProperty(`pointer-events`,`auto`,Q),e.style.setProperty(`-webkit-backdrop-filter`,`none`,Q),e.style.setProperty(`backdrop-filter`,`none`,Q),e.style.setProperty(`box-shadow`,`none`,Q),n?(e.style.setProperty(`border`,`1px solid rgba(15, 23, 42, 0.14)`,Q),e.style.setProperty(`background`,`rgba(241, 245, 249, 0.98)`,Q),e.style.setProperty(`color`,`#0f172a`,Q),e.style.setProperty(`outline`,`1px solid rgba(15, 23, 42, 0.06)`,Q)):(e.style.setProperty(`border`,`1px solid rgba(255, 255, 255, 0.1)`,Q),e.style.setProperty(`background`,`rgba(15, 23, 42, 0.97)`,Q),e.style.setProperty(`color`,`#e8eaed`,Q),e.style.setProperty(`outline`,`1px solid rgba(255, 255, 255, 0.06)`,Q))}function Wo(e){e.style.setProperty(`list-style`,`none`,Q),e.style.setProperty(`list-style-type`,`none`,Q),e.style.setProperty(`margin`,`0`,Q),e.style.setProperty(`padding`,`0`,Q),e.style.setProperty(`display`,`flex`,Q),e.style.setProperty(`flex-direction`,`column`,Q),e.style.setProperty(`align-items`,`stretch`,Q),e.style.setProperty(`gap`,`0.2rem`,Q),e.style.setProperty(`width`,`100%`,Q),e.style.setProperty(`box-sizing`,`border-box`,Q),e.style.setProperty(`text-align`,`left`,Q)}function Go(e){e.style.setProperty(`list-style`,`none`,Q),e.style.setProperty(`list-style-type`,`none`,Q),e.style.setProperty(`margin`,`0`,Q),e.style.setProperty(`padding`,`0`,Q),e.style.setProperty(`width`,`100%`,Q),e.style.setProperty(`display`,`block`,Q),e.style.setProperty(`box-sizing`,`border-box`,Q)}function Ko(e,t){let n=typeof matchMedia<`u`&&matchMedia(`(prefers-color-scheme: light)`).matches;e.style.setProperty(`appearance`,`none`,Q),e.style.setProperty(`-webkit-appearance`,`none`,Q),e.style.setProperty(`box-sizing`,`border-box`,Q),e.style.setProperty(`width`,`100%`,Q),e.style.setProperty(`max-width`,`100%`,Q),e.style.setProperty(`margin`,`0`,Q),e.style.setProperty(`display`,`grid`,Q),e.style.setProperty(`grid-template-columns`,`1.375rem minmax(0, 1fr) auto`,Q),e.style.setProperty(`align-items`,`center`,Q),e.style.setProperty(`justify-items`,`start`,Q),e.style.setProperty(`gap`,`0.55rem`,Q),e.style.setProperty(`border-style`,`none`,Q),e.style.setProperty(`border-width`,`0`,Q),e.style.setProperty(`outline`,`none`,Q),e.style.setProperty(`border-radius`,`10px`,Q),e.style.setProperty(`padding`,`0.5rem 0.6rem`,Q),e.style.setProperty(`min-height`,`2.35rem`,Q),e.style.setProperty(`font-family`,`inherit`,Q),e.style.setProperty(`font-size`,`0.8125rem`,Q),e.style.setProperty(`font-weight`,`400`,Q),e.style.setProperty(`line-height`,`1.25`,Q),e.style.setProperty(`text-align`,`start`,Q),e.style.setProperty(`cursor`,`pointer`,Q),e.style.setProperty(`background`,`none`,Q),e.style.setProperty(`background-color`,`transparent`,Q),e.style.setProperty(`background-image`,`none`,Q),e.style.setProperty(`box-shadow`,`none`,Q),e.style.setProperty(`transition`,`none`,Q),t?n?e.style.setProperty(`color`,`#b91c1c`,Q):e.style.setProperty(`color`,`#fca5a5`,Q):e.style.setProperty(`color`,`inherit`,Q)}function qo(e){if(typeof customElements<`u`&&typeof customElements.upgrade==`function`)try{customElements.upgrade(e)}catch{}for(let t of e.querySelectorAll(`ui-icon`)){let e=t;e.style.setProperty(`--icon-size`,`1.125rem`,Q),e.style.setProperty(`--icon-padding`,`0px`,Q),e.style.setProperty(`--icon-color`,`currentColor`,Q),e.style.setProperty(`width`,`1.125rem`,Q),e.style.setProperty(`height`,`1.125rem`,Q),e.style.setProperty(`min-width`,`1.125rem`,Q),e.style.setProperty(`min-height`,`1.125rem`,Q),e.style.setProperty(`display`,`inline-grid`,Q),typeof e.updateIcon==`function`&&e.updateIcon.call(t)}}function Jo(e,t){let n=String(t||``).trim();if(!n)return;let r=document.createElement(`ui-icon`);r.setAttribute(`icon`,n),r.setAttribute(`icon-style`,`duotone`),r.setAttribute(`size`,`18`),r.setAttribute(`aria-hidden`,`true`),r.style.setProperty(`--icon-size`,`1.125rem`,Q),r.style.setProperty(`--icon-padding`,`0px`,Q),r.style.setProperty(`--icon-color`,`currentColor`,Q),r.style.setProperty(`width`,`1.125rem`,Q),r.style.setProperty(`height`,`1.125rem`,Q),e.append(r)}var Yo,Xo,Zo,Qo,Y,X,$o,es,ts,ns,rs,is,as,os,ss,Z,Q,cs,ls,us,ds,fs,ps,ms,hs,gs,_s,vs=e((()=>{c(),T(),S(),Ho(),k(),Yo=`2147483640`,Xo=320,Zo=220,Qo=!1,Y=0,X=null,$o=null,es=[],ts=new Map,ns=()=>{for(let e of ts.values())try{e.destroy()}catch{}ts.clear()},rs=e=>{ts.get(e)?.destroy(),ts.set(e,x(e))},is=e=>{ts.get(e)?.destroy(),ts.delete(e)},as=new Map,os=new Map,ss=new Map,Z=new Map,typeof CSS<`u`&&(CSS.supports(`position-anchor: --cw-anchor-test`)||CSS.supports(`anchor-name: --cw-anchor-test`)),Q=`important`,cs=()=>{if(Qo)return;Qo=!0;let e=document.createElement(`style`);e.id=`cw-unified-context-menu-style`,e.textContent=`
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${Yo});
            pointer-events: none;
        }

        .cw-context-menu {
            position: fixed;
            box-sizing: border-box;
            min-width: 220px;
            max-width: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            color-scheme: light dark;
            font-family: var(--cw-context-menu-font, ui-sans-serif, system-ui, sans-serif);
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(15, 23, 42, 0.97);
            color: #e8eaed;
            box-shadow: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            pointer-events: auto;
            user-select: none;
        }

        .cw-context-menu-under.underlying-shadow-container,
        .cw-context-menu-under {
            pointer-events: none !important;
            overflow: visible !important;
            z-index: -1 !important;
            filter: blur(12px) saturate(1.2) !important;
        }

        .cw-context-menu-under .underlying-shadow-geometry {
            background: #000000af !important;
            border-radius: 14px;
            overflow: hidden !important;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu {
                border: 1px solid rgba(15, 23, 42, 0.14);
                background: rgba(241, 245, 249, 0.98);
                color: #0f172a;
                box-shadow: none;
            }

            .cw-context-menu-under .underlying-shadow-geometry {
                background: #0000001f !important;
            }
        }

        .cw-context-menu.cw-context-menu--compact {
            min-width: 188px;
            padding: 0.3rem;
        }

        .cw-context-menu__list {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.2rem;
            width: 100%;
            box-sizing: border-box;
            text-align: left;
        }

        .cw-context-menu__list > li {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            box-sizing: border-box;
            display: block !important;
        }

        /*
         * INVARIANT: one horizontal row per item (icon | label | chevron).
         * Rows stay transparent inside the slab; FL-UI host button styling must not turn each row into its own gray chip.
         */
        button.cw-context-menu__item,
        .cw-context-menu button.cw-context-menu__item {
            appearance: none !important;
            -webkit-appearance: none !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            display: grid !important;
            grid-template-columns: 1.375rem minmax(0, 1fr) auto !important;
            align-items: center !important;
            justify-items: start !important;
            justify-content: start !important;
            flex-direction: row !important;
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            font-weight: 400 !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
            transition: none !important;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: rgba(255, 255, 255, 0.08) !important;
        }

        @media (prefers-color-scheme: light) {
            button.cw-context-menu__item:hover,
            .cw-context-menu button.cw-context-menu__item:hover,
            button.cw-context-menu__item:focus-visible,
            .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: rgba(15, 23, 42, 0.08) !important;
            }
        }

        button.cw-context-menu__item[disabled],
        .cw-context-menu button.cw-context-menu__item[disabled] {
            opacity: 0.45 !important;
            cursor: default !important;
        }

        .cw-context-menu__item--danger {
            color: #fca5a5 !important;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu__item--danger {
                color: #b91c1c !important;
            }
        }

        .cw-context-menu__icon {
            justify-self: center !important;
            width: 1.375rem !important;
            height: 1.375rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /*
         * WHY:
         * 1) Inherited registered icon-color can be fully transparent — force currentColor.
         * 2) Phosphor min-size uses min(var(--icon-size), 100%); when percentage base is cyclic/0,
         *    mask ::before collapses — lock an explicit px box matching --icon-size.
         */
        .cw-context-menu__icon ui-icon,
        .cw-context-menu__chevron ui-icon {
            flex: 0 0 auto !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            width: var(--icon-size, 1.125rem) !important;
            height: var(--icon-size, 1.125rem) !important;
            min-width: var(--icon-size, 1.125rem) !important;
            min-height: var(--icon-size, 1.125rem) !important;
            min-inline-size: var(--icon-size, 1.125rem) !important;
            min-block-size: var(--icon-size, 1.125rem) !important;
            inline-size: var(--icon-size, 1.125rem) !important;
            block-size: var(--icon-size, 1.125rem) !important;
            max-inline-size: var(--icon-size, 1.125rem) !important;
            max-block-size: var(--icon-size, 1.125rem) !important;
            --icon-padding: 0px !important;
            color: inherit !important;
            --icon-color: currentColor !important;
            overflow: visible !important;
            pointer-events: none !important;
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem !important;
        }

        .cw-context-menu__label {
            justify-self: stretch !important;
            text-align: start !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            min-width: 0 !important;
        }

        .cw-context-menu__chevron {
            justify-self: end !important;
            opacity: 0.72 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem !important;
        }

        @supports (color: color-mix(in oklab, white 50%, black)) {
            .cw-context-menu {
                border: 1px solid color-mix(in oklab, var(--wf-md-outline-variant, transparent) 100%, transparent);
                background: color-mix(in oklab, var(--wf-md-surf-container, rgba(30, 41, 59, 0.92)) 96%, transparent);
                color: var(--wf-md-on-surface, var(--color-on-surface, inherit));
                box-shadow:
                    var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                    0 0 0 1px color-mix(in oklab, var(--wf-md-on-surface, #fff) 7%, transparent);
            }
            button.cw-context-menu__item:hover,
            .cw-context-menu button.cw-context-menu__item:hover,
            button.cw-context-menu__item:focus-visible,
            .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: color-mix(in oklab, var(--wf-md-on-surface, #fff) 8%, transparent) !important;
            }
        }
    `,document.head.appendChild(e)},ls=()=>{for(let e of es)try{e()}catch{}es=[]},us=e=>{for(let[t,n]of Array.from(ss.entries()))t>=e&&(clearTimeout(n),ss.delete(t));for(let[t,n]of Array.from(Z.entries()))t>=e&&(clearTimeout(n),Z.delete(t))},ds=(e,t,n)=>{e.style.left=`${t}px`,e.style.top=`${n}px`;let r=e.getBoundingClientRect(),i=Math.max(8,window.innerWidth-r.width-8),a=Math.max(8,window.innerHeight-r.height-8);e.style.left=`${Math.min(Math.max(8,t),i)}px`,e.style.top=`${Math.min(Math.max(8,n),a)}px`},fs=e=>{us(e);for(let[t,n]of Array.from(as.entries()))t>=e&&(is(n),n.remove(),as.delete(t),os.delete(t))},ps=(e,t)=>{let n=t.getBoundingClientRect();ds(e,Math.round(n.right+4),Math.round(n.top))},ms=e=>{for(let[t,n]of Array.from(Z.entries()))t>=e&&(clearTimeout(n),Z.delete(t))},hs=(e,t,n,r)=>{let i=document.createElement(`div`);i.className=`cw-context-menu${t?` cw-context-menu--compact`:``}`,i.setAttribute(`role`,`menu`),i.dataset.menuDepth=String(n),i.style.zIndex=String(n+1);let a=document.createElement(`ul`);a.className=`cw-context-menu__list`,Wo(a),i.appendChild(a);let o=(e,n,i)=>{if(r!==Y||!$o?.isConnected||!X?.isConnected||(fs(i),!e.children?.length))return;let a=hs(e.children,t,i,r);a.classList.add(`cw-context-menu--submenu`),X.appendChild(a),as.set(i,a),os.set(i,n),ps(a,n),rs(a)},s=(e,t,n)=>{let r=ss.get(n);r&&clearTimeout(r),ms(n);let i=setTimeout(()=>{ss.delete(n),o(e,t,n)},Xo);ss.set(n,i)},c=e=>{let t=Z.get(e);t&&clearTimeout(t);let n=setTimeout(()=>{Z.delete(e),fs(e)},Zo);Z.set(e,n)};for(let t of e){let e=document.createElement(`button`);e.type=`button`,e.className=`cw-context-menu__item${t.danger?` cw-context-menu__item--danger`:``}`,e.setAttribute(`role`,`menuitem`),e.disabled=!!t.disabled;let i=!!t.children?.length,l=document.createElement(`span`);l.className=`cw-context-menu__icon`,t.icon&&Jo(l,t.icon);let u=document.createElement(`span`);u.className=`cw-context-menu__label`,u.textContent=t.label;let d=document.createElement(`span`);if(d.className=`cw-context-menu__chevron`,i&&Jo(d,`caret-right`),e.append(l,u,d),Ko(e,!!t.danger),i){let i=n+1;e.setAttribute(`aria-haspopup`,`menu`),e.addEventListener(`pointerenter`,()=>s(t,e,i)),e.addEventListener(`pointerleave`,()=>c(i)),e.addEventListener(`click`,n=>{if(n.preventDefault(),n.stopPropagation(),r!==Y||!$o?.isConnected)return;ms(i);let a=as.get(i),s=os.get(i);if(a?.isConnected&&s===e){fs(i);return}o(t,e,i)})}else e.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),!(r!==Y||!$o?.isConnected)&&(gs(),!t.disabled&&await t.action())});let f=document.createElement(`li`);Go(f),f.appendChild(e),a.appendChild(f)}return Uo(i,t),i.addEventListener(`pointerenter`,()=>ms(n)),i.addEventListener(`pointerleave`,()=>{if(n>0){let e=Z.get(n);e&&clearTimeout(e);let t=setTimeout(()=>{Z.delete(n),fs(n)},Zo);Z.set(n,t)}}),i},gs=()=>{ls(),us(0),fs(1),as.clear(),os.clear(),ns(),$o?.remove(),$o=null,X?.remove(),X=null,Y+=1},_s=e=>{let t=(e.items||[]).filter(e=>e&&e.id&&e.label);if(!t.length){gs();return}cs(),gs();let n=Y,r=e.resolveOverlayMountPoint?.(e.anchor??null)??D(e.anchor??null),i=document.createElement(`div`);i.className=`cw-context-menu-layer`,i.style.setProperty(`position`,`fixed`,Q),i.style.setProperty(`inset`,`0`,Q),i.style.setProperty(`z-index`,Yo,Q),i.style.setProperty(`pointer-events`,`none`,Q),i.style.setProperty(`backdrop-filter`,`none`,Q),i.style.setProperty(`-webkit-backdrop-filter`,`none`,Q),X=i,r.appendChild(i);let a=hs(t,!!e.compact,0,n);$o=a,i.appendChild(a),ds(a,e.x,e.y),rs(a);let o=()=>{n!==Y||!a.isConnected||qo(a)},s=typeof customElements<`u`&&customElements.whenDefined?customElements.whenDefined(`ui-icon`).then(o).catch(()=>{}):Promise.resolve();queueMicrotask(()=>{s.then(o),requestAnimationFrame(()=>{o(),requestAnimationFrame(o)})});let c=e=>{if(!X?.isConnected||!$o)return!1;let t=typeof e.composedPath==`function`?e.composedPath():[],n=Array.isArray(t)&&t.length?t:[];for(let e of n)if(e instanceof Element&&(e===X||e===$o||X.contains(e)||e.classList?.contains?.(`cw-context-menu`)||e.closest?.(`.cw-context-menu`)))return!0;let r=e.target;return!!(r instanceof Node&&X.contains(r)||r instanceof Element&&r.closest?.(`.cw-context-menu`))},l=e=>{n!==Y||!X?.isConnected||c(e)||gs()},u=e=>{if(n!==Y||!$o?.isConnected)return;let t=e.target;if(!t)return;let r=t.closest?.(`.cw-context-menu__item`);if(!r&&typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element&&t.classList?.contains?.(`cw-context-menu__item`)){r=t;break}}if(!r){fs(1);return}r.getAttribute(`aria-haspopup`)!==`menu`&&fs(1)},d=e=>{n===Y&&e.key===`Escape`&&gs()},f=()=>gs();queueMicrotask(()=>{n===Y&&(document.addEventListener(`pointerdown`,l,{capture:!0}),document.addEventListener(`contextmenu`,l,{capture:!0}),document.addEventListener(`keydown`,d),a.addEventListener(`click`,u,{capture:!0}),window.addEventListener(`resize`,f,{passive:!0}),window.addEventListener(`blur`,f,{passive:!0}),es.push(()=>document.removeEventListener(`pointerdown`,l,{capture:!0})),es.push(()=>document.removeEventListener(`contextmenu`,l,{capture:!0})),es.push(()=>document.removeEventListener(`keydown`,d)),es.push(()=>a.removeEventListener(`click`,u,{capture:!0})),es.push(()=>window.removeEventListener(`resize`,f)),es.push(()=>window.removeEventListener(`blur`,f)))})}}));function ys(e){return`${Ts}${String(e||``).trim().toLowerCase()}`}function bs(){let e=document.querySelector(`.env-shell-chrome`);return e instanceof HTMLElement&&e.hasAttribute(`data-desktop`)?!1:e instanceof HTMLElement&&e.dataset.chromeLayout===`mobile`||typeof matchMedia==`function`&&matchMedia(`(max-width: 640px)`).matches}function xs(e=new Date){return{time:e.toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`}),date:e.toLocaleDateString(void 0,{weekday:`short`,day:`numeric`,month:`short`})}}function Ss(e){let t=d([]);ee(t),te(Cs,t,{title:`Home`,icon:`house`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`home`,e.onHome()}),te(ws,t,{title:`Markdown`,icon:`article`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`viewer`,e.onViewer()});let n=document.createElement(`ui-taskbar`);n.className=`env-shell-taskbar wf-chrome-no-select`,n.setAttribute(`part`,`taskbar`),n.setAttribute(`data-type`,`desktop`);let r=document.createElement(`div`);r.className=`env-shell-taskbar__pins`;let i=document.createElement(`div`);i.className=`env-shell-taskbar__windows`;let o=document.createElement(`ui-task`);o.setAttribute(`title`,`Home`),o.setAttribute(`icon`,`house`),o.setAttribute(`data-id`,Cs),o.setAttribute(`data-env-home`,``),o.setAttribute(`aria-label`,`Home`),o.setAttribute(`aria-haspopup`,`menu`),o.setAttribute(`aria-keyshortcuts`,`LongPress`);let s=document.createElement(`ui-task`);s.setAttribute(`title`,`Markdown`),s.setAttribute(`icon`,`article`),s.setAttribute(`data-id`,ws),s.setAttribute(`data-env-pin`,`viewer`),s.setAttribute(`aria-label`,`Markdown`),r.append(o,s);let c=document.createElement(`div`);c.className=`env-shell-taskbar__tray-host`;let l=document.createElement(`div`);l.className=`env-shell-taskbar__clock`,l.setAttribute(`role`,`timer`),l.setAttribute(`aria-live`,`polite`);let u=document.createElement(`span`);u.className=`env-shell-taskbar__clock-time`;let f=document.createElement(`span`);f.className=`env-shell-taskbar__clock-date`,l.append(u,f);let p=()=>{let{time:e,date:t}=xs();u.textContent=e,f.textContent=t,l.title=`${e} · ${t}`};p();let m=setInterval(p,Ds);c.append(zo(e.device,`env-device-tray env-device-tray--taskbar`),l);let h=document.createElement(`div`);h.className=`env-shell-navbar__switcher`,h.setAttribute(`role`,`menu`),h.setAttribute(`aria-label`,`Open apps`),h.hidden=!0;let g=document.createElement(`ul`);g.className=`env-shell-navbar__switcher-list`,h.appendChild(g),n.append(r,i,c,h);let _=new Map,v=[],y=null,S=!1,C=!1,w=null,T=[];T.push(()=>clearInterval(m));let E=e=>v.find(t=>String(t.id||``).trim().toLowerCase()===e),D=t=>{let n=String(t||``).trim().toLowerCase();if(!n)return;let r=E(n),i=String(e.focusedTaskId.value||``).trim().toLowerCase(),a=!!r?.focused||i===n||i===`markdown`&&n===`viewer`||i===`viewer`&&(n===`viewer`||n===`markdown`);if(r?.minimized){r.minimized=!1,r.focused=!0,_.get(n)?.toggleAttribute(`data-minimized`,!1),e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n);return}if(a&&r&&r.visible!==!1){r.minimized=!0,r.focused=!1,_.get(n)?.toggleAttribute(`data-minimized`,!0),e.onMinimizeWindow?.(n);return}e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n)},ne=(t,r,i)=>{if(bs())return;t.preventDefault(),t.stopPropagation();let a=String(r||``).trim().toLowerCase(),o=!!E(a)?.minimized,s=[{id:o?`restore`:`minimize`,label:o?`Restore`:`Minimize`,icon:o?`arrow-square-out`:`minus`,action:()=>{o?(e.focusedTaskId.value=a,e.onWindowTask?.(a)):e.onMinimizeWindow?.(a)}},{id:`close`,label:`Close`,icon:`x`,danger:!0,action:()=>e.onCloseWindow?.(a)}];_s({x:t.clientX,y:t.clientY,compact:!0,anchor:t.target instanceof Element?t.target:n,items:s})};n.addEventListener(`contextmenu`,t=>{if(bs())return;let r=typeof t.composedPath==`function`?t.composedPath():[];for(let e of r)if(e instanceof Element&&e.closest?.(`ui-task`))return;t.preventDefault(),t.stopPropagation(),_s({x:t.clientX,y:t.clientY,compact:!0,anchor:n,items:[{id:`show-desktop`,label:`Show desktop`,icon:`desktop`,action:()=>e.onHome()},{id:`home`,label:`Home`,icon:`house`,action:()=>e.onHome()}]})});let re=()=>{C=!1,h.hidden=!0,g.replaceChildren(),n.removeAttribute(`data-switcher-open`)},O=()=>{let r=v.filter(e=>e.visible!==!1&&String(e.id||``).trim());if(g.replaceChildren(),r.length)for(let n of r){let r=String(n.id||``).trim().toLowerCase(),i=document.createElement(`li`);i.setAttribute(`role`,`none`);let a=document.createElement(`button`);a.type=`button`,a.className=`env-shell-navbar__switcher-item`,a.setAttribute(`role`,`menuitem`),a.toggleAttribute(`data-active`,!!n.focused);let o=document.createElement(`ui-icon`);o.setAttribute(`icon`,n.icon||`app-window`),o.setAttribute(`icon-style`,`duotone`),o.setAttribute(`aria-hidden`,`true`);let s=document.createElement(`span`);s.textContent=n.title||r,a.append(o,s),a.addEventListener(`click`,n=>{n.preventDefault(),n.stopPropagation(),re(),e.focusedTaskId.value=r;let i=ys(r),a=b(t,i);a?a.focus=!0:e.onWindowTask?.(r)}),i.appendChild(a),g.appendChild(i)}else{let e=document.createElement(`li`);e.className=`env-shell-navbar__switcher-empty`,e.textContent=`No open apps`,g.appendChild(e)}C=!0,h.hidden=!1,n.setAttribute(`data-switcher-open`,``)},k=()=>{y!=null&&(clearTimeout(y),y=null)},ie=()=>{re(),b(t,Cs).focus=!0};o.addEventListener(`click`,e=>{if(S){e.preventDefault(),e.stopPropagation(),S=!1;return}ie()}),o.addEventListener(`pointerdown`,e=>{if(bs()&&!(e.button!=null&&e.button!==0)){S=!1,k(),y=setTimeout(()=>{y=null,S=!0;try{o.releasePointerCapture?.(e.pointerId)}catch{}O()},Es);try{o.setPointerCapture?.(e.pointerId)}catch{}}},{capture:!0});let A=()=>{k()};o.addEventListener(`pointerup`,A,{capture:!0}),o.addEventListener(`pointercancel`,A,{capture:!0}),o.addEventListener(`contextmenu`,e=>{bs()&&(e.preventDefault(),S=!0,k(),O())}),s.addEventListener(`click`,()=>{let e=E(`viewer`)||E(`markdown`);if(e){D(String(e.id||`viewer`).toLowerCase());return}b(t,ws).focus=!0}),s.addEventListener(`contextmenu`,t=>{let n=E(`viewer`)||E(`markdown`);if(!n){if(bs())return;t.preventDefault(),_s({x:t.clientX,y:t.clientY,compact:!0,anchor:s,items:[{id:`open-markdown`,label:`Open Markdown`,icon:`article`,action:()=>e.onViewer()}]});return}ne(t,String(n.id||`viewer`),n.title||`Markdown`)});let ae=e=>{if(!C)return;let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t)if(e===h||e===o||e instanceof Element&&(e===h||h.contains(e)||e===o))return;re()};document.addEventListener(`pointerdown`,ae,{capture:!0}),T.push(()=>document.removeEventListener(`pointerdown`,ae,{capture:!0}));let oe=()=>{let t=String(e.focusedTaskId.value||`home`),n=(e,t)=>{e.toggleAttribute(`data-env-active`,t),e.toggleAttribute(`data-active`,t),e.toggleAttribute(`data-focus`,t)};n(o,t===`home`),n(s,t===`viewer`||t===`markdown`);for(let[e,r]of _)n(r,t===e)};a(()=>{oe()},[e.focusedTaskId],{triggerImmediately:!0});let se=e=>{let n=String(e.id||``).trim().toLowerCase();if(!n||n===`home`)return;let r=ys(n),a=e.title||n,o=String(e.icon||``).trim()||`app-window`,s=_.get(n);if(!s){let e=te(r,null,{title:a,icon:o},{viewId:n},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,D(n)});e.list=t,t.push(e),s=document.createElement(`ui-task`),s.setAttribute(`data-id`,r),s.setAttribute(`data-view`,n),s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),D(n)}),s.addEventListener(`contextmenu`,e=>{ne(e,n,a)}),_.set(n,s),i.appendChild(s)}s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.toggleAttribute(`data-minimized`,!!e.minimized),s.hidden=e.visible===!1},ce=n=>{v=Array.isArray(n)?n.slice():[];let r=new Set;for(let t of n){let n=String(t.id||``).trim().toLowerCase();!n||n===`home`||(r.add(n),se(t),t.focused&&(e.focusedTaskId.value=n))}for(let[e,n]of[..._.entries()]){if(r.has(e))continue;let i=ys(e),a=b(t,i);if(a){let e=t.indexOf(a);e>=0&&t.splice(e,1)}n.remove(),_.delete(e)}oe(),C&&O()},le=n=>{let r=String(n||`home`).toLowerCase(),i=Cs;r===`viewer`||r===`markdown`?i=ws:r!==`home`&&(i=ys(r));let a=b(t,i);if(a){for(let e of t)e!==a&&(e.active=!1);a.active=!0}e.focusedTaskId.value=r===`markdown`?`viewer`:r,oe()},ue=()=>{bs()?w&&=(w.destroy(),null):!w&&n.isConnected&&(w=x(n,{className:`env-shell-taskbar-under`,shadowBlur:28,shadowOffsetY:8,shadowColor:`rgba(0, 0, 0, 0.4)`}))};queueMicrotask(ue);let de=typeof matchMedia==`function`?matchMedia(`(min-width: 641px)`):null,fe=()=>ue();return de?.addEventListener?.(`change`,fe),T.push(()=>de?.removeEventListener?.(`change`,fe)),{element:n,taskList:t,setFocusedTaskId:le,syncWindowTasks:ce,dispose:()=>{k(),re(),w?.destroy(),w=null;for(let e of T)try{e()}catch{}T.length=0,_.clear(),i.replaceChildren()}}}var Cs,ws,Ts,Es,Ds,Os=e((()=>{A(),T(),S(),r(),vs(),Vo(),Cs=`#env-home`,ws=`#env-viewer`,Ts=`#env-win-`,Es=420,Ds=3e4})),ks,As=e((()=>{ks=`/**
 * Shadow-only layout for \`<env-shell-container>\`: underlying / main / overlays stack.
 * Document-level tokens (e.g. \`.env-shell-root\`) stay in \`root.scss\`.
 */
:host {
  display: block;
  position: relative;
  box-sizing: border-box;
  isolation: isolate;
  /* WHY: \`overflow: clip\` breaks \`position: fixed\` overlays (context menus in overlay slot clip to wrong box). */
  overflow: visible;
  min-block-size: 100dvb;
  color-scheme: light dark;
}

.esc-stack {
  display: grid;
  grid-template: 1fr/1fr;
  min-block-size: inherit;
  box-sizing: border-box;
}

.esc-layer {
  grid-area: 1/1;
  min-block-size: inherit;
  box-sizing: border-box;
}

/* WHY: Wallpaper / canvas sits behind; never intercepts hits; clip bleed without clipping \`fixed\` overlays. */
.esc-underlying {
  z-index: 0;
  pointer-events: none;
  overflow: clip;
}

/* Main workspace: home, frames host, routed content. */
.esc-main {
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-block-size: inherit;
  pointer-events: auto;
  /* Allow \`.wf-frame\` / portaled overlays to escape this layer; clipping host would hide floating windows. */
  overflow: visible;
}

/* Menus / modals / env chrome — children opt into pointer-events. */
.esc-overlays {
  z-index: 2;
  pointer-events: none;
  position: relative;
  overflow: visible;
}`}));function js(){return!Ls&&!customElements.get(`env-shell-container`)&&(customElements.define(Ps,Is),Ls=!0),Is}function Ms(){js();let e=customElements.get(Ps);if(e)try{return new e}catch(e){console.warn("[env-shell-container] `new` failed, falling back to createElement",e)}return document.createElement(Ps)}function Ns(e){return e instanceof HTMLElement&&e.localName===`env-shell-container`}var Ps,Fs,Is,Ls,Rs=e((()=>{As(),k(),Ps=`env-shell-container`,Fs=document.createElement(`template`),Fs.innerHTML=`
<div class="esc-stack" part="stack">
  <div class="esc-layer esc-underlying" part="underlying">
    <slot name="${O.underlying}"></slot>
  </div>
  <div class="esc-layer esc-main" part="main" data-shell-content role="main">
    <slot></slot>
  </div>
  <div
    class="esc-layer esc-overlays"
    part="overlays"
    data-shell-overlays
    data-env-shell-overlays
  >
    <slot name="${O.overlay}"></slot>
  </div>
</div>`,Is=class extends HTMLElement{#e=!1;get overlayMount(){return this.#t(),this.shadowRoot?.querySelector(`[data-shell-overlays]`)??null}constructor(){super(),this.#t()}connectedCallback(){this.#t()}#t(){if(this.#e&&this.shadowRoot)return;let e=this.shadowRoot??this.attachShadow({mode:`open`});if(e.querySelector(`.esc-stack`)||e.appendChild(Fs.content.cloneNode(!0)),e.adoptedStyleSheets.length===0){let t=new CSSStyleSheet;t.replaceSync(ks),e.adoptedStyleSheets=[t]}this.#e=!0}},Ls=!1})),zs=e((()=>{Fo()}));function Bs(e,t={}){let{x:n=48,y:r=48,w:a=460,h:o=320,z:c=10,demoRole:l}=t,u=matchMedia(`(max-width: 640px)`);return{demoRole:l,title:e,bounds:{x:s(n),y:s(r),w:s(a),h:s(o)},z:s(c),maximizedMobile:i(u.matches),minimized:i(!1),desktopMaximized:i(!1),nativeMode:i(!1),visible:i(!0),isMobileMq:u}}var Vs=e((()=>{r(),Object.freeze({w:240,h:160})}));function Hs(e){let t=String(e??``).trim().toLowerCase();t=t.replace(/^#/,``);let n=/^todo:\s*(.*)$/i.exec(t);return n&&(t=String(n[1]??``).trim().toLowerCase()),t=t.replace(/\s+/g,``),t?t===`viewer`||Gs.has(t)?Ws:t:``}function Us(e){return String(e||``).trim().toLowerCase()===Ws}var Ws,Gs,Ks=e((()=>{Ws=`viewer`,Gs=new Set([`markdown`,`markdown-view`,`markdown-viewer`,`reader`,`env-viewer`])}));function qs(e){return!!(e&&typeof e==`object`&&typeof e.render==`function`)}function Js(e,t){let n=e?.lifecycle?.[t];typeof n==`function`&&Promise.resolve(n())}function Ys(e){if(typeof e!=`function`)return!1;try{let t=e.prototype;return!!(t!=null&&typeof HTMLElement<`u`&&HTMLElement.prototype.isPrototypeOf(t))}catch{return!1}}function Xs(e,t){let n=e.default??e.createView??e.createHomeView;if(!n||typeof n!=`function`)throw Error(`window-frame view-mount: module has no default/createView factory`);let r=Ys(n)?new n(t):n(t);if(qs(r)){let e=r,n=e.render(t);if(!(n instanceof HTMLElement))throw Error(`window-frame view-mount: view.render() must return HTMLElement`);return{root:n,view:e}}if(r instanceof HTMLElement)return{root:r};throw Error(`window-frame view-mount: factory did not return View or HTMLElement`)}function Zs(e,t){return e.replaceChildren(t),()=>{t.remove(),e.replaceChildren()}}async function Qs(e,t,n){let{root:r,view:i}=Xs(await e(),n);r.classList.add(`wf-mounted-view`);let a=Zs(t,r);return Js(i,`onMount`),Js(i,`onShow`),()=>{Js(i,`onHide`),Js(i,`onUnmount`),a()}}var $s=e((()=>{}));function ec(e){let t=`[${tc}]`,n=e.querySelector(t);if(n)return n.style.zIndex||(n.style.zIndex=nc),n.style.position||(n.style.position=Ns(e)?`absolute`:`fixed`),n;let r=document.createElement(`div`);return r.setAttribute(tc,``),r.className=`env-shell-overlays`,r.setAttribute(`data-part`,`env-overlays`),Ns(e)?(r.slot=O.overlay,r.style.cssText=`position:absolute;inset:0;pointer-events:none;z-index:${nc};box-sizing:border-box;`,e.appendChild(r),r):(r.style.cssText=`position:fixed;inset:0;pointer-events:none;z-index:${nc};box-sizing:border-box;`,e.appendChild(r),r)}var tc,nc,rc=e((()=>{Rs(),k(),tc=`data-env-shell-overlays`,nc=`2147483600`}));function ic(e){let t=e?.closest?.(`.env-shell-root`)??e?.closest?.(`env-shell-container`);if(!(t instanceof HTMLElement))return 0;let n=getComputedStyle(t).getPropertyValue(`--env-window-z-boost`).trim(),r=Number.parseInt(n,10);return Number.isFinite(r)?r:0}function ac(e){let t=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.querySelector?.(`.env-shell-root, env-shell-container`);return t instanceof HTMLElement?t:null}function oc(e){let t=ac(e);if(!t)return;let n=!!t.querySelector?.(`ui-window[native-mode], ui-window[data-native-active]`);t.toggleAttribute(`data-env-native-task`,n)}function sc(e,t,n,r,o={}){let{bounds:s,z:c,maximizedMobile:l,minimized:u,desktopMaximized:d,visible:f,isMobileMq:p}=t;t.nativeMode||=i(!!o.startNative);let m=t.nativeMode;o.startNative&&(m.value=!0);let h=document.createElement(`ui-window`);h.setAttribute(`managed`,``),h.className=`env-ui-window`,h.setAttribute(`part`,`window`);let g=document.createElement(`span`);g.slot=`title`,g.className=`env-ui-window__title`,g.textContent=t.title,n.slot=`content`,n.classList.add(`env-ui-window__body`),h.append(g,n),e.appendChild(h);let _=String(o?.managedViewKey??``).trim();_&&(h.setAttribute(`data-ui-window-view`,_),h.setAttribute(`data-wf-managed-view`,_));let v=null,y=()=>{o.onChromeChange?.(),oc(e)},ee=()=>{h.style.right=``,h.style.bottom=``},te=()=>{h.style.left=`${cc}px`,h.style.top=`${cc}px`,h.style.right=`${cc}px`,h.style.bottom=`${cc}px`,h.style.width=`auto`,h.style.height=`auto`,h.style.removeProperty(`--ui-win-width`),h.style.removeProperty(`--ui-win-height`)},b=()=>{h.style.left=`0`,h.style.top=`0`,h.style.right=`0`,h.style.bottom=`0`,h.style.width=`100%`,h.style.height=`100%`,h.style.removeProperty(`--ui-win-width`),h.style.removeProperty(`--ui-win-height`)},x=()=>{let t=!!p.matches,n=ic(e),r=(c.value??10)+n;h.style.zIndex=String(r),t&&(l.value||=!0,u.value&&=!1,d.value&&=!1);let i=!!m.value,a=!t&&!!u.value,o=!t&&!!d.value&&!i,g=t&&!i;if(h.toggleAttribute(`native-mode`,i),h.toggleAttribute(`minimized`,a),h.toggleAttribute(`data-mobile-max`,g),h.toggleAttribute(`data-desk-max`,o),h.toggleAttribute(`maximized`,o||g||i),a){h.setVisible(!1),oc(e);return}if(h.setVisible(!!f.value),!f.value){oc(e);return}if(i){b(),oc(e);return}if(g){h.style.left=`0`,h.style.top=`0`,h.style.right=`0`,h.style.bottom=`var(--env-mobile-dock-reserve, 3.25rem)`,h.style.width=`100%`,h.style.height=`auto`,oc(e);return}if(o){te(),oc(e);return}ee(),h.applyBounds({x:s.x.value,y:s.y.value,w:s.w.value,h:s.h.value,z:r}),oc(e)},S=()=>{p.matches&&(m.value||(l.value=!0),d.value&&(d.value=!1,v&&=(s.x.value=v.x,s.y.value=v.y,s.w.value=v.w,s.h.value=v.h,null))),x(),y()},C=a(()=>{x()},[s.x,s.y,s.w,s.h,c,l,u,d,m,f],{triggerImmediately:!0});p.addEventListener(`change`,S),S();let w=()=>{u.value&&(u.value=!1,f.value=!0),r();let t=ic(e),n=(c.value??10)+t;typeof h.bringToFront==`function`?h.bringToFront(n):(h.style.zIndex=String(n),h.toggleAttribute(`data-focused`,!0)),y()},T=e=>{let t=e.detail;m.value||d.value||l.value||u.value||(typeof t?.x==`number`&&(s.x.value=t.x),typeof t?.y==`number`&&(s.y.value=t.y))},E=e=>{let t=e.detail;m.value||d.value||l.value||u.value||(typeof t?.w==`number`&&(s.w.value=t.w),typeof t?.h==`number`&&(s.h.value=t.h))},D=()=>{p.matches||(m.value&&=!1,d.value&&(d.value=!1,v&&=(s.x.value=v.x,s.y.value=v.y,s.w.value=v.w,s.h.value=v.h,null)),u.value=!0,x(),y())},ne=()=>{if(m.value){O();return}if(p.matches){u.value=!1,l.value=!0,x(),y();return}if(u.value&&=!1,d.value){k();return}v={x:s.x.value,y:s.y.value,w:s.w.value,h:s.h.value},d.value=!0,x(),y()},re=()=>{u.value&&(u.value=!1,f.value=!0),!m.value&&!d.value&&!l.value&&(v={x:s.x.value,y:s.y.value,w:s.w.value,h:s.h.value}),d.value=!1,l.value=!1,m.value=!0,x(),y()},O=()=>{m.value&&(m.value=!1,v&&=(s.x.value=v.x,s.y.value=v.y,s.w.value=v.w,s.h.value=v.h,null),p.matches&&(l.value=!0),x(),y())},k=()=>{if(m.value){O();return}u.value&&(u.value=!1,f.value=!0),p.matches?l.value&&=!1:d.value&&(d.value=!1,v&&=(s.x.value=v.x,s.y.value=v.y,s.w.value=v.w,s.h.value=v.h,null)),x(),y()},ie=!1,A=!1,ae=t=>{if(t.preventDefault(),!(ie||A)){ie=!0;try{m.value&&=!1,f.value=!1,o.onClose?.()}catch(e){console.error(`[mount-ui-window] onClose failed`,e)}finally{if(!A){A=!0,C?.(),p.removeEventListener(`change`,S);try{h.isConnected&&h.remove()}catch{}}oc(e)}}},oe=0,se=()=>{let e=typeof performance<`u`?performance.now():Date.now();return e-oe<280?!1:(oe=e,!0)},ce=e=>{if(!(ie||A)&&se()){if(e===`close`){ae(new Event(`window-close`,{cancelable:!0}));return}if(e===`exit-native`){O();return}if(e===`maximize`){m.value||d.value||l.value?k():ne();return}u.value?k():D()}},le=e=>{let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t){if(!(e instanceof Element))continue;let t=e.getAttribute?.(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.matches?.(`.title-close`))return`close`;if(e.matches?.(`.title-exit-native`))return`exit-native`;if(e.matches?.(`.title-maximize`))return`maximize`;if(e.matches?.(`.title-minimize`))return`minimize`}return null},ue=e=>{if(ie||A||e.defaultPrevented)return;let t=le(e);t&&(e.preventDefault(),e.stopPropagation(),ce(t))},de=null,fe=()=>{let e=h.shadowRoot;if(!e||ie||A)return;let t=e.querySelectorAll(`[data-ui-win-action], .title-minimize, .title-maximize, .title-close, .title-exit-native`);for(let e of t){let t=e.getAttribute(`data-ui-win-action`);if(t||(e.classList.contains(`title-close`)?t=`close`:e.classList.contains(`title-exit-native`)?t=`exit-native`:e.classList.contains(`title-maximize`)?t=`maximize`:e.classList.contains(`title-minimize`)&&(t=`minimize`)),!t)continue;e.setAttribute(`data-ui-win-action`,t);let n=t,r=e=>{e.defaultPrevented||(e.preventDefault(),e.stopPropagation(),ce(n))};e.onclick=r,e.onpointerup=e=>{e.button===0&&r(e)}}};if(fe(),queueMicrotask(fe),requestAnimationFrame(fe),typeof MutationObserver<`u`){de=new MutationObserver(()=>fe());let e=()=>{h.shadowRoot?de?.observe(h.shadowRoot,{childList:!0,subtree:!0}):requestAnimationFrame(e)};e()}return h.addEventListener(`window-focus`,w),h.addEventListener(`window-move`,T),h.addEventListener(`window-resize`,E),h.addEventListener(`window-minimize`,D),h.addEventListener(`window-maximize`,ne),h.addEventListener(`window-restore`,k),h.addEventListener(`window-native`,re),h.addEventListener(`window-exit-native`,O),h.addEventListener(`window-close`,ae),h.addEventListener(`click`,ue),h.addEventListener(`pointerup`,ue),()=>{if(!A){A=!0,ie=!0,C?.(),de?.disconnect(),de=null,p.removeEventListener(`change`,S),h.removeEventListener(`window-focus`,w),h.removeEventListener(`window-move`,T),h.removeEventListener(`window-resize`,E),h.removeEventListener(`window-minimize`,D),h.removeEventListener(`window-maximize`,ne),h.removeEventListener(`window-restore`,k),h.removeEventListener(`window-native`,re),h.removeEventListener(`window-exit-native`,O),h.removeEventListener(`window-close`,ae),h.removeEventListener(`click`,ue),h.removeEventListener(`pointerup`,ue);try{m.value&&=!1,h.isConnected&&h.remove()}catch{}oc(e)}}}var cc,lc=e((()=>{r(),A(),cc=8}));function $(e,t){let n=typeof CSS<`u`&&typeof CSS.escape==`function`?CSS.escape(t):t.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`),r=e.querySelector(`:scope > ui-window[data-ui-window-view="${n}"]`)||e.querySelector(`:scope > ui-window[data-wf-managed-view="${n}"]`)||e.querySelector(`:scope > section.wf-frame[data-wf-managed-view="${n}"]`);return r instanceof HTMLElement?r:null}function uc(e){let t=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??e.parentElement;if(!(t instanceof HTMLElement))return 0;let n=getComputedStyle(t).getPropertyValue(`--env-window-z-boost`).trim(),r=Number.parseInt(n,10);return Number.isFinite(r)?r:0}function dc(e){return null}function fc(e,t){let n=Hs(e)||String(e||``).trim().toLowerCase();if(t?.[n])return t[n];if(gc[n])return gc[n];let r=String(e||``).trim();return r?r.charAt(0).toUpperCase()+r.slice(1):`View`}function pc(e,t){let n=document.createElement(`div`);return n.className=`wf-view-placeholder`,n.setAttribute(`part`,`placeholder`),n.innerHTML=`<p class="wf-view-placeholder__title">${fc(e,t)}</p>
<p class="wf-view-placeholder__hint">No window module is registered for this shortcut in environment-shell yet.</p>`,n}function mc(e,t={}){let n=s(120),r=new Map,i=!1,a=null,o=()=>{t.onTaskingChange?.(c())},c=()=>{let n=[];for(let i of r.values())$(e,i.key)&&n.push({id:i.key,title:i.model.title||fc(i.key,t.viewTitles),icon:hc[i.key]||`app-window`,focused:a===i.key,minimized:!!i.model.minimized.value,visible:!!i.model.visible.value});return n},l=()=>{for(let t of r.values()){let n=$(e,t.key);if(!n)continue;n.toggleAttribute(`data-focused`,!1);let r=n.clearFocused;typeof r==`function`&&r.call(n)}},u=e=>{for(let[t,n]of r)e&&t===e||n.model.nativeMode?.value&&(n.model.nativeMode.value=!1)},d=(t,r)=>{if(a===r&&!t.minimized.value){let t=$(e,r);if(t&&t===e.lastElementChild)return}n.value+=1,t.z.value=n.value,t.minimized.value=!1,t.visible.value=!0,a=r,t.nativeMode?.value&&u(r);let i=$(e,r);if(i){let n=uc(e),r=(t.z.value??10)+n;l(),i.style.zIndex=String(r),i.toggleAttribute(`data-focused`,!0);let a=i.bringToFront;typeof a==`function`&&a.call(i,r),i.parentElement===e&&e.appendChild(i)}o()},f={},p=t.overlayMountHost?ec(t.overlayMountHost):null;f.resolveOverlayMountPoint=e=>{if(p)return p;if(t.environmentShellHost){let e=ne(t.environmentShellHost);if(e)return e}return D(e??null)};let m=e=>{let n=Hs(e)||String(e||``).trim().toLowerCase();return t.viewLoaders?.[n]||dc(n)},h=()=>{let i=t.readerWindow;if(!i?.content)return;let s=Ws,c=r.get(s);if(c&&$(e,s)){d(c.model,s);return}if(c&&!$(e,s)){r.delete(s);try{c.disposeFrame()}catch{}}let l=i.seed||{},u=Bs(i.title||fc(s,t.viewTitles),{x:l.x??96,y:l.y??96,w:l.w??420,h:l.h??340,z:l.z??n.value+1});n.value=u.z.value;let f=()=>{};f=sc(e,u,i.content,()=>d(u,s),{managedViewKey:s,onChromeChange:o,onClose:()=>{let e=r.get(s);if(e){r.delete(s),a===s&&(a=null);try{e.disposeFrame()}catch{}o()}}}),r.set(s,{key:s,model:u,disposeFrame:f}),d(u,s)},g=(s,c)=>{if(i)return;let l=Hs(String(s||``));if(!l||l===`home`||l===`airpad`)return;if(Us(l)&&t.readerWindow?.content){h();return}let p=r.get(l);if(p&&$(e,l)){d(p.model,l);return}if(p&&!$(e,l)){p.disposeView?.(),r.delete(l);try{p.disposeFrame()}catch{}}let g=m(l),_=document.createElement(`div`);_.className=`wf-view-host env-ui-window__view-host`,_.setAttribute(`part`,`view-host`);let v=r.size*24,y=Bs(fc(l,t.viewTitles),{x:72+v,y:72+v,w:480,h:360,z:n.value+1});n.value=y.z.value;let ee=new Set((t.startNativeViewIds||[]).map(e=>Hs(String(e||``)))).has(l)||String(c?.native||``)===`1`||String(c?.params?.native||``)===`1`,te=()=>{};te=sc(e,y,_,()=>d(y,l),{managedViewKey:l,startNative:ee,onChromeChange:o,onClose:()=>{let e=r.get(l);if(e){r.delete(l),a===l&&(a=null);try{e.disposeView?.()}catch{}try{e.disposeFrame()}catch{}o()}}}),ee&&(y.nativeMode.value=!0,u(l));let b={key:l,model:y,disposeFrame:te,disposeView:void 0};r.set(l,b),d(y,l);let x={...c||{},shellContext:f};if(!g){_.replaceChildren(pc(l,t.viewTitles));return}Qs(g,_,x).then(e=>{if(i){e();return}let t=r.get(l);t&&(t.disposeView=e)},e=>{console.error(`[workspace-window-layer] mountViewModule failed for view "${l}"`,e),_.replaceChildren(pc(l,t.viewTitles))})};return f.navigate=(e,t)=>{g(String(e),t)},f.openView=(e,t)=>{g(String(e),t)},{shellContext:f,dispose:()=>{if(!i){i=!0;for(let e of r.values())e.disposeView?.(),e.disposeFrame();r.clear(),a=null,o()}},focusWindow:t=>{let n=Hs(String(t||``)),i=r.get(n);return!i||!$(e,n)?!1:(d(i.model,n),!0)},minimizeWindow:t=>{let n=Hs(String(t||``)),i=r.get(n);return!i||!$(e,n)||typeof matchMedia==`function`&&matchMedia(`(max-width: 640px)`).matches?!1:(i.model.nativeMode?.value&&(i.model.nativeMode.value=!1),i.model.desktopMaximized?.value&&(i.model.desktopMaximized.value=!1),i.model.visible.value=!0,i.model.minimized.value=!0,a===n&&(a=null,l()),o(),!0)},closeWindow:e=>{let t=Hs(String(e||``)),n=r.get(t);if(!n)return!1;r.delete(t),a===t&&(a=null);try{n.disposeView?.()}catch{}try{n.disposeFrame()}catch{}return o(),!0},blurWindows:()=>{u(null),a=null,l(),o()},closeAllWindows:()=>{if(!i){u(null);for(let e of[...r.values()]){try{e.disposeView?.()}catch{}try{e.disposeFrame()}catch{}}r.clear(),a=null,o()}},enterNative:t=>{let n=Hs(String(t||``)),i=r.get(n);return!i||!$(e,n)?!1:(u(n),i.model.nativeMode.value=!0,i.model.minimized.value=!1,i.model.visible.value=!0,d(i.model,n),!0)},exitNative:e=>{if(e){let t=Hs(String(e||``)),n=r.get(t);n?.model.nativeMode&&(n.model.nativeMode.value=!1),o();return}u(null),o()},listWindowTasks:c,getFocusedKey:()=>a}}var hc,gc,_c=e((()=>{r(),k(),Vs(),Ks(),$s(),rc(),lc(),hc={home:`house`,viewer:`article`,markdown:`article`,explorer:`books`,settings:`gear-six`,workcenter:`briefcase`,history:`clock-counter-clockwise`,editor:`pencil-simple-line`,network:`wifi-high`,task:`list-checks`,event:`calendar`,bonus:`gift`,person:`address-book`},gc={home:`Home`,viewer:`Markdown`,explorer:`Explorer`,settings:`Settings`,workcenter:`Work Center`,history:`History`,editor:`Editor`,network:`Network`,task:`Plan`,event:`Events`,bonus:`Bonuses`,person:`Contacts`}}));function vc(e,t=bc){try{localStorage.getItem(t)||localStorage.setItem(t,e)}catch{}}function yc(e,t){let n=Ro(),{element:r}=Bo(t.shell,t.introHtml,n),i=document.createElement(`div`);i.className=`env-shell-chrome wf-chrome-no-select`;let a;t.taskbar?(a=Ss({...t.taskbar,device:n}),i.append(a.element,r)):i.append(r);let o=typeof matchMedia==`function`?matchMedia(`(min-width: 641px)`):null,s=()=>{let e=!o||o.matches;i.toggleAttribute(`data-desktop`,e),i.dataset.chromeLayout=e?`desktop`:`mobile`};return s(),o?.addEventListener?.(`change`,s),Ns(e)&&(i.slot=O.overlay),e.appendChild(i),{root:i,device:n,statusBar:r,taskbar:a,disposeDevice:()=>{o?.removeEventListener?.(`change`,s),n.dispose()}}}var bc,xc=e((()=>{Vo(),Os(),Rs(),k(),Vo(),Os(),zs(),_c(),lc(),rc(),bc=`rs-wallpaper-image`})),Sc,Cc=e((()=>{Sc=`*,
*::before,
*::after {
    box-sizing: border-box;
}

/* --- Material-inspired tokens (expressive rounding + tonal surfaces / dark baseline) --- */
.wf-demo-root {
    isolation: isolate;
    min-block-size: 100dvb;
    /* Deep scrim akin to Material background */
    background: radial-gradient(
        1200px 700px at 12% -8%,
        color-mix(in oklch, var(--wf-md-primary) 18%, oklch(0.13 0.02 280)),
        oklch(0.11 0.02 280)
    );
    overflow: clip;
    --wf-md-primary: oklch(0.74 0.14 294);
    --wf-md-on-primary: oklch(0.2 0.04 294);
    --wf-md-surface: oklch(0.16 0.02 280);
    --wf-md-surf-container-low: oklch(0.19 0.025 278);
    --wf-md-surf-container: oklch(0.22 0.03 276);
    --wf-md-surf-container-high: oklch(0.26 0.035 274);
    --wf-md-outline-variant: oklch(1 0.02 280 / 12%);
    --wf-md-on-surface: oklch(0.93 0.02 274);
    --wf-md-on-surface-variant: oklch(0.74 0.03 274);
    --wf-md-error: oklch(0.7 0.18 22);
}

/* Chrome: no accidental text selection during drag — content opt-in selectable */
.wf-chrome-no-select {
    user-select: none;
    -webkit-user-select: none;
}

.wf-content-select {
    user-select: text;
    -webkit-user-select: text;
}

.wf-frame {
    /* Subtle outer radius — was 1.75rem (~28px). */
    --wf-shape-xl: 0.375rem;

    position: fixed;
    display: flex;
    flex-direction: column;
    border-radius: var(--wf-shape-xl);
    border: 1px solid var(--wf-md-outline-variant);
    overflow: clip;
    color: var(--wf-md-on-surface);
    background: var(--wf-md-surf-container-low);
    /* Elevation 3 */
    box-shadow:
        0 2px 1px rgb(0 0 0 / 22%),
        0 4px 3px rgb(0 0 0 / 16%),
        0 8px 10px rgb(0 0 0 / 12%),
        0 24px 32px rgb(0 0 0 / 32%);
}

.wf-frame.wf-hidden {
    display: none !important;
}

.wf-frame.wf-minimized .wf-frame-body {
    display: none !important;
}

.wf-frame.wf-minimized {
    block-size: auto !important;
    box-shadow:
        0 1px 2px rgb(0 0 0 / 22%),
        0 2px 4px rgb(0 0 0 / 14%);
}

.wf-titlebar {
    flex: none;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 0.25rem;
    padding-inline: 0.5rem 0.25rem;
    padding-block: 0.125rem;
    /* WHY: Body uses \`transform: translateZ(0)\` + scrollers; without z-index, painted body can sit above chrome and swallow hits. */
    position: relative;
    z-index: 3;
    pointer-events: auto;
    background: linear-gradient(
        165deg,
        color-mix(in oklch, var(--wf-md-surf-container-high) 88%, transparent),
        var(--wf-md-surf-container)
    );
    border-block-end: 1px solid var(--wf-md-outline-variant);
}

.wf-titlebar-drag {
    flex: 1;
    min-inline-size: 0;
    min-block-size: 2.5rem;
    display: flex;
    align-items: center;
    padding-inline-start: 0.35rem;
    cursor: grab;
    touch-action: none;
}

.wf-titlebar-drag:active {
    cursor: grabbing;
}

.wf-titlebar-actions {
    flex: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.125rem;
}

.wf-title {
    font: 550 0.875rem / 1.2 "Google Sans Flex", ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.015em;
    color: var(--wf-md-on-surface);
    opacity: 0.96;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.wf-chrome-btn {
    inline-size: 2.25rem;
    block-size: 2.25rem;
    flex: none;
    display: grid;
    place-items: center;
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--wf-md-on-surface-variant);
    cursor: pointer;
    outline: none;
    transition:
        background 0.14s ease,
        color 0.14s ease;
}

.wf-chrome-btn:hover {
    background: color-mix(in oklch, var(--wf-md-on-surface) 10%, transparent);
    color: var(--wf-md-on-surface);
}

.wf-chrome-btn:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in oklch, var(--wf-md-primary) 56%, transparent);
}

.wf-chrome-btn_close:hover {
    background: color-mix(in oklch, var(--wf-md-error) 22%, transparent);
    color: var(--wf-md-on-surface);
}

.wf-frame-body {
    flex: 1;
    min-block-size: 0;
    min-inline-size: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 0;
    /* WHY: Establishes a containing block so AirPad \`position: fixed\` toolbars clip to this frame, not the browser viewport. */
    transform: translateZ(0);
    background: var(--wf-md-surface);
    border-end-start-radius: max(0px, calc(var(--wf-shape-xl) - 1px));
    border-end-end-radius: max(0px, calc(var(--wf-shape-xl) - 1px));
}

/* Slot for routed \`modules/views/*\` roots */
.wf-frame-slot.wf-mounted-view,
.wf-frame-slot > .wf-mounted-view {
    flex: 1;
    min-block-size: 0;
    overflow: auto;
}

.wf-mobile-max.wf-mobile {
    border-radius: 0;
}

.wf-mobile-max.wf-mobile .wf-frame-body {
    border-radius: 0;
}

.wf-resize {
    position: absolute;
    inset-inline-end: 4px;
    inset-block-end: 4px;
    /* WHY: Larger hit target than the visible glyph — small grips feel “broken” on HiDPI / trackpads. */
    inline-size: 22px;
    block-size: 22px;
    cursor: se-resize;
    /* WHY: \`.wf-frame-body\` uses \`transform\` + fills the flex column; without z-index the body layer often wins hit-testing in the corner. */
    z-index: 4;
    pointer-events: auto;
    background:
        linear-gradient(135deg, transparent 53%, color-mix(in oklch, var(--wf-md-on-surface) 52%, transparent) 53%) 100% 100% /
        11px 11px no-repeat;
    touch-action: none;
}

.wf-explorer {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-inline: 2px;
}

.wf-exp-row {
    appearance: none;
    border-radius: 0.75rem;
    border: 1px solid transparent;
    background: color-mix(in oklch, var(--wf-md-on-surface) 8%, transparent);
    color: inherit;
    font: inherit;
    padding: 8px;
    cursor: pointer;
    text-align: start;
}

.wf-exp-row:hover {
    border-color: var(--wf-md-outline-variant);
}

.wf-exp-row_sel {
    outline: 1px solid color-mix(in oklch, var(--wf-md-primary) 55%, transparent);
}

.wf-viewer {
    flex: 1;
    min-block-size: 0;
}

.wf-md-body {
    block-size: 100%;
    overflow: auto;
    padding: 12px;
    margin: 0;
    font-family:
        "Google Sans Flex",
        ui-sans-serif,
        system-ui,
        sans-serif;
    font-size: 13px;
    line-height: 1.52;
}

.wf-md h1,
.wf-md h2,
.wf-md h3 {
    margin: 0 0 0.5rem;
}

.wf-md h1 {
    font-size: 1.25rem;
}

.wf-md p {
    margin: 0.35rem 0;
}

.wf-md pre {
    background: color-mix(in oklch, var(--wf-md-on-surface) 8%, transparent);
    border-radius: 0.75rem;
    padding: 0.75rem;
    overflow: auto;
}

.wf-md code {
    font-family:
        ui-monospace,
        "Google Sans Mono",
        monospace;
}

.wf-md ul {
    margin: 0.25rem;
    padding-inline-start: 1.35rem;
}

.wf-md-err {
    color: color-mix(in oklch, var(--wf-md-error) 85%, transparent);
}

.wf-hud {
    position: fixed;
    inset-block-end: 4px;
    inset-inline-start: 4px;
    max-inline-size: min(920px, 96vw);
    margin: 0;
    padding: 6px 10px;
    font: 12px ui-sans-serif, system-ui, sans-serif;
    color: var(--wf-md-on-surface-variant);
    opacity: 0.88;
}

.wf-hud p {
    margin: 0.15rem;
}

/*
 * WHY: On screen \`.wf-frame\` is \`position: fixed\` with pixel bounds; markdown/viewer print CSS uses
 * \`position: static\` + \`overflow: visible\` on inner hosts so document flow escapes the fixed box
 * and can paint over hidden shell/workspace layers. For print, reset the frame to normal flow so
 * content stays one continuous page stack inside the sheet margins.
 */
@media print {
    .wf-demo-root {
        overflow: visible !important;
        min-block-size: 0 !important;
        background: #fff !important;
    }

    .wf-frame {
        position: static !important;
        inset: auto !important;
        left: auto !important;
        top: auto !important;
        right: auto !important;
        bottom: auto !important;
        inline-size: 100% !important;
        max-inline-size: 100% !important;
        block-size: auto !important;
        min-block-size: 0 !important;
        max-block-size: none !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
        break-inside: avoid;
        z-index: auto !important;
        color: #000 !important;
        background: transparent !important;
    }

    .wf-titlebar,
    .wf-resize {
        display: none !important;
    }

    .wf-frame-body {
        transform: none !important;
        overflow: visible !important;
        flex: none !important;
        flex-basis: auto !important;
        min-block-size: 0 !important;
        block-size: auto !important;
        max-block-size: none !important;
        background: transparent !important;
        border-radius: 0 !important;
    }

    .wf-hud {
        display: none !important;
    }
}
`})),wc,Tc=e((()=>{wc=`/* environment-shell — default layout + chrome for wallpaper / home / window-frame hosts.
   Import in app entry: \`import "environment-shell/scss/main.scss"\` (or relative path). */
/* WHY: Layer wallpaper under workspace; wf-demo scrim must not paint over canvas. */
.env-shell-root.wf-demo-root {
  background: transparent;
}

.env-shell-root {
  color-scheme: light dark;
  /* Bridge wf-demo tokens → SpeedDial / launcher (\`--color-*\`, \`--on-surface-*\`). */
  --color-surface: var(--wf-md-surface, oklch(0.16 0.02 280));
  --color-on-surface: var(--wf-md-on-surface, oklch(0.93 0.02 274));
  --color-on-surface-variant: var(--wf-md-on-surface-variant, oklch(0.78 0.03 274));
  --color-surface-container: var(--wf-md-surf-container, oklch(0.22 0.03 276));
  --color-surface-container-high: var(--wf-md-surf-container-high, oklch(0.26 0.035 274));
  --color-outline-variant: var(--wf-md-outline-variant, oklch(1 0.02 280 / 12%));
  --on-surface-color: var(--wf-md-on-surface, oklch(0.93 0.02 274));
  --on-surface-variant: var(--wf-md-on-surface-variant, oklch(0.78 0.03 274));
}
@media (prefers-color-scheme: light) {
  .env-shell-root {
    /* WHY: wf-demo.css pins a dark baseline; flip Material-ish tokens so launcher icons/labels contrast on light tiles. */
    --wf-md-surface: oklch(0.98 0.008 280);
    --wf-md-surf-container-low: oklch(0.97 0.01 278);
    --wf-md-surf-container: oklch(0.94 0.012 276);
    --wf-md-surf-container-high: oklch(0.91 0.015 274);
    --wf-md-outline-variant: oklch(0 0 0 / 14%);
    --wf-md-on-surface: oklch(0.22 0.04 274);
    --wf-md-on-surface-variant: oklch(0.45 0.04 274);
    --color-surface: var(--wf-md-surface);
    --color-on-surface: var(--wf-md-on-surface);
    --color-on-surface-variant: var(--wf-md-on-surface-variant);
    --color-surface-container: var(--wf-md-surf-container);
    --color-surface-container-high: var(--wf-md-surf-container-high);
    --color-outline-variant: var(--wf-md-outline-variant);
    --on-surface-color: var(--wf-md-on-surface);
    --on-surface-variant: var(--wf-md-on-surface-variant);
  }
}
.env-shell-root {
  position: relative;
  isolation: isolate;
  min-block-size: 100dvb;
  /* Sync with shadow \`:host\`: do not clip \`position:fixed\` descendants (overlay slot context menus). */
  overflow: visible;
  /* Added to \`mountWindowFrame\` z-index so \`.wf-frame\` stacks above the home layer. */
  --env-window-z-boost: 400;
  /*
   * WHY: Mobile chrome is a short Home nav (~3rem), not the tall desktop taskbar.
   * Home padding and ui-window bottom inset must share the same reserve or the grid
   * sits in a dead band and icons look “stuck” / nav appears missing.
   */
  --env-mobile-dock-reserve: calc(3rem + env(safe-area-inset-bottom, 0px));
  --env-shell-chrome-stack-reserve: var(--env-mobile-dock-reserve);
}
@media (min-width: 641px) {
  .env-shell-root {
    --env-shell-chrome-stack-reserve: 7.5rem;
    --env-mobile-dock-reserve: 0px;
  }
}

.env-shell-wallpaper {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/*
 * WHY: Speed-dial / explorer context menus mount here; must beat \`.env-shell-chrome\`
 * (taskbar + mobile Home nav) which uses \`$z-shell-chrome\`.
 */
.env-shell-overlays,
[data-env-shell-overlays] {
  position: absolute;
  inset: 0;
  z-index: 2147483600;
  pointer-events: none;
  box-sizing: border-box;
}

.env-shell-workspace {
  position: relative;
  z-index: 1;
  min-block-size: 100dvb;
  inline-size: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* WHY: View roots fill the frame body edge-to-edge; inner spacing lives in each view (e.g. settings). */
.wf-view-host,
.wf-view-placeholder {
  box-sizing: border-box;
  min-block-size: 0;
  min-inline-size: 0;
  flex: 1 1 0%;
  margin: 0;
  padding: 0;
  /* WHY: Outer clip; inner views (AirPad, explorer) own scroll regions — avoids nested “whole window” scroll. */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.wf-view-host > .wf-mounted-view {
  flex: 1 1 0%;
  min-block-size: 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-self: stretch;
}

.wf-view-placeholder__title {
  font: 600 1rem/1.3 system-ui, sans-serif;
  margin: 0 0 0.5rem;
}

.wf-view-placeholder__hint {
  margin: 0;
  opacity: 0.75;
  font: 400 0.875rem/1.4 system-ui, sans-serif;
}

/* WHY: Window frames participate in the same workspace stack as home; border tweak only (z comes from model + \`--env-window-z-boost\`). */
.env-shell-workspace .wf-frame,
.env-shell-workspace ui-window.env-ui-window {
  border-color: color-mix(in oklch, var(--wf-md-outline-variant, oklch(100% 0.02 280deg / 0.12)) 130%, transparent);
}

/* WHY: ui-window content slot must fill chrome body for mounted CWSP views. */
.env-shell-workspace ui-window.env-ui-window {
  --env-window-z-boost: var(--env-window-z-boost, 0);
  /* WHY: stay above home launcher hit-testing; chrome/title drag needs auto. */
  pointer-events: auto;
}

/* DWM maximize: fill workspace with inset (inline geometry also set in mount-ui-window). */
.env-shell-workspace ui-window.env-ui-window[data-desk-max],
.env-shell-workspace ui-window.env-ui-window[maximized]:not([data-mobile-max]) {
  box-sizing: border-box;
}

.env-shell-workspace .env-ui-window__body,
.env-shell-workspace .env-ui-window__view-host,
.env-shell-workspace .wf-mounted-view {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 100%;
  min-block-size: 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 0;
  /*
   * WHY: ui-window host can carry inline \`pointer-events: none\` (setVisible) or inherit it
   * from a constructed sheet; the view-host chain must stay hit-targetable so settings tabs,
   * explorer rows, etc. remain clickable when embedded.
   */
  pointer-events: auto;
}

/* Home launcher fills workspace under floating windows. */
.env-shell-home-mount,
.env-shell-workspace .view-home,
.env-shell-workspace .env-home-workspace,
.env-shell-workspace .speed-dial-root {
  flex: 1 1 auto;
  min-block-size: 0;
  min-inline-size: 0;
  inline-size: 100%;
  block-size: 100%;
}

/*
 * WHY: \`.wf-frame-body\` / ui-window content may composite above the title row and swallow
 * pointer events (settings drag + chrome clicks). Keep chrome above the body.
 */
.env-shell-workspace .wf-frame .wf-titlebar,
.env-shell-workspace ui-window.env-ui-window::part(title-handler) {
  position: relative;
  z-index: 50;
  pointer-events: auto;
}

.env-shell-workspace .wf-frame .wf-frame-body,
.env-shell-workspace ui-window.env-ui-window::part(content-handler) {
  position: relative;
  z-index: 0;
  /* Mirror Windows2: trap fixed/absolute slotted paint inside the body. */
  transform: translateZ(0);
  contain: paint;
}

.env-shell-workspace .wf-frame .wf-resize,
.env-shell-workspace ui-window.env-ui-window::part(resizer) {
  z-index: 4;
  pointer-events: auto;
}

/* WHY: Match window-frame print reset — flex + \`overflow: hidden\` hosts must not trap paginated prose. */
@media print {
  .wf-view-host,
  .wf-view-host > .wf-mounted-view {
    display: block !important;
    overflow: visible !important;
    flex: none !important;
    align-self: stretch !important;
    max-block-size: none !important;
    min-block-size: 0 !important;
    block-size: auto !important;
  }
}
/* Workspace is the flex stack for home + floating \`.wf-frame\`; padding/safe-area live in \`home-view\` SCSS. */
.env-shell-workspace {
  padding: 0;
}

/*
 * Filename: chrome.scss
 * FullPath: modules/shells/environment-shell/src/scss/chrome.scss
 * Change date and time: 17.46.00_30.07.2026
 * Reason for changes: Acrylic desktop taskbar; transparent mobile; icon-only desktop tasks; clock.
 */
/* Fixed chrome: taskbar (desktop + mobile dock) + FL-UI \`ui-statusbar\` (desktop meta). */
.env-shell-chrome {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  z-index: 2147483000;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 0;
  font: 12px ui-sans-serif, system-ui, sans-serif;
  color: var(--wf-md-on-surface-variant, oklch(78% 0.03 274deg));
  pointer-events: none;
}

.env-shell-chrome > * {
  pointer-events: auto;
}

/*
 * Taskbar base (desktop Win10 acrylic + mobile transparent dock share the same host).
 * Soft elevation: \`.env-shell-taskbar-under\` (UnderlyingShadow) — not box-shadow on blur host.
 */
.env-shell-taskbar {
  order: 0;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 0.15rem;
  block-size: 2.5rem;
  min-block-size: 2.5rem;
  padding: 0 0.25rem;
  padding-block-end: env(safe-area-inset-bottom, 0);
  background: color-mix(in oklab, #1a1a1a 72%, transparent);
  border-block-start: 1px solid color-mix(in oklab, #fff 12%, transparent);
  backdrop-filter: blur(22px) saturate(1.35);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  color: #f3f3f3;
  box-shadow: none;
}

.env-shell-taskbar-under.underlying-shadow-container,
.env-shell-taskbar-under {
  pointer-events: none !important;
  overflow: visible !important;
  z-index: -1 !important;
}

.env-shell-taskbar-under .underlying-shadow-geometry {
  background: transparent !important;
  box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.4) !important;
}

.env-shell-taskbar::part(taskbar) {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 0.15rem;
  flex: 1;
  min-inline-size: 0;
  inline-size: 100%;
}

.env-shell-taskbar__pins,
.env-shell-taskbar__windows {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 0;
  min-inline-size: 0;
}

.env-shell-taskbar__pins {
  flex: 0 0 auto;
}

.env-shell-taskbar__windows {
  flex: 1 1 auto;
  justify-content: flex-start;
  overflow-x: auto;
  scrollbar-width: thin;
}

.env-shell-taskbar ui-task {
  cursor: pointer;
  color: inherit;
  align-self: stretch;
  min-inline-size: 2.75rem;
  min-block-size: 100%;
  padding-inline: 0.55rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  outline: none;
  opacity: 1;
  /* Active underline via inset shadow so we don't fight ui-task border tokens. */
  box-shadow: inset 0 -2px 0 transparent;
}

.env-shell-taskbar ui-task:hover {
  background: color-mix(in oklab, #fff 10%, transparent);
  opacity: 1;
}

.env-shell-taskbar ui-task[data-env-active=true],
.env-shell-taskbar ui-task[data-active],
.env-shell-taskbar ui-task[data-focus] {
  outline: none;
  opacity: 1;
  background: color-mix(in oklab, #fff 14%, transparent);
  box-shadow: inset 0 -2px 0 #60cdff;
}

.env-shell-taskbar ui-task[data-minimized] {
  opacity: 0.65;
}

.env-shell-taskbar__tray-host {
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 0.35rem;
  padding-inline: 0.35rem;
  border-inline-start: 1px solid color-mix(in oklab, #fff 12%, transparent);
}

.env-shell-taskbar__clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.05rem;
  min-inline-size: 4.5rem;
  padding-inline: 0.35rem 0.15rem;
  line-height: 1.05;
  user-select: none;
  pointer-events: none;
}

.env-shell-taskbar__clock-time {
  font-size: 0.78rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: #f3f3f3;
}

.env-shell-taskbar__clock-date {
  font-size: 0.62rem;
  font-weight: 500;
  color: color-mix(in oklab, #f3f3f3 72%, transparent);
  white-space: nowrap;
}

/* Desktop: icon-only tasks (tooltip via title / aria-label). */
.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(title) {
  display: none !important;
}

.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task {
  min-inline-size: 2.5rem;
  padding-inline: 0.45rem;
}

.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(icon) {
  inline-size: 1.35rem;
  block-size: 1.35rem;
}

.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(glyph) {
  inline-size: 1.35rem;
  block-size: 1.35rem;
}

.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(letter) {
  font-size: 0.8rem;
}

/* Desktop: Home pin is redundant (empty bar / menu → Show desktop). */
.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home] {
  display: none !important;
}

/*
 * Mobile nav bar: fully transparent; centered house icon only.
 * Long-press Home → \`.env-shell-navbar__switcher\` (open processes).
 */
.env-shell-chrome:not([data-desktop]) .env-shell-taskbar {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0;
  block-size: 3rem;
  min-block-size: 3rem;
  padding: 0.15rem 0.75rem;
  padding-block-end: calc(0.15rem + env(safe-area-inset-bottom, 0px));
  background: transparent;
  border-block-start: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar-under {
  display: none !important;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins {
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins ui-task:not([data-env-home]) {
  display: none !important;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__windows {
  display: none !important;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host {
  display: none !important;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home] {
  min-inline-size: 2.75rem;
  min-block-size: 2.75rem;
  padding: 0;
  border-radius: 999px;
  background: transparent;
  box-shadow: none;
  touch-action: manipulation;
  -webkit-user-select: none;
  user-select: none;
}

/* Icon-only Home (hide task title label). */
.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(title) {
  display: none !important;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(icon) {
  inline-size: 1.5rem;
  block-size: 1.5rem;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]:hover,
.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]:active {
  background: color-mix(in oklch, #fff 10%, transparent);
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-env-active=true],
.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-active],
.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-focus] {
  background: color-mix(in oklch, #fff 8%, transparent);
  box-shadow: inset 0 -2px 0 #60cdff;
}

/* Long-press process switcher sheet above the nav bar. */
.env-shell-navbar__switcher {
  position: absolute;
  inset-inline: 0.75rem;
  inset-block-end: calc(100% + 0.4rem);
  z-index: 5;
  max-block-size: min(50dvb, 20rem);
  overflow: auto;
  padding: 0.35rem;
  border-radius: 0.85rem;
  background: color-mix(in oklch, #1c1c1e 96%, transparent);
  border: 1px solid color-mix(in oklch, #fff 12%, transparent);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  color: #f2f2f7;
}

.env-shell-navbar__switcher[hidden] {
  display: none !important;
}

.env-shell-navbar__switcher-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.env-shell-navbar__switcher-empty {
  padding: 0.75rem 0.85rem;
  font: 400 0.8125rem/1.3 system-ui, sans-serif;
  opacity: 0.72;
  text-align: center;
}

.env-shell-navbar__switcher-item {
  appearance: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  margin: 0;
  padding: 0.65rem 0.75rem;
  border: 0;
  border-radius: 0.65rem;
  background: transparent;
  color: inherit;
  font: 500 0.875rem/1.25 system-ui, sans-serif;
  text-align: start;
  cursor: pointer;
}

.env-shell-navbar__switcher-item:hover,
.env-shell-navbar__switcher-item:focus-visible {
  outline: none;
  background: color-mix(in oklch, #fff 10%, transparent);
}

.env-shell-navbar__switcher-item[data-active] {
  background: color-mix(in oklch, #60cdff 18%, transparent);
}

.env-shell-navbar__switcher-item ui-icon {
  flex: 0 0 auto;
  --icon-size: 1.25rem;
  inline-size: 1.25rem;
  block-size: 1.25rem;
}

/* Mobile: statusbar meta is redundant — nav owns Home. */
.env-shell-chrome:not([data-desktop]) .env-ui-statusbar {
  display: none !important;
}

.env-ui-statusbar {
  order: 1;
  padding: 0.35rem 0.65rem calc(0.35rem + env(safe-area-inset-bottom, 0));
  background: color-mix(in oklch, oklch(14% 0.02 280deg) 82%, transparent);
  border-block-start: 1px solid var(--wf-md-outline-variant, color-mix(in oklch, white 12%, transparent));
  backdrop-filter: blur(10px);
}

.env-ui-statusbar__intro p {
  margin: 0.1rem 0;
  opacity: 0.92;
}

.env-ui-statusbar__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.env-status-bar__tray {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.env-status-bar__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.12rem 0.35rem;
  border-radius: 999px;
  background: color-mix(in oklch, var(--wf-md-on-surface, white) 8%, transparent);
  border: 1px solid var(--wf-md-outline-variant, color-mix(in oklch, white 10%, transparent));
  line-height: 1;
}

.env-status-bar__chip ui-icon {
  font-size: 1.15rem;
  display: block;
}

.env-status-bar__pct {
  font-variant-numeric: tabular-nums;
  opacity: 0.95;
}

.env-status-bar__meta {
  margin: 0;
  opacity: 0.88;
  font-size: 11px;
}

/*
 * WHY: Desktop native-mode (WCO) hides env chrome. On mobile the Home dock must stay —
 * it is the only leave-view control (no title Close).
 */
.env-shell-root[data-env-native-task] .env-shell-chrome[data-desktop],
env-shell-container[data-env-native-task] .env-shell-chrome[data-desktop] {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/*
 * Device tray placement:
 * - Desktop: tray lives in the Win10 taskbar; hide the statusbar footer copy.
 * - Mobile: no Wi‑Fi/battery in the Home dock (OS status bar covers that).
 */
@media (min-width: 641px) {
  .env-device-tray--footer {
    display: none !important;
  }
}
.env-shell-chrome[data-desktop] .env-device-tray--footer {
  display: none !important;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host,
.env-shell-chrome:not([data-desktop]) .env-device-tray--taskbar,
.env-shell-chrome:not([data-desktop]) .env-device-tray--footer {
  display: none !important;
}

/* Reserved: start-menu / app-launcher host (mount beside taskbar or slide-over).
   Example: <div class="env-shell-app-menu" hidden>…</div> */
.env-shell-app-menu {
  /* Placeholder keeps selector stable for future SCSS without empty ruleset warnings. */
  pointer-events: auto;
}

.env-shell-app-menu:empty {
  display: none;
}

/* COMPAT: Extension / embed hosts may set \`data-env-crx="1"\` and extend in their bundle. */
.env-shell-root[data-env-crx="1"] {
  isolation: isolate;
}`}));function Ec(){try{let e=new URLSearchParams(globalThis.location?.search||``);if(e.get(`native`)!==`1`&&e.get(`native`)!==`true`)return[];let t=(e.get(`view`)||``).trim().toLowerCase(),n=String(globalThis.location?.pathname||``).replace(/^\/+|\/+$/g,``).toLowerCase(),r=t||n||`explorer`;return!r||r===`home`?[`explorer`]:[r===`markdown`?`viewer`:r]}catch{return[]}}function Dc(e){let t=e||{};return t.native===1||t.native===`1`||t.native===!0||t.params?.native===`1`||t.params?.native===`true`}function Oc(e,t){if(!Ec().includes(e)&&!Dc(t))return t||{};let n={...t||{}};return n.native=`1`,n.params={...n.params||{},native:`1`},n}async function kc(){try{let e=await _(()=>import(`./launcher-state-BikXjy0_.js`),[],import.meta.url),t=e.speedDialItems;if(!t||typeof t.findIndex!=`function`)return;let n=!1;for(let e=t.length-1;e>=0;e--){let r=t[e],i=String(r?.meta?.view||``).toLowerCase(),a=String(r?.id||``).toLowerCase();(i===`airpad`||a.includes(`airpad`))&&(t.splice(e,1),n=!0)}let r=(n,r,i,a,o)=>{!y(o)&&o!==`home`||t.find?.(e=>String(e?.id)===n||String(e?.meta?.view||``).toLowerCase()===o)||e.addSpeedDialItem({id:n,cell:d(r),icon:i,label:a,action:`open-view`,meta:{view:o}})};r(`shortcut-network`,[0,0],`wifi-high`,`Network`,`network`),r(`shortcut-settings`,[1,0],`gear-six`,`Settings`,`settings`),r(`shortcut-explorer`,[2,0],`books`,`Explorer`,`explorer`),r(`shortcut-viewer`,[3,0],`article`,`Markdown`,`viewer`),r(`shortcut-history`,[0,1],`clock-counter-clockwise`,`History`,`history`),n&&e.persistSpeedDialItems?.()}catch(e){console.warn(`[EnvironmentShell] speed-dial seed skipped`,e)}}function Ac(e){return new Nc}var jc,Mc,Nc,Pc=e((()=>{r(),c(),T(),Fo(),re(),k(),h(),v(),xc(),$s(),Cc(),Tc(),g(),js(),jc={network:()=>_(()=>import(`./src-CuoHoVds.js`),[],import.meta.url),settings:()=>_(()=>import(`./src-GP7zAE8u.js`),[],import.meta.url),explorer:()=>_(()=>import(`./_cwsp-disabled-entry_view-explorer-D-8MVImu.js`),[],import.meta.url),viewer:()=>_(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url),markdown:()=>_(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url),history:()=>_(()=>import(`./src-DXZdRG6d.js`),[],import.meta.url),workcenter:()=>_(()=>import(`./_cwsp-disabled-entry_view-workcenter-DV1PlEAR.js`),[],import.meta.url),editor:()=>_(()=>import(`./_cwsp-disabled-entry_view-editor-BtWewwh9.js`),[],import.meta.url),home:()=>_(()=>import(`./_cwsp-disabled-entry_view-home-gqgAY_Ff.js`),[],import.meta.url)},Mc=[`home`,`network`,`settings`,`explorer`,`viewer`,`history`,`workcenter`,`editor`],Nc=class extends ie{id=`environment`;name=`Environment`;layout={hasSidebar:!1,hasToolbar:!1,hasTabs:!1,supportsMultiView:!0,supportsWindowing:!0};workspaceEl=null;homeMountEl=null;windowLayer=null;chromeDispose=null;homeUnmount=null;shellActivityDispose=null;focusedTaskId=u(`home`);setFocusedTaskId=null;syncWindowTasks=null;navEcho=u(``);mqLabel=u(`desktop`);createLayout(){return document.createElement(`div`)}getStylesheet(){return wc}async mount(e){if(this.mounted){console.warn(`[${this.id}] Shell already mounted`);return}this.container=e,vc(`/assets/wallpaper.jpg`),js();try{await l(Sc),t(Sc)}catch(e){console.warn(`[EnvironmentShell] wf-demo tokens failed`,e)}let n=this.getStylesheet();if(n)try{await l(n),t(n)}catch(e){console.warn(`[EnvironmentShell] env shell styles failed`,e)}try{E()}catch{}try{document.documentElement.dataset.cwspSurface=`environment`}catch{}let r=Ms();r.className=`env-shell-root wf-demo-root`,r.setAttribute(`data-shell`,`environment`),r.setAttribute(`data-shell-system`,`task-tab`),r.style.gridColumn=`content-column`,r.style.gridRow=`content-row`,r.style.alignSelf=`stretch`,r.style.justifySelf=`stretch`,r.style.minInlineSize=`0`,r.style.minBlockSize=`0`,r.style.inlineSize=`100%`,r.style.blockSize=`100%`,r.style.pointerEvents=`auto`;let i=document.createElement(`div`);i.slot=O.underlying,i.className=`env-shell-wallpaper`,i.setAttribute(`data-env-wallpaper`,``);let a=document.createElement(`div`);a.className=`env-shell-workspace`,a.setAttribute(`data-shell-content`,``);let o=document.createElement(`div`);o.className=`env-shell-home-mount`,o.style.display=`flex`,o.style.flex=`1 1 auto`,o.style.flexDirection=`column`,o.style.alignSelf=`stretch`,o.style.minHeight=`0`,o.style.minWidth=`0`,a.appendChild(o),r.append(i,a),e.replaceChildren(r),this.rootElement=r,this.workspaceEl=a,this.homeMountEl=o,this.contentContainer=a,this.overlayContainer=r.overlayMount??r.shadowRoot?.querySelector?.(`[data-shell-overlays]`)??null,this.mounted=!0,this.shellActivityDispose=m(this.id);try{C(i)}catch(e){console.warn(`[EnvironmentShell] wallpaper init failed`,e)}let s={};for(let e of Mc){if(e===`home`||!y(e)&&e!==`viewer`)continue;let t=jc[e];t&&(s[e]=t)}s.viewer&&(s.markdown=s.viewer);let c=matchMedia(`(max-width: 640px)`);this.mqLabel.value=c.matches?`mobile`:`desktop`,c.addEventListener(`change`,()=>{this.mqLabel.value=c.matches?`mobile`:`desktop`});let d=yc(r,{shell:{selectedPath:u(``),viewerStatus:u(``),navEcho:this.navEcho,mqLabel:this.mqLabel},introHtml:`<p><strong>CWSP environment</strong> — Speed Dial / desktop launcher. Views open in <code>ui-window</code>.</p>`,taskbar:{focusedTaskId:this.focusedTaskId,onHome:()=>this.focusHome(),onViewer:()=>{this.openInWindow(`viewer`)},onWindowTask:e=>{this.openInWindow(e)},onMinimizeWindow:e=>{let t=String(e||``).trim().toLowerCase();t&&this.windowLayer?.minimizeWindow?.(t)&&(this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`)},onCloseWindow:e=>{let t=String(e||``).trim().toLowerCase();t&&(this.windowLayer?.closeWindow?.(t),String(this.focusedTaskId.value||``)===t&&(this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`))}}});this.setFocusedTaskId=d.taskbar?.setFocusedTaskId??null,this.syncWindowTasks=d.taskbar?.syncWindowTasks??null,this.chromeDispose=()=>{d.disposeDevice(),d.taskbar?.dispose?.(),d.root.remove()};let f=Ec();this.windowLayer=mc(a,{overlayMountHost:r,environmentShellHost:r,viewLoaders:s,startNativeViewIds:f,viewTitles:{network:`Network`,settings:`Settings`,explorer:`Explorer`,viewer:`Markdown`,history:`History`,workcenter:`Work Center`,editor:`Editor`},onTaskingChange:e=>{this.syncWindowTasks?.(e);let t=e.find(e=>e.focused);t&&this.setFocusedTaskId?.(t.id)}});let p={...this.windowLayer.shellContext,navigate:(e,t)=>{this.navEcho.value=`shell.navigate("${e}")`,this.routeView(String(e),t)},openView:(e,t)=>{this.navEcho.value=`shell.openView("${e}")`,this.routeView(String(e),t)},showMessage:e=>{this.showMessage(typeof e==`string`?e:String(e??``))}};kc(),Qs(()=>_(()=>import(`./_cwsp-disabled-entry_view-home-gqgAY_Ff.js`),[],import.meta.url),o,{shellContext:p}).then(e=>{this.homeUnmount=e}).catch(e=>{console.warn(`[EnvironmentShell] home-view failed`,e),o.innerHTML=`<p style="color:#eee;padding:1rem;font-family:system-ui">Home view failed to load.</p>`})}focusHome(){typeof matchMedia==`function`&&matchMedia(`(max-width: 640px)`).matches?this.windowLayer?.closeAllWindows?.():this.windowLayer?.blurWindows?.(),this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`,this.currentView.value=`home`}openInWindow(e,t){let n=String(e||``).trim().toLowerCase();if(!n||n===`airpad`)return;let r=Oc(n,t);this.windowLayer?.focusWindow(n)?Dc(r)&&this.windowLayer?.enterNative?.(n):this.windowLayer?.shellContext.openView?.(n,r),this.setFocusedTaskId?.(n===`markdown`?`viewer`:n),this.currentView.value=n}async routeView(e,t){let n=String(e||``).trim().toLowerCase();if(!(!n||n===`airpad`)){if(n===`home`){this.focusHome();return}this.openInWindow(n,t)}}async navigate(e,t,n){let r=String(e||`home`).toLowerCase();if(r===`airpad`){this.showMessage(`AirPad view is disabled in environment shell`);return}if(r===`home`){this.focusHome();try{let e=new URLSearchParams(t||{});e.set(`shell`,this.id);let n=e.toString()?`?${e.toString()}`:``,r=`${location.pathname}${n}`;`${location.pathname}${location.search}`!==r&&history.replaceState({viewId:`home`,params:t},``,r)}catch{}return}this.openInWindow(r,t?{params:t}:void 0)}unmount(){try{this.homeUnmount?.()}catch{}this.homeUnmount=null;try{this.windowLayer?.dispose()}catch{}this.windowLayer=null;try{this.chromeDispose?.()}catch{}this.chromeDispose=null;try{this.shellActivityDispose?.()}catch{}if(this.shellActivityDispose=null,this.mounted&&this.container&&this.rootElement)try{this.container.contains(this.rootElement)&&this.rootElement.remove()}catch{}this.rootElement=null,this.contentContainer=null,this.overlayContainer=null,this.workspaceEl=null,this.homeMountEl=null,this.container=null,this.mounted=!1}}}));export{Ac as n,Pc as r,Nc as t};