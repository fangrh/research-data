"use strict";(()=>{var zm=Object.create;var Ed=Object.defineProperty;var Vm=Object.getOwnPropertyDescriptor;var Hm=Object.getOwnPropertyNames;var Gm=Object.getPrototypeOf,Wm=Object.prototype.hasOwnProperty;var xr=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports);var Xm=(n,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of Hm(e))!Wm.call(n,s)&&s!==t&&Ed(n,s,{get:()=>e[s],enumerable:!(i=Vm(e,s))||i.enumerable});return n};var $m=(n,e,t)=>(t=n!=null?zm(Gm(n)):{},Xm(e||!n||!n.__esModule?Ed(t,"default",{value:n,enumerable:!0}):t,n));var Ud=xr((dS,Od)=>{Od.exports=ag;var eh={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},og=/([astvzqmhlc])([^astvzqmhlc]*)/ig;function ag(n){var e=[];return n.replace(og,function(t,i,s){var r=i.toLowerCase();for(s=cg(s),r=="m"&&s.length>2&&(e.push([i].concat(s.splice(0,2))),r="l",i=i=="m"?"l":"L");;){if(s.length==eh[r])return s.unshift(i),e.push(s);if(s.length<eh[r])throw new Error("malformed path data");e.push([i].concat(s.splice(0,eh[r])))}}),e}var lg=/-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;function cg(n){var e=n.match(lg);return e?e.map(Number):[]}});var kd=xr((fS,Fd)=>{Fd.exports=hg;function hg(n){var e=0,t=0,i=0,s=0;return n.map(function(r){r=r.slice();var o=r[0],a=o.toUpperCase();if(o!=a)switch(r[0]=a,o){case"a":r[6]+=i,r[7]+=s;break;case"v":r[1]+=s;break;case"h":r[1]+=i;break;default:for(var l=1;l<r.length;)r[l++]+=i,r[l++]+=s}switch(a){case"Z":i=e,s=t;break;case"H":i=r[1];break;case"V":s=r[1];break;case"M":i=e=r[1],s=t=r[2];break;default:i=r[r.length-2],s=r[r.length-1]}return r})}});var Vd=xr((xa,zd)=>{"use strict";Object.defineProperty(xa,"__esModule",{value:!0});var ug=(function(){function n(e,t){var i=[],s=!0,r=!1,o=void 0;try{for(var a=e[Symbol.iterator](),l;!(s=(l=a.next()).done)&&(i.push(l.value),!(t&&i.length===t));s=!0);}catch(c){r=!0,o=c}finally{try{!s&&a.return&&a.return()}finally{if(r)throw o}}return i}return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return n(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}})(),_o=Math.PI*2,th=function(e,t,i,s,r,o,a){var l=e.x,c=e.y;l*=t,c*=i;var h=s*l-r*c,d=r*l+s*c;return{x:h+o,y:d+a}},dg=function(e,t){var i=t===1.5707963267948966?.551915024494:t===-1.5707963267948966?-.551915024494:1.3333333333333333*Math.tan(t/4),s=Math.cos(e),r=Math.sin(e),o=Math.cos(e+t),a=Math.sin(e+t);return[{x:s-r*i,y:r+s*i},{x:o+a*i,y:a-o*i},{x:o,y:a}]},Bd=function(e,t,i,s){var r=e*s-t*i<0?-1:1,o=e*i+t*s;return o>1&&(o=1),o<-1&&(o=-1),r*Math.acos(o)},fg=function(e,t,i,s,r,o,a,l,c,h,d,u){var p=Math.pow(r,2),g=Math.pow(o,2),y=Math.pow(d,2),f=Math.pow(u,2),m=p*g-p*f-g*y;m<0&&(m=0),m/=p*f+g*y,m=Math.sqrt(m)*(a===l?-1:1);var x=m*r/o*u,v=m*-o/r*d,M=h*x-c*v+(e+i)/2,T=c*x+h*v+(t+s)/2,E=(d-x)/r,A=(u-v)/o,_=(-d-x)/r,w=(-u-v)/o,V=Bd(1,0,E,A),C=Bd(E,A,_,w);return l===0&&C>0&&(C-=_o),l===1&&C<0&&(C+=_o),[M,T,V,C]},pg=function(e){var t=e.px,i=e.py,s=e.cx,r=e.cy,o=e.rx,a=e.ry,l=e.xAxisRotation,c=l===void 0?0:l,h=e.largeArcFlag,d=h===void 0?0:h,u=e.sweepFlag,p=u===void 0?0:u,g=[];if(o===0||a===0)return[];var y=Math.sin(c*_o/360),f=Math.cos(c*_o/360),m=f*(t-s)/2+y*(i-r)/2,x=-y*(t-s)/2+f*(i-r)/2;if(m===0&&x===0)return[];o=Math.abs(o),a=Math.abs(a);var v=Math.pow(m,2)/Math.pow(o,2)+Math.pow(x,2)/Math.pow(a,2);v>1&&(o*=Math.sqrt(v),a*=Math.sqrt(v));var M=fg(t,i,s,r,o,a,d,p,y,f,m,x),T=ug(M,4),E=T[0],A=T[1],_=T[2],w=T[3],V=Math.abs(w)/(_o/4);Math.abs(1-V)<1e-7&&(V=1);var C=Math.max(Math.ceil(V),1);w/=C;for(var O=0;O<C;O++)g.push(dg(_,w)),_+=w;return g.map(function(k){var D=th(k[0],o,a,f,y,E,A),N=D.x,H=D.y,z=th(k[1],o,a,f,y,E,A),K=z.x,j=z.y,le=th(k[2],o,a,f,y,E,A),pe=le.x,he=le.y;return{x1:N,y1:H,x2:K,y2:j,x:pe,y:he}})};xa.default=pg;zd.exports=xa.default});var Wd=xr((pS,Gd)=>{"use strict";Gd.exports=gg;var mg=Vd();function gg(n){for(var e,t=[],i=0,s=0,r=0,o=0,a=null,l=null,c=0,h=0,d=0,u=n.length;d<u;d++){var p=n[d],g=p[0];switch(g){case"M":r=p[1],o=p[2];break;case"A":var y=mg({px:c,py:h,cx:p[6],cy:p[7],rx:p[1],ry:p[2],xAxisRotation:p[3],largeArcFlag:p[4],sweepFlag:p[5]});if(!y.length)continue;for(var f=0,m;f<y.length;f++)m=y[f],p=["C",m.x1,m.y1,m.x2,m.y2,m.x,m.y],f<y.length-1&&t.push(p);break;case"S":var x=c,v=h;(e=="C"||e=="S")&&(x+=x-i,v+=v-s),p=["C",x,v,p[1],p[2],p[3],p[4]];break;case"T":e=="Q"||e=="T"?(a=c*2-a,l=h*2-l):(a=c,l=h),p=Hd(c,h,a,l,p[1],p[2]);break;case"Q":a=p[1],l=p[2],p=Hd(c,h,p[1],p[2],p[3],p[4]);break;case"L":p=_a(c,h,p[1],p[2]);break;case"H":p=_a(c,h,p[1],h);break;case"V":p=_a(c,h,c,p[1]);break;case"Z":p=_a(c,h,r,o);break}e=g,c=p[p.length-2],h=p[p.length-1],p.length>4?(i=p[p.length-4],s=p[p.length-3]):(i=c,s=h),t.push(p)}return t}function _a(n,e,t,i){return["C",n,e,t,i,t,i]}function Hd(n,e,t,i,s,r){return["C",n/3+2/3*t,e/3+2/3*i,s/3+2/3*t,r/3+2/3*i,s,r]}});var $d=xr((mS,Xd)=>{"use strict";Xd.exports=function(e){return typeof e!="string"?!1:(e=e.trim(),!!(/^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(e)&&/[\dz]$/i.test(e)&&e.length>4))}});var Yd=xr((gS,qd)=>{"use strict";var yg=Ud(),xg=kd(),_g=Wd(),vg=$d();qd.exports=bg;function bg(n){if(Array.isArray(n)&&n.length===1&&typeof n[0]=="string"&&(n=n[0]),typeof n=="string"){if(!vg(n))throw Error("String is not an SVG path.");n=yg(n)}if(!Array.isArray(n))throw Error("Argument should be a string or an array of path segments.");if(n=xg(n),n=_g(n),!n.length)return[0,0,0,0];for(var e=[1/0,1/0,-1/0,-1/0],t=0,i=n.length;t<i;t++)for(var s=n[t].slice(1),r=0;r<s.length;r+=2)s[r+0]<e[0]&&(e[0]=s[r+0]),s[r+1]<e[1]&&(e[1]=s[r+1]),s[r+0]>e[2]&&(e[2]=s[r+0]),s[r+1]>e[3]&&(e[3]=s[r+1]);return e}});function ma(n,e=!1){let t=n.length,i=0,s="",r=0,o=16,a=0,l=0,c=0,h=0,d=0;function u(v,M){let T=0,E=0;for(;T<v||!M;){let A=n.charCodeAt(i);if(A>=48&&A<=57)E=E*16+A-48;else if(A>=65&&A<=70)E=E*16+A-65+10;else if(A>=97&&A<=102)E=E*16+A-97+10;else break;i++,T++}return T<v&&(E=-1),E}function p(v){i=v,s="",r=0,o=16,d=0}function g(){let v=i;if(n.charCodeAt(i)===48)i++;else for(i++;i<n.length&&_r(n.charCodeAt(i));)i++;if(i<n.length&&n.charCodeAt(i)===46)if(i++,i<n.length&&_r(n.charCodeAt(i)))for(i++;i<n.length&&_r(n.charCodeAt(i));)i++;else return d=3,n.substring(v,i);let M=i;if(i<n.length&&(n.charCodeAt(i)===69||n.charCodeAt(i)===101))if(i++,(i<n.length&&n.charCodeAt(i)===43||n.charCodeAt(i)===45)&&i++,i<n.length&&_r(n.charCodeAt(i))){for(i++;i<n.length&&_r(n.charCodeAt(i));)i++;M=i}else d=3;return n.substring(v,M)}function y(){let v="",M=i;for(;;){if(i>=t){v+=n.substring(M,i),d=2;break}let T=n.charCodeAt(i);if(T===34){v+=n.substring(M,i),i++;break}if(T===92){if(v+=n.substring(M,i),i++,i>=t){d=2;break}switch(n.charCodeAt(i++)){case 34:v+='"';break;case 92:v+="\\";break;case 47:v+="/";break;case 98:v+="\b";break;case 102:v+="\f";break;case 110:v+=`
`;break;case 114:v+="\r";break;case 116:v+="	";break;case 117:let A=u(4,!0);A>=0?v+=String.fromCharCode(A):d=4;break;default:d=5}M=i;continue}if(T>=0&&T<=31)if(yo(T)){v+=n.substring(M,i),d=2;break}else d=6;i++}return v}function f(){if(s="",d=0,r=i,l=a,h=c,i>=t)return r=t,o=17;let v=n.charCodeAt(i);if(Jc(v)){do i++,s+=String.fromCharCode(v),v=n.charCodeAt(i);while(Jc(v));return o=15}if(yo(v))return i++,s+=String.fromCharCode(v),v===13&&n.charCodeAt(i)===10&&(i++,s+=`
`),a++,c=i,o=14;switch(v){case 123:return i++,o=1;case 125:return i++,o=2;case 91:return i++,o=3;case 93:return i++,o=4;case 58:return i++,o=6;case 44:return i++,o=5;case 34:return i++,s=y(),o=10;case 47:let M=i-1;if(n.charCodeAt(i+1)===47){for(i+=2;i<t&&!yo(n.charCodeAt(i));)i++;return s=n.substring(M,i),o=12}if(n.charCodeAt(i+1)===42){i+=2;let T=t-1,E=!1;for(;i<T;){let A=n.charCodeAt(i);if(A===42&&n.charCodeAt(i+1)===47){i+=2,E=!0;break}i++,yo(A)&&(A===13&&n.charCodeAt(i)===10&&i++,a++,c=i)}return E||(i++,d=1),s=n.substring(M,i),o=13}return s+=String.fromCharCode(v),i++,o=16;case 45:if(s+=String.fromCharCode(v),i++,i===t||!_r(n.charCodeAt(i)))return o=16;case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return s+=g(),o=11;default:for(;i<t&&m(v);)i++,v=n.charCodeAt(i);if(r!==i){switch(s=n.substring(r,i),s){case"true":return o=8;case"false":return o=9;case"null":return o=7}return o=16}return s+=String.fromCharCode(v),i++,o=16}}function m(v){if(Jc(v)||yo(v))return!1;switch(v){case 125:case 93:case 123:case 91:case 34:case 58:case 44:case 47:return!1}return!0}function x(){let v;do v=f();while(v>=12&&v<=15);return v}return{setPosition:p,getPosition:()=>i,scan:e?x:f,getToken:()=>o,getTokenValue:()=>s,getTokenOffset:()=>r,getTokenLength:()=>i-r,getTokenStartLine:()=>l,getTokenStartCharacter:()=>r-h,getTokenError:()=>d}}function Jc(n){return n===32||n===9}function yo(n){return n===10||n===13}function _r(n){return n>=48&&n<=57}var Td;(function(n){n[n.lineFeed=10]="lineFeed",n[n.carriageReturn=13]="carriageReturn",n[n.space=32]="space",n[n._0=48]="_0",n[n._1=49]="_1",n[n._2=50]="_2",n[n._3=51]="_3",n[n._4=52]="_4",n[n._5=53]="_5",n[n._6=54]="_6",n[n._7=55]="_7",n[n._8=56]="_8",n[n._9=57]="_9",n[n.a=97]="a",n[n.b=98]="b",n[n.c=99]="c",n[n.d=100]="d",n[n.e=101]="e",n[n.f=102]="f",n[n.g=103]="g",n[n.h=104]="h",n[n.i=105]="i",n[n.j=106]="j",n[n.k=107]="k",n[n.l=108]="l",n[n.m=109]="m",n[n.n=110]="n",n[n.o=111]="o",n[n.p=112]="p",n[n.q=113]="q",n[n.r=114]="r",n[n.s=115]="s",n[n.t=116]="t",n[n.u=117]="u",n[n.v=118]="v",n[n.w=119]="w",n[n.x=120]="x",n[n.y=121]="y",n[n.z=122]="z",n[n.A=65]="A",n[n.B=66]="B",n[n.C=67]="C",n[n.D=68]="D",n[n.E=69]="E",n[n.F=70]="F",n[n.G=71]="G",n[n.H=72]="H",n[n.I=73]="I",n[n.J=74]="J",n[n.K=75]="K",n[n.L=76]="L",n[n.M=77]="M",n[n.N=78]="N",n[n.O=79]="O",n[n.P=80]="P",n[n.Q=81]="Q",n[n.R=82]="R",n[n.S=83]="S",n[n.T=84]="T",n[n.U=85]="U",n[n.V=86]="V",n[n.W=87]="W",n[n.X=88]="X",n[n.Y=89]="Y",n[n.Z=90]="Z",n[n.asterisk=42]="asterisk",n[n.backslash=92]="backslash",n[n.closeBrace=125]="closeBrace",n[n.closeBracket=93]="closeBracket",n[n.colon=58]="colon",n[n.comma=44]="comma",n[n.dot=46]="dot",n[n.doubleQuote=34]="doubleQuote",n[n.minus=45]="minus",n[n.openBrace=123]="openBrace",n[n.openBracket=91]="openBracket",n[n.plus=43]="plus",n[n.slash=47]="slash",n[n.formFeed=12]="formFeed",n[n.tab=9]="tab"})(Td||(Td={}));var Ym=new Array(20).fill(0).map((n,e)=>" ".repeat(e)),vr=200,Zm={" ":{"\n":new Array(vr).fill(0).map((n,e)=>`
`+" ".repeat(e)),"\r":new Array(vr).fill(0).map((n,e)=>"\r"+" ".repeat(e)),"\r\n":new Array(vr).fill(0).map((n,e)=>`\r
`+" ".repeat(e))},"	":{"\n":new Array(vr).fill(0).map((n,e)=>`
`+"	".repeat(e)),"\r":new Array(vr).fill(0).map((n,e)=>"\r"+"	".repeat(e)),"\r\n":new Array(vr).fill(0).map((n,e)=>`\r
`+"	".repeat(e))}};var ga;(function(n){n.DEFAULT={allowTrailingComma:!1}})(ga||(ga={}));function Kc(n,e=[],t=ga.DEFAULT){let i={type:"array",offset:-1,length:-1,children:[],parent:void 0};function s(l){i.type==="property"&&(i.length=l-i.offset,i=i.parent)}function r(l){return i.children.push(l),l}Ad(n,{onObjectBegin:l=>{i=r({type:"object",offset:l,length:-1,parent:i,children:[]})},onObjectProperty:(l,c,h)=>{i=r({type:"property",offset:c,length:-1,parent:i,children:[]}),i.children.push({type:"string",value:l,offset:c,length:h,parent:i})},onObjectEnd:(l,c)=>{s(l+c),i.length=l+c-i.offset,i=i.parent,s(l+c)},onArrayBegin:(l,c)=>{i=r({type:"array",offset:l,length:-1,parent:i,children:[]})},onArrayEnd:(l,c)=>{i.length=l+c-i.offset,i=i.parent,s(l+c)},onLiteralValue:(l,c,h)=>{r({type:Jm(l),offset:c,length:h,parent:i,value:l}),s(c+h)},onSeparator:(l,c,h)=>{i.type==="property"&&(l===":"?i.colonOffset=c:l===","&&s(c))},onError:(l,c,h)=>{e.push({error:l,offset:c,length:h})}},t);let a=i.children[0];return a&&delete a.parent,a}function Ad(n,e,t=ga.DEFAULT){let i=ma(n,!1),s=[],r=0;function o(D){return D?()=>r===0&&D(i.getTokenOffset(),i.getTokenLength(),i.getTokenStartLine(),i.getTokenStartCharacter()):()=>!0}function a(D){return D?N=>r===0&&D(N,i.getTokenOffset(),i.getTokenLength(),i.getTokenStartLine(),i.getTokenStartCharacter()):()=>!0}function l(D){return D?N=>r===0&&D(N,i.getTokenOffset(),i.getTokenLength(),i.getTokenStartLine(),i.getTokenStartCharacter(),()=>s.slice()):()=>!0}function c(D){return D?()=>{r>0?r++:D(i.getTokenOffset(),i.getTokenLength(),i.getTokenStartLine(),i.getTokenStartCharacter(),()=>s.slice())===!1&&(r=1)}:()=>!0}function h(D){return D?()=>{r>0&&r--,r===0&&D(i.getTokenOffset(),i.getTokenLength(),i.getTokenStartLine(),i.getTokenStartCharacter())}:()=>!0}let d=c(e.onObjectBegin),u=l(e.onObjectProperty),p=h(e.onObjectEnd),g=c(e.onArrayBegin),y=h(e.onArrayEnd),f=l(e.onLiteralValue),m=a(e.onSeparator),x=o(e.onComment),v=a(e.onError),M=t&&t.disallowComments,T=t&&t.allowTrailingComma;function E(){for(;;){let D=i.scan();switch(i.getTokenError()){case 4:A(14);break;case 5:A(15);break;case 3:A(13);break;case 1:M||A(11);break;case 2:A(12);break;case 6:A(16);break}switch(D){case 12:case 13:M?A(10):x();break;case 16:A(1);break;case 15:case 14:break;default:return D}}}function A(D,N=[],H=[]){if(v(D),N.length+H.length>0){let z=i.getToken();for(;z!==17;){if(N.indexOf(z)!==-1){E();break}else if(H.indexOf(z)!==-1)break;z=E()}}}function _(D){let N=i.getTokenValue();return D?f(N):(u(N),s.push(N)),E(),!0}function w(){switch(i.getToken()){case 11:let D=i.getTokenValue(),N=Number(D);isNaN(N)&&(A(2),N=0),f(N);break;case 7:f(null);break;case 8:f(!0);break;case 9:f(!1);break;default:return!1}return E(),!0}function V(){return i.getToken()!==10?(A(3,[],[2,5]),!1):(_(!1),i.getToken()===6?(m(":"),E(),k()||A(4,[],[2,5])):A(5,[],[2,5]),s.pop(),!0)}function C(){d(),E();let D=!1;for(;i.getToken()!==2&&i.getToken()!==17;){if(i.getToken()===5){if(D||A(4,[],[]),m(","),E(),i.getToken()===2&&T)break}else D&&A(6,[],[]);V()||A(4,[],[2,5]),D=!0}return p(),i.getToken()!==2?A(7,[2],[]):E(),!0}function O(){g(),E();let D=!0,N=!1;for(;i.getToken()!==4&&i.getToken()!==17;){if(i.getToken()===5){if(N||A(4,[],[]),m(","),E(),i.getToken()===4&&T)break}else N&&A(6,[],[]);D?(s.push(0),D=!1):s[s.length-1]++,k()||A(4,[],[4,5]),N=!0}return y(),D||s.pop(),i.getToken()!==4?A(8,[4],[]):E(),!0}function k(){switch(i.getToken()){case 3:return O();case 1:return C();case 10:return _(!0);default:return w()}}return E(),i.getToken()===17?t.allowEmptyContent?!0:(A(4,[],[]),!1):k()?(i.getToken()!==17&&A(9,[],[]),!0):(A(4,[],[]),!1)}function Jm(n){switch(typeof n){case"boolean":return"boolean";case"number":return"number";case"string":return"string";case"object":{if(n){if(Array.isArray(n))return"array"}else return"null";return"object"}default:return"null"}}var Rd;(function(n){n[n.None=0]="None",n[n.UnexpectedEndOfComment=1]="UnexpectedEndOfComment",n[n.UnexpectedEndOfString=2]="UnexpectedEndOfString",n[n.UnexpectedEndOfNumber=3]="UnexpectedEndOfNumber",n[n.InvalidUnicode=4]="InvalidUnicode",n[n.InvalidEscapeCharacter=5]="InvalidEscapeCharacter",n[n.InvalidCharacter=6]="InvalidCharacter"})(Rd||(Rd={}));var Cd;(function(n){n[n.OpenBraceToken=1]="OpenBraceToken",n[n.CloseBraceToken=2]="CloseBraceToken",n[n.OpenBracketToken=3]="OpenBracketToken",n[n.CloseBracketToken=4]="CloseBracketToken",n[n.CommaToken=5]="CommaToken",n[n.ColonToken=6]="ColonToken",n[n.NullKeyword=7]="NullKeyword",n[n.TrueKeyword=8]="TrueKeyword",n[n.FalseKeyword=9]="FalseKeyword",n[n.StringLiteral=10]="StringLiteral",n[n.NumericLiteral=11]="NumericLiteral",n[n.LineCommentTrivia=12]="LineCommentTrivia",n[n.BlockCommentTrivia=13]="BlockCommentTrivia",n[n.LineBreakTrivia=14]="LineBreakTrivia",n[n.Trivia=15]="Trivia",n[n.Unknown=16]="Unknown",n[n.EOF=17]="EOF"})(Cd||(Cd={}));var Qc=Kc;var Id;(function(n){n[n.InvalidSymbol=1]="InvalidSymbol",n[n.InvalidNumberFormat=2]="InvalidNumberFormat",n[n.PropertyNameExpected=3]="PropertyNameExpected",n[n.ValueExpected=4]="ValueExpected",n[n.ColonExpected=5]="ColonExpected",n[n.CommaExpected=6]="CommaExpected",n[n.CloseBraceExpected=7]="CloseBraceExpected",n[n.CloseBracketExpected=8]="CloseBracketExpected",n[n.EndOfFileExpected=9]="EndOfFileExpected",n[n.InvalidCommentToken=10]="InvalidCommentToken",n[n.UnexpectedEndOfComment=11]="UnexpectedEndOfComment",n[n.UnexpectedEndOfString=12]="UnexpectedEndOfString",n[n.UnexpectedEndOfNumber=13]="UnexpectedEndOfNumber",n[n.InvalidUnicode=14]="InvalidUnicode",n[n.InvalidEscapeCharacter=15]="InvalidEscapeCharacter",n[n.InvalidCharacter=16]="InvalidCharacter"})(Id||(Id={}));var Ld=n=>n==="2d"?"x-right y-down; logical pixels; rotation radians about z":"right-handed x-right y-up z-toward-viewer; rotation XYZ Euler radians",br=()=>globalThis.crypto.randomUUID();function ya(n){return{schema:"three-interact.scene",version:1,id:br(),mode:n,units:n==="2d"?"px":"m",coordinates:Ld(n),elements:{}}}function hi(n,e,t=br()){let i={fill:"#60a5fa",opacity:1};switch(e==="2d"&&Object.assign(i,{stroke:"#1e3a5f",strokeWidth:2}),n){case"rect":Object.assign(i,{width:160,height:100});break;case"image":Object.assign(i,e==="3d"?{width:2,height:1.25}:{width:160,height:100});break;case"viewport3d":{let s=ya("3d"),r=hi("box","3d");s.elements[r.id]=r,Object.assign(i,{width:320,height:240,background:"#ffffff",scene:s});break}case"ellipse":Object.assign(i,{width:120,height:80});break;case"line":Object.assign(i,{points:[[0,0],[140,80]]});break;case"polyline":Object.assign(i,{points:[[0,80],[70,0],[140,80]],fill:"none"});break;case"path":Object.assign(i,{d:"M 0 80 Q 70 -40 140 80",fill:"none"});break;case"text":Object.assign(i,{text:"Text",fontSize:28,stroke:"none",strokeWidth:0});break;case"box":Object.assign(i,{width:1,height:1,depth:1});break;case"sphere":Object.assign(i,{radius:.6});break;case"cylinder":Object.assign(i,{radius:.5,height:1.2});break;case"plane":Object.assign(i,{width:2,height:2});break}return{id:t,name:n,type:n,visible:!0,locked:!1,transform:{position:[0,0,0],rotation:[0,0,0],scale:[1,1,1]},properties:i}}var Pd=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,ng=new Set(["rect","ellipse","line","polyline","path","text","image","viewport3d","group"]),ig=new Set(["box","sphere","cylinder","plane","image","group"]);function Pe(n,e){if(!n)throw new Error(e)}function sg(n){if(typeof n!="string"||n.length>1e5||!/^\s*[Mm]/.test(n))return!1;let e=/[MmZzLlHhVvCcSsQqTtAa]|[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g,t=[],i=0;for(let o of n.matchAll(e)){if(!/^[\s,]*$/.test(n.slice(i,o.index)))return!1;t.push(o[0]),i=o.index+o[0].length}if(!/^[\s,]*$/.test(n.slice(i)))return!1;let s={M:2,L:2,H:1,V:1,C:6,S:4,Q:4,T:2,A:7,Z:0},r=0;for(;r<t.length;){let o=t[r++].toUpperCase(),a=s[o];if(a===void 0)return!1;if(!a)continue;let l=0;for(;r<t.length&&!/^[a-z]$/i.test(t[r]);){let c=t.slice(r,r+a).map(Number);if(c.length!==a||!c.every(Number.isFinite)||o==="A"&&(c[0]<0||c[1]<0||![0,1].includes(c[3])||![0,1].includes(c[4])))return!1;r+=a,l++}if(!l)return!1}return t.length>0}function Yn(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}var es=n=>typeof n=="number"&&Number.isFinite(n);function rg(n){return n.length>0&&n.length<1024&&!n.includes("\\")&&!n.includes(":")&&!/[?#\x00-\x1f]/.test(n)&&!n.startsWith("/")&&n.split("/").every(e=>e!==".."&&e!=="."&&!!e)&&/\.(png|jpe?g)$/i.test(n)}function ts(n){Pe(Yn(n),"Scene must be a JSON object."),Pe(n.schema==="three-interact.scene"&&n.version===1,"Expected three-interact.scene version 1."),Pe(typeof n.id=="string"&&Pd.test(n.id),"Document id must be a UUID."),Pe(n.mode==="2d"||n.mode==="3d","Scene mode must be 2d or 3d."),Pe(n.coordinates===Ld(n.mode),"Coordinate convention does not match the scene mode."),Pe(typeof n.units=="string"&&n.units.length>0&&n.units.length<=32&&(n.mode!=="2d"||n.units==="px"),"2D units must be px; 3D units must be a nonempty label."),Pe(Yn(n.elements)&&Object.keys(n.elements).length<=1e4,"Elements must be an object containing at most 10000 elements.");let e=n.mode==="2d"?ng:ig,t=Object.keys(n.elements).length,i=0;for(let[s,r]of Object.entries(n.elements)){Pe(Pd.test(s)&&Yn(r)&&r.id===s,`Element key/id mismatch or invalid UUID: ${s}`),Pe(typeof r.name=="string"&&r.name.length<=512,`${s}: name must be text (max 512 characters).`),Pe(e.has(r.type),`${s}: unsupported ${n.mode} type ${r.type}.`),Pe(typeof r.visible=="boolean"&&typeof r.locked=="boolean",`${s}: visible and locked must be booleans.`),r.parent!==void 0&&Pe(typeof r.parent=="string"&&r.parent!==s&&n.elements[r.parent]?.type==="group",`${s}: parent must reference another group.`),Pe(Yn(r.transform),`${s}: transform is required.`);for(let l of["position","rotation","scale"]){let c=r.transform[l];Pe(Array.isArray(c)&&c.length===3&&c.every(es),`${s}: ${l} must contain three finite numbers.`)}Pe(r.transform.scale.every(l=>l>0),`${s}: scale must be positive.`),n.mode==="2d"&&Pe(r.transform.position[2]===0&&r.transform.rotation[0]===0&&r.transform.rotation[1]===0&&r.transform.scale[2]===1,`${s}: 2D transforms must stay on the XY plane.`),Pe(Yn(r.properties),`${s}: properties must be an object.`);let o=r.properties;for(let l of["width","height","depth","radius","fontSize"])o[l]!==void 0&&Pe(es(o[l])&&o[l]>0,`${s}: ${l} must be positive.`);o.strokeWidth!==void 0&&Pe(es(o.strokeWidth)&&o.strokeWidth>=0,`${s}: strokeWidth must be nonnegative.`),o.opacity!==void 0&&Pe(es(o.opacity)&&o.opacity>=0&&o.opacity<=1,`${s}: opacity must be between 0 and 1.`),o.textAnchor!==void 0&&Pe(o.textAnchor==="start"||o.textAnchor==="middle"||o.textAnchor==="end",`${s}: textAnchor must be start, middle or end.`),o.fontWeight!==void 0&&Pe(es(o.fontWeight)&&Number.isInteger(o.fontWeight)&&o.fontWeight>=100&&o.fontWeight<=900&&o.fontWeight%100===0,`${s}: fontWeight must be a numeric CSS weight from 100 to 900.`),o.fontFamily!==void 0&&Pe(o.fontFamily==="sans-serif"||o.fontFamily==="serif"||o.fontFamily==="monospace",`${s}: fontFamily must be sans-serif, serif or monospace.`);for(let l of["fill","stroke"])o[l]!==void 0&&Pe(typeof o[l]=="string"&&/^(#[0-9a-f]{3,8}|[a-z]+|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\))$/i.test(o[l]),`${s}: ${l} must be a color or none, not a resource URL.`);let a={rect:["width","height"],ellipse:["width","height"],image:["width","height"],viewport3d:["width","height"],box:["width","height","depth"],sphere:["radius"],cylinder:["radius","height"],plane:["width","height"],text:["fontSize"]};for(let l of a[r.type]||[])Pe(es(o[l])&&o[l]>0,`${s}: ${l} is required.`);(r.type==="line"||r.type==="polyline")&&Pe(Array.isArray(o.points)&&o.points.length>=2&&o.points.length<=1e4&&(r.type!=="line"||o.points.length===2)&&o.points.every(l=>Array.isArray(l)&&l.length===2&&l.every(es)),`${s}: points must contain valid XY coordinates.`),r.type==="path"&&Pe(sg(o.d),`${s}: path must contain SVG path commands only.`),r.type==="text"&&Pe(typeof o.text=="string"&&o.text.length<=1e5,`${s}: text is required (max 100000 characters).`),r.type==="image"&&Pe(typeof o.src=="string"&&rg(o.src),`${s}: image src must be a relative PNG/JPEG path without traversal.`),r.type==="viewport3d"&&(Pe(Yn(o.scene)&&o.scene.mode==="3d",`${s}: viewport requires an embedded 3D scene.`),ts(o.scene),t+=Object.keys(o.scene.elements).length,Pe(t<=1e4&&++i<=32,"Mixed figures support at most 10000 total elements and 32 3D viewports."),Pe(o.width<=1e4&&o.height<=1e4,`${s}: viewport dimensions must be at most 10000 pixels.`),o.background!==void 0&&Pe(typeof o.background=="string"&&/^#[0-9a-f]{6}$/i.test(o.background),`${s}: viewport background must be a hex color.`),o.camera!==void 0&&(Pe(Yn(o.camera)&&["position","target"].every(l=>Array.isArray(o.camera[l])&&o.camera[l].length===3&&o.camera[l].every(es)),`${s}: camera position and target must contain finite XYZ values.`),Pe(o.camera.position.some((l,c)=>Math.abs(l-o.camera.target[c])>1e-9),`${s}: camera position and target must differ.`)))}for(let s of Object.values(n.elements)){let r=new Set([s.id]),o=s.parent;for(;o;)Pe(!r.has(o)&&r.size<64,`${s.id}: cyclic or excessively deep group hierarchy.`),r.add(o),o=n.elements[o].parent}}function Dd(n){Pe(n.length<=16*1024*1024,"Scene exceeds the 16 MB document limit.");let e=JSON.parse(n),t=Qc(n);function i(s){if(s){if(s.type==="object"){let r=new Set;for(let o of s.children||[]){let a=o.children?.[0].value;Pe(!r.has(a),`Duplicate JSON key: ${a}`),r.add(a)}}for(let r of s.children||[])i(r)}}return i(t),ts(e),e}function pn(n,e){let t=[],i=n.elements[e]?.parent;for(;i;){let s=n.elements[i];if(!s)break;t.unshift(s),i=s.parent}return t}function St(n,e){return!!n.elements[e]?.locked||pn(n,e).some(t=>t.locked)}function xo(n,e){return!!n.elements[e]?.visible&&pn(n,e).every(t=>t.visible)}function Pi(n,e){let t=new Set(e);return[...t].filter(i=>n.elements[i]&&!pn(n,i).some(s=>t.has(s.id)))}function Nd(n,e){Pe(Yn(e),"Invalid editor operation.");let t=structuredClone(n),i=s=>(Pe(typeof s=="string"&&!!t.elements[s],`Unknown element: ${s}`),t.elements[s]);switch(e.kind){case"insertMany":{Pe(Array.isArray(e.elements)&&e.elements.length>0&&e.elements.length<=257,"Invalid component insertion.");let s=new Set;for(let r of e.elements)Pe(Yn(r)&&typeof r.id=="string"&&!t.elements[r.id]&&!s.has(r.id),"Component elements must have unique new IDs."),s.add(r.id);for(let r of e.elements)r.parent&&n.elements[r.parent]&&Pe(!St(n,r.parent),"Cannot insert into a locked group."),t.elements[r.id]=structuredClone(r);break}case"insert":{Pe(Yn(e.element)&&!t.elements[e.element.id],"Inserted element must have a new ID."),e.element.parent&&Pe(!St(n,e.element.parent),"Cannot insert into a locked group."),t.elements[e.element.id]=structuredClone(e.element);break}case"update":{Pe(Array.isArray(e.updates)&&e.updates.length<=1e4,"Invalid updates.");for(let{id:s,changes:r}of e.updates){let o=i(s);Pe(Yn(r),"Invalid changes."),Pe(Object.keys(r).every(l=>["name","parent","visible","locked","transform","properties"].includes(l)),"Cannot change identity or type through a property edit.");let a=Object.keys(r).some(l=>l!=="locked"&&l!=="visible");Pe(!a||!St(n,s),"Unlock the element and its parent groups before editing."),r.parent&&Pe(!St(n,r.parent),"Cannot move into a locked group."),t.elements[s]={...o,...structuredClone(r),parent:r.parent??o.parent,properties:r.properties?{...o.properties,...structuredClone(r.properties)}:o.properties},r.parent==null&&Object.hasOwn(r,"parent")&&delete t.elements[s].parent}break}case"delete":case"duplicate":{Pe(Array.isArray(e.ids)&&e.ids.length<=1e4,"Invalid selection."),e.ids.forEach(i);let s=Pi(n,e.ids),r=Object.values(n.elements).filter(o=>s.includes(o.id)||pn(n,o.id).some(a=>s.includes(a.id)));if(e.kind==="delete")Pe(r.every(o=>!St(n,o.id)),"Unlock selected elements and descendants before deleting."),r.forEach(o=>delete t.elements[o.id]);else{let o=new Map(r.map(a=>[a.id,br()]));for(let a of r){let l=structuredClone(a);l.id=o.get(a.id),l.name+=" copy",l.parent&&o.has(l.parent)&&(l.parent=o.get(l.parent)),s.includes(a.id)&&(Pe(!l.parent||!St(n,l.parent),"Cannot duplicate into a locked group."),l.transform.position[0]+=n.mode==="2d"?20:.5),t.elements[l.id]=l}}break}default:throw new Error("Unknown editor operation.")}return ts(t),t}var Jd=$m(Yd());function jd(n){if(n.length>=24&&n[0]===137&&n[1]===80&&n[2]===78&&n[3]===71){let e=new DataView(n.buffer,n.byteOffset,n.byteLength),t=e.getUint32(16),i=e.getUint32(20);return Zd(t,i)?{width:t,height:i}:void 0}if(n.length>=4&&n[0]===255&&n[1]===216&&n[2]===255){let e=2;for(;e+9<n.length;){if(n[e]!==255){e++;continue}for(;e<n.length&&n[e]===255;)e++;let t=n[e++];if(t===216||t===217)continue;if(e+1>=n.length)break;let i=n[e]<<8|n[e+1];if(i<2||e+i>n.length)break;if((t>=192&&t<=195||t>=197&&t<=199||t>=201&&t<=203||t>=205&&t<=207)&&i>=7){let r=n[e+3]<<8|n[e+4],o=n[e+5]<<8|n[e+6];return Zd(o,r)?{width:o,height:r}:void 0}e+=i}}}function Zd(n,e){return n>0&&e>0&&n<=1e5&&e<=1e5}var Mr=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"})[e]);function va(n){let e=n.transform;return`translate(${e.position[0]} ${e.position[1]}) rotate(${e.rotation[2]*180/Math.PI}) scale(${e.scale[0]} ${e.scale[1]})`}function Mg(n){let e=n.properties;if(n.type==="path")return(0,Jd.default)(String(e.d));if(n.type==="line"||n.type==="polyline"){let t=e.points;return[Math.min(...t.map(i=>i[0])),Math.min(...t.map(i=>i[1])),Math.max(...t.map(i=>i[0])),Math.max(...t.map(i=>i[1]))]}if(n.type==="text"){let t=e.fontSize,i=String(e.text).length*t*((e.fontWeight??400)>400?1.08:1),s=e.textAnchor==="middle"?-i/2:e.textAnchor==="end"?-i:0;return[s,-t,s+i,t*.4]}return[0,0,e.width??0,e.height??0]}function nh(n){let e=[];for(let o of Object.values(n.elements)){if(o.type==="group"||!xo(n,o.id))continue;let a=Mg(o),l=(o.properties.strokeWidth??0)/2,c=[[a[0]-l,a[1]-l],[a[2]+l,a[1]-l],[a[2]+l,a[3]+l],[a[0]-l,a[3]+l]],h=[...pn(n,o.id),o].reverse();for(let[d,u]of c){for(let p of h){let g=p.transform,y=g.rotation[2],f=d*g.scale[0],m=u*g.scale[1];d=g.position[0]+Math.cos(y)*f-Math.sin(y)*m,u=g.position[1]+Math.sin(y)*f+Math.cos(y)*m}e.push([d,u])}}if(!e.length)return[0,0,800,600];let t=1/0,i=1/0,s=-1/0,r=-1/0;for(let[o,a]of e)t=Math.min(t,o),i=Math.min(i,a),s=Math.max(s,o),r=Math.max(r,a);return[t-20,i-20,s-t+40,r-i+40]}function Kd(n,e={},t={}){if(ts(n),n.mode!=="2d")throw new Error("SVG export requires a 2D drawing.");let i=0;for(let o of Object.values(n.elements)){if(o.type!=="viewport3d"||!xo(n,o.id))continue;let a=t[o.id];if(typeof a!="string"||a.length>32*1024*1024||!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(a))throw new Error(`Render the 3D viewport before exporting: ${o.name}`);let l=Uint8Array.from(atob(a.slice(22)),h=>h.charCodeAt(0)),c=jd(l);if(i+=l.length,!c||l[4]!==13||l[5]!==10||l[6]!==26||l[7]!==10||c.width*c.height>4*1024*1024||i>32*1024*1024)throw new Error("Invalid or oversized 3D viewport PNG.")}let s=o=>{if(!o.visible)return"";let a=o.properties,l=`fill="${Mr(a.fill??"none")}" stroke="${Mr(a.stroke??"none")}" stroke-width="${a.strokeWidth??0}" opacity="${a.opacity??1}"`,c="";switch(o.type){case"rect":c=`<rect width="${a.width}" height="${a.height}" ${l}/>`;break;case"ellipse":c=`<ellipse cx="${a.width/2}" cy="${a.height/2}" rx="${a.width/2}" ry="${a.height/2}" ${l}/>`;break;case"line":case"polyline":c=`<polyline points="${a.points.map(h=>h.join(",")).join(" ")}" ${l}/>`;break;case"path":c=`<path d="${Mr(a.d)}" ${l}/>`;break;case"text":c=`<text font-size="${a.fontSize}" font-family="${a.fontFamily??"sans-serif"}" font-weight="${a.fontWeight??400}" text-anchor="${a.textAnchor??"start"}" xml:space="preserve" ${l}>${Mr(a.text)}</text>`;break;case"image":{let h=e[String(a.src)];if(!h||!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+=*$/.test(h))throw new Error(`Image must be readable and embedded for export: ${a.src}`);c=`<image width="${a.width}" height="${a.height}" href="${h}" opacity="${a.opacity??1}"/>`;break}case"viewport3d":c=`<image width="${a.width}" height="${a.height}" href="${t[o.id]}" opacity="${a.opacity??1}"/>`;break;case"group":c=Object.values(n.elements).filter(h=>h.parent===o.id).map(s).join(`
`);break}return`<g id="${o.id}" data-name="${Mr(o.name)}" transform="${va(o)}"><title>${Mr(o.name)}</title>${c}</g>`},r=nh(n);return`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r.join(" ")}" width="${r[2]}" height="${r[3]}">
${Object.values(n.elements).filter(o=>!o.parent).map(s).join(`
`)}
</svg>
`}var Sg="http://www.w3.org/2000/svg",Ot=(n,e={})=>{let t=document.createElementNS(Sg,n);for(let[i,s]of Object.entries(e))t.setAttribute(i,String(s));return t},ns=class{constructor(e,t){this.container=e;this.callbacks=t;this.svg=Ot("svg",{"data-testid":"svg-canvas",class:"drawing"}),this.content=Ot("g"),this.svg.append(this.content),e.replaceChildren(this.svg),this.svg.addEventListener("pointerdown",this.down),this.svg.addEventListener("wheel",this.wheel,{passive:!1}),this.svg.addEventListener("dblclick",i=>{let r=i.target.closest("[data-element-id]")?.getAttribute("data-element-id");!this.disabled&&r&&this.scene?.elements[r]?.type==="viewport3d"&&(i.preventDefault(),this.callbacks.editViewport?.(r))}),window.addEventListener("pointermove",this.move),window.addEventListener("pointerup",this.up),window.addEventListener("pointercancel",this.cancel),window.addEventListener("keydown",this.keydown,!0),this.observer=new ResizeObserver(()=>{this.gesture||(this.fitOnResize?this.fit():this.scheduleDraw())}),this.observer.observe(e)}svg;content;selectionLayer=Ot("g",{class:"selection-layer"});selectionGroups=new Map;scene;selected=[];version=0;disabled=!1;tool="translate";assets={};viewportImages={};groups=new Map;view={x:0,y:0,zoom:1};gesture;observer;drawFrame=0;fitOnResize=!1;sceneDirty=!0;selectionDirty=!0;decorations=[];bounds=new Map;previewed=new Set;committedPreview;setAssets(e){this.assets=e}setViewportImages(e){this.viewportImages=e;for(let[t,i]of this.groups){let s=i.querySelector("[data-viewport-image]");s&&(s.setAttribute("href",e[t]??""),i.querySelector("[data-viewport-loading]")?.setAttribute("visibility",e[t]?"hidden":"visible"))}}placementPoint(e,t){let i=new DOMPoint(e,t).matrixTransform(this.content.getScreenCTM().inverse());return[i.x,i.y,0]}setState(e,t,i,s){this.committedPreview&&(i!==this.committedPreview.version||this.disabled&&!s)&&(this.committedPreview=void 0),this.gesture&&(i!==this.gesture.version||s)&&(this.gesture=void 0),e!==this.scene&&(this.sceneDirty=!0),(s!==this.disabled||t.join("\0")!==this.selected.join("\0"))&&(this.selectionDirty=!0),this.scene=e,this.selected=t,this.version=i,this.disabled=s,this.scheduleDraw()}setTool(e){this.selectionDirty||=e!==this.tool,this.tool=e,this.scheduleDraw()}matrix(e,t,i){let s=new DOMMatrix,r=pn(this.scene,e);t&&r.push(this.scene.elements[e]);for(let o of r){let a=i?.get(o.id)??o.transform;s=s.translate(a.position[0],a.position[1]).rotate(a.rotation[2]*180/Math.PI).scale(a.scale[0],a.scale[1])}return s}screenPoint(e){let t=this.svg.getBoundingClientRect();return new DOMPoint((e.clientX-t.left-this.view.x)/this.view.zoom,(e.clientY-t.top-this.view.y)/this.view.zoom)}scheduleDraw(){this.drawFrame||(this.drawFrame=requestAnimationFrame(()=>{this.drawFrame=0,this.draw()}))}draw(){if(!this.scene)return;let e=`translate(${this.view.x} ${this.view.y}) scale(${this.view.zoom})`;this.content.getAttribute("transform")!==e&&(this.content.setAttribute("transform",e),this.selectionDirty=!0),this.sceneDirty&&this.buildScene();let t=this.gesture?.preview??this.committedPreview?.transforms,i=new Set(t?.keys()??[]);for(let s of new Set([...this.previewed,...i])){let r=this.groups.get(s),o=this.scene.elements[s];if(r&&o){let a=t?.get(s)??o.transform,l=va({...o,transform:a});r.getAttribute("transform")!==l&&r.setAttribute("transform",l)}}this.previewed=i,this.gesture?.kind==="scale"&&(this.selectionDirty=!0),this.selectionDirty&&this.drawSelection();for(let[s,r]of this.selectionGroups){let o=this.matrix(s,!0,t).toString();r.getAttribute("transform")!==o&&r.setAttribute("transform",o)}}buildScene(){if(!this.scene)return;this.groups.clear(),this.bounds.clear(),this.decorations=[],this.previewed.clear(),this.content.replaceChildren();let e=Object.values(this.scene.elements),t=new Map;for(let s of e){let r=t.get(s.parent)??[];r.push(s),t.set(s.parent,r)}let i=(s,r)=>{if(!s.visible)return;let o=s.transform,a=Ot("g",{"data-element-id":s.id,transform:va({...s,transform:o})});this.groups.set(s.id,a),r.append(a);let l=s.properties,c,h={fill:l.fill??"none",stroke:l.stroke??"none","stroke-width":l.strokeWidth??0,opacity:l.opacity??1};switch(s.type){case"rect":c=Ot("rect",{width:l.width,height:l.height,...h});break;case"ellipse":c=Ot("ellipse",{cx:l.width/2,cy:l.height/2,rx:l.width/2,ry:l.height/2,...h});break;case"line":case"polyline":c=Ot("polyline",{points:l.points.map(d=>d.join(",")).join(" "),...h});break;case"path":c=Ot("path",{d:l.d,...h});break;case"text":c=Ot("text",{"font-size":l.fontSize,"font-family":l.fontFamily??"sans-serif","font-weight":l.fontWeight??400,"text-anchor":l.textAnchor??"start","xml:space":"preserve",...h}),c.textContent=String(l.text);break;case"image":if(this.assets[String(l.src)])c=Ot("image",{href:this.assets[String(l.src)],width:l.width,height:l.height,opacity:l.opacity??1});else{c=Ot("rect",{width:l.width,height:l.height,fill:"#6e3540",stroke:"#ff8296","stroke-dasharray":"5 4"});let d=Ot("title");d.textContent=`Missing image: ${l.src}`,c.append(d)}break;case"viewport3d":{let d=Ot("g");d.append(Ot("rect",{width:l.width,height:l.height,fill:l.background??"#ffffff"})),d.append(Ot("image",{"data-viewport-image":"",href:this.viewportImages[s.id]??"",width:l.width,height:l.height,opacity:l.opacity??1}));let u=Ot("text",{"data-viewport-loading":"",x:8,y:20,fill:"#334155","font-size":12,visibility:this.viewportImages[s.id]?"hidden":"visible"});u.textContent="3D view \xB7 double-click to edit",d.append(u),c=d;break}case"group":break}c&&(c.setAttribute("pointer-events","all"),a.append(c));for(let d of t.get(s.id)??[])i(d,a)};for(let s of t.get(void 0)??[])i(s,this.content);this.content.append(this.selectionLayer),this.sceneDirty=!1,this.selectionDirty=!0}localBounds(e){let t=this.bounds.get(e);if(!t){let i=this.groups.get(e);if(!i)return;try{t=i.getBBox()}catch{return}this.bounds.set(e,t)}return t}decorate(e,t){e.append(t),this.decorations.push(t)}drawSelection(){if(this.scene){this.decorations.forEach(e=>e.remove()),this.decorations=[],this.selectionLayer.replaceChildren(),this.selectionGroups.clear();for(let e of this.selected){if(!this.groups.has(e))continue;let t=this.localBounds(e);if(!t||!t.width&&!t.height)continue;let i=Ot("g",{"data-selection-id":e,transform:this.matrix(e,!0,this.gesture?.preview??this.committedPreview?.transforms).toString()});if(this.selectionLayer.append(i),this.selectionGroups.set(e,i),this.decorate(i,Ot("rect",{x:t.x-3,y:t.y-3,width:t.width+6,height:t.height+6,fill:"none",stroke:"#facc15","stroke-width":1.5,"vector-effect":"non-scaling-stroke","pointer-events":"none",class:"selection-outline"})),this.selected.length===1&&!this.disabled&&!St(this.scene,e)){let s=i.getScreenCTM(),r=Math.max(.001,Math.hypot(s?.a??this.view.zoom,s?.b??0)),o=Math.max(.001,Math.hypot(s?.c??0,s?.d??this.view.zoom));for(let[a,l,c]of[["nw",0,0],["n",.5,0],["ne",1,0],["e",1,.5],["se",1,1],["s",.5,1],["sw",0,1],["w",0,.5]])this.decorate(i,Ot("rect",{x:t.x+t.width*l-4/r,y:t.y+t.height*c-4/o,width:8/r,height:8/o,fill:"var(--ti-panel)",stroke:"#facc15","stroke-width":1,"vector-effect":"non-scaling-stroke","data-handle":"scale","data-corner":a,"data-testid":a==="se"?"resize-handle":`resize-handle-${a}`,style:`cursor:${a}-resize`}));this.decorate(i,Ot("line",{x1:t.x+t.width/2,y1:t.y,x2:t.x+t.width/2,y2:t.y-28/o,stroke:"#facc15","stroke-width":1,"vector-effect":"non-scaling-stroke","pointer-events":"none"})),this.decorate(i,Ot("circle",{cx:t.x+t.width/2,cy:t.y-28/o,r:7/Math.max(r,o),fill:"#facc15","data-handle":"rotate","data-testid":"rotate-handle",style:"cursor:grab"}))}}this.selectionDirty=!1}}anchoredTransform(e,t,i){let s=a=>new DOMMatrix().rotate(a.rotation[2]*180/Math.PI).scale(a.scale[0],a.scale[1]).transformPoint(t),r=s(e),o=s(i);return i.position[0]=e.position[0]+r.x-o.x,i.position[1]=e.position[1]+r.y-o.y,i}rotateSelected(e,t=!1){if(!this.scene||this.disabled||this.gesture||!Number.isFinite(e))return;this.sceneDirty&&this.draw();let i=Pi(this.scene,this.selected).filter(s=>!St(this.scene,s)).flatMap(s=>{let r=this.localBounds(s);if(!r)return[];let o=this.scene.elements[s].transform,a=structuredClone(o);return a.rotation[2]=(t?0:o.rotation[2])+e*Math.PI/180,[{id:s,changes:{transform:this.anchoredTransform(o,new DOMPoint(r.x+r.width/2,r.y+r.height/2),a)}}]});i.length&&(this.committedPreview={version:this.version,transforms:new Map(i.map(s=>[s.id,s.changes.transform]))},this.callbacks.commit(i,this.version),this.scheduleDraw())}down=e=>{if(!this.scene||e.button>1)return;let t=e.target,i=t.closest("[data-element-id],[data-selection-id]"),s=i?.getAttribute("data-element-id")??i?.getAttribute("data-selection-id"),r=t.getAttribute("data-handle"),o=this.content.transform.baseVal.consolidate()?.matrix;o&&(this.view={x:o.e,y:o.f,zoom:o.a});let a=this.screenPoint(e),l=this.svg.getBoundingClientRect();if(e.button===1||!s){e.button===0&&!e.shiftKey&&this.callbacks.select(void 0,!1),this.gesture={kind:"pan",start:new DOMPoint(e.clientX,e.clientY),version:this.version,ids:[],initial:new Map,parents:new Map,locals:new Map,preview:new Map,pointer:e.pointerId,moved:!1,view:{...this.view},viewport:l,centers:new Map,bounds:new Map,angles:new Map,turns:new Map},this.svg.setPointerCapture(e.pointerId);return}let c=s;e.preventDefault();let h=()=>this.selected.some(x=>x===c||pn(this.scene,c).some(v=>v.id===x)),d=h();if(d?this.callbacks.activateSelection?.():this.callbacks.select(c,e.shiftKey),this.disabled||St(this.scene,c)||!h())return;let u=Pi(this.scene,this.selected).filter(x=>!St(this.scene,x)),p=new Map(u.map(x=>[x,structuredClone(this.scene.elements[x].transform)])),g=new Map(u.flatMap(x=>{let v=this.localBounds(x);return v?[[x,v]]:[]})),y=new Map([...g].map(([x,v])=>[x,new DOMPoint(v.x+v.width/2,v.y+v.height/2)])),f=new Map(u.map(x=>[x,this.matrix(x,!1).inverse()])),m=new Map(u.map(x=>{let v=y.get(x)??new DOMPoint,M=p.get(x),T=new DOMMatrix().translate(M.position[0],M.position[1]).rotate(M.rotation[2]*180/Math.PI).scale(M.scale[0],M.scale[1]).transformPoint(v),E=a.matrixTransform(f.get(x));return[x,Math.atan2(E.y-T.y,E.x-T.x)]}));this.gesture={kind:r==="rotate"?"rotate":r==="scale"?"scale":this.tool,start:a,version:this.version,ids:u,initial:p,parents:f,locals:new Map(u.map(x=>[x,this.matrix(x,!0)])),preview:new Map,pointer:e.pointerId,moved:!1,view:{...this.view},viewport:l,centers:y,bounds:g,angles:m,turns:new Map(u.map(x=>[x,0])),corner:t.getAttribute("data-corner")??"se",toggleOnClick:d&&e.shiftKey&&!r?c:void 0},this.svg.setPointerCapture(e.pointerId)};move=e=>{let t=this.gesture;if(!t||t.pointer!==e.pointerId)return;if(t.kind==="pan"){let s=e.clientX-t.start.x,r=e.clientY-t.start.y;t.moved||=Math.abs(s)+Math.abs(r)>2,t.moved&&(this.fitOnResize=!1),this.view.x=t.view.x+s,this.view.y=t.view.y+r,this.scheduleDraw();return}if(this.disabled)return;let i=new DOMPoint((e.clientX-t.viewport.left-t.view.x)/t.view.zoom,(e.clientY-t.viewport.top-t.view.y)/t.view.zoom);Math.abs(i.x-t.start.x)+Math.abs(i.y-t.start.y)>1/this.view.zoom&&(t.moved=!0),t.moved&&(this.fitOnResize=!1);for(let s of t.ids){let r=t.initial.get(s),o=structuredClone(r),a=t.parents.get(s),l=t.start.matrixTransform(a),c=i.matrixTransform(a);if(t.kind==="translate"){let h=c.x-l.x,d=c.y-l.y;e.shiftKey&&(Math.abs(h)>=Math.abs(d)?d=0:h=0),o.position[0]+=h,o.position[1]+=d}else if(t.kind==="rotate"){let h=t.centers.get(s)??new DOMPoint,d=new DOMMatrix().translate(r.position[0],r.position[1]).rotate(r.rotation[2]*180/Math.PI).scale(r.scale[0],r.scale[1]).transformPoint(h),u=Math.atan2(c.y-d.y,c.x-d.x),p=u-t.angles.get(s),g=t.turns.get(s)+Math.atan2(Math.sin(p),Math.cos(p));t.angles.set(s,u),t.turns.set(s,g),o.rotation[2]+=g,e.shiftKey&&(o.rotation[2]=Math.round(o.rotation[2]/(Math.PI/12))*Math.PI/12),this.anchoredTransform(r,h,o)}else{let h=t.locals.get(s).inverse(),d=t.start.matrixTransform(h),u=i.matrixTransform(h),p=t.bounds.get(s);if(!p)continue;let g=t.corner??"se",y=new DOMPoint(p.x+p.width*(g.includes("w")?1:g.includes("e")?0:.5),p.y+p.height*(g.includes("n")?1:g.includes("s")?0:.5)),f=d.x-y.x,m=d.y-y.y,x=Math.abs(f)>1e-8?(u.x-y.x)/f:1,v=Math.abs(m)>1e-8?(u.y-y.y)/m:1,M=g.includes("e")||g.includes("w"),T=g.includes("n")||g.includes("s");M&&T&&(this.scene?.elements[s].type==="image"||e.shiftKey)&&(x=v=(f*(u.x-y.x)+m*(u.y-y.y))/(f*f+m*m||1)),M&&(o.scale[0]=r.scale[0]*Math.max(.01/Math.abs(r.scale[0]),x)),T&&(o.scale[1]=r.scale[1]*Math.max(.01/Math.abs(r.scale[1]),v)),this.anchoredTransform(r,y,o)}t.preview.set(s,o)}this.scheduleDraw()};up=e=>{let t=this.gesture;!t||t.pointer!==e.pointerId||(this.move(e),this.gesture=void 0,this.svg.hasPointerCapture(e.pointerId)&&this.svg.releasePointerCapture(e.pointerId),!t.moved&&t.toggleOnClick&&this.callbacks.select(t.toggleOnClick,!0),t.kind!=="pan"&&t.moved&&t.preview.size&&!this.disabled&&(this.committedPreview={version:t.version,transforms:t.preview},this.callbacks.commit([...t.preview].map(([i,s])=>({id:i,changes:{transform:s}})),t.version)),this.scheduleDraw())};cancel=()=>{this.gesture?.kind==="pan"&&(this.view={...this.gesture.view});let e=this.gesture?.pointer;this.gesture=void 0,this.selectionDirty=!0,e!==void 0&&this.svg.hasPointerCapture(e)&&this.svg.releasePointerCapture(e),this.scheduleDraw()};keydown=e=>{e.key==="Escape"&&this.gesture&&(e.preventDefault(),e.stopImmediatePropagation(),this.cancel())};wheel=e=>{if(e.preventDefault(),this.gesture)return;this.fitOnResize=!1;let t=this.screenPoint(e),i=this.svg.getBoundingClientRect();this.view.zoom=Math.max(.02,Math.min(100,this.view.zoom*Math.exp(-e.deltaY*.001))),this.view.x=e.clientX-i.left-t.x*this.view.zoom,this.view.y=e.clientY-i.top-t.y*this.view.zoom,this.scheduleDraw()};fit(){if(!this.scene)return;this.fitOnResize=!0;let[e,t,i,s]=nh(this.scene),r=this.container.clientWidth,o=this.container.clientHeight;this.view.zoom=Math.max(.02,Math.min(10,Math.min(r/i,o/s)*.9)),this.view.x=(r-i*this.view.zoom)/2-e*this.view.zoom,this.view.y=(o-s*this.view.zoom)/2-t*this.view.zoom,this.scheduleDraw()}dispose(){this.drawFrame&&cancelAnimationFrame(this.drawFrame),this.drawFrame=0,this.observer.disconnect(),this.svg.removeEventListener("pointerdown",this.down),this.svg.removeEventListener("wheel",this.wheel),window.removeEventListener("pointermove",this.move),window.removeEventListener("pointerup",this.up),window.removeEventListener("pointercancel",this.cancel),window.removeEventListener("keydown",this.keydown,!0),this.svg.remove()}};var bs={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Ms={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ef=0,Dh=1,Tf=2;var Xo=1,Af=2,Zr=3,ki=0,xn=1,ln=2,mi=0,Xs=1,Nh=2,Oh=3,Uh=4,Rf=5;var hs=100,Cf=101,If=102,Pf=103,Lf=104,Df=200,Nf=201,Of=202,Uf=203,$a=204,qa=205,Ff=206,kf=207,Bf=208,zf=209,Vf=210,Hf=211,Gf=212,Wf=213,Xf=214,Ya=0,Za=1,ja=2,$s=3,Ja=4,Ka=5,Qa=6,el=7,Fh=0,$f=1,qf=2,ei=0,kh=1,Bh=2,zh=3,Vh=4,Hh=5,Gh=6,Wh=7;var Xh=300,Ss=301,Qs=302,wl=303,El=304,$o=306,kr=1e3,kn=1001,Br=1002,Bt=1003,Tl=1004;var er=1005;var Ht=1006,jr=1007;var gi=1008;var Dn=1009,$h=1010,qh=1011,Jr=1012,Al=1013,ti=1014,ni=1015,yi=1016,Rl=1017,Cl=1018,Kr=1020,Yh=35902,Zh=35899,jh=1021,Jh=1022,bn=1023,di=1026,ws=1027,Kh=1028,Il=1029,tr=1030,Pl=1031;var Ll=1033,qo=33776,Yo=33777,Zo=33778,jo=33779,Dl=35840,Nl=35841,Ol=35842,Ul=35843,Fl=36196,kl=37492,Bl=37496,zl=37488,Vl=37489,Hl=37490,Gl=37491,Wl=37808,Xl=37809,$l=37810,ql=37811,Yl=37812,Zl=37813,jl=37814,Jl=37815,Kl=37816,Ql=37817,ec=37818,tc=37819,nc=37820,ic=37821,sc=36492,rc=36494,oc=36495,ac=36283,lc=36284,cc=36285,hc=36286;var qs=2300,zr=2301,Wa=2302,Eh=2303,Th=2400,Ah=2401,Rh=2402;var Yf=3200;var Qh=0,Zf=1,ii="",Qt="srgb",Ys="srgb-linear",Ao="linear",ot="srgb";var Ws=7680;var Ch=519,jf=512,Jf=513,Kf=514,uc=515,Qf=516,ep=517,dc=518,tp=519,Ih=35044;var eu="300 es",Kn=2e3,Ro=2001;function wg(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Eg(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Vr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function np(){let n=Vr("canvas");return n.style.display="block",n}var Qd={},Hr=null;function tu(...n){let e="THREE."+n.shift();Hr?Hr("log",e,...n):console.log(e,...n)}function ip(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Le(...n){n=ip(n);let e="THREE."+n.shift();if(Hr)Hr("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Ne(...n){n=ip(n);let e="THREE."+n.shift();if(Hr)Hr("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Co(...n){let e=n.join(" ");e in Qd||(Qd[e]=!0,Le(...n))}function sp(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var rp={[Ya]:Za,[ja]:Qa,[Ja]:el,[$s]:Ka,[Za]:Ya,[Qa]:ja,[el]:Ja,[Ka]:$s},fi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ef=1234567,Eo=Math.PI/180,Gr=180/Math.PI;function Qr(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(sn[n&255]+sn[n>>8&255]+sn[n>>16&255]+sn[n>>24&255]+"-"+sn[e&255]+sn[e>>8&255]+"-"+sn[e>>16&15|64]+sn[e>>24&255]+"-"+sn[t&63|128]+sn[t>>8&255]+"-"+sn[t>>16&255]+sn[t>>24&255]+sn[i&255]+sn[i>>8&255]+sn[i>>16&255]+sn[i>>24&255]).toLowerCase()}function Ze(n,e,t){return Math.max(e,Math.min(t,n))}function nu(n,e){return(n%e+e)%e}function Tg(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Ag(n,e,t){return n!==e?(t-n)/(e-n):0}function To(n,e,t){return(1-t)*n+t*e}function Rg(n,e,t,i){return To(n,e,1-Math.exp(-t*i))}function Cg(n,e=1){return e-Math.abs(nu(n,e*2)-e)}function Ig(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Pg(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Lg(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Dg(n,e){return n+Math.random()*(e-n)}function Ng(n){return n*(.5-Math.random())}function Og(n){n!==void 0&&(ef=n);let e=ef+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ug(n){return n*Eo}function Fg(n){return n*Gr}function kg(n){return(n&n-1)===0&&n!==0}function Bg(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function zg(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Vg(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+i)/2),h=o((e+i)/2),d=r((e-i)/2),u=o((e-i)/2),p=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*h,l*d,l*u,a*c);break;case"YZY":n.set(l*u,a*h,l*d,a*c);break;case"ZXZ":n.set(l*d,l*u,a*h,a*c);break;case"XZX":n.set(a*h,l*g,l*p,a*c);break;case"YXY":n.set(l*p,a*h,l*g,a*c);break;case"ZYZ":n.set(l*g,l*p,a*h,a*c);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ur(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function mn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Hi={DEG2RAD:Eo,RAD2DEG:Gr,generateUUID:Qr,clamp:Ze,euclideanModulo:nu,mapLinear:Tg,inverseLerp:Ag,lerp:To,damp:Rg,pingpong:Cg,smoothstep:Ig,smootherstep:Pg,randInt:Lg,randFloat:Dg,randFloatSpread:Ng,seededRandom:Og,degToRad:Ug,radToDeg:Fg,isPowerOfTwo:kg,ceilPowerOfTwo:Bg,floorPowerOfTwo:zg,setQuaternionFromProperEuler:Vg,normalize:mn,denormalize:Ur},Oe=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},dt=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],d=i[s+3],u=r[o+0],p=r[o+1],g=r[o+2],y=r[o+3];if(d!==y||l!==u||c!==p||h!==g){let f=l*u+c*p+h*g+d*y;f<0&&(u=-u,p=-p,g=-g,y=-y,f=-f);let m=1-a;if(f<.9995){let x=Math.acos(f),v=Math.sin(x);m=Math.sin(m*x)/v,a=Math.sin(a*x)/v,l=l*m+u*a,c=c*m+p*a,h=h*m+g*a,d=d*m+y*a}else{l=l*m+u*a,c=c*m+p*a,h=h*m+g*a,d=d*m+y*a;let x=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=x,c*=x,h*=x,d*=x}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],d=r[o],u=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+h*d+l*p-c*u,e[t+1]=l*g+h*u+c*d-a*p,e[t+2]=c*g+h*p+a*u-l*d,e[t+3]=h*g-a*d-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),d=a(r/2),u=l(i/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"YZX":this._x=u*h*d+c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d-u*p*g;break;case"XZY":this._x=u*h*d-c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d+u*p*g;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=i+a+d;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(i>a&&i>d){let p=2*Math.sqrt(1+i-a-d);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>d){let p=2*Math.sqrt(1+a-i-d);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+d-i-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(tf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(tf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*i),h=2*(a*t-r*s),d=2*(r*i-o*t);return this.x=t+l*c+o*d-a*h,this.y=i+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ih.copy(this).projectOnVector(e),this.sub(ih)}reflect(e){return this.sub(ih.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ih=new I,tf=new dt,Ge=class n{constructor(e,t,i,s,r,o,a,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c)}set(e,t,i,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],d=i[7],u=i[2],p=i[5],g=i[8],y=s[0],f=s[3],m=s[6],x=s[1],v=s[4],M=s[7],T=s[2],E=s[5],A=s[8];return r[0]=o*y+a*x+l*T,r[3]=o*f+a*v+l*E,r[6]=o*m+a*M+l*A,r[1]=c*y+h*x+d*T,r[4]=c*f+h*v+d*E,r[7]=c*m+h*M+d*A,r[2]=u*y+p*x+g*T,r[5]=u*f+p*v+g*E,r[8]=u*m+p*M+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=h*o-a*c,u=a*l-h*r,p=c*r-o*l,g=t*d+i*u+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=d*y,e[1]=(s*c-h*i)*y,e[2]=(a*i-s*o)*y,e[3]=u*y,e[4]=(h*t-s*l)*y,e[5]=(s*r-a*t)*y,e[6]=p*y,e[7]=(i*l-c*t)*y,e[8]=(o*t-i*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(sh.makeScale(e,t)),this}rotate(e){return this.premultiply(sh.makeRotation(-e)),this}translate(e,t){return this.premultiply(sh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},sh=new Ge,nf=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sf=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Hg(){let n={enabled:!0,workingColorSpace:Ys,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ot&&(s.r=Fi(s.r),s.g=Fi(s.g),s.b=Fi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ot&&(s.r=Fr(s.r),s.g=Fr(s.g),s.b=Fr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ii?Ao:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Co("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Co("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ys]:{primaries:e,whitePoint:i,transfer:Ao,toXYZ:nf,fromXYZ:sf,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Qt},outputColorSpaceConfig:{drawingBufferColorSpace:Qt}},[Qt]:{primaries:e,whitePoint:i,transfer:ot,toXYZ:nf,fromXYZ:sf,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Qt}}}),n}var Ke=Hg();function Fi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Fr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Sr,Wr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Sr===void 0&&(Sr=Vr("canvas")),Sr.width=e.width,Sr.height=e.height;let s=Sr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Sr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Vr("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Fi(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Fi(t[i]/255)*255):t[i]=Fi(t[i]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Gg=0,us=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gg++}),this.uuid=Qr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(rh(s[o].image)):r.push(rh(s[o]))}else r=rh(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function rh(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Wr.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}var Wg=0,oh=new I,an=class n extends fi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=kn,s=kn,r=Ht,o=gi,a=bn,l=Dn,c=n.DEFAULT_ANISOTROPY,h=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wg++}),this.uuid=Qr(),this.name="",this.source=new us(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(oh).x}get height(){return this.source.getSize(oh).y}get depth(){return this.source.getSize(oh).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Xh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case kr:e.x=e.x-Math.floor(e.x);break;case kn:e.x=e.x<0?0:1;break;case Br:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case kr:e.y=e.y-Math.floor(e.y);break;case kn:e.y=e.y<0?0:1;break;case Br:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};an.DEFAULT_IMAGE=null;an.DEFAULT_MAPPING=Xh;an.DEFAULT_ANISOTROPY=1;var Pt=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],g=l[9],y=l[2],f=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-y)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+y)<.1&&Math.abs(g+f)<.1&&Math.abs(c+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,M=(p+1)/2,T=(m+1)/2,E=(h+u)/4,A=(d+y)/4,_=(g+f)/4;return v>M&&v>T?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=E/i,r=A/i):M>T?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=E/s,r=_/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=A/r,s=_/r),this.set(i,s,r,t),this}let x=Math.sqrt((f-g)*(f-g)+(d-y)*(d-y)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(f-g)/x,this.y=(d-y)/x,this.z=(u-h)/x,this.w=Math.acos((c+p+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this.w=Ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this.w=Ze(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},tl=class extends fi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ht,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Pt(0,0,e,t),this.scissorTest=!1,this.viewport=new Pt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:i.depth},r=new an(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:Ht,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new us(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Cn=class extends tl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Io=class extends an{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var nl=class extends an{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var nt=class n{constructor(e,t,i,s,r,o,a,l,c,h,d,u,p,g,y,f){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c,h,d,u,p,g,y,f)}set(e,t,i,s,r,o,a,l,c,h,d,u,p,g,y,f){let m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=p,m[7]=g,m[11]=y,m[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();let t=this.elements,i=e.elements,s=1/wr.setFromMatrixColumn(e,0).length(),r=1/wr.setFromMatrixColumn(e,1).length(),o=1/wr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=o*h,p=o*d,g=a*h,y=a*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=p+g*c,t[5]=u-y*c,t[9]=-a*l,t[2]=y-u*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){let u=l*h,p=l*d,g=c*h,y=c*d;t[0]=u+y*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=p*a-g,t[6]=y+u*a,t[10]=o*l}else if(e.order==="ZXY"){let u=l*h,p=l*d,g=c*h,y=c*d;t[0]=u-y*a,t[4]=-o*d,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*h,t[9]=y-u*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let u=o*h,p=o*d,g=a*h,y=a*d;t[0]=l*h,t[4]=g*c-p,t[8]=u*c+y,t[1]=l*d,t[5]=y*c+u,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let u=o*l,p=o*c,g=a*l,y=a*c;t[0]=l*h,t[4]=y-u*d,t[8]=g*d+p,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*d+g,t[10]=u-y*d}else if(e.order==="XZY"){let u=o*l,p=o*c,g=a*l,y=a*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+y,t[5]=o*h,t[9]=p*d-g,t[2]=g*d-p,t[6]=a*h,t[10]=y*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xg,e,$g)}lookAt(e,t,i){let s=this.elements;return An.subVectors(e,t),An.lengthSq()===0&&(An.z=1),An.normalize(),is.crossVectors(i,An),is.lengthSq()===0&&(Math.abs(i.z)===1?An.x+=1e-4:An.z+=1e-4,An.normalize(),is.crossVectors(i,An)),is.normalize(),ba.crossVectors(An,is),s[0]=is.x,s[4]=ba.x,s[8]=An.x,s[1]=is.y,s[5]=ba.y,s[9]=An.y,s[2]=is.z,s[6]=ba.z,s[10]=An.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],d=i[5],u=i[9],p=i[13],g=i[2],y=i[6],f=i[10],m=i[14],x=i[3],v=i[7],M=i[11],T=i[15],E=s[0],A=s[4],_=s[8],w=s[12],V=s[1],C=s[5],O=s[9],k=s[13],D=s[2],N=s[6],H=s[10],z=s[14],K=s[3],j=s[7],le=s[11],pe=s[15];return r[0]=o*E+a*V+l*D+c*K,r[4]=o*A+a*C+l*N+c*j,r[8]=o*_+a*O+l*H+c*le,r[12]=o*w+a*k+l*z+c*pe,r[1]=h*E+d*V+u*D+p*K,r[5]=h*A+d*C+u*N+p*j,r[9]=h*_+d*O+u*H+p*le,r[13]=h*w+d*k+u*z+p*pe,r[2]=g*E+y*V+f*D+m*K,r[6]=g*A+y*C+f*N+m*j,r[10]=g*_+y*O+f*H+m*le,r[14]=g*w+y*k+f*z+m*pe,r[3]=x*E+v*V+M*D+T*K,r[7]=x*A+v*C+M*N+T*j,r[11]=x*_+v*O+M*H+T*le,r[15]=x*w+v*k+M*z+T*pe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],p=e[14],g=e[3],y=e[7],f=e[11],m=e[15],x=l*p-c*u,v=a*p-c*d,M=a*u-l*d,T=o*p-c*h,E=o*u-l*h,A=o*d-a*h;return t*(y*x-f*v+m*M)-i*(g*x-f*T+m*E)+s*(g*v-y*T+m*A)-r*(g*M-y*E+f*A)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],p=e[11],g=e[12],y=e[13],f=e[14],m=e[15],x=t*a-i*o,v=t*l-s*o,M=t*c-r*o,T=i*l-s*a,E=i*c-r*a,A=s*c-r*l,_=h*y-d*g,w=h*f-u*g,V=h*m-p*g,C=d*f-u*y,O=d*m-p*y,k=u*m-p*f,D=x*k-v*O+M*C+T*V-E*w+A*_;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let N=1/D;return e[0]=(a*k-l*O+c*C)*N,e[1]=(s*O-i*k-r*C)*N,e[2]=(y*A-f*E+m*T)*N,e[3]=(u*E-d*A-p*T)*N,e[4]=(l*V-o*k-c*w)*N,e[5]=(t*k-s*V+r*w)*N,e[6]=(f*M-g*A-m*v)*N,e[7]=(h*A-u*M+p*v)*N,e[8]=(o*O-a*V+c*_)*N,e[9]=(i*V-t*O-r*_)*N,e[10]=(g*E-y*M+m*x)*N,e[11]=(d*M-h*E-p*x)*N,e[12]=(a*w-o*C-l*_)*N,e[13]=(t*C-i*w+s*_)*N,e[14]=(y*v-g*T-f*x)*N,e[15]=(h*T-d*v+u*x)*N,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,d=a+a,u=r*c,p=r*h,g=r*d,y=o*h,f=o*d,m=a*d,x=l*c,v=l*h,M=l*d,T=i.x,E=i.y,A=i.z;return s[0]=(1-(y+m))*T,s[1]=(p+M)*T,s[2]=(g-v)*T,s[3]=0,s[4]=(p-M)*E,s[5]=(1-(u+m))*E,s[6]=(f+x)*E,s[7]=0,s[8]=(g+v)*A,s[9]=(f-x)*A,s[10]=(1-(u+y))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinant();if(r===0)return i.set(1,1,1),t.identity(),this;let o=wr.set(s[0],s[1],s[2]).length(),a=wr.set(s[4],s[5],s[6]).length(),l=wr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Zn.copy(this);let c=1/o,h=1/a,d=1/l;return Zn.elements[0]*=c,Zn.elements[1]*=c,Zn.elements[2]*=c,Zn.elements[4]*=h,Zn.elements[5]*=h,Zn.elements[6]*=h,Zn.elements[8]*=d,Zn.elements[9]*=d,Zn.elements[10]*=d,t.setFromRotationMatrix(Zn),i.x=o,i.y=a,i.z=l,this}makePerspective(e,t,i,s,r,o,a=Kn,l=!1){let c=this.elements,h=2*r/(t-e),d=2*r/(i-s),u=(t+e)/(t-e),p=(i+s)/(i-s),g,y;if(l)g=r/(o-r),y=o*r/(o-r);else if(a===Kn)g=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===Ro)g=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=Kn,l=!1){let c=this.elements,h=2/(t-e),d=2/(i-s),u=-(t+e)/(t-e),p=-(i+s)/(i-s),g,y;if(l)g=1/(o-r),y=o/(o-r);else if(a===Kn)g=-2/(o-r),y=-(o+r)/(o-r);else if(a===Ro)g=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},wr=new I,Zn=new nt,Xg=new I(0,0,0),$g=new I(1,1,1),is=new I,ba=new I,An=new I,rf=new nt,of=new dt,yn=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ze(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return rf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rf,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return of.setFromEuler(this),this.setFromQuaternion(of,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};yn.DEFAULT_ORDER="XYZ";var Xr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},qg=0,af=new I,Er=new dt,Li=new nt,Ma=new I,vo=new I,Yg=new I,Zg=new dt,lf=new I(1,0,0),cf=new I(0,1,0),hf=new I(0,0,1),uf={type:"added"},jg={type:"removed"},Tr={type:"childadded",child:null},ah={type:"childremoved",child:null},Gt=class n extends fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qg++}),this.uuid=Qr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new I,t=new yn,i=new dt,s=new I(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new nt},normalMatrix:{value:new Ge}}),this.matrix=new nt,this.matrixWorld=new nt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Er.setFromAxisAngle(e,t),this.quaternion.multiply(Er),this}rotateOnWorldAxis(e,t){return Er.setFromAxisAngle(e,t),this.quaternion.premultiply(Er),this}rotateX(e){return this.rotateOnAxis(lf,e)}rotateY(e){return this.rotateOnAxis(cf,e)}rotateZ(e){return this.rotateOnAxis(hf,e)}translateOnAxis(e,t){return af.copy(e).applyQuaternion(this.quaternion),this.position.add(af.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(lf,e)}translateY(e){return this.translateOnAxis(cf,e)}translateZ(e){return this.translateOnAxis(hf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Li.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ma.copy(e):Ma.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),vo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Li.lookAt(vo,Ma,this.up):Li.lookAt(Ma,vo,this.up),this.quaternion.setFromRotationMatrix(Li),s&&(Li.extractRotation(s.matrixWorld),Er.setFromRotationMatrix(Li),this.quaternion.premultiply(Er.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ne("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(uf),Tr.child=e,this.dispatchEvent(Tr),Tr.child=null):Ne("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jg),ah.child=e,this.dispatchEvent(ah),ah.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Li.multiply(e.parent.matrixWorld)),e.applyMatrix4(Li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(uf),Tr.child=e,this.dispatchEvent(Tr),Tr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vo,e,Yg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vo,Zg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Gt.DEFAULT_UP=new I(0,1,0);Gt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bn=class extends Gt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Jg={type:"move"},$r=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let y of e.hand.values()){let f=t.getJointPose(y,i),m=this._getHandJoint(c,y);f!==null&&(m.matrix.fromArray(f.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=f.radius),m.visible=f!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Jg)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Bn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},op={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ss={h:0,s:0,l:0},Sa={h:0,s:0,l:0};function lh(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var ze=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ke.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ke.workingColorSpace){if(e=nu(e,1),t=Ze(t,0,1),i=Ze(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=lh(o,r,e+1/3),this.g=lh(o,r,e),this.b=lh(o,r,e-1/3)}return Ke.colorSpaceToWorking(this,s),this}setStyle(e,t=Qt){function i(r){r!==void 0&&parseFloat(r)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Qt){let i=op[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Fi(e.r),this.g=Fi(e.g),this.b=Fi(e.b),this}copyLinearToSRGB(e){return this.r=Fr(e.r),this.g=Fr(e.g),this.b=Fr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Qt){return Ke.workingToColorSpace(rn.copy(this),e),Math.round(Ze(rn.r*255,0,255))*65536+Math.round(Ze(rn.g*255,0,255))*256+Math.round(Ze(rn.b*255,0,255))}getHexString(e=Qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.workingToColorSpace(rn.copy(this),t);let i=rn.r,s=rn.g,r=rn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case i:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-i)/d+2;break;case r:l=(i-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ke.workingColorSpace){return Ke.workingToColorSpace(rn.copy(this),t),e.r=rn.r,e.g=rn.g,e.b=rn.b,e}getStyle(e=Qt){Ke.workingToColorSpace(rn.copy(this),e);let t=rn.r,i=rn.g,s=rn.b;return e!==Qt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ss),this.setHSL(ss.h+e,ss.s+t,ss.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ss),e.getHSL(Sa);let i=To(ss.h,Sa.h,t),s=To(ss.s,Sa.s,t),r=To(ss.l,Sa.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},rn=new ze;ze.NAMES=op;var ds=class extends Gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yn,this.environmentIntensity=1,this.environmentRotation=new yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},jn=new I,Di=new I,ch=new I,Ni=new I,Ar=new I,Rr=new I,df=new I,hh=new I,uh=new I,dh=new I,fh=new Pt,ph=new Pt,mh=new Pt,cs=class n{constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),jn.subVectors(e,t),s.cross(jn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){jn.subVectors(s,t),Di.subVectors(i,t),ch.subVectors(e,t);let o=jn.dot(jn),a=jn.dot(Di),l=jn.dot(ch),c=Di.dot(Di),h=Di.dot(ch),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,p=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Ni)===null?!1:Ni.x>=0&&Ni.y>=0&&Ni.x+Ni.y<=1}static getInterpolation(e,t,i,s,r,o,a,l){return this.getBarycoord(e,t,i,s,Ni)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ni.x),l.addScaledVector(o,Ni.y),l.addScaledVector(a,Ni.z),l)}static getInterpolatedAttribute(e,t,i,s,r,o){return fh.setScalar(0),ph.setScalar(0),mh.setScalar(0),fh.fromBufferAttribute(e,t),ph.fromBufferAttribute(e,i),mh.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(fh,r.x),o.addScaledVector(ph,r.y),o.addScaledVector(mh,r.z),o}static isFrontFacing(e,t,i,s){return jn.subVectors(i,t),Di.subVectors(e,t),jn.cross(Di).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return jn.subVectors(this.c,this.b),Di.subVectors(this.a,this.b),jn.cross(Di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;Ar.subVectors(s,i),Rr.subVectors(r,i),hh.subVectors(e,i);let l=Ar.dot(hh),c=Rr.dot(hh);if(l<=0&&c<=0)return t.copy(i);uh.subVectors(e,s);let h=Ar.dot(uh),d=Rr.dot(uh);if(h>=0&&d<=h)return t.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(i).addScaledVector(Ar,o);dh.subVectors(e,r);let p=Ar.dot(dh),g=Rr.dot(dh);if(g>=0&&p<=g)return t.copy(r);let y=p*c-l*g;if(y<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(Rr,a);let f=h*g-p*d;if(f<=0&&d-h>=0&&p-g>=0)return df.subVectors(r,s),a=(d-h)/(d-h+(p-g)),t.copy(s).addScaledVector(df,a);let m=1/(f+y+u);return o=y*m,a=u*m,t.copy(i).addScaledVector(Ar,o).addScaledVector(Rr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Qn=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Jn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Jn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Jn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Jn):Jn.fromBufferAttribute(r,o),Jn.applyMatrix4(e.matrixWorld),this.expandByPoint(Jn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wa.copy(i.boundingBox)),wa.applyMatrix4(e.matrixWorld),this.union(wa)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Jn),Jn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(bo),Ea.subVectors(this.max,bo),Cr.subVectors(e.a,bo),Ir.subVectors(e.b,bo),Pr.subVectors(e.c,bo),rs.subVectors(Ir,Cr),os.subVectors(Pr,Ir),zs.subVectors(Cr,Pr);let t=[0,-rs.z,rs.y,0,-os.z,os.y,0,-zs.z,zs.y,rs.z,0,-rs.x,os.z,0,-os.x,zs.z,0,-zs.x,-rs.y,rs.x,0,-os.y,os.x,0,-zs.y,zs.x,0];return!gh(t,Cr,Ir,Pr,Ea)||(t=[1,0,0,0,1,0,0,0,1],!gh(t,Cr,Ir,Pr,Ea))?!1:(Ta.crossVectors(rs,os),t=[Ta.x,Ta.y,Ta.z],gh(t,Cr,Ir,Pr,Ea))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Jn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Jn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Oi=[new I,new I,new I,new I,new I,new I,new I,new I],Jn=new I,wa=new Qn,Cr=new I,Ir=new I,Pr=new I,rs=new I,os=new I,zs=new I,bo=new I,Ea=new I,Ta=new I,Vs=new I;function gh(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Vs.fromArray(n,r);let a=s.x*Math.abs(Vs.x)+s.y*Math.abs(Vs.y)+s.z*Math.abs(Vs.z),l=e.dot(Vs),c=t.dot(Vs),h=i.dot(Vs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var kt=new I,Aa=new Oe,Kg=0,At=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Kg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ih,this.updateRanges=[],this.gpuType=ni,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Aa.fromBufferAttribute(this,t),Aa.applyMatrix3(e),this.setXY(t,Aa.x,Aa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix3(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ur(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=mn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ur(t,this.array)),t}setX(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ur(t,this.array)),t}setY(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ur(t,this.array)),t}setZ(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ur(t,this.array)),t}setW(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=mn(t,this.array),i=mn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=mn(t,this.array),i=mn(i,this.array),s=mn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=mn(t,this.array),i=mn(i,this.array),s=mn(s,this.array),r=mn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ih&&(e.usage=this.usage),e}};var Po=class extends At{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Lo=class extends At{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var it=class extends At{constructor(e,t,i){super(new Float32Array(e),t,i)}},Qg=new Qn,Mo=new I,yh=new I,Zs=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Qg.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Mo.subVectors(e,this.center);let t=Mo.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Mo,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(yh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Mo.copy(e.center).add(yh)),this.expandByPoint(Mo.copy(e.center).sub(yh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},e0=0,Fn=new nt,xh=new Gt,Lr=new I,Rn=new Qn,So=new Qn,jt=new I,zt=class n extends fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:e0++}),this.uuid=Qr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(wg(e)?Lo:Po)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Ge().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Fn.makeRotationFromQuaternion(e),this.applyMatrix4(Fn),this}rotateX(e){return Fn.makeRotationX(e),this.applyMatrix4(Fn),this}rotateY(e){return Fn.makeRotationY(e),this.applyMatrix4(Fn),this}rotateZ(e){return Fn.makeRotationZ(e),this.applyMatrix4(Fn),this}translate(e,t,i){return Fn.makeTranslation(e,t,i),this.applyMatrix4(Fn),this}scale(e,t,i){return Fn.makeScale(e,t,i),this.applyMatrix4(Fn),this}lookAt(e){return xh.lookAt(e),xh.updateMatrix(),this.applyMatrix4(xh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Lr).negate(),this.translate(Lr.x,Lr.y,Lr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new it(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ne("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];Rn.setFromBufferAttribute(r),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ne('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zs);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ne("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let i=this.boundingSphere.center;if(Rn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];So.setFromBufferAttribute(a),this.morphTargetsRelative?(jt.addVectors(Rn.min,So.min),Rn.expandByPoint(jt),jt.addVectors(Rn.max,So.max),Rn.expandByPoint(jt)):(Rn.expandByPoint(So.min),Rn.expandByPoint(So.max))}Rn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)jt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(jt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)jt.fromBufferAttribute(a,c),l&&(Lr.fromBufferAttribute(e,c),jt.add(Lr)),s=Math.max(s,i.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ne('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ne("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new At(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let _=0;_<i.count;_++)a[_]=new I,l[_]=new I;let c=new I,h=new I,d=new I,u=new Oe,p=new Oe,g=new Oe,y=new I,f=new I;function m(_,w,V){c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,w),d.fromBufferAttribute(i,V),u.fromBufferAttribute(r,_),p.fromBufferAttribute(r,w),g.fromBufferAttribute(r,V),h.sub(c),d.sub(c),p.sub(u),g.sub(u);let C=1/(p.x*g.y-g.x*p.y);isFinite(C)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(C),f.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(C),a[_].add(y),a[w].add(y),a[V].add(y),l[_].add(f),l[w].add(f),l[V].add(f))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let _=0,w=x.length;_<w;++_){let V=x[_],C=V.start,O=V.count;for(let k=C,D=C+O;k<D;k+=3)m(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let v=new I,M=new I,T=new I,E=new I;function A(_){T.fromBufferAttribute(s,_),E.copy(T);let w=a[_];v.copy(w),v.sub(T.multiplyScalar(T.dot(w))).normalize(),M.crossVectors(E,w);let C=M.dot(l[_])<0?-1:1;o.setXYZW(_,v.x,v.y,v.z,C)}for(let _=0,w=x.length;_<w;++_){let V=x[_],C=V.start,O=V.count;for(let k=C,D=C+O;k<D;k+=3)A(e.getX(k+0)),A(e.getX(k+1)),A(e.getX(k+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new At(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,p=i.count;u<p;u++)i.setXYZ(u,0,0,0);let s=new I,r=new I,o=new I,a=new I,l=new I,c=new I,h=new I,d=new I;if(e)for(let u=0,p=e.count;u<p;u+=3){let g=e.getX(u+0),y=e.getX(u+1),f=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,f),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,f),a.add(h),l.add(h),c.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(f,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h),p=0,g=0;for(let y=0,f=l.length;y<f;y++){a.isInterleavedBufferAttribute?p=l[y]*a.data.stride+a.offset:p=l[y]*h;for(let m=0;m<h;m++)u[g++]=c[p++]}return new At(u,h,d)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,i);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let u=c[h],p=e(u,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let p=c[d];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}};var t0=0,Bi=class extends fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:t0++}),this.uuid=Qr(),this.name="",this.type="Material",this.blending=Xs,this.side=ki,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$a,this.blendDst=qa,this.blendEquation=hs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=$s,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ch,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ws,this.stencilZFail=Ws,this.stencilZPass=Ws,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Xs&&(i.blending=this.blending),this.side!==ki&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==$a&&(i.blendSrc=this.blendSrc),this.blendDst!==qa&&(i.blendDst=this.blendDst),this.blendEquation!==hs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==$s&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ch&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ws&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ws&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ws&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Ui=new I,_h=new I,Ra=new I,as=new I,vh=new I,Ca=new I,bh=new I,fs=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ui)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ui.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ui.copy(this.origin).addScaledVector(this.direction,t),Ui.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){_h.copy(e).add(t).multiplyScalar(.5),Ra.copy(t).sub(e).normalize(),as.copy(this.origin).sub(_h);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Ra),a=as.dot(this.direction),l=-as.dot(Ra),c=as.lengthSq(),h=Math.abs(1-o*o),d,u,p,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){let y=1/h;d*=y,u*=y,p=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(_h).addScaledVector(Ra,u),p}intersectSphere(e,t){Ui.subVectors(e.center,this.origin);let i=Ui.dot(this.direction),s=Ui.dot(Ui)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Ui)!==null}intersectTriangle(e,t,i,s,r){vh.subVectors(t,e),Ca.subVectors(i,e),bh.crossVectors(vh,Ca);let o=this.direction.dot(bh),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;as.subVectors(this.origin,e);let l=a*this.direction.dot(Ca.crossVectors(as,Ca));if(l<0)return null;let c=a*this.direction.dot(vh.cross(as));if(c<0||l+c>o)return null;let h=-a*as.dot(bh);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},pi=class extends Bi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=Fh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ff=new nt,Hs=new fs,Ia=new Zs,pf=new I,Pa=new I,La=new I,Da=new I,Mh=new I,Na=new I,mf=new I,Oa=new I,ue=class extends Gt{constructor(e=new zt,t=new pi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Na.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(Mh.fromBufferAttribute(d,e),o?Na.addScaledVector(Mh,h):Na.addScaledVector(Mh.sub(t),h))}t.add(Na)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ia.copy(i.boundingSphere),Ia.applyMatrix4(r),Hs.copy(e.ray).recast(e.near),!(Ia.containsPoint(Hs.origin)===!1&&(Hs.intersectSphere(Ia,pf)===null||Hs.origin.distanceToSquared(pf)>(e.far-e.near)**2))&&(ff.copy(r).invert(),Hs.copy(e.ray).applyMatrix4(ff),!(i.boundingBox!==null&&Hs.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Hs)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=u.length;g<y;g++){let f=u[g],m=o[f.materialIndex],x=Math.max(f.start,p.start),v=Math.min(a.count,Math.min(f.start+f.count,p.start+p.count));for(let M=x,T=v;M<T;M+=3){let E=a.getX(M),A=a.getX(M+1),_=a.getX(M+2);s=Ua(this,m,e,i,c,h,d,E,A,_),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(a.count,p.start+p.count);for(let f=g,m=y;f<m;f+=3){let x=a.getX(f),v=a.getX(f+1),M=a.getX(f+2);s=Ua(this,o,e,i,c,h,d,x,v,M),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=u.length;g<y;g++){let f=u[g],m=o[f.materialIndex],x=Math.max(f.start,p.start),v=Math.min(l.count,Math.min(f.start+f.count,p.start+p.count));for(let M=x,T=v;M<T;M+=3){let E=M,A=M+1,_=M+2;s=Ua(this,m,e,i,c,h,d,E,A,_),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let f=g,m=y;f<m;f+=3){let x=f,v=f+1,M=f+2;s=Ua(this,o,e,i,c,h,d,x,v,M),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}};function n0(n,e,t,i,s,r,o,a){let l;if(e.side===xn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,e.side===ki,a),l===null)return null;Oa.copy(a),Oa.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(Oa);return c<t.near||c>t.far?null:{distance:c,point:Oa.clone(),object:n}}function Ua(n,e,t,i,s,r,o,a,l,c){n.getVertexPosition(a,Pa),n.getVertexPosition(l,La),n.getVertexPosition(c,Da);let h=n0(n,e,t,i,Pa,La,Da,mf);if(h){let d=new I;cs.getBarycoord(mf,Pa,La,Da,d),s&&(h.uv=cs.getInterpolatedAttribute(s,a,l,c,d,new Oe)),r&&(h.uv1=cs.getInterpolatedAttribute(r,a,l,c,d,new Oe)),o&&(h.normal=cs.getInterpolatedAttribute(o,a,l,c,d,new I),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new I,materialIndex:0};cs.getNormal(Pa,La,Da,u.normal),h.face=u,h.barycoord=d}return h}var il=class extends an{constructor(e=null,t=1,i=1,s,r,o,a,l,c=Bt,h=Bt,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Sh=new I,i0=new I,s0=new Ge,gn=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=Sh.subVectors(i,t).cross(i0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Sh),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||s0.getNormalMatrix(e),s=this.coplanarPoint(Sh).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Gs=new Zs,r0=new Oe(.5,.5),Fa=new I,Do=class{constructor(e=new gn,t=new gn,i=new gn,s=new gn,r=new gn,o=new gn){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Kn,i=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],p=r[7],g=r[8],y=r[9],f=r[10],m=r[11],x=r[12],v=r[13],M=r[14],T=r[15];if(s[0].setComponents(c-o,p-h,m-g,T-x).normalize(),s[1].setComponents(c+o,p+h,m+g,T+x).normalize(),s[2].setComponents(c+a,p+d,m+y,T+v).normalize(),s[3].setComponents(c-a,p-d,m-y,T-v).normalize(),i)s[4].setComponents(l,u,f,M).normalize(),s[5].setComponents(c-l,p-u,m-f,T-M).normalize();else if(s[4].setComponents(c-l,p-u,m-f,T-M).normalize(),t===Kn)s[5].setComponents(c+l,p+u,m+f,T+M).normalize();else if(t===Ro)s[5].setComponents(l,u,f,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Gs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Gs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Gs)}intersectsSprite(e){Gs.center.set(0,0,0);let t=r0.distanceTo(e.center);return Gs.radius=.7071067811865476+t,Gs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gs)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(Fa.x=s.normal.x>0?e.max.x:e.min.x,Fa.y=s.normal.y>0?e.max.y:e.min.y,Fa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Fa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ps=class extends Bi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},sl=new I,rl=new I,gf=new nt,wo=new fs,ka=new Zs,wh=new I,yf=new I,In=class extends Gt{constructor(e=new zt,t=new ps){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)sl.fromBufferAttribute(t,s-1),rl.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=sl.distanceTo(rl);e.setAttribute("lineDistance",new it(i,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ka.copy(i.boundingSphere),ka.applyMatrix4(s),ka.radius+=r,e.ray.intersectsSphere(ka)===!1)return;gf.copy(s).invert(),wo.copy(e.ray).applyMatrix4(gf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){let p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=p,f=g-1;y<f;y+=c){let m=h.getX(y),x=h.getX(y+1),v=Ba(this,e,wo,l,m,x,y);v&&t.push(v)}if(this.isLineLoop){let y=h.getX(g-1),f=h.getX(p),m=Ba(this,e,wo,l,y,f,g-1);m&&t.push(m)}}else{let p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let y=p,f=g-1;y<f;y+=c){let m=Ba(this,e,wo,l,y,y+1,y);m&&t.push(m)}if(this.isLineLoop){let y=Ba(this,e,wo,l,g-1,p,g-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Ba(n,e,t,i,s,r,o){let a=n.geometry.attributes.position;if(sl.fromBufferAttribute(a,s),rl.fromBufferAttribute(a,r),t.distanceSqToSegment(sl,rl,wh,yf)>i)return;wh.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(wh);if(!(c<e.near||c>e.far))return{distance:c,point:yf.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var xf=new I,_f=new I,No=class extends In{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)xf.fromBufferAttribute(t,s),_f.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+xf.distanceTo(_f);e.setAttribute("lineDistance",new it(i,1))}else Le("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var js=class extends an{constructor(e,t,i,s,r,o,a,l,c,h,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isCompressedTexture=!0,this.image={width:t,height:i},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}};var Oo=class extends an{constructor(e=[],t=Ss,i,s,r,o,a,l,c,h){super(e,t,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}};var ms=class extends an{constructor(e,t,i=ti,s,r,o,a=Bt,l=Bt,c,h=di,d=1){if(h!==di&&h!==ws)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new us(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ol=class extends ms{constructor(e,t=ti,i=Ss,s,r,o=Bt,a=Bt,l,c=di){let h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,i,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Uo=class extends an{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},wt=class n extends zt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],u=0,p=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(d,2));function g(y,f,m,x,v,M,T,E,A,_,w){let V=M/A,C=T/_,O=M/2,k=T/2,D=E/2,N=A+1,H=_+1,z=0,K=0,j=new I;for(let le=0;le<H;le++){let pe=le*C-k;for(let he=0;he<N;he++){let Ve=he*V-O;j[y]=Ve*x,j[f]=pe*v,j[m]=D,c.push(j.x,j.y,j.z),j[y]=0,j[f]=0,j[m]=E>0?1:-1,h.push(j.x,j.y,j.z),d.push(he/A),d.push(1-le/_),z+=1}}for(let le=0;le<_;le++)for(let pe=0;pe<A;pe++){let he=u+pe+N*le,Ve=u+pe+N*(le+1),mt=u+(pe+1)+N*(le+1),Mt=u+(pe+1)+N*le;l.push(he,Ve,Mt),l.push(Ve,mt,Mt),K+=6}a.addGroup(p,K,w),p+=K,u+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Vt=class n extends zt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],p=[],g=0,y=[],f=i/2,m=0;x(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new it(d,3)),this.setAttribute("normal",new it(u,3)),this.setAttribute("uv",new it(p,2));function x(){let M=new I,T=new I,E=0,A=(t-e)/i;for(let _=0;_<=r;_++){let w=[],V=_/r,C=V*(t-e)+e;for(let O=0;O<=s;O++){let k=O/s,D=k*l+a,N=Math.sin(D),H=Math.cos(D);T.x=C*N,T.y=-V*i+f,T.z=C*H,d.push(T.x,T.y,T.z),M.set(N,A,H).normalize(),u.push(M.x,M.y,M.z),p.push(k,1-V),w.push(g++)}y.push(w)}for(let _=0;_<s;_++)for(let w=0;w<r;w++){let V=y[w][_],C=y[w+1][_],O=y[w+1][_+1],k=y[w][_+1];(e>0||w!==0)&&(h.push(V,C,k),E+=3),(t>0||w!==r-1)&&(h.push(C,O,k),E+=3)}c.addGroup(m,E,0),m+=E}function v(M){let T=g,E=new Oe,A=new I,_=0,w=M===!0?e:t,V=M===!0?1:-1;for(let O=1;O<=s;O++)d.push(0,f*V,0),u.push(0,V,0),p.push(.5,.5),g++;let C=g;for(let O=0;O<=s;O++){let D=O/s*l+a,N=Math.cos(D),H=Math.sin(D);A.x=w*H,A.y=f*V,A.z=w*N,d.push(A.x,A.y,A.z),u.push(0,V,0),E.x=N*.5+.5,E.y=H*.5*V+.5,p.push(E.x,E.y),g++}for(let O=0;O<s;O++){let k=T+O,D=C+O;M===!0?h.push(D,D+1,k):h.push(D+1,D,k),_+=3}c.addGroup(m,_,M===!0?1:2),m+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var al=class n extends zt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),c(i),h(),this.setAttribute("position",new it(r,3)),this.setAttribute("normal",new it(r.slice(),3)),this.setAttribute("uv",new it(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let v=new I,M=new I,T=new I;for(let E=0;E<t.length;E+=3)p(t[E+0],v),p(t[E+1],M),p(t[E+2],T),l(v,M,T,x)}function l(x,v,M,T){let E=T+1,A=[];for(let _=0;_<=E;_++){A[_]=[];let w=x.clone().lerp(M,_/E),V=v.clone().lerp(M,_/E),C=E-_;for(let O=0;O<=C;O++)O===0&&_===E?A[_][O]=w:A[_][O]=w.clone().lerp(V,O/C)}for(let _=0;_<E;_++)for(let w=0;w<2*(E-_)-1;w++){let V=Math.floor(w/2);w%2===0?(u(A[_][V+1]),u(A[_+1][V]),u(A[_][V])):(u(A[_][V+1]),u(A[_+1][V+1]),u(A[_+1][V]))}}function c(x){let v=new I;for(let M=0;M<r.length;M+=3)v.x=r[M+0],v.y=r[M+1],v.z=r[M+2],v.normalize().multiplyScalar(x),r[M+0]=v.x,r[M+1]=v.y,r[M+2]=v.z}function h(){let x=new I;for(let v=0;v<r.length;v+=3){x.x=r[v+0],x.y=r[v+1],x.z=r[v+2];let M=f(x)/2/Math.PI+.5,T=m(x)/Math.PI+.5;o.push(M,1-T)}g(),d()}function d(){for(let x=0;x<o.length;x+=6){let v=o[x+0],M=o[x+2],T=o[x+4],E=Math.max(v,M,T),A=Math.min(v,M,T);E>.9&&A<.1&&(v<.2&&(o[x+0]+=1),M<.2&&(o[x+2]+=1),T<.2&&(o[x+4]+=1))}}function u(x){r.push(x.x,x.y,x.z)}function p(x,v){let M=x*3;v.x=e[M+0],v.y=e[M+1],v.z=e[M+2]}function g(){let x=new I,v=new I,M=new I,T=new I,E=new Oe,A=new Oe,_=new Oe;for(let w=0,V=0;w<r.length;w+=9,V+=6){x.set(r[w+0],r[w+1],r[w+2]),v.set(r[w+3],r[w+4],r[w+5]),M.set(r[w+6],r[w+7],r[w+8]),E.set(o[V+0],o[V+1]),A.set(o[V+2],o[V+3]),_.set(o[V+4],o[V+5]),T.copy(x).add(v).add(M).divideScalar(3);let C=f(T);y(E,V+0,x,C),y(A,V+2,v,C),y(_,V+4,M,C)}}function y(x,v,M,T){T<0&&x.x===1&&(o[v]=x.x-1),M.x===0&&M.z===0&&(o[v]=T/2/Math.PI+.5)}function f(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.detail)}};var gs=class n extends al{constructor(e=1,t=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},zi=class n extends zt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,d=e/a,u=t/l,p=[],g=[],y=[],f=[];for(let m=0;m<h;m++){let x=m*u-o;for(let v=0;v<c;v++){let M=v*d-r;g.push(M,-x,0),y.push(0,0,1),f.push(v/a),f.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<a;x++){let v=x+c*m,M=x+c*(m+1),T=x+1+c*(m+1),E=x+1+c*m;p.push(v,M,E),p.push(M,T,E)}this.setIndex(p),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(y,3)),this.setAttribute("uv",new it(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};var Js=class n extends zt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new I,u=new I,p=[],g=[],y=[],f=[];for(let m=0;m<=i;m++){let x=[],v=m/i,M=0;m===0&&o===0?M=.5/t:m===i&&l===Math.PI&&(M=-.5/t);for(let T=0;T<=t;T++){let E=T/t;d.x=-e*Math.cos(s+E*r)*Math.sin(o+v*a),d.y=e*Math.cos(o+v*a),d.z=e*Math.sin(s+E*r)*Math.sin(o+v*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),y.push(u.x,u.y,u.z),f.push(E+M,1-v),x.push(c++)}h.push(x)}for(let m=0;m<i;m++)for(let x=0;x<t;x++){let v=h[m][x+1],M=h[m][x],T=h[m+1][x],E=h[m+1][x+1];(m!==0||o>0)&&p.push(v,M,E),(m!==i-1||l<Math.PI)&&p.push(M,T,E)}this.setIndex(p),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(y,3)),this.setAttribute("uv",new it(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Vi=class n extends zt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let l=[],c=[],h=[],d=[],u=new I,p=new I,g=new I;for(let y=0;y<=i;y++){let f=o+y/i*a;for(let m=0;m<=s;m++){let x=m/s*r;p.x=(e+t*Math.cos(f))*Math.cos(x),p.y=(e+t*Math.cos(f))*Math.sin(x),p.z=t*Math.sin(f),c.push(p.x,p.y,p.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),g.subVectors(p,u).normalize(),h.push(g.x,g.y,g.z),d.push(m/s),d.push(y/i)}}for(let y=1;y<=i;y++)for(let f=1;f<=s;f++){let m=(s+1)*y+f-1,x=(s+1)*(y-1)+f-1,v=(s+1)*(y-1)+f,M=(s+1)*y+f;l.push(m,x,M),l.push(x,v,M)}this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};function nr(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function cn(n){let e={};for(let t=0;t<n.length;t++){let i=nr(n[t]);for(let s in i)e[s]=i[s]}return e}function o0(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function iu(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}var ap={clone:nr,merge:cn},a0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,l0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Pn=class extends Bi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=a0,this.fragmentShader=l0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=nr(e.uniforms),this.uniformsGroups=o0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},ll=class extends Pn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Fo=class extends Bi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Qh,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var cl=class extends Bi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Yf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},hl=class extends Bi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function za(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}var ys=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ul=class extends ys{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Th,endingEnd:Th}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ah:r=e,a=2*t-i;break;case Rh:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Ah:o=e,l=2*i-t;break;case Rh:o=1,l=i+s[1]-s[0];break;default:o=e-1,l=t}let c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,p=this._weightNext,g=(i-t)/(s-t),y=g*g,f=y*g,m=-u*f+2*u*y-u*g,x=(1+u)*f+(-1.5-2*u)*y+(-.5+u)*g+1,v=(-1-p)*f+(1.5+p)*y+.5*g,M=p*f-p*y;for(let T=0;T!==a;++T)r[T]=m*o[h+T]+x*o[c+T]+v*o[l+T]+M*o[d+T];return r}},dl=class extends ys{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(i-t)/(s-t),d=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*d+o[l+u]*h;return r}},fl=class extends ys{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},pl=class extends ys{interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this.settings||this.DefaultSettings_,d=h.inTangents,u=h.outTangents;if(!d||!u){let y=(i-t)/(s-t),f=1-y;for(let m=0;m!==a;++m)r[m]=o[c+m]*f+o[l+m]*y;return r}let p=a*2,g=e-1;for(let y=0;y!==a;++y){let f=o[c+y],m=o[l+y],x=g*p+y*2,v=u[x],M=u[x+1],T=e*p+y*2,E=d[T],A=d[T+1],_=(i-t)/(s-t),w,V,C,O,k;for(let D=0;D<8;D++){w=_*_,V=w*_,C=1-_,O=C*C,k=O*C;let H=k*t+3*O*_*v+3*C*w*E+V*s-i;if(Math.abs(H)<1e-10)break;let z=3*O*(v-t)+6*C*_*(E-v)+3*w*(s-E);if(Math.abs(z)<1e-10)break;_=_-H/z,_=Math.max(0,Math.min(1,_))}r[y]=k*f+3*O*_*M+3*C*w*A+V*m}return r}},Ln=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=za(t,this.TimeBufferType),this.values=za(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:za(e.times,Array),values:za(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new fl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new dl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ul(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new pl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case qs:t=this.InterpolantFactoryMethodDiscrete;break;case zr:t=this.InterpolantFactoryMethodLinear;break;case Wa:t=this.InterpolantFactoryMethodSmooth;break;case Eh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Le("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qs;case this.InterpolantFactoryMethodLinear:return zr;case this.InterpolantFactoryMethodSmooth:return Wa;case this.InterpolantFactoryMethodBezier:return Eh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ne("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Ne("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){Ne("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){Ne("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&Eg(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Ne("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Wa,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let d=a*i,u=d-i,p=d+i;for(let g=0;g!==i;++g){let y=t[d+g];if(y!==t[u+g]||y!==t[p+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*i,u=o*i;for(let p=0;p!==i;++p)t[u+p]=t[d+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Ln.prototype.ValueTypeName="";Ln.prototype.TimeBufferType=Float32Array;Ln.prototype.ValueBufferType=Float32Array;Ln.prototype.DefaultInterpolation=zr;var xs=class extends Ln{constructor(e,t,i){super(e,t,i)}};xs.prototype.ValueTypeName="bool";xs.prototype.ValueBufferType=Array;xs.prototype.DefaultInterpolation=qs;xs.prototype.InterpolantFactoryMethodLinear=void 0;xs.prototype.InterpolantFactoryMethodSmooth=void 0;var ml=class extends Ln{constructor(e,t,i,s){super(e,t,i,s)}};ml.prototype.ValueTypeName="color";var gl=class extends Ln{constructor(e,t,i,s){super(e,t,i,s)}};gl.prototype.ValueTypeName="number";var yl=class extends ys{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)dt.slerpFlat(r,0,o,c-a,o,c,l);return r}},ko=class extends Ln{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new yl(this.times,this.values,this.getValueSize(),e)}};ko.prototype.ValueTypeName="quaternion";ko.prototype.InterpolantFactoryMethodSmooth=void 0;var _s=class extends Ln{constructor(e,t,i){super(e,t,i)}};_s.prototype.ValueTypeName="string";_s.prototype.ValueBufferType=Array;_s.prototype.DefaultInterpolation=qs;_s.prototype.InterpolantFactoryMethodLinear=void 0;_s.prototype.InterpolantFactoryMethodSmooth=void 0;var xl=class extends Ln{constructor(e,t,i,s){super(e,t,i,s)}};xl.prototype.ValueTypeName="vector";var Xa={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(vf(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!vf(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function vf(n){try{let e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var _l=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let p=c[d],g=c[d+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},lp=new _l,qr=class{constructor(e){this.manager=e!==void 0?e:lp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};qr.DEFAULT_MATERIAL_NAME="__DEFAULT";var Dr=new WeakMap,vl=class extends qr{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Xa.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let d=Dr.get(o);d===void 0&&(d=[],Dr.set(o,d)),d.push({onLoad:t,onError:s})}return o}let a=Vr("img");function l(){h(),t&&t(this);let d=Dr.get(this)||[];for(let u=0;u<d.length;u++){let p=d[u];p.onLoad&&p.onLoad(this)}Dr.delete(this),r.manager.itemEnd(e)}function c(d){h(),s&&s(d),Xa.remove(`image:${e}`);let u=Dr.get(this)||[];for(let p=0;p<u.length;p++){let g=u[p];g.onError&&g.onError(d)}Dr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Xa.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}};var Bo=class extends qr{constructor(e){super(e)}load(e,t,i,s){let r=new an,o=new vl(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}},bl=class extends Gt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},zo=class extends bl{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Gt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}};var Va=new I,Ha=new dt,ui=new I,Vo=class extends Gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new nt,this.projectionMatrix=new nt,this.projectionMatrixInverse=new nt,this.coordinateSystem=Kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Va,Ha,ui),ui.x===1&&ui.y===1&&ui.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Va,Ha,ui.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Va,Ha,ui),ui.x===1&&ui.y===1&&ui.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Va,Ha,ui.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ls=new I,bf=new Oe,Mf=new Oe,on=class extends Vo{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Gr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Eo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Gr*2*Math.atan(Math.tan(Eo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ls.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ls.x,ls.y).multiplyScalar(-e/ls.z),ls.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ls.x,ls.y).multiplyScalar(-e/ls.z)}getViewSize(e,t){return this.getViewBounds(e,bf,Mf),t.subVectors(Mf,bf)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Eo*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Ho=class extends Vo{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var Nr=-90,Or=1,Ml=class extends Gt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new on(Nr,Or,e,t);s.layers=this.layers,this.add(s);let r=new on(Nr,Or,e,t);r.layers=this.layers,this.add(r);let o=new on(Nr,Or,e,t);o.layers=this.layers,this.add(o);let a=new on(Nr,Or,e,t);a.layers=this.layers,this.add(a);let l=new on(Nr,Or,e,t);l.layers=this.layers,this.add(l);let c=new on(Nr,Or,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Kn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ro)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let f=!1;e.isWebGLRenderer===!0?f=e.state.buffers.depth.getReversed():f=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Sl=class extends on{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var su="\\[\\]\\.:\\/",c0=new RegExp("["+su+"]","g"),ru="[^"+su+"]",h0="[^"+su.replace("\\.","")+"]",u0=/((?:WC+[\/:])*)/.source.replace("WC",ru),d0=/(WCOD+)?/.source.replace("WCOD",h0),f0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ru),p0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ru),m0=new RegExp("^"+u0+d0+f0+p0+"$"),g0=["material","materials","bones","map"],Ph=class{constructor(e,t,i){let s=i||rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},rt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(c0,"")}static parseTrackName(e){let t=m0.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);g0.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=i(a.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Le("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){Ne("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ne("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ne("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ne("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ne("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Ne("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){Ne("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;Ne("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ne("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ne("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};rt.Composite=Ph;rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};rt.prototype.GetterByBindingType=[rt.prototype._getValue_direct,rt.prototype._getValue_array,rt.prototype._getValue_arrayElement,rt.prototype._getValue_toArray];rt.prototype.SetterByBindingTypeAndVersioning=[[rt.prototype._setValue_direct,rt.prototype._setValue_direct_setNeedsUpdate,rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[rt.prototype._setValue_array,rt.prototype._setValue_array_setNeedsUpdate,rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[rt.prototype._setValue_arrayElement,rt.prototype._setValue_arrayElement_setNeedsUpdate,rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[rt.prototype._setValue_fromArray,rt.prototype._setValue_fromArray_setNeedsUpdate,rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var wS=new Float32Array(1);var Sf=new nt,vs=class{constructor(e,t,i=0,s=1/0){this.ray=new fs(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Xr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ne("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Sf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Sf),this}intersectObject(e,t=!0,i=[]){return Lh(e,this,i,t),i.sort(wf),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Lh(e[s],this,i,t);return i.sort(wf),i}};function wf(n,e){return n.distance-e.distance}function Lh(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)Lh(r[o],e,t,!0)}}var Yr=class{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Go=class extends No{constructor(e=10,t=10,i=4473924,s=8947848){i=new ze(i),s=new ze(s);let r=t/2,o=e/t,a=e/2,l=[],c=[];for(let u=0,p=0,g=-a;u<=t;u++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);let y=u===r?i:s;y.toArray(c,p),p+=3,y.toArray(c,p),p+=3,y.toArray(c,p),p+=3,y.toArray(c,p),p+=3}let h=new zt;h.setAttribute("position",new it(l,3)),h.setAttribute("color",new it(c,3));let d=new ps({vertexColors:!0,toneMapped:!1});super(h,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var Ga=new Qn,Wo=class extends No{constructor(e,t=16776960){let i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=new Float32Array(24),r=new zt;r.setIndex(new At(i,1)),r.setAttribute("position",new At(s,3)),super(r,new ps({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&Ga.setFromObject(this.object),Ga.isEmpty())return;let e=Ga.min,t=Ga.max,i=this.geometry.attributes.position,s=i.array;s[0]=t.x,s[1]=t.y,s[2]=t.z,s[3]=e.x,s[4]=t.y,s[5]=t.z,s[6]=e.x,s[7]=e.y,s[8]=t.z,s[9]=t.x,s[10]=e.y,s[11]=t.z,s[12]=t.x,s[13]=t.y,s[14]=e.z,s[15]=e.x,s[16]=t.y,s[17]=e.z,s[18]=e.x,s[19]=e.y,s[20]=e.z,s[21]=t.x,s[22]=e.y,s[23]=e.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}};var Ks=class extends fi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Le("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function ou(n,e,t,i){let s=y0(i);switch(t){case jh:return n*e;case Kh:return n*e/s.components*s.byteLength;case Il:return n*e/s.components*s.byteLength;case tr:return n*e*2/s.components*s.byteLength;case Pl:return n*e*2/s.components*s.byteLength;case Jh:return n*e*3/s.components*s.byteLength;case bn:return n*e*4/s.components*s.byteLength;case Ll:return n*e*4/s.components*s.byteLength;case qo:case Yo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Zo:case jo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Nl:case Ul:return Math.max(n,16)*Math.max(e,8)/4;case Dl:case Ol:return Math.max(n,8)*Math.max(e,8)/2;case Fl:case kl:case zl:case Vl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Bl:case Hl:case Gl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Xl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case $l:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ql:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Yl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Zl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case jl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Jl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Kl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ql:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ec:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case tc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case nc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case ic:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case sc:case rc:case oc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case ac:case lc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case cc:case hc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function y0(n){switch(n){case Dn:case $h:return{byteLength:1,components:1};case Jr:case qh:case yi:return{byteLength:2,components:1};case Rl:case Cl:return{byteLength:2,components:4};case ti:case Al:case ni:return{byteLength:4,components:1};case Yh:case Zh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"183"}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="183");function Pp(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function x0(n){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,d=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){let h=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){let g=d[u],y=d[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++u,d[u]=y)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){let y=d[p];n.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var _0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,v0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,b0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,M0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,S0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,w0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,E0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,T0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,A0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,R0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,C0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,I0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,P0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,L0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,D0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,N0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,O0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,U0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,F0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,k0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,B0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,z0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,V0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,H0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,G0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,W0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,X0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,q0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Y0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Z0="gl_FragColor = linearToOutputTexel( gl_FragColor );",j0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,J0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,K0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Q0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ey=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ty=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ny=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,iy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ry=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,oy=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ay=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ly=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cy=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,hy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,uy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,dy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,py=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,my=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,yy=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,xy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,_y=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,vy=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,by=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,My=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ey=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ty=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ay=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ry=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Iy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Py=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ly=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Dy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ny=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Oy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Fy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ky=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,By=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Vy=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Hy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$y=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qy=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Yy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ky=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Qy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ex=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,tx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,nx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ix=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ox=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ax=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,lx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,cx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ux=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,dx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,fx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,px=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,mx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,yx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,xx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_x=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ex=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Tx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ax=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Rx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Cx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ix=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Px=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Lx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Dx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ox=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ux=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Fx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Bx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,zx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Gx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$x=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,qx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Yx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:_0,alphahash_pars_fragment:v0,alphamap_fragment:b0,alphamap_pars_fragment:M0,alphatest_fragment:S0,alphatest_pars_fragment:w0,aomap_fragment:E0,aomap_pars_fragment:T0,batching_pars_vertex:A0,batching_vertex:R0,begin_vertex:C0,beginnormal_vertex:I0,bsdfs:P0,iridescence_fragment:L0,bumpmap_pars_fragment:D0,clipping_planes_fragment:N0,clipping_planes_pars_fragment:O0,clipping_planes_pars_vertex:U0,clipping_planes_vertex:F0,color_fragment:k0,color_pars_fragment:B0,color_pars_vertex:z0,color_vertex:V0,common:H0,cube_uv_reflection_fragment:G0,defaultnormal_vertex:W0,displacementmap_pars_vertex:X0,displacementmap_vertex:$0,emissivemap_fragment:q0,emissivemap_pars_fragment:Y0,colorspace_fragment:Z0,colorspace_pars_fragment:j0,envmap_fragment:J0,envmap_common_pars_fragment:K0,envmap_pars_fragment:Q0,envmap_pars_vertex:ey,envmap_physical_pars_fragment:uy,envmap_vertex:ty,fog_vertex:ny,fog_pars_vertex:iy,fog_fragment:sy,fog_pars_fragment:ry,gradientmap_pars_fragment:oy,lightmap_pars_fragment:ay,lights_lambert_fragment:ly,lights_lambert_pars_fragment:cy,lights_pars_begin:hy,lights_toon_fragment:dy,lights_toon_pars_fragment:fy,lights_phong_fragment:py,lights_phong_pars_fragment:my,lights_physical_fragment:gy,lights_physical_pars_fragment:yy,lights_fragment_begin:xy,lights_fragment_maps:_y,lights_fragment_end:vy,logdepthbuf_fragment:by,logdepthbuf_pars_fragment:My,logdepthbuf_pars_vertex:Sy,logdepthbuf_vertex:wy,map_fragment:Ey,map_pars_fragment:Ty,map_particle_fragment:Ay,map_particle_pars_fragment:Ry,metalnessmap_fragment:Cy,metalnessmap_pars_fragment:Iy,morphinstance_vertex:Py,morphcolor_vertex:Ly,morphnormal_vertex:Dy,morphtarget_pars_vertex:Ny,morphtarget_vertex:Oy,normal_fragment_begin:Uy,normal_fragment_maps:Fy,normal_pars_fragment:ky,normal_pars_vertex:By,normal_vertex:zy,normalmap_pars_fragment:Vy,clearcoat_normal_fragment_begin:Hy,clearcoat_normal_fragment_maps:Gy,clearcoat_pars_fragment:Wy,iridescence_pars_fragment:Xy,opaque_fragment:$y,packing:qy,premultiplied_alpha_fragment:Yy,project_vertex:Zy,dithering_fragment:jy,dithering_pars_fragment:Jy,roughnessmap_fragment:Ky,roughnessmap_pars_fragment:Qy,shadowmap_pars_fragment:ex,shadowmap_pars_vertex:tx,shadowmap_vertex:nx,shadowmask_pars_fragment:ix,skinbase_vertex:sx,skinning_pars_vertex:rx,skinning_vertex:ox,skinnormal_vertex:ax,specularmap_fragment:lx,specularmap_pars_fragment:cx,tonemapping_fragment:hx,tonemapping_pars_fragment:ux,transmission_fragment:dx,transmission_pars_fragment:fx,uv_pars_fragment:px,uv_pars_vertex:mx,uv_vertex:gx,worldpos_vertex:yx,background_vert:xx,background_frag:_x,backgroundCube_vert:vx,backgroundCube_frag:bx,cube_vert:Mx,cube_frag:Sx,depth_vert:wx,depth_frag:Ex,distance_vert:Tx,distance_frag:Ax,equirect_vert:Rx,equirect_frag:Cx,linedashed_vert:Ix,linedashed_frag:Px,meshbasic_vert:Lx,meshbasic_frag:Dx,meshlambert_vert:Nx,meshlambert_frag:Ox,meshmatcap_vert:Ux,meshmatcap_frag:Fx,meshnormal_vert:kx,meshnormal_frag:Bx,meshphong_vert:zx,meshphong_frag:Vx,meshphysical_vert:Hx,meshphysical_frag:Gx,meshtoon_vert:Wx,meshtoon_frag:Xx,points_vert:$x,points_frag:qx,shadow_vert:Yx,shadow_frag:Zx,sprite_vert:jx,sprite_frag:Jx},ce={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},_i={basic:{uniforms:cn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:cn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new ze(0)},envMapIntensity:{value:1}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:cn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:cn([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:cn([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new ze(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:cn([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:cn([ce.points,ce.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:cn([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:cn([ce.common,ce.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:cn([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:cn([ce.sprite,ce.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distance:{uniforms:cn([ce.common,ce.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distance_vert,fragmentShader:Xe.distance_frag},shadow:{uniforms:cn([ce.lights,ce.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};_i.physical={uniforms:cn([_i.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var fc={r:0,b:0,g:0},ir=new yn,Kx=new nt;function Qx(n,e,t,i,s,r){let o=new ze(0),a=s===!0?0:1,l,c,h=null,d=0,u=null;function p(x){let v=x.isScene===!0?x.background:null;if(v&&v.isTexture){let M=x.backgroundBlurriness>0;v=e.get(v,M)}return v}function g(x){let v=!1,M=p(x);M===null?f(o,a):M&&M.isColor&&(f(M,1),v=!0);let T=n.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||v)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function y(x,v){let M=p(v);M&&(M.isCubeTexture||M.mapping===$o)?(c===void 0&&(c=new ue(new wt(1,1,1),new Pn({name:"BackgroundCubeMaterial",uniforms:nr(_i.backgroundCube.uniforms),vertexShader:_i.backgroundCube.vertexShader,fragmentShader:_i.backgroundCube.fragmentShader,side:xn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),ir.copy(v.backgroundRotation),ir.x*=-1,ir.y*=-1,ir.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ir.y*=-1,ir.z*=-1),c.material.uniforms.envMap.value=M,c.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Kx.makeRotationFromEuler(ir)),c.material.toneMapped=Ke.getTransfer(M.colorSpace)!==ot,(h!==M||d!==M.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,h=M,d=M.version,u=n.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new ue(new zi(2,2),new Pn({name:"BackgroundMaterial",uniforms:nr(_i.background.uniforms),vertexShader:_i.background.vertexShader,fragmentShader:_i.background.fragmentShader,side:ki,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=Ke.getTransfer(M.colorSpace)!==ot,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,h=M,d=M.version,u=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function f(x,v){x.getRGB(fc,iu(n)),t.buffers.color.setClear(fc.r,fc.g,fc.b,v,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,v=1){o.set(x),a=v,f(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,f(o,a)},render:g,addToRenderList:y,dispose:m}}function e_(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=u(null),r=s,o=!1;function a(C,O,k,D,N){let H=!1,z=d(C,D,k,O);r!==z&&(r=z,c(r.object)),H=p(C,D,k,N),H&&g(C,D,k,N),N!==null&&e.update(N,n.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,M(C,O,k,D),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return n.createVertexArray()}function c(C){return n.bindVertexArray(C)}function h(C){return n.deleteVertexArray(C)}function d(C,O,k,D){let N=D.wireframe===!0,H=i[O.id];H===void 0&&(H={},i[O.id]=H);let z=C.isInstancedMesh===!0?C.id:0,K=H[z];K===void 0&&(K={},H[z]=K);let j=K[k.id];j===void 0&&(j={},K[k.id]=j);let le=j[N];return le===void 0&&(le=u(l()),j[N]=le),le}function u(C){let O=[],k=[],D=[];for(let N=0;N<t;N++)O[N]=0,k[N]=0,D[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:k,attributeDivisors:D,object:C,attributes:{},index:null}}function p(C,O,k,D){let N=r.attributes,H=O.attributes,z=0,K=k.getAttributes();for(let j in K)if(K[j].location>=0){let pe=N[j],he=H[j];if(he===void 0&&(j==="instanceMatrix"&&C.instanceMatrix&&(he=C.instanceMatrix),j==="instanceColor"&&C.instanceColor&&(he=C.instanceColor)),pe===void 0||pe.attribute!==he||he&&pe.data!==he.data)return!0;z++}return r.attributesNum!==z||r.index!==D}function g(C,O,k,D){let N={},H=O.attributes,z=0,K=k.getAttributes();for(let j in K)if(K[j].location>=0){let pe=H[j];pe===void 0&&(j==="instanceMatrix"&&C.instanceMatrix&&(pe=C.instanceMatrix),j==="instanceColor"&&C.instanceColor&&(pe=C.instanceColor));let he={};he.attribute=pe,pe&&pe.data&&(he.data=pe.data),N[j]=he,z++}r.attributes=N,r.attributesNum=z,r.index=D}function y(){let C=r.newAttributes;for(let O=0,k=C.length;O<k;O++)C[O]=0}function f(C){m(C,0)}function m(C,O){let k=r.newAttributes,D=r.enabledAttributes,N=r.attributeDivisors;k[C]=1,D[C]===0&&(n.enableVertexAttribArray(C),D[C]=1),N[C]!==O&&(n.vertexAttribDivisor(C,O),N[C]=O)}function x(){let C=r.newAttributes,O=r.enabledAttributes;for(let k=0,D=O.length;k<D;k++)O[k]!==C[k]&&(n.disableVertexAttribArray(k),O[k]=0)}function v(C,O,k,D,N,H,z){z===!0?n.vertexAttribIPointer(C,O,k,N,H):n.vertexAttribPointer(C,O,k,D,N,H)}function M(C,O,k,D){y();let N=D.attributes,H=k.getAttributes(),z=O.defaultAttributeValues;for(let K in H){let j=H[K];if(j.location>=0){let le=N[K];if(le===void 0&&(K==="instanceMatrix"&&C.instanceMatrix&&(le=C.instanceMatrix),K==="instanceColor"&&C.instanceColor&&(le=C.instanceColor)),le!==void 0){let pe=le.normalized,he=le.itemSize,Ve=e.get(le);if(Ve===void 0)continue;let mt=Ve.buffer,Mt=Ve.type,Z=Ve.bytesPerElement,se=Mt===n.INT||Mt===n.UNSIGNED_INT||le.gpuType===Al;if(le.isInterleavedBufferAttribute){let ae=le.data,We=ae.stride,De=le.offset;if(ae.isInstancedInterleavedBuffer){for(let ke=0;ke<j.locationSize;ke++)m(j.location+ke,ae.meshPerAttribute);C.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let ke=0;ke<j.locationSize;ke++)f(j.location+ke);n.bindBuffer(n.ARRAY_BUFFER,mt);for(let ke=0;ke<j.locationSize;ke++)v(j.location+ke,he/j.locationSize,Mt,pe,We*Z,(De+he/j.locationSize*ke)*Z,se)}else{if(le.isInstancedBufferAttribute){for(let ae=0;ae<j.locationSize;ae++)m(j.location+ae,le.meshPerAttribute);C.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let ae=0;ae<j.locationSize;ae++)f(j.location+ae);n.bindBuffer(n.ARRAY_BUFFER,mt);for(let ae=0;ae<j.locationSize;ae++)v(j.location+ae,he/j.locationSize,Mt,pe,he*Z,he/j.locationSize*ae*Z,se)}}else if(z!==void 0){let pe=z[K];if(pe!==void 0)switch(pe.length){case 2:n.vertexAttrib2fv(j.location,pe);break;case 3:n.vertexAttrib3fv(j.location,pe);break;case 4:n.vertexAttrib4fv(j.location,pe);break;default:n.vertexAttrib1fv(j.location,pe)}}}}x()}function T(){w();for(let C in i){let O=i[C];for(let k in O){let D=O[k];for(let N in D){let H=D[N];for(let z in H)h(H[z].object),delete H[z];delete D[N]}}delete i[C]}}function E(C){if(i[C.id]===void 0)return;let O=i[C.id];for(let k in O){let D=O[k];for(let N in D){let H=D[N];for(let z in H)h(H[z].object),delete H[z];delete D[N]}}delete i[C.id]}function A(C){for(let O in i){let k=i[O];for(let D in k){let N=k[D];if(N[C.id]===void 0)continue;let H=N[C.id];for(let z in H)h(H[z].object),delete H[z];delete N[C.id]}}}function _(C){for(let O in i){let k=i[O],D=C.isInstancedMesh===!0?C.id:0,N=k[D];if(N!==void 0){for(let H in N){let z=N[H];for(let K in z)h(z[K].object),delete z[K];delete N[H]}delete k[D],Object.keys(k).length===0&&delete i[O]}}}function w(){V(),o=!0,r!==s&&(r=s,c(r.object))}function V(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:w,resetDefaultState:V,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfObject:_,releaseStatesOfProgram:A,initAttributes:y,enableAttribute:f,disableUnusedAttributes:x}}function t_(n,e,t){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function o(c,h,d){d!==0&&(n.drawArraysInstanced(i,c,h,d),t.update(h,i,d))}function a(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];t.update(p,i,1)}function l(c,h,d,u){if(d===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,h,0,u,0,d);let g=0;for(let y=0;y<d;y++)g+=h[y]*u[y];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function n_(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==bn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let _=A===yi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Dn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ni&&!_)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Le("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),f=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:f,maxAttributes:m,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:M,maxSamples:T,samples:E}}function i_(n){let e=this,t=null,i=0,s=!1,r=!1,o=new gn,a=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let p=d.length!==0||u||i!==0||s;return s=u,i=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,p){let g=d.clippingPlanes,y=d.clipIntersection,f=d.clipShadows,m=n.get(d);if(!s||g===null||g.length===0||r&&!f)r?h(null):c();else{let x=r?0:i,v=x*4,M=m.clippingState||null;l.value=M,M=h(g,u,v,p);for(let T=0;T!==v;++T)M[T]=t[T];m.clippingState=M,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,u,p,g){let y=d!==null?d.length:0,f=null;if(y!==0){if(f=l.value,g!==!0||f===null){let m=p+y*4,x=u.matrixWorldInverse;a.getNormalMatrix(x),(f===null||f.length<m)&&(f=new Float32Array(m));for(let v=0,M=p;v!==y;++v,M+=4)o.copy(d[v]).applyMatrix4(x,a),o.normal.toArray(f,M),f[M+3]=o.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,f}}var Es=4,cp=[.125,.215,.35,.446,.526,.582],rr=20,s_=256,Jo=new Ho,hp=new ze,au=null,lu=0,cu=0,hu=!1,r_=new I,mc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){let{size:o=256,position:a=r_}=r;au=this._renderer.getRenderTarget(),lu=this._renderer.getActiveCubeFace(),cu=this._renderer.getActiveMipmapLevel(),hu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(au,lu,cu),this._renderer.xr.enabled=hu,e.scissorTest=!1,eo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ss||e.mapping===Qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),au=this._renderer.getRenderTarget(),lu=this._renderer.getActiveCubeFace(),cu=this._renderer.getActiveMipmapLevel(),hu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Ht,minFilter:Ht,generateMipmaps:!1,type:yi,format:bn,colorSpace:Ys,depthBuffer:!1},s=up(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=up(e,t,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=o_(r)),this._blurMaterial=l_(r,e,t),this._ggxMaterial=a_(r,e,t)}return s}_compileMaterial(e){let t=new ue(new zt,e);this._renderer.compile(t,Jo)}_sceneToCubeUV(e,t,i,s,r){let l=new on(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(hp),d.toneMapping=ei,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ue(new wt,new pi({name:"PMREM.Background",side:xn,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,f=y.material,m=!1,x=e.background;x?x.isColor&&(f.color.copy(x),e.background=null,m=!0):(f.color.copy(hp),m=!0);for(let v=0;v<6;v++){let M=v%3;M===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[v],r.y,r.z)):M===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[v]));let T=this._cubeSize;eo(s,M*T,v>2?T:0,T,T),d.setRenderTarget(s),m&&d.render(y,l),d.render(e,l)}d.toneMapping=p,d.autoClear=u,e.background=x}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Ss||e.mapping===Qs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=fp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dp());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;eo(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Jo)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=0+c*1.25,p=d*u,{_lodMax:g}=this,y=this._sizeLods[i],f=3*y*(i>g-Es?i-g+Es:0),m=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-t,eo(r,f,m,3*y,2*y),s.setRenderTarget(r),s.render(a,Jo),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-i,eo(e,f,m,3*y,2*y),s.setRenderTarget(e),s.render(a,Jo)}_blur(e,t,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Ne("blur direction must be either latitudinal or longitudinal!");let h=3,d=this._lodMeshes[s];d.material=c;let u=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*rr-1),y=r/g,f=isFinite(r)?1+Math.floor(h*y):rr;f>rr&&Le(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${rr}`);let m=[],x=0;for(let A=0;A<rr;++A){let _=A/y,w=Math.exp(-_*_/2);m.push(w),A===0?x+=w:A<f&&(x+=2*w)}for(let A=0;A<m.length;A++)m[A]=m[A]/x;u.envMap.value=e.texture,u.samples.value=f,u.weights.value=m,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);let{_lodMax:v}=this;u.dTheta.value=g,u.mipInt.value=v-i;let M=this._sizeLods[s],T=3*M*(s>v-Es?s-v+Es:0),E=4*(this._cubeSize-M);eo(t,T,E,3*M,2*M),l.setRenderTarget(t),l.render(d,Jo)}};function o_(n){let e=[],t=[],i=[],s=n,r=n-Es+1+cp.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>n-Es?l=cp[o-n+Es-1]:o===0&&(l=0),t.push(l);let c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,y=3,f=2,m=1,x=new Float32Array(y*g*p),v=new Float32Array(f*g*p),M=new Float32Array(m*g*p);for(let E=0;E<p;E++){let A=E%3*2/3-1,_=E>2?0:-1,w=[A,_,0,A+2/3,_,0,A+2/3,_+1,0,A,_,0,A+2/3,_+1,0,A,_+1,0];x.set(w,y*g*E),v.set(u,f*g*E);let V=[E,E,E,E,E,E];M.set(V,m*g*E)}let T=new zt;T.setAttribute("position",new At(x,y)),T.setAttribute("uv",new At(v,f)),T.setAttribute("faceIndex",new At(M,m)),i.push(new ue(T,null)),s>Es&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function up(n,e,t){let i=new Cn(n,e,t);return i.texture.mapping=$o,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function eo(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function a_(n,e,t){return new Pn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:s_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:xc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function l_(n,e,t){let i=new Float32Array(rr),s=new I(0,1,0);return new Pn({name:"SphericalGaussianBlur",defines:{n:rr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:xc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function dp(){return new Pn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function fp(){return new Pn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function xc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var gc=class extends Cn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Oo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new wt(5,5,5),r=new Pn({name:"CubemapFromEquirect",uniforms:nr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:xn,blending:mi});r.uniforms.tEquirect.value=t;let o=new ue(s,r),a=t.minFilter;return t.minFilter===gi&&(t.minFilter=Ht),new Ml(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}};function c_(n){let e=new WeakMap,t=new WeakMap,i=null;function s(u,p=!1){return u==null?null:p?o(u):r(u)}function r(u){if(u&&u.isTexture){let p=u.mapping;if(p===wl||p===El)if(e.has(u)){let g=e.get(u).texture;return a(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let y=new gc(g.height);return y.fromEquirectangularTexture(n,u),e.set(u,y),u.addEventListener("dispose",c),a(y.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let p=u.mapping,g=p===wl||p===El,y=p===Ss||p===Qs;if(g||y){let f=t.get(u),m=f!==void 0?f.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return i===null&&(i=new mc(n)),f=g?i.fromEquirectangular(u,f):i.fromCubemap(u,f),f.texture.pmremVersion=u.pmremVersion,t.set(u,f),f.texture;if(f!==void 0)return f.texture;{let x=u.image;return g&&x&&x.height>0||y&&x&&l(x)?(i===null&&(i=new mc(n)),f=g?i.fromEquirectangular(u):i.fromCubemap(u),f.texture.pmremVersion=u.pmremVersion,t.set(u,f),u.addEventListener("dispose",h),f.texture):null}}}return u}function a(u,p){return p===wl?u.mapping=Ss:p===El&&(u.mapping=Qs),u}function l(u){let p=0,g=6;for(let y=0;y<g;y++)u[y]!==void 0&&p++;return p===g}function c(u){let p=u.target;p.removeEventListener("dispose",c);let g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function h(u){let p=u.target;p.removeEventListener("dispose",h);let g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function h_(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Co("WebGLRenderer: "+i+" extension not supported."),s}}}function u_(n,e,t,i){let s={},r=new WeakMap;function o(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete s[u.id];let p=r.get(u);p&&(e.remove(p),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,t.memory.geometries++),u}function l(d){let u=d.attributes;for(let p in u)e.update(u[p],n.ARRAY_BUFFER)}function c(d){let u=[],p=d.index,g=d.attributes.position,y=0;if(g===void 0)return;if(p!==null){let x=p.array;y=p.version;for(let v=0,M=x.length;v<M;v+=3){let T=x[v+0],E=x[v+1],A=x[v+2];u.push(T,E,E,A,A,T)}}else{let x=g.array;y=g.version;for(let v=0,M=x.length/3-1;v<M;v+=3){let T=v+0,E=v+1,A=v+2;u.push(T,E,E,A,A,T)}}let f=new(g.count>=65535?Lo:Po)(u,1);f.version=y;let m=r.get(d);m&&e.remove(m),r.set(d,f)}function h(d){let u=r.get(d);if(u){let p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function d_(n,e,t){let i;function s(u){i=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,p){n.drawElements(i,p,r,u*o),t.update(p,i,1)}function c(u,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,u*o,g),t.update(p,i,g))}function h(u,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,u,0,g);let f=0;for(let m=0;m<g;m++)f+=p[m];t.update(f,i,1)}function d(u,p,g,y){if(g===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<u.length;m++)c(u[m]/o,p[m],y[m]);else{f.multiDrawElementsInstancedWEBGL(i,p,0,r,u,0,y,0,g);let m=0;for(let x=0;x<g;x++)m+=p[x]*y[x];t.update(m,i,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function f_(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:Ne("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function p_(n,e,t){let i=new WeakMap,s=new Pt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=i.get(a);if(u===void 0||u.count!==d){let w=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",w)};u!==void 0&&u.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],v=0;p===!0&&(v=1),g===!0&&(v=2),y===!0&&(v=3);let M=a.attributes.position.count*v,T=1;M>e.maxTextureSize&&(T=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let E=new Float32Array(M*T*4*d),A=new Io(E,M,T,d);A.type=ni,A.needsUpdate=!0;let _=v*4;for(let V=0;V<d;V++){let C=f[V],O=m[V],k=x[V],D=M*T*4*V;for(let N=0;N<C.count;N++){let H=N*_;p===!0&&(s.fromBufferAttribute(C,N),E[D+H+0]=s.x,E[D+H+1]=s.y,E[D+H+2]=s.z,E[D+H+3]=0),g===!0&&(s.fromBufferAttribute(O,N),E[D+H+4]=s.x,E[D+H+5]=s.y,E[D+H+6]=s.z,E[D+H+7]=0),y===!0&&(s.fromBufferAttribute(k,N),E[D+H+8]=s.x,E[D+H+9]=s.y,E[D+H+10]=s.z,E[D+H+11]=k.itemSize===4?s.w:1)}}u={count:d,texture:A,size:new Oe(M,T)},i.set(a,u),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let p=0;for(let y=0;y<c.length;y++)p+=c[y];let g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:r}}function m_(n,e,t,i,s){let r=new WeakMap;function o(c){let h=s.render.frame,d=c.geometry,u=e.get(c,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let p=c.skeleton;r.get(p)!==h&&(p.update(),r.set(p,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}var g_={[kh]:"LINEAR_TONE_MAPPING",[Bh]:"REINHARD_TONE_MAPPING",[zh]:"CINEON_TONE_MAPPING",[Vh]:"ACES_FILMIC_TONE_MAPPING",[Gh]:"AGX_TONE_MAPPING",[Wh]:"NEUTRAL_TONE_MAPPING",[Hh]:"CUSTOM_TONE_MAPPING"};function y_(n,e,t,i,s){let r=new Cn(e,t,{type:n,depthBuffer:i,stencilBuffer:s}),o=new Cn(e,t,{type:yi,depthBuffer:!1,stencilBuffer:!1}),a=new zt;a.setAttribute("position",new it([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new it([0,2,0,0,2,0],2));let l=new ll({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new ue(a,l),h=new Ho(-1,1,1,-1,0,1),d=null,u=null,p=!1,g,y=null,f=[],m=!1;this.setSize=function(x,v){r.setSize(x,v),o.setSize(x,v);for(let M=0;M<f.length;M++){let T=f[M];T.setSize&&T.setSize(x,v)}},this.setEffects=function(x){f=x,m=f.length>0&&f[0].isRenderPass===!0;let v=r.width,M=r.height;for(let T=0;T<f.length;T++){let E=f[T];E.setSize&&E.setSize(v,M)}},this.begin=function(x,v){if(p||x.toneMapping===ei&&f.length===0)return!1;if(y=v,v!==null){let M=v.width,T=v.height;(r.width!==M||r.height!==T)&&this.setSize(M,T)}return m===!1&&x.setRenderTarget(r),g=x.toneMapping,x.toneMapping=ei,!0},this.hasRenderPass=function(){return m},this.end=function(x,v){x.toneMapping=g,p=!0;let M=r,T=o;for(let E=0;E<f.length;E++){let A=f[E];if(A.enabled!==!1&&(A.render(x,T,M,v),A.needsSwap!==!1)){let _=M;M=T,T=_}}if(d!==x.outputColorSpace||u!==x.toneMapping){d=x.outputColorSpace,u=x.toneMapping,l.defines={},Ke.getTransfer(d)===ot&&(l.defines.SRGB_TRANSFER="");let E=g_[u];E&&(l.defines[E]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=M.texture,x.setRenderTarget(y),x.render(c,h),y=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){r.dispose(),o.dispose(),a.dispose(),l.dispose()}}var Lp=new an,fu=new ms(1,1),Dp=new Io,Np=new nl,Op=new Oo,pp=[],mp=[],gp=new Float32Array(16),yp=new Float32Array(9),xp=new Float32Array(4);function no(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=pp[s];if(r===void 0&&(r=new Float32Array(s),pp[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function Wt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Xt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function _c(n,e){let t=mp[e];t===void 0&&(t=new Int32Array(e),mp[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function x_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function __(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;n.uniform2fv(this.addr,e),Xt(t,e)}}function v_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Wt(t,e))return;n.uniform3fv(this.addr,e),Xt(t,e)}}function b_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;n.uniform4fv(this.addr,e),Xt(t,e)}}function M_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Wt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,i))return;xp.set(i),n.uniformMatrix2fv(this.addr,!1,xp),Xt(t,i)}}function S_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Wt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,i))return;yp.set(i),n.uniformMatrix3fv(this.addr,!1,yp),Xt(t,i)}}function w_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Wt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,i))return;gp.set(i),n.uniformMatrix4fv(this.addr,!1,gp),Xt(t,i)}}function E_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function T_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;n.uniform2iv(this.addr,e),Xt(t,e)}}function A_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;n.uniform3iv(this.addr,e),Xt(t,e)}}function R_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;n.uniform4iv(this.addr,e),Xt(t,e)}}function C_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function I_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;n.uniform2uiv(this.addr,e),Xt(t,e)}}function P_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;n.uniform3uiv(this.addr,e),Xt(t,e)}}function L_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;n.uniform4uiv(this.addr,e),Xt(t,e)}}function D_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(fu.compareFunction=t.isReversedDepthBuffer()?dc:uc,r=fu):r=Lp,t.setTexture2D(e||r,s)}function N_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Np,s)}function O_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Op,s)}function U_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Dp,s)}function F_(n){switch(n){case 5126:return x_;case 35664:return __;case 35665:return v_;case 35666:return b_;case 35674:return M_;case 35675:return S_;case 35676:return w_;case 5124:case 35670:return E_;case 35667:case 35671:return T_;case 35668:case 35672:return A_;case 35669:case 35673:return R_;case 5125:return C_;case 36294:return I_;case 36295:return P_;case 36296:return L_;case 35678:case 36198:case 36298:case 36306:case 35682:return D_;case 35679:case 36299:case 36307:return N_;case 35680:case 36300:case 36308:case 36293:return O_;case 36289:case 36303:case 36311:case 36292:return U_}}function k_(n,e){n.uniform1fv(this.addr,e)}function B_(n,e){let t=no(e,this.size,2);n.uniform2fv(this.addr,t)}function z_(n,e){let t=no(e,this.size,3);n.uniform3fv(this.addr,t)}function V_(n,e){let t=no(e,this.size,4);n.uniform4fv(this.addr,t)}function H_(n,e){let t=no(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function G_(n,e){let t=no(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function W_(n,e){let t=no(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function X_(n,e){n.uniform1iv(this.addr,e)}function $_(n,e){n.uniform2iv(this.addr,e)}function q_(n,e){n.uniform3iv(this.addr,e)}function Y_(n,e){n.uniform4iv(this.addr,e)}function Z_(n,e){n.uniform1uiv(this.addr,e)}function j_(n,e){n.uniform2uiv(this.addr,e)}function J_(n,e){n.uniform3uiv(this.addr,e)}function K_(n,e){n.uniform4uiv(this.addr,e)}function Q_(n,e,t){let i=this.cache,s=e.length,r=_c(t,s);Wt(i,r)||(n.uniform1iv(this.addr,r),Xt(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=fu:o=Lp;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function ev(n,e,t){let i=this.cache,s=e.length,r=_c(t,s);Wt(i,r)||(n.uniform1iv(this.addr,r),Xt(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Np,r[o])}function tv(n,e,t){let i=this.cache,s=e.length,r=_c(t,s);Wt(i,r)||(n.uniform1iv(this.addr,r),Xt(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Op,r[o])}function nv(n,e,t){let i=this.cache,s=e.length,r=_c(t,s);Wt(i,r)||(n.uniform1iv(this.addr,r),Xt(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Dp,r[o])}function iv(n){switch(n){case 5126:return k_;case 35664:return B_;case 35665:return z_;case 35666:return V_;case 35674:return H_;case 35675:return G_;case 35676:return W_;case 5124:case 35670:return X_;case 35667:case 35671:return $_;case 35668:case 35672:return q_;case 35669:case 35673:return Y_;case 5125:return Z_;case 36294:return j_;case 36295:return J_;case 36296:return K_;case 35678:case 36198:case 36298:case 36306:case 35682:return Q_;case 35679:case 36299:case 36307:return ev;case 35680:case 36300:case 36308:case 36293:return tv;case 36289:case 36303:case 36311:case 36292:return nv}}var pu=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=F_(t.type)}},mu=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=iv(t.type)}},gu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},uu=/(\w+)(\])?(\[|\.)?/g;function _p(n,e){n.seq.push(e),n.map[e.id]=e}function sv(n,e,t){let i=n.name,s=i.length;for(uu.lastIndex=0;;){let r=uu.exec(i),o=uu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){_p(t,c===void 0?new pu(a,n,e):new mu(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new gu(a),_p(t,d)),t=d}}}var to=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);sv(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function vp(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var rv=37297,ov=0;function av(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var bp=new Ge;function lv(n){Ke._getMatrix(bp,Ke.workingColorSpace,n);let e=`mat3( ${bp.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(n)){case Ao:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Mp(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+av(n.getShaderSource(e),a)}else return r}function cv(n,e){let t=lv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var hv={[kh]:"Linear",[Bh]:"Reinhard",[zh]:"Cineon",[Vh]:"ACESFilmic",[Gh]:"AgX",[Wh]:"Neutral",[Hh]:"Custom"};function uv(n,e){let t=hv[e];return t===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var pc=new I;function dv(){Ke.getLuminanceCoefficients(pc);let n=pc.x.toFixed(4),e=pc.y.toFixed(4),t=pc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qo).join(`
`)}function pv(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function mv(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Qo(n){return n!==""}function Sp(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function wp(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var gv=/^[ \t]*#include +<([\w\d./]+)>/gm;function yu(n){return n.replace(gv,xv)}var yv=new Map;function xv(n,e){let t=Xe[e];if(t===void 0){let i=yv.get(e);if(i!==void 0)t=Xe[i],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return yu(t)}var _v=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ep(n){return n.replace(_v,vv)}function vv(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Tp(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var bv={[Xo]:"SHADOWMAP_TYPE_PCF",[Zr]:"SHADOWMAP_TYPE_VSM"};function Mv(n){return bv[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Sv={[Ss]:"ENVMAP_TYPE_CUBE",[Qs]:"ENVMAP_TYPE_CUBE",[$o]:"ENVMAP_TYPE_CUBE_UV"};function wv(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Sv[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var Ev={[Qs]:"ENVMAP_MODE_REFRACTION"};function Tv(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Ev[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Av={[Fh]:"ENVMAP_BLENDING_MULTIPLY",[$f]:"ENVMAP_BLENDING_MIX",[qf]:"ENVMAP_BLENDING_ADD"};function Rv(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Av[n.combine]||"ENVMAP_BLENDING_NONE"}function Cv(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Iv(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Mv(t),c=wv(t),h=Tv(t),d=Rv(t),u=Cv(t),p=fv(t),g=pv(r),y=s.createProgram(),f,m,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qo).join(`
`),f.length>0&&(f+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qo).join(`
`),m.length>0&&(m+=`
`)):(f=[Tp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qo).join(`
`),m=[Tp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ei?"#define TONE_MAPPING":"",t.toneMapping!==ei?Xe.tonemapping_pars_fragment:"",t.toneMapping!==ei?uv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,cv("linearToOutputTexel",t.outputColorSpace),dv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qo).join(`
`)),o=yu(o),o=Sp(o,t),o=wp(o,t),a=yu(a),a=Sp(a,t),a=wp(a,t),o=Ep(o),a=Ep(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,m=["#define varying in",t.glslVersion===eu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===eu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let v=x+f+o,M=x+m+a,T=vp(s,s.VERTEX_SHADER,v),E=vp(s,s.FRAGMENT_SHADER,M);s.attachShader(y,T),s.attachShader(y,E),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function A(C){if(n.debug.checkShaderErrors){let O=s.getProgramInfoLog(y)||"",k=s.getShaderInfoLog(T)||"",D=s.getShaderInfoLog(E)||"",N=O.trim(),H=k.trim(),z=D.trim(),K=!0,j=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(K=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,y,T,E);else{let le=Mp(s,T,"vertex"),pe=Mp(s,E,"fragment");Ne("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+N+`
`+le+`
`+pe)}else N!==""?Le("WebGLProgram: Program Info Log:",N):(H===""||z==="")&&(j=!1);j&&(C.diagnostics={runnable:K,programLog:N,vertexShader:{log:H,prefix:f},fragmentShader:{log:z,prefix:m}})}s.deleteShader(T),s.deleteShader(E),_=new to(s,y),w=mv(s,y)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let V=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return V===!1&&(V=s.getProgramParameter(y,rv)),V},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ov++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=T,this.fragmentShader=E,this}var Pv=0,xu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new _u(e),t.set(e,i)),i}},_u=class{constructor(e){this.id=Pv++,this.code=e,this.usedTimes=0}};function Lv(n,e,t,i,s,r){let o=new Xr,a=new xu,l=new Set,c=[],h=new Map,d=i.logarithmicDepthBuffer,u=i.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function y(_,w,V,C,O){let k=C.fog,D=O.geometry,N=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,z=e.get(_.envMap||N,H),K=z&&z.mapping===$o?z.image.height:null,j=p[_.type];_.precision!==null&&(u=i.getMaxPrecision(_.precision),u!==_.precision&&Le("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let le=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,pe=le!==void 0?le.length:0,he=0;D.morphAttributes.position!==void 0&&(he=1),D.morphAttributes.normal!==void 0&&(he=2),D.morphAttributes.color!==void 0&&(he=3);let Ve,mt,Mt,Z;if(j){let lt=_i[j];Ve=lt.vertexShader,mt=lt.fragmentShader}else Ve=_.vertexShader,mt=_.fragmentShader,a.update(_),Mt=a.getVertexShaderID(_),Z=a.getFragmentShaderID(_);let se=n.getRenderTarget(),ae=n.state.buffers.depth.getReversed(),We=O.isInstancedMesh===!0,De=O.isBatchedMesh===!0,ke=!!_.map,Yt=!!_.matcap,Qe=!!z,at=!!_.aoMap,gt=!!_.lightMap,$e=!!_.bumpMap,Dt=!!_.normalMap,L=!!_.displacementMap,Ft=!!_.emissiveMap,st=!!_.metalnessMap,vt=!!_.roughnessMap,we=_.anisotropy>0,R=_.clearcoat>0,b=_.dispersion>0,F=_.iridescence>0,Y=_.sheen>0,J=_.transmission>0,q=we&&!!_.anisotropyMap,_e=R&&!!_.clearcoatMap,re=R&&!!_.clearcoatNormalMap,Ie=R&&!!_.clearcoatRoughnessMap,Fe=F&&!!_.iridescenceMap,Q=F&&!!_.iridescenceThicknessMap,ne=Y&&!!_.sheenColorMap,ve=Y&&!!_.sheenRoughnessMap,Me=!!_.specularMap,me=!!_.specularColorMap,qe=!!_.specularIntensityMap,U=J&&!!_.transmissionMap,oe=J&&!!_.thicknessMap,ie=!!_.gradientMap,xe=!!_.alphaMap,ee=_.alphaTest>0,$=!!_.alphaHash,be=!!_.extensions,Be=ei;_.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(Be=n.toneMapping);let bt={shaderID:j,shaderType:_.type,shaderName:_.name,vertexShader:Ve,fragmentShader:mt,defines:_.defines,customVertexShaderID:Mt,customFragmentShaderID:Z,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:De,batchingColor:De&&O._colorsTexture!==null,instancing:We,instancingColor:We&&O.instanceColor!==null,instancingMorph:We&&O.morphTexture!==null,outputColorSpace:se===null?n.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Ys,alphaToCoverage:!!_.alphaToCoverage,map:ke,matcap:Yt,envMap:Qe,envMapMode:Qe&&z.mapping,envMapCubeUVHeight:K,aoMap:at,lightMap:gt,bumpMap:$e,normalMap:Dt,displacementMap:L,emissiveMap:Ft,normalMapObjectSpace:Dt&&_.normalMapType===Zf,normalMapTangentSpace:Dt&&_.normalMapType===Qh,metalnessMap:st,roughnessMap:vt,anisotropy:we,anisotropyMap:q,clearcoat:R,clearcoatMap:_e,clearcoatNormalMap:re,clearcoatRoughnessMap:Ie,dispersion:b,iridescence:F,iridescenceMap:Fe,iridescenceThicknessMap:Q,sheen:Y,sheenColorMap:ne,sheenRoughnessMap:ve,specularMap:Me,specularColorMap:me,specularIntensityMap:qe,transmission:J,transmissionMap:U,thicknessMap:oe,gradientMap:ie,opaque:_.transparent===!1&&_.blending===Xs&&_.alphaToCoverage===!1,alphaMap:xe,alphaTest:ee,alphaHash:$,combine:_.combine,mapUv:ke&&g(_.map.channel),aoMapUv:at&&g(_.aoMap.channel),lightMapUv:gt&&g(_.lightMap.channel),bumpMapUv:$e&&g(_.bumpMap.channel),normalMapUv:Dt&&g(_.normalMap.channel),displacementMapUv:L&&g(_.displacementMap.channel),emissiveMapUv:Ft&&g(_.emissiveMap.channel),metalnessMapUv:st&&g(_.metalnessMap.channel),roughnessMapUv:vt&&g(_.roughnessMap.channel),anisotropyMapUv:q&&g(_.anisotropyMap.channel),clearcoatMapUv:_e&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:re&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ie&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Fe&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:ne&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:ve&&g(_.sheenRoughnessMap.channel),specularMapUv:Me&&g(_.specularMap.channel),specularColorMapUv:me&&g(_.specularColorMap.channel),specularIntensityMapUv:qe&&g(_.specularIntensityMap.channel),transmissionMapUv:U&&g(_.transmissionMap.channel),thicknessMapUv:oe&&g(_.thicknessMap.channel),alphaMapUv:xe&&g(_.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Dt||we),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!D.attributes.uv&&(ke||xe),fog:!!k,useFog:_.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||D.attributes.normal===void 0&&Dt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ae,skinning:O.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:pe,morphTextureStride:he,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&V.length>0,shadowMapType:n.shadowMap.type,toneMapping:Be,decodeVideoTexture:ke&&_.map.isVideoTexture===!0&&Ke.getTransfer(_.map.colorSpace)===ot,decodeVideoTextureEmissive:Ft&&_.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(_.emissiveMap.colorSpace)===ot,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===ln,flipSided:_.side===xn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:be&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(be&&_.extensions.multiDraw===!0||De)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return bt.vertexUv1s=l.has(1),bt.vertexUv2s=l.has(2),bt.vertexUv3s=l.has(3),l.clear(),bt}function f(_){let w=[];if(_.shaderID?w.push(_.shaderID):(w.push(_.customVertexShaderID),w.push(_.customFragmentShaderID)),_.defines!==void 0)for(let V in _.defines)w.push(V),w.push(_.defines[V]);return _.isRawShaderMaterial===!1&&(m(w,_),x(w,_),w.push(n.outputColorSpace)),w.push(_.customProgramCacheKey),w.join()}function m(_,w){_.push(w.precision),_.push(w.outputColorSpace),_.push(w.envMapMode),_.push(w.envMapCubeUVHeight),_.push(w.mapUv),_.push(w.alphaMapUv),_.push(w.lightMapUv),_.push(w.aoMapUv),_.push(w.bumpMapUv),_.push(w.normalMapUv),_.push(w.displacementMapUv),_.push(w.emissiveMapUv),_.push(w.metalnessMapUv),_.push(w.roughnessMapUv),_.push(w.anisotropyMapUv),_.push(w.clearcoatMapUv),_.push(w.clearcoatNormalMapUv),_.push(w.clearcoatRoughnessMapUv),_.push(w.iridescenceMapUv),_.push(w.iridescenceThicknessMapUv),_.push(w.sheenColorMapUv),_.push(w.sheenRoughnessMapUv),_.push(w.specularMapUv),_.push(w.specularColorMapUv),_.push(w.specularIntensityMapUv),_.push(w.transmissionMapUv),_.push(w.thicknessMapUv),_.push(w.combine),_.push(w.fogExp2),_.push(w.sizeAttenuation),_.push(w.morphTargetsCount),_.push(w.morphAttributeCount),_.push(w.numDirLights),_.push(w.numPointLights),_.push(w.numSpotLights),_.push(w.numSpotLightMaps),_.push(w.numHemiLights),_.push(w.numRectAreaLights),_.push(w.numDirLightShadows),_.push(w.numPointLightShadows),_.push(w.numSpotLightShadows),_.push(w.numSpotLightShadowsWithMaps),_.push(w.numLightProbes),_.push(w.shadowMapType),_.push(w.toneMapping),_.push(w.numClippingPlanes),_.push(w.numClipIntersection),_.push(w.depthPacking)}function x(_,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),_.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),_.push(o.mask)}function v(_){let w=p[_.type],V;if(w){let C=_i[w];V=ap.clone(C.uniforms)}else V=_.uniforms;return V}function M(_,w){let V=h.get(w);return V!==void 0?++V.usedTimes:(V=new Iv(n,w,_,s),c.push(V),h.set(w,V)),V}function T(_){if(--_.usedTimes===0){let w=c.indexOf(_);c[w]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function E(_){a.remove(_)}function A(){a.dispose()}return{getParameters:y,getProgramCacheKey:f,getUniforms:v,acquireProgram:M,releaseProgram:T,releaseShaderCache:E,programs:c,dispose:A}}function Dv(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Nv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Ap(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Rp(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(u){let p=0;return u.isInstancedMesh&&(p+=2),u.isSkinnedMesh&&(p+=1),p}function a(u,p,g,y,f,m){let x=n[e];return x===void 0?(x={id:u.id,object:u,geometry:p,material:g,materialVariant:o(u),groupOrder:y,renderOrder:u.renderOrder,z:f,group:m},n[e]=x):(x.id=u.id,x.object=u,x.geometry=p,x.material=g,x.materialVariant=o(u),x.groupOrder=y,x.renderOrder=u.renderOrder,x.z=f,x.group=m),e++,x}function l(u,p,g,y,f,m){let x=a(u,p,g,y,f,m);g.transmission>0?i.push(x):g.transparent===!0?s.push(x):t.push(x)}function c(u,p,g,y,f,m){let x=a(u,p,g,y,f,m);g.transmission>0?i.unshift(x):g.transparent===!0?s.unshift(x):t.unshift(x)}function h(u,p){t.length>1&&t.sort(u||Nv),i.length>1&&i.sort(p||Ap),s.length>1&&s.sort(p||Ap)}function d(){for(let u=e,p=n.length;u<p;u++){let g=n[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function Ov(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new Rp,n.set(i,[o])):s>=r.length?(o=new Rp,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function Uv(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new ze};break;case"SpotLight":t={position:new I,direction:new I,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function Fv(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var kv=0;function Bv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function zv(n){let e=new Uv,t=Fv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new I);let s=new I,r=new nt,o=new nt;function a(c){let h=0,d=0,u=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,g=0,y=0,f=0,m=0,x=0,v=0,M=0,T=0,E=0,A=0;c.sort(Bv);for(let w=0,V=c.length;w<V;w++){let C=c[w],O=C.color,k=C.intensity,D=C.distance,N=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===tr?N=C.shadow.map.texture:N=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=O.r*k,d+=O.g*k,u+=O.b*k;else if(C.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(C.sh.coefficients[H],k);A++}else if(C.isDirectionalLight){let H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let z=C.shadow,K=t.get(C);K.shadowIntensity=z.intensity,K.shadowBias=z.bias,K.shadowNormalBias=z.normalBias,K.shadowRadius=z.radius,K.shadowMapSize=z.mapSize,i.directionalShadow[p]=K,i.directionalShadowMap[p]=N,i.directionalShadowMatrix[p]=C.shadow.matrix,x++}i.directional[p]=H,p++}else if(C.isSpotLight){let H=e.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(O).multiplyScalar(k),H.distance=D,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,i.spot[y]=H;let z=C.shadow;if(C.map&&(i.spotLightMap[T]=C.map,T++,z.updateMatrices(C),C.castShadow&&E++),i.spotLightMatrix[y]=z.matrix,C.castShadow){let K=t.get(C);K.shadowIntensity=z.intensity,K.shadowBias=z.bias,K.shadowNormalBias=z.normalBias,K.shadowRadius=z.radius,K.shadowMapSize=z.mapSize,i.spotShadow[y]=K,i.spotShadowMap[y]=N,M++}y++}else if(C.isRectAreaLight){let H=e.get(C);H.color.copy(O).multiplyScalar(k),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),i.rectArea[f]=H,f++}else if(C.isPointLight){let H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){let z=C.shadow,K=t.get(C);K.shadowIntensity=z.intensity,K.shadowBias=z.bias,K.shadowNormalBias=z.normalBias,K.shadowRadius=z.radius,K.shadowMapSize=z.mapSize,K.shadowCameraNear=z.camera.near,K.shadowCameraFar=z.camera.far,i.pointShadow[g]=K,i.pointShadowMap[g]=N,i.pointShadowMatrix[g]=C.shadow.matrix,v++}i.point[g]=H,g++}else if(C.isHemisphereLight){let H=e.get(C);H.skyColor.copy(C.color).multiplyScalar(k),H.groundColor.copy(C.groundColor).multiplyScalar(k),i.hemi[m]=H,m++}}f>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ce.LTC_FLOAT_1,i.rectAreaLTC2=ce.LTC_FLOAT_2):(i.rectAreaLTC1=ce.LTC_HALF_1,i.rectAreaLTC2=ce.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;let _=i.hash;(_.directionalLength!==p||_.pointLength!==g||_.spotLength!==y||_.rectAreaLength!==f||_.hemiLength!==m||_.numDirectionalShadows!==x||_.numPointShadows!==v||_.numSpotShadows!==M||_.numSpotMaps!==T||_.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=y,i.rectArea.length=f,i.point.length=g,i.hemi.length=m,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=M+T-E,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,_.directionalLength=p,_.pointLength=g,_.spotLength=y,_.rectAreaLength=f,_.hemiLength=m,_.numDirectionalShadows=x,_.numPointShadows=v,_.numSpotShadows=M,_.numSpotMaps=T,_.numLightProbes=A,i.version=kv++)}function l(c,h){let d=0,u=0,p=0,g=0,y=0,f=h.matrixWorldInverse;for(let m=0,x=c.length;m<x;m++){let v=c[m];if(v.isDirectionalLight){let M=i.directional[d];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(f),d++}else if(v.isSpotLight){let M=i.spot[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(f),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(f),p++}else if(v.isRectAreaLight){let M=i.rectArea[g];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(f),o.identity(),r.copy(v.matrixWorld),r.premultiply(f),o.extractRotation(r),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){let M=i.point[u];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(f),u++}else if(v.isHemisphereLight){let M=i.hemi[y];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(f),y++}}}return{setup:a,setupView:l,state:i}}function Cp(n){let e=new zv(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function o(h){i.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Vv(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Cp(n),e.set(s,[a])):r>=o.length?(a=new Cp(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var Hv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Wv=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],Xv=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Ip=new nt,Ko=new I,du=new I;function $v(n,e,t){let i=new Do,s=new Oe,r=new Oe,o=new Pt,a=new cl,l=new hl,c={},h=t.maxTextureSize,d={[ki]:xn,[xn]:ki,[ln]:ln},u=new Pn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:Hv,fragmentShader:Gv}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let g=new zt;g.setAttribute("position",new At(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new ue(g,u),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xo;let m=this.type;this.render=function(E,A,_){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||E.length===0)return;this.type===Af&&(Le("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Xo);let w=n.getRenderTarget(),V=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),O=n.state;O.setBlending(mi),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let k=m!==this.type;k&&A.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(N=>N.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,N=E.length;D<N;D++){let H=E[D],z=H.shadow;if(z===void 0){Le("WebGLShadowMap:",H,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let K=z.getFrameExtents();s.multiply(K),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/K.x),s.x=r.x*K.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/K.y),s.y=r.y*K.y,z.mapSize.y=r.y));let j=n.state.buffers.depth.getReversed();if(z.camera._reversedDepth=j,z.map===null||k===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===Zr){if(H.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new Cn(s.x,s.y,{format:tr,type:yi,minFilter:Ht,magFilter:Ht,generateMipmaps:!1}),z.map.texture.name=H.name+".shadowMap",z.map.depthTexture=new ms(s.x,s.y,ni),z.map.depthTexture.name=H.name+".shadowMapDepth",z.map.depthTexture.format=di,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Bt,z.map.depthTexture.magFilter=Bt}else H.isPointLight?(z.map=new gc(s.x),z.map.depthTexture=new ol(s.x,ti)):(z.map=new Cn(s.x,s.y),z.map.depthTexture=new ms(s.x,s.y,ti)),z.map.depthTexture.name=H.name+".shadowMap",z.map.depthTexture.format=di,this.type===Xo?(z.map.depthTexture.compareFunction=j?dc:uc,z.map.depthTexture.minFilter=Ht,z.map.depthTexture.magFilter=Ht):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Bt,z.map.depthTexture.magFilter=Bt);z.camera.updateProjectionMatrix()}let le=z.map.isWebGLCubeRenderTarget?6:1;for(let pe=0;pe<le;pe++){if(z.map.isWebGLCubeRenderTarget)n.setRenderTarget(z.map,pe),n.clear();else{pe===0&&(n.setRenderTarget(z.map),n.clear());let he=z.getViewport(pe);o.set(r.x*he.x,r.y*he.y,r.x*he.z,r.y*he.w),O.viewport(o)}if(H.isPointLight){let he=z.camera,Ve=z.matrix,mt=H.distance||he.far;mt!==he.far&&(he.far=mt,he.updateProjectionMatrix()),Ko.setFromMatrixPosition(H.matrixWorld),he.position.copy(Ko),du.copy(he.position),du.add(Wv[pe]),he.up.copy(Xv[pe]),he.lookAt(du),he.updateMatrixWorld(),Ve.makeTranslation(-Ko.x,-Ko.y,-Ko.z),Ip.multiplyMatrices(he.projectionMatrix,he.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Ip,he.coordinateSystem,he.reversedDepth)}else z.updateMatrices(H);i=z.getFrustum(),M(A,_,z.camera,H,this.type)}z.isPointLightShadow!==!0&&this.type===Zr&&x(z,_),z.needsUpdate=!1}m=this.type,f.needsUpdate=!1,n.setRenderTarget(w,V,C)};function x(E,A){let _=e.update(y);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Cn(s.x,s.y,{format:tr,type:yi})),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,_,u,y,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,_,p,y,null)}function v(E,A,_,w){let V=null,C=_.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)V=C;else if(V=_.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let O=V.uuid,k=A.uuid,D=c[O];D===void 0&&(D={},c[O]=D);let N=D[k];N===void 0&&(N=V.clone(),D[k]=N,A.addEventListener("dispose",T)),V=N}if(V.visible=A.visible,V.wireframe=A.wireframe,w===Zr?V.side=A.shadowSide!==null?A.shadowSide:A.side:V.side=A.shadowSide!==null?A.shadowSide:d[A.side],V.alphaMap=A.alphaMap,V.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,V.map=A.map,V.clipShadows=A.clipShadows,V.clippingPlanes=A.clippingPlanes,V.clipIntersection=A.clipIntersection,V.displacementMap=A.displacementMap,V.displacementScale=A.displacementScale,V.displacementBias=A.displacementBias,V.wireframeLinewidth=A.wireframeLinewidth,V.linewidth=A.linewidth,_.isPointLight===!0&&V.isMeshDistanceMaterial===!0){let O=n.properties.get(V);O.light=_}return V}function M(E,A,_,w,V){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&V===Zr)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,E.matrixWorld);let k=e.update(E),D=E.material;if(Array.isArray(D)){let N=k.groups;for(let H=0,z=N.length;H<z;H++){let K=N[H],j=D[K.materialIndex];if(j&&j.visible){let le=v(E,j,w,V);E.onBeforeShadow(n,E,A,_,k,le,K),n.renderBufferDirect(_,null,k,le,E,K),E.onAfterShadow(n,E,A,_,k,le,K)}}}else if(D.visible){let N=v(E,D,w,V);E.onBeforeShadow(n,E,A,_,k,N,null),n.renderBufferDirect(_,null,k,N,E,null),E.onAfterShadow(n,E,A,_,k,N,null)}}let O=E.children;for(let k=0,D=O.length;k<D;k++)M(O[k],A,_,w,V)}function T(E){E.target.removeEventListener("dispose",T);for(let _ in c){let w=c[_],V=E.target.uuid;V in w&&(w[V].dispose(),delete w[V])}}}function qv(n,e){function t(){let U=!1,oe=new Pt,ie=null,xe=new Pt(0,0,0,0);return{setMask:function(ee){ie!==ee&&!U&&(n.colorMask(ee,ee,ee,ee),ie=ee)},setLocked:function(ee){U=ee},setClear:function(ee,$,be,Be,bt){bt===!0&&(ee*=Be,$*=Be,be*=Be),oe.set(ee,$,be,Be),xe.equals(oe)===!1&&(n.clearColor(ee,$,be,Be),xe.copy(oe))},reset:function(){U=!1,ie=null,xe.set(-1,0,0,0)}}}function i(){let U=!1,oe=!1,ie=null,xe=null,ee=null;return{setReversed:function($){if(oe!==$){let be=e.get("EXT_clip_control");$?be.clipControlEXT(be.LOWER_LEFT_EXT,be.ZERO_TO_ONE_EXT):be.clipControlEXT(be.LOWER_LEFT_EXT,be.NEGATIVE_ONE_TO_ONE_EXT),oe=$;let Be=ee;ee=null,this.setClear(Be)}},getReversed:function(){return oe},setTest:function($){$?se(n.DEPTH_TEST):ae(n.DEPTH_TEST)},setMask:function($){ie!==$&&!U&&(n.depthMask($),ie=$)},setFunc:function($){if(oe&&($=rp[$]),xe!==$){switch($){case Ya:n.depthFunc(n.NEVER);break;case Za:n.depthFunc(n.ALWAYS);break;case ja:n.depthFunc(n.LESS);break;case $s:n.depthFunc(n.LEQUAL);break;case Ja:n.depthFunc(n.EQUAL);break;case Ka:n.depthFunc(n.GEQUAL);break;case Qa:n.depthFunc(n.GREATER);break;case el:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}xe=$}},setLocked:function($){U=$},setClear:function($){ee!==$&&(ee=$,oe&&($=1-$),n.clearDepth($))},reset:function(){U=!1,ie=null,xe=null,ee=null,oe=!1}}}function s(){let U=!1,oe=null,ie=null,xe=null,ee=null,$=null,be=null,Be=null,bt=null;return{setTest:function(lt){U||(lt?se(n.STENCIL_TEST):ae(n.STENCIL_TEST))},setMask:function(lt){oe!==lt&&!U&&(n.stencilMask(lt),oe=lt)},setFunc:function(lt,Ci,Ii){(ie!==lt||xe!==Ci||ee!==Ii)&&(n.stencilFunc(lt,Ci,Ii),ie=lt,xe=Ci,ee=Ii)},setOp:function(lt,Ci,Ii){($!==lt||be!==Ci||Be!==Ii)&&(n.stencilOp(lt,Ci,Ii),$=lt,be=Ci,Be=Ii)},setLocked:function(lt){U=lt},setClear:function(lt){bt!==lt&&(n.clearStencil(lt),bt=lt)},reset:function(){U=!1,oe=null,ie=null,xe=null,ee=null,$=null,be=null,Be=null,bt=null}}}let r=new t,o=new i,a=new s,l=new WeakMap,c=new WeakMap,h={},d={},u=new WeakMap,p=[],g=null,y=!1,f=null,m=null,x=null,v=null,M=null,T=null,E=null,A=new ze(0,0,0),_=0,w=!1,V=null,C=null,O=null,k=null,D=null,N=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,z=0,K=n.getParameter(n.VERSION);K.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(K)[1]),H=z>=1):K.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),H=z>=2);let j=null,le={},pe=n.getParameter(n.SCISSOR_BOX),he=n.getParameter(n.VIEWPORT),Ve=new Pt().fromArray(pe),mt=new Pt().fromArray(he);function Mt(U,oe,ie,xe){let ee=new Uint8Array(4),$=n.createTexture();n.bindTexture(U,$),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let be=0;be<ie;be++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(oe,0,n.RGBA,1,1,xe,0,n.RGBA,n.UNSIGNED_BYTE,ee):n.texImage2D(oe+be,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ee);return $}let Z={};Z[n.TEXTURE_2D]=Mt(n.TEXTURE_2D,n.TEXTURE_2D,1),Z[n.TEXTURE_CUBE_MAP]=Mt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[n.TEXTURE_2D_ARRAY]=Mt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Z[n.TEXTURE_3D]=Mt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),se(n.DEPTH_TEST),o.setFunc($s),$e(!1),Dt(Dh),se(n.CULL_FACE),at(mi);function se(U){h[U]!==!0&&(n.enable(U),h[U]=!0)}function ae(U){h[U]!==!1&&(n.disable(U),h[U]=!1)}function We(U,oe){return d[U]!==oe?(n.bindFramebuffer(U,oe),d[U]=oe,U===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=oe),U===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=oe),!0):!1}function De(U,oe){let ie=p,xe=!1;if(U){ie=u.get(oe),ie===void 0&&(ie=[],u.set(oe,ie));let ee=U.textures;if(ie.length!==ee.length||ie[0]!==n.COLOR_ATTACHMENT0){for(let $=0,be=ee.length;$<be;$++)ie[$]=n.COLOR_ATTACHMENT0+$;ie.length=ee.length,xe=!0}}else ie[0]!==n.BACK&&(ie[0]=n.BACK,xe=!0);xe&&n.drawBuffers(ie)}function ke(U){return g!==U?(n.useProgram(U),g=U,!0):!1}let Yt={[hs]:n.FUNC_ADD,[Cf]:n.FUNC_SUBTRACT,[If]:n.FUNC_REVERSE_SUBTRACT};Yt[Pf]=n.MIN,Yt[Lf]=n.MAX;let Qe={[Df]:n.ZERO,[Nf]:n.ONE,[Of]:n.SRC_COLOR,[$a]:n.SRC_ALPHA,[Vf]:n.SRC_ALPHA_SATURATE,[Bf]:n.DST_COLOR,[Ff]:n.DST_ALPHA,[Uf]:n.ONE_MINUS_SRC_COLOR,[qa]:n.ONE_MINUS_SRC_ALPHA,[zf]:n.ONE_MINUS_DST_COLOR,[kf]:n.ONE_MINUS_DST_ALPHA,[Hf]:n.CONSTANT_COLOR,[Gf]:n.ONE_MINUS_CONSTANT_COLOR,[Wf]:n.CONSTANT_ALPHA,[Xf]:n.ONE_MINUS_CONSTANT_ALPHA};function at(U,oe,ie,xe,ee,$,be,Be,bt,lt){if(U===mi){y===!0&&(ae(n.BLEND),y=!1);return}if(y===!1&&(se(n.BLEND),y=!0),U!==Rf){if(U!==f||lt!==w){if((m!==hs||M!==hs)&&(n.blendEquation(n.FUNC_ADD),m=hs,M=hs),lt)switch(U){case Xs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nh:n.blendFunc(n.ONE,n.ONE);break;case Oh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Uh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ne("WebGLState: Invalid blending: ",U);break}else switch(U){case Xs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nh:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Oh:Ne("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Uh:Ne("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ne("WebGLState: Invalid blending: ",U);break}x=null,v=null,T=null,E=null,A.set(0,0,0),_=0,f=U,w=lt}return}ee=ee||oe,$=$||ie,be=be||xe,(oe!==m||ee!==M)&&(n.blendEquationSeparate(Yt[oe],Yt[ee]),m=oe,M=ee),(ie!==x||xe!==v||$!==T||be!==E)&&(n.blendFuncSeparate(Qe[ie],Qe[xe],Qe[$],Qe[be]),x=ie,v=xe,T=$,E=be),(Be.equals(A)===!1||bt!==_)&&(n.blendColor(Be.r,Be.g,Be.b,bt),A.copy(Be),_=bt),f=U,w=!1}function gt(U,oe){U.side===ln?ae(n.CULL_FACE):se(n.CULL_FACE);let ie=U.side===xn;oe&&(ie=!ie),$e(ie),U.blending===Xs&&U.transparent===!1?at(mi):at(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let xe=U.stencilWrite;a.setTest(xe),xe&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Ft(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?se(n.SAMPLE_ALPHA_TO_COVERAGE):ae(n.SAMPLE_ALPHA_TO_COVERAGE)}function $e(U){V!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),V=U)}function Dt(U){U!==Ef?(se(n.CULL_FACE),U!==C&&(U===Dh?n.cullFace(n.BACK):U===Tf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ae(n.CULL_FACE),C=U}function L(U){U!==O&&(H&&n.lineWidth(U),O=U)}function Ft(U,oe,ie){U?(se(n.POLYGON_OFFSET_FILL),(k!==oe||D!==ie)&&(k=oe,D=ie,o.getReversed()&&(oe=-oe),n.polygonOffset(oe,ie))):ae(n.POLYGON_OFFSET_FILL)}function st(U){U?se(n.SCISSOR_TEST):ae(n.SCISSOR_TEST)}function vt(U){U===void 0&&(U=n.TEXTURE0+N-1),j!==U&&(n.activeTexture(U),j=U)}function we(U,oe,ie){ie===void 0&&(j===null?ie=n.TEXTURE0+N-1:ie=j);let xe=le[ie];xe===void 0&&(xe={type:void 0,texture:void 0},le[ie]=xe),(xe.type!==U||xe.texture!==oe)&&(j!==ie&&(n.activeTexture(ie),j=ie),n.bindTexture(U,oe||Z[U]),xe.type=U,xe.texture=oe)}function R(){let U=le[j];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function b(){try{n.compressedTexImage2D(...arguments)}catch(U){Ne("WebGLState:",U)}}function F(){try{n.compressedTexImage3D(...arguments)}catch(U){Ne("WebGLState:",U)}}function Y(){try{n.texSubImage2D(...arguments)}catch(U){Ne("WebGLState:",U)}}function J(){try{n.texSubImage3D(...arguments)}catch(U){Ne("WebGLState:",U)}}function q(){try{n.compressedTexSubImage2D(...arguments)}catch(U){Ne("WebGLState:",U)}}function _e(){try{n.compressedTexSubImage3D(...arguments)}catch(U){Ne("WebGLState:",U)}}function re(){try{n.texStorage2D(...arguments)}catch(U){Ne("WebGLState:",U)}}function Ie(){try{n.texStorage3D(...arguments)}catch(U){Ne("WebGLState:",U)}}function Fe(){try{n.texImage2D(...arguments)}catch(U){Ne("WebGLState:",U)}}function Q(){try{n.texImage3D(...arguments)}catch(U){Ne("WebGLState:",U)}}function ne(U){Ve.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),Ve.copy(U))}function ve(U){mt.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),mt.copy(U))}function Me(U,oe){let ie=c.get(oe);ie===void 0&&(ie=new WeakMap,c.set(oe,ie));let xe=ie.get(U);xe===void 0&&(xe=n.getUniformBlockIndex(oe,U.name),ie.set(U,xe))}function me(U,oe){let xe=c.get(oe).get(U);l.get(oe)!==xe&&(n.uniformBlockBinding(oe,xe,U.__bindingPointIndex),l.set(oe,xe))}function qe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},j=null,le={},d={},u=new WeakMap,p=[],g=null,y=!1,f=null,m=null,x=null,v=null,M=null,T=null,E=null,A=new ze(0,0,0),_=0,w=!1,V=null,C=null,O=null,k=null,D=null,Ve.set(0,0,n.canvas.width,n.canvas.height),mt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:se,disable:ae,bindFramebuffer:We,drawBuffers:De,useProgram:ke,setBlending:at,setMaterial:gt,setFlipSided:$e,setCullFace:Dt,setLineWidth:L,setPolygonOffset:Ft,setScissorTest:st,activeTexture:vt,bindTexture:we,unbindTexture:R,compressedTexImage2D:b,compressedTexImage3D:F,texImage2D:Fe,texImage3D:Q,updateUBOMapping:Me,uniformBlockBinding:me,texStorage2D:re,texStorage3D:Ie,texSubImage2D:Y,texSubImage3D:J,compressedTexSubImage2D:q,compressedTexSubImage3D:_e,scissor:ne,viewport:ve,reset:qe}}function Yv(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,h=new WeakMap,d,u=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,b){return p?new OffscreenCanvas(R,b):Vr("canvas")}function y(R,b,F){let Y=1,J=we(R);if((J.width>F||J.height>F)&&(Y=F/Math.max(J.width,J.height)),Y<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let q=Math.floor(Y*J.width),_e=Math.floor(Y*J.height);d===void 0&&(d=g(q,_e));let re=b?g(q,_e):d;return re.width=q,re.height=_e,re.getContext("2d").drawImage(R,0,0,q,_e),Le("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+q+"x"+_e+")."),re}else return"data"in R&&Le("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),R;return R}function f(R){return R.generateMipmaps}function m(R){n.generateMipmap(R)}function x(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(R,b,F,Y,J=!1){if(R!==null){if(n[R]!==void 0)return n[R];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let q=b;if(b===n.RED&&(F===n.FLOAT&&(q=n.R32F),F===n.HALF_FLOAT&&(q=n.R16F),F===n.UNSIGNED_BYTE&&(q=n.R8)),b===n.RED_INTEGER&&(F===n.UNSIGNED_BYTE&&(q=n.R8UI),F===n.UNSIGNED_SHORT&&(q=n.R16UI),F===n.UNSIGNED_INT&&(q=n.R32UI),F===n.BYTE&&(q=n.R8I),F===n.SHORT&&(q=n.R16I),F===n.INT&&(q=n.R32I)),b===n.RG&&(F===n.FLOAT&&(q=n.RG32F),F===n.HALF_FLOAT&&(q=n.RG16F),F===n.UNSIGNED_BYTE&&(q=n.RG8)),b===n.RG_INTEGER&&(F===n.UNSIGNED_BYTE&&(q=n.RG8UI),F===n.UNSIGNED_SHORT&&(q=n.RG16UI),F===n.UNSIGNED_INT&&(q=n.RG32UI),F===n.BYTE&&(q=n.RG8I),F===n.SHORT&&(q=n.RG16I),F===n.INT&&(q=n.RG32I)),b===n.RGB_INTEGER&&(F===n.UNSIGNED_BYTE&&(q=n.RGB8UI),F===n.UNSIGNED_SHORT&&(q=n.RGB16UI),F===n.UNSIGNED_INT&&(q=n.RGB32UI),F===n.BYTE&&(q=n.RGB8I),F===n.SHORT&&(q=n.RGB16I),F===n.INT&&(q=n.RGB32I)),b===n.RGBA_INTEGER&&(F===n.UNSIGNED_BYTE&&(q=n.RGBA8UI),F===n.UNSIGNED_SHORT&&(q=n.RGBA16UI),F===n.UNSIGNED_INT&&(q=n.RGBA32UI),F===n.BYTE&&(q=n.RGBA8I),F===n.SHORT&&(q=n.RGBA16I),F===n.INT&&(q=n.RGBA32I)),b===n.RGB&&(F===n.UNSIGNED_INT_5_9_9_9_REV&&(q=n.RGB9_E5),F===n.UNSIGNED_INT_10F_11F_11F_REV&&(q=n.R11F_G11F_B10F)),b===n.RGBA){let _e=J?Ao:Ke.getTransfer(Y);F===n.FLOAT&&(q=n.RGBA32F),F===n.HALF_FLOAT&&(q=n.RGBA16F),F===n.UNSIGNED_BYTE&&(q=_e===ot?n.SRGB8_ALPHA8:n.RGBA8),F===n.UNSIGNED_SHORT_4_4_4_4&&(q=n.RGBA4),F===n.UNSIGNED_SHORT_5_5_5_1&&(q=n.RGB5_A1)}return(q===n.R16F||q===n.R32F||q===n.RG16F||q===n.RG32F||q===n.RGBA16F||q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function M(R,b){let F;return R?b===null||b===ti||b===Kr?F=n.DEPTH24_STENCIL8:b===ni?F=n.DEPTH32F_STENCIL8:b===Jr&&(F=n.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===ti||b===Kr?F=n.DEPTH_COMPONENT24:b===ni?F=n.DEPTH_COMPONENT32F:b===Jr&&(F=n.DEPTH_COMPONENT16),F}function T(R,b){return f(R)===!0||R.isFramebufferTexture&&R.minFilter!==Bt&&R.minFilter!==Ht?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function E(R){let b=R.target;b.removeEventListener("dispose",E),_(b),b.isVideoTexture&&h.delete(b)}function A(R){let b=R.target;b.removeEventListener("dispose",A),V(b)}function _(R){let b=i.get(R);if(b.__webglInit===void 0)return;let F=R.source,Y=u.get(F);if(Y){let J=Y[b.__cacheKey];J.usedTimes--,J.usedTimes===0&&w(R),Object.keys(Y).length===0&&u.delete(F)}i.remove(R)}function w(R){let b=i.get(R);n.deleteTexture(b.__webglTexture);let F=R.source,Y=u.get(F);delete Y[b.__cacheKey],o.memory.textures--}function V(R){let b=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(b.__webglFramebuffer[Y]))for(let J=0;J<b.__webglFramebuffer[Y].length;J++)n.deleteFramebuffer(b.__webglFramebuffer[Y][J]);else n.deleteFramebuffer(b.__webglFramebuffer[Y]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[Y])}else{if(Array.isArray(b.__webglFramebuffer))for(let Y=0;Y<b.__webglFramebuffer.length;Y++)n.deleteFramebuffer(b.__webglFramebuffer[Y]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Y=0;Y<b.__webglColorRenderbuffer.length;Y++)b.__webglColorRenderbuffer[Y]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[Y]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let F=R.textures;for(let Y=0,J=F.length;Y<J;Y++){let q=i.get(F[Y]);q.__webglTexture&&(n.deleteTexture(q.__webglTexture),o.memory.textures--),i.remove(F[Y])}i.remove(R)}let C=0;function O(){C=0}function k(){let R=C;return R>=s.maxTextures&&Le("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),C+=1,R}function D(R){let b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function N(R,b){let F=i.get(R);if(R.isVideoTexture&&st(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&F.__version!==R.version){let Y=R.image;if(Y===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{Z(F,R,b);return}}else R.isExternalTexture&&(F.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,F.__webglTexture,n.TEXTURE0+b)}function H(R,b){let F=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&F.__version!==R.version){Z(F,R,b);return}else R.isExternalTexture&&(F.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,F.__webglTexture,n.TEXTURE0+b)}function z(R,b){let F=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&F.__version!==R.version){Z(F,R,b);return}t.bindTexture(n.TEXTURE_3D,F.__webglTexture,n.TEXTURE0+b)}function K(R,b){let F=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&F.__version!==R.version){se(F,R,b);return}t.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+b)}let j={[kr]:n.REPEAT,[kn]:n.CLAMP_TO_EDGE,[Br]:n.MIRRORED_REPEAT},le={[Bt]:n.NEAREST,[Tl]:n.NEAREST_MIPMAP_NEAREST,[er]:n.NEAREST_MIPMAP_LINEAR,[Ht]:n.LINEAR,[jr]:n.LINEAR_MIPMAP_NEAREST,[gi]:n.LINEAR_MIPMAP_LINEAR},pe={[jf]:n.NEVER,[tp]:n.ALWAYS,[Jf]:n.LESS,[uc]:n.LEQUAL,[Kf]:n.EQUAL,[dc]:n.GEQUAL,[Qf]:n.GREATER,[ep]:n.NOTEQUAL};function he(R,b){if(b.type===ni&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Ht||b.magFilter===jr||b.magFilter===er||b.magFilter===gi||b.minFilter===Ht||b.minFilter===jr||b.minFilter===er||b.minFilter===gi)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,j[b.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,j[b.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,j[b.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,le[b.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,le[b.minFilter]),b.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,pe[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Bt||b.minFilter!==er&&b.minFilter!==gi||b.type===ni&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){let F=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function Ve(R,b){let F=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",E));let Y=b.source,J=u.get(Y);J===void 0&&(J={},u.set(Y,J));let q=D(b);if(q!==R.__cacheKey){J[q]===void 0&&(J[q]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,F=!0),J[q].usedTimes++;let _e=J[R.__cacheKey];_e!==void 0&&(J[R.__cacheKey].usedTimes--,_e.usedTimes===0&&w(b)),R.__cacheKey=q,R.__webglTexture=J[q].texture}return F}function mt(R,b,F){return Math.floor(Math.floor(R/F)/b)}function Mt(R,b,F,Y){let q=R.updateRanges;if(q.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,b.width,b.height,F,Y,b.data);else{q.sort((Q,ne)=>Q.start-ne.start);let _e=0;for(let Q=1;Q<q.length;Q++){let ne=q[_e],ve=q[Q],Me=ne.start+ne.count,me=mt(ve.start,b.width,4),qe=mt(ne.start,b.width,4);ve.start<=Me+1&&me===qe&&mt(ve.start+ve.count-1,b.width,4)===me?ne.count=Math.max(ne.count,ve.start+ve.count-ne.start):(++_e,q[_e]=ve)}q.length=_e+1;let re=n.getParameter(n.UNPACK_ROW_LENGTH),Ie=n.getParameter(n.UNPACK_SKIP_PIXELS),Fe=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,b.width);for(let Q=0,ne=q.length;Q<ne;Q++){let ve=q[Q],Me=Math.floor(ve.start/4),me=Math.ceil(ve.count/4),qe=Me%b.width,U=Math.floor(Me/b.width),oe=me,ie=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,qe),n.pixelStorei(n.UNPACK_SKIP_ROWS,U),t.texSubImage2D(n.TEXTURE_2D,0,qe,U,oe,ie,F,Y,b.data)}R.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,re),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ie),n.pixelStorei(n.UNPACK_SKIP_ROWS,Fe)}}function Z(R,b,F){let Y=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Y=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Y=n.TEXTURE_3D);let J=Ve(R,b),q=b.source;t.bindTexture(Y,R.__webglTexture,n.TEXTURE0+F);let _e=i.get(q);if(q.version!==_e.__version||J===!0){t.activeTexture(n.TEXTURE0+F);let re=Ke.getPrimaries(Ke.workingColorSpace),Ie=b.colorSpace===ii?null:Ke.getPrimaries(b.colorSpace),Fe=b.colorSpace===ii||re===Ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let Q=y(b.image,!1,s.maxTextureSize);Q=vt(b,Q);let ne=r.convert(b.format,b.colorSpace),ve=r.convert(b.type),Me=v(b.internalFormat,ne,ve,b.colorSpace,b.isVideoTexture);he(Y,b);let me,qe=b.mipmaps,U=b.isVideoTexture!==!0,oe=_e.__version===void 0||J===!0,ie=q.dataReady,xe=T(b,Q);if(b.isDepthTexture)Me=M(b.format===ws,b.type),oe&&(U?t.texStorage2D(n.TEXTURE_2D,1,Me,Q.width,Q.height):t.texImage2D(n.TEXTURE_2D,0,Me,Q.width,Q.height,0,ne,ve,null));else if(b.isDataTexture)if(qe.length>0){U&&oe&&t.texStorage2D(n.TEXTURE_2D,xe,Me,qe[0].width,qe[0].height);for(let ee=0,$=qe.length;ee<$;ee++)me=qe[ee],U?ie&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,me.width,me.height,ne,ve,me.data):t.texImage2D(n.TEXTURE_2D,ee,Me,me.width,me.height,0,ne,ve,me.data);b.generateMipmaps=!1}else U?(oe&&t.texStorage2D(n.TEXTURE_2D,xe,Me,Q.width,Q.height),ie&&Mt(b,Q,ne,ve)):t.texImage2D(n.TEXTURE_2D,0,Me,Q.width,Q.height,0,ne,ve,Q.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){U&&oe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,xe,Me,qe[0].width,qe[0].height,Q.depth);for(let ee=0,$=qe.length;ee<$;ee++)if(me=qe[ee],b.format!==bn)if(ne!==null)if(U){if(ie)if(b.layerUpdates.size>0){let be=ou(me.width,me.height,b.format,b.type);for(let Be of b.layerUpdates){let bt=me.data.subarray(Be*be/me.data.BYTES_PER_ELEMENT,(Be+1)*be/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,Be,me.width,me.height,1,ne,bt)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,0,me.width,me.height,Q.depth,ne,me.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ee,Me,me.width,me.height,Q.depth,0,me.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ie&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,0,me.width,me.height,Q.depth,ne,ve,me.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ee,Me,me.width,me.height,Q.depth,0,ne,ve,me.data)}else{U&&oe&&t.texStorage2D(n.TEXTURE_2D,xe,Me,qe[0].width,qe[0].height);for(let ee=0,$=qe.length;ee<$;ee++)me=qe[ee],b.format!==bn?ne!==null?U?ie&&t.compressedTexSubImage2D(n.TEXTURE_2D,ee,0,0,me.width,me.height,ne,me.data):t.compressedTexImage2D(n.TEXTURE_2D,ee,Me,me.width,me.height,0,me.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ie&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,me.width,me.height,ne,ve,me.data):t.texImage2D(n.TEXTURE_2D,ee,Me,me.width,me.height,0,ne,ve,me.data)}else if(b.isDataArrayTexture)if(U){if(oe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,xe,Me,Q.width,Q.height,Q.depth),ie)if(b.layerUpdates.size>0){let ee=ou(Q.width,Q.height,b.format,b.type);for(let $ of b.layerUpdates){let be=Q.data.subarray($*ee/Q.data.BYTES_PER_ELEMENT,($+1)*ee/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,$,Q.width,Q.height,1,ne,ve,be)}b.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ne,ve,Q.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Me,Q.width,Q.height,Q.depth,0,ne,ve,Q.data);else if(b.isData3DTexture)U?(oe&&t.texStorage3D(n.TEXTURE_3D,xe,Me,Q.width,Q.height,Q.depth),ie&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ne,ve,Q.data)):t.texImage3D(n.TEXTURE_3D,0,Me,Q.width,Q.height,Q.depth,0,ne,ve,Q.data);else if(b.isFramebufferTexture){if(oe)if(U)t.texStorage2D(n.TEXTURE_2D,xe,Me,Q.width,Q.height);else{let ee=Q.width,$=Q.height;for(let be=0;be<xe;be++)t.texImage2D(n.TEXTURE_2D,be,Me,ee,$,0,ne,ve,null),ee>>=1,$>>=1}}else if(qe.length>0){if(U&&oe){let ee=we(qe[0]);t.texStorage2D(n.TEXTURE_2D,xe,Me,ee.width,ee.height)}for(let ee=0,$=qe.length;ee<$;ee++)me=qe[ee],U?ie&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,ne,ve,me):t.texImage2D(n.TEXTURE_2D,ee,Me,ne,ve,me);b.generateMipmaps=!1}else if(U){if(oe){let ee=we(Q);t.texStorage2D(n.TEXTURE_2D,xe,Me,ee.width,ee.height)}ie&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ne,ve,Q)}else t.texImage2D(n.TEXTURE_2D,0,Me,ne,ve,Q);f(b)&&m(Y),_e.__version=q.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function se(R,b,F){if(b.image.length!==6)return;let Y=Ve(R,b),J=b.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+F);let q=i.get(J);if(J.version!==q.__version||Y===!0){t.activeTexture(n.TEXTURE0+F);let _e=Ke.getPrimaries(Ke.workingColorSpace),re=b.colorSpace===ii?null:Ke.getPrimaries(b.colorSpace),Ie=b.colorSpace===ii||_e===re?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);let Fe=b.isCompressedTexture||b.image[0].isCompressedTexture,Q=b.image[0]&&b.image[0].isDataTexture,ne=[];for(let $=0;$<6;$++)!Fe&&!Q?ne[$]=y(b.image[$],!0,s.maxCubemapSize):ne[$]=Q?b.image[$].image:b.image[$],ne[$]=vt(b,ne[$]);let ve=ne[0],Me=r.convert(b.format,b.colorSpace),me=r.convert(b.type),qe=v(b.internalFormat,Me,me,b.colorSpace),U=b.isVideoTexture!==!0,oe=q.__version===void 0||Y===!0,ie=J.dataReady,xe=T(b,ve);he(n.TEXTURE_CUBE_MAP,b);let ee;if(Fe){U&&oe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,xe,qe,ve.width,ve.height);for(let $=0;$<6;$++){ee=ne[$].mipmaps;for(let be=0;be<ee.length;be++){let Be=ee[be];b.format!==bn?Me!==null?U?ie&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,be,0,0,Be.width,Be.height,Me,Be.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,be,qe,Be.width,Be.height,0,Be.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,be,0,0,Be.width,Be.height,Me,me,Be.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,be,qe,Be.width,Be.height,0,Me,me,Be.data)}}}else{if(ee=b.mipmaps,U&&oe){ee.length>0&&xe++;let $=we(ne[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,xe,qe,$.width,$.height)}for(let $=0;$<6;$++)if(Q){U?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ne[$].width,ne[$].height,Me,me,ne[$].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,qe,ne[$].width,ne[$].height,0,Me,me,ne[$].data);for(let be=0;be<ee.length;be++){let bt=ee[be].image[$].image;U?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,be+1,0,0,bt.width,bt.height,Me,me,bt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,be+1,qe,bt.width,bt.height,0,Me,me,bt.data)}}else{U?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Me,me,ne[$]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,qe,Me,me,ne[$]);for(let be=0;be<ee.length;be++){let Be=ee[be];U?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,be+1,0,0,Me,me,Be.image[$]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,be+1,qe,Me,me,Be.image[$])}}}f(b)&&m(n.TEXTURE_CUBE_MAP),q.__version=J.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function ae(R,b,F,Y,J,q){let _e=r.convert(F.format,F.colorSpace),re=r.convert(F.type),Ie=v(F.internalFormat,_e,re,F.colorSpace),Fe=i.get(b),Q=i.get(F);if(Q.__renderTarget=b,!Fe.__hasExternalTextures){let ne=Math.max(1,b.width>>q),ve=Math.max(1,b.height>>q);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?t.texImage3D(J,q,Ie,ne,ve,b.depth,0,_e,re,null):t.texImage2D(J,q,Ie,ne,ve,0,_e,re,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),Ft(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Y,J,Q.__webglTexture,0,L(b)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Y,J,Q.__webglTexture,q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function We(R,b,F){if(n.bindRenderbuffer(n.RENDERBUFFER,R),b.depthBuffer){let Y=b.depthTexture,J=Y&&Y.isDepthTexture?Y.type:null,q=M(b.stencilBuffer,J),_e=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Ft(b)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,L(b),q,b.width,b.height):F?n.renderbufferStorageMultisample(n.RENDERBUFFER,L(b),q,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,q,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,_e,n.RENDERBUFFER,R)}else{let Y=b.textures;for(let J=0;J<Y.length;J++){let q=Y[J],_e=r.convert(q.format,q.colorSpace),re=r.convert(q.type),Ie=v(q.internalFormat,_e,re,q.colorSpace);Ft(b)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,L(b),Ie,b.width,b.height):F?n.renderbufferStorageMultisample(n.RENDERBUFFER,L(b),Ie,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,Ie,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function De(R,b,F){let Y=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let J=i.get(b.depthTexture);if(J.__renderTarget=b,(!J.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),Y){if(J.__webglInit===void 0&&(J.__webglInit=!0,b.depthTexture.addEventListener("dispose",E)),J.__webglTexture===void 0){J.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture),he(n.TEXTURE_CUBE_MAP,b.depthTexture);let Fe=r.convert(b.depthTexture.format),Q=r.convert(b.depthTexture.type),ne;b.depthTexture.format===di?ne=n.DEPTH_COMPONENT24:b.depthTexture.format===ws&&(ne=n.DEPTH24_STENCIL8);for(let ve=0;ve<6;ve++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,ne,b.width,b.height,0,Fe,Q,null)}}else N(b.depthTexture,0);let q=J.__webglTexture,_e=L(b),re=Y?n.TEXTURE_CUBE_MAP_POSITIVE_X+F:n.TEXTURE_2D,Ie=b.depthTexture.format===ws?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(b.depthTexture.format===di)Ft(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ie,re,q,0,_e):n.framebufferTexture2D(n.FRAMEBUFFER,Ie,re,q,0);else if(b.depthTexture.format===ws)Ft(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ie,re,q,0,_e):n.framebufferTexture2D(n.FRAMEBUFFER,Ie,re,q,0);else throw new Error("Unknown depthTexture format")}function ke(R){let b=i.get(R),F=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){let Y=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Y){let J=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Y.removeEventListener("dispose",J)};Y.addEventListener("dispose",J),b.__depthDisposeCallback=J}b.__boundDepthTexture=Y}if(R.depthTexture&&!b.__autoAllocateDepthBuffer)if(F)for(let Y=0;Y<6;Y++)De(b.__webglFramebuffer[Y],R,Y);else{let Y=R.texture.mipmaps;Y&&Y.length>0?De(b.__webglFramebuffer[0],R,0):De(b.__webglFramebuffer,R,0)}else if(F){b.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[Y]),b.__webglDepthbuffer[Y]===void 0)b.__webglDepthbuffer[Y]=n.createRenderbuffer(),We(b.__webglDepthbuffer[Y],R,!1);else{let J=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=b.__webglDepthbuffer[Y];n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,q)}}else{let Y=R.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),We(b.__webglDepthbuffer,R,!1);else{let J=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,q)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Yt(R,b,F){let Y=i.get(R);b!==void 0&&ae(Y.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),F!==void 0&&ke(R)}function Qe(R){let b=R.texture,F=i.get(R),Y=i.get(b);R.addEventListener("dispose",A);let J=R.textures,q=R.isWebGLCubeRenderTarget===!0,_e=J.length>1;if(_e||(Y.__webglTexture===void 0&&(Y.__webglTexture=n.createTexture()),Y.__version=b.version,o.memory.textures++),q){F.__webglFramebuffer=[];for(let re=0;re<6;re++)if(b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer[re]=[];for(let Ie=0;Ie<b.mipmaps.length;Ie++)F.__webglFramebuffer[re][Ie]=n.createFramebuffer()}else F.__webglFramebuffer[re]=n.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer=[];for(let re=0;re<b.mipmaps.length;re++)F.__webglFramebuffer[re]=n.createFramebuffer()}else F.__webglFramebuffer=n.createFramebuffer();if(_e)for(let re=0,Ie=J.length;re<Ie;re++){let Fe=i.get(J[re]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&Ft(R)===!1){F.__webglMultisampledFramebuffer=n.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let re=0;re<J.length;re++){let Ie=J[re];F.__webglColorRenderbuffer[re]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,F.__webglColorRenderbuffer[re]);let Fe=r.convert(Ie.format,Ie.colorSpace),Q=r.convert(Ie.type),ne=v(Ie.internalFormat,Fe,Q,Ie.colorSpace,R.isXRRenderTarget===!0),ve=L(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,ve,ne,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,F.__webglColorRenderbuffer[re])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(F.__webglDepthRenderbuffer=n.createRenderbuffer(),We(F.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(q){t.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture),he(n.TEXTURE_CUBE_MAP,b);for(let re=0;re<6;re++)if(b.mipmaps&&b.mipmaps.length>0)for(let Ie=0;Ie<b.mipmaps.length;Ie++)ae(F.__webglFramebuffer[re][Ie],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie);else ae(F.__webglFramebuffer[re],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);f(b)&&m(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(_e){for(let re=0,Ie=J.length;re<Ie;re++){let Fe=J[re],Q=i.get(Fe),ne=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ne=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ne,Q.__webglTexture),he(ne,Fe),ae(F.__webglFramebuffer,R,Fe,n.COLOR_ATTACHMENT0+re,ne,0),f(Fe)&&m(ne)}t.unbindTexture()}else{let re=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(re=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,Y.__webglTexture),he(re,b),b.mipmaps&&b.mipmaps.length>0)for(let Ie=0;Ie<b.mipmaps.length;Ie++)ae(F.__webglFramebuffer[Ie],R,b,n.COLOR_ATTACHMENT0,re,Ie);else ae(F.__webglFramebuffer,R,b,n.COLOR_ATTACHMENT0,re,0);f(b)&&m(re),t.unbindTexture()}R.depthBuffer&&ke(R)}function at(R){let b=R.textures;for(let F=0,Y=b.length;F<Y;F++){let J=b[F];if(f(J)){let q=x(R),_e=i.get(J).__webglTexture;t.bindTexture(q,_e),m(q),t.unbindTexture()}}}let gt=[],$e=[];function Dt(R){if(R.samples>0){if(Ft(R)===!1){let b=R.textures,F=R.width,Y=R.height,J=n.COLOR_BUFFER_BIT,q=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,_e=i.get(R),re=b.length>1;if(re)for(let Fe=0;Fe<b.length;Fe++)t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Fe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Fe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer);let Ie=R.texture.mipmaps;Ie&&Ie.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let Fe=0;Fe<b.length;Fe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),re){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,_e.__webglColorRenderbuffer[Fe]);let Q=i.get(b[Fe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Q,0)}n.blitFramebuffer(0,0,F,Y,0,0,F,Y,J,n.NEAREST),l===!0&&(gt.length=0,$e.length=0,gt.push(n.COLOR_ATTACHMENT0+Fe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(gt.push(q),$e.push(q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,$e)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,gt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),re)for(let Fe=0;Fe<b.length;Fe++){t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Fe,n.RENDERBUFFER,_e.__webglColorRenderbuffer[Fe]);let Q=i.get(b[Fe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Fe,n.TEXTURE_2D,Q,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let b=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}function L(R){return Math.min(s.maxSamples,R.samples)}function Ft(R){let b=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function st(R){let b=o.render.frame;h.get(R)!==b&&(h.set(R,b),R.update())}function vt(R,b){let F=R.colorSpace,Y=R.format,J=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||F!==Ys&&F!==ii&&(Ke.getTransfer(F)===ot?(Y!==bn||J!==Dn)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ne("WebGLTextures: Unsupported texture color space:",F)),b}function we(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=O,this.setTexture2D=N,this.setTexture2DArray=H,this.setTexture3D=z,this.setTextureCube=K,this.rebindTextures=Yt,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=at,this.updateMultisampleRenderTarget=Dt,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=ae,this.useMultisampledRTT=Ft,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Zv(n,e){function t(i,s=ii){let r,o=Ke.getTransfer(s);if(i===Dn)return n.UNSIGNED_BYTE;if(i===Rl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Cl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Yh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Zh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===$h)return n.BYTE;if(i===qh)return n.SHORT;if(i===Jr)return n.UNSIGNED_SHORT;if(i===Al)return n.INT;if(i===ti)return n.UNSIGNED_INT;if(i===ni)return n.FLOAT;if(i===yi)return n.HALF_FLOAT;if(i===jh)return n.ALPHA;if(i===Jh)return n.RGB;if(i===bn)return n.RGBA;if(i===di)return n.DEPTH_COMPONENT;if(i===ws)return n.DEPTH_STENCIL;if(i===Kh)return n.RED;if(i===Il)return n.RED_INTEGER;if(i===tr)return n.RG;if(i===Pl)return n.RG_INTEGER;if(i===Ll)return n.RGBA_INTEGER;if(i===qo||i===Yo||i===Zo||i===jo)if(o===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===qo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===jo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===qo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Yo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Zo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===jo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Dl||i===Nl||i===Ol||i===Ul)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Dl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Nl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ol)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ul)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Fl||i===kl||i===Bl||i===zl||i===Vl||i===Hl||i===Gl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Fl||i===kl)return o===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Bl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===zl)return r.COMPRESSED_R11_EAC;if(i===Vl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Hl)return r.COMPRESSED_RG11_EAC;if(i===Gl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Wl||i===Xl||i===$l||i===ql||i===Yl||i===Zl||i===jl||i===Jl||i===Kl||i===Ql||i===ec||i===tc||i===nc||i===ic)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Wl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Xl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===$l)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ql)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Yl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Zl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===jl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Jl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Kl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ql)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ec)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===tc)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===nc)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ic)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===sc||i===rc||i===oc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===sc)return o===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===rc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===oc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ac||i===lc||i===cc||i===hc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===ac)return r.COMPRESSED_RED_RGTC1_EXT;if(i===lc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===cc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===hc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Kr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var jv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Jv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,vu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Uo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Pn({vertexShader:jv,fragmentShader:Jv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ue(new zi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},bu=class extends fi{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,g=null,y=typeof XRWebGLBinding<"u",f=new vu,m={},x=t.getContextAttributes(),v=null,M=null,T=[],E=[],A=new Oe,_=null,w=new on;w.viewport=new Pt;let V=new on;V.viewport=new Pt;let C=[w,V],O=new Sl,k=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let se=T[Z];return se===void 0&&(se=new $r,T[Z]=se),se.getTargetRaySpace()},this.getControllerGrip=function(Z){let se=T[Z];return se===void 0&&(se=new $r,T[Z]=se),se.getGripSpace()},this.getHand=function(Z){let se=T[Z];return se===void 0&&(se=new $r,T[Z]=se),se.getHandSpace()};function N(Z){let se=E.indexOf(Z.inputSource);if(se===-1)return;let ae=T[se];ae!==void 0&&(ae.update(Z.inputSource,Z.frame,c||o),ae.dispatchEvent({type:Z.type,data:Z.inputSource}))}function H(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",z);for(let Z=0;Z<T.length;Z++){let se=E[Z];se!==null&&(E[Z]=null,T[Z].disconnect(se))}k=null,D=null,f.reset();for(let Z in m)delete m[Z];e.setRenderTarget(v),p=null,u=null,d=null,s=null,M=null,Mt.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,i.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,i.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",H),s.addEventListener("inputsourceschange",z),x.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(A),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let ae=null,We=null,De=null;x.depth&&(De=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=x.stencil?ws:di,We=x.stencil?Kr:ti);let ke={colorFormat:t.RGBA8,depthFormat:De,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(ke),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),M=new Cn(u.textureWidth,u.textureHeight,{format:bn,type:Dn,depthTexture:new ms(u.textureWidth,u.textureHeight,We,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let ae={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ae),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new Cn(p.framebufferWidth,p.framebufferHeight,{format:bn,type:Dn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Mt.setContext(s),Mt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function z(Z){for(let se=0;se<Z.removed.length;se++){let ae=Z.removed[se],We=E.indexOf(ae);We>=0&&(E[We]=null,T[We].disconnect(ae))}for(let se=0;se<Z.added.length;se++){let ae=Z.added[se],We=E.indexOf(ae);if(We===-1){for(let ke=0;ke<T.length;ke++)if(ke>=E.length){E.push(ae),We=ke;break}else if(E[ke]===null){E[ke]=ae,We=ke;break}if(We===-1)break}let De=T[We];De&&De.connect(ae)}}let K=new I,j=new I;function le(Z,se,ae){K.setFromMatrixPosition(se.matrixWorld),j.setFromMatrixPosition(ae.matrixWorld);let We=K.distanceTo(j),De=se.projectionMatrix.elements,ke=ae.projectionMatrix.elements,Yt=De[14]/(De[10]-1),Qe=De[14]/(De[10]+1),at=(De[9]+1)/De[5],gt=(De[9]-1)/De[5],$e=(De[8]-1)/De[0],Dt=(ke[8]+1)/ke[0],L=Yt*$e,Ft=Yt*Dt,st=We/(-$e+Dt),vt=st*-$e;if(se.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(vt),Z.translateZ(st),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),De[10]===-1)Z.projectionMatrix.copy(se.projectionMatrix),Z.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{let we=Yt+st,R=Qe+st,b=L-vt,F=Ft+(We-vt),Y=at*Qe/R*we,J=gt*Qe/R*we;Z.projectionMatrix.makePerspective(b,F,Y,J,we,R),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function pe(Z,se){se===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(se.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let se=Z.near,ae=Z.far;f.texture!==null&&(f.depthNear>0&&(se=f.depthNear),f.depthFar>0&&(ae=f.depthFar)),O.near=V.near=w.near=se,O.far=V.far=w.far=ae,(k!==O.near||D!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,D=O.far),O.layers.mask=Z.layers.mask|6,w.layers.mask=O.layers.mask&-5,V.layers.mask=O.layers.mask&-3;let We=Z.parent,De=O.cameras;pe(O,We);for(let ke=0;ke<De.length;ke++)pe(De[ke],We);De.length===2?le(O,w,V):O.projectionMatrix.copy(w.projectionMatrix),he(Z,O,We)};function he(Z,se,ae){ae===null?Z.matrix.copy(se.matrixWorld):(Z.matrix.copy(ae.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(se.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(se.projectionMatrix),Z.projectionMatrixInverse.copy(se.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Gr*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(O)},this.getCameraTexture=function(Z){return m[Z]};let Ve=null;function mt(Z,se){if(h=se.getViewerPose(c||o),g=se,h!==null){let ae=h.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let We=!1;ae.length!==O.cameras.length&&(O.cameras.length=0,We=!0);for(let Qe=0;Qe<ae.length;Qe++){let at=ae[Qe],gt=null;if(p!==null)gt=p.getViewport(at);else{let Dt=d.getViewSubImage(u,at);gt=Dt.viewport,Qe===0&&(e.setRenderTargetTextures(M,Dt.colorTexture,Dt.depthStencilTexture),e.setRenderTarget(M))}let $e=C[Qe];$e===void 0&&($e=new on,$e.layers.enable(Qe),$e.viewport=new Pt,C[Qe]=$e),$e.matrix.fromArray(at.transform.matrix),$e.matrix.decompose($e.position,$e.quaternion,$e.scale),$e.projectionMatrix.fromArray(at.projectionMatrix),$e.projectionMatrixInverse.copy($e.projectionMatrix).invert(),$e.viewport.set(gt.x,gt.y,gt.width,gt.height),Qe===0&&(O.matrix.copy($e.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),We===!0&&O.cameras.push($e)}let De=s.enabledFeatures;if(De&&De.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=i.getBinding();let Qe=d.getDepthInformation(ae[0]);Qe&&Qe.isValid&&Qe.texture&&f.init(Qe,s.renderState)}if(De&&De.includes("camera-access")&&y){e.state.unbindTexture(),d=i.getBinding();for(let Qe=0;Qe<ae.length;Qe++){let at=ae[Qe].camera;if(at){let gt=m[at];gt||(gt=new Uo,m[at]=gt);let $e=d.getCameraImage(at);gt.sourceTexture=$e}}}}for(let ae=0;ae<T.length;ae++){let We=E[ae],De=T[ae];We!==null&&De!==void 0&&De.update(We,se,c||o)}Ve&&Ve(Z,se),se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:se}),g=null}let Mt=new Pp;Mt.setAnimationLoop(mt),this.setAnimationLoop=function(Z){Ve=Z},this.dispose=function(){}}},sr=new yn,Kv=new nt;function Qv(n,e){function t(f,m){f.matrixAutoUpdate===!0&&f.updateMatrix(),m.value.copy(f.matrix)}function i(f,m){m.color.getRGB(f.fogColor.value,iu(n)),m.isFog?(f.fogNear.value=m.near,f.fogFar.value=m.far):m.isFogExp2&&(f.fogDensity.value=m.density)}function s(f,m,x,v,M){m.isMeshBasicMaterial?r(f,m):m.isMeshLambertMaterial?(r(f,m),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(f,m),d(f,m)):m.isMeshPhongMaterial?(r(f,m),h(f,m),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(f,m),u(f,m),m.isMeshPhysicalMaterial&&p(f,m,M)):m.isMeshMatcapMaterial?(r(f,m),g(f,m)):m.isMeshDepthMaterial?r(f,m):m.isMeshDistanceMaterial?(r(f,m),y(f,m)):m.isMeshNormalMaterial?r(f,m):m.isLineBasicMaterial?(o(f,m),m.isLineDashedMaterial&&a(f,m)):m.isPointsMaterial?l(f,m,x,v):m.isSpriteMaterial?c(f,m):m.isShadowMaterial?(f.color.value.copy(m.color),f.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(f,m){f.opacity.value=m.opacity,m.color&&f.diffuse.value.copy(m.color),m.emissive&&f.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(f.map.value=m.map,t(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.bumpMap&&(f.bumpMap.value=m.bumpMap,t(m.bumpMap,f.bumpMapTransform),f.bumpScale.value=m.bumpScale,m.side===xn&&(f.bumpScale.value*=-1)),m.normalMap&&(f.normalMap.value=m.normalMap,t(m.normalMap,f.normalMapTransform),f.normalScale.value.copy(m.normalScale),m.side===xn&&f.normalScale.value.negate()),m.displacementMap&&(f.displacementMap.value=m.displacementMap,t(m.displacementMap,f.displacementMapTransform),f.displacementScale.value=m.displacementScale,f.displacementBias.value=m.displacementBias),m.emissiveMap&&(f.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,f.emissiveMapTransform)),m.specularMap&&(f.specularMap.value=m.specularMap,t(m.specularMap,f.specularMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest);let x=e.get(m),v=x.envMap,M=x.envMapRotation;v&&(f.envMap.value=v,sr.copy(M),sr.x*=-1,sr.y*=-1,sr.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(sr.y*=-1,sr.z*=-1),f.envMapRotation.value.setFromMatrix4(Kv.makeRotationFromEuler(sr)),f.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=m.reflectivity,f.ior.value=m.ior,f.refractionRatio.value=m.refractionRatio),m.lightMap&&(f.lightMap.value=m.lightMap,f.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,f.lightMapTransform)),m.aoMap&&(f.aoMap.value=m.aoMap,f.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,f.aoMapTransform))}function o(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,m.map&&(f.map.value=m.map,t(m.map,f.mapTransform))}function a(f,m){f.dashSize.value=m.dashSize,f.totalSize.value=m.dashSize+m.gapSize,f.scale.value=m.scale}function l(f,m,x,v){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.size.value=m.size*x,f.scale.value=v*.5,m.map&&(f.map.value=m.map,t(m.map,f.uvTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function c(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.rotation.value=m.rotation,m.map&&(f.map.value=m.map,t(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function h(f,m){f.specular.value.copy(m.specular),f.shininess.value=Math.max(m.shininess,1e-4)}function d(f,m){m.gradientMap&&(f.gradientMap.value=m.gradientMap)}function u(f,m){f.metalness.value=m.metalness,m.metalnessMap&&(f.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,f.metalnessMapTransform)),f.roughness.value=m.roughness,m.roughnessMap&&(f.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,f.roughnessMapTransform)),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)}function p(f,m,x){f.ior.value=m.ior,m.sheen>0&&(f.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),f.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(f.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,f.sheenColorMapTransform)),m.sheenRoughnessMap&&(f.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,f.sheenRoughnessMapTransform))),m.clearcoat>0&&(f.clearcoat.value=m.clearcoat,f.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(f.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,f.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(f.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===xn&&f.clearcoatNormalScale.value.negate())),m.dispersion>0&&(f.dispersion.value=m.dispersion),m.iridescence>0&&(f.iridescence.value=m.iridescence,f.iridescenceIOR.value=m.iridescenceIOR,f.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(f.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,f.iridescenceMapTransform)),m.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),m.transmission>0&&(f.transmission.value=m.transmission,f.transmissionSamplerMap.value=x.texture,f.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(f.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,f.transmissionMapTransform)),f.thickness.value=m.thickness,m.thicknessMap&&(f.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=m.attenuationDistance,f.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(f.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(f.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=m.specularIntensity,f.specularColor.value.copy(m.specularColor),m.specularColorMap&&(f.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,f.specularColorMapTransform)),m.specularIntensityMap&&(f.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,m){m.matcap&&(f.matcap.value=m.matcap)}function y(f,m){let x=e.get(m).light;f.referencePosition.value.setFromMatrixPosition(x.matrixWorld),f.nearDistance.value=x.shadow.camera.near,f.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function eb(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,v){let M=v.program;i.uniformBlockBinding(x,M)}function c(x,v){let M=s[x.id];M===void 0&&(g(x),M=h(x),s[x.id]=M,x.addEventListener("dispose",f));let T=v.program;i.updateUBOMapping(x,T);let E=e.render.frame;r[x.id]!==E&&(u(x),r[x.id]=E)}function h(x){let v=d();x.__bindingPointIndex=v;let M=n.createBuffer(),T=x.__size,E=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,T,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,M),M}function d(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return Ne("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){let v=s[x.id],M=x.uniforms,T=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let E=0,A=M.length;E<A;E++){let _=Array.isArray(M[E])?M[E]:[M[E]];for(let w=0,V=_.length;w<V;w++){let C=_[w];if(p(C,E,w,T)===!0){let O=C.__offset,k=Array.isArray(C.value)?C.value:[C.value],D=0;for(let N=0;N<k.length;N++){let H=k[N],z=y(H);typeof H=="number"||typeof H=="boolean"?(C.__data[0]=H,n.bufferSubData(n.UNIFORM_BUFFER,O+D,C.__data)):H.isMatrix3?(C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0):(H.toArray(C.__data,D),D+=z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,O,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(x,v,M,T){let E=x.value,A=v+"_"+M;if(T[A]===void 0)return typeof E=="number"||typeof E=="boolean"?T[A]=E:T[A]=E.clone(),!0;{let _=T[A];if(typeof E=="number"||typeof E=="boolean"){if(_!==E)return T[A]=E,!0}else if(_.equals(E)===!1)return _.copy(E),!0}return!1}function g(x){let v=x.uniforms,M=0,T=16;for(let A=0,_=v.length;A<_;A++){let w=Array.isArray(v[A])?v[A]:[v[A]];for(let V=0,C=w.length;V<C;V++){let O=w[V],k=Array.isArray(O.value)?O.value:[O.value];for(let D=0,N=k.length;D<N;D++){let H=k[D],z=y(H),K=M%T,j=K%z.boundary,le=K+j;M+=j,le!==0&&T-le<z.storage&&(M+=T-le),O.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=M,M+=z.storage}}}let E=M%T;return E>0&&(M+=T-E),x.__size=M,x.__cache={},this}function y(x){let v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Le("WebGLRenderer: Unsupported uniform value type.",x),v}function f(x){let v=x.target;v.removeEventListener("dispose",f);let M=o.indexOf(v.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function m(){for(let x in s)n.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:l,update:c,dispose:m}}var tb=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),xi=null;function nb(){return xi===null&&(xi=new il(tb,16,16,tr,yi),xi.name="DFG_LUT",xi.minFilter=Ht,xi.magFilter=Ht,xi.wrapS=kn,xi.wrapT=kn,xi.generateMipmaps=!1,xi.needsUpdate=!0),xi}var yc=class{constructor(e={}){let{canvas:t=np(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:p=Dn}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let y=p,f=new Set([Ll,Pl,Il]),m=new Set([Dn,ti,Jr,Kr,Rl,Cl]),x=new Uint32Array(4),v=new Int32Array(4),M=null,T=null,E=[],A=[],_=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let w=this,V=!1;this._outputColorSpace=Qt;let C=0,O=0,k=null,D=-1,N=null,H=new Pt,z=new Pt,K=null,j=new ze(0),le=0,pe=t.width,he=t.height,Ve=1,mt=null,Mt=null,Z=new Pt(0,0,pe,he),se=new Pt(0,0,pe,he),ae=!1,We=new Do,De=!1,ke=!1,Yt=new nt,Qe=new I,at=new Pt,gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},$e=!1;function Dt(){return k===null?Ve:1}let L=i;function Ft(S,B){return t.getContext(S,B)}try{let S={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"183"}`),t.addEventListener("webglcontextlost",be,!1),t.addEventListener("webglcontextrestored",Be,!1),t.addEventListener("webglcontextcreationerror",bt,!1),L===null){let B="webgl2";if(L=Ft(B,S),L===null)throw Ft(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw Ne("WebGLRenderer: "+S.message),S}let st,vt,we,R,b,F,Y,J,q,_e,re,Ie,Fe,Q,ne,ve,Me,me,qe,U,oe,ie,xe;function ee(){st=new h_(L),st.init(),oe=new Zv(L,st),vt=new n_(L,st,e,oe),we=new qv(L,st),vt.reversedDepthBuffer&&u&&we.buffers.depth.setReversed(!0),R=new f_(L),b=new Dv,F=new Yv(L,st,we,b,vt,oe,R),Y=new c_(w),J=new x0(L),ie=new e_(L,J),q=new u_(L,J,R,ie),_e=new m_(L,q,J,ie,R),me=new p_(L,vt,F),ne=new i_(b),re=new Lv(w,Y,st,vt,ie,ne),Ie=new Qv(w,b),Fe=new Ov,Q=new Vv(st),Me=new Qx(w,Y,we,_e,g,l),ve=new $v(w,_e,vt),xe=new eb(L,R,vt,we),qe=new t_(L,st,R),U=new d_(L,st,R),R.programs=re.programs,w.capabilities=vt,w.extensions=st,w.properties=b,w.renderLists=Fe,w.shadowMap=ve,w.state=we,w.info=R}ee(),y!==Dn&&(_=new y_(y,t.width,t.height,s,r));let $=new bu(w,L);this.xr=$,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let S=st.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=st.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return Ve},this.setPixelRatio=function(S){S!==void 0&&(Ve=S,this.setSize(pe,he,!1))},this.getSize=function(S){return S.set(pe,he)},this.setSize=function(S,B,X=!0){if($.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}pe=S,he=B,t.width=Math.floor(S*Ve),t.height=Math.floor(B*Ve),X===!0&&(t.style.width=S+"px",t.style.height=B+"px"),_!==null&&_.setSize(t.width,t.height),this.setViewport(0,0,S,B)},this.getDrawingBufferSize=function(S){return S.set(pe*Ve,he*Ve).floor()},this.setDrawingBufferSize=function(S,B,X){pe=S,he=B,Ve=X,t.width=Math.floor(S*X),t.height=Math.floor(B*X),this.setViewport(0,0,S,B)},this.setEffects=function(S){if(y===Dn){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let B=0;B<S.length;B++)if(S[B].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}_.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(H)},this.getViewport=function(S){return S.copy(Z)},this.setViewport=function(S,B,X,W){S.isVector4?Z.set(S.x,S.y,S.z,S.w):Z.set(S,B,X,W),we.viewport(H.copy(Z).multiplyScalar(Ve).round())},this.getScissor=function(S){return S.copy(se)},this.setScissor=function(S,B,X,W){S.isVector4?se.set(S.x,S.y,S.z,S.w):se.set(S,B,X,W),we.scissor(z.copy(se).multiplyScalar(Ve).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(S){we.setScissorTest(ae=S)},this.setOpaqueSort=function(S){mt=S},this.setTransparentSort=function(S){Mt=S},this.getClearColor=function(S){return S.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor(...arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha(...arguments)},this.clear=function(S=!0,B=!0,X=!0){let W=0;if(S){let G=!1;if(k!==null){let de=k.texture.format;G=f.has(de)}if(G){let de=k.texture.type,ge=m.has(de),fe=Me.getClearColor(),Se=Me.getClearAlpha(),Te=fe.r,He=fe.g,Ye=fe.b;ge?(x[0]=Te,x[1]=He,x[2]=Ye,x[3]=Se,L.clearBufferuiv(L.COLOR,0,x)):(v[0]=Te,v[1]=He,v[2]=Ye,v[3]=Se,L.clearBufferiv(L.COLOR,0,v))}else W|=L.COLOR_BUFFER_BIT}B&&(W|=L.DEPTH_BUFFER_BIT),X&&(W|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&L.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",be,!1),t.removeEventListener("webglcontextrestored",Be,!1),t.removeEventListener("webglcontextcreationerror",bt,!1),Me.dispose(),Fe.dispose(),Q.dispose(),b.dispose(),Y.dispose(),_e.dispose(),ie.dispose(),xe.dispose(),re.dispose(),$.dispose(),$.removeEventListener("sessionstart",yd),$.removeEventListener("sessionend",xd),ks.stop()};function be(S){S.preventDefault(),tu("WebGLRenderer: Context Lost."),V=!0}function Be(){tu("WebGLRenderer: Context Restored."),V=!1;let S=R.autoReset,B=ve.enabled,X=ve.autoUpdate,W=ve.needsUpdate,G=ve.type;ee(),R.autoReset=S,ve.enabled=B,ve.autoUpdate=X,ve.needsUpdate=W,ve.type=G}function bt(S){Ne("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function lt(S){let B=S.target;B.removeEventListener("dispose",lt),Ci(B)}function Ci(S){Ii(S),b.remove(S)}function Ii(S){let B=b.get(S).programs;B!==void 0&&(B.forEach(function(X){re.releaseProgram(X)}),S.isShaderMaterial&&re.releaseShaderCache(S))}this.renderBufferDirect=function(S,B,X,W,G,de){B===null&&(B=gt);let ge=G.isMesh&&G.matrixWorld.determinant()<0,fe=Nm(S,B,X,W,G);we.setMaterial(W,ge);let Se=X.index,Te=1;if(W.wireframe===!0){if(Se=q.getWireframeAttribute(X),Se===void 0)return;Te=2}let He=X.drawRange,Ye=X.attributes.position,Ce=He.start*Te,ht=(He.start+He.count)*Te;de!==null&&(Ce=Math.max(Ce,de.start*Te),ht=Math.min(ht,(de.start+de.count)*Te)),Se!==null?(Ce=Math.max(Ce,0),ht=Math.min(ht,Se.count)):Ye!=null&&(Ce=Math.max(Ce,0),ht=Math.min(ht,Ye.count));let Nt=ht-Ce;if(Nt<0||Nt===1/0)return;ie.setup(G,W,fe,X,Se);let It,ut=qe;if(Se!==null&&(It=J.get(Se),ut=U,ut.setIndex(It)),G.isMesh)W.wireframe===!0?(we.setLineWidth(W.wireframeLinewidth*Dt()),ut.setMode(L.LINES)):ut.setMode(L.TRIANGLES);else if(G.isLine){let nn=W.linewidth;nn===void 0&&(nn=1),we.setLineWidth(nn*Dt()),G.isLineSegments?ut.setMode(L.LINES):G.isLineLoop?ut.setMode(L.LINE_LOOP):ut.setMode(L.LINE_STRIP)}else G.isPoints?ut.setMode(L.POINTS):G.isSprite&&ut.setMode(L.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Co("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))ut.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let nn=G._multiDrawStarts,Ee=G._multiDrawCounts,Tn=G._multiDrawCount,tt=Se?J.get(Se).bytesPerElement:1,qn=b.get(W).currentProgram.getUniforms();for(let ci=0;ci<Tn;ci++)qn.setValue(L,"_gl_DrawID",ci),ut.render(nn[ci]/tt,Ee[ci])}else if(G.isInstancedMesh)ut.renderInstances(Ce,Nt,G.count);else if(X.isInstancedBufferGeometry){let nn=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Ee=Math.min(X.instanceCount,nn);ut.renderInstances(Ce,Nt,Ee)}else ut.render(Ce,Nt)};function gd(S,B,X){S.transparent===!0&&S.side===ln&&S.forceSinglePass===!1?(S.side=xn,S.needsUpdate=!0,pa(S,B,X),S.side=ki,S.needsUpdate=!0,pa(S,B,X),S.side=ln):pa(S,B,X)}this.compile=function(S,B,X=null){X===null&&(X=S),T=Q.get(X),T.init(B),A.push(T),X.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),S!==X&&S.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights();let W=new Set;return S.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let de=G.material;if(de)if(Array.isArray(de))for(let ge=0;ge<de.length;ge++){let fe=de[ge];gd(fe,X,G),W.add(fe)}else gd(de,X,G),W.add(de)}),T=A.pop(),W},this.compileAsync=function(S,B,X=null){let W=this.compile(S,B,X);return new Promise(G=>{function de(){if(W.forEach(function(ge){b.get(ge).currentProgram.isReady()&&W.delete(ge)}),W.size===0){G(S);return}setTimeout(de,10)}st.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Zc=null;function Dm(S){Zc&&Zc(S)}function yd(){ks.stop()}function xd(){ks.start()}let ks=new Pp;ks.setAnimationLoop(Dm),typeof self<"u"&&ks.setContext(self),this.setAnimationLoop=function(S){Zc=S,$.setAnimationLoop(S),S===null?ks.stop():ks.start()},$.addEventListener("sessionstart",yd),$.addEventListener("sessionend",xd),this.render=function(S,B){if(B!==void 0&&B.isCamera!==!0){Ne("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;let X=$.enabled===!0&&$.isPresenting===!0,W=_!==null&&(k===null||X)&&_.begin(w,k);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&(_===null||_.isCompositing()===!1)&&($.cameraAutoUpdate===!0&&$.updateCamera(B),B=$.getCamera()),S.isScene===!0&&S.onBeforeRender(w,S,B,k),T=Q.get(S,A.length),T.init(B),A.push(T),Yt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),We.setFromProjectionMatrix(Yt,Kn,B.reversedDepth),ke=this.localClippingEnabled,De=ne.init(this.clippingPlanes,ke),M=Fe.get(S,E.length),M.init(),E.push(M),$.enabled===!0&&$.isPresenting===!0){let ge=w.xr.getDepthSensingMesh();ge!==null&&jc(ge,B,-1/0,w.sortObjects)}jc(S,B,0,w.sortObjects),M.finish(),w.sortObjects===!0&&M.sort(mt,Mt),$e=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,$e&&Me.addToRenderList(M,S),this.info.render.frame++,De===!0&&ne.beginShadows();let G=T.state.shadowsArray;if(ve.render(G,S,B),De===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&_.hasRenderPass())===!1){let ge=M.opaque,fe=M.transmissive;if(T.setupLights(),B.isArrayCamera){let Se=B.cameras;if(fe.length>0)for(let Te=0,He=Se.length;Te<He;Te++){let Ye=Se[Te];vd(ge,fe,S,Ye)}$e&&Me.render(S);for(let Te=0,He=Se.length;Te<He;Te++){let Ye=Se[Te];_d(M,S,Ye,Ye.viewport)}}else fe.length>0&&vd(ge,fe,S,B),$e&&Me.render(S),_d(M,S,B)}k!==null&&O===0&&(F.updateMultisampleRenderTarget(k),F.updateRenderTargetMipmap(k)),W&&_.end(w),S.isScene===!0&&S.onAfterRender(w,S,B),ie.resetDefaultState(),D=-1,N=null,A.pop(),A.length>0?(T=A[A.length-1],De===!0&&ne.setGlobalState(w.clippingPlanes,T.state.camera)):T=null,E.pop(),E.length>0?M=E[E.length-1]:M=null};function jc(S,B,X,W){if(S.visible===!1)return;if(S.layers.test(B.layers)){if(S.isGroup)X=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(B);else if(S.isLight)T.pushLight(S),S.castShadow&&T.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||We.intersectsSprite(S)){W&&at.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Yt);let ge=_e.update(S),fe=S.material;fe.visible&&M.push(S,ge,fe,X,at.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||We.intersectsObject(S))){let ge=_e.update(S),fe=S.material;if(W&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),at.copy(S.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),at.copy(ge.boundingSphere.center)),at.applyMatrix4(S.matrixWorld).applyMatrix4(Yt)),Array.isArray(fe)){let Se=ge.groups;for(let Te=0,He=Se.length;Te<He;Te++){let Ye=Se[Te],Ce=fe[Ye.materialIndex];Ce&&Ce.visible&&M.push(S,ge,Ce,X,at.z,Ye)}}else fe.visible&&M.push(S,ge,fe,X,at.z,null)}}let de=S.children;for(let ge=0,fe=de.length;ge<fe;ge++)jc(de[ge],B,X,W)}function _d(S,B,X,W){let{opaque:G,transmissive:de,transparent:ge}=S;T.setupLightsView(X),De===!0&&ne.setGlobalState(w.clippingPlanes,X),W&&we.viewport(H.copy(W)),G.length>0&&fa(G,B,X),de.length>0&&fa(de,B,X),ge.length>0&&fa(ge,B,X),we.buffers.depth.setTest(!0),we.buffers.depth.setMask(!0),we.buffers.color.setMask(!0),we.setPolygonOffset(!1)}function vd(S,B,X,W){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[W.id]===void 0){let Ce=st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[W.id]=new Cn(1,1,{generateMipmaps:!0,type:Ce?yi:Dn,minFilter:gi,samples:Math.max(4,vt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ke.workingColorSpace})}let de=T.state.transmissionRenderTarget[W.id],ge=W.viewport||H;de.setSize(ge.z*w.transmissionResolutionScale,ge.w*w.transmissionResolutionScale);let fe=w.getRenderTarget(),Se=w.getActiveCubeFace(),Te=w.getActiveMipmapLevel();w.setRenderTarget(de),w.getClearColor(j),le=w.getClearAlpha(),le<1&&w.setClearColor(16777215,.5),w.clear(),$e&&Me.render(X);let He=w.toneMapping;w.toneMapping=ei;let Ye=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),T.setupLightsView(W),De===!0&&ne.setGlobalState(w.clippingPlanes,W),fa(S,X,W),F.updateMultisampleRenderTarget(de),F.updateRenderTargetMipmap(de),st.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let ht=0,Nt=B.length;ht<Nt;ht++){let It=B[ht],{object:ut,geometry:nn,material:Ee,group:Tn}=It;if(Ee.side===ln&&ut.layers.test(W.layers)){let tt=Ee.side;Ee.side=xn,Ee.needsUpdate=!0,bd(ut,X,W,nn,Ee,Tn),Ee.side=tt,Ee.needsUpdate=!0,Ce=!0}}Ce===!0&&(F.updateMultisampleRenderTarget(de),F.updateRenderTargetMipmap(de))}w.setRenderTarget(fe,Se,Te),w.setClearColor(j,le),Ye!==void 0&&(W.viewport=Ye),w.toneMapping=He}function fa(S,B,X){let W=B.isScene===!0?B.overrideMaterial:null;for(let G=0,de=S.length;G<de;G++){let ge=S[G],{object:fe,geometry:Se,group:Te}=ge,He=ge.material;He.allowOverride===!0&&W!==null&&(He=W),fe.layers.test(X.layers)&&bd(fe,B,X,Se,He,Te)}}function bd(S,B,X,W,G,de){S.onBeforeRender(w,B,X,W,G,de),S.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),G.onBeforeRender(w,B,X,W,S,de),G.transparent===!0&&G.side===ln&&G.forceSinglePass===!1?(G.side=xn,G.needsUpdate=!0,w.renderBufferDirect(X,B,W,G,S,de),G.side=ki,G.needsUpdate=!0,w.renderBufferDirect(X,B,W,G,S,de),G.side=ln):w.renderBufferDirect(X,B,W,G,S,de),S.onAfterRender(w,B,X,W,G,de)}function pa(S,B,X){B.isScene!==!0&&(B=gt);let W=b.get(S),G=T.state.lights,de=T.state.shadowsArray,ge=G.state.version,fe=re.getParameters(S,G.state,de,B,X),Se=re.getProgramCacheKey(fe),Te=W.programs;W.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?B.environment:null,W.fog=B.fog;let He=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;W.envMap=Y.get(S.envMap||W.environment,He),W.envMapRotation=W.environment!==null&&S.envMap===null?B.environmentRotation:S.envMapRotation,Te===void 0&&(S.addEventListener("dispose",lt),Te=new Map,W.programs=Te);let Ye=Te.get(Se);if(Ye!==void 0){if(W.currentProgram===Ye&&W.lightsStateVersion===ge)return Sd(S,fe),Ye}else fe.uniforms=re.getUniforms(S),S.onBeforeCompile(fe,w),Ye=re.acquireProgram(fe,Se),Te.set(Se,Ye),W.uniforms=fe.uniforms;let Ce=W.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ce.clippingPlanes=ne.uniform),Sd(S,fe),W.needsLights=Um(S),W.lightsStateVersion=ge,W.needsLights&&(Ce.ambientLightColor.value=G.state.ambient,Ce.lightProbe.value=G.state.probe,Ce.directionalLights.value=G.state.directional,Ce.directionalLightShadows.value=G.state.directionalShadow,Ce.spotLights.value=G.state.spot,Ce.spotLightShadows.value=G.state.spotShadow,Ce.rectAreaLights.value=G.state.rectArea,Ce.ltc_1.value=G.state.rectAreaLTC1,Ce.ltc_2.value=G.state.rectAreaLTC2,Ce.pointLights.value=G.state.point,Ce.pointLightShadows.value=G.state.pointShadow,Ce.hemisphereLights.value=G.state.hemi,Ce.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ce.spotLightMatrix.value=G.state.spotLightMatrix,Ce.spotLightMap.value=G.state.spotLightMap,Ce.pointShadowMatrix.value=G.state.pointShadowMatrix),W.currentProgram=Ye,W.uniformsList=null,Ye}function Md(S){if(S.uniformsList===null){let B=S.currentProgram.getUniforms();S.uniformsList=to.seqWithValue(B.seq,S.uniforms)}return S.uniformsList}function Sd(S,B){let X=b.get(S);X.outputColorSpace=B.outputColorSpace,X.batching=B.batching,X.batchingColor=B.batchingColor,X.instancing=B.instancing,X.instancingColor=B.instancingColor,X.instancingMorph=B.instancingMorph,X.skinning=B.skinning,X.morphTargets=B.morphTargets,X.morphNormals=B.morphNormals,X.morphColors=B.morphColors,X.morphTargetsCount=B.morphTargetsCount,X.numClippingPlanes=B.numClippingPlanes,X.numIntersection=B.numClipIntersection,X.vertexAlphas=B.vertexAlphas,X.vertexTangents=B.vertexTangents,X.toneMapping=B.toneMapping}function Nm(S,B,X,W,G){B.isScene!==!0&&(B=gt),F.resetTextureUnits();let de=B.fog,ge=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?B.environment:null,fe=k===null?w.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:Ys,Se=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Te=Y.get(W.envMap||ge,Se),He=W.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ye=!!X.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ce=!!X.morphAttributes.position,ht=!!X.morphAttributes.normal,Nt=!!X.morphAttributes.color,It=ei;W.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(It=w.toneMapping);let ut=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,nn=ut!==void 0?ut.length:0,Ee=b.get(W),Tn=T.state.lights;if(De===!0&&(ke===!0||S!==N)){let Zt=S===N&&W.id===D;ne.setState(W,S,Zt)}let tt=!1;W.version===Ee.__version?(Ee.needsLights&&Ee.lightsStateVersion!==Tn.state.version||Ee.outputColorSpace!==fe||G.isBatchedMesh&&Ee.batching===!1||!G.isBatchedMesh&&Ee.batching===!0||G.isBatchedMesh&&Ee.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ee.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ee.instancing===!1||!G.isInstancedMesh&&Ee.instancing===!0||G.isSkinnedMesh&&Ee.skinning===!1||!G.isSkinnedMesh&&Ee.skinning===!0||G.isInstancedMesh&&Ee.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ee.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ee.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ee.instancingMorph===!1&&G.morphTexture!==null||Ee.envMap!==Te||W.fog===!0&&Ee.fog!==de||Ee.numClippingPlanes!==void 0&&(Ee.numClippingPlanes!==ne.numPlanes||Ee.numIntersection!==ne.numIntersection)||Ee.vertexAlphas!==He||Ee.vertexTangents!==Ye||Ee.morphTargets!==Ce||Ee.morphNormals!==ht||Ee.morphColors!==Nt||Ee.toneMapping!==It||Ee.morphTargetsCount!==nn)&&(tt=!0):(tt=!0,Ee.__version=W.version);let qn=Ee.currentProgram;tt===!0&&(qn=pa(W,B,G));let ci=!1,Bs=!1,gr=!1,yt=qn.getUniforms(),Kt=Ee.uniforms;if(we.useProgram(qn.program)&&(ci=!0,Bs=!0,gr=!0),W.id!==D&&(D=W.id,Bs=!0),ci||N!==S){we.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),yt.setValue(L,"projectionMatrix",S.projectionMatrix),yt.setValue(L,"viewMatrix",S.matrixWorldInverse);let Qi=yt.map.cameraPosition;Qi!==void 0&&Qi.setValue(L,Qe.setFromMatrixPosition(S.matrixWorld)),vt.logarithmicDepthBuffer&&yt.setValue(L,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&yt.setValue(L,"isOrthographic",S.isOrthographicCamera===!0),N!==S&&(N=S,Bs=!0,gr=!0)}if(Ee.needsLights&&(Tn.state.directionalShadowMap.length>0&&yt.setValue(L,"directionalShadowMap",Tn.state.directionalShadowMap,F),Tn.state.spotShadowMap.length>0&&yt.setValue(L,"spotShadowMap",Tn.state.spotShadowMap,F),Tn.state.pointShadowMap.length>0&&yt.setValue(L,"pointShadowMap",Tn.state.pointShadowMap,F)),G.isSkinnedMesh){yt.setOptional(L,G,"bindMatrix"),yt.setOptional(L,G,"bindMatrixInverse");let Zt=G.skeleton;Zt&&(Zt.boneTexture===null&&Zt.computeBoneTexture(),yt.setValue(L,"boneTexture",Zt.boneTexture,F))}G.isBatchedMesh&&(yt.setOptional(L,G,"batchingTexture"),yt.setValue(L,"batchingTexture",G._matricesTexture,F),yt.setOptional(L,G,"batchingIdTexture"),yt.setValue(L,"batchingIdTexture",G._indirectTexture,F),yt.setOptional(L,G,"batchingColorTexture"),G._colorsTexture!==null&&yt.setValue(L,"batchingColorTexture",G._colorsTexture,F));let Ki=X.morphAttributes;if((Ki.position!==void 0||Ki.normal!==void 0||Ki.color!==void 0)&&me.update(G,X,qn),(Bs||Ee.receiveShadow!==G.receiveShadow)&&(Ee.receiveShadow=G.receiveShadow,yt.setValue(L,"receiveShadow",G.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&B.environment!==null&&(Kt.envMapIntensity.value=B.environmentIntensity),Kt.dfgLUT!==void 0&&(Kt.dfgLUT.value=nb()),Bs&&(yt.setValue(L,"toneMappingExposure",w.toneMappingExposure),Ee.needsLights&&Om(Kt,gr),de&&W.fog===!0&&Ie.refreshFogUniforms(Kt,de),Ie.refreshMaterialUniforms(Kt,W,Ve,he,T.state.transmissionRenderTarget[S.id]),to.upload(L,Md(Ee),Kt,F)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(to.upload(L,Md(Ee),Kt,F),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&yt.setValue(L,"center",G.center),yt.setValue(L,"modelViewMatrix",G.modelViewMatrix),yt.setValue(L,"normalMatrix",G.normalMatrix),yt.setValue(L,"modelMatrix",G.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let Zt=W.uniformsGroups;for(let Qi=0,yr=Zt.length;Qi<yr;Qi++){let wd=Zt[Qi];xe.update(wd,qn),xe.bind(wd,qn)}}return qn}function Om(S,B){S.ambientLightColor.needsUpdate=B,S.lightProbe.needsUpdate=B,S.directionalLights.needsUpdate=B,S.directionalLightShadows.needsUpdate=B,S.pointLights.needsUpdate=B,S.pointLightShadows.needsUpdate=B,S.spotLights.needsUpdate=B,S.spotLightShadows.needsUpdate=B,S.rectAreaLights.needsUpdate=B,S.hemisphereLights.needsUpdate=B}function Um(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return k},this.setRenderTargetTextures=function(S,B,X){let W=b.get(S);W.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),b.get(S.texture).__webglTexture=B,b.get(S.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:X,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,B){let X=b.get(S);X.__webglFramebuffer=B,X.__useDefaultFramebuffer=B===void 0};let Fm=L.createFramebuffer();this.setRenderTarget=function(S,B=0,X=0){k=S,C=B,O=X;let W=null,G=!1,de=!1;if(S){let fe=b.get(S);if(fe.__useDefaultFramebuffer!==void 0){we.bindFramebuffer(L.FRAMEBUFFER,fe.__webglFramebuffer),H.copy(S.viewport),z.copy(S.scissor),K=S.scissorTest,we.viewport(H),we.scissor(z),we.setScissorTest(K),D=-1;return}else if(fe.__webglFramebuffer===void 0)F.setupRenderTarget(S);else if(fe.__hasExternalTextures)F.rebindTextures(S,b.get(S.texture).__webglTexture,b.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let He=S.depthTexture;if(fe.__boundDepthTexture!==He){if(He!==null&&b.has(He)&&(S.width!==He.image.width||S.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");F.setupDepthRenderbuffer(S)}}let Se=S.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(de=!0);let Te=b.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Te[B])?W=Te[B][X]:W=Te[B],G=!0):S.samples>0&&F.useMultisampledRTT(S)===!1?W=b.get(S).__webglMultisampledFramebuffer:Array.isArray(Te)?W=Te[X]:W=Te,H.copy(S.viewport),z.copy(S.scissor),K=S.scissorTest}else H.copy(Z).multiplyScalar(Ve).floor(),z.copy(se).multiplyScalar(Ve).floor(),K=ae;if(X!==0&&(W=Fm),we.bindFramebuffer(L.FRAMEBUFFER,W)&&we.drawBuffers(S,W),we.viewport(H),we.scissor(z),we.setScissorTest(K),G){let fe=b.get(S.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+B,fe.__webglTexture,X)}else if(de){let fe=B;for(let Se=0;Se<S.textures.length;Se++){let Te=b.get(S.textures[Se]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Se,Te.__webglTexture,X,fe)}}else if(S!==null&&X!==0){let fe=b.get(S.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,fe.__webglTexture,X)}D=-1},this.readRenderTargetPixels=function(S,B,X,W,G,de,ge,fe=0){if(!(S&&S.isWebGLRenderTarget)){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=b.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se){we.bindFramebuffer(L.FRAMEBUFFER,Se);try{let Te=S.textures[fe],He=Te.format,Ye=Te.type;if(S.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+fe),!vt.textureFormatReadable(He)){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!vt.textureTypeReadable(Ye)){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=S.width-W&&X>=0&&X<=S.height-G&&L.readPixels(B,X,W,G,oe.convert(He),oe.convert(Ye),de)}finally{let Te=k!==null?b.get(k).__webglFramebuffer:null;we.bindFramebuffer(L.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(S,B,X,W,G,de,ge,fe=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=b.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se)if(B>=0&&B<=S.width-W&&X>=0&&X<=S.height-G){we.bindFramebuffer(L.FRAMEBUFFER,Se);let Te=S.textures[fe],He=Te.format,Ye=Te.type;if(S.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+fe),!vt.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!vt.textureTypeReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ce=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ce),L.bufferData(L.PIXEL_PACK_BUFFER,de.byteLength,L.STREAM_READ),L.readPixels(B,X,W,G,oe.convert(He),oe.convert(Ye),0);let ht=k!==null?b.get(k).__webglFramebuffer:null;we.bindFramebuffer(L.FRAMEBUFFER,ht);let Nt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await sp(L,Nt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ce),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,de),L.deleteBuffer(Ce),L.deleteSync(Nt),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,B=null,X=0){let W=Math.pow(2,-X),G=Math.floor(S.image.width*W),de=Math.floor(S.image.height*W),ge=B!==null?B.x:0,fe=B!==null?B.y:0;F.setTexture2D(S,0),L.copyTexSubImage2D(L.TEXTURE_2D,X,0,0,ge,fe,G,de),we.unbindTexture()};let km=L.createFramebuffer(),Bm=L.createFramebuffer();this.copyTextureToTexture=function(S,B,X=null,W=null,G=0,de=0){let ge,fe,Se,Te,He,Ye,Ce,ht,Nt,It=S.isCompressedTexture?S.mipmaps[de]:S.image;if(X!==null)ge=X.max.x-X.min.x,fe=X.max.y-X.min.y,Se=X.isBox3?X.max.z-X.min.z:1,Te=X.min.x,He=X.min.y,Ye=X.isBox3?X.min.z:0;else{let Kt=Math.pow(2,-G);ge=Math.floor(It.width*Kt),fe=Math.floor(It.height*Kt),S.isDataArrayTexture?Se=It.depth:S.isData3DTexture?Se=Math.floor(It.depth*Kt):Se=1,Te=0,He=0,Ye=0}W!==null?(Ce=W.x,ht=W.y,Nt=W.z):(Ce=0,ht=0,Nt=0);let ut=oe.convert(B.format),nn=oe.convert(B.type),Ee;B.isData3DTexture?(F.setTexture3D(B,0),Ee=L.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(F.setTexture2DArray(B,0),Ee=L.TEXTURE_2D_ARRAY):(F.setTexture2D(B,0),Ee=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,B.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,B.unpackAlignment);let Tn=L.getParameter(L.UNPACK_ROW_LENGTH),tt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),qn=L.getParameter(L.UNPACK_SKIP_PIXELS),ci=L.getParameter(L.UNPACK_SKIP_ROWS),Bs=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,It.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,It.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Te),L.pixelStorei(L.UNPACK_SKIP_ROWS,He),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ye);let gr=S.isDataArrayTexture||S.isData3DTexture,yt=B.isDataArrayTexture||B.isData3DTexture;if(S.isDepthTexture){let Kt=b.get(S),Ki=b.get(B),Zt=b.get(Kt.__renderTarget),Qi=b.get(Ki.__renderTarget);we.bindFramebuffer(L.READ_FRAMEBUFFER,Zt.__webglFramebuffer),we.bindFramebuffer(L.DRAW_FRAMEBUFFER,Qi.__webglFramebuffer);for(let yr=0;yr<Se;yr++)gr&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,b.get(S).__webglTexture,G,Ye+yr),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,b.get(B).__webglTexture,de,Nt+yr)),L.blitFramebuffer(Te,He,ge,fe,Ce,ht,ge,fe,L.DEPTH_BUFFER_BIT,L.NEAREST);we.bindFramebuffer(L.READ_FRAMEBUFFER,null),we.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(G!==0||S.isRenderTargetTexture||b.has(S)){let Kt=b.get(S),Ki=b.get(B);we.bindFramebuffer(L.READ_FRAMEBUFFER,km),we.bindFramebuffer(L.DRAW_FRAMEBUFFER,Bm);for(let Zt=0;Zt<Se;Zt++)gr?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Kt.__webglTexture,G,Ye+Zt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Kt.__webglTexture,G),yt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ki.__webglTexture,de,Nt+Zt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ki.__webglTexture,de),G!==0?L.blitFramebuffer(Te,He,ge,fe,Ce,ht,ge,fe,L.COLOR_BUFFER_BIT,L.NEAREST):yt?L.copyTexSubImage3D(Ee,de,Ce,ht,Nt+Zt,Te,He,ge,fe):L.copyTexSubImage2D(Ee,de,Ce,ht,Te,He,ge,fe);we.bindFramebuffer(L.READ_FRAMEBUFFER,null),we.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else yt?S.isDataTexture||S.isData3DTexture?L.texSubImage3D(Ee,de,Ce,ht,Nt,ge,fe,Se,ut,nn,It.data):B.isCompressedArrayTexture?L.compressedTexSubImage3D(Ee,de,Ce,ht,Nt,ge,fe,Se,ut,It.data):L.texSubImage3D(Ee,de,Ce,ht,Nt,ge,fe,Se,ut,nn,It):S.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,de,Ce,ht,ge,fe,ut,nn,It.data):S.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,de,Ce,ht,It.width,It.height,ut,It.data):L.texSubImage2D(L.TEXTURE_2D,de,Ce,ht,ge,fe,ut,nn,It);L.pixelStorei(L.UNPACK_ROW_LENGTH,Tn),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,tt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,qn),L.pixelStorei(L.UNPACK_SKIP_ROWS,ci),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Bs),de===0&&B.generateMipmaps&&L.generateMipmap(Ee),we.unbindTexture()},this.initRenderTarget=function(S){b.get(S).__webglFramebuffer===void 0&&F.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?F.setTextureCube(S,0):S.isData3DTexture?F.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?F.setTexture2DArray(S,0):F.setTexture2D(S,0),we.unbindTexture()},this.resetState=function(){C=0,O=0,k=null,we.reset(),ie.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}};var Up={type:"change"},wu={type:"start"},kp={type:"end"},vc=new fs,Fp=new gn,sb=Math.cos(70*Hi.DEG2RAD),$t=new I,Mn=2*Math.PI,ft={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Su=1e-6,bc=class extends Ks{constructor(e,t=null){super(e,t),this.state=ft.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:bs.ROTATE,MIDDLE:bs.DOLLY,RIGHT:bs.PAN},this.touches={ONE:Ms.ROTATE,TWO:Ms.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new dt,this._lastTargetPosition=new I,this._quat=new dt().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Yr,this._sphericalDelta=new Yr,this._scale=1,this._panOffset=new I,this._rotateStart=new Oe,this._rotateEnd=new Oe,this._rotateDelta=new Oe,this._panStart=new Oe,this._panEnd=new Oe,this._panDelta=new Oe,this._dollyStart=new Oe,this._dollyEnd=new Oe,this._dollyDelta=new Oe,this._dollyDirection=new I,this._mouse=new Oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=ob.bind(this),this._onPointerDown=rb.bind(this),this._onPointerUp=ab.bind(this),this._onContextMenu=pb.bind(this),this._onMouseWheel=hb.bind(this),this._onKeyDown=ub.bind(this),this._onTouchStart=db.bind(this),this._onTouchMove=fb.bind(this),this._onMouseDown=lb.bind(this),this._onMouseMove=cb.bind(this),this._interceptControlDown=mb.bind(this),this._interceptControlUp=gb.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Up),this.update(),this.state=ft.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;$t.copy(t).sub(this.target),$t.applyQuaternion(this._quat),this._spherical.setFromVector3($t),this.autoRotate&&this.state===ft.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Mn:i>Math.PI&&(i-=Mn),s<-Math.PI?s+=Mn:s>Math.PI&&(s-=Mn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if($t.setFromSpherical(this._spherical),$t.applyQuaternion(this._quatInverse),t.copy(this.target).add($t),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=$t.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new I(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=$t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(vc.origin.copy(this.object.position),vc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(vc.direction))<sb?this.object.lookAt(this.target):(Fp.setFromNormalAndCoplanarPoint(this.object.up,this.target),vc.intersectPlane(Fp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Su||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Su||this._lastTargetPosition.distanceToSquared(this.target)>Su?(this.dispatchEvent(Up),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Mn/60*this.autoRotateSpeed*e:Mn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){$t.setFromMatrixColumn(t,0),$t.multiplyScalar(-e),this._panOffset.add($t)}_panUp(e,t){this.screenSpacePanning===!0?$t.setFromMatrixColumn(t,1):($t.setFromMatrixColumn(t,0),$t.crossVectors(this.object.up,$t)),$t.multiplyScalar(e),this._panOffset.add($t)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;$t.copy(s).sub(this.target);let r=$t.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Mn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Mn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Mn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Mn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Oe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function rb(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function ob(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function ab(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(kp),this.state=ft.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function lb(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case bs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ft.DOLLY;break;case bs.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ft.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ft.ROTATE}break;case bs.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ft.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ft.PAN}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(wu)}function cb(n){switch(this.state){case ft.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ft.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ft.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function hb(n){this.enabled===!1||this.enableZoom===!1||this.state!==ft.NONE||(n.preventDefault(),this.dispatchEvent(wu),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(kp))}function ub(n){this.enabled!==!1&&this._handleKeyDown(n)}function db(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ms.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ft.TOUCH_ROTATE;break;case Ms.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ft.TOUCH_PAN;break;default:this.state=ft.NONE}break;case 2:switch(this.touches.TWO){case Ms.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ft.TOUCH_DOLLY_PAN;break;case Ms.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ft.TOUCH_DOLLY_ROTATE;break;default:this.state=ft.NONE}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(wu)}function fb(n){switch(this._trackPointer(n),this.state){case ft.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ft.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ft.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ft.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ft.NONE}}function pb(n){this.enabled!==!1&&n.preventDefault()}function mb(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function gb(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var or=new vs,hn=new I,Ts=new I,Et=new dt,Bp={X:new I(1,0,0),Y:new I(0,1,0),Z:new I(0,0,1)},Eu={type:"change"},zp={type:"mouseDown",mode:null},Vp={type:"mouseUp",mode:null},Hp={type:"objectChange"},Tc=class extends Ks{constructor(e,t=null){super(void 0,t);let i=new Au(this);this._root=i;let s=new Ru;this._gizmo=s,i.add(s);let r=new Cu;this._plane=r,i.add(r);let o=this;function a(v,M){let T=M;Object.defineProperty(o,v,{get:function(){return T!==void 0?T:M},set:function(E){T!==E&&(T=E,r[v]=E,s[v]=E,o.dispatchEvent({type:v+"-changed",value:E}),o.dispatchEvent(Eu))}}),o[v]=M,r[v]=M,s[v]=M}a("camera",e),a("object",void 0),a("enabled",!0),a("axis",null),a("mode","translate"),a("translationSnap",null),a("rotationSnap",null),a("scaleSnap",null),a("space","world"),a("size",1),a("dragging",!1),a("showX",!0),a("showY",!0),a("showZ",!0),a("minX",-1/0),a("maxX",1/0),a("minY",-1/0),a("maxY",1/0),a("minZ",-1/0),a("maxZ",1/0);let l=new I,c=new I,h=new dt,d=new dt,u=new I,p=new dt,g=new I,y=new I,f=new I,m=0,x=new I;a("worldPosition",l),a("worldPositionStart",c),a("worldQuaternion",h),a("worldQuaternionStart",d),a("cameraPosition",u),a("cameraQuaternion",p),a("pointStart",g),a("pointEnd",y),a("rotationAxis",f),a("rotationAngle",m),a("eye",x),this._offset=new I,this._startNorm=new I,this._endNorm=new I,this._cameraScale=new I,this._parentPosition=new I,this._parentQuaternion=new dt,this._parentQuaternionInv=new dt,this._parentScale=new I,this._worldScaleStart=new I,this._worldQuaternionInv=new dt,this._worldScale=new I,this._positionStart=new I,this._quaternionStart=new dt,this._scaleStart=new I,this._getPointer=yb.bind(this),this._onPointerDown=_b.bind(this),this._onPointerHover=xb.bind(this),this._onPointerMove=vb.bind(this),this._onPointerUp=bb.bind(this),t!==null&&this.connect(t)}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="auto"}getHelper(){return this._root}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;e!==null&&or.setFromCamera(e,this.camera);let t=Tu(this._gizmo.picker[this.mode],or);t?this.axis=t.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e!=null&&e.button!==0)&&this.axis!==null){e!==null&&or.setFromCamera(e,this.camera);let t=Tu(this._plane,or,!0);t&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(t.point).sub(this.worldPositionStart)),this.dragging=!0,zp.mode=this.mode,this.dispatchEvent(zp)}}pointerMove(e){let t=this.axis,i=this.mode,s=this.object,r=this.space;if(i==="scale"?r="local":(t==="E"||t==="XYZE"||t==="XYZ")&&(r="world"),s===void 0||t===null||this.dragging===!1||e!==null&&e.button!==-1)return;e!==null&&or.setFromCamera(e,this.camera);let o=Tu(this._plane,or,!0);if(o){if(this.pointEnd.copy(o.point).sub(this.worldPositionStart),i==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&t!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),t.indexOf("X")===-1&&(this._offset.x=0),t.indexOf("Y")===-1&&(this._offset.y=0),t.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&t!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(s.position.applyQuaternion(Et.copy(this._quaternionStart).invert()),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),r==="world"&&(s.parent&&s.position.add(hn.setFromMatrixPosition(s.parent.matrixWorld)),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(hn.setFromMatrixPosition(s.parent.matrixWorld)))),s.position.x=Math.max(this.minX,Math.min(this.maxX,s.position.x)),s.position.y=Math.max(this.minY,Math.min(this.maxY,s.position.y)),s.position.z=Math.max(this.minZ,Math.min(this.maxZ,s.position.z));else if(i==="scale"){if(t.search("XYZ")!==-1){let a=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(a*=-1),Ts.set(a,a,a)}else hn.copy(this.pointStart),Ts.copy(this.pointEnd),hn.applyQuaternion(this._worldQuaternionInv),Ts.applyQuaternion(this._worldQuaternionInv),Ts.divide(hn),t.search("X")===-1&&(Ts.x=1),t.search("Y")===-1&&(Ts.y=1),t.search("Z")===-1&&(Ts.z=1);s.scale.copy(this._scaleStart).multiply(Ts),this.scaleSnap&&(t.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(i==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);let a=20/this.worldPosition.distanceTo(hn.setFromMatrixPosition(this.camera.matrixWorld)),l=!1;t==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(hn.copy(this.rotationAxis).cross(this.eye))*a):(t==="X"||t==="Y"||t==="Z")&&(this.rotationAxis.copy(Bp[t]),hn.copy(Bp[t]),r==="local"&&hn.applyQuaternion(this.worldQuaternion),hn.cross(this.eye),hn.length()===0?l=!0:this.rotationAngle=this._offset.dot(hn.normalize())*a),(t==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&t!=="E"&&t!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(Et.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(Et.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(Eu),this.dispatchEvent(Hp)}}pointerUp(e){e!==null&&e.button!==0||(this.dragging&&this.axis!==null&&(Vp.mode=this.mode,this.dispatchEvent(Vp)),this.dragging=!1,this.axis=null)}dispose(){this.disconnect(),this._root.dispose()}attach(e){return this.object=e,this._root.visible=!0,this}detach(){return this.object=void 0,this.axis=null,this._root.visible=!1,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(Eu),this.dispatchEvent(Hp),this.pointStart.copy(this.pointEnd))}getRaycaster(){return or}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}setColors(e,t,i,s){let r=this._gizmo.materialLib;r.xAxis.color.set(e),r.yAxis.color.set(t),r.zAxis.color.set(i),r.active.color.set(s),r.xAxisTransparent.color.set(e),r.yAxisTransparent.color.set(t),r.zAxisTransparent.color.set(i),r.activeTransparent.color.set(s),r.xAxis._color&&r.xAxis._color.set(e),r.yAxis._color&&r.yAxis._color.set(t),r.zAxis._color&&r.zAxis._color.set(i),r.active._color&&r.active._color.set(s),r.xAxisTransparent._color&&r.xAxisTransparent._color.set(e),r.yAxisTransparent._color&&r.yAxisTransparent._color.set(t),r.zAxisTransparent._color&&r.zAxisTransparent._color.set(i),r.activeTransparent._color&&r.activeTransparent._color.set(s)}};function yb(n){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:n.button};{let e=this.domElement.getBoundingClientRect();return{x:(n.clientX-e.left)/e.width*2-1,y:-(n.clientY-e.top)/e.height*2+1,button:n.button}}}function xb(n){if(this.enabled)switch(n.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(n));break}}function _b(n){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(n)),this.pointerDown(this._getPointer(n)))}function vb(n){this.enabled&&this.pointerMove(this._getPointer(n))}function bb(n){this.enabled&&(this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(n)))}function Tu(n,e,t){let i=e.intersectObject(n,!0);for(let s=0;s<i.length;s++)if(i[s].object.visible||t)return i[s];return!1}var Mc=new yn,xt=new I(0,1,0),Gp=new I(0,0,0),Wp=new nt,Sc=new dt,Ec=new dt,vi=new I,Xp=new nt,na=new I(1,0,0),ar=new I(0,1,0),ia=new I(0,0,1),wc=new I,ea=new I,ta=new I,Au=class extends Gt{constructor(e){super(),this.isTransformControlsRoot=!0,this.controls=e,this.visible=!1}updateMatrixWorld(e){let t=this.controls;t.object!==void 0&&(t.object.updateMatrixWorld(),t.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):t.object.parent.matrixWorld.decompose(t._parentPosition,t._parentQuaternion,t._parentScale),t.object.matrixWorld.decompose(t.worldPosition,t.worldQuaternion,t._worldScale),t._parentQuaternionInv.copy(t._parentQuaternion).invert(),t._worldQuaternionInv.copy(t.worldQuaternion).invert()),t.camera.updateMatrixWorld(),t.camera.matrixWorld.decompose(t.cameraPosition,t.cameraQuaternion,t._cameraScale),t.camera.isOrthographicCamera?t.camera.getWorldDirection(t.eye).negate():t.eye.copy(t.cameraPosition).sub(t.worldPosition).normalize(),super.updateMatrixWorld(e)}dispose(){this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}},Ru=class extends Gt{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";let e=new pi({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),t=new ps({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),i=e.clone();i.opacity=.15;let s=t.clone();s.opacity=.5;let r=e.clone();r.color.setHex(16711680);let o=e.clone();o.color.setHex(65280);let a=e.clone();a.color.setHex(255);let l=e.clone();l.color.setHex(16711680),l.opacity=.5;let c=e.clone();c.color.setHex(65280),c.opacity=.5;let h=e.clone();h.color.setHex(255),h.opacity=.5;let d=e.clone();d.opacity=.25;let u=e.clone();u.color.setHex(16776960),u.opacity=.25;let p=e.clone();p.color.setHex(16776960);let g=e.clone();g.color.setHex(7895160),this.materialLib={xAxis:r,yAxis:o,zAxis:a,active:p,xAxisTransparent:l,yAxisTransparent:c,zAxisTransparent:h,activeTransparent:u};let y=new Vt(0,.04,.1,12);y.translate(0,.05,0);let f=new wt(.08,.08,.08);f.translate(0,.04,0);let m=new zt;m.setAttribute("position",new it([0,0,0,1,0,0],3));let x=new Vt(.0075,.0075,.5,3);x.translate(0,.25,0);function v(N,H){let z=new Vi(N,.0075,3,64,H*Math.PI*2);return z.rotateY(Math.PI/2),z.rotateX(Math.PI/2),z}function M(){let N=new zt;return N.setAttribute("position",new it([0,0,0,1,1,1],3)),N}let T={X:[[new ue(y,r),[.5,0,0],[0,0,-Math.PI/2]],[new ue(y,r),[-.5,0,0],[0,0,Math.PI/2]],[new ue(x,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new ue(y,o),[0,.5,0]],[new ue(y,o),[0,-.5,0],[Math.PI,0,0]],[new ue(x,o)]],Z:[[new ue(y,a),[0,0,.5],[Math.PI/2,0,0]],[new ue(y,a),[0,0,-.5],[-Math.PI/2,0,0]],[new ue(x,a),null,[Math.PI/2,0,0]]],XYZ:[[new ue(new gs(.1,0),d),[0,0,0]]],XY:[[new ue(new wt(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new ue(new wt(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ue(new wt(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]]},E={X:[[new ue(new Vt(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new ue(new Vt(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new ue(new Vt(.2,0,.6,4),i),[0,.3,0]],[new ue(new Vt(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new ue(new Vt(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new ue(new Vt(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new ue(new gs(.2,0),i)]],XY:[[new ue(new wt(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new ue(new wt(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ue(new wt(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]]},A={START:[[new ue(new gs(.01,2),s),null,null,null,"helper"]],END:[[new ue(new gs(.01,2),s),null,null,null,"helper"]],DELTA:[[new In(M(),s),null,null,null,"helper"]],X:[[new In(m,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new In(m,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new In(m,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},_={XYZE:[[new ue(v(.5,1),g),null,[0,Math.PI/2,0]]],X:[[new ue(v(.5,.5),r)]],Y:[[new ue(v(.5,.5),o),null,[0,0,-Math.PI/2]]],Z:[[new ue(v(.5,.5),a),null,[0,Math.PI/2,0]]],E:[[new ue(v(.75,1),u),null,[0,Math.PI/2,0]]]},w={AXIS:[[new In(m,s),[-1e3,0,0],null,[1e6,1,1],"helper"]]},V={XYZE:[[new ue(new Js(.25,10,8),i)]],X:[[new ue(new Vi(.5,.1,4,24),i),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new ue(new Vi(.5,.1,4,24),i),[0,0,0],[Math.PI/2,0,0]]],Z:[[new ue(new Vi(.5,.1,4,24),i),[0,0,0],[0,0,-Math.PI/2]]],E:[[new ue(new Vi(.75,.1,2,24),i)]]},C={X:[[new ue(f,r),[.5,0,0],[0,0,-Math.PI/2]],[new ue(x,r),[0,0,0],[0,0,-Math.PI/2]],[new ue(f,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new ue(f,o),[0,.5,0]],[new ue(x,o)],[new ue(f,o),[0,-.5,0],[0,0,Math.PI]]],Z:[[new ue(f,a),[0,0,.5],[Math.PI/2,0,0]],[new ue(x,a),[0,0,0],[Math.PI/2,0,0]],[new ue(f,a),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new ue(new wt(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new ue(new wt(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ue(new wt(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new ue(new wt(.1,.1,.1),d)]]},O={X:[[new ue(new Vt(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new ue(new Vt(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new ue(new Vt(.2,0,.6,4),i),[0,.3,0]],[new ue(new Vt(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new ue(new Vt(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new ue(new Vt(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new ue(new wt(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new ue(new wt(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ue(new wt(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new ue(new wt(.2,.2,.2),i),[0,0,0]]]},k={X:[[new In(m,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new In(m,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new In(m,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function D(N){let H=new Gt;for(let z in N)for(let K=N[z].length;K--;){let j=N[z][K][0].clone(),le=N[z][K][1],pe=N[z][K][2],he=N[z][K][3],Ve=N[z][K][4];j.name=z,j.tag=Ve,le&&j.position.set(le[0],le[1],le[2]),pe&&j.rotation.set(pe[0],pe[1],pe[2]),he&&j.scale.set(he[0],he[1],he[2]),j.updateMatrix();let mt=j.geometry.clone();mt.applyMatrix4(j.matrix),j.geometry=mt,j.renderOrder=1/0,j.position.set(0,0,0),j.rotation.set(0,0,0),j.scale.set(1,1,1),H.add(j)}return H}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=D(T)),this.add(this.gizmo.rotate=D(_)),this.add(this.gizmo.scale=D(C)),this.add(this.picker.translate=D(E)),this.add(this.picker.rotate=D(V)),this.add(this.picker.scale=D(O)),this.add(this.helper.translate=D(A)),this.add(this.helper.rotate=D(w)),this.add(this.helper.scale=D(k)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){let i=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Ec;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let r=0;r<s.length;r++){let o=s[r];o.visible=!0,o.rotation.set(0,0,0),o.position.copy(this.worldPosition);let a;if(this.camera.isOrthographicCamera?a=(this.camera.top-this.camera.bottom)/this.camera.zoom:a=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),o.scale.set(1,1,1).multiplyScalar(a*this.size/4),o.tag==="helper"){o.visible=!1,o.name==="AXIS"?(o.visible=!!this.axis,this.axis==="X"&&(Et.setFromEuler(Mc.set(0,0,0)),o.quaternion.copy(i).multiply(Et),Math.abs(xt.copy(na).applyQuaternion(i).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Y"&&(Et.setFromEuler(Mc.set(0,0,Math.PI/2)),o.quaternion.copy(i).multiply(Et),Math.abs(xt.copy(ar).applyQuaternion(i).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Z"&&(Et.setFromEuler(Mc.set(0,Math.PI/2,0)),o.quaternion.copy(i).multiply(Et),Math.abs(xt.copy(ia).applyQuaternion(i).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="XYZE"&&(Et.setFromEuler(Mc.set(0,Math.PI/2,0)),xt.copy(this.rotationAxis),o.quaternion.setFromRotationMatrix(Wp.lookAt(Gp,xt,ar)),o.quaternion.multiply(Et),o.visible=this.dragging),this.axis==="E"&&(o.visible=!1)):o.name==="START"?(o.position.copy(this.worldPositionStart),o.visible=this.dragging):o.name==="END"?(o.position.copy(this.worldPosition),o.visible=this.dragging):o.name==="DELTA"?(o.position.copy(this.worldPositionStart),o.quaternion.copy(this.worldQuaternionStart),hn.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),hn.applyQuaternion(this.worldQuaternionStart.clone().invert()),o.scale.copy(hn),o.visible=this.dragging):(o.quaternion.copy(i),this.dragging?o.position.copy(this.worldPositionStart):o.position.copy(this.worldPosition),this.axis&&(o.visible=this.axis.search(o.name)!==-1));continue}o.quaternion.copy(i),this.mode==="translate"||this.mode==="scale"?(o.name==="X"&&Math.abs(xt.copy(na).applyQuaternion(i).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Y"&&Math.abs(xt.copy(ar).applyQuaternion(i).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Z"&&Math.abs(xt.copy(ia).applyQuaternion(i).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XY"&&Math.abs(xt.copy(ia).applyQuaternion(i).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="YZ"&&Math.abs(xt.copy(na).applyQuaternion(i).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XZ"&&Math.abs(xt.copy(ar).applyQuaternion(i).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1)):this.mode==="rotate"&&(Sc.copy(i),xt.copy(this.eye).applyQuaternion(Et.copy(i).invert()),o.name.search("E")!==-1&&o.quaternion.setFromRotationMatrix(Wp.lookAt(this.eye,Gp,ar)),o.name==="X"&&(Et.setFromAxisAngle(na,Math.atan2(-xt.y,xt.z)),Et.multiplyQuaternions(Sc,Et),o.quaternion.copy(Et)),o.name==="Y"&&(Et.setFromAxisAngle(ar,Math.atan2(xt.x,xt.z)),Et.multiplyQuaternions(Sc,Et),o.quaternion.copy(Et)),o.name==="Z"&&(Et.setFromAxisAngle(ia,Math.atan2(xt.y,xt.x)),Et.multiplyQuaternions(Sc,Et),o.quaternion.copy(Et))),o.visible=o.visible&&(o.name.indexOf("X")===-1||this.showX),o.visible=o.visible&&(o.name.indexOf("Y")===-1||this.showY),o.visible=o.visible&&(o.name.indexOf("Z")===-1||this.showZ),o.visible=o.visible&&(o.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),o.material._color=o.material._color||o.material.color.clone(),o.material._opacity=o.material._opacity||o.material.opacity,o.material.color.copy(o.material._color),o.material.opacity=o.material._opacity,this.enabled&&this.axis&&(o.name===this.axis?(o.material.color.copy(this.materialLib.active.color),o.material.opacity=1):this.axis.split("").some(function(l){return o.name===l})&&(o.material.color.copy(this.materialLib.active.color),o.material.opacity=1))}super.updateMatrixWorld(e)}},Cu=class extends ue{constructor(){super(new zi(1e5,1e5,2,2),new pi({visible:!1,wireframe:!0,side:ln,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let t=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(t="local"),wc.copy(na).applyQuaternion(t==="local"?this.worldQuaternion:Ec),ea.copy(ar).applyQuaternion(t==="local"?this.worldQuaternion:Ec),ta.copy(ia).applyQuaternion(t==="local"?this.worldQuaternion:Ec),xt.copy(ea),this.mode){case"translate":case"scale":switch(this.axis){case"X":xt.copy(this.eye).cross(wc),vi.copy(wc).cross(xt);break;case"Y":xt.copy(this.eye).cross(ea),vi.copy(ea).cross(xt);break;case"Z":xt.copy(this.eye).cross(ta),vi.copy(ta).cross(xt);break;case"XY":vi.copy(ta);break;case"YZ":vi.copy(wc);break;case"XZ":xt.copy(ta),vi.copy(ea);break;case"XYZ":case"E":vi.set(0,0,0);break}break;case"rotate":default:vi.set(0,0,0)}vi.length()===0?this.quaternion.copy(this.cameraQuaternion):(Xp.lookAt(hn.set(0,0,0),vi,xt),this.quaternion.setFromRotationMatrix(Xp)),super.updateMatrixWorld(e)}};var $p={POSITION:["byte","byte normalized","unsigned byte","unsigned byte normalized","short","short normalized","unsigned short","unsigned short normalized"],NORMAL:["byte normalized","short normalized"],TANGENT:["byte normalized","short normalized"],TEXCOORD:["byte","byte normalized","unsigned byte","short","short normalized","unsigned short"]},As=class{constructor(){this.textureUtils=null,this.pluginCallbacks=[],this.register(function(e){return new Du(e)}),this.register(function(e){return new Nu(e)}),this.register(function(e){return new ku(e)}),this.register(function(e){return new Bu(e)}),this.register(function(e){return new zu(e)}),this.register(function(e){return new Vu(e)}),this.register(function(e){return new Ou(e)}),this.register(function(e){return new Uu(e)}),this.register(function(e){return new Fu(e)}),this.register(function(e){return new Hu(e)}),this.register(function(e){return new Gu(e)}),this.register(function(e){return new Wu(e)}),this.register(function(e){return new Xu(e)}),this.register(function(e){return new $u(e)})}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}setTextureUtils(e){return this.textureUtils=e,this}parse(e,t,i,s){let r=new Lu,o=[];for(let a=0,l=this.pluginCallbacks.length;a<l;a++)o.push(this.pluginCallbacks[a](r));r.setPlugins(o),r.setTextureUtils(this.textureUtils),r.writeAsync(e,t,s).catch(i)}parseAsync(e,t){let i=this;return new Promise(function(s,r){i.parse(e,s,r,t)})}},je={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,INT:5124,UNSIGNED_INT:5125,FLOAT:5126,ARRAY_BUFFER:34962,ELEMENT_ARRAY_BUFFER:34963,NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648,REPEAT:10497},Iu="KHR_mesh_quantization",Nn={};Nn[Bt]=je.NEAREST;Nn[Tl]=je.NEAREST_MIPMAP_NEAREST;Nn[er]=je.NEAREST_MIPMAP_LINEAR;Nn[Ht]=je.LINEAR;Nn[jr]=je.LINEAR_MIPMAP_NEAREST;Nn[gi]=je.LINEAR_MIPMAP_LINEAR;Nn[kn]=je.CLAMP_TO_EDGE;Nn[kr]=je.REPEAT;Nn[Br]=je.MIRRORED_REPEAT;var qp={scale:"scale",position:"translation",quaternion:"rotation",morphTargetInfluences:"weights"},Mb=new ze,Yp=12,Sb=1179937895,wb=2,Zp=8,Eb=1313821514,Tb=5130562;function Gi(n,e){return n.length===e.length&&n.every(function(t,i){return t===e[i]})}function Ab(n){return new TextEncoder().encode(n).buffer}function Rb(n){return Gi(n.elements,[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function Cb(n,e,t){let i={min:new Array(n.itemSize).fill(Number.POSITIVE_INFINITY),max:new Array(n.itemSize).fill(Number.NEGATIVE_INFINITY)};for(let s=e;s<e+t;s++)for(let r=0;r<n.itemSize;r++){let o;n.itemSize>4?o=n.array[s*n.itemSize+r]:(r===0?o=n.getX(s):r===1?o=n.getY(s):r===2?o=n.getZ(s):r===3&&(o=n.getW(s)),n.normalized===!0&&(o=Hi.normalize(o,n.array))),i.min[r]=Math.min(i.min[r],o),i.max[r]=Math.max(i.max[r],o)}return i}function Jp(n){return Math.ceil(n/4)*4}function Pu(n,e=0){let t=Jp(n.byteLength);if(t!==n.byteLength){let i=new Uint8Array(t);if(i.set(new Uint8Array(n)),e!==0)for(let s=n.byteLength;s<t;s++)i[s]=e;return i.buffer}return n}function jp(){return typeof document>"u"&&typeof OffscreenCanvas<"u"?new OffscreenCanvas(1,1):document.createElement("canvas")}function Ib(n,e){if(typeof OffscreenCanvas<"u"&&n instanceof OffscreenCanvas){let t;return e==="image/jpeg"?t=.92:e==="image/webp"&&(t=.8),n.convertToBlob({type:e,quality:t})}else return new Promise(t=>n.toBlob(t,e))}var Lu=class{constructor(){this.plugins=[],this.options={},this.pending=[],this.buffers=[],this.byteOffset=0,this.buffers=[],this.nodeMap=new Map,this.skins=[],this.extensionsUsed={},this.extensionsRequired={},this.uids=new Map,this.uid=0,this.json={asset:{version:"2.0",generator:"THREE.GLTFExporter r183"}},this.cache={meshes:new Map,attributes:new Map,attributesNormalized:new Map,materials:new Map,textures:new Map,images:new Map},this.textureUtils=null}setPlugins(e){this.plugins=e}setTextureUtils(e){this.textureUtils=e}async writeAsync(e,t,i={}){this.options=Object.assign({binary:!1,trs:!1,onlyVisible:!0,maxTextureSize:1/0,animations:[],includeCustomExtensions:!1},i),this.options.animations.length>0&&(this.options.trs=!0),await this.processInputAsync(e),await Promise.all(this.pending);let s=this,r=s.buffers,o=s.json;i=s.options;let a=s.extensionsUsed,l=s.extensionsRequired,c=new Blob(r,{type:"application/octet-stream"}),h=Object.keys(a),d=Object.keys(l);if(h.length>0&&(o.extensionsUsed=h),d.length>0&&(o.extensionsRequired=d),o.buffers&&o.buffers.length>0&&(o.buffers[0].byteLength=c.size),i.binary===!0){let u=new FileReader;u.readAsArrayBuffer(c),u.onloadend=function(){let p=Pu(u.result),g=new DataView(new ArrayBuffer(Zp));g.setUint32(0,p.byteLength,!0),g.setUint32(4,Tb,!0);let y=Pu(Ab(JSON.stringify(o)),32),f=new DataView(new ArrayBuffer(Zp));f.setUint32(0,y.byteLength,!0),f.setUint32(4,Eb,!0);let m=new ArrayBuffer(Yp),x=new DataView(m);x.setUint32(0,Sb,!0),x.setUint32(4,wb,!0);let v=Yp+f.byteLength+y.byteLength+g.byteLength+p.byteLength;x.setUint32(8,v,!0);let M=new Blob([m,f,y,g,p],{type:"application/octet-stream"}),T=new FileReader;T.readAsArrayBuffer(M),T.onloadend=function(){t(T.result)}}}else if(o.buffers&&o.buffers.length>0){let u=new FileReader;u.readAsDataURL(c),u.onloadend=function(){let p=u.result;o.buffers[0].uri=p,t(o)}}else t(o)}serializeUserData(e,t){if(Object.keys(e.userData).length===0)return;let i=this.options,s=this.extensionsUsed;try{let r=JSON.parse(JSON.stringify(e.userData));if(i.includeCustomExtensions&&r.gltfExtensions){t.extensions===void 0&&(t.extensions={});for(let o in r.gltfExtensions)t.extensions[o]=r.gltfExtensions[o],s[o]=!0;delete r.gltfExtensions}Object.keys(r).length>0&&(t.extras=r)}catch(r){console.warn("THREE.GLTFExporter: userData of '"+e.name+"' won't be serialized because of JSON.stringify error - "+r.message)}}getUID(e,t=!1){if(this.uids.has(e)===!1){let s=new Map;s.set(!0,this.uid++),s.set(!1,this.uid++),this.uids.set(e,s)}return this.uids.get(e).get(t)}isNormalizedNormalAttribute(e){if(this.cache.attributesNormalized.has(e))return!1;let i=new I;for(let s=0,r=e.count;s<r;s++)if(Math.abs(i.fromBufferAttribute(e,s).length()-1)>5e-4)return!1;return!0}createNormalizedNormalAttribute(e){let t=this.cache;if(t.attributesNormalized.has(e))return t.attributesNormalized.get(e);let i=e.clone(),s=new I;for(let r=0,o=i.count;r<o;r++)s.fromBufferAttribute(i,r),s.x===0&&s.y===0&&s.z===0?s.setX(1):s.normalize(),i.setXYZ(r,s.x,s.y,s.z);return t.attributesNormalized.set(e,i),i}applyTextureTransform(e,t){let i=!1,s={};(t.offset.x!==0||t.offset.y!==0)&&(s.offset=t.offset.toArray(),i=!0),t.rotation!==0&&(s.rotation=t.rotation,i=!0),(t.repeat.x!==1||t.repeat.y!==1)&&(s.scale=t.repeat.toArray(),i=!0),i&&(e.extensions=e.extensions||{},e.extensions.KHR_texture_transform=s,this.extensionsUsed.KHR_texture_transform=!0)}async buildMetalRoughTextureAsync(e,t){if(e===t)return e;function i(p){return p.colorSpace===Qt?function(y){return y<.04045?y*.0773993808:Math.pow(y*.9478672986+.0521327014,2.4)}:function(y){return y}}e instanceof js&&(e=await this.decompressTextureAsync(e)),t instanceof js&&(t=await this.decompressTextureAsync(t));let s=e?e.image:null,r=t?t.image:null,o=Math.max(s?s.width:0,r?r.width:0),a=Math.max(s?s.height:0,r?r.height:0),l=jp();l.width=o,l.height=a;let c=l.getContext("2d",{willReadFrequently:!0});c.fillStyle="#00ffff",c.fillRect(0,0,o,a);let h=c.getImageData(0,0,o,a);if(s){c.drawImage(s,0,0,o,a);let p=i(e),g=c.getImageData(0,0,o,a).data;for(let y=2;y<g.length;y+=4)h.data[y]=p(g[y]/256)*256}if(r){c.drawImage(r,0,0,o,a);let p=i(t),g=c.getImageData(0,0,o,a).data;for(let y=1;y<g.length;y+=4)h.data[y]=p(g[y]/256)*256}c.putImageData(h,0,0);let u=(e||t).clone();return u.source=new us(l),u.colorSpace=ii,u.channel=(e||t).channel,e&&t&&e.channel!==t.channel&&console.warn("THREE.GLTFExporter: UV channels for metalnessMap and roughnessMap textures must match."),console.warn("THREE.GLTFExporter: Merged metalnessMap and roughnessMap textures."),u}async decompressTextureAsync(e,t=1/0){if(this.textureUtils===null)throw new Error("THREE.GLTFExporter: setTextureUtils() must be called to process compressed textures.");return await this.textureUtils.decompress(e,t)}processBuffer(e){let t=this.json,i=this.buffers;return t.buffers||(t.buffers=[{byteLength:0}]),i.push(e),0}processBufferView(e,t,i,s,r){let o=this.json;o.bufferViews||(o.bufferViews=[]);let a;switch(t){case je.BYTE:case je.UNSIGNED_BYTE:a=1;break;case je.SHORT:case je.UNSIGNED_SHORT:a=2;break;default:a=4}let l=e.itemSize*a;r===je.ARRAY_BUFFER&&(l=Math.ceil(l/4)*4);let c=Jp(s*l),h=new DataView(new ArrayBuffer(c)),d=0;for(let g=i;g<i+s;g++){for(let y=0;y<e.itemSize;y++){let f;e.itemSize>4?f=e.array[g*e.itemSize+y]:(y===0?f=e.getX(g):y===1?f=e.getY(g):y===2?f=e.getZ(g):y===3&&(f=e.getW(g)),e.normalized===!0&&(f=Hi.normalize(f,e.array))),t===je.FLOAT?h.setFloat32(d,f,!0):t===je.INT?h.setInt32(d,f,!0):t===je.UNSIGNED_INT?h.setUint32(d,f,!0):t===je.SHORT?h.setInt16(d,f,!0):t===je.UNSIGNED_SHORT?h.setUint16(d,f,!0):t===je.BYTE?h.setInt8(d,f):t===je.UNSIGNED_BYTE&&h.setUint8(d,f),d+=a}d%l!==0&&(d+=l-d%l)}let u={buffer:this.processBuffer(h.buffer),byteOffset:this.byteOffset,byteLength:c};return r!==void 0&&(u.target=r),r===je.ARRAY_BUFFER&&(u.byteStride=l),this.byteOffset+=c,o.bufferViews.push(u),{id:o.bufferViews.length-1,byteLength:0}}processBufferViewImage(e){let t=this,i=t.json;return i.bufferViews||(i.bufferViews=[]),new Promise(function(s){let r=new FileReader;r.readAsArrayBuffer(e),r.onloadend=function(){let o=Pu(r.result),a={buffer:t.processBuffer(o),byteOffset:t.byteOffset,byteLength:o.byteLength};t.byteOffset+=o.byteLength,s(i.bufferViews.push(a)-1)}})}processAccessor(e,t,i,s){let r=this.json,o={1:"SCALAR",2:"VEC2",3:"VEC3",4:"VEC4",9:"MAT3",16:"MAT4"},a;if(e.array.constructor===Float32Array)a=je.FLOAT;else if(e.array.constructor===Int32Array)a=je.INT;else if(e.array.constructor===Uint32Array)a=je.UNSIGNED_INT;else if(e.array.constructor===Int16Array)a=je.SHORT;else if(e.array.constructor===Uint16Array)a=je.UNSIGNED_SHORT;else if(e.array.constructor===Int8Array)a=je.BYTE;else if(e.array.constructor===Uint8Array)a=je.UNSIGNED_BYTE;else throw new Error("THREE.GLTFExporter: Unsupported bufferAttribute component type: "+e.array.constructor.name);if(i===void 0&&(i=0),(s===void 0||s===1/0)&&(s=e.count),s===0)return null;let l=Cb(e,i,s),c;t!==void 0&&(c=e===t.index?je.ELEMENT_ARRAY_BUFFER:je.ARRAY_BUFFER);let h=this.processBufferView(e,a,i,s,c),d={bufferView:h.id,byteOffset:h.byteOffset,componentType:a,count:s,max:l.max,min:l.min,type:o[e.itemSize]};return e.normalized===!0&&(d.normalized=!0),r.accessors||(r.accessors=[]),r.accessors.push(d)-1}processImage(e,t,i,s="image/png"){if(e!==null){let r=this,o=r.cache,a=r.json,l=r.options,c=r.pending;o.images.has(e)||o.images.set(e,{});let h=o.images.get(e),d=s+":flipY/"+i.toString();if(h[d]!==void 0)return h[d];a.images||(a.images=[]);let u={mimeType:s},p=jp();p.width=Math.min(e.width,l.maxTextureSize),p.height=Math.min(e.height,l.maxTextureSize);let g=p.getContext("2d",{willReadFrequently:!0});if(i===!0&&(g.translate(0,p.height),g.scale(1,-1)),e.data!==void 0){t!==bn&&console.error("GLTFExporter: Only RGBAFormat is supported.",t),(e.width>l.maxTextureSize||e.height>l.maxTextureSize)&&console.warn("GLTFExporter: Image size is bigger than maxTextureSize",e);let f=new Uint8ClampedArray(e.height*e.width*4);for(let m=0;m<f.length;m+=4)f[m+0]=e.data[m+0],f[m+1]=e.data[m+1],f[m+2]=e.data[m+2],f[m+3]=e.data[m+3];g.putImageData(new ImageData(f,e.width,e.height),0,0)}else if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap||typeof OffscreenCanvas<"u"&&e instanceof OffscreenCanvas)g.drawImage(e,0,0,p.width,p.height);else throw new Error("THREE.GLTFExporter: Invalid image type. Use HTMLImageElement, HTMLCanvasElement, ImageBitmap or OffscreenCanvas.");l.binary===!0?c.push(Ib(p,s).then(f=>r.processBufferViewImage(f)).then(f=>{u.bufferView=f})):u.uri=Wr.getDataURL(p,s);let y=a.images.push(u)-1;return h[d]=y,y}else throw new Error("THREE.GLTFExporter: No valid image data found. Unable to process texture.")}processSampler(e){let t=this.json;t.samplers||(t.samplers=[]);let i={magFilter:Nn[e.magFilter],minFilter:Nn[e.minFilter],wrapS:Nn[e.wrapS],wrapT:Nn[e.wrapT]};return t.samplers.push(i)-1}async processTextureAsync(e){let i=this.options,s=this.cache,r=this.json;if(s.textures.has(e))return s.textures.get(e);r.textures||(r.textures=[]),e instanceof js&&(e=await this.decompressTextureAsync(e,i.maxTextureSize));let o=e.userData.mimeType;o==="image/webp"&&(o="image/png");let a={sampler:this.processSampler(e),source:this.processImage(e.image,e.format,e.flipY,o)};e.name&&(a.name=e.name),await this._invokeAllAsync(async function(c){c.writeTexture&&await c.writeTexture(e,a)});let l=r.textures.push(a)-1;return s.textures.set(e,l),l}async processMaterialAsync(e){let t=this.cache,i=this.json;if(t.materials.has(e))return t.materials.get(e);if(e.isShaderMaterial)return console.warn("GLTFExporter: THREE.ShaderMaterial not supported."),null;i.materials||(i.materials=[]);let s={pbrMetallicRoughness:{}};e.isMeshStandardMaterial!==!0&&e.isMeshBasicMaterial!==!0&&console.warn("GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.");let r=e.color.toArray().concat([e.opacity]);if(Gi(r,[1,1,1,1])||(s.pbrMetallicRoughness.baseColorFactor=r),e.isMeshStandardMaterial?(s.pbrMetallicRoughness.metallicFactor=e.metalness,s.pbrMetallicRoughness.roughnessFactor=e.roughness):(s.pbrMetallicRoughness.metallicFactor=0,s.pbrMetallicRoughness.roughnessFactor=1),e.metalnessMap||e.roughnessMap){let a=await this.buildMetalRoughTextureAsync(e.metalnessMap,e.roughnessMap),l={index:await this.processTextureAsync(a),texCoord:a.channel};this.applyTextureTransform(l,a),s.pbrMetallicRoughness.metallicRoughnessTexture=l}if(e.map){let a={index:await this.processTextureAsync(e.map),texCoord:e.map.channel};this.applyTextureTransform(a,e.map),s.pbrMetallicRoughness.baseColorTexture=a}if(e.emissive){let a=e.emissive;if(Math.max(a.r,a.g,a.b)>0&&(s.emissiveFactor=e.emissive.toArray()),e.emissiveMap){let c={index:await this.processTextureAsync(e.emissiveMap),texCoord:e.emissiveMap.channel};this.applyTextureTransform(c,e.emissiveMap),s.emissiveTexture=c}}if(e.normalMap){let a={index:await this.processTextureAsync(e.normalMap),texCoord:e.normalMap.channel};e.normalScale&&e.normalScale.x!==1&&(a.scale=e.normalScale.x),this.applyTextureTransform(a,e.normalMap),s.normalTexture=a}if(e.aoMap){let a={index:await this.processTextureAsync(e.aoMap),texCoord:e.aoMap.channel};e.aoMapIntensity!==1&&(a.strength=e.aoMapIntensity),this.applyTextureTransform(a,e.aoMap),s.occlusionTexture=a}e.transparent?s.alphaMode="BLEND":e.alphaTest>0&&(s.alphaMode="MASK",s.alphaCutoff=e.alphaTest),e.side===ln&&(s.doubleSided=!0),e.name!==""&&(s.name=e.name),this.serializeUserData(e,s),await this._invokeAllAsync(async function(a){a.writeMaterialAsync&&await a.writeMaterialAsync(e,s)});let o=i.materials.push(s)-1;return t.materials.set(e,o),o}async processMeshAsync(e){let t=this.cache,i=this.json,s=[e.geometry.uuid];if(Array.isArray(e.material))for(let M=0,T=e.material.length;M<T;M++)s.push(e.material[M].uuid);else s.push(e.material.uuid);let r=s.join(":");if(t.meshes.has(r))return t.meshes.get(r);let o=e.geometry,a;e.isLineSegments?a=je.LINES:e.isLineLoop?a=je.LINE_LOOP:e.isLine?a=je.LINE_STRIP:e.isPoints?a=je.POINTS:a=e.material.wireframe?je.LINES:je.TRIANGLES;let l={},c={},h=[],d=[],u={uv:"TEXCOORD_0",uv1:"TEXCOORD_1",uv2:"TEXCOORD_2",uv3:"TEXCOORD_3",color:"COLOR_0",skinWeight:"WEIGHTS_0",skinIndex:"JOINTS_0"},p=o.getAttribute("normal");p!==void 0&&!this.isNormalizedNormalAttribute(p)&&(console.warn("THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one."),o.setAttribute("normal",this.createNormalizedNormalAttribute(p)));let g=null;for(let M in o.attributes){if(M.slice(0,5)==="morph")continue;let T=o.attributes[M];if(M=u[M]||M.toUpperCase(),/^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/.test(M)||(M="_"+M),t.attributes.has(this.getUID(T))){c[M]=t.attributes.get(this.getUID(T));continue}g=null;let A=T.array;M==="JOINTS_0"&&!(A instanceof Uint16Array)&&!(A instanceof Uint8Array)?(console.warn('GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.'),g=As.Utils.toTypedBufferAttribute(T,Uint16Array)):(A instanceof Uint32Array||A instanceof Int32Array)&&!M.startsWith("_")&&(console.warn(`GLTFExporter: Attribute "${M}" converted to type FLOAT.`),g=As.Utils.toTypedBufferAttribute(T,Float32Array));let _=this.processAccessor(g||T,o);_!==null&&(M.startsWith("_")||this.detectMeshQuantization(M,T),c[M]=_,t.attributes.set(this.getUID(T),_))}if(p!==void 0&&o.setAttribute("normal",p),Object.keys(c).length===0)return null;if(e.morphTargetInfluences!==void 0&&e.morphTargetInfluences.length>0){let M=[],T=[],E={};if(e.morphTargetDictionary!==void 0)for(let A in e.morphTargetDictionary)E[e.morphTargetDictionary[A]]=A;for(let A=0;A<e.morphTargetInfluences.length;++A){let _={},w=!1;for(let V in o.morphAttributes){if(V!=="position"&&V!=="normal"){w||(console.warn("GLTFExporter: Only POSITION and NORMAL morph are supported."),w=!0);continue}let C=o.morphAttributes[V][A],O=V.toUpperCase(),k=o.attributes[V];if(t.attributes.has(this.getUID(C,!0))){_[O]=t.attributes.get(this.getUID(C,!0));continue}let D=C.clone();if(!o.morphTargetsRelative)for(let N=0,H=C.count;N<H;N++)for(let z=0;z<C.itemSize;z++)z===0&&D.setX(N,C.getX(N)-k.getX(N)),z===1&&D.setY(N,C.getY(N)-k.getY(N)),z===2&&D.setZ(N,C.getZ(N)-k.getZ(N)),z===3&&D.setW(N,C.getW(N)-k.getW(N));_[O]=this.processAccessor(D,o),t.attributes.set(this.getUID(k,!0),_[O])}d.push(_),M.push(e.morphTargetInfluences[A]),e.morphTargetDictionary!==void 0&&T.push(E[A])}l.weights=M,T.length>0&&(l.extras={},l.extras.targetNames=T)}let y=Array.isArray(e.material);if(y&&o.groups.length===0)return null;let f=!1;if(y&&o.index===null){let M=[];for(let T=0,E=o.attributes.position.count;T<E;T++)M[T]=T;o.setIndex(M),f=!0}let m=y?e.material:[e.material],x=y?o.groups:[{materialIndex:0,start:void 0,count:void 0}];for(let M=0,T=x.length;M<T;M++){let E={mode:a,attributes:c};if(this.serializeUserData(o,E),d.length>0&&(E.targets=d),o.index!==null){let _=this.getUID(o.index);(x[M].start!==void 0||x[M].count!==void 0)&&(_+=":"+x[M].start+":"+x[M].count),t.attributes.has(_)?E.indices=t.attributes.get(_):(E.indices=this.processAccessor(o.index,o,x[M].start,x[M].count),t.attributes.set(_,E.indices)),E.indices===null&&delete E.indices}let A=await this.processMaterialAsync(m[x[M].materialIndex]);A!==null&&(E.material=A),h.push(E)}f===!0&&o.setIndex(null),l.primitives=h,i.meshes||(i.meshes=[]),await this._invokeAllAsync(function(M){M.writeMesh&&M.writeMesh(e,l)});let v=i.meshes.push(l)-1;return t.meshes.set(r,v),v}detectMeshQuantization(e,t){if(this.extensionsUsed[Iu])return;let i;switch(t.array.constructor){case Int8Array:i="byte";break;case Uint8Array:i="unsigned byte";break;case Int16Array:i="short";break;case Uint16Array:i="unsigned short";break;default:return}t.normalized&&(i+=" normalized");let s=e.split("_",1)[0];$p[s]&&$p[s].includes(i)&&(this.extensionsUsed[Iu]=!0,this.extensionsRequired[Iu]=!0)}processCamera(e){let t=this.json;t.cameras||(t.cameras=[]);let i=e.isOrthographicCamera,s={type:i?"orthographic":"perspective"};return i?s.orthographic={xmag:e.right*2,ymag:e.top*2,zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near}:s.perspective={aspectRatio:e.aspect,yfov:Hi.degToRad(e.fov),zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near},e.name!==""&&(s.name=e.type),t.cameras.push(s)-1}processAnimation(e,t){let i=this.json,s=this.nodeMap;i.animations||(i.animations=[]),e=As.Utils.mergeMorphTargetTracks(e.clone(),t);let r=e.tracks,o=[],a=[];for(let c=0;c<r.length;++c){let h=r[c],d=rt.parseTrackName(h.name),u=rt.findNode(t,d.nodeName),p=qp[d.propertyName];if(d.objectName==="bones"&&(u.isSkinnedMesh===!0?u=u.skeleton.getBoneByName(d.objectIndex):u=void 0),!u||!p){console.warn('THREE.GLTFExporter: Could not export animation track "%s".',h.name);continue}let g=1,y=h.values.length/h.times.length;p===qp.morphTargetInfluences&&(y/=u.morphTargetInfluences.length);let f;h.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline===!0?(f="CUBICSPLINE",y/=3):h.getInterpolation()===qs?f="STEP":f="LINEAR",a.push({input:this.processAccessor(new At(h.times,g)),output:this.processAccessor(new At(h.values,y)),interpolation:f}),o.push({sampler:a.length-1,target:{node:s.get(u),path:p}})}let l={name:e.name||"clip_"+i.animations.length,samplers:a,channels:o};return this.serializeUserData(e,l),i.animations.push(l),i.animations.length-1}processSkin(e){let t=this.json,i=this.nodeMap,s=t.nodes[i.get(e)],r=e.skeleton;if(r===void 0)return null;let o=e.skeleton.bones[0];if(o===void 0)return null;let a=[],l=new Float32Array(r.bones.length*16),c=new nt;for(let d=0;d<r.bones.length;++d)a.push(i.get(r.bones[d])),c.copy(r.boneInverses[d]),c.multiply(e.bindMatrix).toArray(l,d*16);return t.skins===void 0&&(t.skins=[]),t.skins.push({inverseBindMatrices:this.processAccessor(new At(l,16)),joints:a,skeleton:i.get(o)}),s.skin=t.skins.length-1}async processNodeAsync(e){let t=this.json,i=this.options,s=this.nodeMap;if(t.nodes||(t.nodes=[]),e.pivot!==null)return await this._processNodeWithPivotAsync(e);let r={};if(i.trs){let a=e.quaternion.toArray(),l=e.position.toArray(),c=e.scale.toArray();Gi(a,[0,0,0,1])||(r.rotation=a),Gi(l,[0,0,0])||(r.translation=l),Gi(c,[1,1,1])||(r.scale=c)}else e.matrixAutoUpdate&&e.updateMatrix(),Rb(e.matrix)===!1&&(r.matrix=e.matrix.elements);if(e.name!==""&&(r.name=String(e.name)),this.serializeUserData(e,r),e.isMesh||e.isLine||e.isPoints){let a=await this.processMeshAsync(e);a!==null&&(r.mesh=a)}else e.isCamera&&(r.camera=this.processCamera(e));e.isSkinnedMesh&&this.skins.push(e);let o=t.nodes.push(r)-1;if(s.set(e,o),e.children.length>0){let a=[];for(let l=0,c=e.children.length;l<c;l++){let h=e.children[l];if(h.visible||i.onlyVisible===!1){let d=await this.processNodeAsync(h);d!==null&&a.push(d)}}a.length>0&&(r.children=a)}return await this._invokeAllAsync(function(a){a.writeNode&&a.writeNode(e,r)}),o}async _processNodeWithPivotAsync(e){let t=this.json,i=this.options,s=this.nodeMap,r=e.pivot,o={},a=e.quaternion.toArray(),l=[e.position.x+r.x,e.position.y+r.y,e.position.z+r.z],c=e.scale.toArray();Gi(a,[0,0,0,1])||(o.rotation=a),Gi(l,[0,0,0])||(o.translation=l),Gi(c,[1,1,1])||(o.scale=c),o.extras={pivot:r.toArray()},e.name!==""&&(o.name=String(e.name)),this.serializeUserData(e,o);let h=t.nodes.push(o)-1;s.set(e,h);let d={},u=[-r.x,-r.y,-r.z];if(Gi(u,[0,0,0])||(d.translation=u),e.isMesh||e.isLine||e.isPoints){let y=await this.processMeshAsync(e);y!==null&&(d.mesh=y)}else e.isCamera&&(d.camera=this.processCamera(e));e.isSkinnedMesh&&this.skins.push(e);let g=[t.nodes.push(d)-1];if(e.children.length>0){let y=[];for(let f=0,m=e.children.length;f<m;f++){let x=e.children[f];if(x.visible||i.onlyVisible===!1){let v=await this.processNodeAsync(x);v!==null&&y.push(v)}}y.length>0&&(d.children=y)}return o.children=g,await this._invokeAllAsync(function(y){y.writeNode&&y.writeNode(e,o)}),h}async processSceneAsync(e){let t=this.json,i=this.options;t.scenes||(t.scenes=[],t.scene=0);let s={};e.name!==""&&(s.name=e.name),t.scenes.push(s);let r=[];for(let o=0,a=e.children.length;o<a;o++){let l=e.children[o];if(l.visible||i.onlyVisible===!1){let c=await this.processNodeAsync(l);c!==null&&r.push(c)}}r.length>0&&(s.nodes=r),this.serializeUserData(e,s)}async processObjectsAsync(e){let t=new ds;t.name="AuxScene";for(let i=0;i<e.length;i++)t.children.push(e[i]);await this.processSceneAsync(t)}async processInputAsync(e){let t=this.options;e=e instanceof Array?e:[e],await this._invokeAllAsync(function(s){s.beforeParse&&s.beforeParse(e)});let i=[];for(let s=0;s<e.length;s++)e[s]instanceof ds?await this.processSceneAsync(e[s]):i.push(e[s]);i.length>0&&await this.processObjectsAsync(i);for(let s=0;s<this.skins.length;++s)this.processSkin(this.skins[s]);for(let s=0;s<t.animations.length;++s)this.processAnimation(t.animations[s],e[0]);await this._invokeAllAsync(function(s){s.afterParse&&s.afterParse(e)})}async _invokeAllAsync(e){for(let t=0,i=this.plugins.length;t<i;t++)await e(this.plugins[t])}},Du=class{constructor(e){this.writer=e,this.name="KHR_lights_punctual"}writeNode(e,t){if(!e.isLight)return;if(!e.isDirectionalLight&&!e.isPointLight&&!e.isSpotLight){console.warn("THREE.GLTFExporter: Only directional, point, and spot lights are supported.",e);return}let i=this.writer,s=i.json,r=i.extensionsUsed,o={};e.name&&(o.name=e.name),o.color=e.color.toArray(),o.intensity=e.intensity,e.isDirectionalLight?o.type="directional":e.isPointLight?(o.type="point",e.distance>0&&(o.range=e.distance)):e.isSpotLight&&(o.type="spot",e.distance>0&&(o.range=e.distance),o.spot={},o.spot.innerConeAngle=(1-e.penumbra)*e.angle,o.spot.outerConeAngle=e.angle),e.decay!==void 0&&e.decay!==2&&console.warn("THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, and expects light.decay=2."),e.target&&(e.target.parent!==e||e.target.position.x!==0||e.target.position.y!==0||e.target.position.z!==-1)&&console.warn("THREE.GLTFExporter: Light direction may be lost. For best results, make light.target a child of the light with position 0,0,-1."),r[this.name]||(s.extensions=s.extensions||{},s.extensions[this.name]={lights:[]},r[this.name]=!0);let a=s.extensions[this.name].lights;a.push(o),t.extensions=t.extensions||{},t.extensions[this.name]={light:a.length-1}}},Nu=class{constructor(e){this.writer=e,this.name="KHR_materials_unlit"}async writeMaterialAsync(e,t){if(!e.isMeshBasicMaterial)return;let s=this.writer.extensionsUsed;t.extensions=t.extensions||{},t.extensions[this.name]={},s[this.name]=!0,t.pbrMetallicRoughness.metallicFactor=0,t.pbrMetallicRoughness.roughnessFactor=.9}},Ou=class{constructor(e){this.writer=e,this.name="KHR_materials_clearcoat"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.clearcoat===0)return;let i=this.writer,s=i.extensionsUsed,r={};if(r.clearcoatFactor=e.clearcoat,e.clearcoatMap){let o={index:await i.processTextureAsync(e.clearcoatMap),texCoord:e.clearcoatMap.channel};i.applyTextureTransform(o,e.clearcoatMap),r.clearcoatTexture=o}if(r.clearcoatRoughnessFactor=e.clearcoatRoughness,e.clearcoatRoughnessMap){let o={index:await i.processTextureAsync(e.clearcoatRoughnessMap),texCoord:e.clearcoatRoughnessMap.channel};i.applyTextureTransform(o,e.clearcoatRoughnessMap),r.clearcoatRoughnessTexture=o}if(e.clearcoatNormalMap){let o={index:await i.processTextureAsync(e.clearcoatNormalMap),texCoord:e.clearcoatNormalMap.channel};e.clearcoatNormalScale.x!==1&&(o.scale=e.clearcoatNormalScale.x),i.applyTextureTransform(o,e.clearcoatNormalMap),r.clearcoatNormalTexture=o}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Uu=class{constructor(e){this.writer=e,this.name="KHR_materials_dispersion"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.dispersion===0)return;let s=this.writer.extensionsUsed,r={};r.dispersion=e.dispersion,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Fu=class{constructor(e){this.writer=e,this.name="KHR_materials_iridescence"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.iridescence===0)return;let i=this.writer,s=i.extensionsUsed,r={};if(r.iridescenceFactor=e.iridescence,e.iridescenceMap){let o={index:await i.processTextureAsync(e.iridescenceMap),texCoord:e.iridescenceMap.channel};i.applyTextureTransform(o,e.iridescenceMap),r.iridescenceTexture=o}if(r.iridescenceIor=e.iridescenceIOR,r.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],r.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1],e.iridescenceThicknessMap){let o={index:await i.processTextureAsync(e.iridescenceThicknessMap),texCoord:e.iridescenceThicknessMap.channel};i.applyTextureTransform(o,e.iridescenceThicknessMap),r.iridescenceThicknessTexture=o}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},ku=class{constructor(e){this.writer=e,this.name="KHR_materials_transmission"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.transmission===0)return;let i=this.writer,s=i.extensionsUsed,r={};if(r.transmissionFactor=e.transmission,e.transmissionMap){let o={index:await i.processTextureAsync(e.transmissionMap),texCoord:e.transmissionMap.channel};i.applyTextureTransform(o,e.transmissionMap),r.transmissionTexture=o}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Bu=class{constructor(e){this.writer=e,this.name="KHR_materials_volume"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.transmission===0)return;let i=this.writer,s=i.extensionsUsed,r={};if(r.thicknessFactor=e.thickness,e.thicknessMap){let o={index:await i.processTextureAsync(e.thicknessMap),texCoord:e.thicknessMap.channel};i.applyTextureTransform(o,e.thicknessMap),r.thicknessTexture=o}e.attenuationDistance!==1/0&&(r.attenuationDistance=e.attenuationDistance),r.attenuationColor=e.attenuationColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},zu=class{constructor(e){this.writer=e,this.name="KHR_materials_ior"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.ior===1.5)return;let s=this.writer.extensionsUsed,r={};r.ior=e.ior,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Vu=class{constructor(e){this.writer=e,this.name="KHR_materials_specular"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.specularIntensity===1&&e.specularColor.equals(Mb)&&!e.specularIntensityMap&&!e.specularColorMap)return;let i=this.writer,s=i.extensionsUsed,r={};if(e.specularIntensityMap){let o={index:await i.processTextureAsync(e.specularIntensityMap),texCoord:e.specularIntensityMap.channel};i.applyTextureTransform(o,e.specularIntensityMap),r.specularTexture=o}if(e.specularColorMap){let o={index:await i.processTextureAsync(e.specularColorMap),texCoord:e.specularColorMap.channel};i.applyTextureTransform(o,e.specularColorMap),r.specularColorTexture=o}r.specularFactor=e.specularIntensity,r.specularColorFactor=e.specularColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Hu=class{constructor(e){this.writer=e,this.name="KHR_materials_sheen"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.sheen==0)return;let i=this.writer,s=i.extensionsUsed,r={};if(e.sheenRoughnessMap){let o={index:await i.processTextureAsync(e.sheenRoughnessMap),texCoord:e.sheenRoughnessMap.channel};i.applyTextureTransform(o,e.sheenRoughnessMap),r.sheenRoughnessTexture=o}if(e.sheenColorMap){let o={index:await i.processTextureAsync(e.sheenColorMap),texCoord:e.sheenColorMap.channel};i.applyTextureTransform(o,e.sheenColorMap),r.sheenColorTexture=o}r.sheenRoughnessFactor=e.sheenRoughness,r.sheenColorFactor=e.sheenColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Gu=class{constructor(e){this.writer=e,this.name="KHR_materials_anisotropy"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.anisotropy==0)return;let i=this.writer,s=i.extensionsUsed,r={};if(e.anisotropyMap){let o={index:await i.processTextureAsync(e.anisotropyMap)};i.applyTextureTransform(o,e.anisotropyMap),r.anisotropyTexture=o}r.anisotropyStrength=e.anisotropy,r.anisotropyRotation=e.anisotropyRotation,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Wu=class{constructor(e){this.writer=e,this.name="KHR_materials_emissive_strength"}async writeMaterialAsync(e,t){if(!e.isMeshStandardMaterial||e.emissiveIntensity===1)return;let s=this.writer.extensionsUsed,r={};r.emissiveStrength=e.emissiveIntensity,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Xu=class{constructor(e){this.writer=e,this.name="EXT_materials_bump"}async writeMaterialAsync(e,t){if(!e.isMeshStandardMaterial||e.bumpScale===1&&!e.bumpMap)return;let i=this.writer,s=i.extensionsUsed,r={};if(e.bumpMap){let o={index:await i.processTextureAsync(e.bumpMap),texCoord:e.bumpMap.channel};i.applyTextureTransform(o,e.bumpMap),r.bumpTexture=o}r.bumpFactor=e.bumpScale,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},$u=class{constructor(e){this.writer=e,this.name="EXT_mesh_gpu_instancing"}writeNode(e,t){if(!e.isInstancedMesh)return;let i=this.writer,s=e,r=new Float32Array(s.count*3),o=new Float32Array(s.count*4),a=new Float32Array(s.count*3),l=new nt,c=new I,h=new dt,d=new I;for(let p=0;p<s.count;p++)s.getMatrixAt(p,l),l.decompose(c,h,d),c.toArray(r,p*3),h.toArray(o,p*4),d.toArray(a,p*3);let u={TRANSLATION:i.processAccessor(new At(r,3)),ROTATION:i.processAccessor(new At(o,4)),SCALE:i.processAccessor(new At(a,3))};s.instanceColor&&(u._COLOR_0=i.processAccessor(s.instanceColor)),t.extensions=t.extensions||{},t.extensions[this.name]={attributes:u},i.extensionsUsed[this.name]=!0,i.extensionsRequired[this.name]=!0}};As.Utils={insertKeyframe:function(n,e){let i=n.getValueSize(),s=new n.TimeBufferType(n.times.length+1),r=new n.ValueBufferType(n.values.length+i),o=n.createInterpolant(new n.ValueBufferType(i)),a;if(n.times.length===0){s[0]=e;for(let l=0;l<i;l++)r[l]=0;a=0}else if(e<n.times[0]){if(Math.abs(n.times[0]-e)<.001)return 0;s[0]=e,s.set(n.times,1),r.set(o.evaluate(e),0),r.set(n.values,i),a=0}else if(e>n.times[n.times.length-1]){if(Math.abs(n.times[n.times.length-1]-e)<.001)return n.times.length-1;s[s.length-1]=e,s.set(n.times,0),r.set(n.values,0),r.set(o.evaluate(e),n.values.length),a=s.length-1}else for(let l=0;l<n.times.length;l++){if(Math.abs(n.times[l]-e)<.001)return l;if(n.times[l]<e&&n.times[l+1]>e){s.set(n.times.slice(0,l+1),0),s[l+1]=e,s.set(n.times.slice(l+1),l+2),r.set(n.values.slice(0,(l+1)*i),0),r.set(o.evaluate(e),(l+1)*i),r.set(n.values.slice((l+1)*i),(l+2)*i),a=l+1;break}}return n.times=s,n.values=r,a},mergeMorphTargetTracks:function(n,e){let t=[],i={},s=n.tracks;for(let r=0;r<s.length;++r){let o=s[r],a=rt.parseTrackName(o.name),l=rt.findNode(e,a.nodeName);if(a.propertyName!=="morphTargetInfluences"||a.propertyIndex===void 0){t.push(o);continue}if(o.createInterpolant!==o.InterpolantFactoryMethodDiscrete&&o.createInterpolant!==o.InterpolantFactoryMethodLinear){if(o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline)throw new Error("THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.");console.warn("THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead."),o=o.clone(),o.setInterpolation(zr)}let c=l.morphTargetInfluences.length,h=l.morphTargetDictionary[a.propertyIndex];if(h===void 0)throw new Error("THREE.GLTFExporter: Morph target name not found: "+a.propertyIndex);let d;if(i[l.uuid]===void 0){d=o.clone();let p=new d.ValueBufferType(c*d.times.length);for(let g=0;g<d.times.length;g++)p[g*c+h]=d.values[g];d.name=(a.nodeName||"")+".morphTargetInfluences",d.values=p,i[l.uuid]=d,t.push(d);continue}let u=o.createInterpolant(new o.ValueBufferType(1));d=i[l.uuid];for(let p=0;p<d.times.length;p++)d.values[p*c+h]=u.evaluate(d.times[p]);for(let p=0;p<o.times.length;p++){let g=this.insertKeyframe(d,o.times[p]);d.values[g*c+h]=o.values[p]}}return n.tracks=t,n},toTypedBufferAttribute:function(n,e){let t=new At(new e(n.count*n.itemSize),n.itemSize,!1);if(!n.normalized&&!n.isInterleavedBufferAttribute)return t.array.set(n.array),t;for(let i=0,s=n.count;i<s;i++)for(let r=0;r<n.itemSize;r++)t.setComponent(i,r,n.getComponent(i,r));return t}};var zn=class{container;callbacks;renderer;scene=new ds;camera=new on(45,1,.01,1e4);orbit;gizmo;content=new Bn;helper=new Bn;lights=new Bn;nodes=new Map;elements=new Map;selected=new Set;version=0;disabled=!1;tool="translate";pointer;gesture;resize;frame=0;invalidated=!1;lastScene;lastStateVersion=-1;assets={};textures=[];textureErrors=[];generation=0;interactive=!0;cameraGesture;constructor(e,t){this.container=e,this.callbacks=t;try{this.renderer=new yc({antialias:!0,alpha:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),e.replaceChildren(this.renderer.domElement),this.setTheme(),this.camera.position.set(4,3,6),this.content.name="three-interact-content",this.content.userData.elementId=void 0,this.scene.add(this.content),this.helper.name="three-interact-selection-helper",this.scene.add(this.helper),this.lights.add(new zo(16777215,2504269,2)),this.scene.add(this.lights);let i=new Go(20,20,3359061,1976635);i.name="three-interact-grid",this.scene.add(i),this.orbit=new bc(this.camera,this.renderer.domElement),this.orbit.enableDamping=!0,this.orbit.addEventListener("change",this.invalidate),this.orbit.addEventListener("start",()=>{!this.disabled&&this.interactive&&!this.gesture&&(this.cameraGesture={version:this.version,camera:JSON.stringify(this.getCamera())})}),this.orbit.addEventListener("end",()=>{let s=this.cameraGesture;this.cameraGesture=void 0,s&&!this.disabled&&s.version===this.version&&s.camera!==JSON.stringify(this.getCamera())&&this.callbacks.cameraCommit?.(this.getCamera(),s.version),this.invalidate()}),this.gizmo=new Tc(this.camera,this.renderer.domElement),this.gizmo.setMode(this.tool),this.scene.add(this.gizmo.getHelper()),this.gizmo.addEventListener("change",this.invalidate),this.gizmo.addEventListener("dragging-changed",s=>{this.orbit&&(this.orbit.enabled=!s.value),this.invalidate()}),this.gizmo.addEventListener("mouseDown",()=>{this.beginGesture(),this.invalidate()}),this.gizmo.addEventListener("mouseUp",()=>{this.endGesture(),this.invalidate()}),this.renderer.domElement.addEventListener("pointerdown",s=>{this.pointer={x:s.clientX,y:s.clientY},this.invalidate()}),this.renderer.domElement.addEventListener("pointerup",s=>(this.click(s),this.invalidate())),this.resize=new ResizeObserver(()=>this.resizeView()),this.resize.observe(e),this.resizeView(),this.invalidate()}catch(i){throw this.dispose(),this.callbacks.error(`WebGL unavailable: ${String(i)}`),i}}setState(e,t,i,s){if(this.gesture&&i!==this.gesture.version&&(this.gesture=void 0,this.gizmo?.detach(),this.orbit&&(this.orbit.enabled=!0)),s&&!this.disabled&&(this.gesture&&(this.lastScene=void 0),this.gesture=void 0,this.gizmo?.detach(),this.orbit&&(this.orbit.enabled=!0)),this.version=i,this.disabled=s,(this.cameraGesture?.version!==i||s)&&(this.cameraGesture=void 0),this.orbit&&(this.orbit.enabled=this.interactive&&!s),this.selected=new Set(t),this.lastScene===e&&this.lastStateVersion===i){this.attachSelection(),this.invalidate();return}if(this.lastScene=e,this.lastStateVersion=i,this.elements=new Map(Object.entries(e.elements)),e.mode!=="3d"){this.clearContent(),this.invalidate();return}this.rebuild(),this.attachSelection(),this.invalidate()}setTool(e){this.tool=e,this.gizmo?.setMode(e),this.invalidate()}setAssets(e){(Object.keys(e).length!==Object.keys(this.assets).length||Object.entries(e).some(([t,i])=>this.assets[t]!==i))&&(this.lastScene=void 0),this.assets=e}setInteractive(e,t=!0){this.interactive=e,this.orbit&&(this.orbit.enabled=e&&!this.disabled,this.orbit.enableDamping=t)}getCamera(){return{position:this.camera.position.toArray(),target:(this.orbit?.target??new I).toArray()}}setCamera(e){this.camera.position.set(...e.position),this.orbit?.target.set(...e.target);let t=this.camera.position.distanceTo(new I(...e.target));this.camera.near=Math.max(t/1e5,1e-5),this.camera.far=Math.max(t*10,100),this.camera.updateProjectionMatrix(),this.orbit?.update(),this.invalidate()}async snapshotPng(e="#ffffff"){if(await this.readyTextures(),!this.renderer)throw new Error("WebGL renderer unavailable");let t=[this.helper,this.gizmo?.getHelper(),this.scene.getObjectByName("three-interact-grid")].filter(r=>!!r),i=t.map(r=>r.visible),s=this.scene.background;try{return t.forEach(r=>r.visible=!1),this.scene.background=new ze(e),this.renderer.render(this.scene,this.camera),this.renderer.domElement.toDataURL("image/png")}finally{t.forEach((r,o)=>r.visible=i[o]),this.scene.background=s,this.invalidate()}}async readyTextures(){if(await Promise.all(this.textures),this.textureErrors.length)throw new Error(this.textureErrors.join("; "))}setGridVisible(e){let t=this.scene.getObjectByName("three-interact-grid");!t||t.visible===e||(t.visible=e,this.invalidate())}setTheme(){this.scene.background=new ze(getComputedStyle(this.container).backgroundColor),this.invalidate()}fit(){if(!this.nodes.size)return;let e=[...this.nodes.values()].filter(h=>h.visible&&h.isMesh);if(!e.length)return;let t=new Qn;if(this.content.updateMatrixWorld(!0),e.forEach(h=>{let d=h;d.geometry.computeBoundingBox(),d.geometry.boundingBox&&t.union(d.geometry.boundingBox.clone().applyMatrix4(d.matrixWorld))}),t.isEmpty())return;let i=t.getCenter(new I),s=t.getSize(new I),r=Math.max(s.length()/2,.1),o=Hi.degToRad(this.camera.fov/2),a=Math.atan(Math.tan(o)*Math.max(this.camera.aspect,.01)),l=r/Math.sin(Math.min(o,a)),c=this.camera.position.clone().sub(this.orbit?.target||new I).normalize();c.lengthSq()||c.set(1,.7,1).normalize(),this.camera.position.copy(i).add(c.multiplyScalar(l*1.25)),this.camera.near=Math.max(r/1e3,.001),this.camera.far=Math.max(r*20,100),this.camera.updateProjectionMatrix(),this.orbit?.target.copy(i),this.orbit?.update(),this.invalidate()}async exportGlb(){if(await this.readyTextures(),!this.renderer)throw new Error("WebGL renderer unavailable");return await new Promise((e,t)=>new As().parse(this.content,i=>e(i),t,{binary:!0,onlyVisible:!0}))}dispose(){cancelAnimationFrame(this.frame),this.frame=0,this.invalidated=!1,this.resize?.disconnect(),this.gizmo&&this.scene.remove(this.gizmo.getHelper()),this.gizmo?.dispose(),this.orbit?.dispose(),this.clearContent(),this.scene.traverse(e=>{let t=e;t.geometry?.dispose(),Array.isArray(t.material)?t.material.forEach(i=>i.dispose()):t.material?.dispose()}),this.scene.clear(),this.renderer?.dispose(),this.renderer?.forceContextLoss(),this.renderer?.domElement.remove()}clearContent(){this.generation++,this.textures=[],this.textureErrors=[],this.nodes.forEach(e=>{let t=e;t.geometry?.dispose();let i=t.material;i?.map?.dispose(),Array.isArray(i)?i.forEach(s=>s.dispose()):i?.dispose()}),this.nodes.clear(),this.content.clear(),this.helper.traverse(e=>{let t=e;t.geometry?.dispose(),t.material?.dispose()}),this.helper.clear()}resizeView(){if(!this.renderer)return;let e=Math.max(this.container.clientWidth,1),t=Math.max(this.container.clientHeight,1);this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.invalidate()}resizeNow(){this.resizeView()}invalidate=()=>{this.invalidated=!0,this.frame||(this.frame=requestAnimationFrame(this.renderFrame))};renderFrame=()=>{if(this.frame=0,!this.renderer)return;let e=this.orbit?.update()??!1,t=this.invalidated||e;this.invalidated=!1,t&&(this.helper.traverse(i=>{i.update?.()}),this.renderer.render(this.scene,this.camera),(e||this.invalidated)&&this.invalidate())};rebuild(){this.clearContent();let e=new Map;for(let t of this.elements.values()){let i=this.makeNode(t);e.set(t.id,i),this.nodes.set(t.id,i)}for(let t of this.elements.values()){let i=e.get(t.id);((t.parent?e.get(t.parent):void 0)||this.content).add(i)}}makeNode(e){let t;if(e.type==="group")t=new Bn;else{let i;e.type==="sphere"?i=new Js(Number(e.properties.radius)||.6,32,20):e.type==="cylinder"?i=new Vt(Number(e.properties.radius)||.5,Number(e.properties.radius)||.5,Number(e.properties.height)||1.2,32):e.type==="plane"||e.type==="image"?i=new zi(Number(e.properties.width)||2,Number(e.properties.height)||2):i=new wt(Number(e.properties.width)||1,Number(e.properties.height)||1,Number(e.properties.depth)||1);let s=e.type==="image"?new pi({color:16777215,side:ln,transparent:!0,opacity:Number(e.properties.opacity??1)}):new Fo({color:String(e.properties.fill||"#60a5fa"),transparent:!0,opacity:Number(e.properties.opacity??1)});if(e.type==="image"){let r=this.assets[String(e.properties.src)],o=this.generation;r?this.textures.push(new Promise(a=>{new Bo().load(r,l=>{if(o!==this.generation){l.dispose(),a();return}l.colorSpace=Qt,s.map=l,s.needsUpdate=!0,this.invalidate(),a()},void 0,()=>{o===this.generation&&this.textureErrors.push(`Cannot decode image: ${e.properties.src}`),a()})})):this.textureErrors.push(`Missing image: ${e.properties.src}`)}t=new ue(i,s)}return t.name=e.name,t.userData.elementId=e.id,t.userData.locked=this.locked(e.id),t.visible=this.visible(e.id),t.position.set(...e.transform.position),t.rotation.set(...e.transform.rotation),t.scale.set(...e.transform.scale),t}ancestors(e){let t=[],i=this.elements.get(e)?.parent;for(;i;){let s=this.elements.get(i);if(!s)break;t.push(s),i=s.parent}return t}locked(e){return!!(this.elements.get(e)?.locked||this.ancestors(e).some(t=>t.locked))}visible(e){return!!(this.elements.get(e)?.visible&&this.ancestors(e).every(t=>t.visible))}attachSelection(){if(this.gizmo?.detach(),this.helper.traverse(s=>{let r=s;r.geometry?.dispose(),r.material?.dispose()}),this.helper.clear(),this.disabled||this.selected.size!==1)return;let e=[...this.selected][0],t=this.nodes.get(e);if(!t||this.locked(e))return;this.content.updateMatrixWorld(!0),this.gizmo?.attach(t);let i=new Wo(t,16498468);i.update(),this.helper.add(i)}placementPoint(e,t){if(!this.renderer)throw new Error("3D viewport is unavailable.");let i=this.renderer.domElement.getBoundingClientRect(),s=new vs;s.setFromCamera(new Oe((e-i.left)/i.width*2-1,1-(t-i.top)/i.height*2),this.camera);let r=new I;if(!s.ray.intersectPlane(new gn(new I(0,1,0),0),r)){let o=this.camera.getWorldDirection(new I);s.ray.intersectPlane(new gn().setFromNormalAndCoplanarPoint(o,this.orbit?.target??new I),r)}return r.toArray()}click(e){if(this.disabled||!this.renderer||!this.pointer||this.gesture||Math.hypot(e.clientX-this.pointer.x,e.clientY-this.pointer.y)>5)return;let t=this.renderer.domElement.getBoundingClientRect(),i=new vs;i.setFromCamera(new Oe((e.clientX-t.left)/t.width*2-1,-(e.clientY-t.top)/t.height*2+1),this.camera);let s=i.intersectObjects([...this.nodes.values()].filter(r=>r.visible),!0).find(r=>r.object.userData.elementId&&r.object.visible);this.callbacks.select(s?.object.userData.elementId,e.shiftKey)}beginGesture(){if(this.disabled||this.selected.size!==1||!this.gizmo)return;let e=[...this.selected][0],t=this.nodes.get(e);!t||this.locked(e)||(this.gesture={version:this.version,ids:[e],origin:new Map([[e,{position:[...t.position],rotation:[t.rotation.x,t.rotation.y,t.rotation.z],scale:[t.scale.x,t.scale.y,t.scale.z]}]])})}endGesture(){let e=this.gesture;if(this.gesture=void 0,!e||e.version!==this.version)return;let t=e.ids.map(i=>{let s=this.nodes.get(i),r={position:[s.position.x,s.position.y,s.position.z],rotation:[s.rotation.x,s.rotation.y,s.rotation.z],scale:[Math.max(s.scale.x,1e-4),Math.max(s.scale.y,1e-4),Math.max(s.scale.z,1e-4)]};return{id:i,changes:{transform:r}}});t.some(i=>JSON.stringify(i.changes.transform)!==JSON.stringify(e.origin.get(i.id)))&&this.callbacks.commit(t,e.version)}};var P={ink:"#253858",muted:"#66758c",blue:"#2878bd",red:"#db564b",teal:"#238c89",gold:"#c89735",pale:"#e6f1fa",white:"#ffffff"},Ae=class{constructor(e,t="2d"){this.id=e;this.mode=t;let i=2166136261;for(let s of e)i=Math.imul(i^s.charCodeAt(0),16777619);this.prefix=(i>>>0).toString(16).padStart(8,"0")}elements={};count=0;prefix;add(e,t,i,s={},r=[0,0,0]){let o=hi(e,this.mode);return o.id=`${this.prefix}-0000-4000-8000-${(++this.count).toString(16).padStart(12,"0")}`,o.name=t,o.transform.position=i,o.transform.rotation=r,Object.assign(o.properties,{fill:"none",stroke:P.ink,strokeWidth:2},s),this.elements[o.id]=o,o}line(e,t,i=P.ink,s=2){return this.add("polyline",e,[0,0,0],{points:t,fill:"none",stroke:i,strokeWidth:s})}label(e,t,i,s,r=14,o=P.ink){return this.add("text",e,[i,s,0],{text:t,fontSize:r,fill:o,stroke:"none",strokeWidth:0,textAnchor:"middle"})}dot(e,t,i,s=5,r=P.blue){return this.add("ellipse",e,[t-s,i-s,0],{width:s*2,height:s*2,fill:r,stroke:P.white,strokeWidth:1})}arrow(e,t,i,s=P.ink,r=2){this.line(`${e} shaft`,[t,i],s,r);let o=Math.atan2(i[1]-t[1],i[0]-t[0]),a=l=>[i[0]-8*Math.cos(l),i[1]-8*Math.sin(l)];this.line(`${e} head`,[a(o-.45),i,a(o+.45)],s,r)}finish(e,t,i,s){return{schema:"three-interact.component",version:1,id:this.id,name:e,category:t,mode:this.mode,description:i,elements:this.elements,source:"Built-in scientific library",license:"MIT",references:s}}};var Rs=(n,e)=>({title:n,url:e,kind:"concept"}),tm=Rs("Kwant: Bravais lattices","https://kwant-project.org/doc/latest/reference/kwant.lattice"),nm=Rs("Kwant: graphene and A/B sublattices","https://kwant-project.org/doc/latest/tutorial/graphene"),Pb=Rs("OpenStax: Magnetism in Matter","https://openstax.org/books/university-physics-volume-2/pages/12-7-magnetism-in-matter"),lr="Condensed matter";function Lb(){let n=new Ae("builtin.science.matter.honeycomb"),e=32,t=[];for(let i=0;i<3;i++)for(let s=0;s<4;s++)for(let r of["A","B"])t.push({x:Math.sqrt(3)*e*(s+i/2-2),y:e*(1.5*i+(r==="B"?1:0)-2),sub:r,i:s,j:i});for(let i of t)for(let s of t){if(i.sub!=="A"||s.sub!=="B"||Math.abs(Math.hypot(i.x-s.x,i.y-s.y)-e)>1e-8)continue;let r=n.line(`A(${i.i},${i.j})\u2013B(${s.i},${s.j}) nearest-neighbor bond`,[[i.x,i.y],[s.x,s.y]],P.muted,1.6);Object.assign(r.properties,{diagramRole:"nearest-neighbor bond",fromSite:`A(${i.i},${i.j})`,toSite:`B(${s.i},${s.j})`})}for(let i of t){let s=n.dot(`${i.sub}(${i.i},${i.j}) site`,i.x,i.y,5.5,i.sub==="A"?P.blue:P.red);Object.assign(s.properties,{diagramRole:"lattice site",sublattice:i.sub,latticeIndex:[i.i,i.j]})}return n.label("A sublattice legend","A",-38,92,16,P.blue),n.label("B sublattice legend","B",8,92,16,P.red),n.finish("Honeycomb lattice (A/B)",lr,"Finite graphene-like patch with two triangular A/B sublattices and equal-length nearest-neighbor bonds. Edge sites have fewer neighbors. Geometry only; no hopping values or electronic state are implied.",[nm])}function Kp(n){let e=new Ae(`builtin.science.matter.${n?"triangular":"square"}`),t=[];for(let i=0;i<3;i++)for(let s=0;s<4;s++)t.push({x:40*(s-1.5+(n?(i-1)/2:0)),y:40*(i-1)*(n?Math.sqrt(3)/2:1),i:s,j:i});t.forEach((i,s)=>{for(let r of t.slice(s+1))Math.abs(Math.hypot(i.x-r.x,i.y-r.y)-40)<1e-8&&e.line(`Bond (${i.i},${i.j})\u2013(${r.i},${r.j})`,[[i.x,i.y],[r.x,r.y]],P.muted,1.5)});for(let i of t)Object.assign(e.dot(`Site (${i.i},${i.j})`,i.x,i.y).properties,{diagramRole:"lattice site",latticeIndex:[i.i,i.j]});return e.finish(n?"Triangular lattice":"Square lattice",lr,`Finite ${n?"triangular":"square"} Bravais lattice with one site per primitive cell and nearest-neighbor links. Spacing is a drawing unit; bonds represent connectivity, not a solved Hamiltonian.`,[tm])}function Db(){let n=new Ae("builtin.science.matter.hexagonal-bz"),e=Array.from({length:6},(r,o)=>[85*Math.cos(o*Math.PI/3),85*Math.sin(o*Math.PI/3)]);n.add("path","First Brillouin zone boundary",[0,0,0],{d:`M ${e.map(r=>r.join(" ")).join(" L ")} Z`,fill:P.pale,stroke:P.blue,strokeWidth:2,diagramRole:"reciprocal-space boundary"});let t=e[0],i=e[1],s=[(t[0]+i[0])/2,(t[1]+i[1])/2];return n.line("\u0393\u2013K\u2013M\u2013\u0393 path",[[0,0],t,s,[0,0]],P.red,2),n.dot("\u0393 point",0,0,4,P.ink),n.label("\u0393 label","\u0393",-13,-10,18),n.dot("K corner",t[0],t[1],4,P.red),n.label("K label","K",t[0]+14,5,16),n.dot("K prime corner",i[0],i[1],4,P.teal),n.label("K prime label","K\u2032",i[0]+6,i[1]+24,16),n.dot("M edge midpoint",s[0],s[1],4,P.gold),n.label("M label","M",s[0]+18,s[1]+5,16),n.finish("Hexagonal Brillouin zone",lr,"Reciprocal-space schematic for a triangular Bravais lattice (including graphene): \u0393 at the center, inequivalent K/K\u2032 corners, and M at an edge midpoint. The highlighted path is editable; no dispersion or material-specific reciprocal scale is supplied.",[nm,Rs("Topology in Condensed Matter: graphene Brillouin zone","https://topocondmat.org/test/w4_haldane-haldane_model.html")])}function Qp(n){let e=new Ae(`builtin.science.matter.${n?"antiferromagnet":"ferromagnet"}`);e.line("Spin-chain reference line",[[-100,0],[100,0]],P.muted,1);for(let t=0;t<6;t++){let i=-100+40*t,s=n&&t%2?-1:1,r=e.dot(`Spin site ${t+1}`,i,0,5,s===1?P.blue:P.red);Object.assign(r.properties,{diagramRole:"spin site",spinDirection:[0,s,0]}),e.arrow(`Spin ${t+1} (${s===1?"up":"down"})`,[i,s*18],[i,-s*32],s===1?P.blue:P.red,2.5)}return e.finish(n?"Antiferromagnetic spin chain":"Ferromagnetic spin chain",lr,`${n?"Alternating equal collinear moments (N\xE9el pattern)":"Parallel collinear moments within one domain"}. Arrows depict moment orientation, not electron trajectories. This is an illustrative ordering pattern, not a prediction of a finite-temperature phase.`,[Pb])}function Nb(){let n=new Ae("builtin.science.matter.simple-cubic","3d");for(let e=-1;e<=1;e++)for(let t=-1;t<=1;t++)for(let i=-1;i<=1;i++){n.add("sphere",`Site (${e},${t},${i})`,[e,t,i],{radius:.13,fill:P.blue,diagramRole:"lattice site",latticeIndex:[e,t,i]});for(let s=0;s<3;s++){let r=[e,t,i];r[s]!==1&&(r[s]+=.5,n.add("cylinder",`Nearest-neighbor link (${e},${t},${i}) axis ${s}`,r,{radius:.035,height:1,fill:"#96a9bf",diagramRole:"nearest-neighbor bond"},s===0?[0,0,Math.PI/2]:s===2?[Math.PI/2,0,0]:[0,0,0]))}}return n.finish("Simple cubic lattice",lr,"3\xD73\xD73 simple-cubic patch with 27 sites and 54 equal nearest-neighbor links. Coordinates are schematic and do not identify a particular crystal, orbital, or interaction.",[tm])}function Ob(){let n=new Ae("builtin.science.matter.layered-device","3d"),e=(t,i,s,r,o,a=5,l=3)=>n.add("box",t,[0,i,0],{width:a,height:s,depth:l,fill:r,diagramRole:o});return e("Back gate",-.38,.12,P.ink,"gate electrode"),e("Dielectric substrate",-.15,.34,"#b7c9dc","dielectric"),e("Bottom encapsulation",.08,.12,"#a5dbcf","encapsulation"),e("2D active material",.165,.05,P.blue,"active material",4.4,2.5),e("Top encapsulation",.23,.08,"#a5dbcf","encapsulation",2.8,2.5),n.add("box","Source contact",[-1.95,.26,0],{width:1,height:.2,depth:2.7,fill:P.gold,diagramRole:"source electrode"}),n.add("box","Drain contact",[1.95,.26,0],{width:1,height:.2,depth:2.7,fill:P.gold,diagramRole:"drain electrode"}),n.finish("Layered material device",lr,"Generic gate/dielectric/encapsulation/2D-channel stack with source and drain contacts. Layer names retain their device roles. Thicknesses are exaggerated for drawing; no specific material, fabrication recipe, or transport result is implied.",[Rs("Geim and Grigorieva: Van der Waals heterostructures (2013)","https://arxiv.org/abs/1307.6718")])}function Ub(){let n=new Ae("builtin.science.matter.band-gap");return n.arrow("Energy axis",[-65,65],[-65,-65]),n.label("Energy label","E",-66,-78,16),n.add("rect","Conduction band",[-42,-56,0],{width:135,height:24,fill:P.pale,stroke:P.blue,diagramRole:"conduction band"}),n.add("rect","Valence band",[-42,22,0],{width:135,height:28,fill:"#b5d4ee",stroke:P.blue,diagramRole:"valence band"}),n.label("Conduction label","CB",26,-38,13),n.label("Valence label","VB",26,41,13),n.line("Gap bracket",[[102,-32],[112,-32],[112,22],[102,22]],P.red),n.label("Gap label","Eg",132,1,14,P.red),n.finish("Band-gap schematic",lr,"Valence and conduction bands separated by a symbolic energy gap Eg. Band rectangles are a conceptual level diagram, not an E(k) dispersion, density of states, measured gap, or specified filling.",[Rs("OpenStax: Band Theory of Solids","https://openstax.org/books/university-physics-volume-3/pages/9-5-band-theory-of-solids")])}function Fb(){let n=new Ae("builtin.science.physics.mass-spring");n.line("Fixed wall",[[-85,-25],[-85,25]],P.ink,3);for(let t=-2;t<=2;t++)n.line(`Wall hatch ${t}`,[[-85,t*10],[-94,t*10+8]],P.muted,1.3);let e=[[-85,0],[-68,0]];for(let t=0;t<9;t++)e.push([-62+t*9,t%2?-12:12]);return e.push([18,0],[35,0]),n.line("Spring",e,P.blue,2),n.add("rect","Oscillating mass",[35,-22,0],{width:45,height:44,fill:P.pale,stroke:P.blue,diagramRole:"mass"}),n.label("Mass label","m",57,5,16),n.label("Spring label","k",-20,-22,16),n.arrow("Displacement direction",[35,40],[82,40]),n.label("Displacement label","x",90,45,14),n.finish("Mass\u2013spring oscillator","Physics","Horizontal mass and spring with fixed support and displacement direction. m and k are symbolic editable labels; no damping or trajectory is calculated.",[Rs("OpenStax: Simple Harmonic Motion","https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion")])}function em(n){let e=new Ae(`builtin.science.physics.field-${n?"out":"in"}`);for(let t=0;t<2;t++)for(let i=0;i<3;i++){let s=i*40-40,r=t*40-20;e.add("ellipse",`Field marker (${i},${t})`,[s-10,r-10,0],{width:20,height:20,fill:P.white,stroke:P.blue,diagramRole:"magnetic field",fieldDirection:n?"out of page":"into page"}),n?e.dot(`Out-of-page dot (${i},${t})`,s,r,2.5,P.blue):(e.line(`Into-page cross 1 (${i},${t})`,[[s-5,r-5],[s+5,r+5]],P.blue),e.line(`Into-page cross 2 (${i},${t})`,[[s-5,r+5],[s+5,r-5]],P.blue))}return e.label("Field label",n?"B: out of page":"B: into page",0,55,13),e.finish(n?"Magnetic field (out of page)":"Magnetic field (into page)","Physics","Dot/cross notation for a perpendicular magnetic field. Marker positions and density are illustrative; they do not specify field magnitude or a computed field map.",[Rs("OpenStax: Magnetic Fields and Lines","https://openstax.org/books/university-physics-volume-2/pages/11-2-magnetic-fields-and-lines")])}function im(){return[Lb(),Kp(!1),Kp(!0),Db(),Qp(!1),Qp(!0),Nb(),Ob(),Ub(),Fb(),em(!0),em(!1)]}var Ac={title:"TorchOptics elements guide",url:"https://torchoptics.readthedocs.io/en/latest/user-guide/elements.html",kind:"concept"},kb={title:"OpenStax University Physics: Lasers",url:"https://openstax.org/books/university-physics-volume-3/pages/8-6-lasers",kind:"concept"},Bb={title:"OpenStax University Physics: Plane mirrors",url:"https://openstax.org/books/university-physics-volume-3/pages/2-1-images-formed-by-plane-mirrors",kind:"concept"},zb={title:"OpenStax University Physics: Semiconductor devices",url:"https://openstax.org/books/university-physics-volume-3/pages/9-7-semiconductor-devices",kind:"concept"},Vb={title:"Schemdraw two-terminal electrical elements",url:"https://raw.githubusercontent.com/cdelker/schemdraw/master/schemdraw/elements/twoterm.py",kind:"adapted",license:"MIT"},Hb={title:"Schemdraw source symbols",url:"https://raw.githubusercontent.com/cdelker/schemdraw/master/schemdraw/elements/sources.py",kind:"concept"},Gb={title:"Schemdraw one-terminal symbols",url:"https://raw.githubusercontent.com/cdelker/schemdraw/master/schemdraw/elements/oneterm.py",kind:"concept"},qu=[Ac],Rc=[Vb];function Rt(n,e,t,i,s){let r=n.dot(e,t,i,4,P.blue);Object.assign(r.properties,{diagramRole:"terminal",terminalRole:s})}function Sn(n,e,t,i,s,r=P.ink){n.label(e,t,i,s,14,r)}function Vn(n,e,t,i,s){return n.finish(e,t,`${i} Schematic geometry only; this component does not simulate or calculate physical behavior.`,s)}function Wb(){let n=new Ae("builtin.science.optics.laser-source");return n.add("rect","Laser housing",[18,35,0],{width:72,height:46,fill:P.pale,stroke:P.blue,diagramRole:"optical-source"}),n.add("ellipse","Laser aperture",[88,47,0],{width:14,height:22,fill:P.red,stroke:P.ink,diagramRole:"aperture"}),n.arrow("Output beam",[100,58],[174,58],P.red,3),Sn(n,"Laser label","LASER",54,63),Rt(n,"Optical output",174,58,"optical-output"),Vn(n,"Laser source","Optics","An editable laser source symbol with a directional optical output.",[Ac,kb])}function Xb(){let n=new Ae("builtin.science.optics.convex-lens");return n.line("Optical axis",[[12,58],[180,58]],P.muted,1),n.add("ellipse","Convex lens",[86,23,0],{width:24,height:70,fill:P.pale,stroke:P.blue,strokeWidth:3,diagramRole:"lens"}),Sn(n,"Lens label","L",98,63,P.blue),Rt(n,"Lens input",12,58,"optical-input"),Rt(n,"Lens output",180,58,"optical-output"),Vn(n,"Convex lens","Optics","A compact biconvex lens symbol with optical axis and editable label.",qu)}function $b(){let n=new Ae("builtin.science.optics.plane-mirror-45");n.line("Incident axis",[[12,88],[94,88]],P.muted,1),n.line("Reflected axis",[[94,88],[94,18]],P.muted,1),n.line("Mirror surface",[[86,96],[114,68]],P.ink,6);for(let e=0;e<5;e++)n.line(`Mirror hatch ${e+1}`,[[90+e*5,92-e*5],[96+e*5,98-e*5]],P.blue,1);return Sn(n,"Mirror label","M 45\xB0",52,120),Rt(n,"Mirror input",12,88,"optical-input"),Rt(n,"Mirror output",94,18,"optical-output"),Vn(n,"45\xB0 plane mirror","Optics","An editable diagonal plane mirror symbol showing incident and reflected paths.",[Ac,Bb])}function qb(){let n=new Ae("builtin.science.optics.cube-beam-splitter");return n.add("rect","Splitter cube",[72,30,0],{width:58,height:58,fill:P.pale,stroke:P.blue,strokeWidth:2,diagramRole:"beam-splitter"}),n.line("Splitter diagonal",[[72,88],[130,30]],P.red,3),n.arrow("Incident beam",[18,59],[72,59],P.red,2),n.arrow("Transmitted beam",[130,59],[184,59],P.red,2),n.arrow("Reflected beam",[101,30],[101,8],P.red,2),Sn(n,"Splitter label","BS",101,106),Rt(n,"Splitter input",18,59,"optical-input"),Rt(n,"Splitter through",184,59,"optical-output"),Rt(n,"Splitter reflected",101,8,"optical-output"),Vn(n,"Cube beam splitter","Optics","A cube beam splitter with three editable optical terminals.",qu)}function Yb(){let n=new Ae("builtin.science.optics.wave-plate");return n.line("Wave axis",[[12,58],[180,58]],P.muted,1),n.add("rect","Wave plate",[78,24,0],{width:46,height:68,fill:"#f7edcf",stroke:P.gold,strokeWidth:3,diagramRole:"wave-plate"}),n.line("Fast axis",[[84,84],[118,32]],P.gold,2),Sn(n,"Wave plate label","\u03BB/2",101,112,P.gold),Rt(n,"Wave plate input",12,58,"optical-input"),Rt(n,"Wave plate output",180,58,"optical-output"),Vn(n,"Wave plate","Optics","An editable retardance plate symbol with a marked fast-axis convention.",qu)}function Zb(){let n=new Ae("builtin.science.optics.photodetector");return n.add("rect","Detector body",[62,30,0],{width:76,height:56,fill:P.pale,stroke:P.blue,diagramRole:"photodetector"}),n.line("Detector sensing mark",[[78,72],[102,48],[122,72]],P.red,3),n.arrow("Detector beam",[12,58],[62,58],P.red,2),Sn(n,"Detector label","PD",100,107),Rt(n,"Detector input",12,58,"optical-input"),Rt(n,"Detector output",176,58,"electrical-output"),n.line("Electrical lead",[[138,58],[176,58]],P.ink,2),Vn(n,"Photodetector","Optics","An editable photodetector symbol with optical input and electrical output terminals.",[Ac,zb])}function jb(){let n=new Ae("builtin.science.electrical.resistor");return n.line("Resistor lead in",[[10,58],[38,58]]),n.line("Resistor lead out",[[122,58],[164,58]]),n.line("IEEE resistor body",[[38,58],[48,42],[62,74],[76,42],[90,74],[104,42],[122,58]],P.blue,3),Sn(n,"Resistor label","R",80,104),Rt(n,"Resistor input",10,58,"terminal-1"),Rt(n,"Resistor output",164,58,"terminal-2"),Vn(n,"Resistor (IEEE)","Electrical","An editable IEEE zigzag resistor symbol with two terminals.",Rc)}function Jb(){let n=new Ae("builtin.science.electrical.capacitor");return n.line("Capacitor lead in",[[10,58],[74,58]]),n.line("Capacitor lead out",[[86,58],[164,58]]),n.line("Capacitor plate one",[[74,36],[74,80]],P.blue,4),n.line("Capacitor plate two",[[86,36],[86,80]],P.blue,4),Sn(n,"Capacitor label","C",80,104),Rt(n,"Capacitor input",10,58,"terminal-1"),Rt(n,"Capacitor output",164,58,"terminal-2"),Vn(n,"Capacitor","Electrical","An editable parallel-plate capacitor symbol with two terminals.",Rc)}function Kb(){let n=new Ae("builtin.science.electrical.inductor");return n.line("Inductor lead in",[[10,58],[38,58]]),n.line("Inductor lead out",[[122,58],[164,58]]),n.add("path","Inductor coil",[0,0,0],{d:"M 38 58 a 10.5 16 0 0 1 21 0 a 10.5 16 0 0 1 21 0 a 10.5 16 0 0 1 21 0 a 10.5 16 0 0 1 21 0",fill:"none",stroke:P.blue,strokeWidth:3,diagramRole:"coil"}),Sn(n,"Inductor label","L",80,104),Rt(n,"Inductor input",10,58,"terminal-1"),Rt(n,"Inductor output",164,58,"terminal-2"),Vn(n,"Inductor","Electrical","An editable four-turn inductor symbol with two terminals.",Rc)}function Qb(){let n=new Ae("builtin.science.electrical.diode");return n.line("Diode lead in",[[10,58],[68,58]]),n.line("Diode lead out",[[92,58],[164,58]]),n.line("Anode triangle",[[68,34],[68,82],[92,58],[68,34]],P.blue,3),n.line("Cathode bar",[[92,32],[92,84]],P.red,4),Sn(n,"Diode label","D",80,108),Rt(n,"Anode",10,58,"anode"),Rt(n,"Cathode",164,58,"cathode"),Vn(n,"Diode","Electrical","An editable diode convention: triangle anode marker and red cathode bar.",Rc)}function eM(){let n=new Ae("builtin.science.electrical.dc-voltage-source");return n.line("Source lead in",[[10,58],[74,58]]),n.line("Source lead out",[[86,58],[164,58]]),n.line("Positive plate",[[74,34],[74,82]],P.red,4),n.line("Negative plate",[[86,44],[86,72]],P.blue,4),Sn(n,"Positive mark","+",74,25,P.red),Sn(n,"Negative mark","\u2212",86,98,P.blue),Sn(n,"Source label","VDC",80,122),Rt(n,"Positive terminal",10,58,"positive"),Rt(n,"Negative terminal",164,58,"negative"),Vn(n,"DC voltage source","Electrical","An editable DC source symbol with explicit positive and negative terminals.",[Hb])}function tM(){let n=new Ae("builtin.science.electrical.ground");return n.line("Ground stem",[[80,12],[80,58]],P.ink,3),n.line("Ground bar",[[56,58],[104,58]],P.ink,3),n.line("Ground bar two",[[64,68],[96,68]],P.ink,3),n.line("Ground bar three",[[72,78],[88,78]],P.ink,3),Sn(n,"Ground label","GND",80,104),Rt(n,"Ground terminal",80,12,"ground"),Vn(n,"Ground","Electrical","An editable electrical ground reference symbol.",[Gb])}function sm(){return[Wb(),Xb(),$b(),qb(),Yb(),Zb(),jb(),Jb(),Kb(),Qb(),eM(),tM()]}var rm={title:"Schemdraw two-terminal elements",url:"https://raw.githubusercontent.com/cdelker/schemdraw/master/schemdraw/elements/twoterm.py",kind:"adapted",license:"MIT"},nM={title:"Schemdraw transistor elements",url:"https://raw.githubusercontent.com/cdelker/schemdraw/master/schemdraw/elements/transistors.py",kind:"adapted",license:"MIT"},iM={title:"Schemdraw op-amp elements",url:"https://raw.githubusercontent.com/cdelker/schemdraw/master/schemdraw/elements/opamp.py",kind:"adapted",license:"MIT"},sM={title:"Schemdraw switch elements",url:"https://raw.githubusercontent.com/cdelker/schemdraw/master/schemdraw/elements/switches.py",kind:"adapted",license:"MIT"},rM={title:"Schemdraw source elements",url:"https://raw.githubusercontent.com/cdelker/schemdraw/master/schemdraw/elements/sources.py",kind:"adapted",license:"MIT"},oM={title:"OpenStax University Physics: Dispersion",url:"https://openstax.org/books/university-physics-volume-3/pages/1-5-dispersion",kind:"concept"},aM={title:"OpenStax University Physics: Diffraction gratings",url:"https://openstax.org/books/university-physics-volume-3/pages/4-4-diffraction-gratings",kind:"concept"},om={title:"OpenStax University Physics: Refraction",url:"https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction",kind:"concept"},am={title:"TorchOptics elements guide",url:"https://torchoptics.readthedocs.io/en/latest/user-guide/elements.html",kind:"concept"};function Hn(n,e,t,i,s){return n.finish(e,t,`${i} Schematic geometry only; this component does not simulate or calculate physical behavior.`,s)}function ct(n,e,t,i,s){let r=n.dot(e,t,i,4,P.blue);Object.assign(r.properties,{diagramRole:"terminal",terminalRole:s})}function un(n,e,t,i,s,r=P.ink){n.label(e,t,i,s,14,r)}function lM(){let n=new Ae("builtin.science.optics.concave-lens");n.line("Optical axis",[[10,58],[182,58]],P.muted,1),n.add("path","Concave lens left surface",[0,0,0],{d:"M 78 22 Q 96 58 78 94",fill:"none",stroke:P.blue,strokeWidth:4,diagramRole:"lens-surface"}),n.add("path","Concave lens right surface",[0,0,0],{d:"M 114 22 Q 96 58 114 94",fill:"none",stroke:P.blue,strokeWidth:4,diagramRole:"lens-surface"});let e=n.line("Concave lens top edge",[[78,22],[114,22]],P.blue,4),t=n.line("Concave lens bottom edge",[[78,94],[114,94]],P.blue,4);return e.properties.diagramRole="lens-edge",t.properties.diagramRole="lens-edge",un(n,"Lens label","L",96,112,P.blue),ct(n,"Lens input",10,58,"optical-input"),ct(n,"Lens output",182,58,"optical-output"),Hn(n,"Concave lens","Optics","A compact biconcave lens symbol with optical input and output terminals.",[om])}function cM(){let n=new Ae("builtin.science.optics.prism");return n.add("polyline","Prism body",[0,0,0],{points:[[72,20],[132,92],[28,92],[72,20]],fill:P.pale,stroke:P.blue,strokeWidth:3,diagramRole:"prism"}),n.arrow("Incident ray",[8,92],[38,78],P.red,2),n.arrow("Red output ray",[108,66],[176,42],P.red,2),n.arrow("Violet output ray",[112,76],[176,92],"#7956b3",2),un(n,"Prism label","PRISM",72,112,P.blue),ct(n,"Prism input",8,92,"optical-input"),ct(n,"Prism red output",176,42,"optical-output"),ct(n,"Prism violet output",176,92,"optical-output"),Hn(n,"Prism","Optics","A triangular prism with editable incident and dispersed ray paths.",[oM])}function hM(){let n=new Ae("builtin.science.optics.diffraction-grating");n.add("rect","Grating substrate",[82,24,0],{width:18,height:68,fill:P.pale,stroke:P.blue,strokeWidth:2,diagramRole:"diffraction-grating"});for(let e=0;e<7;e++)n.line(`Grating groove ${e+1}`,[[86+e*2,28],[86+e*2,88]],P.muted,1);return n.arrow("Incident beam",[10,58],[82,58],P.red,2),n.arrow("Zero order beam",[100,58],[172,58],P.red,2),n.arrow("First order positive",[100,58],[172,24],P.red,2),n.arrow("First order negative",[100,58],[172,92],P.red,2),un(n,"Grating label","d",91,110,P.blue),ct(n,"Grating input",10,58,"optical-input"),ct(n,"Zero order output",172,58,"optical-output"),ct(n,"Positive diffraction output",172,24,"optical-output"),ct(n,"Negative diffraction output",172,92,"optical-output"),Hn(n,"Diffraction grating","Optics","A ruled grating symbol with editable zero and first-order ray paths.",[aM])}function uM(){let n=new Ae("builtin.science.optics.iris-aperture");return n.line("Iris axis",[[10,58],[182,58]],P.muted,1),n.add("path","Upper aperture blade",[0,0,0],{d:"M 70 22 L 96 48 L 122 22",fill:"none",stroke:P.blue,strokeWidth:3,diagramRole:"aperture-blade"}),n.add("path","Lower aperture blade",[0,0,0],{d:"M 70 94 L 96 68 L 122 94",fill:"none",stroke:P.blue,strokeWidth:3,diagramRole:"aperture-blade"}),un(n,"Iris label","A",96,112,P.blue),ct(n,"Iris input",10,58,"optical-input"),ct(n,"Iris output",182,58,"optical-output"),Hn(n,"Iris / aperture","Optics","An adjustable-aperture symbol with opposing editable blades.",[am])}function dM(){let n=new Ae("builtin.science.optics.linear-polarizer");return n.line("Polarizer axis",[[10,58],[182,58]],P.muted,1),n.add("rect","Polarizer body",[76,22,0],{width:40,height:72,fill:"#f7edcf",stroke:P.gold,strokeWidth:3,diagramRole:"polarizer"}),n.line("Transmission axis",[[82,86],[110,30]],P.gold,3),un(n,"Polarizer label","P",96,112,P.gold),ct(n,"Polarizer input",10,58,"optical-input"),ct(n,"Polarizer output",182,58,"optical-output"),Hn(n,"Linear polarizer","Optics","A linear polarizer symbol with an editable transmission axis.",[am])}function fM(){let n=new Ae("builtin.science.optics.optical-fiber");return n.add("rect","Fiber cladding",[34,40,0],{width:128,height:36,fill:P.pale,stroke:P.blue,strokeWidth:3,diagramRole:"fiber-cladding"}),n.add("rect","Fiber core",[34,49,0],{width:128,height:18,fill:"#dbeafe",stroke:P.teal,strokeWidth:2,diagramRole:"fiber-core"}),n.arrow("Guided light",[10,58],[34,58],P.red,2),n.arrow("Guided output",[162,58],[188,58],P.red,2),un(n,"Fiber label","CORE",98,104,P.teal),ct(n,"Fiber input",10,58,"optical-input"),ct(n,"Fiber output",188,58,"optical-output"),Hn(n,"Optical fiber","Optics","A compact core-and-cladding fiber symbol with directional light paths.",[om])}function pM(){let n=new Ae("builtin.science.electrical.led");return n.line("LED lead in",[[10,58],[68,58]]),n.line("LED lead out",[[92,58],[166,58]]),n.line("LED triangle",[[68,34],[68,82],[92,58],[68,34]],P.blue,3),n.line("LED cathode bar",[[92,32],[92,84]],P.red,4),n.arrow("Emission arrow one",[108,42],[124,24],P.gold,2),n.arrow("Emission arrow two",[118,54],[136,36],P.gold,2),un(n,"LED label","LED",80,108,P.gold),ct(n,"LED anode",10,58,"anode"),ct(n,"LED cathode",166,58,"cathode"),Hn(n,"LED","Electrical","An LED diode symbol with emission arrows pointing away from the junction.",[rm])}function mM(){let n=new Ae("builtin.science.electrical.photodiode");return n.line("Photodiode lead in",[[10,58],[68,58]]),n.line("Photodiode lead out",[[92,58],[166,58]]),n.line("Photodiode triangle",[[68,34],[68,82],[92,58],[68,34]],P.blue,3),n.line("Photodiode cathode bar",[[92,32],[92,84]],P.red,4),n.arrow("Incident light one",[44,18],[60,38],P.gold,2),n.arrow("Incident light two",[62,10],[72,34],P.gold,2),un(n,"Photodiode label","PD",80,108,P.blue),ct(n,"Photodiode anode",10,58,"anode"),ct(n,"Photodiode cathode",166,58,"cathode"),Hn(n,"Photodiode","Electrical","A photodiode symbol with incident-light arrows pointing toward the junction.",[rm])}function gM(){let n=new Ae("builtin.science.electrical.operational-amplifier");return n.add("polyline","Op amp body",[0,0,0],{points:[[70,20],[70,96],[142,58],[70,20]],fill:P.pale,stroke:P.blue,strokeWidth:3,diagramRole:"op-amp-body"}),n.line("Inverting input lead",[[10,40],[70,40]],P.ink,2),n.line("Non-inverting input lead",[[10,76],[70,76]],P.ink,2),n.line("Output lead",[[142,58],[184,58]],P.ink,2),un(n,"Minus input","\u2212",78,45,P.red),un(n,"Plus input","+",78,82,P.teal),un(n,"Op amp label","A",108,64,P.blue),ct(n,"Inverting input",10,40,"inverting-input"),ct(n,"Non-inverting input",10,76,"non-inverting-input"),ct(n,"Op amp output",184,58,"output"),Hn(n,"Operational amplifier","Electrical","An editable op-amp triangle with explicit inverting, non-inverting and output terminals.",[iM])}function yM(){let n=new Ae("builtin.science.electrical.npn-transistor");return n.line("Base lead",[[10,58],[78,58]],P.ink,2),n.line("Transistor base",[[78,26],[78,90]],P.blue,4),n.line("Collector lead",[[78,38],[132,18]],P.ink,2),n.line("Emitter lead",[[78,78],[132,98]],P.ink,2),n.arrow("Emitter arrow",[107.7,89],[121.2,94],P.red,2),un(n,"NPN label","NPN",100,116,P.blue),ct(n,"Base",10,58,"base"),ct(n,"Collector",132,18,"collector"),ct(n,"Emitter",132,98,"emitter"),Hn(n,"NPN transistor","Electrical","An NPN transistor symbol with an emitter arrow pointing away from the base.",[nM])}function xM(){let n=new Ae("builtin.science.electrical.switch-open");return n.line("Switch lead in",[[10,58],[68,58]],P.ink,2),n.line("Switch lead out",[[108,58],[166,58]],P.ink,2),n.dot("Open contact one",68,58,5,P.blue).properties.diagramRole="switch-contact",n.dot("Open contact two",108,58,5,P.blue).properties.diagramRole="switch-contact",n.line("Open switch blade",[[68,58],[100,30]],P.red,4),un(n,"Switch label","SW",88,92,P.blue),ct(n,"Switch terminal one",10,58,"terminal-1"),ct(n,"Switch terminal two",166,58,"terminal-2"),Hn(n,"Switch (open)","Electrical","An open switch symbol with a visible gap between contacts.",[sM])}function _M(){let n=new Ae("builtin.science.electrical.battery");return n.line("Battery lead in",[[10,58],[70,58]],P.ink,2),n.line("First positive long plate",[[70,26],[70,90]],P.red,4),n.line("First negative short plate",[[82,40],[82,76]],P.blue,4),n.line("Intercell connection",[[82,58],[106,58]],P.ink,2),n.line("Second positive long plate",[[106,26],[106,90]],P.red,4),n.line("Second negative short plate",[[118,40],[118,76]],P.blue,4),n.line("Battery lead out",[[118,58],[166,58]],P.ink,2),un(n,"Positive polarity","+",70,18,P.red),un(n,"Negative polarity","\u2212",118,104,P.blue),un(n,"Battery label","BAT",94,122,P.blue),ct(n,"Positive terminal",10,58,"positive"),ct(n,"Negative terminal",166,58,"negative"),Hn(n,"Battery","Electrical","A two-cell battery symbol with explicit positive long and negative short plates.",[rM])}function lm(){return[lM(),cM(),hM(),uM(),dM(),fM(),pM(),mM(),gM(),yM(),xM(),_M()]}var vM={title:"TI package families",url:"https://www.ti.com/design-development/packaging/find-packages.html",kind:"concept"},bM={title:"Schemdraw pictorial package elements",url:"https://schemdraw.readthedocs.io/en/stable/elements/pictorial.html",kind:"concept"},MM={title:"TI DRV5023-Q1 DBZ SOT-23 top-view pin configuration",url:"https://www.ti.com/lit/ds/slis163f/slis163f.pdf",kind:"concept"},SM={title:"TI OPA2695 QFN-16 top-view pin configuration",url:"https://www.ti.com/lit/ds/sbos354a/sbos354a.pdf",kind:"concept"},wM={title:"TI R-PQFP package mechanical drawing",url:"https://e2e.ti.com/cfs-file/__key/communityserver-discussions-components-files/73/RUG-package-information.pdf",kind:"concept"},Cc=[vM,bM];function Gn(n,e,t,i=Cc){return n.finish(e,"Electronic packages",`${t} Illustrative package diagram; dimensions and device pin functions are intentionally schematic.`,i)}function Cs(n,e,t,i,s,r,o,a,l=P.pale){n.add("rect",e,[t,i,0],{width:s,height:r,fill:l,stroke:P.ink,strokeWidth:2,diagramRole:"package body",packageType:o,view:a})}function en(n,e,t,i,s,r,o,a,l){n.add("rect",`Pin ${e}`,[t,i,0],{width:s,height:r,fill:P.gold,stroke:P.ink,strokeWidth:1,diagramRole:"package pin",pinNumber:e,packageType:o,view:a,...l?{side:l}:{}})}function Is(n,e,t,i,s){n.label(e,t,i,s,13,P.ink)}function Ic(n,e,t,i,s,r){n.add("ellipse",e,[t,i,0],{width:12,height:12,fill:P.red,stroke:P.ink,diagramRole:"pin 1 marker",packageType:s,view:r})}function EM(n,e){let t=new Ae(n),i=`DIP-${e}`,s=e/2;Cs(t,`${i} body`,48,24,104,130,i,"top"),Ic(t,"Pin 1 marker",58,34,i,"top");for(let r=0;r<s;r++)en(t,r+1,26,36+r*24,22,10,i,"top","left");for(let r=0;r<s;r++)en(t,e-r,152,36+r*24,22,10,i,"top","right");return Is(t,`${i} label`,i,100,94),Gn(t,i,`Top-view ${i}; pin 1 starts at the marked upper-left corner, pins 1\u2013${s} descend left and ${s+1}\u2013${e} ascend right. No signal assignment is implied.`)}function TM(){let n=new Ae("builtin.science.packages.soic-8"),e="SOIC-8";Cs(n,"SOIC-8 body",48,28,104,112,e,"top"),Ic(n,"Pin 1 marker",58,38,e,"top");for(let t=0;t<4;t++)en(n,t+1,26,42+t*22,22,8,e,"top","left"),en(n,8-t,152,42+t*22,22,8,e,"top","right");return Is(n,"SOIC label","SOIC-8",100,96),Gn(n,"SOIC-8","Top-view SOIC-8 with opposite-side leads and a pin 1 marker. Pin numbering is generic and carries no device signal map.")}function cm(n,e,t,i){let s=new Ae(n),r=`${e}-${t}`,o=t/4;Cs(s,`${r} body`,52,34,96,96,r,"top",i?"#e5edf2":P.pale),Ic(s,"Pin 1 marker",62,44,r,"top");for(let a=0;a<o;a++)en(s,a+1,36,52+a*(60/(o-1)),16,i?7:9,r,"top","left");for(let a=0;a<o;a++)en(s,o+a+1,56+a*(80/(o-1)),130,i?7:9,16,r,"top","bottom");for(let a=0;a<o;a++)en(s,o*2+a+1,148,112-a*(60/(o-1)),16,i?7:9,r,"top","right");for(let a=0;a<o;a++)en(s,o*3+a+1,136-a*(80/(o-1)),18,i?7:9,16,r,"top","top");return Is(s,`${r} label`,r,100,86),Gn(s,r,`Top-view ${r} with ${o} evenly distributed pins per side, numbered counterclockwise from the pin 1 marker. The exposed underside pad of QFN is intentionally not shown from the top.`,i?[...Cc,SM]:[...Cc,wM])}function AM(){let n=new Ae("builtin.science.packages.sot-23"),e="SOT-23";return Cs(n,"SOT-23 body",54,36,92,72,e,"top"),Ic(n,"Pin 1 marker",62,44,e,"top"),en(n,1,28,48,26,10,e,"top","left"),en(n,2,28,88,26,10,e,"top","left"),en(n,3,146,68,26,10,e,"top","right"),Is(n,"SOT-23 label","SOT-23",100,78),Gn(n,e,"Generic 3-pin SOT-23 top view following the cited DBZ outline orientation; device-specific function assignments are not implied.",[...Cc,MM])}function hm(n){let e=new Ae(`builtin.science.packages.${n.toLowerCase()}`),t=n==="TO-92"?86:122,i=n==="TO-92"?58:40;Cs(e,`${n} body`,i,30,t,72,n,"front",n==="TO-220"?"#dce7ed":P.pale),n==="TO-220"&&e.add("rect","Mounting tab",[i+18,20,0],{width:t-36,height:16,fill:P.muted,stroke:P.ink,diagramRole:"package tab",packageType:n,view:"front"});for(let s=0;s<3;s++)en(e,s+1,i+16+s*((t-32)/2),102,10,28,n,"front","front");return Is(e,`${n} label`,n,100,72),Gn(e,n,n==="TO-220"?"Generic front-view TO-220 with three numeric pins left to right. The tab is a mechanical/thermal feature whose electrical connection is device-specific; pin functions are deliberately unspecified.":"Generic front-view TO-92 with three numeric pins left to right; device-specific function assignments are not implied.")}function RM(){let n=new Ae("builtin.science.packages.0603-passive"),e="0603";return Cs(n,"0603 ceramic body",62,44,76,32,e,"top","#e8d3a4"),en(n,1,42,50,20,20,e,"top","left"),en(n,2,138,50,20,20,e,"top","right"),Is(n,"0603 label","0603",100,92),Gn(n,e,"Representative 0603 (1608 metric) passive package top view, drawn as an illustrative symbol rather than a dimensioned footprint.")}function CM(){let n=new Ae("builtin.science.packages.axial-resistor"),e="Axial resistor";n.line("Left lead",[[12,58],[62,58]],P.ink,3),n.line("Right lead",[[138,58],[188,58]],P.ink,3),Cs(n,"Axial body",62,42,76,32,e,"top","#e8d3a4");for(let t=0;t<3;t++)n.add("rect",`Color band ${t+1}`,[78+t*16,42,0],{width:6,height:32,fill:[P.red,P.blue,P.gold][t],stroke:"none",diagramRole:"package marking",packageType:e,view:"top"});return en(n,1,2,53,10,10,e,"top","left"),en(n,2,188,53,10,10,e,"top","right"),Is(n,"Axial label","AXIAL",100,94),Gn(n,e,"Representative axial resistor package top view with two generic terminals and illustrative color bands.")}function IM(){let n=new Ae("builtin.science.packages.header-2x3"),e="2\xD73 pin header";Cs(n,"Header body",46,30,108,96,e,"top","#dce7ed");let t=1;for(let i=0;i<2;i++)for(let s=0;s<3;s++)en(n,t++,60+s*30,48+i*34,20,20,e,"top","grid");return Is(n,"Header label","2\xD73",100,146),Gn(n,e,"Generic board header numbered left-to-right on the top row then left-to-right on the bottom row; no fixed signal mapping is implied.")}function Pc(n,e,t,i,s){n.add("box",e,t,{width:i[0],height:i[1],depth:i[2],fill:P.pale,stroke:P.ink,diagramRole:"package body",packageType:s,view:"3d"})}function io(n,e,t,i,s){n.add("box",`Pin ${e}`,t,{width:i[0],height:i[1],depth:i[2],fill:P.gold,stroke:P.ink,diagramRole:"package pin",pinNumber:e,packageType:s,view:"3d"})}function PM(){let n=new Ae("builtin.science.packages.dip-8-3d","3d");Pc(n,"DIP-8 body",[0,0,0],[1.3,.5,2.4],"DIP-8"),Object.values(n.elements)[0].properties.fill="#495c75",n.add("cylinder","Pin 1 marker",[-.45,.27,-.9],{radius:.1,height:.04,fill:P.red,packageType:"DIP-8",view:"3d",diagramRole:"pin 1 marker"});for(let e=0;e<4;e++){io(n,e+1,[-.84,-.35,-.9+e*.6],[.18,.35,.12],"DIP-8"),io(n,8-e,[.84,-.35,-.9+e*.6],[.18,.35,.12],"DIP-8");for(let t of[-1,1])n.add("box",`Lead shoulder ${t<0?e+1:8-e}`,[t*.72,-.22,-.9+e*.6],{width:.32,height:.1,depth:.12,fill:P.gold,diagramRole:"lead shoulder",packageType:"DIP-8",view:"3d"})}return Gn(n,"DIP-8 (3D)","Representative 3D DIP-8 body, marker, and eight generic leads with no device signal assignment.")}function LM(){let n=new Ae("builtin.science.packages.to-220-3d","3d");Pc(n,"TO-220 body",[0,.35,0],[1.8,.9,.8],"TO-220"),Object.values(n.elements)[0].properties.fill="#495c75",n.add("box","Mounting tab",[0,1.05,-.35],{width:1.4,height:.7,depth:.12,fill:"#a2b1c4",diagramRole:"package tab",packageType:"TO-220",view:"3d"});for(let e=0;e<3;e++)io(n,e+1,[-.5+e*.5,-.35,0],[.16,.7,.12],"TO-220");return Gn(n,"TO-220 (3D)","Representative 3D TO-220 body, rear mounting tab, and three generic numeric leads. Tab connection is device-specific.")}function DM(){let n=new Ae("builtin.science.packages.0603-passive-3d","3d");return Pc(n,"0603 ceramic body",[0,.15,0],[1.1,.3,.6],"0603"),io(n,1,[-.65,.05,0],[.2,.12,.5],"0603"),io(n,2,[.65,.05,0],[.2,.12,.5],"0603"),Gn(n,"0603 passive (3D)","Representative 3D 0603 passive body with two generic end terminations.")}function NM(){let n=new Ae("builtin.science.packages.header-2x3-3d","3d");Pc(n,"Header body",[0,.1,0],[1.8,.25,1.1],"2\xD73 pin header");let e=1;for(let t=0;t<2;t++)for(let i=0;i<3;i++)io(n,e++,[-.6+i*.6,.65,-.3+t*.6],[.12,1.1,.12],"2\xD73 pin header");return Gn(n,"2\xD73 pin header (3D)","Representative 3D board header with generic numeric pins and no fixed signal mapping.")}function um(){return[EM("builtin.science.packages.dip-8",8),TM(),cm("builtin.science.packages.qfp-32","QFP",32,!1),cm("builtin.science.packages.qfn-16","QFN",16,!0),AM(),hm("TO-92"),hm("TO-220"),RM(),CM(),IM(),PM(),LM(),DM(),NM()]}var sa=(n,e)=>[{title:n,url:e,kind:"concept"}];function OM(){let n=new Ae("builtin.science.matter.kagome"),e=[],t=22,i=[[0,0],[t,0],[t/2,Math.sqrt(3)*t/2]];for(let s=0;s<3;s++)for(let r=0;r<3;r++)i.forEach(([o,a],l)=>e.push({x:t*(2*r+s-3)+o,y:Math.sqrt(3)*t*(s-1)+a,name:`${["A","B","C"][l]}(${r},${s})`,sub:l}));e.forEach((s,r)=>{for(let o of e.slice(r+1))if(Math.abs(Math.hypot(s.x-o.x,s.y-o.y)-t)<1e-8){let a=n.line(`${s.name}\u2013${o.name} bond`,[[s.x,s.y],[o.x,o.y]],P.muted,1.5);Object.assign(a.properties,{diagramRole:"nearest-neighbor bond",fromSite:s.name,toSite:o.name})}});for(let s of e)Object.assign(n.dot(s.name,s.x,s.y,4,[P.blue,P.red,P.teal][s.sub]).properties,{diagramRole:"lattice site",sublattice:["A","B","C"][s.sub]});return n.finish("Kagome lattice","Condensed matter","Finite corner-sharing triangular network with three sites per primitive cell. Links indicate nearest-neighbor connectivity; no spin state or hopping is assigned.",sa("University of Cambridge: Optical Kagome Lattice","https://www.manybody.phy.cam.ac.uk/Research/kagome"))}function dm(n){let e=new Ae(`builtin.science.matter.${n?"fcc":"bcc"}`,"3d"),t=[];for(let i of[-1,1])for(let s of[-1,1])for(let r of[-1,1])t.push([i,s,r]);for(let i of t){for(let s=0;s<3;s++)if(i[s]===-1){let r=[...i];r[s]=0,e.add("cylinder",`Cell edge ${i.join(",")} axis ${s}`,r,{radius:.018,height:2,fill:"#99aabe",diagramRole:"unit-cell edge"},s===0?[0,0,Math.PI/2]:s===2?[Math.PI/2,0,0]:[0,0,0])}e.add("sphere",`Corner site (${i.join(",")})`,i,{radius:.13,fill:P.blue,diagramRole:"lattice site",siteKind:"corner",cellWeight:1/8})}if(n)for(let i=0;i<3;i++)for(let s of[-1,1]){let r=[0,0,0];r[i]=s,e.add("sphere",`Face-center site axis ${i} ${s}`,r,{radius:.17,fill:P.teal,diagramRole:"lattice site",siteKind:"face center",cellWeight:1/2})}else e.add("sphere","Body-center site",[0,0,0],{radius:.2,fill:P.red,diagramRole:"lattice site",siteKind:"body center",cellWeight:1});return e.finish(n?"FCC unit cell":"BCC unit cell","Condensed matter",n?"Conventional face-centered cubic cell: eight corner markers and six face centers, equivalent to four sites after sharing. Cell edges are guides, not bonds. Schematic spacing.":"Conventional body-centered cubic cell: eight corner markers and one body center, equivalent to two sites after sharing. Cell edges are guides, not bonds. Schematic spacing.",sa("OpenStax: Bonding in Crystalline Solids","https://openstax.org/books/university-physics-volume-3/pages/9-3-bonding-in-crystalline-solids"))}function UM(){let n=new Ae("builtin.science.matter.josephson-junction");return n.line("Left electrode lead",[[-110,0],[-70,0]]),n.line("Right electrode lead",[[70,0],[110,0]]),n.add("rect","Left superconductor",[-70,-24,0],{width:60,height:48,fill:P.pale,stroke:P.blue,diagramRole:"superconductor"}),n.add("rect","Tunnel barrier",[-10,-24,0],{width:20,height:48,fill:"#ecd6aa",stroke:P.gold,diagramRole:"insulating barrier"}),n.add("rect","Right superconductor",[10,-24,0],{width:60,height:48,fill:P.pale,stroke:P.blue,diagramRole:"superconductor"}),n.label("Left S label","S",-40,6,17,P.blue),n.label("Insulator label","I",0,6,17,P.gold),n.label("Right S label","S",40,6,17,P.blue),n.label("Left phase label","\u03C6L",-40,-37,14),n.label("Right phase label","\u03C6R",40,-37,14),n.arrow("Current reference direction",[-35,43],[35,43],P.red),n.label("Current label","I",48,48,14,P.red),n.finish("Josephson junction (SIS)","Condensed matter","Superconductor\u2013insulator\u2013superconductor weak-link schematic with editable phase labels and a current reference arrow. Barrier thickness is exaggerated; no critical current or dynamics is calculated.",sa("NIST: Josephson voltage standards","https://nvlpubs.nist.gov/nistpubs/sp958-lide/html/315-318.html"))}function FM(){let n=new Ae("builtin.science.physics.oscillator-chain"),e=[-70,0,70];return n.line("Left fixed support",[[-130,-25],[-130,25]],P.ink,3),n.line("Right fixed support",[[130,-25],[130,25]],P.ink,3),[[-130,-84],[-56,-14],[14,56],[84,130]].forEach(([i,s],r)=>{let o=[[i,0],[i+5,0]];for(let l=0;l<7;l++)o.push([i+8+l*(s-i-16)/6,l%2?-8:8]);o.push([s-5,0],[s,0]);let a=n.line(`Spring ${r+1}`,o,P.blue,2);a.properties.diagramRole="spring"}),e.forEach((i,s)=>{n.add("rect",`Mass ${s+1}`,[i-14,-19,0],{width:28,height:38,fill:P.pale,stroke:P.blue,diagramRole:"mass"}),n.label(`Mass label ${s+1}`,`m${s+1}`,i,5,12)}),n.arrow("Displacement reference",[0,42],[28,42]),n.label("Displacement label","u2",47,47,13),n.finish("Coupled mass\u2013spring chain","Physics","Three masses connected by four springs between fixed supports. Labels and displacement reference are editable; no normal mode or material response is specified.",sa("OpenStax: Simple Harmonic Motion","https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion"))}function kM(){let n=new Ae("builtin.science.physics.bar-magnet");for(let e of[45,72])for(let t of[-1,1]){let i=e*t,s=n.add("path",`External field loop ${e} ${t}`,[0,0,0],{d:`M -60 0 C -110 0 -110 ${i} 0 ${i} C 110 ${i} 110 0 60 0`,fill:"none",stroke:P.muted,strokeWidth:1.6,diagramRole:"field-line guide",direction:"north to south outside magnet"});n.arrow(`External field direction ${s.name}`,[-12,i],[12,i],P.muted,1.6)}return n.add("rect","North pole",[-60,-20,0],{width:60,height:40,fill:"#f4b0a9",stroke:P.red,diagramRole:"magnetic pole",pole:"N"}),n.add("rect","South pole",[0,-20,0],{width:60,height:40,fill:"#a8cbed",stroke:P.blue,diagramRole:"magnetic pole",pole:"S"}),n.label("North label","N",-30,3,16),n.label("South label","S",30,3,16),n.arrow("Internal field direction",[35,13],[-35,13],P.ink,1.5),n.finish("Bar magnet and field guides","Physics","North/south bar-magnet schematic. Exterior arrows run north to south, and the interior reference runs south to north. Curves are illustrative guides, not a calculated field-strength map.",sa("OpenStax: Magnetic Fields and Lines","https://openstax.org/books/university-physics-volume-2/pages/11-2-magnetic-fields-and-lines"))}function fm(){return[OM(),dm(!1),dm(!0),UM(),FM(),kM()]}var Yu=n=>typeof n=="object"&&n!==null&&!Array.isArray(n),pm=n=>typeof n=="number"&&Number.isFinite(n);function tn(n,e){if(!n)throw new Error(e)}function BM(n){tn(Yu(n),"Component must be a JSON object."),tn(n.schema==="three-interact.component"&&n.version===1,"Expected three-interact.component version 1.");for(let t of["id","name","category"])tn(typeof n[t]=="string"&&n[t].length>0&&n[t].length<=512,`Component ${t} must be nonempty text (max 512 characters).`);if(n.description!==void 0&&tn(typeof n.description=="string"&&n.description.length<=4096,"Component description must be text (max 4096 characters)."),tn(n.mode==="2d"||n.mode==="3d","Component mode must be 2d or 3d."),n.license!==void 0&&tn(typeof n.license=="string"&&n.license.length>0&&n.license.length<=128,"Component license must be nonempty text (max 128 characters)."),n.references!==void 0){tn(Array.isArray(n.references)&&n.references.length<=8,"Component references must be an array (max 8 entries).");for(let t of n.references){tn(Yu(t)&&typeof t.title=="string"&&t.title.length>0&&t.title.length<=512,"Component reference title must be nonempty text (max 512 characters)."),tn(t.kind==="concept"||t.kind==="adapted","Component reference kind must be concept or adapted."),tn(typeof t.url=="string"&&t.url.startsWith("https://")&&!/\s/.test(t.url)&&t.url.length<=2048,"Component reference URL must be HTTPS text (max 2048 characters).");let i;try{i=new URL(t.url)}catch{throw new Error("Component reference URL must be valid HTTPS.")}tn(i.protocol==="https:"&&!!i.hostname&&!i.username&&!i.password,"Component reference URL must use HTTPS without credentials."),t.license!==void 0&&tn(typeof t.license=="string"&&t.license.length>0&&t.license.length<=128,"Component reference license must be nonempty text (max 128 characters).")}}tn(Yu(n.elements)&&Object.keys(n.elements).length>0&&Object.keys(n.elements).length<=256,"Components must contain between 1 and 256 elements.");for(let t of Object.values(n.elements))tn(t.type!=="image"&&t.type!=="viewport3d","Image and embedded viewport elements are saved in scenes rather than reusable components.");let e=ya(n.mode);e.elements=n.elements,ts(e)}function Lc(n,e,t=1){BM(n),tn(Array.isArray(e)&&e.length===3&&e.every(pm),"Component position must contain three finite numbers."),tn(pm(t)&&t>0,"Component scale must be a positive finite number."),tn(n.mode!=="2d"||e[2]===0,"2D component position must lie on the XY plane.");let i=hi("group",n.mode,br());i.name=n.name,i.transform.position=[...e],i.transform.scale=n.mode==="2d"?[t,t,1]:[t,t,t],i.properties.componentId=n.id,i.properties.componentName=n.name;let s=n.source;s!==void 0&&(i.properties.source=s),n.license&&(i.properties.componentLicense=n.license),n.references&&(i.properties.componentReferences=structuredClone(n.references));let r=Object.keys(n.elements),o=new Map(r.map(h=>[h,br()])),a=r.map(h=>{let d=structuredClone(n.elements[h]);return d.id=o.get(h),d.parent=d.parent?o.get(d.parent):i.id,d}),l=[i,...a],c=ya(n.mode);return c.elements=Object.fromEntries(l.map(h=>[h.id,h])),ts(c),{rootId:i.id,elements:l}}function zM(n,e){let t={};for(let[i,s,r,o]of e){let a=hi(i,n);a.name=s,a.transform.position=[...r],o&&Object.assign(a.properties,o),t[a.id]=a}return t}function wn(n,e,t,i,s,r){let o=zM(i,s);return{schema:"three-interact.component",version:1,id:n,name:e,category:t,description:r,mode:i,elements:o,source:"Built-in"}}function Dc(){return[wn("builtin.button","Button","Controls","2d",[["rect","Button body",[0,0,0],{width:160,height:48,fill:"#2563eb"}],["text","Button label",[48,30,0],{text:"Button",fontSize:18,fill:"#ffffff"}]],"A labelled rectangular button."),wn("builtin.card","Card","Layout","2d",[["rect","Card",[0,0,0],{width:240,height:140,fill:"#ffffff"}],["text","Card title",[20,34,0],{text:"Title",fontSize:22}],["line","Card divider",[20,52,0],{points:[[0,0],[200,0]]}]],"A compact content card with title and divider."),wn("builtin.arrow","Arrow","Connectors","2d",[["line","Arrow shaft",[0,0,0],{points:[[0,0],[120,0]],strokeWidth:3}],["polyline","Arrow head",[120,0,0],{points:[[0,-8],[0,8],[14,0]],fill:"#1e3a5f"}]],"A horizontal directional arrow."),wn("builtin.flowchart","Flowchart step","Diagrams","2d",[["rect","Step",[0,0,0],{width:170,height:72,fill:"#dbeafe"}],["text","Step label",[24,43,0],{text:"Process",fontSize:20}],["line","Connector",[85,72,0],{points:[[0,0],[0,32]]}]],"A process box with a downward connector."),wn("builtin.sensor","Sensor","Diagrams","2d",[["ellipse","Sensor body",[0,0,0],{width:100,height:72,fill:"#bbf7d0"}],["text","Sensor label",[22,43,0],{text:"S1",fontSize:18}],["line","Sensor lead",[100,36,0],{points:[[0,0],[42,0]]}]],"An instrument sensor symbol with a lead."),wn("builtin.table","Table","Layout","2d",[["rect","Table body",[0,0,0],{width:320,height:160,fill:"#f8fafc"}],["line","Header rule",[0,40,0],{points:[[0,0],[320,0]]}],["line","Column rule",[160,0,0],{points:[[0,0],[0,160]]}]],"A simple two-column table."),wn("builtin.badge","Badge","Controls","2d",[["ellipse","Badge",[0,0,0],{width:96,height:42,fill:"#fef3c7"}],["text","Badge text",[25,28,0],{text:"New",fontSize:16}]],"A compact status badge."),wn("builtin.dashboard","Dashboard panel","Layout","2d",[["rect","Panel",[0,0,0],{width:300,height:180,fill:"#eef2ff"}],["ellipse","Metric one",[70,88,0],{width:52,height:52,fill:"#4f46e5"}],["ellipse","Metric two",[150,88,0],{width:52,height:52,fill:"#0ea5e9"}],["text","Panel title",[20,30,0],{text:"Overview",fontSize:20}]],"A dashboard panel with two metric indicators."),wn("builtin.platform","Platform","Architecture","3d",[["box","Platform top",[0,.15,0],{width:4,height:.3,depth:3}],["box","Platform base",[0,-.3,0],{width:3.5,height:.6,depth:2.5}]],"A two-tier platform."),wn("builtin.table3d","Table","Furniture","3d",[["box","Table top",[0,1.4,0],{width:3,height:.2,depth:2}],["cylinder","Leg one",[-1.2,.6,-.7],{radius:.12,height:1.4}],["cylinder","Leg two",[1.2,.6,-.7],{radius:.12,height:1.4}],["cylinder","Leg three",[-1.2,.6,.7],{radius:.12,height:1.4}],["cylinder","Leg four",[1.2,.6,.7],{radius:.12,height:1.4}]],"A table with four legs."),wn("builtin.chair","Chair","Furniture","3d",[["box","Seat",[0,.9,0],{width:1.6,height:.2,depth:1.6}],["box","Back",[0,1.8,-.7],{width:1.6,height:1.8,depth:.2}],["cylinder","Front leg",[-.6,.4,.5],{radius:.1,height:1}],["cylinder","Front leg two",[.6,.4,.5],{radius:.1,height:1}]],"A simple chair."),wn("builtin.sensor3d","Sensor","Devices","3d",[["sphere","Sensor head",[0,1.2,0],{radius:.5,fill:"#22c55e"}],["cylinder","Sensor stem",[0,.4,0],{radius:.18,height:1.2}],["box","Sensor base",[0,-.3,0],{width:1.2,height:.3,depth:1.2}]],"A three-dimensional sensor assembly."),wn("builtin.robot","Robot","Devices","3d",[["box","Robot body",[0,1,0],{width:1.6,height:2,depth:1}],["sphere","Robot head",[0,2.5,0],{radius:.65}],["cylinder","Left arm",[-1.05,1,0],{radius:.16,height:1.5}],["cylinder","Right arm",[1.05,1,0],{radius:.16,height:1.5}]],"A compact robot figure."),wn("builtin.stairs","Stairs","Architecture","3d",[["box","Step one",[0,.2,0],{width:3,height:.4,depth:1}],["box","Step two",[0,.6,.8],{width:3,height:.8,depth:1}],["box","Step three",[0,1,1.6],{width:3,height:1.2,depth:1}]],"Three ascending steps."),...im(),...sm(),...lm(),...um(),...fm()]}var Nc=class{constructor(e){this.callbacks=e}scene;version=0;disabled=!1;assets={};assetTokens=new Map;assetSequence=0;cache=new Map;images={};queue=Promise.resolve();preview;previewHost;editor;dialog;panelId;selected=[];editorVersion=-1;editorResize;focusBefore;setState(e,t,i,s){let r=this.scene?.id!==e.id;for(let[o,a]of Object.entries(t))this.assets[o]!==a&&this.assetTokens.set(o,++this.assetSequence);for(let o of this.assetTokens.keys())t[o]||this.assetTokens.delete(o);if(this.scene=e,this.assets=t,this.version=i,this.disabled=s,(r||e.mode!=="2d"||this.panelId&&!e.elements[this.panelId])&&this.close(),e.mode!=="2d"){this.preview?.dispose(),this.preview=void 0,this.previewHost?.remove(),this.previewHost=void 0,this.cache.clear(),this.images={};return}this.editor&&this.panelId&&this.refreshEditor(),this.snapshots().catch(o=>{this.scene===e&&this.version===i&&this.callbacks.error(String(o))})}signature(e,t,i){let s=e.properties.scene,r=Object.values(s.elements).filter(o=>o.type==="image").map(o=>String(o.properties.src));return JSON.stringify([t.id,e.properties,r.map(o=>i[o]?this.assetTokens.get(o):null)])}snapshots(){let e=this.scene,t=this.assets,i=this.version;if(!e||e.mode!=="2d")return Promise.resolve({});let s=async()=>{let o={},a=new Set;for(let l of Object.values(e.elements)){if(l.type!=="viewport3d"||!xo(e,l.id))continue;if(this.scene!==e||this.version!==i)throw new Error("Scene changed while rendering 3D previews.");let c=this.signature(l,e,t);a.add(c);let h=this.cache.get(c);if(!h){this.previewHost||(this.previewHost=document.createElement("div"),this.previewHost.className="viewport-preview-renderer",document.body.append(this.previewHost));let d=l.properties,u=Number(d.width)/Number(d.height),p=u>=1?768:Math.max(1,Math.round(768*u)),g=u>=1?Math.max(1,Math.round(768/u)):768;this.previewHost.style.width=`${p}px`,this.previewHost.style.height=`${g}px`,this.preview||(this.preview=new zn(this.previewHost,{select(){},commit(){},error:this.callbacks.error})),this.preview.setInteractive(!1,!1),this.preview.setAssets(t),this.preview.setState(d.scene,[],i,!0),this.preview.resizeNow(),this.preview.setCamera({position:[4,3,6],target:[0,0,0]}),this.preview.fit(),d.camera&&this.preview.setCamera(d.camera),h=await this.preview.snapshotPng(d.background),this.cache.set(c,h)}o[l.id]=h}if(this.scene!==e||this.version!==i)throw new Error("Scene changed while rendering 3D previews.");for(let l of this.cache.keys())a.has(l)||this.cache.delete(l);return this.images=o,this.callbacks.previews(o),o},r=this.queue.then(s);return this.queue=r.then(()=>{},()=>{}),r}edit(e){if(!this.scene||this.disabled||this.scene.elements[e]?.type!=="viewport3d"||St(this.scene,e))return;this.close(),this.panelId=e,this.selected=[],this.editorVersion=-1,this.focusBefore=document.activeElement;let t=document.createElement("dialog");this.dialog=t,t.className="viewport-editor",t.dataset.testid="viewport-editor",t.innerHTML=`<div class="viewport-editor-heading"><strong>Edit 3D view</strong><button data-view="done">Done</button></div>
      <div class="viewport-editor-tools"><button data-view="fit">Fit & save camera</button><button data-view="translate">Move</button><button data-view="rotate">Rotate</button><button data-view="scale">Scale</button>
      <button data-add="box">Box</button><button data-add="sphere">Sphere</button><button data-add="cylinder">Cylinder</button><button data-add="plane">Plane</button><button data-view="image">Image</button><button data-view="import">Import 3D JSON</button><button data-view="delete">Delete selected</button><select aria-label="3D library component"></select><button data-view="component">Insert component</button></div>
      <p>Drag the background to orbit; scroll to zoom. Camera and model changes are saved in the figure.</p>
      <div class="viewport-editor-body"><div class="viewport-editor-canvas"></div><div class="viewport-editor-properties"></div></div>`,document.body.append(t),t.showModal();let i=t.querySelector('[aria-label="3D library component"]'),s=Dc().filter(r=>r.mode==="3d");for(let r of s)i.add(new Option(r.name,r.id));t.addEventListener("cancel",r=>{r.preventDefault(),this.close()}),t.addEventListener("keydown",r=>{r.stopPropagation(),r.key==="Escape"&&(r.preventDefault(),this.close())});try{this.editor=new zn(t.querySelector(".viewport-editor-canvas"),{select:o=>{this.selected=o?[o]:[],this.refreshEditor()},commit:(o,a)=>this.nested({kind:"update",updates:o},a),cameraCommit:(o,a)=>this.camera(o,a),error:this.callbacks.error}),this.editor.setInteractive(!0,!1),this.editorResize=new ResizeObserver(()=>this.layoutEditor()),this.editorResize.observe(t.querySelector(".viewport-editor-body")),this.layoutEditor(),this.refreshEditor(),this.editor.fit();let r=this.scene.elements[e].properties.camera;r&&this.editor.setCamera(r)}catch(r){this.close(),this.callbacks.error(String(r));return}t.querySelectorAll("button").forEach(r=>r.onclick=()=>{try{let o=r.dataset.view;if(o==="done"){this.close();return}if(this.disabled||!this.scene||St(this.scene,e))return;if(o==="fit"&&(this.editor.fit(),this.camera(this.editor.getCamera(),this.version)),(o==="translate"||o==="rotate"||o==="scale")&&this.editor.setTool(o),o==="image"&&this.callbacks.insertImage(e,this.version),o==="delete"&&this.nested({kind:"delete",ids:this.selected}),o==="component"){let a=s.find(l=>l.id===i.value);if(a){let l=Lc(a,[0,0,0]);this.selected=[l.rootId],this.nested({kind:"insertMany",elements:l.elements})}}if(r.dataset.add){let a=hi(r.dataset.add,"3d");this.selected=[a.id],this.nested({kind:"insert",element:a})}o==="import"&&this.importScene()}catch(o){this.callbacks.error(String(o))}})}importScene(){let e=this.version,t=this.panelId,i=document.createElement("input");i.type="file",i.accept=".json",i.onchange=async()=>{try{let s=i.files?.[0];if(!s)return;if(s.size>16*1024*1024)throw new Error("Scene exceeds 16 MB.");let r=Dd(await s.text());if(r.mode!=="3d")throw new Error("Choose a 3D scene JSON file.");if(this.panelId!==t||this.version!==e||this.disabled)throw new Error("Figure changed while choosing the scene.");this.selected=[],this.callbacks.commit({kind:"update",updates:[{id:t,changes:{properties:{scene:r,camera:void 0}}}]},e)}catch(s){this.callbacks.error(String(s))}},i.click()}nested(e,t=this.version){if(!this.scene||!this.panelId||this.disabled||St(this.scene,this.panelId)||t!==this.version)return;let i=Nd(this.scene.elements[this.panelId].properties.scene,e);this.callbacks.commit({kind:"update",updates:[{id:this.panelId,changes:{properties:{scene:i}}}]},t)}camera(e,t){!this.scene||!this.panelId||this.disabled||t!==this.version||St(this.scene,this.panelId)||this.callbacks.commit({kind:"update",updates:[{id:this.panelId,changes:{properties:{camera:e}}}]},t)}refreshEditor(){if(!this.scene||!this.panelId||!this.editor||!this.dialog)return;let e=this.scene.elements[this.panelId],t=e.properties.scene,i=this.disabled||St(this.scene,this.panelId);this.selected=this.selected.filter(a=>t.elements[a]),this.layoutEditor(),this.editor.setAssets(this.assets),this.editor.setState(t,this.selected,this.version,i),!i&&this.editorVersion!==this.version&&(e.properties.camera?this.editor.setCamera(e.properties.camera):(this.editor.setCamera({position:[4,3,6],target:[0,0,0]}),this.editor.fit()),this.editorVersion=this.version);let s=this.dialog.querySelector(".viewport-editor-properties");s.replaceChildren();let r=document.createElement("select");r.setAttribute("aria-label","3D element"),r.add(new Option("Select an element",""));for(let a of Object.values(t.elements))r.add(new Option(a.name,a.id));r.value=this.selected[0]??"",r.onchange=()=>{this.selected=r.value?[r.value]:[],this.refreshEditor()},s.append(r);let o=t.elements[this.selected[0]];if(o){for(let a of["position","rotation","scale"])for(let l=0;l<3;l++){let c=document.createElement("label");c.textContent=`${a} ${"XYZ"[l]}${a==="rotation"?" (\xB0)":""}`;let h=document.createElement("input");h.type="number",h.step="any",h.disabled=i||St(t,o.id),h.setAttribute("aria-label",c.textContent),h.value=String(o.transform[a][l]*(a==="rotation"?180/Math.PI:1));let d=this.version;h.onchange=()=>{let u=Number(h.value);if(!h.value.trim()||!Number.isFinite(u))return;let p=structuredClone(o.transform);p[a][l]=u*(a==="rotation"?Math.PI/180:1);try{this.nested({kind:"update",updates:[{id:o.id,changes:{transform:p}}]},d)}catch(g){this.callbacks.error(String(g))}},c.append(h),s.append(c)}for(let a of["width","height","depth","radius","fill","opacity"]){let l=o.properties[a];if(l===void 0)continue;let c=document.createElement("label");c.textContent=a;let h=document.createElement("input");h.type=a==="fill"?"color":"number",h.step="any",h.value=String(l),h.setAttribute("aria-label",`3D ${a}`),h.disabled=i||St(t,o.id);let d=this.version;h.onchange=()=>{try{this.nested({kind:"update",updates:[{id:o.id,changes:{properties:{[a]:a==="fill"?h.value:Number(h.value)}}}]},d)}catch(u){this.callbacks.error(String(u))}},c.append(h),s.append(c)}}this.dialog.querySelectorAll("button").forEach(a=>a.disabled=i&&a.dataset.view!=="done")}layoutEditor(){if(!this.dialog||!this.scene||!this.panelId)return;let e=this.dialog.querySelector(".viewport-editor-body"),t=this.dialog.querySelector(".viewport-editor-canvas"),i=this.dialog.querySelector(".viewport-editor-properties"),s=this.scene.elements[this.panelId]?.properties;if(!s)return;let r=Math.min(Math.max(1,e.clientWidth-i.offsetWidth-12)/Number(s.width),Math.max(1,e.clientHeight)/Number(s.height));t.style.width=`${Number(s.width)*r}px`,t.style.height=`${Number(s.height)*r}px`,this.editor?.resizeNow()}close(){this.editorResize?.disconnect(),this.editorResize=void 0,this.editor?.dispose(),this.editor=void 0,this.dialog?.close(),this.dialog?.remove(),this.dialog=void 0,this.panelId=void 0,this.focusBefore?.focus({preventScroll:!0}),this.focusBefore=void 0}};var mm=["Condensed matter","Physics","Optics","Electrical","Electronic packages"],gm=(n,e)=>{let t=i=>{let s=mm.indexOf(i);return s<0?mm.length:s};return t(n)-t(e)||n.localeCompare(e)},Ps=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function ym(n,e="-100 -75 200 150"){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${e}" role="img" aria-label="Component preview"><g>${n}</g></svg>`}function VM(n){let e=f=>[(f.x-f.z)*.82,-f.y+(f.x+f.z)*.42],t=new Map,i=new Set,s=f=>{let m=t.get(f.id);if(m)return m;if(i.has(f.id))return new nt;i.add(f.id);let x=f.transform,v=new nt().compose(new I(...x.position),new dt().setFromEuler(new yn(...x.rotation,"XYZ")),new I(...x.scale)),M=f.parent?n[f.parent]:void 0,T=M?s(M).clone().multiply(v):v;return i.delete(f.id),t.set(f.id,T),T},r=f=>f.visible&&(!f.parent||n[f.parent]&&r(n[f.parent])),o=[],a=(f,m)=>{let x=m.clone().applyMatrix4(s(f)),v=e(x);return o.push(v),v},l=(f,m)=>m.map(x=>a(f,x).join(",")).join(" "),c=[],h=f=>{let m=new I().applyMatrix4(s(f));return m.x+.84*m.y+m.z};for(let f of Object.values(n).sort((m,x)=>h(m)-h(x))){if(!r(f)||f.type==="group")continue;let m=f.properties,x=Number(m.radius??10),v=Number(m.width??x*2),M=Number(m.height??x*2),T=f.type==="plane"?0:Number(m.depth??x*2),E=Ps(m.fill??(f.type==="sphere"?"#5e9cff":"#6c7cff"));if(f.type==="sphere"){let A=new I(1,0,-1).normalize(),_=new I(.42,-1,.42).normalize(),V=Array.from({length:32},(C,O)=>{let k=O/32*Math.PI*2;return A.clone().multiplyScalar(Math.cos(k)*x).addScaledVector(_,Math.sin(k)*x)}).map(C=>a(f,C).join(",")).join(" ");c.push(`<polygon points="${V}" fill="${E}" fill-opacity=".82" stroke="${Ps(m.stroke??"#d9e4ff")}"/>`)}else{let A=[new I(-v/2,-M/2,-T/2),new I(v/2,-M/2,-T/2),new I(v/2,M/2,-T/2),new I(-v/2,M/2,-T/2),new I(-v/2,-M/2,T/2),new I(v/2,-M/2,T/2),new I(v/2,M/2,T/2),new I(-v/2,M/2,T/2)];if(f.type==="cylinder"){let _=Array.from({length:12},(C,O)=>{let k=O/12*Math.PI*2;return[new I(Math.cos(k)*x,-M/2,Math.sin(k)*x),new I(Math.cos(k)*x,M/2,Math.sin(k)*x)]}).flat();_.forEach(C=>a(f,C));let w=_.filter((C,O)=>O%2===0),V=_.filter((C,O)=>O%2===1);for(let C=0;C<w.length;C++){let O=(C+1)%w.length;c.push(`<polygon points="${l(f,[w[C],w[O],V[O],V[C]])}" fill="${E}" fill-opacity=".65"/>`)}c.push(`<polygon points="${w.map(C=>a(f,C).join(",")).join(" ")}" fill="${E}" fill-opacity=".75" stroke="${Ps(m.stroke??"#d9e4ff")}"/>`),c.push(`<polygon points="${V.map(C=>a(f,C).join(",")).join(" ")}" fill="${E}" fill-opacity=".45" stroke="${Ps(m.stroke??"#d9e4ff")}"/>`)}else{for(let _ of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]])c.push(`<polygon points="${l(f,_.map(w=>A[w]))}" fill="${E}" fill-opacity=".6" stroke="${Ps(m.stroke??"#d9e4ff")}"/>`);c.push(`<polygon points="${l(f,[A[0],A[1],A[2],A[3]])}" fill="${E}" fill-opacity=".8" stroke="${Ps(m.stroke??"#d9e4ff")}"/>`),c.push(`<polygon points="${l(f,[A[4],A[5],A[6],A[7]])}" fill="${E}" fill-opacity=".45" stroke="${Ps(m.stroke??"#d9e4ff")}"/>`),c.push(`<path d="M${l(f,[A[0],A[4]])} M${l(f,[A[1],A[5]])} M${l(f,[A[2],A[6]])} M${l(f,[A[3],A[7]])}" fill="none" stroke="${Ps(m.stroke??"#d9e4ff")}"/>`)}}}if(!o.length)return ym(c.join(""));let d=1/0,u=1/0,p=-1/0,g=-1/0;o.forEach(([f,m])=>{d=Math.min(d,f),u=Math.min(u,m),p=Math.max(p,f),g=Math.max(g,m)});let y=Math.max(p-d,g-u,1e-6)*.08;return ym(c.join("").replace(/<(polygon|path) /g,'<$1 vector-effect="non-scaling-stroke" stroke-width="0.8" '),`${d-y} ${u-y} ${Math.max(p-d+y*2,1e-6)} ${Math.max(g-u+y*2,1e-6)}`)}var Oc=class{constructor(e,t){this.callbacks=t;this.root=document.createElement("section"),this.root.className="component-navigator",this.root.id="component-navigator",this.root.hidden=!0,this.root.setAttribute("aria-label","Components"),this.root.innerHTML='<div class="component-nav-header"><div><h2>COMPONENTS</h2><p>Insert reusable assemblies into the current scene.</p></div><button type="button" class="component-close" aria-label="Close Components">\xD7</button></div>';let i=document.createElement("div");i.className="component-controls",this.search=document.createElement("input"),this.search.type="search",this.search.placeholder="Search components",this.search.setAttribute("aria-label","Search components"),this.category=document.createElement("select"),this.category.setAttribute("aria-label","Filter by category"),i.append(this.search,this.category);let s=document.createElement("div");s.className="component-actions";let r=(o,a,l)=>{let c=document.createElement("button");return c.type="button",c.textContent=o,l&&(c.dataset.testid=l),c.addEventListener("click",a),c};if(s.append(r("Refresh",()=>t.onRefresh()),r("Save selection",()=>t.onSave()),r("Copy guide",()=>t.onCopyGuide())),this.warning=document.createElement("div"),this.warning.className="component-warning",this.warning.setAttribute("role","status"),this.cards=document.createElement("div"),this.cards.className="component-cards",this.detail=document.createElement("div"),this.detail.className="component-detail",this.scale=document.createElement("input"),this.scale.type="number",this.scale.min="0.0001",this.scale.step="0.1",this.scale.value="1",this.scale.setAttribute("aria-label","Component scale"),this.scale.addEventListener("input",()=>this.updateInsertState()),this.insert=r("Place on canvas",()=>{this.selected&&this.validScale()&&t.onInsert(this.selected,Number(this.scale.value))},"insert-component"),this.insert.className="primary",this.detail.append(this.scale,this.insert),t.onInsertCenter){let o=r("Insert at view center",()=>{this.selected&&this.validScale()&&t.onInsertCenter(this.selected,Number(this.scale.value))},"insert-component-center");o.className="component-center-button",this.detail.append(o)}this.root.append(i,s,this.warning,this.cards,this.detail),e.append(this.root),this.root.querySelector(".component-close").addEventListener("click",()=>this.setOpen(!1)),this.search.addEventListener("input",()=>this.renderCards()),this.category.addEventListener("change",()=>this.renderCards())}root;cards;detail;search;category;scale;insert;warning;entries=[];mode="2d";selected;thumbnailCache=new WeakMap;enabled=!0;canSave=!1;setEntries(e,t,i=[],s){this.entries=e,this.mode=t,(!this.selected||!e.includes(this.selected)||this.selected.mode!==t)&&(this.selected=void 0),this.warning.textContent=`${i.join(" ")}${s?`${i.length?" ":""}You can add *.three-component.json files in ${s} and use work order \u201CAdd this to Components\u201D.`:""}`,this.warning.hidden=!this.warning.textContent,this.renderCategories(),this.root.hidden||this.renderCards(),this.renderDetail()}setEnabled(e,t){this.enabled=e,this.canSave=t,this.updateInsertState(),this.scale.disabled=!e,this.root.querySelectorAll(".component-actions button").forEach((i,s)=>{i.disabled=!e||s===1&&!t})}setOpen(e){this.root.hidden=!e,e&&(this.renderCards(),this.search.focus()),this.callbacks.onOpenChange?.(e)}isOpen(){return!this.root.hidden}renderCategories(){let e=this.category.value,t=this.entries.filter(r=>r.mode===this.mode),i=new Map;t.forEach(r=>i.set(r.category,(i.get(r.category)??0)+1)),this.category.replaceChildren();let s=document.createElement("option");s.value="",s.textContent=`All categories (${t.length})`,this.category.append(s),[...i.keys()].sort(gm).forEach(r=>{let o=document.createElement("option");o.value=r,o.textContent=`${r} (${i.get(r)})`,this.category.append(o)}),this.category.value=[...this.category.options].some(r=>r.value===e)?e:""}renderCards(){if(this.root.hidden)return;this.cards.replaceChildren();let e=this.search.value.trim().toLowerCase(),t=this.category.value,i=this.entries.filter(r=>r.mode===this.mode&&(!t||r.category===t)&&(!e||`${r.name} ${r.description??""} ${r.category}`.toLowerCase().includes(e))).sort((r,o)=>gm(r.category,o.category)||r.name.localeCompare(o.name,void 0,{numeric:!0}));if(!i.length){let r=document.createElement("p");r.className="empty",r.textContent="No components match your search and category in this scene mode.",this.cards.append(r);return}let s=new Map;for(let r of[...new Set(i.map(o=>o.category))]){let o=document.createElement("section");o.className="component-category-group",o.dataset.category=r,o.setAttribute("aria-label",`${r} components`);let a=document.createElement("h3");a.className="component-category-heading";let l=document.createElement("span");l.textContent=r;let c=document.createElement("small");c.textContent=String(i.filter(h=>h.category===r).length),a.append(l,c),o.append(a),this.cards.append(o),s.set(r,o)}i.forEach(r=>{let o=document.createElement("button");o.type="button",o.className="component-card",o.setAttribute("aria-pressed",String(this.selected===r));let a=document.createElement("span");a.className="component-thumb";let l=this.thumbnailCache.get(r);if(!l){try{let d={schema:"three-interact.scene",version:1,id:Object.keys(r.elements)[0],mode:"2d",units:"px",coordinates:"x-right y-down; logical pixels; rotation radians about z",elements:r.elements};l=r.mode==="2d"?Kd(d).replace(/^<\?xml[^>]*>\s*/,""):VM(r.elements)}catch{l=""}this.thumbnailCache.set(r,l)}l?a.innerHTML=l:a.textContent="Preview unavailable";let c=document.createElement("strong");c.textContent=r.name;let h=document.createElement("small");h.textContent=`${r.category} \xB7 ${Object.keys(r.elements).length} elements`,o.append(a,c,h),o.addEventListener("click",()=>{this.selected=r,this.renderCards(),this.renderDetail(),this.detail.scrollIntoView({block:"nearest"})}),s.get(r.category).append(o)})}renderDetail(){if(this.detail.classList.toggle("has-selection",!!this.selected),this.detail.querySelector(".component-selected")?.remove(),!this.selected){this.updateInsertState();return}let t=document.createElement("div");t.className="component-selected";let i=document.createElement("strong");i.textContent=this.selected.name;let s=document.createElement("p");s.textContent=`${this.selected.description||"No description provided."} Click the canvas to place it.`;let r=document.createElement("small");if(r.textContent=`${this.selected.source?`Source: ${this.selected.source} \xB7 `:""}${Object.keys(this.selected.elements).length} elements${this.selected.license?` \xB7 Geometry: ${this.selected.license}`:""}`,t.append(i,s,r),this.selected.references?.length){let o=document.createElement("ul");o.className="component-references";for(let a of this.selected.references){let l;try{l=new URL(a.url)}catch{continue}if(l.protocol!=="https:"||l.username||l.password)continue;let c=document.createElement("li"),h=document.createElement("a");h.href=l.href,h.textContent=a.title,h.target="_blank",h.rel="noopener noreferrer",c.append(`${a.kind==="adapted"?"Adapted from":"Concept reference"}: `,h),a.license&&c.append(` (${a.license})`),o.append(c)}t.append(o)}this.detail.prepend(t),this.updateInsertState()}validScale(){let e=Number(this.scale.value);return Number.isFinite(e)&&e>0}updateInsertState(){let e=!this.enabled||!this.selected||!this.validScale();this.insert.disabled=e,this.detail.querySelector("[data-testid=insert-component-center]")?.toggleAttribute("disabled",e)}};function qt(n){return String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;")}function ra(n,e=100){return n.length>e?`${n.slice(0,e-1)}\u2026`:n}function Zu(n){if(n===void 0)return"(none)";if(typeof n=="string")return ra(n);if(Array.isArray(n))return ra(`[${n.map(Zu).join(", ")}]`);if(n&&typeof n=="object")try{return ra(JSON.stringify(n))}catch{return"[object]"}return ra(String(n))}function HM(n,e){return JSON.stringify(n)!==JSON.stringify(e)}function Wi(n,e,t,i=!1){if(!HM(e,t))return"";let s=r=>i&&Array.isArray(r)?r.map(o=>typeof o=="number"?`${(o*180/Math.PI).toFixed(2).replace(/\.00$/,"")}\xB0`:o):r;return`<li><b>${qt(n)}</b>: ${qt(Zu(s(e)))} \u2192 ${qt(Zu(s(t)))}</li>`}function GM(n,e){if(!e.before)return[`<li title="${qt(n)}"><b>Added</b> ${qt(e.after?.name||n)}</li>`];if(!e.after)return[`<li title="${qt(n)}"><b>Deleted</b> ${qt(e.before.name||n)}</li>`];let t=e.before,i=e.after,s=[Wi("name",t.name,i.name),Wi("visibility",t.visible,i.visible),Wi("lock",t.locked,i.locked),Wi("position",t.transform.position,i.transform.position),Wi("rotation (degrees)",t.transform.rotation,i.transform.rotation,!0),Wi("scale",t.transform.scale,i.transform.scale),Wi("parent",t.parent,i.parent)],r=new Set([...Object.keys(t.properties),...Object.keys(i.properties)]);for(let o of[...r].sort()){let a=Wi(`property ${o}`,t.properties[o],i.properties[o]);a&&s.push(a)}return s.filter(Boolean).map(o=>o.replace("<li>",`<li title="${qt(n)}"><b>${qt(t.name||n)}</b> \xB7 `))}function _m(n){let e=Object.entries(n.elements).flatMap(([o,a])=>GM(o,a)),i=[...["id","mode","units","coordinates"].flatMap(o=>{let a=n.beforeMetadata[o],l=n.afterMetadata[o],c=Wi(`scene ${o}`,a,l);return c?[c]:[]}),...e],s=i.slice(0,20),r=Math.max(0,i.length-20);return`<article class="change-summary" title="${qt(n.beforeTextHash)} \u2192 ${qt(n.afterTextHash)}"><h4>${qt(n.action)}</h4><p>${qt(n.source)} \xB7 ${qt(n.at)}</p><ul>${s.join("")}</ul>${r?`<p>${r} more change${r===1?"":"s"} not shown.</p>`:""}</article>`}function xm(n,e){let t=[...n.history].reverse().find(i=>i.event===e);return t?.note?` \xB7 ${qt(ra(t.note))}`:""}function vm(n,e){let t=!!e,i=t&&n.snapshotHash===e,s=n.files??[],r=s.length?s.map(h=>{let d=h.completedSha256===void 0?"No completion receipt":h.completedSha256===h.sha256?"Unchanged between start and completion":"Changed between start and completion";return`<li>${qt(h.path)} \xB7 ${qt(d)}</li>`}).join(""):"<li>No completion receipt</li>",o=t?i?"current":"Scene changed since request":"current scene hash unavailable",a=n.history.some(h=>h.event==="started")?`<p>Started${xm(n,"started")}</p>`:"",l=n.history.some(h=>h.event==="done")?`<p>Done${xm(n,"done")}</p>`:"",c=n.status==="done"?"<p>Completion is reported by the agent; review changes and validation notes.</p>":"";return`<section class="order-evidence"><h4>${qt(n.status==="done"?"Done (reported)":n.status)}</h4><p>Frozen scene snapshot: <b>${qt(o)}</b>.</p><p>${n.selectedIds.length} target${n.selectedIds.length===1?"":"s"}</p><p>Files tracked: ${s.length}</p><ul>${r}</ul>${a}${l}${c}</section>`}function bm({instruction:n,keep:e,success:t,intent:i}){let s=i==="modify"?"Modify the selected elements.":i==="similar"?"Create a new element using the selected elements as references. Preserve the original elements.":"",r=s?`${s}

${n}`:n,o=e?.trim(),a=t?.trim();return o&&(r+=`

Keep unchanged:
${o}`),a&&(r+=`

Success checks:
${a}`),r}var Mm={fit:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h8v8H8z"/>',duplicate:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',delete:'<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-2-15-4 18"/>',export:'<path d="M12 16V3m-4 4 4-4 4 4M4 14v7h16v-7"/>',components:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',inspector:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',orders:'<rect x="5" y="4" width="15" height="17" rx="2"/><path d="M9 2h7v4H9zM9 11h7M9 16h7"/>',history:'<path d="M3 10a9 9 0 1 1 2 9M3 4v6h6M12 7v6l4 2"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',move:'<path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4"/>',rotate:'<path d="M5 8a8 8 0 1 1-1 7M5 3v5h5"/>'},qi=(n,e="button-icon")=>`<svg class="${e}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${Mm[n]??Mm.components}</svg>`,od=window.acquireVsCodeApi(),et=od.getState?.()??{},ad=typeof et.dockWidth=="number"&&Number.isFinite(et.dockWidth)?Math.max(240,Math.min(480,et.dockWidth)):320,Ls=typeof et.briefOpen=="boolean"?et.briefOpen:!!(et.instruction||et.briefKeep||et.briefSuccess),Xi=et.showTips!==!1,hr=et.gridVisible!==!1;document.body.dataset.tips=Xi?"shown":"hidden";var ao=et.themePreferenceVersion===1&&(et.theme==="black"||et.theme==="light")?et.theme:"vscode",dr=new Set(Array.isArray(et.collapsedGroups)?et.collapsedGroups.filter(n=>typeof n=="string"):[]);document.body.innerHTML='<header><div class="brand"><span class="brand-icon">\u25C8</span><strong>Three Interact</strong><span id="mode" class="badge"></span></div><nav><button data-testid="fit-scene" title="Fit the scene">Fit</button><button data-testid="duplicate">Duplicate</button><button data-testid="delete">Delete</button><button data-testid="reveal-json">Reveal Source</button><button data-testid="export">Export</button></nav></header><main><section class="stage"><div id="canvas"></div><div id="warning" role="status" hidden></div><div class="handoff"><label for="instruction">INSTRUCTION FOR YOUR AGENT</label><textarea id="instruction" rows="2" placeholder="e.g. Move this element to the right and change its color"></textarea><div class="handoff-actions"><span>References include stable IDs and the current document snapshot.</span><button data-testid="copy-reference">Copy Reference</button><button data-testid="copy-ai" class="primary">Copy Selection for AI</button></div></div></section><aside class="right"><section class="scene-list"><h2>SCENE ELEMENTS <span id="count"></span></h2><div id="tree" role="tree" aria-label="Scene elements" aria-multiselectable="true"></div></section><h2 id="panel-heading">INSPECTOR</h2><div id="inspector"></div><div class="help">Click or press Enter to select \xB7 Shift for multiple<br>2D: drag background to pan \xB7 wheel to zoom<br>3D: drag to orbit \xB7 wheel to zoom</div></aside><aside class="tool-rail" aria-label="Insert elements"><h2 class="sr-only">Insert elements</h2><div id="insert-buttons" class="insert-grid"></div></aside></main><footer><span id="status">Opening scene\u2026</span><span id="units"></span></footer>';for(let[n,e]of Object.entries({"fit-scene":"fit",duplicate:"duplicate",delete:"delete","reveal-json":"code",export:"export"})){let t=document.querySelector(`[data-testid="${n}"]`),i=t.textContent??"";t.setAttribute("aria-label",i),t.title=i,t.innerHTML=`${qi(e)}<span class="button-label">${i}</span>`}document.body.dataset.theme=ao;var Ns=document.createElement("select");Ns.id="theme-select";Ns.setAttribute("aria-label","Theme");Ns.title="Editor theme";Ns.innerHTML='<option value="vscode">VS Code</option><option value="black">Black</option><option value="light">Light</option>';Ns.value=ao;document.querySelector("header nav").prepend(Ns);var li=document.createElement("button");li.type="button";li.dataset.testid="toggle-grid";li.textContent="Grid";li.title="Show or hide the 3D grid";li.style.display="none";li.setAttribute("aria-label","Show or hide the 3D grid");li.setAttribute("aria-pressed",String(hr));document.querySelector("header nav").append(li);li.onclick=()=>{hr=!hr,li.setAttribute("aria-pressed",String(hr)),Je instanceof zn&&Je.setGridVisible(hr),Un()};var Re=n=>document.querySelector(n),_n=Re("#canvas"),Zi=Re("#tree"),dn=Re("#inspector"),Ct=Re("#instruction"),fn=Re(".right");_n.tabIndex=0;_n.setAttribute("aria-label","Scene canvas");var Hc=document.createElement("div");Hc.className="canvas-caption";Hc.setAttribute("aria-hidden","true");_n.before(Hc);var ha=document.createElement("section");ha.className="sidebar-actions";ha.innerHTML='<h2>IMAGES & COMPONENTS</h2><button type="button" data-testid="sidebar-insert-image">Insert image\u2026</button><button type="button" data-testid="sidebar-hide-selection">Hide selected</button><div class="reference-actions"><button type="button" data-testid="order-modify">Modify selected</button><button type="button" data-testid="order-similar">Create similar</button></div><details class="sidebar-help"><summary>How to use</summary><p class="hint">Insert a PNG or JPEG in a 2D drawing. Drag to move, use square grips to resize or the round handle to rotate. Hold Shift to snap rotation; enter degrees in Properties. Tab reaches controls. On the canvas, arrow keys move the selection; Shift moves farther. Hide groups to hide their components.</p></details></section>';fn.prepend(ha);var Ti=document.createElement("input");Ti.type="search";Ti.id="scene-search";Ti.placeholder="Find elements\u2026";Ti.setAttribute("aria-label","Find scene elements");Re("#tree").before(Ti);Ti.oninput=()=>{Yc(),Jt()};var $n=document.createElement("select");$n.id="order-intent";$n.setAttribute("aria-label","Work order action");$n.innerHTML='<option value="custom">As described</option><option value="modify">Modify selected</option><option value="similar">Create similar</option>';$n.value=et.orderIntent==="similar"||et.orderIntent==="modify"?et.orderIntent:"custom";Re(".handoff > label").after($n);fn.before(Re(".tool-rail"));var Tt=document.createElement("div");Tt.id="dock-resize";Tt.tabIndex=0;Tt.setAttribute("role","separator");Tt.setAttribute("aria-label","Resize properties and library dock");Tt.setAttribute("aria-orientation","vertical");Tt.setAttribute("aria-controls","right-dock");Tt.title="Drag to resize the dock. Left/Right arrows adjust width. Double-click to reset.";fn.id="right-dock";fn.before(Tt);var ro;function ld(){let n=Math.max(240,Math.min(480,window.innerWidth-232)),e=Math.min(ad,n);Re("main").style.setProperty("--dock-width",`${e}px`),Tt.setAttribute("aria-valuemin","240"),Tt.setAttribute("aria-valuemax",String(n)),Tt.setAttribute("aria-valuenow",String(e)),Tt.setAttribute("aria-valuetext",`${e} pixels`);let t=window.innerWidth<=650;Tt.setAttribute("aria-disabled",String(t)),Tt.tabIndex=t?-1:0}function cd(n){ad=Math.max(240,Math.min(480,window.innerWidth-232,n)),ld()}ld();window.addEventListener("resize",ld);Tt.addEventListener("keydown",n=>{if(window.innerWidth<=650||!["ArrowLeft","ArrowRight","Home","End"].includes(n.key))return;n.preventDefault(),n.stopPropagation();let e=Number(Tt.getAttribute("aria-valuenow"));cd(n.key==="Home"?240:n.key==="End"?480:e+(n.key==="ArrowLeft"?10:-10)),Un()});Tt.addEventListener("dblclick",()=>{window.innerWidth<=650||(cd(320),Un())});Tt.addEventListener("pointerdown",n=>{n.button!==0||window.innerWidth<=650||(n.preventDefault(),ro={pointer:n.pointerId,x:n.clientX,width:Number(Tt.getAttribute("aria-valuenow"))},Tt.setPointerCapture(n.pointerId),document.body.classList.add("resizing-dock"))});Tt.addEventListener("pointermove",n=>{ro?.pointer===n.pointerId&&cd(ro.width+ro.x-n.clientX)});var hd=()=>{ro&&(ro=void 0,document.body.classList.remove("resizing-dock"),Un())};Tt.addEventListener("pointerup",hd);Tt.addEventListener("pointercancel",hd);Tt.addEventListener("lostpointercapture",hd);var ho=document.createElement("section");ho.className="transform-panel";ho.innerHTML='<label class="field"><span>Canvas tool</span><select id="transform-tool" data-testid="transform-tool" aria-label="Canvas tool"><option value="translate">Move</option><option value="rotate">Rotate</option><option value="scale">Scale</option></select></label>';ho.insertAdjacentHTML("beforeend",'<p class="transform-hint">Choose a tool, then drag the selected element on the canvas. In 3D, drag a gizmo handle.</p>');var Fs=document.createElement("div");Fs.id="canvas-tools";Fs.className="canvas-tools";Fs.setAttribute("aria-label","Edit selected element");Fs.innerHTML=`<button type="button" data-transform-tool="translate" data-testid="tool-move" title="Move (V)" aria-label="Move selected element">${qi("move")}</button><button type="button" data-transform-tool="rotate" data-testid="tool-rotate" title="Rotate (R) \u2014 drag the round handle" aria-label="Rotate selected element">${qi("rotate")}</button><button type="button" data-transform-tool="scale" data-testid="tool-resize" title="Resize (S) \u2014 drag a square handle" aria-label="Resize selected element">${qi("fit")}</button><button type="button" data-testid="sidebar-delete" class="delete-action" title="Delete selected (Delete)" aria-label="Delete selected element">${qi("close")}</button>`;Re(".tool-rail").append(Fs);Fs.querySelectorAll("[data-transform-tool]").forEach(n=>{n.onclick=()=>md(n.dataset.transformTool)});Fs.querySelector('[data-testid="sidebar-delete"]').onclick=()=>{ye.length&&Xn({kind:"delete",ids:ye})};fn.querySelector(".scene-list").after(ho);var Ai=document.createElement("div");Ai.className="inspector-tabs";Ai.innerHTML='<button type="button" data-panel="inspector" aria-selected="true" aria-controls="inspector">Inspector</button><button type="button" data-panel="components" aria-selected="false" aria-controls="component-navigator">Components</button><button type="button" data-panel="orders" aria-label="Work orders" title="Work orders" aria-selected="false" aria-controls="orders-panel">Orders <span id="order-count">0</span></button><button type="button" data-panel="history" aria-label="History" title="History / Proof: modification journal" aria-selected="false" aria-controls="history-panel">History / Proof <span id="history-count">0</span></button>';fn.querySelector("#panel-heading").replaceWith(Ai);fn.prepend(Ai);for(let n of Ai.querySelectorAll("[data-panel]")){let e=n.firstChild?.textContent??"";n.firstChild?.remove(),n.setAttribute("aria-label",n.getAttribute("aria-label")||e);let t=n.dataset.panel,i={inspector:"Inspect",components:"Library",orders:"Orders",history:"History"},s={inspector:"Properties \u2014 edit the selected component and choose a canvas tool.",components:"Component library \u2014 browse and insert reusable 2D and 3D figures.",orders:"Work orders \u2014 review saved requests for your AI agent and their progress.",history:"History / Proof \u2014 review modifications and their before/after evidence."};n.title=s[t],n.insertAdjacentHTML("afterbegin",`${qi(t)}<span class="dock-tab-label">${i[t]}</span>`)}var Gc=document.createElement("h2");Gc.id="dock-heading";Gc.textContent="Properties";var Wc=document.createElement("div");Wc.className="dock-header";var Mi=document.createElement("button");Mi.type="button";Mi.id="tips-toggle";Mi.textContent="?";Mi.setAttribute("aria-label","Show tips");Mi.setAttribute("aria-pressed",String(Xi));Mi.title=Xi?"Hide tips":"Show tips";Mi.onclick=()=>{Xi=!Xi,document.body.dataset.tips=Xi?"shown":"hidden",Mi.setAttribute("aria-pressed",String(Xi)),Mi.title=Xi?"Hide tips":"Show tips",Un()};Wc.append(Gc,Mi);Ai.after(Wc);var Ri=document.createElement("button");Ri.type="button";Ri.id="history-activity";Ri.setAttribute("aria-label","Review latest modification");Ri.hidden=!0;Ri.title="Open the latest modification and its before/after evidence";Wc.after(Ri);var ud=fn.querySelector(".scene-list");Ri.after(ud);ud.after(dn,ha,ho);var Os=document.createElement("div");Os.id="orders-panel";Os.hidden=!0;fn.append(Os);var Us=document.createElement("div");Us.id="history-panel";Us.hidden=!0;fn.append(Us);fn.append(fn.querySelector(".help"));var mr=document.createElement("button");mr.dataset.testid="add-work-order";mr.textContent="Add work order";mr.className="primary";Re('[data-testid="copy-ai"]').classList.remove("primary");mr.title="Save the scene, select targets, and describe the change. Ctrl+Enter to add.";Re(".handoff-actions").append(mr);var fr=document.createElement("button");fr.type="button";fr.dataset.testid="save-scene";fr.textContent="Save scene";mr.before(fr);var uo=document.createElement("p");uo.id="order-readiness";uo.className="order-readiness";uo.setAttribute("role","status");Re(".handoff-actions").after(uo);var fo=document.createElement("div");fo.className="brief-heading";fo.id="brief-heading";var Xc=Re(".handoff > label");Xc.textContent="Agent brief";Xc.before(fo);fo.append(Xc,$n);var ca=document.createElement("p");ca.id="brief-targets";ca.className="brief-targets";Ct.before(ca);var Yi=document.createElement("div");Yi.id="history-order-source";Yi.className="history-source";Yi.hidden=!0;Ct.before(Yi);Ct.placeholder="Describe the idea, what should change, and what must stay. The selected 2D or 3D geometry gives your agent the context.";Ct.value=typeof et.instruction=="string"?et.instruction:"";Ct.maxLength=11800;var po=document.createElement("details");po.id="brief-details";po.className="brief-details";po.innerHTML='<summary>Constraints & success checks <span class="optional">optional</span></summary><div class="brief-fields"><label for="brief-keep">Keep unchanged<textarea id="brief-keep" rows="2" maxlength="2000" placeholder="e.g. Preserve the original, labels and dimensions"></textarea></label><label for="brief-success">Success checks<textarea id="brief-success" rows="2" maxlength="2000" placeholder="e.g. No overlaps; fit the drawing; save a new component"></textarea></label></div>';Ct.after(po);var mo=Re("#brief-keep"),go=Re("#brief-success");mo.value=typeof et.briefKeep=="string"?et.briefKeep:"";go.value=typeof et.briefSuccess=="string"?et.briefSuccess:"";po.open=!!(mo.value||go.value);var ua=document.createElement("details");ua.id="brief-review";ua.className="brief-review";ua.innerHTML='<summary>Review instruction <span id="brief-length"></span></summary><pre id="brief-preview"></pre>';po.after(ua);var dd=document.createElement("div");dd.className="brief-footer";Re(".handoff-actions").before(dd);dd.append(Re(".handoff-actions"),uo);var da=document.createElement("div");da.id="brief-content";da.append($n);for(let n of[...Re(".handoff").children])n!==fo&&da.append(n);Re(".handoff").append(da);var Ds=document.createElement("button");Ds.type="button";Ds.dataset.testid="toggle-agent-brief";Ds.setAttribute("aria-controls","brief-content");fo.append(Ds);function Em(){da.hidden=!Ls,Re(".handoff").classList.toggle("collapsed",!Ls),Ds.textContent=Ls?"Collapse":"Expand",Ds.setAttribute("aria-expanded",String(Ls)),Ds.setAttribute("aria-label",`${Ls?"Collapse":"Expand"} agent brief`)}function $c(n){Ls=n,Em(),Un()}Ds.onclick=()=>$c(!Ls);Xc.onclick=()=>{$c(!0),Ct.focus()};Em();var ai=0,te,vn=0,Ut=!0,ri=!1,Fc={},ju=[],ye=[],oi="translate",la=[],si=[],ji=typeof et.historySequence=="number"?et.historySequence:void 0,Tm=!1,Si="",td="",wi=!1,nd,id=50,pr=et.panel==="orders"||et.panel==="history"||et.panel==="components"?et.panel:"inspector",so=!1,Je,Sm,Uc,pt=!1,cr,Ei,Ue=n=>String(n??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),_t=n=>od.postMessage(n),Ju=Dc(),Ku=[],Qu="",oo,On=document.createElement("button");On.type="button";On.innerHTML=`${qi("components")}<span class="button-label">Components</span>`;On.setAttribute("aria-label","Components");On.title="Components";On.dataset.testid="components-open";On.setAttribute("aria-expanded","false");On.setAttribute("aria-controls","component-navigator");Re("header nav").prepend(On);var qc=document.createElement("div");qc.id="components-panel";fn.append(qc);var Ji=new Oc(qc,{onInsert:(n,e)=>{!te||Ut||pt||(oo={entry:n,scale:e},_n.classList.add("component-placement"),Ji.setOpen(!1),On.setAttribute("aria-expanded","false"),Lt(`Click the canvas to place ${n.name}. Escape cancels.`))},onInsertCenter:(n,e)=>{let t=_n.getBoundingClientRect();Am(n,e,t.left+t.width/2,t.top+t.height/2),Ji.setOpen(!1),On.setAttribute("aria-expanded","false")},onRefresh:()=>_t({type:"componentsRefresh"}),onSave:()=>_t({type:"componentSave",version:vn,ids:ye}),onCopyGuide:()=>_t({type:"componentGuideCopy"}),onOpenChange:n=>{On.setAttribute("aria-expanded",String(n)),n&&pr!=="components"&&En("components"),!n&&pr==="components"&&En("inspector")}});On.onclick=()=>{En(pr==="components"?"inspector":"components")};function kc(){oo=void 0,_n.classList.remove("component-placement")}function Am(n,e,t,i){if(!(!te||Ut||pt||!Je||n.mode!==te.mode))try{let s=Lc(n,Je.placementPoint(t,i),e);cr=s.rootId,Xn({kind:"insertMany",elements:s.elements}),kc()}catch(s){Lt(String(s),!0)}}var sd=!1;_n.addEventListener("pointerdown",n=>{!oo||n.button!==0||(n.preventDefault(),n.stopImmediatePropagation(),sd=!0,Am(oo.entry,oo.scale,n.clientX,n.clientY))},!0);_n.addEventListener("pointerup",n=>{sd&&(sd=!1,n.preventDefault(),n.stopImmediatePropagation())},!0);function Un(){od.setState?.({instruction:Ct.value,briefKeep:mo.value,briefSuccess:go.value,selection:ye,theme:ao,themePreferenceVersion:1,showTips:Xi,gridVisible:hr,collapsedGroups:[...dr],panel:pr,dockWidth:ad,briefOpen:Ls,orderIntent:$n.value,historySequence:ji})}function Lt(n,e=!1){Re("#status").textContent=n,Re("#status").classList.toggle("bad",e)}function Wn(){let n=co(Ct.value);_t({type:"selection",ids:ye,instruction:n.length>12e3?"":n,instructionTooLong:n.length>12e3}),Un()}function En(n){let e=pr!==n;pr=n,fn.dataset.panel=n,ud.hidden=n==="components",Gc.textContent={inspector:"Properties",components:"Components",orders:"Work orders",history:"History / Proof"}[n],dn.hidden=n!=="inspector",Os.hidden=n!=="orders",Us.hidden=n!=="history",ha.hidden=n!=="inspector",ho.hidden=n!=="inspector",qc.hidden=n!=="components",Ji.isOpen()!==(n==="components")&&Ji.setOpen(n==="components"),fn.querySelector(".help").hidden=n!=="inspector",Ai.querySelectorAll("[data-panel]").forEach(t=>{t.setAttribute("aria-selected",String(t.dataset.panel===n))}),Un(),e&&(fn.scrollTop=0),n==="history"&&!Si&&_t({type:"historyRefresh"}),n==="orders"&&!Si&&_t({type:"workOrderRefresh"})}function rd(){let n=new Set([...Os.querySelectorAll("details[data-order-id][open]")].map(s=>s.dataset.orderId));Re("#order-count").textContent=String(la.filter(s=>s.status==="open"||s.status==="started").length),Re("#order-count").hidden=Re("#order-count").textContent==="0";let e=la.filter(s=>s.status==="open"||s.status==="started"),t=Si.split(/[\\/]/).slice(-2).join("/"),i=la.map(s=>{let r=s.requirement.replace(/^(?:Modify the selected elements\.|Create a new element using the selected elements as references\. Preserve the original elements\.)\s+/,"").replace(/\s+/g," ").trim(),o=r.length>64?`${r.slice(0,63)}\u2026`:r,a=r.length>200?`${r.slice(0,199)}\u2026`:r;return`<details class="journal-record order-card" data-status="${Ue(s.status)}" data-order-id="${Ue(s.id)}" ${n.has(s.id)?"open":""}><summary title="${Ue(s.requirement)}" aria-label="Work order ${Ue(s.id)}: ${Ue(a)}. Status ${Ue(s.status)}"><span class="record-main"><span class="record-title">${Ue(o)}</span><span class="order-status">${Ue(s.status)}</span></span><span class="record-sub">${Ue(s.id)} \xB7 ${Ue(s.createdAt.slice(0,16).replace("T"," "))} UTC</span></summary><div class="record-detail"><p>${Ue(s.requirement)}</p>${vm(s,td)}<small>${s.selectedIds.length} target${s.selectedIds.length===1?"":"s"}</small><div class="order-card-actions"><button type="button" data-order-action="copy" data-order-id="${Ue(s.id)}">Copy for agent</button><button type="button" data-order-action="highlight" data-order-id="${Ue(s.id)}" ${s.snapshotHash===td?"":'disabled title="Scene changed; review frozen context"'}>Select targets</button></div><details class="proof-data"><summary>Frozen context and activity</summary><pre>${Ue(JSON.stringify(s.context,null,2))}</pre><pre>${Ue(JSON.stringify(s.history,null,2))}</pre></details></div></details>`});Os.innerHTML=`<div class="order-toolbar"><button type="button" data-order-action="copy-open" ${e.length?"":"disabled"}>Copy open orders</button><button type="button" data-order-action="refresh">Refresh</button></div><p class="journal-caption" title="${Ue(Si)}">${e.length} open \xB7 ${Si?Ue(t):"Loading journal\u2026"}</p>${i.length?i.join(""):'<p class="empty">No work orders for this scene. Select elements, describe the change below the canvas, then add a work order.</p>'}`}function Bc(){return ji===void 0?void 0:si.find(n=>n.sequence===ji)}function wm(){for(let n of la){let e=[...Os.querySelectorAll("[data-order-id]")].find(r=>r.dataset.orderId===n.id);if(!e)continue;let t=n.context,i=t?.source==="scene-history"&&t.history?t.history:void 0;i&&e.querySelector(".record-detail")?.insertAdjacentHTML("afterbegin",'<p class="order-history-source">Based on history #'+i.sequence+" \xB7 "+Ue(i.action)+"</p>");let s=e.querySelector('[data-order-action="highlight"]');s&&(!n.selectedIds.length||!n.selectedIds.every(r=>!!te?.elements[r]))&&(s.disabled=!0,s.title="Some or all historical targets are no longer in this scene.")}}function lo(){let n=Bc();if(!n){Yi.hidden=!0,Yi.replaceChildren(),Tm&&ji!==void 0&&(ji=void 0,Un());return}let e=Object.keys(n.elements),t=e.filter(i=>!!te?.elements[i]);Yi.hidden=!1,Yi.innerHTML=`<span class="history-source-copy"><strong>Based on history #${n.sequence} \xB7 ${Ue(n.action)}</strong><small>${t.length} of ${e.length} changed target${e.length===1?"":"s"} still in this scene${e.length?"":" \xB7 metadata only"}</small></span><button type="button" data-history-source-action="remove" aria-label="Remove history source">Remove history</button>`}function zc(){Re("#history-count").textContent=String(si.length),Re("#history-count").hidden=si.length===0;let n=si[0];Ri.hidden=!n,Ri.textContent=n?`Latest change: ${n.action} \xB7 View history`:"";let e=new Set([...Us.querySelectorAll("details[data-history-sequence][open]")].map(i=>i.dataset.historySequence)),t=Si.split(/[\\/]/).slice(-2).join("/");Us.innerHTML=`<div class="order-toolbar"><button type="button" data-history-action="copy">Copy for AI</button><button type="button" data-history-action="refresh">Refresh</button></div><p class="journal-caption" title="${Ue(Si)}">${si.length} change${si.length===1?"":"s"} \xB7 ${Si?Ue(t):"Loading journal\u2026"}</p>${si.length?si.slice(0,id).map(i=>`<details class="journal-record history-card" data-history-sequence="${i.sequence}" ${e.has(String(i.sequence))?"open":""}><summary><span class="record-main"><span class="record-title">#${i.sequence} ${Ue(i.action)}</span><span class="record-source">${Ue(i.source)}</span></span><span class="record-sub">${Ue(i.at.slice(0,16).replace("T"," "))} UTC \xB7 ${Object.keys(i.elements).length} element${Object.keys(i.elements).length===1?"":"s"}</span></summary><div class="record-detail">${_m(i)}<div class="history-card-actions"><button type="button" data-history-action="order" data-history-sequence="${i.sequence}">Use for work order</button></div><details class="proof-data"><summary>Full snapshot evidence</summary><p>Before SHA-256: <code>${Ue(i.beforeTextHash)}</code><br>After SHA-256: <code>${Ue(i.afterTextHash)}</code></p><pre>${Ue(JSON.stringify({beforeMetadata:i.beforeMetadata,afterMetadata:i.afterMetadata,elements:i.elements},null,2))}</pre></details></div></details>`).join(""):'<p class="empty">No scene changes recorded yet. Move, rotate, resize, edit properties, or modify the scene source to create an entry.</p>'}${si.length>id?'<button type="button" data-history-action="more">Show older changes</button>':""}`,lo()}function fd(n,e=!1){te&&(n?e?ye=ye.includes(n)?ye.filter(t=>t!==n):[...ye,n]:(!ye.includes(n)||ye.length!==1)&&(ye=[n]):ye=[],wi&&ai++,n&&pn(te,n).forEach(t=>dr.delete(t.id)),n&&En("inspector"),$i(),bi(),Wn())}function Xn(n,e=vn){Ut||pt||!te||(pt=!0,Jt(),bi(),_t({type:"edit",version:e,operation:n}),clearTimeout(Ei),Ei=setTimeout(()=>{pt=!1,Jt(),_t({type:"ready"})},5e3))}function aa(n,e){Xn({kind:"update",updates:[{id:n,changes:e}]})}function bi(){if(te){if(Sm!==te.mode){Je?.dispose(),_n.replaceChildren(),Je=void 0,Sm=te.mode,Uc=void 0;try{let n={activateSelection:()=>En("inspector"),editViewport:e=>Vc.edit(e),select:(e,t)=>{let i=e&&te&&[...pn(te,e),te.elements[e]].find(s=>s.properties.componentId);fd(i?i.id:e,t)},commit:(e,t)=>Xn({kind:"update",updates:e},t),error:e=>Lt(e,!0)};Je=te.mode==="2d"?new ns(_n,n):new zn(_n,n)}catch(n){_n.textContent="WebGL is unavailable. Use Reveal Source to edit the scene source; enable WebGL to use the 3D viewport.",Lt(String(n),!0)}}Je&&Je.setAssets(Fc),Vc.setState(te,Fc,vn,Ut||pt),Je instanceof zn&&Je.setGridVisible(hr),Je?.setState(te,ye,vn,Ut||pt),Je&&Uc!==oi&&(Je.setTool(oi),Uc=oi)}}var Vc=new Nc({previews:n=>{Je instanceof ns&&Je.setViewportImages(n)},commit:(n,e)=>Xn(n,e),insertImage:(n,e)=>_t({type:"insertImage",viewportId:n,version:e}),error:n=>Lt(n,!0)});function Jt(){li.style.display=te?.mode==="3d"?"":"none";let n=Ut||pt,e=co(Ct.value),t=e.length>12e3;document.querySelectorAll("button").forEach(c=>{if(c.closest("[data-host-controls]"))return;if(c.dataset.panel){c.disabled=!1;return}if(c.dataset.orderAction)return;if(c.dataset.rotateStep||c.hasAttribute("data-rotate-reset")){c.disabled=n||!te||ye.length!==1||St(te,ye[0]);return}let h=c.dataset.testid||"";c.disabled=n&&!["fit-scene","reveal-json"].includes(h),["copy-ai","copy-reference","duplicate","delete","sidebar-delete","reveal-json","add-work-order","sidebar-hide-selection","order-modify","order-similar"].includes(h)&&!ye.length&&(h!=="add-work-order"||!Bc())&&(c.disabled=!0),h==="add-work-order"&&(c.disabled||=ri||wi||!Ct.value.trim()||t,c.title=ri?so?"Waiting for autosave before adding a work order.":"Save the scene before adding a work order.":"Select targets and describe the change. Ctrl+Enter to add."),(h==="copy-ai"||h==="copy-reference")&&(c.disabled||=t)});let i=Re('[data-testid="sidebar-insert-image"]');i.disabled=n,i.title=te?.mode==="2d"?"Choose a PNG or JPEG":"Image insertion is available in 2D drawings";let s=te?Pi(te,ye):[],r=Re('[data-testid="sidebar-hide-selection"]');r.textContent=s.some(c=>te.elements[c].visible)?"Hide selected":"Show selected",$n.disabled=n||wi,fr.disabled=n||!ri,fr.hidden=!ri,uo.textContent=Ut?"Repair the scene source to continue.":pt?"Applying change\u2026":wi?"Saving work order\u2026":!ye.length&&!Bc()?"1. Select an image or component to use as the target.":t?`Shorten the brief by ${e.length-12e3} characters to fit the 12,000-character limit.`:ri?so?"2. Waiting for autosave to freeze the current selection for your agent.":"2. Save scene to freeze the current selection for your agent.":Ct.value.trim()?"Ready: Add work order, then copy it from Orders to your agent.":"3. Describe the change or the new element you want.",Re("#brief-length").textContent=`${e.length.toLocaleString()} / ${12e3.toLocaleString()}`,ua.classList.toggle("over-limit",t),Re("#brief-preview").textContent=e||"Write your idea above to review the instruction here. Selected geometry is included in the full AI handoff.",Hc.innerHTML=`<span>${te?.mode==="3d"?"3D scene":"2D drawing"}</span><small>${ye.length?`${ye.length} selected`:"Design canvas"}</small>`;let o=ye.map(c=>te?.elements[c]).filter(Boolean);ca.textContent=o.length?`${te?.mode==="3d"?"3D":"2D"} targets: ${o.slice(0,3).map(c=>c.name).join(", ")}${o.length>3?` +${o.length-3} more`:""}`:"Select the parts of your figure that explain your idea to the agent.",ca.title=o.map(c=>`${c.name} (${c.type}) \xB7 ${c.id}`).join(`
`);let a=Re("#transform-tool");a.value=oi,a.disabled=n||!ye.length;let l=te&&ye.some(c=>!St(te,c));Fs.querySelectorAll("button").forEach(c=>{c.disabled=n||!l,c.dataset.transformTool&&c.setAttribute("aria-pressed",String(c.dataset.transformTool===oi))}),Ji.setEnabled(!n&&!!te,!!ye.length)}function Yc(){if(!te)return;let n=Object.values(te.elements);Re("#count").textContent=String(n.length);let e=document.activeElement?.closest(".tree-row")?.dataset.elementId,t=new Map;for(let l of n){let c=t.get(l.parent)??[];c.push(l),t.set(l.parent,c)}let i=new Set(ye),s=Ti.value.trim().toLocaleLowerCase(),r=n.filter(l=>!s||`${l.name} ${l.type} ${l.id}`.toLocaleLowerCase().includes(s)),o=new Set(r.flatMap(l=>[l.id,...pn(te,l.id).map(c=>c.id)]));Re("#count").textContent=s?`${r.length}/${n.length}`:String(n.length);let a=(l,c=0)=>(t.get(l)??[]).filter(h=>o.has(h.id)).map(h=>{let d=!!t.get(h.id)?.length,u=!!s||!dr.has(h.id),p=d?`<button data-collapse="${h.id}" aria-label="${u?"Collapse":"Expand"} ${Ue(h.name)}" aria-expanded="${u}">${u?"\u2304":"\u203A"}</button>`:'<span class="tree-spacer" aria-hidden="true"></span>';return`<div class="tree-row ${i.has(h.id)?"selected":""} ${h.visible?"":"dim"}" data-element-id="${h.id}" role="treeitem" ${d?`aria-expanded="${u}"`:""} aria-level="${c+1}" tabindex="0" aria-label="${Ue(h.name)} (${Ue(h.type)})" aria-selected="${i.has(h.id)}" title="${Ue(h.name)} (${Ue(h.type)})"><span class="indent">${"\xB7 ".repeat(Math.min(c,8))}</span>${p}<button data-visible="${h.id}" aria-label="${h.visible?"Hide":"Show"} ${Ue(h.name)}" title="Toggle visibility">${h.visible?"\u25C9":"\u25CB"}</button><button data-locked="${h.id}" aria-label="${h.locked?"Unlock":"Lock"} ${Ue(h.name)}" title="Toggle lock">${h.locked?"\u25A3":"\u25A1"}</button><span class="element-name">${Ue(h.name)}</span><small>${Ue(h.type)}</small></div>${u?a(h.id,c+1):""}`}).join("");Zi.innerHTML=a()||`<p class="empty">${s?"No matching elements. Try a name or type.":"Start by inserting an element."}</p>`,e&&[...Zi.querySelectorAll(".tree-row")].find(c=>c.dataset.elementId===e)?.focus()}Zi.addEventListener("click",n=>{let e=n.target,t=e.closest("[data-collapse]");if(t){Rm(t.dataset.collapse);return}let i=e.closest("[data-visible],[data-locked]");if(i){let r=i.dataset.visible||i.dataset.locked,o=te?.elements[r];o&&aa(r,i.dataset.visible?{visible:!o.visible}:{locked:!o.locked});return}let s=e.closest(".tree-row");s&&fd(s.dataset.elementId,n.shiftKey)});function Rm(n){Ti.value.trim()||(dr.has(n)?dr.delete(n):dr.add(n),Yc(),Un(),[...Zi.querySelectorAll(".tree-row")].find(e=>e.dataset.elementId===n)?.focus())}Zi.addEventListener("keydown",n=>{if(n.target===n.target.closest(".tree-row")){if(n.key==="ArrowLeft"||n.key==="ArrowRight"){n.preventDefault();let e=n.target,t=e.dataset.elementId,i=e.getAttribute("aria-expanded");if(n.key==="ArrowLeft"&&i==="true"||n.key==="ArrowRight"&&i==="false")Rm(t);else{let s=n.key==="ArrowLeft"?te?.elements[t]?.parent:Object.values(te?.elements??{}).find(r=>r.parent===t)?.id;[...Zi.querySelectorAll(".tree-row")].find(r=>r.dataset.elementId===s)?.focus()}return}if(["ArrowDown","ArrowUp","Home","End"].includes(n.key)){n.preventDefault();let e=[...Zi.querySelectorAll(".tree-row")],t=e.indexOf(n.target),i=n.key==="Home"?0:n.key==="End"?e.length-1:Math.max(0,Math.min(e.length-1,t+(n.key==="ArrowDown"?1:-1)));e[i]?.focus();return}n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),fd(n.target.dataset.elementId,n.shiftKey))}});function oa(n,e,t,i="text",s=!1){let r={strokeWidth:"Stroke width",fontSize:"Font size",src:"Image source",d:"SVG path"}[n]??n,o=`<input data-prop="${e}" type="${i}" ${i==="number"?'step="any"':""} value="${Ue(t)}" ${s?"disabled":""}/>`,a=(e==="fill"||e==="stroke")&&/^#[0-9a-f]{6}$/i.test(String(t));return`<label class="field"><span>${Ue(r)}</span>${a?`<span class="color-field">${o}<input data-color-prop="${e}" type="color" value="${Ue(t)}" aria-label="Choose ${Ue(r.toLowerCase())} color" ${s?"disabled":""}/></span>`:o}</label>`}function ed(n,e,t,i,s){return`<label class="field"><span>${Ue(n)}</span><select data-prop="${e}" ${s?"disabled":""}>${i.map(([r,o])=>`<option value="${r}" ${String(t)===r?"selected":""}>${Ue(o)}</option>`).join("")}</select></label>`}function Cm(){if(!te)return;let e=(document.activeElement instanceof HTMLInputElement&&dn.contains(document.activeElement)?document.activeElement:void 0)?.dataset.prop,t=dn.dataset.elementId,i=ye.map(y=>te.elements[y]).filter(Boolean);if(i.length!==1){dn.innerHTML=`<p class="empty">${i.length?`${i.length} elements selected. Drag them together in 2D, or select one to edit properties.`:"Select an element on the canvas or in the scene tree."}</p>`;return}let s=t===i[0].id&&dn.querySelector(".inspector-reference")?.open;dn.dataset.elementId=i[0].id;let r=i[0],o=St(te,r.id)||Ut||pt,a=r.transform,l=r.properties,c=te.mode==="2d"?[0,1]:[0,1,2],h=Object.values(te.elements).filter(y=>y.type==="group"&&y.id!==r.id&&!pn(te,y.id).some(f=>f.id===r.id)),d=r.type==="image"?Fc[String(l.src)]:void 0,u=d?`<img src="${Ue(d)}" alt=""/>`:`<span class="selection-symbol">${qi(r.type==="group"?"components":"fit")}</span>`;if(dn.innerHTML=`<div class="selection-card">${u}<div><strong>${Ue(r.name)}</strong><small>${Ue(r.type)}${St(te,r.id)?" \xB7 Locked":""}</small></div></div>${oa("Name","name",r.name,"text",o)}<details class="inspector-reference" ${s?"open":""}><summary>Reference ID</summary><code class="element-id">${r.id}</code></details><h3>Position</h3>${c.map(y=>oa("XYZ"[y],`position.${y}`,a.position[y],"number",o)).join("")}<h3>Rotation${te.mode==="3d"?" (radians)":""}</h3>${te.mode==="2d"?`<label class="field"><span>Angle (\xB0)</span><input type="number" step="1" data-rotation-degrees data-testid="rotation-degrees" aria-label="Rotation angle in degrees" value="${Ue(Number((a.rotation[2]*180/Math.PI).toFixed(3)))}" ${o?"disabled":""}/></label><div class="quick-rotation"><button type="button" data-rotate-step="-90" aria-label="Rotate selected 90 degrees counterclockwise" ${o?"disabled":""}>\u21B6 \u221290\xB0</button><button type="button" data-rotate-step="90" aria-label="Rotate selected 90 degrees clockwise" ${o?"disabled":""}>\u21B7 +90\xB0</button><button type="button" data-rotate-reset aria-label="Reset rotation" ${o?"disabled":""}>Reset</button></div><p class="rotation-value">${Ue((a.rotation[2]*180/Math.PI).toFixed(1))}\xB0</p>`:""}${(te.mode==="2d"?[2]:c).map(y=>oa("XYZ"[y],`rotation.${y}`,a.rotation[y],"number",o)).join("")}<h3>Scale</h3>${c.map(y=>oa("XYZ"[y],`scale.${y}`,a.scale[y],"number",o)).join("")}<h3>Appearance & geometry</h3>${Object.entries(l).filter(([y])=>["width","height","depth","radius","fill","stroke","strokeWidth","opacity","fontSize","text","d","src","points","background"].includes(y)).map(([y,f])=>oa(y,y,y==="points"?JSON.stringify(f):f,typeof f=="number"?"number":"text",o)).join("")}${r.type==="text"?`<h3>Typography</h3>${ed("Alignment","textAnchor",l.textAnchor??"start",[["start","Left"],["middle","Center"],["end","Right"]],o)}${ed("Font","fontFamily",l.fontFamily??"sans-serif",[["sans-serif","Sans serif"],["serif","Serif"],["monospace","Monospace"]],o)}${ed("Weight","fontWeight",l.fontWeight??400,[["100","100 \xB7 Thin"],["200","200 \xB7 Extra light"],["300","300 \xB7 Light"],["400","400 \xB7 Regular"],["500","500 \xB7 Medium"],["600","600 \xB7 Semibold"],["700","700 \xB7 Bold"],["800","800 \xB7 Extra bold"],["900","900 \xB7 Black"]],o)}`:""}<h3>Hierarchy</h3><label class="field"><span>Parent</span><select data-prop="parent" ${o?"disabled":""}><option value="">Root</option>${h.map(y=>`<option value="${y.id}" ${y.id===r.parent?"selected":""}>${Ue(y.name)} (${Ue(y.id.slice(0,8))})</option>`).join("")}</select></label><p class="hint">${te.mode==="2d"?"Drag the round handle to rotate; hold Shift for 15\xB0 steps. Drag square handles to resize. Degree controls preserve the visual center; raw transforms are local to the parent.":"Transforms are local to the parent. Rotations and scaling use the element origin."}</p>`,dn.querySelectorAll("[data-rotate-step]").forEach(y=>{y.onclick=()=>{Je instanceof ns&&Je.rotateSelected(Number(y.dataset.rotateStep))}}),r.type==="viewport3d"){let y=document.createElement("button");y.textContent="Edit 3D view",y.dataset.testid="edit-viewport",y.disabled=o,y.onclick=()=>Vc.edit(r.id),dn.prepend(y)}let p=dn.querySelector("[data-rotation-degrees]");p&&(p.onchange=()=>{let y=Number(p.value);p.value.trim()&&Number.isFinite(y)&&Je instanceof ns?Je.rotateSelected(y,!0):Lt("Enter a finite rotation angle in degrees.",!0)});let g=dn.querySelector("[data-rotate-reset]");if(g&&(g.onclick=()=>{Je instanceof ns&&Je.rotateSelected(0,!0)}),dn.querySelectorAll("[data-prop]").forEach(y=>y.onchange=()=>{try{let f=y.dataset.prop;if(f==="name")aa(r.id,{name:y.value});else if(f==="parent")aa(r.id,{parent:y.value||null});else if(f.includes(".")){let[m,x]=f.split("."),v=structuredClone(a),M=Number(y.value);if(!Number.isFinite(M))throw new Error("Enter a finite number.");v[m][Number(x)]=M,aa(r.id,{transform:v})}else{let m=f==="fontWeight"?Number(y.value):f==="points"?JSON.parse(y.value):y instanceof HTMLInputElement&&y.type==="number"?Number(y.value):y.value;aa(r.id,{properties:{[f]:m}})}}catch(f){Lt(String(f),!0),Cm()}}),dn.querySelectorAll("[data-color-prop]").forEach(y=>{let f=()=>{let m=dn.querySelector(`[data-prop="${y.dataset.colorProp}"]`);!m||m.value===y.value||(m.value=y.value,m.dispatchEvent(new Event("change",{bubbles:!0})))};y.oninput=f,y.onchange=f}),e&&t===r.id){let y=[...dn.querySelectorAll("[data-prop]")].find(f=>f.dataset.prop===e);y&&!y.disabled&&y.focus({preventScroll:!0})}}function $i(){Yc(),Cm(),Jt()}function pd(n){!te||Ut||pt||!ye.length||co(Ct.value).length>12e3||_t({type:"copy",version:vn,ids:ye,instruction:co(Ct.value),compact:n})}function co(n){return bm({instruction:n,keep:mo.value,success:go.value,intent:$n.value})}function Im(){let n=Bc();!te||Ut||pt||ri||wi||!ye.length&&!n||!Ct.value.trim()||co(Ct.value).length>12e3||(nd=ai,wi=!0,Jt(),_t({type:"workOrderAdd",version:vn,ids:[...ye],requirement:co(Ct.value),...n?{historySequence:n.sequence}:{}}))}function Pm(n){if(!te||Ut||pt)return;if(n==="image"){_t({type:"insertImage",version:vn});return}let e=hi(n,te.mode);if(e.name=`${n} ${Object.keys(te.elements).length+1}`,Je){let t=_n.getBoundingClientRect();e.transform.position=Je.placementPoint(t.x+t.width/2,t.y+t.height/2)}cr=e.id,Xn({kind:"insert",element:e})}var WM={viewport3d:'<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m12 6 6 3v6l-6 3-6-3V9zM6 9l6 3 6-3M12 12v6"/>',rect:'<rect x="4" y="5" width="16" height="14" rx="1"/>',ellipse:'<ellipse cx="12" cy="12" rx="9" ry="7"/>',line:'<path d="M4 19 20 5"/>',polyline:'<path d="M3 18 8 8 14 15 21 5"/>',path:'<path d="M3 17c4-15 9 12 18-10"/><circle cx="3" cy="17" r="1"/><circle cx="21" cy="7" r="1"/>',text:'<path d="M4 6h16M12 6v14M8 20h8"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1"/><path d="m4 18 6-6 4 3 3-4 4 5"/>',group:'<rect x="3" y="5" width="11" height="11" rx="1"/><rect x="10" y="9" width="11" height="11" rx="1"/>',box:'<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10"/>',sphere:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',cylinder:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 19c0-1.7 3.6-3 8-3s8 1.3 8 3"/>',plane:'<path d="m3 15 13-11 5 5-13 11zM8 20l13-11"/>'};function XM(){if(!te)return;let n=te.mode==="2d"?["rect","ellipse","line","polyline","path","text","image","viewport3d","group"]:["box","sphere","cylinder","plane","image","group"];Re("#insert-buttons").innerHTML=n.map(e=>{let t=e==="viewport3d"?"3D view":e[0].toUpperCase()+e.slice(1);return`<button type="button" data-testid="insert-${e}" data-insert="${e}" title="Insert ${t}" aria-label="Insert ${t}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${WM[e]}</svg></button>`}).join(""),document.querySelectorAll("[data-insert]").forEach(e=>e.onclick=()=>Pm(e.dataset.insert))}async function Lm(){if(!te||Ut||pt)return;let n=vn;try{if(te.mode==="2d"){let e=await Vc.snapshots();if(vn!==n)throw new Error("Scene changed during export. Try again.");_t({type:"export",version:n,format:"svg",data:"",viewportImages:e})}else if(Je instanceof zn){let e=await Je.exportGlb();if(vn!==n)throw new Error("Scene changed during export. Try again.");let t=new Uint8Array(e),i="";for(let s=0;s<t.length;s+=32768)i+=String.fromCharCode(...t.subarray(s,s+32768));_t({type:"export",version:n,format:"glb",data:btoa(i)})}}catch(e){Lt(String(e),!0)}}window.addEventListener("message",n=>{let e=n.data;if(e.type==="state"){let t=te?.id!==e.scene.id;t&&(oi="translate"),(te?.id!==e.scene.id||te.mode!==e.scene.mode)&&kc();let i=te?.mode!==e.scene.mode;te=e.scene,document.body.dataset.documentId=te.id,vn=e.version,ri=e.dirty,Fc=e.assets,ju=e.warnings,Ut=!1,pt=!1,clearTimeout(Ei),ye=ye.filter(s=>!!te.elements[s]),cr&&te.elements[cr]?(ye=[cr],cr=void 0):!ye.length&&et.selection?.length&&!Je&&(ye=et.selection.filter(s=>!!te.elements[s])),Re("#mode").textContent=te.mode.toUpperCase(),Re("#units").textContent=`${te.units} \xB7 ${te.mode==="2d"?"x \u2192, y \u2193":"right-handed \xB7 y \u2191"}`,i&&(XM(),Ji.setEntries(Ju,te.mode,Ku,Qu)),Re("#warning").hidden=!ri&&!ju.length,so=e.autoSave===!0,Re("#warning").textContent=[ri?so?"Unsaved changes \u2014 waiting for autosave before asking an agent to edit the file.":"Unsaved changes \u2014 save before asking an agent to edit the file.":"",...ju].filter(Boolean).join(" "),$i(),bi(),t&&Je?.fit(),lo(),Lt(`${ri?"Unsaved":"Saved"} \xB7 ${Object.keys(te.elements).length} elements \xB7 version ${vn}`),Wn()}else if(e.type==="components")Ju=e.entries,Ku=e.warnings,Qu=e.directory,Ji.setEntries(Ju,te?.mode??"2d",Ku,Qu),Jt();else if(e.type==="invalid")kc(),Ut=!0,pt=!1,clearTimeout(Ei),Re("#warning").hidden=!1,Re("#warning").textContent=`Invalid scene source \u2014 showing last valid preview. ${e.errors.join(" ")}`,$i(),bi(),Lt("Editing and copying disabled until the scene source is repaired.",!0);else if(e.type==="error")e.message.startsWith("Autosave paused:")&&(so=!1,Re("#warning").hidden=!1,Re("#warning").textContent=e.message),pt=!1,wi=!1,cr=void 0,clearTimeout(Ei),$i(),bi(),Lt(e.message,!0);else if(e.type==="workOrders")la=e.orders,Si=e.queuePath,td=e.currentHash,rd(),wm(),zc();else if(e.type==="sceneHistory")si=e.entries,Tm=!0,Si=e.journalPath,rd(),wm(),zc();else if(e.type==="workOrderAdded"){wi=!1;let t=ai===nd;t&&(Ct.value="",mo.value="",go.value="",ji=void 0,ai++,Wn(),lo()),nd=void 0,t&&En("orders"),Jt(),Lt(`Work order ${e.id} saved${t?"":" \xB7 Your new draft is kept"}`)}else e.type==="workOrderSelected"?(ye=e.ids.filter(t=>!!te?.elements[t]),En("inspector"),$i(),bi(),Wn()):e.type==="elementPasted"?(ye=e.ids,wi&&ai++,En("inspector"),$i(),bi(),Wn(),Lt(so?"Pasted elements. Autosave and History update automatically.":"Pasted elements recorded in History. Save scene to persist them.")):e.type==="copied"?Lt(e.message):e.type==="exportRequest"&&Lm()});for(let n of[Ct,mo,go])n.addEventListener("input",()=>{ai++,Wn(),Jt()}),n.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&!e.isComposing&&(e.preventDefault(),Im())});mr.onclick=Im;fr.onclick=()=>{!te||Ut||pt||!ri||(pt=!0,Jt(),_t({type:"saveScene",version:vn}),clearTimeout(Ei),Ei=setTimeout(()=>{pt=!1,Jt(),_t({type:"ready"})},5e3))};$n.onchange=()=>{ai++,Wn(),Jt()};Re('[data-testid="sidebar-insert-image"]').onclick=()=>Pm("image");Re('[data-testid="sidebar-hide-selection"]').onclick=()=>{if(!te||Ut||pt||!ye.length)return;let n=Pi(te,ye),e=!n.some(t=>te.elements[t].visible);Xn({kind:"update",updates:n.map(t=>({id:t,changes:{visible:e}}))})};for(let n of["modify","similar"])Re(`[data-testid="order-${n}"]`).onclick=()=>{$n.value=n,ai++,En("inspector"),Ct.placeholder=n==="similar"?"Describe the new image or component to create from this reference\u2026":"Describe what the agent should change\u2026",$c(!0),Ct.focus(),Wn(),Jt(),Lt("Describe the requirement, save the scene, then Add work order. Use Orders to copy it for your agent.")};Ai.addEventListener("click",n=>{let e=n.target.closest("[data-panel]")?.dataset.panel;(e==="inspector"||e==="components"||e==="orders"||e==="history")&&En(e)});Ai.addEventListener("keydown",n=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(n.key))return;let e=[...Ai.querySelectorAll("[data-panel]")],t=e.indexOf(n.target);if(t<0)return;n.preventDefault(),n.stopPropagation();let i=n.key==="Home"?0:n.key==="End"?e.length-1:(t+(n.key==="ArrowRight"?1:-1)+e.length)%e.length,s=e[i];s.click(),s.focus({preventScroll:!0})});Ri.onclick=()=>{En("history"),Us.querySelector(".history-card")?.setAttribute("open","")};Us.addEventListener("click",n=>{let e=n.target,t=e.closest('[data-history-action="order"]');if(t?.dataset.historySequence){let r=Number(t.dataset.historySequence),o=si.find(c=>c.sequence===r);if(!o)return;ji=r;let a=`Based on history #${o.sequence} \xB7 ${o.action}`,l=Ct.value.trim();Ct.value=l?`${l}

${a}`:o.action,ye=Object.keys(o.elements).filter(c=>!!te?.elements[c]),ai++,lo(),En("inspector"),$c(!0),$i(),bi(),Wn(),Lt(`${a} \xB7 review the brief before adding the work order.`);return}if(e.closest('[data-history-source-action="remove"]')){ji=void 0,lo(),Jt(),Un(),Lt("History source removed; your draft is kept.");return}let s=e.closest("[data-history-action]")?.dataset.historyAction;s==="refresh"?_t({type:"historyRefresh"}):s==="copy"?_t({type:"historyCopy"}):s==="more"&&(id+=50,zc())});Yi.addEventListener("click",n=>{n.target.closest('[data-history-source-action="remove"]')&&(ji=void 0,ai++,lo(),Jt(),Wn(),Un(),Lt("History source removed; your draft is kept."))});Os.addEventListener("click",n=>{let e=n.target.closest("[data-order-action]");!e||e.disabled||(e.dataset.orderAction==="refresh"?_t({type:"workOrderRefresh"}):e.dataset.orderAction==="copy-open"?_t({type:"workOrderCopy"}):e.dataset.orderAction==="copy"?_t({type:"workOrderCopy",id:e.dataset.orderId}):e.dataset.orderAction==="highlight"&&e.dataset.orderId&&_t({type:"workOrderHighlight",id:e.dataset.orderId}))});Ns.addEventListener("change",()=>{ao=Ns.value;for(let[n,e]of Object.entries({"fit-scene":"fit",duplicate:"duplicate",delete:"delete","reveal-json":"code",export:"export"})){let t=document.querySelector(`[data-testid="${n}"]`),i=t.textContent??"";t.setAttribute("aria-label",i),t.title=i,t.innerHTML=`${qi(e)}<span class="button-label">${i}</span>`}document.body.dataset.theme=ao,Je instanceof zn&&Je.setTheme(),Un()});new MutationObserver(()=>{ao==="vscode"&&Je instanceof zn&&Je.setTheme()}).observe(document.body,{attributes:!0,attributeFilter:["class"]});Re('[data-testid="fit-scene"]').onclick=()=>Je?.fit();Re('[data-testid="duplicate"]').onclick=()=>{ye.length&&Xn({kind:"duplicate",ids:ye})};Re('[data-testid="delete"]').onclick=()=>{ye.length&&Xn({kind:"delete",ids:ye})};Re('[data-testid="copy-reference"]').onclick=()=>pd(!0);Re('[data-testid="copy-ai"]').onclick=()=>pd(!1);Re('[data-testid="reveal-json"]').onclick=()=>{ye[0]&&_t({type:"reveal",id:ye[0]})};Re('[data-testid="export"]').onclick=()=>void Lm();function md(n){oi=n,Je?.setTool(oi),Uc=oi,Jt(),_n.focus({preventScroll:!0}),Lt(oi==="rotate"?"Drag the round handle to rotate. Hold Shift for 15\xB0 steps.":oi==="scale"?"Drag a square handle to resize. Image corners preserve proportions; Shift constrains shapes.":"Drag to move. Hold Shift to keep movement horizontal or vertical.")}Re("#transform-tool").onchange=()=>{md(Re("#transform-tool").value)};window.addEventListener("keydown",n=>{if(n.key==="Escape"&&(oo||Ji.isOpen())){kc(),Ji.setOpen(!1),On.setAttribute("aria-expanded","false"),Lt("Component placement closed.");return}let e=n.target;if(!e.closest('input,textarea,select,[contenteditable="true"]')){if(!n.ctrlKey&&!n.metaKey&&!n.altKey&&!n.shiftKey&&te&&!Ut&&!pt&&ye.length){let t={v:"translate",r:"rotate",s:"scale"}[n.key.toLowerCase()];if(t){n.preventDefault(),md(t);return}}if((n.ctrlKey||n.metaKey)&&!n.altKey&&!n.shiftKey){let t=n.key.toLowerCase();if(t==="c"){if(window.getSelection()?.toString())return;n.preventDefault(),te&&!Ut&&!pt&&ye.length&&_t({type:"elementCopy",version:vn,ids:[...ye]});return}if(t==="v"){if(n.preventDefault(),!te||Ut||pt)return;pt=!0,Jt(),_t({type:"elementPaste",version:vn}),clearTimeout(Ei),Ei=setTimeout(()=>{pt=!1,Jt(),_t({type:"ready"})},5e3);return}}if((n.ctrlKey||n.metaKey)&&!n.altKey&&!n.shiftKey&&n.key.toLowerCase()==="a"){if(n.preventDefault(),!te||Ut||pt||!ye.length)return;let t=!!e.closest("#tree"),i=Pi(te,[...new Set(ye.map(r=>te.elements[r]?.parent??r))]);if(i.length===ye.length&&i.every(r=>ye.includes(r))){Lt("Already at the top-level component.");return}ye=i,wi&&ai++,ye.forEach(r=>pn(te,r).forEach(o=>dr.delete(o.id))),En("inspector"),$i();let s=[...Zi.querySelectorAll(".tree-row")].find(r=>r.dataset.elementId===ye[0]);!s&&Ti.value&&(Ti.value="",Yc(),s=[...Zi.querySelectorAll(".tree-row")].find(r=>r.dataset.elementId===ye[0])),s?.scrollIntoView({block:"nearest"}),t&&s?.focus({preventScroll:!0}),bi(),Wn(),Lt(`Parent component selected: ${ye.map(r=>te.elements[r].name).join(", ")} \xB7 Ctrl+A to move up again`);return}if(e===_n&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(n.key)){if(n.preventDefault(),!te||Ut||pt||!ye.length)return;let t=(te.mode==="2d"?1:.1)*(n.shiftKey?10:1),i=n.key==="ArrowLeft"||n.key==="ArrowRight"?0:1,s=i===0?n.key==="ArrowLeft"?-1:1:(n.key==="ArrowUp"?-1:1)*(te.mode==="2d"?1:-1),r=Pi(te,ye).filter(o=>!St(te,o)).map(o=>{let a=structuredClone(te.elements[o].transform);return a.position[i]+=t*s,{id:o,changes:{transform:a}}});r.length&&Xn({kind:"update",updates:r});return}["Delete","Backspace"].includes(n.key)&&ye.length&&(n.preventDefault(),Xn({kind:"delete",ids:ye})),(n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="d"&&(n.preventDefault(),ye.length&&Xn({kind:"duplicate",ids:ye})),(n.ctrlKey||n.metaKey)&&n.shiftKey&&n.key.toLowerCase()==="c"&&(n.preventDefault(),pd(!1)),n.key==="Escape"&&(ye=[],$i(),bi(),Wn())}});window.addEventListener("beforeunload",()=>{Je?.dispose(),clearTimeout(Ei)});Jt();En(pr);rd();zc();_t({type:"ready"});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
