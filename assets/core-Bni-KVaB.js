function p(t,i,e,r=!1){return{name:t,code(n){const s=n.children.filter(o=>o.type==="element"),l=[];s.forEach((o,h)=>{let f;for(const a of o.children){if(a.type!=="element")continue;const c=a.children[0];if(c.type!=="text")continue;let u=!1;c.value=c.value.replace(i,(...g)=>e.call(this,g,o,a,s,h)?(u=!0,""):g[0]),u&&!c.value.trim()&&(f=a)}if(f&&(o.children.splice(o.children.indexOf(f),1),o.children.length===0&&(l.push(o),r))){const a=n.children[n.children.indexOf(o)+1];a&&a.type==="text"&&a.value===`
`&&l.push(a)}});for(const o of l)n.children.splice(n.children.indexOf(o),1)}}}function N(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function m(t={},i="@shikijs/transformers:notation-map"){const{classMap:e={},classActivePre:r=void 0}=t;return p(i,new RegExp(`\\s*(?://|/\\*|<!--|#)\\s+\\[!code (${Object.keys(e).map(N).join("|")})(:\\d+)?\\]\\s*(?:\\*/|-->)?`),function([n,s,l=":1"],o,h,f,a){const c=Number.parseInt(l.slice(1),10);return f.slice(a,a+c).forEach(u=>{this.addClassToHast(u,e[s])}),r&&this.addClassToHast(this.pre,r),!0})}function y(t={}){const{classActiveLine:i="highlighted",classActivePre:e="has-highlighted"}=t;return m({classMap:{highlight:i,hl:i},classActivePre:e},"@shikijs/transformers:notation-highlight")}function _(t,i,e,r){const n=v(t);let s=n.indexOf(e);for(;s!==-1;)x.call(this,t.children,i,s,e.length,r),s=n.indexOf(e,s+1)}function v(t){return t.type==="text"?t.value:t.type==="element"&&t.tagName==="span"?t.children.map(v).join(""):""}function x(t,i,e,r,n){let s=0;for(let l=0;l<t.length;l++){const o=t[l];if(o.type!=="element"||o.tagName!=="span"||o===i)continue;const h=o.children[0];if(h.type==="text"){if(H([s,s+h.value.length-1],[e,e+r])){const f=Math.max(0,e-s),a=r-Math.max(0,s-e);if(a===0)continue;const c=T(o,h,f,a);this.addClassToHast(c[1],n);const u=c.filter(Boolean);t.splice(l,1,...u),l+=u.length-1}s+=h.value.length}}}function H(t,i){return t[0]<=i[1]&&t[1]>=i[0]}function T(t,i,e,r){const n=i.value,s=l=>k(t,{children:[{type:"text",value:l}]});return[e>0?s(n.slice(0,e)):void 0,s(n.slice(e,e+r)),e+r<n.length?s(n.slice(e+r)):void 0]}function k(t,i){return{...t,properties:{...t.properties},...i}}function M(t={}){const{classActiveWord:i="highlighted-word",classActivePre:e=void 0}=t;return p("@shikijs/transformers:notation-highlight-word",/^\s*(?:\/\/|\/\*|<!--|#)\s+\[!code word:((?:\\.|[^:\]])+)(:\d+)?\]\s*(?:\*\/|-->)?/,function([r,n,s],l,o,h,f){const a=s?Number.parseInt(s.slice(1),10):h.length;return n=n.replace(/\\(.)/g,"$1"),h.slice(f+1,f+1+a).forEach(c=>_.call(this,c,o,n,i)),e&&this.addClassToHast(this.pre,e),!0},!0)}function b(t={}){const{classLineAdd:i="diff add",classLineRemove:e="diff remove",classActivePre:r="has-diff"}=t;return m({classMap:{"++":i,"--":e},classActivePre:r},"@shikijs/transformers:notation-diff")}function j(t){if(!t)return null;const i=t.match(/{([\d,-]+)}/);return i?i[1].split(",").flatMap(r=>{const n=r.split("-").map(s=>Number.parseInt(s,10));return n.length===1?[n[0]]:Array.from({length:n[1]-n[0]+1},(s,l)=>l+n[0])}):null}const d=Symbol("highlighted-lines");function A(t={}){const{className:i="highlighted"}=t;return{name:"@shikijs/transformers:meta-highlight",line(e,r){var n;return this.options.meta?.__raw?((n=this.meta)[d]||(n[d]=j(this.options.meta.__raw)),(this.meta[d]||[]).includes(r)&&this.addClassToHast(e,i),e):void 0}}}function O(t,{lang:i,attrs:e,code:r}){const n={lang:i,meta:{__raw:e},themes:{light:"github-light",dark:"github-dark"}};return t.codeToHtml(r,{...n,transformers:[...n.transformers||[],b(),y(),M(),A()]})}export{O as codeHighlighter};