var et=Array.isArray,ut=Array.from,lt=Object.isFrozen,st=Object.defineProperty,ot=Object.getOwnPropertyDescriptor,Dn=Object.getOwnPropertyDescriptors,it=Object.prototype,ft=Array.prototype,Rn=Object.getPrototypeOf;const g=2,en=4,b=8,un=16,d=32,V=64,T=128,M=256,E=512,y=1024,C=2048,F=4096,D=8192,Nn=16384,ln=32768,at=65536,jn=1<<18,J=Symbol("$state"),_t=Symbol("$state.frozen"),ct=Symbol("");function sn(n){return n===this.v}function In(n,t){return n!=n?t==t:n!==t||n!==null&&typeof n=="object"||typeof n=="function"}function on(n){return!In(n,this.v)}function Mn(n){throw new Error("effect_in_teardown")}function Ln(){throw new Error("effect_in_unowned_derived")}function Yn(n){throw new Error("effect_orphan")}function Pn(){throw new Error("effect_update_depth_exceeded")}function vt(){throw new Error("hydration_failed")}function pt(n){throw new Error("props_invalid_value")}function Bn(){throw new Error("state_unsafe_mutation")}function fn(n){return{f:0,v:n,reactions:null,equals:sn,version:0}}function ht(n){var r;const t=fn(n);return t.equals=on,i!==null&&i.l!==null&&((r=i.l).s??(r.s=[])).push(t),t}function wt(n,t){return a!==null&&$()&&a.f&g&&Bn(),n.equals(t)||(n.v=t,n.version=xn(),an(n,y),$()&&f!==null&&f.f&E&&!(f.f&d)&&(c!==null&&c.includes(n)?(h(f,y),U(f)):m===null?Wn([n]):m.push(n))),t}function an(n,t){var r=n.reactions;if(r!==null)for(var e=$(),l=r.length,u=0;u<l;u++){var s=r[u],o=s.f;o&y||!e&&s===f||(h(s,t),o&(E|T)&&(o&g?an(s,C):U(s)))}}function _n(n){f===null&&a===null&&Yn(),a!==null&&a.f&T&&Ln(),W&&Mn()}function Q(n,t){var r=t.last;r===null?t.last=t.first=n:(r.next=n,n.prev=r,t.last=n)}function R(n,t,r,e=!0){var l=(n&V)!==0,u={ctx:i,deps:null,nodes:null,f:n|y,first:null,fn:t,last:null,next:null,parent:l?null:f,prev:null,teardown:null,transitions:null,version:0};if(r){var s=S;try{X(!0),H(u),u.f|=Nn}catch(_){throw P(u),_}finally{X(s)}}else t!==null&&U(u);var o=r&&u.deps===null&&u.first===null&&u.nodes===null&&u.teardown===null;return!o&&!l&&e&&(f!==null&&Q(u,f),a!==null&&a.f&g&&Q(u,a)),u}function Et(n){const t=R(b,null,!1);return h(t,E),t.teardown=n,t}function dt(n){_n();var t=f!==null&&(f.f&b)!==0&&i!==null&&!i.m;if(t){var r=i;(r.e??(r.e=[])).push(n)}else{var e=cn(n);return e}}function mt(n){return _n(),vn(n)}function yt(n){const t=R(V,n,!0);return()=>{P(t)}}function cn(n){return R(en,n,!1)}function vn(n){return R(b,n,!0)}function kt(n){return vn(n)}function gt(n,t=0){return R(b|un|t,n,!0)}function Tt(n,t=!0){return R(b|d,n,!0,t)}function pn(n){var t=n.teardown;if(t!==null){const r=W,e=a;nn(!0),tn(null);try{t.call(null)}finally{nn(r),tn(e)}}}function P(n,t=!0){var r=!1;if((t||n.f&jn)&&n.nodes!==null){for(var e=n.nodes.start,l=n.nodes.end;e!==null;){var u=e===l?null:e.nextSibling;e.remove(),e=u}r=!0}if(Z(n,t&&!r),B(n,0),h(n,D),n.transitions)for(const o of n.transitions)o.stop();pn(n);var s=n.parent;s!==null&&n.f&d&&s.first!==null&&hn(n),n.next=n.prev=n.teardown=n.ctx=n.deps=n.parent=n.fn=n.nodes=null}function hn(n){var t=n.parent,r=n.prev,e=n.next;r!==null&&(r.next=e),e!==null&&(e.prev=r),t!==null&&(t.first===n&&(t.first=e),t.last===n&&(t.last=r))}function qt(n,t){var r=[];wn(n,r,!0),Hn(r,()=>{P(n),t&&t()})}function Hn(n,t){var r=n.length;if(r>0){var e=()=>--r||t();for(var l of n)l.out(e)}else t()}function wn(n,t,r){if(!(n.f&F)){if(n.f^=F,n.transitions!==null)for(const s of n.transitions)(s.is_global||r)&&t.push(s);for(var e=n.first;e!==null;){var l=e.next,u=(e.f&ln)!==0||(e.f&d)!==0;wn(e,t,u?r:!1),e=l}}}function xt(n){En(n,!0)}function En(n,t){if(n.f&F){n.f^=F,j(n)&&H(n);for(var r=n.first;r!==null;){var e=r.next,l=(r.f&ln)!==0||(r.f&d)!==0;En(r,l?t:!1),r=e}if(n.transitions!==null)for(const u of n.transitions)(u.is_global||t)&&u.in()}}const Ot=()=>{};function St(n){return n()}function dn(n){for(var t=0;t<n.length;t++)n[t]()}const Un=typeof requestIdleCallback>"u"?n=>setTimeout(n,1):requestIdleCallback;let L=!1,Y=!1,z=[],K=[];function mn(){L=!1;const n=z.slice();z=[],dn(n)}function yn(){Y=!1;const n=K.slice();K=[],dn(n)}function At(n){L||(L=!0,queueMicrotask(mn)),z.push(n)}function Ft(n){Y||(Y=!0,Un(yn)),K.push(n)}function zn(){L&&mn(),Y&&yn()}function Kn(n){let t=g|y;f===null&&(t|=T);const r={deps:null,deriveds:null,equals:sn,f:t,first:null,fn:n,last:null,reactions:null,v:null,version:0};if(a!==null&&a.f&g){var e=a;e.deriveds===null?e.deriveds=[r]:e.deriveds.push(r)}return r}function bt(n){const t=Kn(n);return t.equals=on,t}function kn(n){Z(n);var t=n.deriveds;if(t!==null){n.deriveds=null;for(var r=0;r<t.length;r+=1)$n(t[r])}}function gn(n){kn(n);var t=On(n),r=(O||n.f&T)&&n.deps!==null?C:E;h(n,r),n.equals(t)||(n.v=t,n.version=xn())}function $n(n){kn(n),B(n,0),h(n,D),n.first=n.last=n.deps=n.reactions=n.fn=null}function Gn(n){throw new Error("lifecycle_outside_component")}const Tn=0,Vn=1;let I=Tn,N=!1,S=!1,W=!1;function X(n){S=n}function nn(n){W=n}let k=[],A=0,a=null;function tn(n){a=n}let f=null,c=null,v=0,m=null;function Wn(n){m=n}let qn=0,O=!1,i=null;function xn(){return qn++}function $(){return i!==null&&i.l===null}function j(n){var s,o;var t=n.f;if(t&y)return!0;if(t&C){var r=n.deps;if(r!==null){var e=(t&T)!==0,l;if(t&M){for(l=0;l<r.length;l++)((s=r[l]).reactions??(s.reactions=[])).push(n);n.f^=M}for(l=0;l<r.length;l++){var u=r[l];if(j(u)&&gn(u),u.version>n.version)return!0;e&&!O&&!((o=u==null?void 0:u.reactions)!=null&&o.includes(n))&&(u.reactions??(u.reactions=[])).push(n)}}h(n,E)}return!1}function Zn(n,t,r){throw n}function On(n){var t=c,r=v,e=m,l=a,u=O;c=null,v=0,m=null,a=n.f&(d|V)?null:n,O=!S&&(n.f&T)!==0;try{var s=(0,n.fn)(),o=n.deps;if(c!==null){var _,p;if(o!==null){var q=v===0?c:o.slice(0,v).concat(c),x=q.length>16?new Set(q):null;for(p=v;p<o.length;p++)_=o[p],(x!==null?!x.has(_):!q.includes(_))&&Sn(n,_)}if(o!==null&&v>0)for(o.length=v+c.length,p=0;p<c.length;p++)o[v+p]=c[p];else n.deps=o=c;if(!O)for(p=v;p<o.length;p++){_=o[p];var w=_.reactions;w===null?_.reactions=[n]:w[w.length-1]!==n&&!w.includes(n)&&w.push(n)}}else o!==null&&v<o.length&&(B(n,v),o.length=v);return s}finally{c=t,v=r,m=e,a=l,O=u}}function Sn(n,t){const r=t.reactions;let e=0;if(r!==null){e=r.length-1;const l=r.indexOf(n);l!==-1&&(e===0?t.reactions=null:(r[l]=r[e],r.pop()))}e===0&&t.f&g&&(h(t,C),t.f&(T|M)||(t.f^=M),B(t,0))}function B(n,t){var r=n.deps;if(r!==null)for(var e=t===0?null:r.slice(0,t),l=new Set,u=t;u<r.length;u++){var s=r[u];l.has(s)||(l.add(s),(e===null||!e.includes(s))&&Sn(n,s))}}function Z(n,t=!1){var r=n.first;for(n.first=n.last=null;r!==null;){var e=r.next;P(r,t),r=e}}function H(n){var t=n.f;if(!(t&D)){h(n,E);var r=n.ctx,e=f,l=i;f=n,i=r;try{t&un||Z(n),pn(n);var u=On(n);n.teardown=typeof u=="function"?u:null,n.version=qn}catch(s){Zn(s)}finally{f=e,i=l}}}function An(){A>1e3&&(A=0,Pn()),A++}function Fn(n){var t=n.length;if(t!==0){An();var r=S;S=!0;try{for(var e=0;e<t;e++){var l=n[e];if(l.first===null&&!(l.f&d))rn([l]);else{var u=[];bn(l,u),rn(u)}}}finally{S=r}}}function rn(n){var t=n.length;if(t!==0)for(var r=0;r<t;r++){var e=n[r];!(e.f&(D|F))&&j(e)&&(H(e),e.deps===null&&e.first===null&&e.nodes===null&&(e.teardown===null?hn(e):e.fn=null))}}function Jn(){if(N=!1,A>1001)return;const n=k;k=[],Fn(n),N||(A=0)}function U(n){I===Tn&&(N||(N=!0,queueMicrotask(Jn)));for(var t=n;t.parent!==null;){t=t.parent;var r=t.f;if(r&d){if(!(r&E))return;h(t,C)}}k.push(t)}function bn(n,t){var r=n.first,e=[];n:for(;r!==null;){var l=r.f,u=(l&(D|F))===0,s=l&d,o=(l&E)!==0,_=r.first;if(u&&(!s||!o)){if(s&&h(r,E),l&b){if(!s&&j(r)&&(H(r),_=r.first),_!==null){r=_;continue}}else if(l&en)if(s||o){if(_!==null){r=_;continue}}else e.push(r)}var p=r.next;if(p===null){let w=r.parent;for(;w!==null;){if(n===w)break n;var q=w.next;if(q!==null){r=q;continue n}w=w.parent}}r=p}for(var x=0;x<e.length;x++)_=e[x],t.push(_),bn(_,t)}function Cn(n,t=!0){var r=I,e=k;try{An();const u=[];I=Vn,k=u,N=!1,t&&Fn(e);var l=n==null?void 0:n();return zn(),(k.length>0||u.length>0)&&Cn(),A=0,l}finally{I=r,k=e}}async function Ct(){await Promise.resolve(),Cn()}function Qn(n){var t=n.f;if(t&D)return n.v;if(a!==null){var r=a.deps;c===null&&r!==null&&r[v]===n?v++:(r===null||v===0||r[v-1]!==n)&&(c===null?c=[n]:c[c.length-1]!==n&&c.push(n)),m!==null&&f!==null&&f.f&E&&!(f.f&d)&&m.includes(n)&&(h(f,y),U(f))}if(t&g){var e=n;j(e)&&gn(e)}return n.v}function Dt(n){const t=a;try{return a=null,n()}finally{a=t}}const Xn=~(y|C|E);function h(n,t){n.f=n.f&Xn|t}function nt(n){return typeof n=="object"&&n!==null&&typeof n.f=="number"}function Rt(n){return tt().get(n)}function tt(n){return i===null&&Gn(),i.c??(i.c=new Map(rt(i)||void 0))}function rt(n){let t=n.p;for(;t!==null;){const r=t.c;if(r!==null)return r;t=t.p}return null}function Nt(n,t=!1,r){i={p:i,c:null,e:null,m:!1,s:n,x:null,l:null},t||(i.l={s:null,u:null,r1:[],r2:fn(!1)})}function jt(n){const t=i;if(t!==null){const e=t.e;if(e!==null){t.e=null;for(var r=0;r<e.length;r++)cn(e[r])}i=t.p,t.m=!0}return{}}function It(n){if(!(typeof n!="object"||!n||n instanceof EventTarget)){if(J in n)G(n);else if(!Array.isArray(n))for(let t in n){const r=n[t];typeof r=="object"&&r&&J in r&&G(r)}}}function G(n,t=new Set){if(typeof n=="object"&&n!==null&&!(n instanceof EventTarget)&&!t.has(n)){t.add(n),n instanceof Date&&n.getTime();for(let e in n)try{G(n[e],t)}catch{}const r=Rn(n);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const e=Dn(r);for(let l in e){const u=e[l].get;if(u)try{u.call(n)}catch{}}}}}function Mt(n){return nt(n)?Qn(n):n}export{Ft as $,ft as A,ot as B,Rn as C,Dn as D,gt as E,xt as F,qt as G,ln as H,cn as I,vn as J,pt as K,at as L,on as M,bt as N,ht as O,mt as P,dn as Q,St as R,_t as S,It as T,Gn as U,Ct as V,Rt as W,F as X,wn as Y,Hn as Z,P as _,ut as a,ct as a0,Tt as b,f as c,st as d,yt as e,Cn as f,jt as g,vt as h,et as i,i as j,wt as k,fn as l,kt as m,Ot as n,Qn as o,Nt as p,At as q,Dt as r,In as s,Et as t,dt as u,Mt as v,Kn as w,lt as x,J as y,it as z};
