import{e as k,H as A,a as b,s as v,b as H,h as q,c as m,d as I,i as D,f as M,g as E,j as P,P as Y}from"./disclose-version.B2QKOKZv.js";import{t as j,q as B,d as C,i as V,f as O,h as W,a as $,e as z,b as F,p as G,c as J,g as K,j as Q}from"./runtime.ZUG1ED2p.js";function U(a){console.warn("hydration_mismatch")}const N=new Set,T=new Set;function X(a,r,n,o){function e(t){if(o.capture||y.call(r,t),!t.cancelBubble)return n.call(this,t)}return a.startsWith("pointer")||a==="wheel"?B(()=>{r.addEventListener(a,e,o)}):r.addEventListener(a,e,o),e}function ar(a,r,n,o,e){var t={capture:o,passive:e},_=X(a,r,n,t);(r===document.body||r===window||r===document)&&j(()=>{r.removeEventListener(a,_,t)})}function er(a){for(var r=0;r<a.length;r++)N.add(a[r]);for(var n of T)n(a)}function y(a){var R;var r=this,n=r.ownerDocument,o=a.type,e=((R=a.composedPath)==null?void 0:R.call(a))||[],t=e[0]||a.target,_=0,u=a.__root;if(u){var c=e.indexOf(u);if(c!==-1&&(r===document||r===window)){a.__root=r;return}var d=e.indexOf(r);if(d===-1)return;c<=d&&(_=c)}if(t=e[_]||a.target,t!==r){C(a,"currentTarget",{configurable:!0,get(){return t||n}});try{for(var l,s=[];t!==null;){var f=t.parentNode||t.host||null;try{var i=t["__"+o];if(i!==void 0&&!t.disabled)if(V(i)){var[g,...p]=i;g.apply(t,[a,...p])}else i.call(t,a)}catch(w){l?s.push(w):l=w}if(a.cancelBubble||f===r||f===null)break;t=f}if(l){for(let w of s)queueMicrotask(()=>{throw w});throw l}}finally{a.__root=r,t=r}}}function tr(a,r){(a.__t??(a.__t=a.nodeValue))!==r&&(a.nodeValue=a.__t=r)}function Z(a,r){const n=r.anchor??r.target.appendChild(k());return O(()=>S(a,{...r,anchor:n}),!1)}function nr(a,r){r.intro=r.intro??!1;const n=r.target,o=E;try{return O(()=>{for(var e=n.firstChild;e&&(e.nodeType!==8||e.data!==A);)e=e.nextSibling;if(!e)throw b;v(!0),H(e),q();const t=S(a,{...r,anchor:e});if(m.nodeType!==8||m.data!==I)throw U(),b;return v(!1),t},!1)}catch(e){if(e===b)return r.recover===!1&&W(),D(),M(n),v(!1),Z(a,r);throw e}finally{v(o)}}const h=new Map;function S(a,{target:r,anchor:n,props:o={},events:e,context:t,intro:_=!0}){D();var u=new Set,c=s=>{for(var f=0;f<s.length;f++){var i=s[f];if(!u.has(i)){u.add(i);var g=Y.includes(i);r.addEventListener(i,y,{passive:g});var p=h.get(i);p===void 0?(document.addEventListener(i,y,{passive:g}),h.set(i,1)):h.set(i,p+1)}}};c($(N)),T.add(c);var d=void 0,l=z(()=>(F(()=>{if(t){G({});var s=Q;s.c=t}e&&(o.$$events=e),E&&P(n,null),d=a(n,o)||{},E&&(J.nodes.end=m),t&&K()}),()=>{for(var s of u){r.removeEventListener(s,y);var f=h.get(s);--f===0?(document.removeEventListener(s,y),h.delete(s)):h.set(s,f)}T.delete(c),L.delete(d)}));return L.set(d,l),d}let L=new WeakMap;function sr(a){const r=L.get(a);r==null||r()}export{X as c,er as d,ar as e,nr as h,Z as m,tr as s,sr as u};