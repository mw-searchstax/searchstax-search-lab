(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){try{let t=new URL(e);return(t.protocol===`https:`||t.protocol===`http:`)&&!t.username&&!t.password?t.href:null}catch{return null}}function t(e,t=`emselect`){try{let n=new URL(e.trim());return n.protocol!==`https:`||!n.hostname.endsWith(`.searchstax.com`)||n.port||n.username||n.password||n.search||n.hash||!n.pathname.replace(/\/$/,``).endsWith(`/`+t)?null:n.href}catch{return null}}var n={arial:`Arial, Helvetica, sans-serif`,verdana:`Verdana, Geneva, sans-serif`,tahoma:`Tahoma, Geneva, sans-serif`,trebuchet:`"Trebuchet MS", Helvetica, sans-serif`,georgia:`Georgia, "Times New Roman", serif`,times:`"Times New Roman", Times, serif`,courier:`"Courier New", Courier, monospace`},r={compact:`6px`,standard:`12px`,roomy:`20px`},i={standard:`5px`,square:`0px`,rounded:`14px`},a=[5,10,20],o={highlightStyle:`default`,promotionBadge:`Promoted`,promotionHeading:`Featured link`,badgeStyle:`text`,bannerStyle:`tinted`,bannerPlacement:`above`,highlightText:`#202020`,highlightBackground:`#ffec99`,previewSource:`app`,layout:`list`,resultSpacing:`standard`,filterPlacement:`sidebar`,topFilterStyle:`list`,relatedPlacement:`below`,profileTabs:!1,languagePicker:!1,filters:!0,showDescriptions:!0,showThumbnails:!1,showSorting:!0,showSuggestions:!1,showSmartAnswersSample:!0,samplePromotions:`off`,resultsPerPage:10,color:`#263f58`,background:`#ffffff`,logoURL:``,corners:`standard`,listDividers:!0,underlineTitles:!1,font:`arial`,searchFieldText:`Search the website`,searchButtonText:`Search`,noResultsText:`No matching pages. Try another search or remove a filter.`};function s(e){return e===`list`||e===`cards`}function c(e){return e!==null&&Object.hasOwn(r,e)}function l(e){return a.find(t=>String(t)===e)??o.resultsPerPage}function u(e){return e===`indexed`||e===`external`||e===`both`?e:`off`}function d(e){return e!==null&&Object.hasOwn(n,e)}function f(e){return/^#[\da-f]{6}$/i.test(e)}function p(e){return e===`bold`||e===`italic`||e===`color`||e===`plain`?e:`default`}function m(e){return e!==null&&Object.hasOwn(i,e)?e:o.corners}function h(t){let n=e(t??``);return n?.startsWith(`https:`)?n:``}function g(e,t){return e?.replace(/[\r\n]+/g,` `).trim()||t}function _(e,t=!1){let n=[`lab_layout`,`lab_color`,`lab_font`,`lab_filters`].every(t=>e.has(t)),r=e.get(`lab_layout`),i=e.get(`lab_top_filters`),a=e.get(`lab_spacing`),_=e.get(`lab_font`),v=`#`+(e.get(`lab_color`)??``).toLowerCase(),b=`#`+(e.get(`lab_background`)??``).toLowerCase();return{promotionBadge:g(e.get(`lab_badge`),o.promotionBadge),promotionHeading:g(e.get(`lab_promo_heading`),o.promotionHeading),badgeStyle:e.get(`lab_badge_style`)===`pill`?`pill`:`text`,bannerStyle:e.get(`lab_banner_style`)===`outline`?`outline`:`tinted`,bannerPlacement:e.get(`lab_banner_placement`)===`below`?`below`:`above`,highlightStyle:p(e.get(`lab_highlight`)),highlightText:y(e.get(`lab_hit_text`),o.highlightText),highlightBackground:y(e.get(`lab_hit_bg`),o.highlightBackground),previewSource:t&&e.get(`lab_source`)===`fictional`?`fictional`:`app`,layout:s(r)?r:o.layout,resultSpacing:c(a)?a:o.resultSpacing,topFilterStyle:i===`row`||i===`tabs`?`row`:`list`,filterPlacement:e.get(`lab_filter_placement`)===`top`?`top`:`sidebar`,relatedPlacement:e.get(`lab_related`)===`above`?`above`:e.get(`lab_related`)===`off`?`off`:`below`,languagePicker:e.has(`lab_languages`)?e.get(`lab_languages`)===`on`:e.get(`lab_profile_tabs`)===`on`,profileTabs:e.get(`lab_profile_tabs`)===`on`,filters:e.get(`lab_filters`)!==`off`,showDescriptions:e.get(`lab_descriptions`)!==`off`,showThumbnails:e.get(`lab_thumbnails`)===`on`,showSorting:e.has(`lab_sorting`)?e.get(`lab_sorting`)===`on`:!n&&o.showSorting,showSuggestions:e.get(`lab_suggestions`)===`on`,showSmartAnswersSample:e.get(`lab_answer_sample`)!==`off`,samplePromotions:u(e.get(`lab_promotions`)),resultsPerPage:l(e.get(`lab_page_size`)),color:f(v)?v:o.color,background:f(b)?b:o.background,logoURL:h(e.get(`lab_logo`)),corners:m(e.get(`lab_corners`)),listDividers:e.get(`lab_dividers`)!==`off`,underlineTitles:e.get(`lab_underline`)===`on`,font:d(_)?_:o.font,searchFieldText:g(e.get(`lab_field_text`),o.searchFieldText),searchButtonText:g(e.get(`lab_button_text`),o.searchButtonText),noResultsText:g(e.get(`lab_no_results_text`),o.noResultsText)}}function v(e,t){t.promotionBadge!==o.promotionBadge&&e.set(`lab_badge`,t.promotionBadge),t.promotionHeading!==o.promotionHeading&&e.set(`lab_promo_heading`,t.promotionHeading),t.badgeStyle!==o.badgeStyle&&e.set(`lab_badge_style`,t.badgeStyle),t.bannerStyle!==o.bannerStyle&&e.set(`lab_banner_style`,t.bannerStyle),t.bannerPlacement!==o.bannerPlacement&&e.set(`lab_banner_placement`,t.bannerPlacement),t.highlightStyle==="default"?e.delete(`lab_highlight`):e.set(`lab_highlight`,t.highlightStyle);for(let[n,r,i]of[[`lab_hit_text`,t.highlightText,o.highlightText],[`lab_hit_bg`,t.highlightBackground,o.highlightBackground]])r===i?e.delete(n):e.set(n,r.slice(1));t.previewSource===`fictional`?e.set(`lab_source`,`fictional`):e.delete(`lab_source`),(t.languagePicker||t.profileTabs)&&e.set(`lab_languages`,t.languagePicker?`on`:`off`),t.profileTabs&&e.set(`lab_profile_tabs`,`on`),e.set(`lab_layout`,t.layout),e.set(`lab_color`,t.color.slice(1)),e.set(`lab_font`,t.font),e.set(`lab_filters`,t.filters?`on`:`off`),t.topFilterStyle!==`list`&&e.set(`lab_top_filters`,t.topFilterStyle),t.filterPlacement===`top`&&e.set(`lab_filter_placement`,`top`),t.relatedPlacement!==`below`&&e.set(`lab_related`,t.relatedPlacement),t.background!==o.background&&e.set(`lab_background`,t.background.slice(1)),t.logoURL&&e.set(`lab_logo`,t.logoURL),t.corners!==o.corners&&e.set(`lab_corners`,t.corners),t.listDividers||e.set(`lab_dividers`,`off`),t.underlineTitles&&e.set(`lab_underline`,`on`),t.resultSpacing!==o.resultSpacing&&e.set(`lab_spacing`,t.resultSpacing),t.showDescriptions||e.set(`lab_descriptions`,`off`),t.showThumbnails&&e.set(`lab_thumbnails`,`on`),e.set(`lab_sorting`,t.showSorting?`on`:`off`),t.showSuggestions&&e.set(`lab_suggestions`,`on`),t.showSmartAnswersSample||e.set(`lab_answer_sample`,`off`),t.samplePromotions!==`off`&&e.set(`lab_promotions`,t.samplePromotions),t.resultsPerPage!==o.resultsPerPage&&e.set(`lab_page_size`,String(t.resultsPerPage)),t.searchFieldText!==o.searchFieldText&&e.set(`lab_field_text`,t.searchFieldText),t.searchButtonText!==o.searchButtonText&&e.set(`lab_button_text`,t.searchButtonText),t.noResultsText!==o.noResultsText&&e.set(`lab_no_results_text`,t.noResultsText)}function y(e,t){return e&&f(`#`+e)?`#`+e.toLowerCase():t}function b(e){let[t,n,r]=[1,3,5].map(t=>{let n=parseInt(e.slice(t,t+2),16)/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4});return t*.2126+n*.7152+r*.0722}function x(e,t){let n=b(e),r=b(t);return(Math.max(n,r)+.05)/(Math.min(n,r)+.05)}function S(e){let t=b(e);return(t+.05)/.05>=1.05/(t+.05)?`#000000`:`#ffffff`}function C(e){let t=e.filterPlacement===`top`?e.topFilterStyle:`list`,a=S(e.background)===`#ffffff`;return{"--promotion-badge-padding":e.badgeStyle===`pill`?`2px 10px`:`0`,"--promotion-badge-border":e.badgeStyle===`pill`?`1px solid currentColor`:`0`,"--promotion-banner-background":e.bannerStyle===`outline`?`transparent`:`#f3f7f4`,"--promotion-banner-ink":e.bannerStyle===`outline`?`inherit`:`#253a34`,"--search-hit-weight":e.highlightStyle===`bold`?`bold`:`inherit`,"--search-hit-style":e.highlightStyle===`italic`?`italic`:`inherit`,"--search-hit-ink":e.highlightStyle===`color`?x(e.highlightText,e.highlightBackground)>=4.5?e.highlightText:S(e.highlightBackground):e.highlightStyle==="default"?`MarkText`:`inherit`,"--search-hit-background":e.highlightStyle===`color`?e.highlightBackground:e.highlightStyle==="default"?`Mark`:`transparent`,"--search-hit-forced-ink":[`color`,`default`].includes(e.highlightStyle)?`HighlightText`:`inherit`,"--search-hit-forced-background":[`color`,`default`].includes(e.highlightStyle)?`Highlight`:`transparent`,"--search-accent":e.color,"--search-accent-text":S(e.color),"--search-background":e.background,"--search-ink":e.background===o.background?`#202e3a`:S(e.background),"--search-title-ink":e.background===o.background?`#263f58`:S(e.background),"--search-divider":e.background===o.background?`#d8dfe3`:a?`#a1aab1`:`#79838a`,"--search-corners":i[e.corners],"--search-filter-display":t===`list`?`block`:`flex`,"--search-font":n[e.font],"--search-result-gap":r[e.resultSpacing]}}var w=Uint8Array,T=Uint16Array,E=Int32Array,D=new w([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),O=new w([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),k=new w([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),A=function(e,t){for(var n=new T(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var i=new E(n[30]),r=1;r<30;++r)for(var a=n[r];a<n[r+1];++a)i[a]=a-n[r]<<5|r;return{b:n,r:i}},j=A(D,2),M=j.b,N=j.r;M[28]=258,N[258]=28;var P=A(O,0);P.b;for(var ee=P.r,te=new T(32768),F=0;F<32768;++F){var I=(F&43690)>>1|(F&21845)<<1;I=(I&52428)>>2|(I&13107)<<2,I=(I&61680)>>4|(I&3855)<<4,te[F]=((I&65280)>>8|(I&255)<<8)>>1}for(var L=(function(e,t,n){for(var r=e.length,i=0,a=new T(t);i<r;++i)e[i]&&++a[e[i]-1];var o=new T(t);for(i=1;i<t;++i)o[i]=o[i-1]+a[i-1]<<1;var s;if(n){s=new T(1<<t);var c=15-t;for(i=0;i<r;++i)if(e[i])for(var l=i<<4|e[i],u=t-e[i],d=o[e[i]-1]++<<u,f=d|(1<<u)-1;d<=f;++d)s[te[d]>>c]=l}else for(s=new T(r),i=0;i<r;++i)e[i]&&(s[i]=te[o[e[i]-1]++]>>15-e[i]);return s}),R=new w(288),F=0;F<144;++F)R[F]=8;for(var F=144;F<256;++F)R[F]=9;for(var F=256;F<280;++F)R[F]=7;for(var F=280;F<288;++F)R[F]=8;for(var z=new w(32),F=0;F<32;++F)z[F]=5;var ne=L(R,9,0),re=L(z,5,0),ie=function(e){return(e+7)/8|0},ae=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new w(e.subarray(t,n))},B=[`unexpected EOF`,`invalid block type`,`invalid length/literal`,`invalid distance`,`stream finished`,`no stream handler`,,`no callback`,`invalid UTF-8 data`,`extra field too long`,`date not in range 1980-2099`,`filename too long`,`stream finishing`,`invalid zip data`],oe=function(e,t,n){var r=Error(t||B[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,oe),!n)throw r;return r},V=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8},se=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8,e[r+2]|=n>>16},H=function(e,t){for(var n=[],r=0;r<e.length;++r)e[r]&&n.push({s:r,f:e[r]});var i=n.length,a=n.slice();if(!i)return{t:G,l:0};if(i==1){var o=new w(n[0].s+1);return o[n[0].s]=1,{t:o,l:1}}n.sort(function(e,t){return e.f-t.f}),n.push({s:-1,f:25001});var s=n[0],c=n[1],l=0,u=1,d=2;for(n[0]={s:-1,f:s.f+c.f,l:s,r:c};u!=i-1;)s=n[n[l].f<n[d].f?l++:d++],c=n[l!=u&&n[l].f<n[d].f?l++:d++],n[u++]={s:-1,f:s.f+c.f,l:s,r:c};for(var f=a[0].s,r=1;r<i;++r)a[r].s>f&&(f=a[r].s);var p=new T(f+1),m=ce(n[u-1],p,0);if(m>t){var r=0,h=0,g=m-t,_=1<<g;for(a.sort(function(e,t){return p[t.s]-p[e.s]||e.f-t.f});r<i;++r){var v=a[r].s;if(p[v]>t)h+=_-(1<<m-p[v]),p[v]=t;else break}for(h>>=g;h>0;){var y=a[r].s;p[y]<t?h-=1<<t-p[y]++-1:++r}for(;r>=0&&h;--r){var b=a[r].s;p[b]==t&&(--p[b],++h)}m=t}return{t:new w(p),l:m}},ce=function(e,t,n){return e.s==-1?Math.max(ce(e.l,t,n+1),ce(e.r,t,n+1)):t[e.s]=n},le=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new T(++t),r=0,i=e[0],a=1,o=function(e){n[r++]=e},s=1;s<=t;++s)if(e[s]==i&&s!=t)++a;else{if(!i&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(i),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(i);a=1,i=e[s]}return{c:n.subarray(0,r),n:t}},ue=function(e,t){for(var n=0,r=0;r<t.length;++r)n+=e[r]*t[r];return n},U=function(e,t,n){var r=n.length,i=ie(t+2);e[i]=r&255,e[i+1]=r>>8,e[i+2]=e[i]^255,e[i+3]=e[i+1]^255;for(var a=0;a<r;++a)e[i+a+4]=n[a];return(i+4+r)*8},de=function(e,t,n,r,i,a,o,s,c,l,u){V(t,u++,n),++i[256];for(var d=H(i,15),f=d.t,p=d.l,m=H(a,15),h=m.t,g=m.l,_=le(f),v=_.c,y=_.n,b=le(h),x=b.c,S=b.n,C=new T(19),w=0;w<v.length;++w)++C[v[w]&31];for(var w=0;w<x.length;++w)++C[x[w]&31];for(var E=H(C,7),A=E.t,j=E.l,M=19;M>4&&!A[k[M-1]];--M);var N=l+5<<3,P=ue(i,R)+ue(a,z)+o,ee=ue(i,f)+ue(a,h)+o+14+3*M+ue(C,A)+2*C[16]+3*C[17]+7*C[18];if(c>=0&&N<=P&&N<=ee)return U(t,u,e.subarray(c,c+l));var te,F,I,ie;if(V(t,u,1+(ee<P)),u+=2,ee<P){te=L(f,p,0),F=f,I=L(h,g,0),ie=h;var ae=L(A,j,0);V(t,u,y-257),V(t,u+5,S-1),V(t,u+10,M-4),u+=14;for(var w=0;w<M;++w)V(t,u+3*w,A[k[w]]);u+=3*M;for(var B=[v,x],oe=0;oe<2;++oe)for(var ce=B[oe],w=0;w<ce.length;++w){var de=ce[w]&31;V(t,u,ae[de]),u+=A[de],de>15&&(V(t,u,ce[w]>>5&127),u+=ce[w]>>12)}}else te=ne,F=R,I=re,ie=z;for(var w=0;w<s;++w){var W=r[w];if(W>255){var de=W>>18&31;se(t,u,te[de+257]),u+=F[de+257],de>7&&(V(t,u,W>>23&31),u+=D[de]);var G=W&31;se(t,u,I[G]),u+=ie[G],G>3&&(se(t,u,W>>5&8191),u+=O[G])}else se(t,u,te[W]),u+=F[W]}return se(t,u,te[256]),u+F[256]},W=new E([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),G=new w(0),fe=function(e,t,n,r,i,a){var o=a.z||e.length,s=new w(r+o+5*(1+Math.ceil(o/7e3))+i),c=s.subarray(r,s.length-i),l=a.l,u=(a.r||0)&7;if(t){u&&(c[0]=a.r>>3);for(var d=W[t-1],f=d>>13,p=d&8191,m=(1<<n)-1,h=a.p||new T(32768),g=a.h||new T(m+1),_=Math.ceil(n/3),v=2*_,y=function(t){return(e[t]^e[t+1]<<_^e[t+2]<<v)&m},b=new E(25e3),x=new T(288),S=new T(32),C=0,k=0,A=a.i||0,j=0,M=a.w||0,P=0;A+2<o;++A){var te=y(A),F=A&32767,I=g[te];if(h[F]=I,g[te]=F,M<=A){var L=o-A;if((C>7e3||j>24576)&&(L>423||!l)){u=de(e,c,0,b,x,S,k,j,P,A-P,u),j=C=k=0,P=A;for(var R=0;R<286;++R)x[R]=0;for(var R=0;R<30;++R)S[R]=0}var z=2,ne=0,re=p,B=F-I&32767;if(L>2&&te==y(A-B))for(var oe=Math.min(f,L)-1,V=Math.min(32767,A),se=Math.min(258,L);B<=V&&--re&&F!=I;){if(e[A+z]==e[A+z-B]){for(var H=0;H<se&&e[A+H]==e[A+H-B];++H);if(H>z){if(z=H,ne=B,H>oe)break;for(var ce=Math.min(B,H-2),le=0,R=0;R<ce;++R){var ue=A-B+R&32767,G=ue-h[ue]&32767;G>le&&(le=G,I=ue)}}}F=I,I=h[F],B+=F-I&32767}if(ne){b[j++]=268435456|N[z]<<18|ee[ne];var fe=N[z]&31,pe=ee[ne]&31;k+=D[fe]+O[pe],++x[257+fe],++S[pe],M=A+z,++C}else b[j++]=e[A],++x[e[A]]}}for(A=Math.max(A,M);A<o;++A)b[j++]=e[A],++x[e[A]];u=de(e,c,l,b,x,S,k,j,P,A-P,u),l||(a.r=u&7|c[u/8|0]<<3,u-=7,a.h=g,a.p=h,a.i=A,a.w=M)}else{for(var A=a.w||0;A<o+l;A+=65535){var me=A+65535;me>=o&&(c[u/8|0]=l,me=o),u=U(c,u+1,e.subarray(A,me))}a.i=o}return ae(s,0,r+ie(u)+i)},pe=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,r=9;--r;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),me=function(){var e=-1;return{p:function(t){for(var n=e,r=0;r<t.length;++r)n=pe[n&255^t[r]]^n>>>8;e=n},d:function(){return~e}}},he=function(e,t,n,r,i){if(!i&&(i={l:1},t.dictionary)){var a=t.dictionary.subarray(-32768),o=new w(a.length+e.length);o.set(a),o.set(e,a.length),e=o,i.w=a.length}return fe(e,t.level==null?6:t.level,t.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,r,i)},ge=function(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n},_e=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function ve(e,t){return he(e,t||{},0,0)}var ye=function(e,t,n,r){for(var i in e){var a=e[i],o=t+i,s=r;Array.isArray(a)&&(s=ge(r,a[1]),a=a[0]),ArrayBuffer.isView(a)?n[o]=[a,s]:(n[o+=`/`]=[new w(0),s],ye(a,o,n,r))}},be=typeof TextEncoder<`u`&&new TextEncoder,xe=typeof TextDecoder<`u`&&new TextDecoder;try{xe.decode(G,{stream:!0})}catch{}function K(e,t){if(t){for(var n=new w(e.length),r=0;r<e.length;++r)n[r]=e.charCodeAt(r);return n}if(be)return be.encode(e);for(var i=e.length,a=new w(e.length+(e.length>>1)),o=0,s=function(e){a[o++]=e},r=0;r<i;++r){if(o+5>a.length){var c=new w(o+8+(i-r<<1));c.set(a),a=c}var l=e.charCodeAt(r);l<128||t?s(l):l<2048?(s(192|l>>6),s(128|l&63)):l>55295&&l<57344?(l=65536+(l&1047552)|e.charCodeAt(++r)&1023,s(240|l>>18),s(128|l>>12&63),s(128|l>>6&63),s(128|l&63)):(s(224|l>>12),s(128|l>>6&63),s(128|l&63))}return ae(a,0,o)}var Se=function(e){var t=0;if(e)for(var n in e){var r=e[n].length;r>65535&&oe(9),t+=r+4}return t},Ce=function(e,t,n,r,i,a,o,s){var c=r.length,l=n.extra,u=s&&s.length,d=Se(l);_e(e,t,o==null?67324752:33639248),t+=4,o!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(a<0&&8),e[t++]=i&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var f=new Date(n.mtime==null?Date.now():n.mtime),p=f.getFullYear()-1980;if((p<0||p>119)&&oe(10),_e(e,t,p<<25|f.getMonth()+1<<21|f.getDate()<<16|f.getHours()<<11|f.getMinutes()<<5|f.getSeconds()>>1),t+=4,a!=-1&&(_e(e,t,n.crc),_e(e,t+4,a<0?-a-2:a),_e(e,t+8,n.size)),_e(e,t+12,c),_e(e,t+14,d),t+=16,o!=null&&(_e(e,t,u),_e(e,t+6,n.attrs),_e(e,t+10,o),t+=14),e.set(r,t),t+=c,d)for(var m in l){var h=l[m],g=h.length;_e(e,t,+m),_e(e,t+2,g),e.set(h,t+4),t+=4+g}return u&&(e.set(s,t),t+=u),t},we=function(e,t,n,r,i){_e(e,t,101010256),_e(e,t+8,n),_e(e,t+10,n),_e(e,t+12,r),_e(e,t+16,i)};function Te(e,t){t||={};var n={},r=[];ye(e,``,n,t);var i=0,a=0;for(var o in n){var s=n[o],c=s[0],l=s[1],u=l.level==0?0:8,d=K(o),f=d.length,p=l.comment,m=p&&K(p),h=m&&m.length,g=Se(l.extra);f>65535&&oe(11);var _=u?ve(c,l):c,v=_.length,y=me();y.p(c),r.push(ge(l,{size:c.length,crc:y.d(),c:_,f:d,m,u:f!=o.length||m&&p.length!=h,o:i,compression:u})),i+=30+f+g+v,a+=76+2*(f+g)+(h||0)+v}for(var b=new w(a+22),x=i,S=a-i,C=0;C<r.length;++C){var d=r[C];Ce(b,d.o,d,d.f,d.u,d.c.length);var T=30+d.f.length+Se(d.extra);b.set(d.c,d.o+T),Ce(b,i,d,d.f,d.u,d.c.length,d.o,d.m),i+=16+T+(d.m?d.m.length:0)}return we(b,i,r.length,S,x),b}var Ee={"https://mw-searchstax.github.io/university-health-search-demo/locations/rehabilitation-center/":{source:`data:image/jpeg;base64,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`,path:`thumbnails/rehabilitation-center.jpg`},"https://mw-searchstax.github.io/university-health-search-demo/care/services/rehabilitation/":{source:`data:image/jpeg;base64,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`,path:`thumbnails/rehabilitation-design.jpg`}},De=[{label:`Relevance`,order:``},{label:`Page address (A–Z)`,order:`url asc`},{label:`Page address (Z–A)`,order:`url desc`}],Oe=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SearchStax JavaScript Starter</title>
  <link rel="stylesheet" href="./search.css">
  <script id="search-starter-module" type="module" src="./search.js" data-ui-kit="%%UI_KIT_URL%%"><\/script>
</head>
<body class="search-starter-page">
  <main class="search-starter">
    %%COMPANY_LOGO%%
    <h1>%%HEADING%%</h1>
    <form class="search-starter__form" role="search">
      <label class="search-starter__sr-only" for="search-query">%%SEARCH_FIELD_TEXT%%</label>
      <input id="search-query" type="search" value="%%INITIAL_QUERY%%" placeholder="%%SEARCH_FIELD_TEXT%%" autocomplete="off" required>
      <button class="search-starter__submit" type="submit" disabled>%%SEARCH_BUTTON_TEXT%%</button>
    </form>
    <div id="search-feedback">
      <p id="search-status" role="status" tabindex="-1">Connecting to search…</p>
      <button id="search-retry" type="button" class="search-starter__submit" aria-describedby="search-status" hidden>Retry search</button>
      <button id="search-reload" type="button" class="search-starter__submit" aria-describedby="search-status" hidden>Reload search</button>
    </div>
    <div id="search-answer"></div>
    <div id="search-sorting" hidden>
      <label class="search-starter__sort" for="search-sort-order">
        Sort by <select id="search-sort-order"></select>
      </label>
    </div>
    <div class="search-starter__body" id="search-output" aria-busy="false">
      <aside class="search-starter__filters" aria-label="Filter search results" hidden>
        <div id="search-facets"></div>
      </aside>
      <div>
        <div id="search-results"></div>
        <p class="search-starter__no-results" id="search-no-results" hidden></p>
        <div data-pagination-focus tabindex="-1" role="group" aria-label="Search result pagination">
          <div id="search-pagination"></div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
`,ke=`import { sampleSuggestionSource, setupSearchSuggestions } from './suggestions.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { getAnalyticsSettings, setupResultTracking } from './result-tracking.js';
import { setupStarterServices } from './starter-services.js';
import { setupPaginationFocus } from './pagination-focus.js';
import { contentLanguageTag } from './content-language.js';
import { starterPassages } from './starter-passages.js';
import { readCustomerEndpoint } from './web-url.js';
import { promotionEntries, renderPromotionBanners, placePromotionBanners } from './promotion-display.js';

const logo = document.querySelector('.search-starter__logo');
if (logo) {
  logo.addEventListener('error', () => { logo.hidden = true; });
  if (logo.complete && !logo.naturalWidth) logo.hidden = true;
}

// UI Kit connection settings
// For a connected-app download, add your Select endpoint and read-only token here.
const config = %%STARTER_CONFIG%%;

// Display labels for the demo facet values.
const demoFacets = %%DEMO_FACETS%%;
const demoThumbnails = %%DEMO_THUMBNAILS%%;
const demoSorting = %%DEMO_SORTING%%;
const language = config.language;
const resultLanguage = contentLanguageTag(language);
const usesDemoProfile = config.searchURL === demoFacets.searchURL &&
  config.model === demoSorting.model && resultLanguage === 'en';

const form = document.querySelector('.search-starter__form');
const submit = form.querySelector('button');
const query = document.querySelector('#search-query');
const status = document.querySelector('#search-status');
const feedback = document.querySelector('#search-feedback');
const retry = document.querySelector('#search-retry');
const reload = document.querySelector('#search-reload');
const output = document.querySelector('#search-output');
const externalPromotions = document.createElement('section');
externalPromotions.setAttribute('aria-label', 'External promotions');
externalPromotions.hidden = true;
placePromotionBanners(externalPromotions, output, config.bannerPlacement);
const noResultsMessage = document.querySelector('#search-no-results');


function showFeedback(message, action) {
  status.textContent = message;
  if ((document.activeElement === retry || document.activeElement === reload) && document.activeElement !== action) {
    status.focus({ preventScroll: true });
  }
  retry.hidden = action !== retry;
  reload.hidden = action !== reload;
}

function withPreviousResults(message) {
  return document.querySelector('#search-results .searchstax-search-result a')
    ? message + ' Previous results are still showing.' : message;
}

reload.addEventListener('click', () => window.location.reload());

async function loadUiKit() {
  const script = document.createElement('script');
  script.src = document.querySelector('#search-starter-module').dataset.uiKit;
  const timer = window.setTimeout(() => showFeedback('Connecting to search is taking longer than usual.', reload), 15000);
  try {
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  } finally {
    window.clearTimeout(timer);
  }
}

// UI Kit 4.2.34 does not expose a failure hook for result requests. Keep this
// adapter on the starter's own instance so other searches on the page are unaffected.
function enableResultRecovery(search) {
  const helper = search.searchHelper;
  const kitSearch = helper.search.bind(helper);
  let active;
  helper.search = async (settings, render, ignoreCancellation, forceNotCorrected, facetType) => {
    if (facetType) return kitSearch(settings, render, ignoreCancellation, forceNotCorrected, facetType);
    if (!settings.query) return;
    active?.abort();
    const request = new AbortController();
    active = request;
    search.dataLayer.setSearchTerm(settings.query);
    search.dataLayer.setLoading(true);
    output.setAttribute('aria-busy', 'true');
    noResultsMessage.hidden = true;
    externalPromotions.hidden = true;
    showFeedback(withPreviousResults('Searching…'));
    const timer = window.setTimeout(() => {
      if (active === request) showFeedback(withPreviousResults('Search is taking longer than usual.'), retry);
    }, 15000);
    try {
      const url = helper.url + helper.generateQueryParams(settings, forceNotCorrected);
      const response = await fetch(url, { headers: helper.authHeader, signal: request.signal });
      if (!response.ok) throw new Error('Search returned HTTP ' + response.status);
      const data = await response.json();
      if (active !== request) return;
      if (typeof data.response?.numFound !== 'number' || !Array.isArray(data.response.docs)) {
        throw new Error('Incomplete search response');
      }
      render(data);
      const total = data.response.numFound;
      showFeedback(total === 1 ? '1 result' : total + ' results');
      noResultsMessage.hidden = total !== 0;
    } catch {
      if (active === request) showFeedback(withPreviousResults('Search couldn’t load the requested results.'), retry);
    } finally {
      window.clearTimeout(timer);
      if (active === request) {
        active = undefined;
        output.setAttribute('aria-busy', 'false');
        search.dataLayer.setLoading(false);
      }
    }
  };
  retry.addEventListener('click', () => search.search(search.dataLayer.searchObject));
}

noResultsMessage.textContent = config.noResultsText;
form.addEventListener('submit', event => event.preventDefault());
if (config.showSuggestions) {
  let source = usesDemoProfile ? sampleSuggestionSource : null;
  if (!usesDemoProfile && config.suggesterURL) {
    const endpoint = readCustomerEndpoint(config.suggesterURL, 'emsuggest');
    if (endpoint) source = createCustomerSuggestionSource({ token: config.searchAuth, language }, endpoint);
  }
  if (source) setupSearchSuggestions(form, 'starter-search-suggestions')(source);
}

async function startSearch() {
  if (!config.searchURL || !config.searchAuth) {
    showFeedback('Set the Select endpoint and read-only token in search.js to start searching.');
    return;
  }
  await loadUiKit();
  const kit = window['@searchstaxInc/searchstudioUxJs'] || window.Searchstax;
  const Searchstax = typeof kit === 'function' ? kit : kit.Searchstax;
  const search = new Searchstax();
  const pager = document.querySelector('[data-pagination-focus]');
  pager.addEventListener('click', event => {
    if (event.target.closest('button[data-page-step]')) pager.after(feedback);
  }, true);
  setupPaginationFocus(pager, () => search);
  const analytics = getAnalyticsSettings(config);
  search.initialize({
    searchURL: config.searchURL,
    searchAuth: config.searchAuth,
    authType: 'token',
    language,
    model: config.model,
    suggesterURL: '',
    ...analytics,
    router: { enabled: false },
    hooks: {
      afterSearch(items, response) {
        const total = response?.response?.numFound;
        if (typeof total !== 'number') return [];
        const passages = starterPassages(response, usesDemoProfile);
        const results = items.filter(item => /^https?:\\/\\//i.test(item.url));
        renderPromotionBanners(externalPromotions, promotionEntries(response.externalLinks), config.promotionHeading, resultLanguage);
        return results.map(item => ({
          ...item, ...passages(item), resultLanguage, promotionBadge: config.promotionBadge,
          demoThumbnail: usesDemoProfile ? demoThumbnails[item.url] : '',
        }));
      },
    },
  });
  enableResultRecovery(search);
  search.setCookiesDisabled(!analytics.trackApiKey);
  setupResultTracking(document.querySelector('#search-results'), search);

  if (config.showSorting) {
    const sortField = document.querySelector('#search-sorting');
    const sortOrder = document.querySelector('#search-sort-order');
    if (usesDemoProfile) {
      sortOrder.replaceChildren(...demoSorting.options.map(({ label, order }) => new Option(label, order)));
      sortField.hidden = false;
    } else {
      search.dataLayer.$searchResultsMetadata.subscribe(metadata => {
        const options = metadata?.sorting?.options ?? [];
        sortOrder.replaceChildren(...options.map(({ key, value }) => new Option(value || key, key)));
        const order = search.dataLayer.searchObject.order;
        sortOrder.value = options.find(({ key }) => encodeURIComponent(key) === order)?.key ?? '';
        sortField.hidden = options.length === 0;
      });
    }
    sortOrder.addEventListener('change', () => {
      const current = search.dataLayer.searchObject;
      if (current.query) {
        sortField.after(feedback);
        search.dataLayer.setSearchObject({ ...current, order: encodeURIComponent(sortOrder.value), page: 1 });
      }
    });
  }

  const passageMarkup = '{{#matched}}<mark class="search-result-hit">{{text}}</mark>{{/matched}}{{^matched}}{{text}}{{/matched}}';
  search.addSearchResultsWidget('search-results', {
    renderMethod: 'pagination',
    resultsPerPage: config.resultsPerPage,
    templates: {
      mainTemplate: {
        template: '<div id="search-result-list" class="searchstax-search-results"></div>',
        searchResultsContainerId: 'search-result-list',
      },
      searchResultTemplate: {
        template: \`<article class="searchstax-search-result">
          {{#promoted}}<span class="search-promotion-marker">{{promotionBadge}}</span>{{/promoted}}
          {{#demoThumbnail}}<img class="search-starter__result-thumbnail" src="{{demoThumbnail}}" alt="" width="384" height="216" loading="lazy">{{/demoThumbnail}}
          {{#hasRibbon}}<span class="searchstax-search-result-ribbon">{{#ribbonParts}}\${passageMarkup}{{/ribbonParts}}</span>{{/hasRibbon}}
          <h2{{#resultLanguage}} lang="{{resultLanguage}}"{{/resultLanguage}}><a href="{{url}}" data-result-id="{{uniqueId}}">{{#titleParts}}\${passageMarkup}{{/titleParts}}</a></h2>
          <p class="search-starter__result-description"{{#resultLanguage}} lang="{{resultLanguage}}"{{/resultLanguage}}>{{#descriptionParts}}\${passageMarkup}{{/descriptionParts}}</p>
          {{#otherFields}}<p>{{#label}}{{label}}: {{/label}}{{#parts}}\${passageMarkup}{{/parts}}</p>{{/otherFields}}
        </article>\`,
      },
      noSearchResultTemplate: { template: ' ' },
    },
  });

  if (config.showFilters) {
    document.querySelector('.search-starter__filters').hidden = false;
    const facets = document.querySelector('#search-facets');
    facets.addEventListener('change', () => facets.after(feedback), true);
    if (usesDemoProfile) {
      new MutationObserver(() => {
        facets.querySelectorAll('[data-facet-value]').forEach(label => {
          const value = label.dataset.facetValue;
          const text = Object.hasOwn(demoFacets.labels, value) ? demoFacets.labels[value] : value;
          if (label.textContent !== text) label.textContent = text;
        });
      }).observe(facets, { childList: true, subtree: true });
    }
    search.addFacetsWidget('search-facets', {
      facetingType: 'or',
      itemsPerPageDesktop: 20,
      itemsPerPageMobile: 20,
      templates: {
        mainTemplateDesktop: { template: '<div class="search-facet-groups"></div>', facetsContainerClass: 'search-facet-groups' },
        mainTemplateMobile: { template: ' ' },
        facetItemContainerTemplate: {
          template: '<fieldset><legend>{{label}}</legend><div class="search-facet-options search-facet-choices"></div></fieldset>',
          facetListContainerClass: 'search-facet-options',
        },
        facetItemTemplate: {
          template: '<label><input class="search-facet-checkbox" type="checkbox" {{#disabled}}disabled{{/disabled}} {{#isChecked}}checked{{/isChecked}}><span data-facet-value="{{value}}">{{value}}</span><small>{{count}}</small></label>',
          inputCheckboxClass: 'search-facet-checkbox',
          checkTriggerClasses: [],
        },
      },
    });
  }

  search.addPaginationWidget('search-pagination', {
    templates: { mainTemplate: {
      template: '{{#results.length}}<nav class="search-starter__pagination" aria-label="Search result pages"><span tabindex="-1" data-page-range data-page-start="{{startResultIndex}}">{{startResultIndex}}–{{endResultIndex}} of {{totalResults}} results</span>{{^isFirstPage}}<button type="button" data-page-step="previous">Previous</button>{{/isFirstPage}}{{^isLastPage}}<button type="button" data-page-step="next">Next</button>{{/isLastPage}}</nav>{{/results.length}}',
    } },
  });
  search.dataLayer.setItemsPerPage(config.resultsPerPage);

  const services = setupStarterServices(form, document.querySelector('#search-answer'), config, config);
  function runSearch() {
    form.after(feedback);
    const term = query.value.trim();
    if (!term) {
      showFeedback('Enter a search term.');
      return;
    }
    void services.search(term);
    const current = search.dataLayer.searchObject;
    const next = { ...current, query: term, page: 1, facets: [] };
    if (term === current.query && current.page === 1 && !current.facets.length) {
      search.search(next);
    } else {
      search.dataLayer.setSearchObject(next);
    }
  }

  submit.disabled = false;
  form.addEventListener('submit', runSearch);
  if (query.value.trim()) runSearch();
  else showFeedback('Enter a search term.');
}

startSearch().catch(() => {
  submit.disabled = true;
  showFeedback('Search couldn’t start. Reload to try again.', reload);
});
`,Ae="# SearchStax JavaScript Starter\n\nThis starter uses the SearchStax JavaScript UI Kit and your Search Lab design. A SearchLabDemo download is ready to search. For a connected-app download, add your endpoint and read-only token under **Connect Your Search App** before you run it.\n\n## Run the Demo\n\n1. Extract the ZIP file.\n2. With Python 3 installed, open a terminal in the extracted folder that contains `index.html` and run this command.\n\n   ```sh\n   python3 -m http.server 4175 --bind 127.0.0.1\n   ```\n\n3. Open [http://127.0.0.1:4175/](http://127.0.0.1:4175/) in your browser. You'll need an internet connection to load the UI Kit and search the demo.\n\nPress Ctrl+C in the terminal when you're done.\n\n## Try your design\n\nFor SearchLabDemo, search for **rehabilitation** to see results from the selected profile.\n\nIf you enabled sample thumbnails, the ZIP includes fictional images for two Central County results.\n\nSorting is on by default and starts in Relevance order. When sorting is enabled, use **Sort by** to put all matching pages in page-address order, even when the results span several pages.\n\nIf search can’t start, choose **Reload search**. If a search fails or takes longer than usual, choose **Retry search** to repeat it with the same query, sort, filters and page. When earlier results are still on screen, the status message tells you.\n\nIf you enabled sample search suggestions, type `reh` to try them. Choosing a suggestion runs a search against the fictional demo.\n\nThe starter uses the **Results per page** setting from your design. To change it in the starter, edit `resultsPerPage` in `search.js`.\n\nTo change the message visitors see when a search finds no matches, edit `noResultsText` in `search.js`.\n\n## Connect Your Search App\n\n1. In Site Search, open an existing Search App with indexed content. Go to **App Settings > All APIs > Search & Indexing** to find the Select endpoint (ending in `/emselect`) and a **Read Only** token.\n2. Open `search.js` and find **UI Kit connection settings**. Set `searchURL` to your Select endpoint, `searchAuth` to the Read Only token, and `model` to your Search Profile name. Set `language` to the language configured for the App, such as `fr_ca` for Canadian French. Result titles and descriptions use that language while the starter controls stay in English. If you enabled filters in Search Lab, the starter displays the facets configured for that profile.\n3. In your Search Profile, go to **Configurations > Basic Configurations > Results Fields**. Map the fields you want to show to **Title**, **URL**, and **Description**. Use full `https://` or `http://` URLs in the field you map to **URL**. If you're showing filters, configure the indexed fields visitors can filter by under **Faceting**. Publish your changes in Site Search. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields) · [Faceting](https://support.searchstax.com/hc/en-us/articles/40836775695117-Faceting)\n4. In `index.html`, update the page title, heading, and search field text for your site. Change the sample query in the search input's `value` attribute to a term that matches your content, then reload the page to try it.\n\n### Promotions\n\nSearch with a published trigger on the selected profile. An elevated result gets the indexed badge from your design. External items use the banner heading, style, and placement from your design. A normal query shows the profile’s ordinary results. To try the fixed samples, choose **Fictional demo** in local Search Lab. [Promotions setup](https://support.searchstax.com/hc/en-us/articles/40155433600397-Promotions)\n\n### Related Searches and Smart Answers\n\nThe download includes the selected app’s feature settings in `feature-settings.js`. Related Searches uses the app entitlement and the published setting for the search language. Smart Answers uses its entitlement and the published setting for the selected profile and language. An off or unknown setting leaves that feature out.\n\nIn `search.js`, enter `relatedURL` and the browser-safe `discoveryKey` from **App Settings → All APIs → Discovery** to receive related terms. For Smart Answers, enter the streaming `questionURL` or a same-origin streaming proxy. Answers use the search token, language, and profile. [Related Searches API](https://support.searchstax.com/hc/en-us/articles/40243333638541-Related-Searches-API) · [Smart Answers setup](https://support.searchstax.com/hc/en-us/articles/40075209934989-Smart-Answers)\n\nIf you switch apps or the published settings change, reconnect in Build with the updated app configuration and download a fresh starter. For fixed examples of both features, choose **Fictional demo** in local Search Lab before downloading.\n\nResult links work with tracking off, the default. To enable search and result-click tracking on your own app, open **App Settings > All APIs > Analytics**. In `search.js`, set `analyticsBaseUrl` to the origin of your Tracking URL (the `https://` address before `/api/v2/track/`) and `trackApiKey` to the Tracking key. Leave both blank to keep tracking off. If your site requires consent, supply these settings only after the visitor opts in.\n\nAlways use a Read Only credential for search requests in browser code. For a private setup where the endpoint or token must stay on your server, use a server-side proxy. [Hide Tokens and Endpoints in UI Kits](https://support.searchstax.com/hc/en-us/articles/39440547272077-Hide-Tokens-and-Endpoints-in-UI-Kits)\n\nIf you move the search UI into an existing page, keep the `.search-starter` wrapper so the styles in `search.css` still apply. The standalone page uses `.search-starter-page` on the body for the page margin and colors.\n\nFor sorting on your app, configure and publish sort options on your Search Profile under **Configurations > Advanced Configurations > Sorting**. Set `showSorting` to `true` in `search.js`. **Sort by** displays the published options after a search. Choosing an option keeps the current filters and returns to the first page. [Facets and sorting setup](https://support.searchstax.com/hc/en-us/articles/38268731934349-Setting-Up-Facets-Filters-and-Sorting)\n\nFor live suggestions on your app, enable and publish Auto-Suggest in Site Search. In `search.js`, set `suggesterURL` to the app’s HTTPS Auto-Suggest endpoint ending in `/emsuggest`, and set `showSuggestions` to `true`. The starter uses the same read-only token and language as search. Use the arrow keys and Enter to search for a suggestion, or press Escape to dismiss the list. Leave `suggesterURL` empty to use search without connected suggestions. [Auto-Suggest](https://support.searchstax.com/hc/en-us/articles/40075200119437-Auto-Suggest) · [Auto-Suggest API](https://support.searchstax.com/hc/en-us/articles/40243330090893-Auto-Suggest-API)\n",je=`.search-related-terms { margin-block: 1rem; }
.search-related-terms[hidden] { display: none; }
.search-related-terms > div { display: flex; flex-wrap: wrap; gap: .5rem; margin-block-start: .4rem; }
.search-related-terms button { font: inherit; color: inherit; background: transparent; cursor: pointer; padding: .35em .65em; border: 1px solid currentColor; border-radius: var(--search-corners, 5px); }
`,Me=`import { readCustomerEndpoint } from './web-url.js';

export function relatedSource(endpoint, key, language) {
  const url = readCustomerEndpoint(endpoint || '', 'related-search');
  if (!url || !key?.trim()) return null;
  return async (query, signal) => {
    const request = new URL(url);
    request.search = new URLSearchParams({ search: query });
    if (language) request.searchParams.set('language', language);
    const response = await fetch(request, {
      signal, headers: { Authorization: key.trim(), Accept: 'application/json' },
      credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
    });
    if (!response.ok) throw new Error('Discovery request failed');
    const data = await response.json();
    if (data.success === false || !Array.isArray(data.response?.docs)) throw new Error('Discovery unavailable');
    return data.response.docs.map(doc => doc?.related_search).filter(term => typeof term === 'string' && term.trim());
  };
}

export function setupRelatedSearches(form, selectTerm) {
  const section = document.createElement('section');
  section.className = 'search-related-terms';
  section.setAttribute('aria-label', 'Related searches');
  const heading = document.createElement('strong');
  heading.textContent = 'Related searches';
  const options = document.createElement('div');
  section.append(heading, options);
  let controller;
  let currentQuery;
  let currentSource;

  function clear() {
    controller?.abort();
    controller = undefined;
    currentSource = undefined;
    currentQuery = undefined;
    section.remove();
    options.replaceChildren();
  }

  async function show(anchor, placement, query, source) {
    if (!anchor || !source || !query || placement === 'off') { clear(); return; }
    function move() {
      // Keep the typeahead list attached to its input when both features are visible.
      const searchBoxEnd = form.parentElement.querySelector(':scope > .search-suggestions-feedback') || form;
      const preceding = placement === 'above' ? searchBoxEnd : anchor;
      if (preceding.nextElementSibling !== section) preceding.after(section);
    }
    if (currentQuery === query && currentSource === source) {
      move();
      return;
    }
    clear();
    currentQuery = query;
    currentSource = source;
    section.hidden = true;
    move();
    const pending = new AbortController();
    controller = pending;
    try {
      const terms = await source(query, pending.signal);
      if (pending.signal.aborted) return;
      for (const term of new Set(terms)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = term;
        button.addEventListener('click', () => selectTerm(term));
        options.append(button);
      }
      section.hidden = !options.childElementCount;
    } catch {
      if (!pending.signal.aborted) {
        options.textContent = 'Related searches are unavailable for this query. Check the Discovery settings for your app.';
        section.hidden = false;
        currentQuery = undefined;
      }
    }
  }
  return { show, clear, setLabel(label) {
    heading.textContent = label;
    section.setAttribute('aria-label', label);
  } };
}
`,Ne=`.search-facet-choices {
  display: var(--search-filter-display, block);
  flex-wrap: wrap;
  align-items: flex-start;
  gap: .35rem .8rem;
}
.search-facet-choices label {
  display: flex;
  align-items: center;
  gap: .4rem;
  max-width: 100%;
  min-height: 36px;
  overflow-wrap: anywhere;
  cursor: pointer;
}
.search-facet-choices label:has(input:focus-visible) { outline: 2px solid currentColor; outline-offset: 2px; }
`,Pe=`.search-starter-page { margin: 0; color: #202e3a; background: #fff; }
.search-starter, .search-starter *, .search-starter *::before, .search-starter *::after { box-sizing: border-box; }
.search-starter { max-width: 1150px; margin: auto; padding: 32px clamp(16px, 4vw, 42px); }
.search-starter h1 { margin: 0 0 8px; }
.search-starter__logo { display: block; width: auto; max-width: min(100%, 13rem); height: 2.5rem; margin-bottom: .75rem; object-fit: contain; object-position: left center; }
.search-starter__logo[hidden] { display: none; }
.search-starter p { line-height: 1.5; }
.search-starter input, .search-starter button { font: inherit; }
.search-starter button { cursor: pointer; }
.search-starter button:disabled { cursor: default; }
.search-starter :focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.search-starter__form { display: flex; gap: 4px; max-width: 650px; margin-top: 20px; }
.search-starter__form input { flex: 1; min-width: 0; padding: 10px 12px; border: 1px solid #465766; border-radius: 5px; }
.search-starter__submit { flex: none; max-width: 45%; padding: 10px 14px; border: 0; border-radius: 5px; font-weight: 700; overflow-wrap: anywhere; }
.search-starter__answer { margin-top: 12px; }
.search-starter__answer h2 { margin: 0 0 8px; font-size: 1rem; }
.search-starter__answer-content { font-size: .875rem; line-height: 1.55; white-space: pre-wrap; }
.search-starter__sort { margin-bottom: 12px; }
.search-starter__body { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; }
.search-starter__filters fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.search-starter__filters legend { margin-bottom: 8px; font-weight: 700; }
.search-starter__filters label { display: flex; align-items: center; gap: 6px; min-height: 36px; overflow-wrap: anywhere; }
.search-starter__filters input { flex: none; width: 24px; height: 24px; margin: 0; }
.search-starter__filters small { margin-left: auto; }
.search-starter .searchstax-search-result { min-width: 0; padding: 16px; border: 1px solid #d8dfe3; border-radius: 5px; overflow-wrap: anywhere; }
.search-starter__result-thumbnail { display: block; width: min(100%, 12rem); height: auto; margin: 0 0 8px; border-radius: 4px; }
.search-starter .searchstax-search-result h2 {
  margin: 0 0 7px;
  font-size: var(--search-result-title-size);
  line-height: var(--search-result-title-line-height);
  letter-spacing: var(--search-result-title-letter-spacing);
}
.search-starter .searchstax-search-result a { color: #263f58; }
.search-starter .searchstax-search-result p {
  margin: 0;
  font-size: var(--search-result-description-size);
  line-height: var(--search-result-description-line-height);
}
.search-starter__no-results { overflow-wrap: anywhere; }
.search-starter__pagination { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 16px; }
.search-starter__sr-only,
.search-starter-page #searchAccessibilityContainer {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
`,Fe=`/* Visitor controls used by the preview and the downloadable search pages. */
.search-lab__results-heading,
.search-results-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-bottom: 13px;
  border-bottom: 1px solid var(--search-divider, #d8dfe3);
  color: var(--search-ink, #202e3a);
  font-size: .8125rem;
}

.search-lab__sort,
.search-starter__sort,
.lab-experiences [data-exp-sort] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .5rem;
  max-width: 100%;
  font-size: .8125rem;
}

:is(.search-lab__sort, .search-starter__sort, [data-exp-sort], [data-exp-language]) select {
  max-width: 100%;
  min-height: 36px;
  appearance: none;
  padding: 4px 8px;
  padding-inline-end: 28px;
  border: 1px solid var(--search-ink, #465766);
  border-radius: var(--search-corners, 5px);
  color: var(--search-ink, #202e3a);
  background-color: var(--search-background, #fff);
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position: right 14px center, right 9px center;
  background-size: 5px 5px;
  background-repeat: no-repeat;
  font: inherit;
}

:is(.search-lab__sort, .search-starter__sort, [data-exp-sort], [data-exp-language]) select:dir(rtl) {
  background-position: left 9px center, left 14px center;
}

@media (forced-colors: active) {
  :is(.search-lab__sort, .search-starter__sort, [data-exp-sort], [data-exp-language]) select {
    appearance: auto;
    background-image: none;
  }
}
`,q=`:where(.search-starter, .search-lab[data-lab-view='design'] #lab-preview) {
  --search-result-title-size: 1rem;
  --search-result-title-line-height: 1.35;
  --search-result-title-letter-spacing: -.025em;
  --search-result-description-size: .875rem;
  --search-result-description-line-height: 1.5;
}

:where(.search-starter, .search-lab[data-lab-view='design'] #lab-preview) .search-result-hit {
  color: var(--search-hit-ink, MarkText);
  background-color: var(--search-hit-background, Mark);
  font-weight: var(--search-hit-weight, inherit);
  font-style: var(--search-hit-style, inherit);
}

@media (forced-colors: active) {
  :where(.search-starter, .search-lab[data-lab-view='design'] #lab-preview) .search-result-hit {
    forced-color-adjust: none;
    color: var(--search-hit-forced-ink, HighlightText);
    background-color: var(--search-hit-forced-background, Highlight);
  }
}

:is(.mapped-result-card, .search-starter .searchstax-search-result) .searchstax-search-result-ribbon {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin-block-end: .5rem;
  padding: .15rem .6rem;
  border-inline-start: .25rem solid currentColor;
  border-radius: 0 .2rem .2rem 0;
  background: var(--search-accent, #33475a);
  color: var(--search-accent-text, #fff);
  font-size: .8125rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}
`,Ie=`// Search Lab’s demo index can still contain records from before the site rename.
export function demoResultText(value) {
  return typeof value === 'string' ? value.replaceAll('Alder Coast', 'Central County') : '';
}

export function demoResultTitle(value) {
  return demoResultText(value)
    .replace(/<\\/?(?:em|b|strong)>/gi, '')
    .replace(/\\s*\\|\\s*Central County University Health\\s*$/, '');
}
`,Le=`.sample-search-suggestions {
  max-width: 650px;
  margin: 4px 0 10px;
  padding: 4px;
  border: 1px solid #718075;
  border-radius: 5px;
  color: #253a34;
  background: #fff;
}

.sample-search-suggestions[hidden] { display: none; }
.sample-search-suggestions p { margin: 4px 8px; font-size: .8125rem; font-weight: 600; }
.sample-search-suggestions ul { margin: 0; padding: 0; list-style: none; }
.sample-search-suggestions [role='option'] { min-height: 40px; padding: 9px 8px; cursor: pointer; overflow-wrap: anywhere; }
.sample-search-suggestions [role='option']:hover { background: #f2f6f4; }
.sample-search-suggestions [aria-selected='true'] { background: #e5eee8; outline: 2px solid #526a5b; outline-offset: -2px; }
.search-suggestions-feedback { margin: 4px 0 8px; color: #526759; font-size: .8125rem; }
.search-suggestions-feedback:empty { display: none; }

@media (forced-colors: active) {
  .sample-search-suggestions [aria-selected='true'] { outline-color: Highlight; }
}
`,Re=`const sampleTerms = [
  'campus flu clinic',
  'international health',
  'orthopedics',
  'primary care',
  'rehabilitation',
  'rehabilitation center',
  'sports medicine',
  'travel vaccinations',
];

export const sampleSuggestionSource = {
  label: 'Sample search suggestions',
  minimumChars: 3,
  suggest(prefix) {
    const normalized = prefix.toLowerCase();
    return sampleTerms.filter(term => term !== normalized && term.startsWith(normalized));
  },
};

export function setupSearchSuggestions(form, listId) {
  const input = form.querySelector('input[type="search"]');
  const popup = document.createElement('div');
  const label = document.createElement('p');
  const list = document.createElement('ul');
  const feedback = document.createElement('p');
  feedback.className = 'search-suggestions-feedback';
  feedback.setAttribute('role', 'status');
  popup.className = 'sample-search-suggestions';
  popup.hidden = true;
  label.id = listId + '-label';
  list.id = listId;
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-labelledby', label.id);
  popup.append(label, list);
  form.after(popup, feedback);

  let source = null;
  let pending = null;
  let activeIndex = -1;

  function close() {
    if (pending) {
      window.clearTimeout(pending.timer);
      pending.controller.abort();
      pending = null;
    }
    popup.hidden = true;
    list.replaceChildren();
    feedback.textContent = '';
    activeIndex = -1;
    input.removeAttribute('aria-activedescendant');
    if (source) input.setAttribute('aria-expanded', 'false');
  }

  function show(matches) {
    if (!matches.length) return;
    list.replaceChildren(...matches.map((term, index) => {
      const option = document.createElement('li');
      option.id = listId + '-' + index;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      if (source.language) option.lang = source.language;
      option.textContent = term;
      return option;
    }));
    popup.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function requestSuggestions() {
    close();
    const prefix = input.value.trim();
    const activeSource = source;
    if (!activeSource || prefix.length < activeSource.minimumChars) return;
    const request = { controller: new AbortController(), step: 0, timer: undefined };
    pending = request;
    const resolve = async () => {
      try {
        const matches = await activeSource.suggest(prefix, request.controller.signal);
        if (pending !== request || input.value.trim() !== prefix) return;
        show(matches);
        if (!popup.hidden && request.step) moveSelection(request.step);
      } catch {
        if (pending === request) feedback.textContent = 'Search suggestions are unavailable. You can continue searching.';
      } finally {
        if (pending === request) pending = null;
      }
    };
    if (activeSource.delay) request.timer = window.setTimeout(resolve, activeSource.delay);
    else void resolve();
  }

  function choose(option) {
    input.value = option.textContent;
    close();
    input.focus({ preventScroll: true });
    form.requestSubmit();
  }

  function moveSelection(step) {
    if (popup.hidden) {
      if (!pending) requestSuggestions();
      if (!pending) return false;
      pending.step = step;
      return true;
    }
    const options = list.children;
    if (activeIndex >= 0) options[activeIndex].setAttribute('aria-selected', 'false');
    if (activeIndex === -1) activeIndex = step > 0 ? 0 : options.length - 1;
    else activeIndex = (activeIndex + step + options.length) % options.length;
    const option = options[activeIndex];
    option.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', option.id);
    option.scrollIntoView({ block: 'nearest' });
    return true;
  }

  input.addEventListener('input', event => {
    if (event.isComposing) close();
    else requestSuggestions();
  });
  input.addEventListener('compositionend', requestSuggestions);
  input.addEventListener('blur', close);
  input.addEventListener('keydown', event => {
    if (!source || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        if (moveSelection(event.key === 'ArrowDown' ? 1 : -1)) event.preventDefault();
        break;
      case 'Escape':
        if (popup.hidden && !pending) break;
        event.preventDefault();
        close();
        break;
      case 'Enter':
        if (activeIndex < 0) break;
        event.preventDefault();
        choose(list.children[activeIndex]);
        break;
    }
  });
  form.addEventListener('submit', close);
  list.addEventListener('mousedown', event => event.preventDefault());
  list.addEventListener('click', event => {
    const option = event.target.closest('[role="option"]');
    if (option) choose(option);
  });

  return function setSuggestionSource(value) {
    if (source === value) return;
    source = value;
    close();
    if (source) {
      label.textContent = source.label;
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-controls', listId);
    } else {
      for (const attribute of ['role', 'aria-autocomplete', 'aria-controls', 'aria-expanded']) {
        input.removeAttribute(attribute);
      }
    }
  };
}
`,ze=`export function getAnalyticsSettings(connection) {
  const analyticsBaseUrl = connection.analyticsBaseUrl?.trim().replace(/\\/+$/, '');
  const trackApiKey = connection.trackApiKey?.trim();
  return analyticsBaseUrl && trackApiKey
    ? { analyticsBaseUrl, trackApiKey }
    : { analyticsBaseUrl: '', trackApiKey: '' };
}

export function setupResultTracking(host, search) {
  if (!search.dataLayer.searchstaxConfig?.trackApiKey) return;

  // Enter dispatches a click on an anchor. A middle click dispatches auxclick.
  host.addEventListener('click', trackResultClick);
  host.addEventListener('auxclick', trackResultClick);
  return () => {
    host.removeEventListener('click', trackResultClick);
    host.removeEventListener('auxclick', trackResultClick);
  };

  function trackResultClick(event) {
    const link = event.target.closest('a[data-result-id]');
    const layer = search.dataLayer;
    if (!link || event.defaultPrevented || layer.cookiesDisabled ||
        event.button !== (event.type === 'auxclick' ? 1 : 0)) return;

    const result = layer.searchResults?.find(item => item.uniqueId === link.dataset.resultId);
    const tracking = layer.parsedData.trackingData;
    const queue = window._msq;
    if (!result || !tracking.session || !queue) return;
    const command = ['trackClick', {
      key: tracking.trackApiKey, query: tracking.searchTerm, model: tracking.model,
      session: tracking.session, language: tracking.language, pageNo: tracking.currentPage,
      shownHits: tracking.recordsPerPage, totalHits: tracking.totalResults, latency: tracking.latencyVal,
      cDocId: result.uniqueId, cDocTitle: result.titleTracking, position: result.position,
    }];
    if (event.button === 1 || event.ctrlKey || event.metaKey || event.shiftKey ||
        event.altKey || (link.target && link.target !== '_self')) {
      queue.push(command);
      return;
    }

    event.preventDefault();
    // Give the tracker time to send the click, even when its script is still loading.
    // A blocked script or a stalled request must still let the visitor open the link.
    let timer = window.setTimeout(openResult, 1500);
    function openResult() {
      if (timer === undefined) return;
      window.clearTimeout(timer);
      timer = undefined;
      window.location.assign(link.href);
    }
    if (Array.isArray(queue)) queue.push(command);
    else queue.push(command, openResult);
  }
}
`,Be=`/**
 * Maintain focus when the UI Kit replaces its pagination controls.
 * @template {{ page: number, itemsPerPage: number | undefined }} Search
 * @param {HTMLElement} host
 * @param {() => {
 *   dataLayer: { loading: boolean, searchObject: Search, setSearchObject: (search: Search) => void },
 *   search: (search: Search) => unknown
 * } | null | undefined} getSearch
 */
export function setupPaginationFocus(host, getSearch) {
  const announcement = host.querySelector('[data-page-announcement]');
  let pending;
  let frame;

  function changePage(event) {
    const button = event.target instanceof Element && event.target.closest('button[data-page-step]');
    const api = getSearch();
    const current = api?.dataLayer.searchObject;
    if (!button || button.disabled || !current?.itemsPerPage || api.dataLayer.loading) return;
    const range = host.querySelector('[data-page-range]');
    const from = Number(range?.dataset.pageStart);
    const step = button.dataset.pageStep;
    if (!Number.isSafeInteger(from) || from < 1 || (step !== 'previous' && step !== 'next')) return;
    const page = 1 + Math.floor((from - 1) / current.itemsPerPage) + (step === 'next' ? 1 : -1);
    if (document.activeElement === button || event.detail === 0) {
      pending = { range: range.textContent.trim(), step };
      if (announcement) announcement.textContent = '';
      host.focus({ preventScroll: true });
    }
    const search = { ...current, page };
    // A failed request can leave the requested page ahead of the displayed range.
    if (page === current.page) api.search(search);
    else api.dataLayer.setSearchObject(search);
  }

  function restoreAfterRender() {
    if (!pending || document.activeElement !== host) return;
    const range = host.querySelector('[data-page-range]');
    const text = range?.textContent.trim();
    if (!text || text === pending.range) return;
    // Some UI Kits render the new range before they finish the current request.
    if (getSearch()?.dataLayer.loading) {
      frame ??= requestAnimationFrame(() => {
        frame = undefined;
        restoreAfterRender();
      });
      return;
    }
    const button = host.querySelector(\`button[data-page-step="\${pending.step}"]:not(:disabled)\`);
    pending = undefined;
    if (button) {
      button.focus();
      if (announcement) announcement.textContent = text;
    } else {
      range.focus();
    }
  }

  function leavePagination(event) {
    if (event.target === host) pending = undefined;
  }

  const observer = new MutationObserver(restoreAfterRender);
  observer.observe(host, { childList: true, characterData: true, subtree: true });
  host.addEventListener('click', changePage);
  host.addEventListener('focusout', leavePagination);
  return () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    observer.disconnect();
    host.removeEventListener('click', changePage);
    host.removeEventListener('focusout', leavePagination);
  };
}
`,J=`/** @param {string | undefined} value */
export function contentLanguageTag(value) {
  if (!value) return undefined;
  try {
    return Intl.getCanonicalLocales(value.trim().replaceAll('_', '-'))[0];
  } catch {
    return undefined;
  }
}
`,Ve=`/** @param {string} value */
export function webURL(value) {
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * @param {string} value
 * @param {'emselect' | 'emsuggest' | 'related-search'} route
 */
export function readCustomerEndpoint(value, route = 'emselect') {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.searchstax.com') ||
      url.port || url.username || url.password || url.search || url.hash ||
      !url.pathname.replace(/\\/$/, '').endsWith('/' + route)) return null;
    return url.href;
  } catch {
    return null;
  }
}
`,He=`import { webURL } from './web-url.js';
import { contentLanguageTag } from './content-language.js';

/** @typedef {{ token: string, profile: string, language: string, answerEndpoint?: string }} AnswerConnection */
const answerLimit = 65536;
const frameBoundary = /\\r\\n\\r\\n|\\n\\n|\\r\\r|\\n\\r\\n|\\r\\n\\n/;
const referenceDefinition = /^ {0,3}\\[([^\\]\\r\\n]+)\\]:[ \\t]*(<[^>\\r\\n]+>|[^\\s<>]+)(?:[ \\t]+"[^"\\r\\n]*")?[ \\t]*$/gm;
const answerLink = /(!?)\\[([^\\]\\n]+)\\](?:\\((<[^>\\n]+>|[^\\s()<>]+(?:\\([^()\\s]*\\)[^\\s()<>]*)*)(?:[ \\t]+"[^"\\n]*")?\\)|\\[([^\\]\\n]*)\\])?/g;

/** @param {string} value */
export function readAnswerEndpoint(value) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.searchstax.com') ||
      url.port || url.username || url.password || url.search || url.hash ||
      !/^\\/api\\/v1\\/(?:\\d+\\/)?answer\\/?$/.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

class AnswerError extends Error {}

/** @param {string} answer */
function cleanAnswer(answer) {
  return answer.replace(/\\[comment\\]: <> \\(\\{[\\s\\S]*?(?:\\}\\)|$)/g, '').trim();
}

/** @param {string} data */
function isAnswerFailure(data) {
  if (data.includes('[!CAUTION]')) return true;
  if (!data.trimStart().startsWith('{')) return false;
  try {
    return JSON.parse(data)?.success === false;
  } catch {
    return false;
  }
}

/**
 * @param {AnswerConnection & { answerEndpoint: string }} connection
 * @param {string} question
 * @param {AbortSignal} signal
 * @param {(answer: string) => void} onPartial
 */
async function requestAnswer(connection, question, signal, onPartial) {
  const url = new URL(connection.answerEndpoint);
  url.search = new URLSearchParams({ q: question, model: connection.profile }).toString();
  if (connection.language) url.searchParams.set('language', connection.language);
  const response = await fetch(url, {
    headers: { Authorization: 'Token ' + connection.token, Accept: 'text/event-stream' },
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    redirect: 'error',
    cache: 'no-store',
    signal,
  });
  if (response.status === 401 || response.status === 403) {
    throw new AnswerError('Smart Answers couldn’t access this profile. Check the read-only token and confirm Smart Answers is enabled and published.');
  }
  if (!response.ok || !response.headers.get('content-type')?.startsWith('text/event-stream') || !response.body) {
    throw new AnswerError('Smart Answers is unavailable. Check the Answer endpoint or try another search.');
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let answer = '';
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) throw new AnswerError('The Smart Answer was interrupted. Try your search again.');
      buffer += value;
      let receivedText = false;
      let boundary;
      while ((boundary = frameBoundary.exec(buffer))) {
        const frame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        const data = frame.split(/\\r\\n|\\r|\\n/)
          .filter(line => line === 'data' || line.startsWith('data:'))
          .map(line => line.slice(5).replace(/^ /, ''))
          .join('\\n');
        if (!data || data === 'I_AM_A_QUESTION') continue;
        if (data === 'I_AM_NOT_A_QUESTION') return null;
        if (data === 'CLOSE') return cleanAnswer(answer);
        if (isAnswerFailure(data) || answer.length + data.length > answerLimit) {
          throw new AnswerError('Smart Answers couldn’t generate an answer. Try another search.');
        }
        answer += data;
        receivedText = true;
      }
      if (buffer.length > answerLimit) throw new AnswerError('Smart Answers returned an unreadable response.');
      if (receivedText) onPartial(cleanAnswer(answer));
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

/**
 * @param {string} answer
 * @param {boolean} linkSources
 * @returns {(Node | string)[]}
 */
function answerNodes(answer, linkSources) {
  /** @param {string} text */
  const plain = (text) => text
    .replace(/^#{1,6}[ \\t]+/gm, '')
    .replace(/\\*\\*([^*\\n]+)\\*\\*|__([^_\\n]+)__/g, (_, bold, underline) => bold ?? underline);
  /** @type {(Node | string)[]} */
  const nodes = [];
  /** @type {Map<string, string>} */
  const references = new Map();
  const body = answer.replace(referenceDefinition, (_, name, url) => {
    references.set(name.trim().toLowerCase(), url);
    return '';
  }).trim();
  let consumed = 0;
  for (const match of body.matchAll(answerLink)) {
    const [markup, image, label, inlineURL, reference] = match;
    const address = inlineURL ?? references.get((reference || label).trim().toLowerCase());
    if (!address) continue;
    const index = match.index ?? 0;
    nodes.push(plain(body.slice(consumed, index)));
    consumed = index + markup.length;
    const href = !image && linkSources ? webURL(address.replace(/^<|>$/g, '')) : null;
    if (!href) {
      nodes.push(plain(label));
      continue;
    }
    const link = document.createElement('a');
    link.href = href;
    link.referrerPolicy = 'no-referrer';
    link.textContent = plain(label);
    nodes.push(link);
  }
  nodes.push(plain(body.slice(consumed)));
  return nodes;
}

/** @param {HTMLElement} preview */
export function setupCustomerAnswers(preview) {
  const panel = /** @type {HTMLElement} */ (preview.querySelector('[data-customer-answer]'));
  const status = /** @type {HTMLElement} */ (panel.querySelector('[data-customer-answer-status]'));
  const content = /** @type {HTMLElement} */ (panel.querySelector('[data-customer-answer-content]'));
  const announcement = preview.querySelector('[data-customer-answer-announcement]');
  /** @type {AbortController | null} */
  let current = null;

  /** @param {string} message */
  function setStatus(message) {
    status.textContent = message;
    if (announcement) announcement.textContent = message;
  }

  function clear() {
    current?.abort();
    current = null;
    panel.hidden = true;
    setStatus('');
    content.replaceChildren();
    content.removeAttribute('lang');
    content.hidden = true;
  }

  /**
   * @param {AnswerConnection} connection
   * @param {string} question
   */
  async function start(connection, question) {
    clear();
    if (!connection.answerEndpoint) return;
    const language = contentLanguageTag(connection.language);
    if (language) content.lang = language;
    const controller = new AbortController();
    current = controller;
    panel.hidden = false;
    setStatus('Generating a Smart Answer…');
    const timer = window.setTimeout(() => controller.abort(), 45000);
    try {
      const answer = await requestAnswer({ ...connection, answerEndpoint: connection.answerEndpoint }, question,
        controller.signal, text => {
          if (current !== controller || !text) return;
          content.replaceChildren(...answerNodes(text, false));
          content.hidden = false;
        });
      if (current !== controller) return;
      if (answer === null) {
        clear();
      } else if (answer) {
        content.replaceChildren(...answerNodes(answer, true));
        content.hidden = false;
        setStatus('Smart Answer ready.');
      } else {
        setStatus('No Smart Answer was returned for this search.');
      }
    } catch (error) {
      if (current !== controller) return;
      content.replaceChildren();
      content.hidden = true;
      setStatus(error instanceof AnswerError ? error.message
        : 'Smart Answers is unavailable. Check the Answer endpoint or try another search.');
    } finally {
      window.clearTimeout(timer);
      if (current === controller) current = null;
    }
  }

  return { clear, start };
}
`,Y=`import { endpointFingerprint, featureStatus } from './app-configuration.js';
import { relatedSource, setupRelatedSearches } from './related-searches.js';
import { setupStarterAnswers } from './starter-answers.js';
import { featureSettings } from './feature-settings.js';

async function matchesApp(endpoint) {
  if (!endpoint) return false;
  const normalized = endpoint.trim().replace(/\\/$/, '');
  if (featureSettings.endpoint) return normalized === featureSettings.endpoint.replace(/\\/$/, '');
  return !!featureSettings.endpointHash && await endpointFingerprint(normalized) === featureSettings.endpointHash;
}

// Ordinary starters have one connection. Each submitted search supersedes pending work.
export function setupStarterServices(form, answerHost, connection, design) {
  const language = connection.language.trim().replaceAll('-', '_').toLowerCase();
  const profile = featureSettings.profiles?.find(item => item.language === language && item.profile === connection.model);
  const entitled = featureSettings.entitlements;
  const relatedOn = featureStatus(entitled?.relatedSearches, featureSettings.relatedSearchesByLanguage?.[language]) === 'On';
  const answersOn = featureStatus(entitled?.smartAnswers, profile?.smartAnswers) === 'On';
  const source = relatedOn ? relatedSource(connection.relatedURL, connection.discoveryKey, connection.language) : null;
  const answerReady = answersOn && connection.searchAuth.trim() && connection.questionURL.trim();
  const appMatches = (source || answerReady) && matchesApp(connection.searchURL).catch(() => false);
  const anchor = form.closest('.search-starter').querySelector('.search-starter__body');
  const related = setupRelatedSearches(form, term => {
    form.querySelector('input[type="search"]').value = term;
    form.requestSubmit();
  });
  let answers;
  let revision = 0;
  return {
    async search(query) {
      const current = ++revision;
      if (!appMatches || !await appMatches || current !== revision) return;
      void related.show(anchor, design.relatedPlacement === 'above' ? 'above' : 'below', query, source);
      if (answerReady) {
        answers ??= setupStarterAnswers(answerHost, connection);
        answers?.start(query);
      }
    },
    clear() {
      revision++;
      related.clear();
      answers?.clear();
    },
  };
}
`,Ue=`import { readAnswerEndpoint, setupCustomerAnswers } from './customer-answers.js';

/** @param {string} value */
function starterAnswerEndpoint(value) {
  const searchstaxURL = readAnswerEndpoint(value);
  if (searchstaxURL) return searchstaxURL;
  try {
    const url = new URL(value, window.location.href);
    if (url.origin === window.location.origin && !url.username && !url.password && !url.search && !url.hash) {
      return url.href;
    }
  } catch { /* An invalid endpoint leaves the feature inactive. */ }
  return null;
}

/**
 * @param {HTMLElement} host
 * @param {{ questionURL: string, searchAuth: string, model: string, language: string }} connection
 */
export function setupStarterAnswers(host, connection) {
  const answerEndpoint = starterAnswerEndpoint(connection.questionURL.trim());
  const profile = connection.model.trim();
  if (!answerEndpoint || !profile) return;

  host.innerHTML = \`
    <p class="search-starter__sr-only" role="status" data-customer-answer-announcement></p>
    <section class="smart-answers-sample__card search-starter__answer" aria-label="Smart Answer" data-customer-answer hidden>
      <h2>Smart Answer</h2>
      <p data-customer-answer-status></p>
      <div class="search-starter__answer-content" data-customer-answer-content hidden></div>
    </section>\`;

  const answers = setupCustomerAnswers(host);
  const answerConnection = { answerEndpoint, profile, language: connection.language, token: connection.searchAuth };
  return {
    clear: answers.clear,
    /** @param {string} query */
    start(query) {
      if (query === '*') {
        answers.clear();
        return;
      }
      void answers.start(answerConnection, query);
    },
  };
}
`,We=`/**
 * @param {{ key: string, value: unknown }[]} fields
 * @param {string} fieldName
 * @param {boolean} decorative
 * @returns {string | null}
 */
export function thumbnailAlt(fields, fieldName, decorative) {
  const value = fieldName ? fields.find(field => field.key === fieldName)?.value : undefined;
  const values = Array.isArray(value) ? value : [value];
  const text = values.find(entry => typeof entry === 'string' && entry.trim().length > 0);
  return text?.trim() || (decorative ? '' : null);
}
`,X=`.search-promotion-banner {
  margin-block: 12px;
  padding: 12px 16px;
  border: 1px solid #d7e0da;
  border-inline-start: 3px solid var(--preview-accent, var(--search-accent, #263f58));
  border-radius: 5px;
  color: var(--promotion-banner-ink, #253a34);
  background: var(--promotion-banner-background, #f3f7f4);
  overflow-wrap: anywhere;
}

.search-promotion-banner[hidden] { display: none; }
.search-promotion-banner p { margin: 4px 0 0; }
.search-promotion-banner .sample-external-promotion__label { margin: 0 0 4px; }
.search-promotion-banner a { color: inherit; font-weight: 600; text-decoration: underline; }
.sample-external-promotion__label, .sample-indexed-promotion, .search-promotion-marker { font-size: .8125rem; font-weight: 600; }
.sample-indexed-promotion, .search-promotion-marker { display: block; margin-bottom: 4px; color: #364e40; }

.search-promotion-heading { display: block; margin: 0 0 4px; font-size: 1em; }
.search-promotion-marker, .sample-indexed-promotion {
  width: fit-content;
  padding: var(--promotion-badge-padding, 0);
  border: var(--promotion-badge-border, 0);
  border-radius: 1em;
}
`,Ge=`import { webURL } from "./web-url.js";
export function promotionEntries(items) {
	function text(value) {
		const first = Array.isArray(value) ? value.find((item) => typeof item === "string") : value;
		return typeof first === "string" ? first.trim() : "";
	}
	return (Array.isArray(items) ? items : []).flatMap((item) => {
		const url = webURL(text(item?.url));
		return url ? [{
			url,
			title: text(item.name) || url,
			description: text(item.description)
		}] : [];
	});
}
export function renderPromotionBanners(host, entries, heading, language, openInNewTab = false) {
	host.replaceChildren(...entries.map((entry) => {
		const banner = document.createElement("section");
		banner.className = "search-promotion-banner";
		banner.setAttribute("aria-label", heading);
		const label = document.createElement("strong");
		label.className = "search-promotion-heading";
		label.textContent = heading;
		const link = document.createElement("a");
		link.href = entry.url;
		link.referrerPolicy = "no-referrer";
		if (openInNewTab) {
			link.target = "_blank";
			link.rel = "noopener noreferrer";
		}
		link.textContent = entry.title;
		if (language) link.lang = language;
		banner.append(label, link);
		if (entry.description) {
			const description = document.createElement("p");
			description.textContent = entry.description;
			if (language) description.lang = language;
			banner.append(description);
		}
		return banner;
	}));
	host.hidden = !entries.length;
}
export function placePromotionBanners(host, results, placement) {
	if (placement === "below") {
		if (results.nextElementSibling !== host) results.after(host);
	} else if (results.previousElementSibling !== host) results.before(host);
}
export function updatePromotionLabels(root, design) {
	for (const badge of root.querySelectorAll(".search-promotion-marker, .sample-indexed-promotion")) {
		badge.textContent = design.promotionBadge === "Promoted" ? badge.dataset.defaultLabel || "Promoted" : design.promotionBadge;
	}
	for (const label of root.querySelectorAll(".search-promotion-heading, .sample-external-promotion__label")) {
		label.textContent = design.promotionHeading === "Featured link" ? label.dataset.defaultLabel || "Featured link" : design.promotionHeading;
		label.closest(".search-promotion-banner")?.setAttribute("aria-label", label.textContent);
	}
}
`,Ke=`const demoSite = 'https://mw-searchstax.github.io/university-health-search-demo/';
const indexedNotice = demoSite + 'news/flu-clinic-update-2026/';

export const samplePromotionQuery = 'campus flu clinic';
export const sampleExternalPromotion = {
  url: demoSite + 'care/resources/flu-shot-appointments/',
  title: 'Read the fictional flu shot appointment notice',
};

export function samplePromotionMode(query, setting) {
  const normalized = typeof query === 'string' ? query.trim().toLowerCase().replace(/\\s+/g, ' ') : '';
  return normalized === samplePromotionQuery ? setting : 'off';
}

export function applySampleIndexedPromotion(items, response, mode) {
  if (mode !== 'indexed' && mode !== 'both') return items;
  const sort = response.responseHeader?.params?.sort;
  if (response.response.start !== 0 || (sort && sort !== 'score desc')) return items;
  const index = items.findIndex(item => item.url === indexedNotice);
  if (index === -1) return items;
  return [{ ...items[index], sampleIndexedPromotion: true }, ...items.slice(0, index), ...items.slice(index + 1)];
}

export function createSampleExternalPromotion() {
  const banner = document.createElement('section');
  banner.className = 'sample-external-promotion search-promotion-banner';
  banner.setAttribute('aria-label', 'Sample external promotion');
  banner.hidden = true;
  const label = document.createElement('p');
  label.className = 'sample-external-promotion__label';
  label.textContent = 'Sample external promotion';
  const link = document.createElement('a');
  link.href = sampleExternalPromotion.url;
  link.textContent = sampleExternalPromotion.title;
  banner.append(label, link);
  return banner;
}

export function updateSampleExternalPromotion(banner, mode) {
  banner.hidden = mode !== 'external' && mode !== 'both';
}
`,qe=`<details class="smart-answers-sample">
  <summary>Smart Answers Sample</summary>
  <div class="smart-answers-sample__card">
    <p class="smart-answers-sample__note">A fixed example based on fictional content.</p>
    <p><strong>What’s in the Rehabilitation Center’s design display?</strong></p>
    <p>The display includes a mock apartment layout and adjustable classroom furniture. Drawings beside the display label doorways, furniture, and circulation paths.</p>
    <p><a href="https://mw-searchstax.github.io/university-health-search-demo/locations/rehabilitation-center/">Read the fictional Rehabilitation Center page</a></p>
  </div>
</details>
`,Je=`.smart-answers-sample {
  margin: 8px 0 13px;
  border-bottom: 1px solid var(--lab-border, #d7e0da);
}

.smart-answers-sample[hidden] { display: none; }
.smart-answers-sample[open] { padding-bottom: .75rem; }
.smart-answers-sample summary { min-height: 44px; padding: .6rem .25rem; font-weight: 600; cursor: pointer; }
.smart-answers-sample__card {
  padding: 12px 16px;
  border: 1px solid var(--lab-border, #d7e0da);
  border-inline-start: 3px solid var(--preview-accent, var(--search-accent, #263f58));
  border-radius: 5px;
  overflow-wrap: anywhere;
}
.smart-answers-sample__card p { margin: 0 0 8px; }
.smart-answers-sample__card p:last-child { margin-bottom: 0; }
.smart-answers-sample__note { color: var(--lab-muted, #526759); font-size: .875rem; }
.smart-answers-sample__card a { color: #244a39; text-decoration: underline; }
`,Ye=`import { contentLanguageTag } from './content-language.js';

/**
 * @typedef {Object} SuggestionPayload
 * @property {{ enabled?: boolean, minPrefixChars?: number }} [metadata]
 * @property {Record<string, Record<string, { suggestions?: { term?: unknown }[] }>>} [suggest]
 */

/**
 * @param {{ token: string, language: string }} connection
 * @param {string} endpoint
 */
export function createCustomerSuggestionSource(connection, endpoint) {
  let minimumChars = 2;
  return {
    label: 'Search suggestions',
    language: contentLanguageTag(connection.language),
    delay: 250,
    get minimumChars() { return minimumChars; },
    /** @param {string} prefix @param {AbortSignal} signal */
    async suggest(prefix, signal) {
      const url = new URL(endpoint);
      url.searchParams.set('q', prefix);
      if (connection.language) url.searchParams.set('language', connection.language);
      const response = await fetch(url, {
        headers: { Authorization: 'Token ' + connection.token },
        credentials: 'omit',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        cache: 'no-store',
        signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]),
      });
      if (!response.ok) throw new Error('Unable to fetch suggestions');
      /** @type {SuggestionPayload} */
      const payload = await response.json();
      if (payload?.metadata?.enabled === false) throw new Error('Auto-Suggest is disabled');
      const configuredMinimum = payload?.metadata?.minPrefixChars;
      if (typeof configuredMinimum === 'number' && Number.isSafeInteger(configuredMinimum) && configuredMinimum > 0) {
        minimumChars = configuredMinimum;
      }

      const seen = new Set([prefix.toLowerCase()]);
      /** @type {string[]} */
      const suggestions = [];
      for (const dictionary of Object.values(payload?.suggest ?? {})) {
        for (const match of Object.values(dictionary ?? {})) {
          if (!Array.isArray(match?.suggestions)) continue;
          for (const suggestion of match.suggestions) {
            if (typeof suggestion?.term !== 'string') continue;
            const term = suggestion.term.trim();
            const key = term.toLowerCase();
            if (!term || seen.has(key)) continue;
            seen.add(key);
            suggestions.push(term);
            if (suggestions.length === 8) return suggestions;
          }
        }
      }
      return suggestions;
    },
  };
}
`,Xe=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SearchStax React Starter</title>
</head>
<body class="search-starter-page">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"><\/script>
</body>
</html>
`,Ze=`{
  "name": "searchstax-react-starter",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1"
  },
  "engines": { "node": "^20.19.0 || >=22.12.0" },
  "dependencies": {
    "@searchstax-inc/searchstudio-ux-react": "4.2.70",
    "react": "19.3.1",
    "react-dom": "19.3.1"
  },
  "devDependencies": {
    "vite": "8.3.8"
  }
}
`,Qe=`{
  "name": "searchstax-react-starter",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "searchstax-react-starter",
      "version": "1.0.0",
      "dependencies": {
        "@searchstax-inc/searchstudio-ux-react": "4.2.70",
        "react": "19.3.1",
        "react-dom": "19.3.1"
      },
      "devDependencies": {
        "vite": "8.3.8"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@emnapi/core": {
      "version": "2.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-2.0.0-beta.2.tgz",
      "integrity": "sha512-MzCVoWtcg4Pm2B3je5mMvYMvj3MmBKw+fU7vbsJc9/iT8ip6/eYIHo/Dsm/mr+wsHB6SEyJDuxB09Yy6r/8+4A==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/wasi-threads": "2.2.0",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "2.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-2.0.0-beta.2.tgz",
      "integrity": "sha512-JcrSPzPvZuNZvJqPTF9Fw25LbOJ8avzFVlaf2grmH4Cku0oGP47tRgqPZadcfj3YoZMHkFVnCYFbQM8I+i5QEw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/wasi-threads": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-2.2.0.tgz",
      "integrity": "sha512-JP7OYH38Q7+pyTAe14raZHLQIK7BDKbdwji+Xi3pcd/6QkJYQH3SX4wu6EplGrGJWRepoNzedfm0G3B9Z4e9Rw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.3.tgz",
      "integrity": "sha512-lhTtjtoEArWBjismtfS761S9Hlyn+nIZqOZVYoZ1Xn82PMNMVnk+jj/NhC4fAXGTs7ydONcJiR5vyQBTMDu27g==",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/source-map": {
      "version": "0.3.11",
      "resolved": "https://registry.npmjs.org/@jridgewell/source-map/-/source-map-0.3.11.tgz",
      "integrity": "sha512-ZMp1V8ZFcPG5dIWnQLr3NSI1MiCU7UETdS/A0G8V/XWHvJv3ZsFqutJn1Y5RPmAPX6F3BiE397OqveU/9NCuIA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.25"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.6.0.tgz",
      "integrity": "sha512-T7jf+5zgsZHwNJ4lvQ7/aezbyk0nNX+zJVWpmHA7VYsEx7a7qr5Rg5IbtJFqkgze5Y2sruq1RUY8Q837Od7iFw==",
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@napi-rs/wasm-runtime": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-1.2.6.tgz",
      "integrity": "sha512-mRyDmEw9/fCDXCGfL1sbgIw/GUK0PVxRW4YwgPN61F3LQ+fSyoBFarJVzgGyhF6kRzEQZ0FejDqm4WLXSeqQmw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@tybys/wasm-util": "^0.10.3"
      },
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=23.5.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "peerDependencies": {
        "@emnapi/core": "^1.7.1 || 2.0.0-beta.2",
        "@emnapi/runtime": "^1.7.1 || 2.0.0-beta.2"
      }
    },
    "node_modules/@oxc-project/types": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-project/types/-/types-0.156.0.tgz",
      "integrity": "sha512-1Duyg48TdJNdyhEB8Xn1L36bT9Pv6GUtlKjHxOys8xkaF/rQq3XJE+bAurSK/AgIz5mGFsb77cn9Pb20+WCScw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/oxc-project"
      }
    },
    "node_modules/@rolldown/binding-android-arm-eabi": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm-eabi/-/binding-android-arm-eabi-1.2.19.tgz",
      "integrity": "sha512-e+Ebe0WT+9tbXmNKPIiC8YrWAHYwug3m6i4p3rZGGulfZri1jtI4HslT+OZnFf/OIHowWF71DTlHwXBP2SiA7A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-android-arm64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm64/-/binding-android-arm64-1.2.19.tgz",
      "integrity": "sha512-hOombrTJ+szt2ciEzS7oCA78lMPBgF5UMQWCJIyNfnrI7GLl8HYoFqCnpL2gcPOaXMqryGCU5ExdQKyDDcC+yA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-arm64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-arm64/-/binding-darwin-arm64-1.2.19.tgz",
      "integrity": "sha512-XoMA2pwCKGTQzUjPgtRwkedH4WmXhdIPKT6l6oOxd1PUbNodGI6DcBekgN7EC//+x3pfBYX/qL1gNmZAqivw5g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-x64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-x64/-/binding-darwin-x64-1.2.19.tgz",
      "integrity": "sha512-zo8EsSSwMZCY/e+fRnGaX02YGgvJD0yvhNi/9hpGPA2MJ9ZF8dPCw75UGfpI6OpQ/myR/dIYmogRvqiZD0TrXg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-freebsd-x64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-freebsd-x64/-/binding-freebsd-x64-1.2.19.tgz",
      "integrity": "sha512-O8ISAOfI1nj7AuBPd30FSF47z7f7lzlk5poQVGgiikvQuGEBFYvW8ki+UEnT+YJPnNGjQzn304klt4O9FUE7mA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm-gnueabihf": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm-gnueabihf/-/binding-linux-arm-gnueabihf-1.2.19.tgz",
      "integrity": "sha512-/lYCba5NO0yq4S0jGMH8QTBtkvQxoXjoQWzF5BcWp9MjB9jxVRD1GQDNofkVjcOj30DWyhLIN/4Oe60JKzaONw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-gnu": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-gnu/-/binding-linux-arm64-gnu-1.2.19.tgz",
      "integrity": "sha512-pm/apFMBnSbFb3O6nG5pHO1iqHhZrjGDFEjSm+ot9J17XXPvH9L90y5h+jgfHCE+Qdlsvy8qKEcU4VKxgjD+vA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-musl": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-musl/-/binding-linux-arm64-musl-1.2.19.tgz",
      "integrity": "sha512-K1SmQp3FFichn8oqrNIwvFoZ5wcvjC7goBzpaMNvLf9FZc+QB/QvLmnpJZgAAGHiD980tP8FZZnXk2K94rvlxg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-ppc64-gnu": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-ppc64-gnu/-/binding-linux-ppc64-gnu-1.2.19.tgz",
      "integrity": "sha512-I0xwD57jP/3A7+5UPZin2w8Y7XHEmEM5zqpYZOcQ45MlNW6tUJUziymV3yRr7rL4vwyfEcRsRksC4a7Kc08p5Q==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-s390x-gnu": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-s390x-gnu/-/binding-linux-s390x-gnu-1.2.19.tgz",
      "integrity": "sha512-BrtEHT24SNXj9HiXqy+s/kXiSiQGt6EKCPUlRirAoIioVxKGnbXBUEkbZASAei7iZJB0/Ynm+0JP00Ipx7AnSw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-gnu": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-gnu/-/binding-linux-x64-gnu-1.2.19.tgz",
      "integrity": "sha512-rm75/9DkHKeU2WnA8w4X94WGYgLlDCFCfkQC+4bguVJmC/jvDRv2B+2wLOYhyE0fVuv7//Ckk39OoOufyCu76Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-musl": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.2.19.tgz",
      "integrity": "sha512-irh/4+iYFM4GAzpluDErgjz89bj6NDtqqMAG/6O1LG38Ed3NpyebzCpcVNkFW8uhy+/3/BocUvnXDR33CXWe9A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-openharmony-arm64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-openharmony-arm64/-/binding-openharmony-arm64-1.2.19.tgz",
      "integrity": "sha512-+KWTWNoPt+CfSq94CiceWu3yPE+QzkaG+phPyz9G60tmZLwfQkcA4AeksafzvJAw4pvg1mcd5a1TkUqVv0s4JA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-wasm32-wasi": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-wasm32-wasi/-/binding-wasm32-wasi-1.2.19.tgz",
      "integrity": "sha512-7EH+skOsl5qpWnK0vzamgJFhOv1cwxQpsxm8tI883K9fur5c27p8q87fzEO6BbBPabA2/+s/zR63/pLc137iOg==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "2.0.0-beta.2",
        "@emnapi/runtime": "2.0.0-beta.2",
        "@napi-rs/wasm-runtime": "1.2.6"
      },
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=23.5.0"
      }
    },
    "node_modules/@rolldown/binding-win32-arm64-msvc": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-arm64-msvc/-/binding-win32-arm64-msvc-1.2.19.tgz",
      "integrity": "sha512-3Q1Yg1Q7tEvBWoZf5rFvG/GKZQPgwfru+p4wBajDfJFBs0SHCpL++dfTjW9gyAKd1T7ZpIYvdaUax7Pa/IhFVQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-x64-msvc": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-x64-msvc/-/binding-win32-x64-msvc-1.2.19.tgz",
      "integrity": "sha512-y/sqRRc6d7hECzOFc5n3LSeqctmIp9mMjY1Kq4s14uLPd/LZ4z7i1zrW6fMtp2mPeuQIC4e6ULMcwQzMomqQag==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.1.1.tgz",
      "integrity": "sha512-glFIJDvLNDtJhT9qrMFWLPbvS+skxgt4L0K8Ei2YtnhPysAJnsI7nyxSJxKj4ADeKX0OLjC4ntRkwpLOoS3rwA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@searchstax-inc/searchstudio-ux-js": {
      "version": "4.2.70",
      "resolved": "https://registry.npmjs.org/@searchstax-inc/searchstudio-ux-js/-/searchstudio-ux-js-4.2.70.tgz",
      "integrity": "sha512-cpYSZmEuhNUgsDSKMx0dk4Gp1MbAImrEcSYbKzC50n97SNQLvrhCEqFlBPta2mz6ELzG9hqPQ0gGsyCcyvq7mQ==",
      "dependencies": {
        "dompurify": "^3.2.5",
        "eventsource": "^3.0.5",
        "marked": "^15.0.11",
        "mustache": "^4.2.0",
        "terser": "^5.44.0"
      },
      "engines": {
        "node": ">=20.19.0"
      }
    },
    "node_modules/@searchstax-inc/searchstudio-ux-react": {
      "version": "4.2.70",
      "resolved": "https://registry.npmjs.org/@searchstax-inc/searchstudio-ux-react/-/searchstudio-ux-react-4.2.70.tgz",
      "integrity": "sha512-FTur3x5di4h/fdc0/9hTvLBj0v/awOya+29DgntrsEWvltJFYFda/r9+8sUViDsoBz6eTOEdL3UM5tcvka7DPA==",
      "dependencies": {
        "@searchstax-inc/searchstudio-ux-js": "npm:@searchstax-inc/searchstudio-ux-js@^4.2.70"
      },
      "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/@tybys/wasm-util": {
      "version": "0.10.5",
      "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.5.tgz",
      "integrity": "sha512-dOGOPxlaNV+G046mZzN+9C0dAcQZeSKcXiVaM0TYy/LM4ttTmgSBDxYfovcYI8Em3+eAbiAYpvWLOv8+ZVRJKA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/trusted-types": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/@types/trusted-types/-/trusted-types-2.0.7.tgz",
      "integrity": "sha512-ScaPdn1dQczgbl0QFTeTOmVHFULt394XJgOQNoyVhZ6r2vLnMLJfBPd53SB52T/3G36VI1/g2MZaX0cwDuXsfw==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/acorn": {
      "version": "8.19.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.19.0.tgz",
      "integrity": "sha512-oJlA3XiRm7Cyk6qFD2Jn8ak9B7jSy0qy00ADO3+8dpT0LSjFihQYv4C02LFCSYJV3Q37xYwwRy5m+IpIiUzqWw==",
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/buffer-from": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",
      "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",
      "license": "MIT"
    },
    "node_modules/commander": {
      "version": "2.20.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz",
      "integrity": "sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==",
      "license": "MIT"
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/dompurify": {
      "version": "3.4.18",
      "resolved": "https://registry.npmjs.org/dompurify/-/dompurify-3.4.18.tgz",
      "integrity": "sha512-ofe3wI/uNm68HInABYFJYqQxRw1EaKAjNdrFVKqjUY+UZurvNd2L/HuQe097s/4RivWiZyP6tT7aoT8atjfhwg==",
      "license": "(MPL-2.0 OR Apache-2.0)",
      "optionalDependencies": {
        "@types/trusted-types": "^2.0.7"
      }
    },
    "node_modules/eventsource": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/eventsource/-/eventsource-3.0.7.tgz",
      "integrity": "sha512-CRT1WTyuQoD771GW56XEZFQ/ZoSfWid1alKGDYMmkt2yl8UXrVR4pspqWNEcqKvVIzg6PAltWjxcSSPrboA4iA==",
      "license": "MIT",
      "dependencies": {
        "eventsource-parser": "^3.0.1"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/eventsource-parser": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/eventsource-parser/-/eventsource-parser-3.1.1.tgz",
      "integrity": "sha512-EKN1vKAMcZ8MlYMpaNuxN6R9yakzH6uajHcHVTqWJzvu5pWw9DyhbP35HH8MVBQ+dZjAfDxk+A8NiR9KWaXiyQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/lightningcss": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.33.0.tgz",
      "integrity": "sha512-WkUDrojuJs0xkgGf2udWxa3yGBRxPtxUkB79i6aCZLRgc7PM8fZe9TosfPDcvEpQZbuFASnHYmRLBLUbmLOIIA==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.33.0",
        "lightningcss-darwin-arm64": "1.33.0",
        "lightningcss-darwin-x64": "1.33.0",
        "lightningcss-freebsd-x64": "1.33.0",
        "lightningcss-linux-arm-gnueabihf": "1.33.0",
        "lightningcss-linux-arm64-gnu": "1.33.0",
        "lightningcss-linux-arm64-musl": "1.33.0",
        "lightningcss-linux-x64-gnu": "1.33.0",
        "lightningcss-linux-x64-musl": "1.33.0",
        "lightningcss-win32-arm64-msvc": "1.33.0",
        "lightningcss-win32-x64-msvc": "1.33.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.33.0.tgz",
      "integrity": "sha512-gEpRTalKdosp4Bb8qWtc2iOgE5SeIHlpS1up9bFq2wAyYhl1UdTObYiHe98zEM9SQvSoqQZ1IQD0JNpg3Ml5pg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.33.0.tgz",
      "integrity": "sha512-Sciaz8eenNTKn9b3t7+xr0ipTp9YxKQY4npwQ3mrRuL0BAVHBLyZxofhaKBAVtzmtRZ/zTyo0/to4B1uWG/Djg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.33.0.tgz",
      "integrity": "sha512-Z5UPAxzrjlWNNyGy6i65cJzzvgJ5D3T6wMvs+gWpY9d7qRhANrxqAp6LhxIgZhWEw18RfJTGcRxjuLIBr+m8XQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.33.0.tgz",
      "integrity": "sha512-QQM/Ti/hQajJwCY+RiWuCZ9sdtI/XQk7nDK5vC8kkdwixezOlDgvDx7+RT+QjK6FcFT4MpsuoBnHIo/O3StRRg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.33.0.tgz",
      "integrity": "sha512-N7FVBe6iS24MlM6R/4RBTxGhQheZGs7tiQ9U32UtF75NzP5Q7xWPRqLBCKxlRQRk3rY1jCIPLzx7WzOhuUIRLQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.33.0.tgz",
      "integrity": "sha512-j2v/itmy4HlNxlc6voKXYgBqNi0Ng2LShg4z7GufpEgs05P+2suBVyi9I6YHq5uoVFx9ETin3eCEhLVyXGQnKg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.33.0.tgz",
      "integrity": "sha512-yiO5ROMuYQgXbC60yjZU5CYSFZGKXL0HFATXt9mHJn1+zW55oCtMI9NfcVhYLMFDL7gV7oBPon/EmMMGg2OvtQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.33.0.tgz",
      "integrity": "sha512-ar+Ju7LmcN0Jo4FpL4hpFybwNG9/3A/Br5KW2n2jyODg3MEZXaDYADdemoNS+BDNfMgKvylJLj4S5tyRActuAg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.33.0.tgz",
      "integrity": "sha512-RYiYbkokw0trfKqqzfF55lginwEPrD3OJDfTuJzFs1MK6iFnDenaz1fqLLtX4ITG3OktJQXOeTaw1awrBAlZPw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.33.0.tgz",
      "integrity": "sha512-1K+MPfLSFVpphzpdbfkhlWk6wBrTObBzS2T6db10PNOZgR9GoVsAWzwNyuhUYYbTp23j+4RrncfujZ4uAzXvwA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.33.0.tgz",
      "integrity": "sha512-OlEICDx/Xl0FqSp4bry8zFnCvGpig3Gl4gCquvYwHuqJKEC1+n9NgDniFvqHGmMv1ZkqDJrDqKKSykTDX+ehuA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/marked": {
      "version": "15.0.12",
      "resolved": "https://registry.npmjs.org/marked/-/marked-15.0.12.tgz",
      "integrity": "sha512-8dD6FusOQSrpv9Z1rdNMdlSgQOIP880DHqnohobOmYLElGEqAL/JvxvuxZO16r4HtjTlfPRDC1hbvxC9dPN2nA==",
      "license": "MIT",
      "bin": {
        "marked": "bin/marked.js"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/mustache": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/mustache/-/mustache-4.2.0.tgz",
      "integrity": "sha512-71ippSywq5Yb7/tVYyGbkBggbU8H3u5Rz56fH60jGFgr8uHwxs+aSKeqmluIVzM0m0kB7xQjKS6qPfd0b2ZoqQ==",
      "license": "MIT",
      "bin": {
        "mustache": "bin/mustache"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.20",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.20.tgz",
      "integrity": "sha512-uKdg2G3GNCKQn9byYOpxbGqrT2fGO5KRt5J/8b3pok8rT6qxGWF6hxMyJiEYtAf+FVyYuD9hRaDqX5uPFYJ4ZQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.33",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.33.tgz",
      "integrity": "sha512-RVHEU9/Pp1Fnjr/MpAJsZoADukCKhfIi15OunEYiGktIkYLkPVvC1sioWolGDS7XByMTx9m/IGbro0Js13zhnQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.20",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.2"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/react": {
      "version": "19.3.1",
      "resolved": "https://registry.npmjs.org/react/-/react-19.3.1.tgz",
      "integrity": "sha512-QNhWdt7nrgVWWQG58QuGsAR3jv3Hbe4mb4vz7w2csnHavciZJgda1CPNaldF6eVxv90ud3jUXpKlHL69gO38yw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.3.1",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.3.1.tgz",
      "integrity": "sha512-Y0bARz53lhEC1NMCASs0/j+faB/zqt3R8hpvg1e8+61ZVJ4UL0UdC4cBbXfZMcIuhrfgeILTLe+ZeBCavQPtKQ==",
      "license": "MIT",
      "dependencies": {
        "scheduler": "^0.28.0"
      },
      "peerDependencies": {
        "react": "^19.3.1"
      }
    },
    "node_modules/rolldown": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/rolldown/-/rolldown-1.2.19.tgz",
      "integrity": "sha512-QIiV1J9d0pzN4jeeTH4sjPy0AZ6cAy2cG0ExeoE1+U8Rvj+hR3gYkokx0YbeUNGlZqiQJJ2utcETe0oKXwzsuA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@oxc-project/types": "=0.156.0",
        "@rolldown/pluginutils": "^1.0.0"
      },
      "bin": {
        "rolldown": "bin/cli.mjs"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "optionalDependencies": {
        "@rolldown/binding-android-arm-eabi": "1.2.19",
        "@rolldown/binding-android-arm64": "1.2.19",
        "@rolldown/binding-darwin-arm64": "1.2.19",
        "@rolldown/binding-darwin-x64": "1.2.19",
        "@rolldown/binding-freebsd-x64": "1.2.19",
        "@rolldown/binding-linux-arm-gnueabihf": "1.2.19",
        "@rolldown/binding-linux-arm64-gnu": "1.2.19",
        "@rolldown/binding-linux-arm64-musl": "1.2.19",
        "@rolldown/binding-linux-ppc64-gnu": "1.2.19",
        "@rolldown/binding-linux-s390x-gnu": "1.2.19",
        "@rolldown/binding-linux-x64-gnu": "1.2.19",
        "@rolldown/binding-linux-x64-musl": "1.2.19",
        "@rolldown/binding-openharmony-arm64": "1.2.19",
        "@rolldown/binding-wasm32-wasi": "1.2.19",
        "@rolldown/binding-win32-arm64-msvc": "1.2.19",
        "@rolldown/binding-win32-x64-msvc": "1.2.19"
      }
    },
    "node_modules/scheduler": {
      "version": "0.28.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.28.0.tgz",
      "integrity": "sha512-juorfCmIkIw8tT+p5BXSm6PJjQF/ycEYmKyzURCIt/RaZIhL+PulbQ9Yu2z1HdOJDdqDTlxA1+xKBmHXJsczAw==",
      "license": "MIT"
    },
    "node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz",
      "integrity": "sha512-KGj/8Y43x35aZVDtt+J4mK1hoLGHULMYfSkODJNQjNDC3oW1PqPoxMwo0pLUsWM/UEGzON/NxeHywEfNXNP3Vw==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-support": {
      "version": "0.5.21",
      "resolved": "https://registry.npmjs.org/source-map-support/-/source-map-support-0.5.21.tgz",
      "integrity": "sha512-uBHU3L3czsIyYXKX88fdrGovxdSCoTGDRZ6SYXtSRxLZUzHg5P/66Ht6uoUlHu9EZod+inXhKo3qQgwXUT/y1w==",
      "license": "MIT",
      "dependencies": {
        "buffer-from": "^1.0.0",
        "source-map": "^0.6.0"
      }
    },
    "node_modules/terser": {
      "version": "5.51.2",
      "resolved": "https://registry.npmjs.org/terser/-/terser-5.51.2.tgz",
      "integrity": "sha512-bWnjSNscmuI+GJze6ZupnHP8G/cTcsJF+bXCeQknk2SHQsgbNJnLrqiH9jZ2W4STPVXH2mDKKRX3iwPhc9Cn/Q==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "@jridgewell/source-map": "^0.3.3",
        "acorn": "^8.15.0",
        "commander": "^2.20.0",
        "source-map-support": "~0.5.20"
      },
      "bin": {
        "terser": "bin/terser"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tslib": {
      "version": "2.9.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.9.1.tgz",
      "integrity": "sha512-a4Ux9VKuIMHsOS7ENbEq6hK2ZGYIT27Rtl0E4eD9KqwxhKiQeMZE/9xb3IdYwWaSOyIBQLExhQgXDTYoiCxnWA==",
      "dev": true,
      "license": "0BSD",
      "optional": true
    },
    "node_modules/vite": {
      "version": "8.3.8",
      "resolved": "https://registry.npmjs.org/vite/-/vite-8.3.8.tgz",
      "integrity": "sha512-LzOn3h9rG/0vhLdXrV4yJ4QFA9eEoqCl+Yx+kGJd7aB9w6nfNgVHKSYwLPZUHrz4ZGa+t+kXjV9itvcHDLQouA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "lightningcss": "^1.33.0",
        "picomatch": "^4.0.7",
        "postcss": "^8.5.32",
        "rolldown": "~1.2.18",
        "tinyglobby": "^0.2.17"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "@vitejs/devtools": "^0.7.1 || ^0.8.0",
        "esbuild": "^0.27.0 || ^0.28.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "@vitejs/devtools": {
          "optional": true
        },
        "esbuild": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    }
  }
}
`,$e=`import React from 'react';
import { createRoot } from 'react-dom/client';
import SearchApp from './SearchApp.jsx';
import '../search.css';

createRoot(document.getElementById('root')).render(<SearchApp />);
`,et=`import React, { useEffect, useRef, useState } from 'react';
import {
  SearchstaxExternalPromotionsWidget,
  SearchstaxFacetsWidget,
  SearchstaxResultWidget,
  SearchstaxSortingWidget,
  SearchstaxWrapper,
} from '@searchstax-inc/searchstudio-ux-react';
import { connection, demo, design } from './config.js';
import { contentLanguageTag } from './content-language.js';
import { starterPassages } from './starter-passages.js';
import { setupStarterServices } from './starter-services.js';
import { thumbnailAlt } from './thumbnail-alt.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { sampleSuggestionSource, setupSearchSuggestions } from './suggestions.js';
import { getAnalyticsSettings, setupResultTracking } from './result-tracking.js';
import { setupPaginationFocus } from './pagination-focus.js';

const analytics = getAnalyticsSettings(connection);
const resultLanguage = contentLanguageTag(connection.language);
const isDemo = connection.searchURL === demo.searchURL && connection.model === demo.model && resultLanguage === demo.language;
const initialQuery = connection.initialQuery || (isDemo ? 'rehabilitation' : '');

function publicLink(value) {
  try {
    const url = new URL(value);
    if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { /* An unmapped URL produces no link. */ }
  return '';
}

function renderParts(parts) {
  return parts.map((part, index) => part.matched
    ? <mark className="search-result-hit" key={index}>{part.text}</mark> : part.text);
}

function resultCards(results) {
  return (
    <div className="searchstax-search-results">
      {results.map((item) => (
        <article className="searchstax-search-result" key={item.uniqueId || item.url}>
          {item.promoted && <span className="search-promotion-marker">{design.promotionBadge}</span>}
          {item.previewThumbnail && item.previewThumbnailAlt !== null && (
            <img className="search-starter__result-thumbnail" src={item.previewThumbnail} alt={item.previewThumbnailAlt} lang={resultLanguage} loading="lazy" referrerPolicy="no-referrer" />
          )}
          {item.ribbonParts.length > 0 && <span className="searchstax-search-result-ribbon">{renderParts(item.ribbonParts)}</span>}
          <h2 lang={resultLanguage}><a href={item.url} data-result-id={item.uniqueId} referrerPolicy="no-referrer">{renderParts(item.titleParts)}</a></h2>
          {item.descriptionParts.length > 0 && <p className="search-starter__result-description" lang={resultLanguage}>{renderParts(item.descriptionParts)}</p>}
          {item.otherFields.map((field, index) => <p key={index}>{field.label && field.label + ': '}{renderParts(field.parts)}</p>)}
        </article>
      ))}
    </div>
  );
}

function facetControls(data, containers, isExpanded, toggle, selectFacet, isChecked) {
  if (!data?.facets?.length) return null;
  return data.facets.map((facet) => (
    <fieldset key={facet.name}>
      <legend>{facet.label || facet.name}</legend>
      <div className="search-facet-choices">
        {facet.values.map((value, index) => {
          const key = index + facet.name;
          containers[key] ??= React.createRef();
          const label = isDemo && Object.hasOwn(demo.facetLabels, value.value) ? demo.facetLabels[value.value] : value.value;
          return (
            <div key={value.value} ref={containers[key]}>
              <label className={'desktop-' + key}>
                <input type="checkbox" checked={Boolean(isChecked(value))} readOnly disabled={value.disabled}
                  onClick={(event) => selectFacet(key, event, value, true)} />
                <span>{label}</span><small>{value.count}</small>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  ));
}

function sortControls(data, selected, api) {
  const choices = isDemo ? demo.sortOptions : data?.sortOptions?.map(item => ({ label: item.value, order: item.key }));
  if (!data?.searchExecuted || !choices?.length) return null;
  return (
    <label className="search-starter__sort">
      Sort by
      <select value={selected} onChange={(event) => {
        const current = api.dataLayer.searchObject;
        api.dataLayer.setSearchObject({ ...current, order: encodeURIComponent(event.target.value), page: 1 });
      }}>
        {choices.map(option => <option key={option.order} value={option.order}>{option.label}</option>)}
      </select>
    </label>
  );
}

function pageControls({ start, end, total }) {
  if (!total) return null;
  return (
    <nav className="search-starter__pagination" aria-label="Search result pages">
      <span tabIndex={-1} data-page-range="" data-page-start={start + 1}>{start + 1}–{end} of {total} results</span>
      {start > 0 && <button type="button" data-page-step="previous">Previous</button>}
      {end < total && <button type="button" data-page-step="next">Next</button>}
    </nav>
  );
}

function livePromotions(data) {
  const links = data?.externalPromotions?.flatMap(item => {
    const url = publicLink(item.url);
    return url ? [{ ...item, url }] : [];
  });
  if (!links?.length) return null;
  return (
    <section aria-label="External promotions">
      {links.map(item => (
        <div key={item.id ?? item.url} className="search-promotion-banner">
          <strong className="search-promotion-heading">{design.promotionHeading}</strong>
          <a href={item.url} lang={resultLanguage} referrerPolicy="no-referrer">{item.name || item.url}</a>
          {item.description && <p lang={resultLanguage}>{item.description}</p>}
        </div>
      ))}
    </section>
  );
}

function SearchExperience({ api, summary, status, setStatus, timer }) {
  const form = useRef(null);
  const input = useRef(null);
  const pagination = useRef(null);
  const resultHost = useRef(null);
  const answerHost = useRef(null);
  const services = useRef(null);
  const setSuggestionSource = useRef(null);

  function runSearch(query) {
    const term = query.trim();
    if (!term) {
      setStatus('Enter a search term.');
      return;
    }
    const current = api.dataLayer.searchObject;
    const next = { ...current, query: term, page: 1, facets: [] };
    void services.current?.search(term);
    if (current.query === term && current.page === 1 && !current.facets.length) api.search(next);
    else api.dataLayer.setSearchObject(next);
  }

  useEffect(() => {
    const loading = api.dataLayer.$loadingChange;
    const subscription = loading.subscribe((value) => {
      if (!value) return;
      setStatus('Searching…');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus('Search is unavailable. Try again in a moment.'), 15000);
    });
    api.dataLayer.setItemsPerPage(design.resultsPerPage);
    services.current = setupStarterServices(form.current, answerHost.current, connection, design);
    if (initialQuery) runSearch(initialQuery);
    else setStatus('Enter a search term.');
    return () => {
      services.current?.clear();
      loading.unsubscribe(subscription);
      window.clearTimeout(timer.current);
    };
  }, [api]);

  useEffect(() => {
    if (!design.showSuggestions) return;
    const source = isDemo ? sampleSuggestionSource : connection.suggesterURL
      ? createCustomerSuggestionSource({ token: connection.searchAuth, language: connection.language }, connection.suggesterURL)
      : null;
    if (!source) return;
    setSuggestionSource.current ??= setupSearchSuggestions(form.current, 'react-search-suggestions');
    setSuggestionSource.current(source);
    return () => setSuggestionSource.current(null);
  }, []);

  useEffect(() => setupResultTracking(resultHost.current, api), [api]);
  useEffect(() => setupPaginationFocus(pagination.current, () => api), [api]);

  return <>
    <form className="search-starter__form" role="search" ref={form}
      onSubmit={(event) => { event.preventDefault(); runSearch(input.current.value); }}>
      <label className="search-starter__sr-only" htmlFor="starter-query">{design.searchFieldText}</label>
      <input id="starter-query" type="search" defaultValue={initialQuery} placeholder={design.searchFieldText} ref={input} autoComplete="off" required />
      <button type="submit" className="search-starter__submit">{design.searchButtonText}</button>
    </form>
    <div ref={answerHost} />
    <p role="status">{status}</p>
    {design.showSorting && <SearchstaxSortingWidget searchSortingTemplate={(data, _, selected) => sortControls(data, selected, api)} />}
    {design.bannerPlacement === 'above' && <SearchstaxExternalPromotionsWidget searchExternalPromotionsTemplate={livePromotions} />}
    <div className="search-starter__body">
      {design.showFilters &&
        <aside className="search-starter__filters" aria-label="Filter search results">
          <SearchstaxFacetsWidget facetingType="or" itemsPerPageDesktop={20} itemsPerPageMobile={20}
            facetsTemplateDesktop={facetControls} facetsTemplateMobile={() => null} />
        </aside>}
      <div ref={resultHost}>
        <SearchstaxResultWidget renderMethod="pagination" resultsPerPage={design.resultsPerPage}
          resultsTemplate={resultCards}
          noResultTemplate={() => <p className="search-starter__no-results">{design.noResultsText}</p>} />
        <div ref={pagination} tabIndex={-1} role="group" aria-label="Search result pagination">
          {pageControls(summary)}
          <span className="search-starter__sr-only" role="status" data-page-announcement="" />
        </div>
      </div>
    </div>
    {design.bannerPlacement === 'below' && <SearchstaxExternalPromotionsWidget searchExternalPromotionsTemplate={livePromotions} />}
  </>;
}

export default function SearchApp() {
  const [api, setApi] = useState(null);
  const [summary, setSummary] = useState({ start: 0, end: 0, total: 0 });
  const [status, setStatus] = useState('Connecting to search…');
  const timer = useRef();

  function afterSearch(items, response) {
    const total = response?.response?.numFound;
    if (typeof total !== 'number') return [];
    window.clearTimeout(timer.current);
    // The requested page can change while the previous response is still on screen.
    const start = response.response.start ?? 0;
    const end = Math.min(total, start + (response.response.docs?.length ?? design.resultsPerPage));
    setSummary({ start, end, total });
    setStatus(total + (total === 1 ? ' result' : ' results'));
    const passages = starterPassages(response, isDemo);
    const results = items.flatMap((item) => {
      const url = publicLink(item.url);
      return url ? [{
        ...item,
        url,
        ...passages(item),
        previewThumbnail: design.showThumbnails ? (isDemo ? demo.thumbnailPaths[url] : publicLink(item.thumbnail)) : '',
        previewThumbnailAlt: isDemo ? '' : thumbnailAlt(
          item.allFields,
          connection.thumbnailAltField,
          connection.thumbnailsWithoutAltAreDecorative,
        ),
      }] : [];
    });
    return results;
  }

  if (!connection.searchURL || !connection.searchAuth) {
    return <main className="search-starter"><p>Set the Select endpoint and read-only token in src/config.js to start searching.</p></main>;
  }

  return (
    <main className="search-starter">
      {design.logoURL && <img className="search-starter__logo" src={design.logoURL} alt="Company logo"
        referrerPolicy="no-referrer" onError={event => { event.currentTarget.hidden = true; }} />}
      <h1>{isDemo ? 'Search Central County' : 'Search'}</h1>
      {isDemo && <p>Search fictional university health content with the SearchStax React UI Kit.</p>}
      <SearchstaxWrapper searchURL={connection.searchURL} searchAuth={connection.searchAuth}
        authType="token" model={connection.model} language={connection.language}
        suggesterURL=""
        {...analytics} router={{ enabled: false }} afterSearch={afterSearch}
        initialized={(instance) => { instance.setCookiesDisabled(!analytics.trackApiKey); setApi(instance); }}>
        {api && <SearchExperience api={api} summary={summary} status={status} setStatus={setStatus} timer={timer} />}
      </SearchstaxWrapper>
    </main>
  );
}
`,tt="# SearchStax React Starter\n\nThis starter uses the SearchStax React UI Kit and your Search Lab design. A SearchLabDemo download is ready to search. For a connected-app download, add your endpoint and read-only token under **Connect Your Search App** before you run it.\n\n## Run the Demo\n\nUse Node.js 20.19+ on the 20.x line, or Node.js 22.12 or later.\n\n```sh\nnpm ci\nnpm run dev\n```\n\nOpen the localhost URL printed in the terminal. You’ll need an internet connection for the demo search. Run `npm run build` to create the deployable files in `dist/`.\n\n- Search for `rehabilitation` to try filters or view the optional sample thumbnails.\n- On SearchLabDemo, type `reh` to try suggestions if you enabled them in your design.\n\n## Connect Your Search App\n\nUse `src/config.js` to connect your app. Keep the `demo` object and set `connection.searchURL` to your Select endpoint, `connection.searchAuth` to an active **Read Only** token, `connection.model` to your Search Profile name, and `connection.language` to the language configured for your app. Set `connection.initialQuery` to a term that matches your content or leave it empty to start with a blank search box.\n\n1. In Site Search, go to **App Settings > All APIs > Search & Indexing** for your Select endpoint and token.\n2. Map Title, URL, and Description in your Search Profile’s **Results Fields**. Map Thumbnail if you’re displaying images. Configure and publish any facets, sort options, and Promotions you want to use. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields)\n3. For live suggestions, publish Auto-Suggest, set `suggesterURL` to its endpoint, and enable `showSuggestions` in `design`. [Auto-Suggest API](https://support.searchstax.com/hc/en-us/articles/40243330090893-Auto-Suggest-API)\n\n### Promotions\n\nSearch with a published trigger on the selected profile. An elevated result gets the indexed badge from your design. External items use the banner heading, style, and placement from your design. A normal query shows the profile’s ordinary results. To try the fixed samples, choose **Fictional demo** in local Search Lab. [Promotions setup](https://support.searchstax.com/hc/en-us/articles/40155433600397-Promotions)\n\n### Related Searches and Smart Answers\n\nThe download includes the selected app’s feature settings in `src/feature-settings.js`. Related Searches uses the app entitlement and the published setting for the search language. Smart Answers uses its entitlement and the published setting for the selected profile and language. An off or unknown setting leaves that feature out.\n\nIn `src/config.js`, enter `relatedURL` and the browser-safe `discoveryKey` from **App Settings → All APIs → Discovery** to receive related terms. For Smart Answers, enter the streaming `questionURL` or a same-origin streaming proxy. Answers use the search token, language, and profile. [Related Searches API](https://support.searchstax.com/hc/en-us/articles/40243333638541-Related-Searches-API) · [Smart Answers setup](https://support.searchstax.com/hc/en-us/articles/40075209934989-Smart-Answers)\n\nIf you switch apps or the published settings change, reconnect in Build with the updated app configuration and download a fresh starter. For fixed examples of both features, choose **Fictional demo** in local Search Lab before downloading.\n\nResult links open with tracking off by default. To enable search and result-click tracking on your own app, open **App Settings > All APIs > Analytics**. In `src/config.js`, set `connection.analyticsBaseUrl` to the origin of your Tracking URL (the `https://` address before `/api/v2/track/`) and `connection.trackApiKey` to the Tracking key. Leave both blank to keep tracking off. If your site requires consent, supply these settings only after the visitor opts in.\n\n### Thumbnail Descriptions\n\nTo show informative thumbnails, enable thumbnails in the design and map the image URL field to **Thumbnail**. Add the indexed description as a Return Field with **No mapping** in **Results Fields**. Then set `connection.thumbnailAltField` in `src/config.js` to that field’s name, such as `image_alt`. Use a description that conveys the information the image adds. The starter omits a connected thumbnail when its description is missing. Set `thumbnailsWithoutAltAreDecorative` to `true` only if every thumbnail without a description is decorative or repeats the nearby text. Those images use empty alt text. [Decorative images](https://www.w3.org/WAI/tutorials/images/decorative/)\n\nBrowser code is visible to visitors. Use a server-side proxy when a token must stay private. [Endpoint and token guidance](https://support.searchstax.com/hc/en-us/articles/39440547272077-Hide-Tokens-and-Endpoints-in-UI-Kits)\n\nEdit `search.css` for styling. Retain the `.search-starter` wrapper so the exported selectors still apply.\n\n## Use It in Next.js\n\nIn an existing Next.js App Router project, install the React UI Kit version pinned in this ZIP. Copy the files from `src/` except `main.jsx` into your search route. Copy `public/thumbnails/` if it’s present. Import `search.css` from your route or root layout, and add `search-starter-page` to the body if you use the standalone page styles.\n\nLoad `SearchApp.jsx` with server rendering disabled from a Client Component. The SearchStax kit mounts against the browser DOM.\n\n```jsx\n// app/search/SearchClient.jsx\n'use client';\n\nimport dynamic from 'next/dynamic';\n\nexport default dynamic(() => import('./SearchApp.jsx'), {\n  ssr: false,\n  loading: () => <p role=\"status\">Loading search…</p>,\n});\n```\n\nRender `<SearchClient />` from your route’s `page.jsx`. [Next.js client-only loading](https://nextjs.org/docs/app/guides/lazy-loading)\n",nt=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SearchStax Vue Starter</title>
</head>
<body class="search-starter-page">
  <div id="app"></div>
  <script type="module" src="/src/main.js"><\/script>
</body>
</html>
`,rt=`{
  "name": "searchstax-vue-starter",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1"
  },
  "engines": { "node": "^20.19.0 || >=22.12.0" },
  "dependencies": {
    "@searchstax-inc/searchstudio-ux-vue": "4.2.70",
    "vue": "3.5.45"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "6.0.11",
    "vite": "8.3.8"
  }
}
`,it=`{
  "name": "searchstax-vue-starter",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "searchstax-vue-starter",
      "version": "1.0.0",
      "dependencies": {
        "@searchstax-inc/searchstudio-ux-vue": "4.2.70",
        "vue": "3.5.45"
      },
      "devDependencies": {
        "@vitejs/plugin-vue": "6.0.11",
        "vite": "8.3.8"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.29.14",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.29.14.tgz",
      "integrity": "sha512-CXvKMFvM80ihI7Vox9jb+kQjnyjESQNPM+vB7U0Zz6TWuZA+Z/FL0QPMH300h33qJtIx+REeBhXqWOPW48TcAQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
      "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.14",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.14.tgz",
      "integrity": "sha512-VL220vXuyO2z3rNIQwY7ftj9UwpqOt+33sH+sBWkOekbsSR2g7EEMnOx24ZlCH0xOA3DM/33SifVFGbnJD8r/w==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.14"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.14",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.14.tgz",
      "integrity": "sha512-UjI/dKmwJwT9pOszJitq2G6EObZPnsZUfdCr92z2TlF3EZK9J3EdfOKUrCzHl6wFthbzwhzl1Soc/UIwxRiq6w==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.29.14",
        "@babel/helper-validator-identifier": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@emnapi/core": {
      "version": "2.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-2.0.0-beta.2.tgz",
      "integrity": "sha512-MzCVoWtcg4Pm2B3je5mMvYMvj3MmBKw+fU7vbsJc9/iT8ip6/eYIHo/Dsm/mr+wsHB6SEyJDuxB09Yy6r/8+4A==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/wasi-threads": "2.2.0",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "2.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-2.0.0-beta.2.tgz",
      "integrity": "sha512-JcrSPzPvZuNZvJqPTF9Fw25LbOJ8avzFVlaf2grmH4Cku0oGP47tRgqPZadcfj3YoZMHkFVnCYFbQM8I+i5QEw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/wasi-threads": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-2.2.0.tgz",
      "integrity": "sha512-JP7OYH38Q7+pyTAe14raZHLQIK7BDKbdwji+Xi3pcd/6QkJYQH3SX4wu6EplGrGJWRepoNzedfm0G3B9Z4e9Rw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.3.tgz",
      "integrity": "sha512-lhTtjtoEArWBjismtfS761S9Hlyn+nIZqOZVYoZ1Xn82PMNMVnk+jj/NhC4fAXGTs7ydONcJiR5vyQBTMDu27g==",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/source-map": {
      "version": "0.3.11",
      "resolved": "https://registry.npmjs.org/@jridgewell/source-map/-/source-map-0.3.11.tgz",
      "integrity": "sha512-ZMp1V8ZFcPG5dIWnQLr3NSI1MiCU7UETdS/A0G8V/XWHvJv3ZsFqutJn1Y5RPmAPX6F3BiE397OqveU/9NCuIA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.25"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.6.0.tgz",
      "integrity": "sha512-T7jf+5zgsZHwNJ4lvQ7/aezbyk0nNX+zJVWpmHA7VYsEx7a7qr5Rg5IbtJFqkgze5Y2sruq1RUY8Q837Od7iFw==",
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@napi-rs/wasm-runtime": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-1.2.6.tgz",
      "integrity": "sha512-mRyDmEw9/fCDXCGfL1sbgIw/GUK0PVxRW4YwgPN61F3LQ+fSyoBFarJVzgGyhF6kRzEQZ0FejDqm4WLXSeqQmw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@tybys/wasm-util": "^0.10.3"
      },
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=23.5.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "peerDependencies": {
        "@emnapi/core": "^1.7.1 || 2.0.0-beta.2",
        "@emnapi/runtime": "^1.7.1 || 2.0.0-beta.2"
      }
    },
    "node_modules/@oxc-project/types": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-project/types/-/types-0.156.0.tgz",
      "integrity": "sha512-1Duyg48TdJNdyhEB8Xn1L36bT9Pv6GUtlKjHxOys8xkaF/rQq3XJE+bAurSK/AgIz5mGFsb77cn9Pb20+WCScw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/oxc-project"
      }
    },
    "node_modules/@rolldown/binding-android-arm-eabi": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm-eabi/-/binding-android-arm-eabi-1.2.19.tgz",
      "integrity": "sha512-e+Ebe0WT+9tbXmNKPIiC8YrWAHYwug3m6i4p3rZGGulfZri1jtI4HslT+OZnFf/OIHowWF71DTlHwXBP2SiA7A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-android-arm64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm64/-/binding-android-arm64-1.2.19.tgz",
      "integrity": "sha512-hOombrTJ+szt2ciEzS7oCA78lMPBgF5UMQWCJIyNfnrI7GLl8HYoFqCnpL2gcPOaXMqryGCU5ExdQKyDDcC+yA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-arm64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-arm64/-/binding-darwin-arm64-1.2.19.tgz",
      "integrity": "sha512-XoMA2pwCKGTQzUjPgtRwkedH4WmXhdIPKT6l6oOxd1PUbNodGI6DcBekgN7EC//+x3pfBYX/qL1gNmZAqivw5g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-x64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-x64/-/binding-darwin-x64-1.2.19.tgz",
      "integrity": "sha512-zo8EsSSwMZCY/e+fRnGaX02YGgvJD0yvhNi/9hpGPA2MJ9ZF8dPCw75UGfpI6OpQ/myR/dIYmogRvqiZD0TrXg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-freebsd-x64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-freebsd-x64/-/binding-freebsd-x64-1.2.19.tgz",
      "integrity": "sha512-O8ISAOfI1nj7AuBPd30FSF47z7f7lzlk5poQVGgiikvQuGEBFYvW8ki+UEnT+YJPnNGjQzn304klt4O9FUE7mA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm-gnueabihf": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm-gnueabihf/-/binding-linux-arm-gnueabihf-1.2.19.tgz",
      "integrity": "sha512-/lYCba5NO0yq4S0jGMH8QTBtkvQxoXjoQWzF5BcWp9MjB9jxVRD1GQDNofkVjcOj30DWyhLIN/4Oe60JKzaONw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-gnu": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-gnu/-/binding-linux-arm64-gnu-1.2.19.tgz",
      "integrity": "sha512-pm/apFMBnSbFb3O6nG5pHO1iqHhZrjGDFEjSm+ot9J17XXPvH9L90y5h+jgfHCE+Qdlsvy8qKEcU4VKxgjD+vA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-musl": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-musl/-/binding-linux-arm64-musl-1.2.19.tgz",
      "integrity": "sha512-K1SmQp3FFichn8oqrNIwvFoZ5wcvjC7goBzpaMNvLf9FZc+QB/QvLmnpJZgAAGHiD980tP8FZZnXk2K94rvlxg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-ppc64-gnu": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-ppc64-gnu/-/binding-linux-ppc64-gnu-1.2.19.tgz",
      "integrity": "sha512-I0xwD57jP/3A7+5UPZin2w8Y7XHEmEM5zqpYZOcQ45MlNW6tUJUziymV3yRr7rL4vwyfEcRsRksC4a7Kc08p5Q==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-s390x-gnu": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-s390x-gnu/-/binding-linux-s390x-gnu-1.2.19.tgz",
      "integrity": "sha512-BrtEHT24SNXj9HiXqy+s/kXiSiQGt6EKCPUlRirAoIioVxKGnbXBUEkbZASAei7iZJB0/Ynm+0JP00Ipx7AnSw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-gnu": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-gnu/-/binding-linux-x64-gnu-1.2.19.tgz",
      "integrity": "sha512-rm75/9DkHKeU2WnA8w4X94WGYgLlDCFCfkQC+4bguVJmC/jvDRv2B+2wLOYhyE0fVuv7//Ckk39OoOufyCu76Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-musl": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.2.19.tgz",
      "integrity": "sha512-irh/4+iYFM4GAzpluDErgjz89bj6NDtqqMAG/6O1LG38Ed3NpyebzCpcVNkFW8uhy+/3/BocUvnXDR33CXWe9A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-openharmony-arm64": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-openharmony-arm64/-/binding-openharmony-arm64-1.2.19.tgz",
      "integrity": "sha512-+KWTWNoPt+CfSq94CiceWu3yPE+QzkaG+phPyz9G60tmZLwfQkcA4AeksafzvJAw4pvg1mcd5a1TkUqVv0s4JA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-wasm32-wasi": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-wasm32-wasi/-/binding-wasm32-wasi-1.2.19.tgz",
      "integrity": "sha512-7EH+skOsl5qpWnK0vzamgJFhOv1cwxQpsxm8tI883K9fur5c27p8q87fzEO6BbBPabA2/+s/zR63/pLc137iOg==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "2.0.0-beta.2",
        "@emnapi/runtime": "2.0.0-beta.2",
        "@napi-rs/wasm-runtime": "1.2.6"
      },
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=23.5.0"
      }
    },
    "node_modules/@rolldown/binding-win32-arm64-msvc": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-arm64-msvc/-/binding-win32-arm64-msvc-1.2.19.tgz",
      "integrity": "sha512-3Q1Yg1Q7tEvBWoZf5rFvG/GKZQPgwfru+p4wBajDfJFBs0SHCpL++dfTjW9gyAKd1T7ZpIYvdaUax7Pa/IhFVQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-x64-msvc": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-x64-msvc/-/binding-win32-x64-msvc-1.2.19.tgz",
      "integrity": "sha512-y/sqRRc6d7hECzOFc5n3LSeqctmIp9mMjY1Kq4s14uLPd/LZ4z7i1zrW6fMtp2mPeuQIC4e6ULMcwQzMomqQag==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.1.1.tgz",
      "integrity": "sha512-glFIJDvLNDtJhT9qrMFWLPbvS+skxgt4L0K8Ei2YtnhPysAJnsI7nyxSJxKj4ADeKX0OLjC4ntRkwpLOoS3rwA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@searchstax-inc/searchstudio-ux-js": {
      "version": "4.2.70",
      "resolved": "https://registry.npmjs.org/@searchstax-inc/searchstudio-ux-js/-/searchstudio-ux-js-4.2.70.tgz",
      "integrity": "sha512-cpYSZmEuhNUgsDSKMx0dk4Gp1MbAImrEcSYbKzC50n97SNQLvrhCEqFlBPta2mz6ELzG9hqPQ0gGsyCcyvq7mQ==",
      "dependencies": {
        "dompurify": "^3.2.5",
        "eventsource": "^3.0.5",
        "marked": "^15.0.11",
        "mustache": "^4.2.0",
        "terser": "^5.44.0"
      },
      "engines": {
        "node": ">=20.19.0"
      }
    },
    "node_modules/@searchstax-inc/searchstudio-ux-vue": {
      "version": "4.2.70",
      "resolved": "https://registry.npmjs.org/@searchstax-inc/searchstudio-ux-vue/-/searchstudio-ux-vue-4.2.70.tgz",
      "integrity": "sha512-ljJYx/LAoQqe1/Jht1S8T01CT6fC3HByDF7JJqcOfpdPzzvtT3SUSkSDaSku8p0vVqUBwxhDgVL1hzrezpZVGg==",
      "dependencies": {
        "@searchstax-inc/searchstudio-ux-js": "npm:@searchstax-inc/searchstudio-ux-js@^4.2.70"
      },
      "peerDependencies": {
        "vue": "^3.0.0"
      }
    },
    "node_modules/@tybys/wasm-util": {
      "version": "0.10.5",
      "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.5.tgz",
      "integrity": "sha512-dOGOPxlaNV+G046mZzN+9C0dAcQZeSKcXiVaM0TYy/LM4ttTmgSBDxYfovcYI8Em3+eAbiAYpvWLOv8+ZVRJKA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/trusted-types": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/@types/trusted-types/-/trusted-types-2.0.7.tgz",
      "integrity": "sha512-ScaPdn1dQczgbl0QFTeTOmVHFULt394XJgOQNoyVhZ6r2vLnMLJfBPd53SB52T/3G36VI1/g2MZaX0cwDuXsfw==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/@vitejs/plugin-vue": {
      "version": "6.0.11",
      "resolved": "https://registry.npmjs.org/@vitejs/plugin-vue/-/plugin-vue-6.0.11.tgz",
      "integrity": "sha512-m48lskIUJGlB6qUiYhDMI8nd2ngeidz2U4nKTjqI13cFMu5rH8JeEILPkDtK9Fk/TjBA2pkj8AlbenqDaKu+ww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@rolldown/pluginutils": "^1.0.1"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "peerDependencies": {
        "vite": "^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0",
        "vue": "^3.2.25 || ^3.6.0-rc.15"
      }
    },
    "node_modules/@vue/compiler-core": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/@vue/compiler-core/-/compiler-core-3.5.45.tgz",
      "integrity": "sha512-XGHJrM6ufZARAc/w+tyOswStw9tdKiqCKBScI4gGaNxD+aaGu/HQWgKJ+JItjRLPqenQ7iE7G8AJC7T5ew1p+g==",
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.12",
        "@vue/shared": "3.5.45",
        "entities": "^7.0.1",
        "estree-walker": "^2.0.2",
        "source-map-js": "^1.2.2"
      }
    },
    "node_modules/@vue/compiler-dom": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/@vue/compiler-dom/-/compiler-dom-3.5.45.tgz",
      "integrity": "sha512-LbP2d19GSOYGPmvMBBCVJVlv7TKtjM1Cfeyu3cYia720pknZP+1cLX7H5MVatvruT6MuJhiPuNbQBW/MDn/EwA==",
      "license": "MIT",
      "dependencies": {
        "@vue/compiler-core": "3.5.45",
        "@vue/shared": "3.5.45"
      }
    },
    "node_modules/@vue/compiler-sfc": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/@vue/compiler-sfc/-/compiler-sfc-3.5.45.tgz",
      "integrity": "sha512-MKFjb2UX0M/l/jhfzqMLrI8VM4pfvFKG3pqFZkSZFHRLtNld/O4RtUPZFWSwhro/14qP88UQEkWzHxAZAQ0tsw==",
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.12",
        "@vue/compiler-core": "3.5.45",
        "@vue/compiler-dom": "3.5.45",
        "@vue/compiler-ssr": "3.5.45",
        "@vue/shared": "3.5.45",
        "estree-walker": "^2.0.2",
        "magic-string": "^0.30.21",
        "postcss": "^8.5.32",
        "source-map-js": "^1.2.2"
      }
    },
    "node_modules/@vue/compiler-ssr": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/@vue/compiler-ssr/-/compiler-ssr-3.5.45.tgz",
      "integrity": "sha512-RF5sbZOfYz5AK00tOJUn2PwFXR2fS1u2HVzI8D9VF9rGAFxuGBqg2bB1kJ3ZHMprqSltXnT9MZE1IsqjSM8oew==",
      "license": "MIT",
      "dependencies": {
        "@vue/compiler-dom": "3.5.45",
        "@vue/shared": "3.5.45"
      }
    },
    "node_modules/@vue/reactivity": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/@vue/reactivity/-/reactivity-3.5.45.tgz",
      "integrity": "sha512-WqkyubNWpI4OYBOipSrjIssMdJO8K1i9Zts/Wm8Er10/0msOEwCyWWWvZnAI7WW3kQsTong6DJp8Cbb+vd4cPA==",
      "license": "MIT",
      "dependencies": {
        "@vue/shared": "3.5.45"
      }
    },
    "node_modules/@vue/runtime-core": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/@vue/runtime-core/-/runtime-core-3.5.45.tgz",
      "integrity": "sha512-bzIO3+FABjpj85uIKSc+Qnj36/sxDNI3tcH9i6w6xKA1k6e0ejv0G0jMCfeJBvK3yGL5XbJ3DMZj+ClqyCHFYw==",
      "license": "MIT",
      "dependencies": {
        "@vue/reactivity": "3.5.45",
        "@vue/shared": "3.5.45"
      }
    },
    "node_modules/@vue/runtime-dom": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/@vue/runtime-dom/-/runtime-dom-3.5.45.tgz",
      "integrity": "sha512-ZvRTFMDgfqTDYWvJfoVpQTJx1RN5M6l7Pyd6wfdY2NaXzbPQVh9ezeQYFbNPP6bIcRVn2SqSSR25N/jSW69BFw==",
      "license": "MIT",
      "dependencies": {
        "@vue/reactivity": "3.5.45",
        "@vue/runtime-core": "3.5.45",
        "@vue/shared": "3.5.45",
        "csstype": "^3.2.3"
      }
    },
    "node_modules/@vue/server-renderer": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/@vue/server-renderer/-/server-renderer-3.5.45.tgz",
      "integrity": "sha512-1fNXUHhhsWf4EVL4XixbGBU5mKdiIXJAB82feHRTyPPo6ZUEYWIJuEeUl3mVV6QDBp50HJOX4obLhxYXlrjrzA==",
      "license": "MIT",
      "dependencies": {
        "@vue/compiler-ssr": "3.5.45",
        "@vue/runtime-dom": "3.5.45",
        "@vue/shared": "3.5.45"
      }
    },
    "node_modules/@vue/shared": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/@vue/shared/-/shared-3.5.45.tgz",
      "integrity": "sha512-ue9fgHmVNPlP7iW3+cxoBX/Cnlw53dHlVSw0JKGY6z1lObg8pHoj928M2nzG4/yVsMZ3NaRZ2s2z61uC16NDwQ==",
      "license": "MIT"
    },
    "node_modules/acorn": {
      "version": "8.19.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.19.0.tgz",
      "integrity": "sha512-oJlA3XiRm7Cyk6qFD2Jn8ak9B7jSy0qy00ADO3+8dpT0LSjFihQYv4C02LFCSYJV3Q37xYwwRy5m+IpIiUzqWw==",
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/buffer-from": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",
      "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",
      "license": "MIT"
    },
    "node_modules/commander": {
      "version": "2.20.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz",
      "integrity": "sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==",
      "license": "MIT"
    },
    "node_modules/csstype": {
      "version": "3.2.4",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.4.tgz",
      "integrity": "sha512-PoKaoPzQapnEoqUSnHx1u6W6ku8CVEgKsnpmmzU3m1nwkidpPBQ8V/Zq2+bWNrsOKoKLwTGdbx6xF7BXP1zLVQ==",
      "license": "MIT"
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/dompurify": {
      "version": "3.4.18",
      "resolved": "https://registry.npmjs.org/dompurify/-/dompurify-3.4.18.tgz",
      "integrity": "sha512-ofe3wI/uNm68HInABYFJYqQxRw1EaKAjNdrFVKqjUY+UZurvNd2L/HuQe097s/4RivWiZyP6tT7aoT8atjfhwg==",
      "license": "(MPL-2.0 OR Apache-2.0)",
      "optionalDependencies": {
        "@types/trusted-types": "^2.0.7"
      }
    },
    "node_modules/entities": {
      "version": "7.0.1",
      "resolved": "https://registry.npmjs.org/entities/-/entities-7.0.1.tgz",
      "integrity": "sha512-TWrgLOFUQTH994YUyl1yT4uyavY5nNB5muff+RtWaqNVCAK408b5ZnnbNAUEWLTCpum9w6arT70i1XdQ4UeOPA==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.12"
      },
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/estree-walker": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/estree-walker/-/estree-walker-2.0.2.tgz",
      "integrity": "sha512-Rfkk/Mp/DL7JVje3u18FxFujQlTNR2q6QfMSMB7AvCBx91NGj/ba3kCfza0f6dVDbw7YlRf/nDrn7pQrCCyQ/w==",
      "license": "MIT"
    },
    "node_modules/eventsource": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/eventsource/-/eventsource-3.0.7.tgz",
      "integrity": "sha512-CRT1WTyuQoD771GW56XEZFQ/ZoSfWid1alKGDYMmkt2yl8UXrVR4pspqWNEcqKvVIzg6PAltWjxcSSPrboA4iA==",
      "license": "MIT",
      "dependencies": {
        "eventsource-parser": "^3.0.1"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/eventsource-parser": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/eventsource-parser/-/eventsource-parser-3.1.1.tgz",
      "integrity": "sha512-EKN1vKAMcZ8MlYMpaNuxN6R9yakzH6uajHcHVTqWJzvu5pWw9DyhbP35HH8MVBQ+dZjAfDxk+A8NiR9KWaXiyQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/lightningcss": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.33.0.tgz",
      "integrity": "sha512-WkUDrojuJs0xkgGf2udWxa3yGBRxPtxUkB79i6aCZLRgc7PM8fZe9TosfPDcvEpQZbuFASnHYmRLBLUbmLOIIA==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.33.0",
        "lightningcss-darwin-arm64": "1.33.0",
        "lightningcss-darwin-x64": "1.33.0",
        "lightningcss-freebsd-x64": "1.33.0",
        "lightningcss-linux-arm-gnueabihf": "1.33.0",
        "lightningcss-linux-arm64-gnu": "1.33.0",
        "lightningcss-linux-arm64-musl": "1.33.0",
        "lightningcss-linux-x64-gnu": "1.33.0",
        "lightningcss-linux-x64-musl": "1.33.0",
        "lightningcss-win32-arm64-msvc": "1.33.0",
        "lightningcss-win32-x64-msvc": "1.33.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.33.0.tgz",
      "integrity": "sha512-gEpRTalKdosp4Bb8qWtc2iOgE5SeIHlpS1up9bFq2wAyYhl1UdTObYiHe98zEM9SQvSoqQZ1IQD0JNpg3Ml5pg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.33.0.tgz",
      "integrity": "sha512-Sciaz8eenNTKn9b3t7+xr0ipTp9YxKQY4npwQ3mrRuL0BAVHBLyZxofhaKBAVtzmtRZ/zTyo0/to4B1uWG/Djg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.33.0.tgz",
      "integrity": "sha512-Z5UPAxzrjlWNNyGy6i65cJzzvgJ5D3T6wMvs+gWpY9d7qRhANrxqAp6LhxIgZhWEw18RfJTGcRxjuLIBr+m8XQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.33.0.tgz",
      "integrity": "sha512-QQM/Ti/hQajJwCY+RiWuCZ9sdtI/XQk7nDK5vC8kkdwixezOlDgvDx7+RT+QjK6FcFT4MpsuoBnHIo/O3StRRg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.33.0.tgz",
      "integrity": "sha512-N7FVBe6iS24MlM6R/4RBTxGhQheZGs7tiQ9U32UtF75NzP5Q7xWPRqLBCKxlRQRk3rY1jCIPLzx7WzOhuUIRLQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.33.0.tgz",
      "integrity": "sha512-j2v/itmy4HlNxlc6voKXYgBqNi0Ng2LShg4z7GufpEgs05P+2suBVyi9I6YHq5uoVFx9ETin3eCEhLVyXGQnKg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.33.0.tgz",
      "integrity": "sha512-yiO5ROMuYQgXbC60yjZU5CYSFZGKXL0HFATXt9mHJn1+zW55oCtMI9NfcVhYLMFDL7gV7oBPon/EmMMGg2OvtQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.33.0.tgz",
      "integrity": "sha512-ar+Ju7LmcN0Jo4FpL4hpFybwNG9/3A/Br5KW2n2jyODg3MEZXaDYADdemoNS+BDNfMgKvylJLj4S5tyRActuAg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.33.0.tgz",
      "integrity": "sha512-RYiYbkokw0trfKqqzfF55lginwEPrD3OJDfTuJzFs1MK6iFnDenaz1fqLLtX4ITG3OktJQXOeTaw1awrBAlZPw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.33.0.tgz",
      "integrity": "sha512-1K+MPfLSFVpphzpdbfkhlWk6wBrTObBzS2T6db10PNOZgR9GoVsAWzwNyuhUYYbTp23j+4RrncfujZ4uAzXvwA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.33.0.tgz",
      "integrity": "sha512-OlEICDx/Xl0FqSp4bry8zFnCvGpig3Gl4gCquvYwHuqJKEC1+n9NgDniFvqHGmMv1ZkqDJrDqKKSykTDX+ehuA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/magic-string": {
      "version": "0.30.21",
      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
      "integrity": "sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.5"
      }
    },
    "node_modules/marked": {
      "version": "15.0.12",
      "resolved": "https://registry.npmjs.org/marked/-/marked-15.0.12.tgz",
      "integrity": "sha512-8dD6FusOQSrpv9Z1rdNMdlSgQOIP880DHqnohobOmYLElGEqAL/JvxvuxZO16r4HtjTlfPRDC1hbvxC9dPN2nA==",
      "license": "MIT",
      "bin": {
        "marked": "bin/marked.js"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/mustache": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/mustache/-/mustache-4.2.0.tgz",
      "integrity": "sha512-71ippSywq5Yb7/tVYyGbkBggbU8H3u5Rz56fH60jGFgr8uHwxs+aSKeqmluIVzM0m0kB7xQjKS6qPfd0b2ZoqQ==",
      "license": "MIT",
      "bin": {
        "mustache": "bin/mustache"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.20",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.20.tgz",
      "integrity": "sha512-uKdg2G3GNCKQn9byYOpxbGqrT2fGO5KRt5J/8b3pok8rT6qxGWF6hxMyJiEYtAf+FVyYuD9hRaDqX5uPFYJ4ZQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.33",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.33.tgz",
      "integrity": "sha512-RVHEU9/Pp1Fnjr/MpAJsZoADukCKhfIi15OunEYiGktIkYLkPVvC1sioWolGDS7XByMTx9m/IGbro0Js13zhnQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.20",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.2"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/rolldown": {
      "version": "1.2.19",
      "resolved": "https://registry.npmjs.org/rolldown/-/rolldown-1.2.19.tgz",
      "integrity": "sha512-QIiV1J9d0pzN4jeeTH4sjPy0AZ6cAy2cG0ExeoE1+U8Rvj+hR3gYkokx0YbeUNGlZqiQJJ2utcETe0oKXwzsuA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@oxc-project/types": "=0.156.0",
        "@rolldown/pluginutils": "^1.0.0"
      },
      "bin": {
        "rolldown": "bin/cli.mjs"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "optionalDependencies": {
        "@rolldown/binding-android-arm-eabi": "1.2.19",
        "@rolldown/binding-android-arm64": "1.2.19",
        "@rolldown/binding-darwin-arm64": "1.2.19",
        "@rolldown/binding-darwin-x64": "1.2.19",
        "@rolldown/binding-freebsd-x64": "1.2.19",
        "@rolldown/binding-linux-arm-gnueabihf": "1.2.19",
        "@rolldown/binding-linux-arm64-gnu": "1.2.19",
        "@rolldown/binding-linux-arm64-musl": "1.2.19",
        "@rolldown/binding-linux-ppc64-gnu": "1.2.19",
        "@rolldown/binding-linux-s390x-gnu": "1.2.19",
        "@rolldown/binding-linux-x64-gnu": "1.2.19",
        "@rolldown/binding-linux-x64-musl": "1.2.19",
        "@rolldown/binding-openharmony-arm64": "1.2.19",
        "@rolldown/binding-wasm32-wasi": "1.2.19",
        "@rolldown/binding-win32-arm64-msvc": "1.2.19",
        "@rolldown/binding-win32-x64-msvc": "1.2.19"
      }
    },
    "node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz",
      "integrity": "sha512-KGj/8Y43x35aZVDtt+J4mK1hoLGHULMYfSkODJNQjNDC3oW1PqPoxMwo0pLUsWM/UEGzON/NxeHywEfNXNP3Vw==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-support": {
      "version": "0.5.21",
      "resolved": "https://registry.npmjs.org/source-map-support/-/source-map-support-0.5.21.tgz",
      "integrity": "sha512-uBHU3L3czsIyYXKX88fdrGovxdSCoTGDRZ6SYXtSRxLZUzHg5P/66Ht6uoUlHu9EZod+inXhKo3qQgwXUT/y1w==",
      "license": "MIT",
      "dependencies": {
        "buffer-from": "^1.0.0",
        "source-map": "^0.6.0"
      }
    },
    "node_modules/terser": {
      "version": "5.51.2",
      "resolved": "https://registry.npmjs.org/terser/-/terser-5.51.2.tgz",
      "integrity": "sha512-bWnjSNscmuI+GJze6ZupnHP8G/cTcsJF+bXCeQknk2SHQsgbNJnLrqiH9jZ2W4STPVXH2mDKKRX3iwPhc9Cn/Q==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "@jridgewell/source-map": "^0.3.3",
        "acorn": "^8.15.0",
        "commander": "^2.20.0",
        "source-map-support": "~0.5.20"
      },
      "bin": {
        "terser": "bin/terser"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tslib": {
      "version": "2.9.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.9.1.tgz",
      "integrity": "sha512-a4Ux9VKuIMHsOS7ENbEq6hK2ZGYIT27Rtl0E4eD9KqwxhKiQeMZE/9xb3IdYwWaSOyIBQLExhQgXDTYoiCxnWA==",
      "dev": true,
      "license": "0BSD",
      "optional": true
    },
    "node_modules/vite": {
      "version": "8.3.8",
      "resolved": "https://registry.npmjs.org/vite/-/vite-8.3.8.tgz",
      "integrity": "sha512-LzOn3h9rG/0vhLdXrV4yJ4QFA9eEoqCl+Yx+kGJd7aB9w6nfNgVHKSYwLPZUHrz4ZGa+t+kXjV9itvcHDLQouA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "lightningcss": "^1.33.0",
        "picomatch": "^4.0.7",
        "postcss": "^8.5.32",
        "rolldown": "~1.2.18",
        "tinyglobby": "^0.2.17"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "@vitejs/devtools": "^0.7.1 || ^0.8.0",
        "esbuild": "^0.27.0 || ^0.28.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "@vitejs/devtools": {
          "optional": true
        },
        "esbuild": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/vue": {
      "version": "3.5.45",
      "resolved": "https://registry.npmjs.org/vue/-/vue-3.5.45.tgz",
      "integrity": "sha512-3cvsib8m9c0vB24+MDKsgcW4+Da4xaBl9Z/5Tbm2pmSIsRPxcil4cdXjXlVsmJ2g64XJo5h+IRd7rsdGT9pZaw==",
      "license": "MIT",
      "dependencies": {
        "@vue/compiler-dom": "3.5.45",
        "@vue/compiler-sfc": "3.5.45",
        "@vue/runtime-dom": "3.5.45",
        "@vue/server-renderer": "3.5.45",
        "@vue/shared": "3.5.45"
      },
      "peerDependencies": {
        "typescript": "*"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    }
  }
}
`,at=`import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({ plugins: [vue()] });
`,ot=`import { createApp } from 'vue';
import SearchApp from './SearchApp.vue';
import '../search.css';

const app = createApp(SearchApp);
// Show the warning without the component trace, which can include connection props.
app.config.warnHandler = (message) => { console.warn('[Vue]', message); };
app.mount('#app');
`,st=`<script setup>
import { h, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
  SearchstaxExternalPromotionsWidget,
  SearchstaxFacetsWidget,
  SearchstaxPaginationWidget,
  SearchstaxResultWidget,
  SearchstaxSortingWidget,
  SearchstaxWrapper,
} from '@searchstax-inc/searchstudio-ux-vue';
import { connection, demo, design } from './config.js';
import { contentLanguageTag } from './content-language.js';
import { starterPassages } from './starter-passages.js';
import { setupStarterServices } from './starter-services.js';
import { thumbnailAlt } from './thumbnail-alt.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { sampleSuggestionSource, setupSearchSuggestions } from './suggestions.js';
import { getAnalyticsSettings, setupResultTracking } from './result-tracking.js';
import { setupPaginationFocus } from './pagination-focus.js';

function Passage({ parts }) {
  return parts.map(part => part.matched ? h('mark', { class: 'search-result-hit' }, part.text) : part.text);
}

const analytics = getAnalyticsSettings(connection);
const resultLanguage = contentLanguageTag(connection.language);
const isDemo = connection.searchURL === demo.searchURL && connection.model === demo.model && resultLanguage === demo.language;
const initialQuery = connection.initialQuery || (isDemo ? 'rehabilitation' : '');
const form = ref(null);
const queryField = ref(null);
const pagination = ref(null);
const resultHost = ref(null);
const answerHost = ref(null);
let services;
const status = ref('Connecting to search…');
let api;
let loadingSubscription;
let timer;
let setSuggestionSource;

function publicLink(value) {
  try {
    const url = new URL(value);
    if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { /* An unmapped URL produces no link. */ }
  return '';
}



function afterSearch(items, response) {
  const total = response?.response?.numFound;
  if (typeof total !== 'number') return [];
  window.clearTimeout(timer);
  status.value = total + (total === 1 ? ' result' : ' results');
  const passages = starterPassages(response, isDemo);
  const results = items.flatMap(item => {
    const url = publicLink(item.url);
    return url ? [{
      ...item,
      url,
      ...passages(item),
      previewThumbnail: design.showThumbnails ? (isDemo ? demo.thumbnailPaths[url] : publicLink(item.thumbnail)) : '',
      previewThumbnailAlt: isDemo ? '' : thumbnailAlt(
        item.allFields,
        connection.thumbnailAltField,
        connection.thumbnailsWithoutAltAreDecorative,
      ),
    }] : [];
  });
  return results;
}

function facetLabel(value) {
  return isDemo && Object.hasOwn(demo.facetLabels, value) ? demo.facetLabels[value] : value;
}

function sortChoices(data) {
  return isDemo ? demo.sortOptions : data?.sortOptions?.map(item => ({ label: item.value, order: item.key })) ?? [];
}

function sortSearch(order) {
  api.dataLayer.setSearchObject({ ...api.dataLayer.searchObject, order: encodeURIComponent(order), page: 1 });
}

function livePromotions(data) {
  return data?.externalPromotions?.flatMap(item => {
    const url = publicLink(item.url);
    return url ? [{ ...item, url }] : [];
  }) ?? [];
}

function runSearch(value) {
  const term = value.trim();
  if (!term) {
    status.value = 'Enter a search term.';
    return;
  }
  const current = api.dataLayer.searchObject;
  const next = { ...current, query: term, page: 1, facets: [] };
  void services?.search(term);
  if (current.query === term && current.page === 1 && !current.facets.length) api.search(next);
  else api.dataLayer.setSearchObject(next);
}

function initialized(instance) {
  api = instance;
  api.setCookiesDisabled(!analytics.trackApiKey);
}

// The wrapper emits initialized before mounting its slot and the widgets.
watch(form, async (element) => {
  if (!element || loadingSubscription) return;
  await nextTick();
  if (!form.value) return;
  loadingSubscription = api.dataLayer.$loadingChange.subscribe((loading) => {
    if (!loading) return;
    status.value = 'Searching…';
    window.clearTimeout(timer);
    timer = window.setTimeout(() => { status.value = 'Search is unavailable. Try again in a moment.'; }, 15000);
  });
  api.dataLayer.setItemsPerPage(design.resultsPerPage);
  queryField.value.value = initialQuery;
  if (design.showSuggestions) {
    const source = isDemo ? sampleSuggestionSource : connection.suggesterURL
      ? createCustomerSuggestionSource({ token: connection.searchAuth, language: connection.language }, connection.suggesterURL)
      : null;
    if (source) {
      setSuggestionSource = setupSearchSuggestions(element, 'vue-search-suggestions');
      setSuggestionSource(source);
    }
  }
  services = setupStarterServices(element, answerHost.value, connection, design);
  if (initialQuery) runSearch(initialQuery);
  else status.value = 'Enter a search term.';
}, { flush: 'post' });

watch(resultHost, (host, _, onCleanup) => {
  if (host) {
    const stop = setupResultTracking(host, api);
    if (stop) onCleanup(stop);
  }
}, { flush: 'post' });

watch(pagination, (host, _, onCleanup) => {
  if (host) onCleanup(setupPaginationFocus(host, () => api));
}, { flush: 'post' });

onBeforeUnmount(() => {
  services?.clear();
  setSuggestionSource?.(null);
  if (loadingSubscription) api.dataLayer.$loadingChange.unsubscribe(loadingSubscription);
  window.clearTimeout(timer);
});
<\/script>

<template>
  <main class="search-starter">
    <img v-if="design.logoURL" class="search-starter__logo" :src="design.logoURL" alt="Company logo"
      referrerpolicy="no-referrer" @error="$event.target.hidden = true">
    <h1>{{ isDemo ? 'Search Central County' : 'Search' }}</h1>
    <p v-if="isDemo">Search fictional university health content with the SearchStax Vue UI Kit.</p>
    <p v-if="!connection.searchURL || !connection.searchAuth">Set the Select endpoint and read-only token in src/config.js to start searching.</p>
    <SearchstaxWrapper v-else
      :searchURL="connection.searchURL" :searchAuth="connection.searchAuth" :model="connection.model"
      :language="connection.language" authType="token" suggesterURL="" v-bind="analytics"
      :router="{ enabled: false }" :afterSearch="afterSearch" @initialized="initialized"
    >
      <div>
        <form ref="form" class="search-starter__form" role="search" @submit.prevent="runSearch(queryField.value)">
          <label class="search-starter__sr-only" for="starter-query">{{ design.searchFieldText }}</label>
          <input id="starter-query" ref="queryField" type="search"
            :placeholder="design.searchFieldText" autocomplete="off" required>
          <button type="submit" class="search-starter__submit">{{ design.searchButtonText }}</button>
        </form>
      </div>
      <div ref="answerHost"></div>
      <p role="status">{{ status }}</p>
      <SearchstaxSortingWidget v-if="design.showSorting">
        <template #sorting="{ sortingData, selectedSorting }">
          <label v-if="sortingData?.searchExecuted && sortChoices(sortingData).length" class="search-starter__sort">
            Sort by
            <select :value="selectedSorting" @change="sortSearch($event.target.value)">
              <option v-for="choice in sortChoices(sortingData)" :key="choice.order" :value="choice.order">{{ choice.label }}</option>
            </select>
          </label>
        </template>
      </SearchstaxSortingWidget>
      <Teleport defer to="#starter-promotions-below" :disabled="design.bannerPlacement === 'above'">
        <SearchstaxExternalPromotionsWidget>
          <template #externalPromotions="{ externalPromotionsData }">
            <section v-if="livePromotions(externalPromotionsData).length" aria-label="External promotions">
              <div v-for="entry in livePromotions(externalPromotionsData)" :key="entry.id ?? entry.url" class="search-promotion-banner">
                <strong class="search-promotion-heading">{{ design.promotionHeading }}</strong>
                <a :href="entry.url" :lang="resultLanguage" referrerpolicy="no-referrer">{{ entry.name || entry.url }}</a>
                <p v-if="entry.description" :lang="resultLanguage">{{ entry.description }}</p>
              </div>
            </section>
          </template>
        </SearchstaxExternalPromotionsWidget>
      </Teleport>
      <div class="search-starter__body">
        <aside v-if="design.showFilters" class="search-starter__filters" aria-label="Filter search results">
          <SearchstaxFacetsWidget facetingType="or" :itemsPerPageDesktop="20" :itemsPerPageMobile="20">
            <template #desktopFacets="{ facetsTemplateDataDesktop, onUpdateRefDesktop, isChecked, selectFacet }">
              <fieldset v-for="facet in facetsTemplateDataDesktop?.facets" :key="facet.name">
                <legend>{{ facet.label || facet.name }}</legend>
                <div class="search-facet-choices">
                  <div v-for="option in facet.values" :key="option.value" :ref="element => onUpdateRefDesktop(element, option)">
                    <label>
                      <input type="checkbox" :checked="Boolean(isChecked(option))" :disabled="option.disabled"
                        @click="selectFacet(option.value + '-desktop', $event, option, true)">
                      <span>{{ facetLabel(option.value) }}</span><small>{{ option.count }}</small>
                    </label>
                  </div>
                </div>
              </fieldset>
            </template>
            <template #mobileFacets></template>
          </SearchstaxFacetsWidget>
        </aside>
        <div ref="resultHost">
          <SearchstaxResultWidget renderMethod="pagination" :resultsPerPage="design.resultsPerPage">
            <template #results="{ searchResults }">
              <div class="searchstax-search-results">
                <article v-for="item in searchResults" :key="item.uniqueId || item.url" class="searchstax-search-result">
                  <span v-if="item.promoted" class="search-promotion-marker">{{ design.promotionBadge }}</span>
                  <img v-if="item.previewThumbnail && item.previewThumbnailAlt !== null" class="search-starter__result-thumbnail" :src="item.previewThumbnail"
                    :alt="item.previewThumbnailAlt" :lang="resultLanguage" loading="lazy" referrerpolicy="no-referrer">
                  <span v-if="item.ribbonParts.length" class="searchstax-search-result-ribbon"><Passage :parts="item.ribbonParts" /></span>
                  <h2 :lang="resultLanguage"><a :href="item.url" :data-result-id="item.uniqueId" referrerpolicy="no-referrer"><Passage :parts="item.titleParts" /></a></h2>
                  <p v-if="item.descriptionParts.length" class="search-starter__result-description" :lang="resultLanguage"><Passage :parts="item.descriptionParts" /></p>
                  <p v-for="(field, i) in item.otherFields" :key="i">{{ field.label ? field.label + ': ' : '' }}<Passage :parts="field.parts" /></p>
                </article>
              </div>
            </template>
            <template #noResult>
              <p class="search-starter__no-results">{{ design.noResultsText }}</p>
            </template>
          </SearchstaxResultWidget>
          <div ref="pagination" tabindex="-1" role="group" aria-label="Search result pagination">
            <SearchstaxPaginationWidget>
              <template #pagination="{ paginationData }">
                <nav v-if="paginationData?.totalResults" class="search-starter__pagination" aria-label="Search result pages">
                  <span tabindex="-1" data-page-range :data-page-start="paginationData.startResultIndex">{{ paginationData.startResultIndex }}–{{ paginationData.endResultIndex }} of {{ paginationData.totalResults }} results</span>
                  <button v-if="!paginationData.isFirstPage" type="button" data-page-step="previous">Previous</button>
                  <button v-if="!paginationData.isLastPage" type="button" data-page-step="next">Next</button>
                </nav>
              </template>
            </SearchstaxPaginationWidget>
            <span class="search-starter__sr-only" role="status" data-page-announcement></span>
          </div>
        </div>
      </div>
      <div id="starter-promotions-below"></div>
    </SearchstaxWrapper>
  </main>
</template>
`,ct="# SearchStax Vue Starter\n\nThis starter uses the SearchStax Vue UI Kit and your Search Lab design. A SearchLabDemo download is ready to search. For a connected-app download, add your endpoint and read-only token under **Connect Your Search App** before you run it.\n\n## Run the Demo\n\nUse Node.js 20.19+ on the 20.x line, or Node.js 22.12 or later.\n\n```sh\nnpm ci\nnpm run dev\n```\n\nOpen the localhost URL printed in the terminal. The demo search requires an internet connection. Run `npm run build` to create the deployable files in `dist/`.\n\n- Search for `rehabilitation` to try filters or view the optional sample thumbnails.\n- On SearchLabDemo, type `reh` to try suggestions if you enabled them in your design.\n\n## Connect Your Search App\n\nUse `src/config.js` to connect your app. Keep the `demo` object and set `connection.searchURL` to your Select endpoint, `connection.searchAuth` to an active **Read Only** token, `connection.model` to your Search Profile name, and `connection.language` to the language configured for your app. Set `connection.initialQuery` to a term that matches your content or leave it empty to start with a blank search box.\n\n1. Find the Select endpoint and token under **App Settings > All APIs > Search & Indexing**.\n2. Map Title, URL, and Description under the profile’s **Results Fields**. Map Thumbnail if you display images. Configure and publish any facets, sort options, and Promotions you want to use. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields)\n3. For live suggestions, publish Auto-Suggest, set `suggesterURL` to its endpoint, and enable `showSuggestions` in `design`. [Auto-Suggest API](https://support.searchstax.com/hc/en-us/articles/40243330090893-Auto-Suggest-API)\n\n### Promotions\n\nSearch with a published trigger on the selected profile. An elevated result gets the indexed badge from your design. External items use the banner heading, style, and placement from your design. A normal query shows the profile’s ordinary results. To try the fixed samples, choose **Fictional demo** in local Search Lab. [Promotions setup](https://support.searchstax.com/hc/en-us/articles/40155433600397-Promotions)\n\n### Related Searches and Smart Answers\n\nThe download includes the selected app’s feature settings in `src/feature-settings.js`. Related Searches uses the app entitlement and the published setting for the search language. Smart Answers uses its entitlement and the published setting for the selected profile and language. An off or unknown setting leaves that feature out.\n\nIn `src/config.js`, enter `relatedURL` and the browser-safe `discoveryKey` from **App Settings → All APIs → Discovery** to receive related terms. For Smart Answers, enter the streaming `questionURL` or a same-origin streaming proxy. Answers use the search token, language, and profile. [Related Searches API](https://support.searchstax.com/hc/en-us/articles/40243333638541-Related-Searches-API) · [Smart Answers setup](https://support.searchstax.com/hc/en-us/articles/40075209934989-Smart-Answers)\n\nIf you switch apps or the published settings change, reconnect in Build with the updated app configuration and download a fresh starter. For fixed examples of both features, choose **Fictional demo** in local Search Lab before downloading.\n\nResult links open with tracking off by default. To enable search and result-click tracking on your own app, open **App Settings > All APIs > Analytics**. In `src/config.js`, set `connection.analyticsBaseUrl` to the origin of your Tracking URL (the `https://` address before `/api/v2/track/`) and `connection.trackApiKey` to the Tracking key. Leave both blank to keep tracking off. If your site requires consent, supply these settings only after the visitor opts in.\n\n### Thumbnail Descriptions\n\nTo show informative thumbnails, enable thumbnails in the design and map the image URL field to **Thumbnail**. Add the indexed description as a Return Field with **No mapping** in **Results Fields**. Then set `connection.thumbnailAltField` in `src/config.js` to that field’s name, such as `image_alt`. Use a description that conveys the information the image adds. The starter omits a connected thumbnail when its description is missing. Set `thumbnailsWithoutAltAreDecorative` to `true` only if every thumbnail without a description is decorative or repeats the nearby text. Those images use empty alt text. [Decorative images](https://www.w3.org/WAI/tutorials/images/decorative/)\n\nBrowser code is visible to visitors. Use a server-side proxy for tokens that need to stay private. [Endpoint and token guidance](https://support.searchstax.com/hc/en-us/articles/39440547272077-Hide-Tokens-and-Endpoints-in-UI-Kits)\n\nUse `src/SearchApp.vue` to change the Vue widget templates and `search.css` to change their appearance. Retain the `.search-starter` wrapper so the exported selectors apply. [Vue UI Kit setup](https://support.searchstax.com/hc/en-us/articles/40395808395277-Getting-Started-with-searchstudio-ux-vue)\n",lt=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SearchStax Angular Starter</title>
  <base href="/">
</head>
<body class="search-starter-page">
  <search-app></search-app>
</body>
</html>
`,ut=`{
  "name": "searchstax-angular-starter",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "ng serve --host 127.0.0.1",
    "build": "ng build"
  },
  "engines": { "node": "^22.22.3 || ^24.15.0 || >=26.0.0" },
  "dependencies": {
    "@angular/common": "22.2.6",
    "@angular/compiler": "22.2.6",
    "@angular/core": "22.2.6",
    "@angular/forms": "22.2.6",
    "@angular/platform-browser": "22.2.6",
    "@searchstax-inc/searchstudio-ux-angular": "4.2.70",
    "rxjs": "7.8.2",
    "tslib": "2.8.1"
  },
  "devDependencies": {
    "@angular/build": "22.2.6",
    "@angular/cli": "22.2.6",
    "@angular/compiler-cli": "22.2.6",
    "typescript": "6.0.3"
  }
}
`,dt=`{
  "name": "searchstax-angular-starter",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "searchstax-angular-starter",
      "version": "1.0.0",
      "dependencies": {
        "@angular/common": "22.2.6",
        "@angular/compiler": "22.2.6",
        "@angular/core": "22.2.6",
        "@angular/forms": "22.2.6",
        "@angular/platform-browser": "22.2.6",
        "@searchstax-inc/searchstudio-ux-angular": "4.2.70",
        "rxjs": "7.8.2",
        "tslib": "2.8.1"
      },
      "devDependencies": {
        "@angular/build": "22.2.6",
        "@angular/cli": "22.2.6",
        "@angular/compiler-cli": "22.2.6",
        "typescript": "6.0.3"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0"
      }
    },
    "node_modules/@ampproject/remapping": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/@ampproject/remapping/-/remapping-2.3.0.tgz",
      "integrity": "sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@angular-devkit/architect": {
      "version": "0.2202.6",
      "resolved": "https://registry.npmjs.org/@angular-devkit/architect/-/architect-0.2202.6.tgz",
      "integrity": "sha512-rUkPPjvxYn3G699TriJDj0ZdX6pXvIwWqnvssuyD3gqNijBp/49kI31fCTqTns8PhZVj1JhatEiKlCvmxnLHgQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@angular-devkit/core": "22.2.6",
        "rxjs": "7.8.2"
      },
      "bin": {
        "architect": "bin/cli.js"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      }
    },
    "node_modules/@angular-devkit/core": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular-devkit/core/-/core-22.2.6.tgz",
      "integrity": "sha512-OtFUe9fLXpHsqO6gCSbTWIaTO64MCrESRVigs9SAW4EzIagCAhgB0Y8GflTjmKGLvJjilBFJFd0JSIzNxLyifA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "8.20.0",
        "ajv-formats": "3.0.1",
        "jsonc-parser": "3.3.1",
        "picomatch": "4.0.7",
        "rxjs": "7.8.2",
        "source-map": "0.8.0"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      },
      "peerDependencies": {
        "chokidar": "^5.0.0"
      },
      "peerDependenciesMeta": {
        "chokidar": {
          "optional": true
        }
      }
    },
    "node_modules/@angular-devkit/schematics": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular-devkit/schematics/-/schematics-22.2.6.tgz",
      "integrity": "sha512-XACkbAmAhBGDfxr8Uny2k0ErDwLpauseccNWdIFs4fiisGTqiCByzkH60/4xTmbV3FTj8bQ6cXYIhhaqe0MK1g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@angular-devkit/core": "22.2.6",
        "jsonc-parser": "3.3.1",
        "magic-string": "1.4.1",
        "ora": "9.4.1",
        "rxjs": "7.8.2"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      }
    },
    "node_modules/@angular/build": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular/build/-/build-22.2.6.tgz",
      "integrity": "sha512-AJBr02LHSzw9roa0poAKIW2I0ydVPGp7kYh8TaSSfUH53B14ZJIbGuL3eLFSJgatZINjJ4XLrBVzeVSj/GG2yQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@ampproject/remapping": "2.3.0",
        "@angular-devkit/architect": "0.2202.6",
        "@babel/core": "8.0.5",
        "@inquirer/confirm": "6.3.2",
        "@parcel/watcher": "2.6.0",
        "@vitejs/plugin-basic-ssl": "2.3.0",
        "beasties": "0.5.4",
        "browserslist": "^4.26.0",
        "chokidar": "5.0.0",
        "esbuild": "0.28.2",
        "https-proxy-agent": "9.1.0",
        "jsonc-parser": "3.3.1",
        "listr2": "11.1.0",
        "magic-string": "1.4.1",
        "mrmime": "2.0.1",
        "oxc-parser": "0.156.0",
        "parse5-html-rewriting-stream": "8.0.1",
        "picomatch": "4.0.7",
        "piscina": "5.3.2",
        "rolldown": "1.2.16",
        "sass": "1.104.1",
        "sass-embedded": "1.104.1",
        "semver": "7.8.5",
        "source-map-support": "0.5.21",
        "tinyglobby": "0.2.17",
        "vite": "8.3.5",
        "xxhash-wasm": "1.1.0"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      },
      "optionalDependencies": {
        "@oxc-parser/binding-wasm32-wasi": "0.156.0",
        "lmdb": "3.5.6"
      },
      "peerDependencies": {
        "@angular/compiler": "^22.0.0",
        "@angular/compiler-cli": "^22.0.0",
        "@angular/core": "^22.0.0",
        "@angular/localize": "^22.0.0",
        "@angular/platform-browser": "^22.0.0",
        "@angular/platform-server": "^22.0.0",
        "@angular/service-worker": "^22.0.0",
        "@angular/ssr": "^22.2.6",
        "istanbul-lib-instrument": "^6.0.0",
        "karma": "^6.4.0",
        "less": "^4.2.0",
        "ng-packagr": "^22.0.0",
        "postcss": "^8.4.0",
        "rollup": "^4.0.0",
        "tailwindcss": "^2.0.0 || ^3.0.0 || ^4.0.0",
        "tslib": "^2.3.0",
        "typescript": ">=6.0 <6.1",
        "vitest": "^4.0.8 || ^5.0.0"
      },
      "peerDependenciesMeta": {
        "@angular/core": {
          "optional": true
        },
        "@angular/localize": {
          "optional": true
        },
        "@angular/platform-browser": {
          "optional": true
        },
        "@angular/platform-server": {
          "optional": true
        },
        "@angular/service-worker": {
          "optional": true
        },
        "@angular/ssr": {
          "optional": true
        },
        "istanbul-lib-instrument": {
          "optional": true
        },
        "karma": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "ng-packagr": {
          "optional": true
        },
        "postcss": {
          "optional": true
        },
        "rollup": {
          "optional": true
        },
        "tailwindcss": {
          "optional": true
        },
        "vitest": {
          "optional": true
        }
      }
    },
    "node_modules/@angular/cli": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular/cli/-/cli-22.2.6.tgz",
      "integrity": "sha512-Ptof26IRAmHKr9La6earJVTijgpdsUXUxDocXJjist0daUUHAOcvY8hX1CMX6Sr1KXq5HkgVS1wy350M3EiINg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@angular-devkit/architect": "0.2202.6",
        "@angular-devkit/core": "22.2.6",
        "@angular-devkit/schematics": "22.2.6",
        "@inquirer/prompts": "8.7.2",
        "@listr2/prompt-adapter-inquirer": "4.2.7",
        "@modelcontextprotocol/server": "2.3.1",
        "@schematics/angular": "22.2.6",
        "jsonc-parser": "3.3.1",
        "listr2": "11.1.0",
        "npm-package-arg": "14.0.0",
        "parse5-html-rewriting-stream": "8.0.1",
        "semver": "7.8.5",
        "yargs": "18.1.0",
        "zod": "4.6.6"
      },
      "bin": {
        "ng": "bin/ng.js"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      }
    },
    "node_modules/@angular/common": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular/common/-/common-22.2.6.tgz",
      "integrity": "sha512-wL7qv2fb/qWIDhq6leX3SFGql76ljCPC6qXHB2KpKJ3GlppuF9fYJwLo+RicRyM72nFu9qQPzd9Zl9k3/eUisQ==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@angular/core": "22.2.6",
        "rxjs": "^6.5.3 || ^7.4.0"
      }
    },
    "node_modules/@angular/compiler": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular/compiler/-/compiler-22.2.6.tgz",
      "integrity": "sha512-9QNqLAG+bqsTRDZZbggX50sS9NyWx3ACfgeLKUAaHPzebQXtIsAYIT6H8HNpR27GHJ2qJHi9yEm84hAJsKZCuQ==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0"
      }
    },
    "node_modules/@angular/compiler-cli": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular/compiler-cli/-/compiler-cli-22.2.6.tgz",
      "integrity": "sha512-9nNettf2g/BsgBLhDF65CAXqc97USoLynC3hkF6DwQxc1syzHQ5XOGpiHTp0YWPbe9/DKBQxOBOROVE0vhYMqw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "8.0.1",
        "@jridgewell/sourcemap-codec": "^1.6.0",
        "chokidar": "^5.0.0",
        "convert-source-map": "^1.5.1",
        "reflect-metadata": "^0.2.0",
        "semver": "^7.0.0",
        "tslib": "^2.3.0",
        "yargs": "^18.0.0"
      },
      "bin": {
        "ng-xi18n": "bundles/src/bin/ng_xi18n.js",
        "ngc": "bundles/src/bin/ngc.js"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@angular/compiler": "22.2.6",
        "typescript": ">=6.0 <6.1"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/@angular/compiler-cli/node_modules/@babel/core": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-8.0.1.tgz",
      "integrity": "sha512-5FgxM4dLQpMJHSiVATk8foW263dVHQHBVpXYiimNECVWG01f4nFyEbQixeT6Mwvg7TayREJ2gpKl3o2RoMdnqw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^8.0.0",
        "@babel/generator": "^8.0.0",
        "@babel/helper-compilation-targets": "^8.0.0",
        "@babel/helpers": "^8.0.0",
        "@babel/parser": "^8.0.0",
        "@babel/template": "^8.0.0",
        "@babel/traverse": "^8.0.0",
        "@babel/types": "^8.0.0",
        "@types/gensync": "^1.0.5",
        "convert-source-map": "^2.0.0",
        "empathic": "^2.0.1",
        "gensync": "^1.0.0-beta.2",
        "import-meta-resolve": "^4.2.0",
        "json5": "^2.2.3",
        "obug": "^2.1.1",
        "semver": "^7.7.3"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@angular/compiler-cli/node_modules/@babel/core/node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@angular/core": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular/core/-/core-22.2.6.tgz",
      "integrity": "sha512-atESNSPsM0dBXU88aDtByBP4W/wb8USbhL16lsePyxBvAWtM1Xn7QBB489QTmHpY6VCXHnqMhXWcrZsDpoIBsw==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@angular/compiler": "22.2.6",
        "rxjs": "^6.5.3 || ^7.4.0",
        "zone.js": "~0.15.0 || ~0.16.0"
      },
      "peerDependenciesMeta": {
        "@angular/compiler": {
          "optional": true
        },
        "zone.js": {
          "optional": true
        }
      }
    },
    "node_modules/@angular/forms": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular/forms/-/forms-22.2.6.tgz",
      "integrity": "sha512-W7t8w6l5ftGJSCYvMLfsnpWQclIjNY0zfpZ/B3EIUhEO9gzi13m4GkR43oepyK2/oGPLUNtFnhr+YSFE0BucjQ==",
      "license": "MIT",
      "dependencies": {
        "@standard-schema/spec": "^1.0.0",
        "tslib": "^2.3.0",
        "zod": "^4.0.10"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@angular/common": "22.2.6",
        "@angular/core": "22.2.6",
        "@angular/platform-browser": "22.2.6",
        "rxjs": "^6.5.3 || ^7.4.0"
      }
    },
    "node_modules/@angular/platform-browser": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@angular/platform-browser/-/platform-browser-22.2.6.tgz",
      "integrity": "sha512-xXSgdnnLLv/3aEC/pqyrUd0xlyYURGZG2HR3sOIN3bsIoctGFvzA5iwt/GEKpIDA1rn+NnKNLK/EKQaPA4YZEw==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.3.0"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@angular/animations": "22.2.6",
        "@angular/common": "22.2.6",
        "@angular/core": "22.2.6"
      },
      "peerDependenciesMeta": {
        "@angular/animations": {
          "optional": true
        }
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "8.0.6",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-8.0.6.tgz",
      "integrity": "sha512-uMHhvmDmwFiLuiozaoRYTZHqMFuu3fem/X9JY78lohAuLoh8LSGGC8JqUzo2cVuBsBxkjMZNk56CE7ock8Xxkw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^8.0.6",
        "js-tokens": "^10.0.0"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "8.1.2",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-8.1.2.tgz",
      "integrity": "sha512-XvUnYY6D/bJMB88821n7HFmiwFS6feV7vZLxxudRgWnnwAGtOnDa7C+6svNciIN+BAZDY6WEdIeKHaEW9c0LPg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "8.0.5",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-8.0.5.tgz",
      "integrity": "sha512-2/oWkgTbBYoqioCWAE4XJobOrzwxTDa5/XjDP3tJ1BhDr/owcd9qnXBp4xc3/2G5X4bvXM04nrxbRJxFcXAxFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^8.0.0",
        "@babel/generator": "^8.0.5",
        "@babel/helper-compilation-targets": "^8.0.5",
        "@babel/helpers": "^8.0.5",
        "@babel/parser": "^8.0.5",
        "@babel/template": "^8.0.0",
        "@babel/traverse": "^8.0.5",
        "@babel/types": "^8.0.5",
        "@types/gensync": "^1.0.5",
        "convert-source-map": "^2.0.0",
        "empathic": "^2.0.1",
        "gensync": "^1.0.0-beta.2",
        "import-meta-resolve": "^4.2.0",
        "json5": "^2.2.3",
        "obug": "^2.1.1",
        "verkit": "^0.3.2"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/core/node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@babel/generator": {
      "version": "8.1.2",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-8.1.2.tgz",
      "integrity": "sha512-tAjURz1NaCZGtdG3hB6gjaIeTVo4XFD4TnbqIEneADVJ1Jpt2NxhPBAjbhius8ulUG5b/P2b56ec1ClJZa2aBQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^8.1.2",
        "@babel/types": "^8.1.2",
        "@jridgewell/gen-mapping": "0.4.0-beta.0",
        "@jridgewell/trace-mapping": "^0.3.31",
        "@types/jsesc": "^2.5.0",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/generator/node_modules/@jridgewell/gen-mapping": {
      "version": "0.4.0-beta.0",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.4.0-beta.0.tgz",
      "integrity": "sha512-JdGNkbE4GlNPYQhM0L95fBQr7ctLZJ276QXQLTad4t1oSdnnCI3fDq9DW3BqYAWv8Wc3+HS+4Gsii1oPMCfz1w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.6.0-beta.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "8.0.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-8.0.7.tgz",
      "integrity": "sha512-ilAZCdOOlOVA7dQbaFNw2f/59p6GW33NxTopc3DvEE3efp3ZXTrGX/yZScaKw8/vd9bq31Ag0EcXiLw32bAgJg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^8.0.5",
        "@babel/helper-validator-option": "^8.0.0",
        "browserslist": "^4.24.0",
        "flru": "1.0.2",
        "verkit": "^0.5.0"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets/node_modules/verkit": {
      "version": "0.5.0",
      "resolved": "https://registry.npmjs.org/verkit/-/verkit-0.5.0.tgz",
      "integrity": "sha512-u4J1hr6Y+C/hit34GwL3eIcUf3wngT8TlYUjK7tk0jxydKLAq3sYvifjdTDA6U3KCKRcQCQDGf/srjxfZF3l7g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.12.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/sxzz"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "8.0.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-8.0.6.tgz",
      "integrity": "sha512-OdnA/N52LhzFpeUuVz5YGuSWjc7TPHiFmVYZbPlSgExocO2GwbxVpSni9MVs5wwW+wZ4kPuwBEBN9pIPDYz1mA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "8.1.2",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-8.1.2.tgz",
      "integrity": "sha512-TRz5Z0MgfIfWqwEIq/pCpUpEXQxUt2Ig2ZbxG3SdmhSbHMAFFYGOix0kI4JLV371/TA+qWnQ4xWHPWjojkyRFA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "8.0.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-8.0.6.tgz",
      "integrity": "sha512-HYx0YmuchRxRSpnjvcNffnPS8DCauKNmnumIuHG3jnQAVewRA7kfJGwF13ayEpSZs7s4R/oBH4eppuXcAQd5JQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-8.0.0.tgz",
      "integrity": "sha512-U4Dybxh4WESWHt5XhBeExi4DrY0/DNK1aHpQbsrQXCUbFHuMweT0TpLEWKvaraV2Y6fS+ZXunsZ8zIuZIgvF2Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "8.1.2",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-8.1.2.tgz",
      "integrity": "sha512-BmtiG8H9OUWSTFOgl9jtPYmfDi6uc21Pf4GUxkgGoZnzMIzpDnhkl5gsGJW6wb1jmKCyU565F8IYe5mwOTctfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^8.1.2",
        "@babel/types": "^8.1.2"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "8.1.2",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-8.1.2.tgz",
      "integrity": "sha512-ZDKU7vaX0VORd2BhaO+3FKr/30TKjbUy3SMZcydiPngnAb+MesgUoh5SJcE5EwEyBj14M5J6fK56GuBqvYmOpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^8.1.2"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "8.1.2",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-8.1.2.tgz",
      "integrity": "sha512-9B3FA5HZWK7rTJ7nU2F03qAc/t80O/WB5YQ7NKYdvmMwpq7EUyN04APNQWpkqwSqWtOsuwR0jMSRYLFoAd1m9A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^8.0.6",
        "@babel/parser": "^8.1.2",
        "@babel/types": "^8.1.2"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "8.1.2",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-8.1.2.tgz",
      "integrity": "sha512-J8OoydypQO6HGgRYiiHPMj0iBfz2XpSm5hkmd0+OEHWgQFzYL8TEvYq2y4Gu8vxRCa7g06BilFZ0Imiye5jzzg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^8.0.6",
        "@babel/generator": "^8.1.2",
        "@babel/helper-globals": "^8.0.6",
        "@babel/parser": "^8.1.2",
        "@babel/template": "^8.1.2",
        "@babel/types": "^8.1.2",
        "obug": "^3.0.0"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@babel/traverse/node_modules/obug": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/obug/-/obug-3.0.0.tgz",
      "integrity": "sha512-5vvB5+W7ePv+p3uqxi+RcW1XAzLW0/hxt3/4X4Lc4qHudzOhmBiBwOY6DRob4WnanAEGvNcLjF+KNOufrUoEQw==",
      "dev": true,
      "funding": [
        "https://github.com/sponsors/sxzz",
        "https://opencollective.com/debug"
      ],
      "license": "MIT",
      "engines": {
        "node": ">=12.20.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "8.1.2",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-8.1.2.tgz",
      "integrity": "sha512-uXt6qt2f5G61jZwNIzK1RKu7l5Xjt1VXtPPOGuVveha9fxbx0QM94U1kM4pFZKTRLjWK+X8vmwjwbIemJjiQTA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^8.1.2",
        "@babel/helper-validator-identifier": "^8.0.6"
      },
      "engines": {
        "node": "^22.18.0 || >=24.11.0"
      }
    },
    "node_modules/@bufbuild/protobuf": {
      "version": "2.17.0",
      "resolved": "https://registry.npmjs.org/@bufbuild/protobuf/-/protobuf-2.17.0.tgz",
      "integrity": "sha512-hcPkSz6D7MiTU/5VBBhK+kxaYDoOdQ6yJRFJ3kS8Nydp+VZXfg1vrpABKPNod8bXMufsVCmiUJVIKFzCzta4uw==",
      "dev": true,
      "license": "(Apache-2.0 AND BSD-3-Clause)"
    },
    "node_modules/@emnapi/core": {
      "version": "1.11.3",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.11.3.tgz",
      "integrity": "sha512-zLpS5asjEb7lq8jYLq37N6XKaE41DIexlY1rF/z4/tIl3wo13Sqm28fRyfIsKZD+NZ8mM5RoKkpW/rBcuoSZSg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "peer": true,
      "dependencies": {
        "@emnapi/wasi-threads": "1.2.3",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "1.11.3",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.11.3.tgz",
      "integrity": "sha512-Xz4Tpyki7XyrpbUK1jR1AhdAdaXyhhY4lZ3neLodmhpuWfy2PAQN5B46sAiU4liOXGLkHypn/qU+jvfWSCYYLA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "peer": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/wasi-threads": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.3.tgz",
      "integrity": "sha512-ELEBe8PsLvvJ6QMr0zLt8ffvOHW/dc1m3CEzNMg7aJUv3bMaoDtw2TXyDAwkYBuroxxuHEwhRTLJSe5sya547g==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "peer": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@harperfast/extended-iterable": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/@harperfast/extended-iterable/-/extended-iterable-1.0.5.tgz",
      "integrity": "sha512-4ScXlphaKEa49RpHmqwATq9QI9aUTdWVYDlJkzxhsD7ShJP+pHCYLznMO9n/wREY8jPjRZ59wLJY6HM5yB5Gkw==",
      "dev": true,
      "license": "Apache-2.0",
      "optional": true
    },
    "node_modules/@inquirer/ansi": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@inquirer/ansi/-/ansi-2.1.0.tgz",
      "integrity": "sha512-63GU5AD9KhNbWM0jlhHoMJTEFck2upFOPxHlnCKf3xYTV3rjTUUQfodihmTnfYQzMLS29oy8lK/gA1eJgu4bhA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      }
    },
    "node_modules/@inquirer/checkbox": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/checkbox/-/checkbox-5.3.0.tgz",
      "integrity": "sha512-3QQSO87A+JoRtOtjtsgX2enwTL+3+VBVrkUpdqrIxMOgn5+W5sE57PcCPAiNUIESHxV4Q6mNEGxq2xLmRa0/yw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/ansi": "^2.1.0",
        "@inquirer/core": "^12.1.0",
        "@inquirer/figures": "^2.1.0",
        "@inquirer/type": "4.3.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/checkbox/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/confirm": {
      "version": "6.3.2",
      "resolved": "https://registry.npmjs.org/@inquirer/confirm/-/confirm-6.3.2.tgz",
      "integrity": "sha512-Xvr/0HggjddPtGppuqVmxhTw+Hr8PvsZ/k0HmOEaAqQEt80OITNkFWnsdNmyT0/eM4Ab+iJLx2R8rctlEyfSVg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^12.0.3",
        "@inquirer/type": "4.1.1"
      },
      "engines": {
        "node": ">=23.5.0 || ^22.13.0 || ^20.17.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/core": {
      "version": "12.1.0",
      "resolved": "https://registry.npmjs.org/@inquirer/core/-/core-12.1.0.tgz",
      "integrity": "sha512-6H7usRWw4Gdjgpaem10CA5MfZ/xoYPGyInriR1Xubqjv+SVo8LIJ1erpFxW5JgCza6VZVZiKLTko7RtUU3AQMg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/ansi": "^2.1.0",
        "@inquirer/figures": "^2.1.0",
        "@inquirer/type": "4.3.0",
        "cli-width": "^4.1.0",
        "fast-wrap-ansi": "^0.2.0",
        "mute-stream": "^4.0.0",
        "signal-exit": "^4.1.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/core/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/editor": {
      "version": "5.4.0",
      "resolved": "https://registry.npmjs.org/@inquirer/editor/-/editor-5.4.0.tgz",
      "integrity": "sha512-L7vdCe4jnMpzhDisu1tAnr4WGvfPOVz+vNFXyIIL7O2Ycn/n90sn1ARvg+4cwzLf+us51BE/cX7uhnrLcal3+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^12.1.0",
        "@inquirer/external-editor": "^3.1.0",
        "@inquirer/type": "4.3.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/editor/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/expand": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@inquirer/expand/-/expand-5.2.0.tgz",
      "integrity": "sha512-AOp2KQk7QojUyWOP7VkqdBWmxLRaVH58wQMx3N4//P530EDtpVp1EWIjAJubx9ZohWS/UCEpIkA1TuiNki0iOA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^12.1.0",
        "@inquirer/type": "4.3.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/expand/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/external-editor": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/@inquirer/external-editor/-/external-editor-3.1.0.tgz",
      "integrity": "sha512-27JAkF38nXqXaoveU28iA/+Z8nutnF8B3JsbdToPHn9WnkrsMtZ0/YoJ29YwbtFexYIo+tIy6ikMvTdHKjjmGA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "chardet": "^2.1.1",
        "iconv-lite": "^0.7.2"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/figures": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@inquirer/figures/-/figures-2.1.0.tgz",
      "integrity": "sha512-CR9u2PME23jxy2SOyTb117efwAAPm98Zr+LoWI+PiQ55D6U8Yeu/HyFTxwytKhPa6oxAGzdsm2Kg7oLS6B9z8w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      }
    },
    "node_modules/@inquirer/input": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@inquirer/input/-/input-5.2.0.tgz",
      "integrity": "sha512-sIUPnN2X7M+7dq3RUd+e9QRacYnM+6B+kSucwQgj5VC5Eo/f+CIr2NyPBumxsViI+wzfokkgop/3x3KfHxNyJw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^12.1.0",
        "@inquirer/type": "4.3.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/input/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/number": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/number/-/number-4.3.0.tgz",
      "integrity": "sha512-xYkX4sPVgox0F7yQwpz/MByWjOGdLEf1pdjH+Lji2gAzSs2xezz5bN5YgS1n0tx9wo0mRhGvq1KJGtvDZ9XXcQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^12.1.0",
        "@inquirer/type": "4.3.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/number/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/password": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/password/-/password-5.3.0.tgz",
      "integrity": "sha512-KVqW4G/UbMK06uBN76xF89JKYC9YBWU7v+Kc2tUwMCO8pg3ASBr0HVabl1KaSqF94O2KiRu8aKx4EicN78PK+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/ansi": "^2.1.0",
        "@inquirer/core": "^12.1.0",
        "@inquirer/type": "4.3.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/password/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/prompts": {
      "version": "8.7.2",
      "resolved": "https://registry.npmjs.org/@inquirer/prompts/-/prompts-8.7.2.tgz",
      "integrity": "sha512-QoRB4wFIjgH5iOhSjoIKMkTvSHDuV+O3OITlIqAYO0oK5x364GJILXiMBvlPiE+klg7Xx9tq5XVqQHcGUDYYPA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/checkbox": "^5.2.5",
        "@inquirer/confirm": "^6.3.2",
        "@inquirer/editor": "^5.3.3",
        "@inquirer/expand": "^5.1.5",
        "@inquirer/input": "^5.1.6",
        "@inquirer/number": "^4.2.3",
        "@inquirer/password": "^5.2.2",
        "@inquirer/rawlist": "^5.3.5",
        "@inquirer/search": "^4.3.3",
        "@inquirer/select": "^5.2.5"
      },
      "engines": {
        "node": ">=23.5.0 || ^22.13.0 || ^20.17.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/rawlist": {
      "version": "5.4.0",
      "resolved": "https://registry.npmjs.org/@inquirer/rawlist/-/rawlist-5.4.0.tgz",
      "integrity": "sha512-x42wcy465GM5/mHNKBFdAJbLlLyzmYqr/DEa6F49nHpI+03EFwRCRKeLGQakx5XqZ4unc2yFuS78qAD4Rb0iFA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^12.1.0",
        "@inquirer/type": "4.3.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/rawlist/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/search": {
      "version": "4.4.0",
      "resolved": "https://registry.npmjs.org/@inquirer/search/-/search-4.4.0.tgz",
      "integrity": "sha512-UJ+9tkzPT1AjnvjuPFYcOdO3BVeN28bfSXajYRFZTRgA9OiNl4k2Nn2cHHPwiIDyPHlvOnmE9ZOHyXhPHtvb+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^12.1.0",
        "@inquirer/figures": "^2.1.0",
        "@inquirer/type": "4.3.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/search/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/select": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/select/-/select-5.3.0.tgz",
      "integrity": "sha512-Fmgfl0qjqCQo+/tjQpgnRXKh5N7/VpYcJh+AlYU2eHmHZLMGUBDzo+Gwc2ODzWJfXNRZmgaMhz4qULcO/C/rXg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/ansi": "^2.1.0",
        "@inquirer/core": "^12.1.0",
        "@inquirer/figures": "^2.1.0",
        "@inquirer/type": "4.3.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/select/node_modules/@inquirer/type": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.3.0.tgz",
      "integrity": "sha512-/IA8q2nyjgyl0NGSjqiRXB8gh3We7Pzx9C0c+6Zoolu905jFc79anerrUG7+n65+qs310DRK43yi2WDI8nY59A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/type": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.1.1.tgz",
      "integrity": "sha512-yJoHYrMnxIsJZCY+0Vb66Dy3he3kL3e2wOBKhoSwWWAzZAY82emlxwgprCtp6yRixvNRNq9ztfRWQYPNr3Go7A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=23.5.0 || ^22.13.0 || ^20.17.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.3.tgz",
      "integrity": "sha512-lhTtjtoEArWBjismtfS761S9Hlyn+nIZqOZVYoZ1Xn82PMNMVnk+jj/NhC4fAXGTs7ydONcJiR5vyQBTMDu27g==",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/source-map": {
      "version": "0.3.11",
      "resolved": "https://registry.npmjs.org/@jridgewell/source-map/-/source-map-0.3.11.tgz",
      "integrity": "sha512-ZMp1V8ZFcPG5dIWnQLr3NSI1MiCU7UETdS/A0G8V/XWHvJv3ZsFqutJn1Y5RPmAPX6F3BiE397OqveU/9NCuIA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.25"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.6.0.tgz",
      "integrity": "sha512-T7jf+5zgsZHwNJ4lvQ7/aezbyk0nNX+zJVWpmHA7VYsEx7a7qr5Rg5IbtJFqkgze5Y2sruq1RUY8Q837Od7iFw==",
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@listr2/prompt-adapter-inquirer": {
      "version": "4.2.7",
      "resolved": "https://registry.npmjs.org/@listr2/prompt-adapter-inquirer/-/prompt-adapter-inquirer-4.2.7.tgz",
      "integrity": "sha512-k180vxSv2KqmnDxoato6pCqEJsov4U5C0EVmldZkAdNeVBxY48A/LM6TCNPGIzDK/iZSfsZP0Mw+gbWc5hXLyA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/type": "^4.0.7"
      },
      "engines": {
        "node": ">=22.13.0"
      },
      "peerDependencies": {
        "@inquirer/prompts": ">= 3 < 9",
        "listr2": "11.1.0"
      }
    },
    "node_modules/@lmdb/lmdb-darwin-arm64": {
      "version": "3.5.6",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-darwin-arm64/-/lmdb-darwin-arm64-3.5.6.tgz",
      "integrity": "sha512-mY5FG4TjPAkY4P0w+OhHaUka5mDh2TX2WKYIwuKzJ1zeW3VvRgxdam/lGJTquI+bthTx5CSHDW+BAQCnNAzkEA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@lmdb/lmdb-darwin-x64": {
      "version": "3.5.6",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-darwin-x64/-/lmdb-darwin-x64-3.5.6.tgz",
      "integrity": "sha512-foa+pwitysO8k+xhs7psBFfTKnVgR69NlZRRTHaFVDqphh7AdGpLeyRzKw/ofatr/sN6TiHRRW6mmop0ZrrppQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@lmdb/lmdb-linux-arm": {
      "version": "3.5.6",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-linux-arm/-/lmdb-linux-arm-3.5.6.tgz",
      "integrity": "sha512-QR4YRyR5h5Z8eGXrNQjiyo2NNDfqi3tCc9dQG5Is1blCt+qWw1ZoBWhlWAr5d+jshkifMIJjVHzHGKbkKzF8Tw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@lmdb/lmdb-linux-arm64": {
      "version": "3.5.6",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-linux-arm64/-/lmdb-linux-arm64-3.5.6.tgz",
      "integrity": "sha512-HmiyFFdJa38s1heCMSooSPaBSFTHJ3C+ERPp28xAPlDX1YiALJVOgbry065nXd8Y7KISWjnw05zpG1RX8IfftA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@lmdb/lmdb-linux-x64": {
      "version": "3.5.6",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-linux-x64/-/lmdb-linux-x64-3.5.6.tgz",
      "integrity": "sha512-ADzCuCF2cTNiX9kDScqcz1fjnAkxPpQNneV3KFTdV3wWtVlI2sTGzySoMTgDpinkMMFj1NTJlxA6XR8fwc4hlA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@lmdb/lmdb-win32-arm64": {
      "version": "3.5.6",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-win32-arm64/-/lmdb-win32-arm64-3.5.6.tgz",
      "integrity": "sha512-J7A9aEQsQiv0TYtBGL7NDIPp2lOS8nnl+zm4sWZm1xlsTTaQ4PgD096Adzdrk27rw3UxCkDXdCUa4ax41oztBQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@lmdb/lmdb-win32-x64": {
      "version": "3.5.6",
      "resolved": "https://registry.npmjs.org/@lmdb/lmdb-win32-x64/-/lmdb-win32-x64-3.5.6.tgz",
      "integrity": "sha512-1g7G0knRX2iV/voDu54yxrGqw5Dk0w2oIYb7dgJq8IkOi+m7wbD8Q3QpPFjh0C01G58S88dqGn03len6UPCXsg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@modelcontextprotocol/core": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/@modelcontextprotocol/core/-/core-2.3.1.tgz",
      "integrity": "sha512-laVmIhPGpWi7rG9q+0UigblRN0Hws/Yjlb6qLFtVqryXVLkc4h+yN8z731POD2LnAGQlFe7/tXhUm7Bi0YB91g==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "zod": "^4.2.0"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/@modelcontextprotocol/server": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/@modelcontextprotocol/server/-/server-2.3.1.tgz",
      "integrity": "sha512-e59MfWuSssj6DoQ96JCTqdW1AXT5/XtnTl0WWd6MU1Ka434fFUGGosCLJbGNySDhHGvxQWoRWK137FXYFkYNWw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@modelcontextprotocol/core": "2.3.1",
        "zod": "^4.2.0"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-darwin-arm64": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-darwin-arm64/-/msgpackr-extract-darwin-arm64-3.0.7.tgz",
      "integrity": "sha512-2zPHLn+MuGJ6GP/5jDrwa9Jy0CI+D3Ibpvopf5SFfmc1G9gdofR4uB7YrJAAp4vodn/7iDOciyv8bgkRPLw7cA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-darwin-x64": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-darwin-x64/-/msgpackr-extract-darwin-x64-3.0.7.tgz",
      "integrity": "sha512-of1miwFfEdgs5nythewsEoocfpbjzUf8PC996YDe3kAyv0ZJiMJs5NXlYhE6IdjxfNEPqUXj/BYBnpD8kRdfeQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-linux-arm": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-linux-arm/-/msgpackr-extract-linux-arm-3.0.7.tgz",
      "integrity": "sha512-aDPbiEkFHs3H68705JKxJ15IT41wFdvDhba1pL8ygfdoshboL5dsXtiu76/CqhLWYneE+9hwBE+0abqNOiQ4Bw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-linux-arm64": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-linux-arm64/-/msgpackr-extract-linux-arm64-3.0.7.tgz",
      "integrity": "sha512-jcRydYARTW0gX5idJhxV7m3KkRUD7KtZLYFF1ZY18HrPqpGY0TCqPUTJCwka2kVfVOwfKs3ZmlPSmQb4S6xj7w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-linux-x64": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-linux-x64/-/msgpackr-extract-linux-x64-3.0.7.tgz",
      "integrity": "sha512-A9xOmARctmUvHrBj5GGzGAigsZFnqE4kld5oprX3PyPbkVALV4jwBc17gPZrhSOvnXQc81hE9K7S2hDUCgialA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@msgpackr-extract/msgpackr-extract-win32-x64": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@msgpackr-extract/msgpackr-extract-win32-x64/-/msgpackr-extract-win32-x64-3.0.7.tgz",
      "integrity": "sha512-PRBiOqK4mcR0rvm6nybO7pSOYRR2Zza0+43UK2IvbVGelzMqZViiZJmOWGuWOX678QKESO6YrHx36z43nSS6iQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@napi-rs/nice": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice/-/nice-1.1.1.tgz",
      "integrity": "sha512-xJIPs+bYuc9ASBl+cvGsKbGrJmS6fAKaSZCnT0lhahT5rhA2VVy9/EcIgd2JhtEuFOJNx7UHNn/qiTPTY4nrQw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "optionalDependencies": {
        "@napi-rs/nice-android-arm-eabi": "1.1.1",
        "@napi-rs/nice-android-arm64": "1.1.1",
        "@napi-rs/nice-darwin-arm64": "1.1.1",
        "@napi-rs/nice-darwin-x64": "1.1.1",
        "@napi-rs/nice-freebsd-x64": "1.1.1",
        "@napi-rs/nice-linux-arm-gnueabihf": "1.1.1",
        "@napi-rs/nice-linux-arm64-gnu": "1.1.1",
        "@napi-rs/nice-linux-arm64-musl": "1.1.1",
        "@napi-rs/nice-linux-ppc64-gnu": "1.1.1",
        "@napi-rs/nice-linux-riscv64-gnu": "1.1.1",
        "@napi-rs/nice-linux-s390x-gnu": "1.1.1",
        "@napi-rs/nice-linux-x64-gnu": "1.1.1",
        "@napi-rs/nice-linux-x64-musl": "1.1.1",
        "@napi-rs/nice-openharmony-arm64": "1.1.1",
        "@napi-rs/nice-win32-arm64-msvc": "1.1.1",
        "@napi-rs/nice-win32-ia32-msvc": "1.1.1",
        "@napi-rs/nice-win32-x64-msvc": "1.1.1"
      }
    },
    "node_modules/@napi-rs/nice-android-arm-eabi": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-android-arm-eabi/-/nice-android-arm-eabi-1.1.1.tgz",
      "integrity": "sha512-kjirL3N6TnRPv5iuHw36wnucNqXAO46dzK9oPb0wj076R5Xm8PfUVA9nAFB5ZNMmfJQJVKACAPd/Z2KYMppthw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-android-arm64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-android-arm64/-/nice-android-arm64-1.1.1.tgz",
      "integrity": "sha512-blG0i7dXgbInN5urONoUCNf+DUEAavRffrO7fZSeoRMJc5qD+BJeNcpr54msPF6qfDD6kzs9AQJogZvT2KD5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-darwin-arm64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-darwin-arm64/-/nice-darwin-arm64-1.1.1.tgz",
      "integrity": "sha512-s/E7w45NaLqTGuOjC2p96pct4jRfo61xb9bU1unM/MJ/RFkKlJyJDx7OJI/O0ll/hrfpqKopuAFDV8yo0hfT7A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-darwin-x64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-darwin-x64/-/nice-darwin-x64-1.1.1.tgz",
      "integrity": "sha512-dGoEBnVpsdcC+oHHmW1LRK5eiyzLwdgNQq3BmZIav+9/5WTZwBYX7r5ZkQC07Nxd3KHOCkgbHSh4wPkH1N1LiQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-freebsd-x64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-freebsd-x64/-/nice-freebsd-x64-1.1.1.tgz",
      "integrity": "sha512-kHv4kEHAylMYmlNwcQcDtXjklYp4FCf0b05E+0h6nDHsZ+F0bDe04U/tXNOqrx5CmIAth4vwfkjjUmp4c4JktQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-arm-gnueabihf": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-arm-gnueabihf/-/nice-linux-arm-gnueabihf-1.1.1.tgz",
      "integrity": "sha512-E1t7K0efyKXZDoZg1LzCOLxgolxV58HCkaEkEvIYQx12ht2pa8hoBo+4OB3qh7e+QiBlp1SRf+voWUZFxyhyqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-arm64-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-arm64-gnu/-/nice-linux-arm64-gnu-1.1.1.tgz",
      "integrity": "sha512-CIKLA12DTIZlmTaaKhQP88R3Xao+gyJxNWEn04wZwC2wmRapNnxCUZkVwggInMJvtVElA+D4ZzOU5sX4jV+SmQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-arm64-musl": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-arm64-musl/-/nice-linux-arm64-musl-1.1.1.tgz",
      "integrity": "sha512-+2Rzdb3nTIYZ0YJF43qf2twhqOCkiSrHx2Pg6DJaCPYhhaxbLcdlV8hCRMHghQ+EtZQWGNcS2xF4KxBhSGeutg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-ppc64-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-ppc64-gnu/-/nice-linux-ppc64-gnu-1.1.1.tgz",
      "integrity": "sha512-4FS8oc0GeHpwvv4tKciKkw3Y4jKsL7FRhaOeiPei0X9T4Jd619wHNe4xCLmN2EMgZoeGg+Q7GY7BsvwKpL22Tg==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-riscv64-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-riscv64-gnu/-/nice-linux-riscv64-gnu-1.1.1.tgz",
      "integrity": "sha512-HU0nw9uD4FO/oGCCk409tCi5IzIZpH2agE6nN4fqpwVlCn5BOq0MS1dXGjXaG17JaAvrlpV5ZeyZwSon10XOXw==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-s390x-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-s390x-gnu/-/nice-linux-s390x-gnu-1.1.1.tgz",
      "integrity": "sha512-2YqKJWWl24EwrX0DzCQgPLKQBxYDdBxOHot1KWEq7aY2uYeX+Uvtv4I8xFVVygJDgf6/92h9N3Y43WPx8+PAgQ==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-x64-gnu": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-x64-gnu/-/nice-linux-x64-gnu-1.1.1.tgz",
      "integrity": "sha512-/gaNz3R92t+dcrfCw/96pDopcmec7oCcAQ3l/M+Zxr82KT4DljD37CpgrnXV+pJC263JkW572pdbP3hP+KjcIg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-linux-x64-musl": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-linux-x64-musl/-/nice-linux-x64-musl-1.1.1.tgz",
      "integrity": "sha512-xScCGnyj/oppsNPMnevsBe3pvNaoK7FGvMjT35riz9YdhB2WtTG47ZlbxtOLpjeO9SqqQ2J2igCmz6IJOD5JYw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-openharmony-arm64": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-openharmony-arm64/-/nice-openharmony-arm64-1.1.1.tgz",
      "integrity": "sha512-6uJPRVwVCLDeoOaNyeiW0gp2kFIM4r7PL2MczdZQHkFi9gVlgm+Vn+V6nTWRcu856mJ2WjYJiumEajfSm7arPQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-win32-arm64-msvc": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-win32-arm64-msvc/-/nice-win32-arm64-msvc-1.1.1.tgz",
      "integrity": "sha512-uoTb4eAvM5B2aj/z8j+Nv8OttPf2m+HVx3UjA5jcFxASvNhQriyCQF1OB1lHL43ZhW+VwZlgvjmP5qF3+59atA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-win32-ia32-msvc": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-win32-ia32-msvc/-/nice-win32-ia32-msvc-1.1.1.tgz",
      "integrity": "sha512-CNQqlQT9MwuCsg1Vd/oKXiuH+TcsSPJmlAFc5frFyX/KkOh0UpBLEj7aoY656d5UKZQMQFP7vJNa1DNUNORvug==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/nice-win32-x64-msvc": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/nice-win32-x64-msvc/-/nice-win32-x64-msvc-1.1.1.tgz",
      "integrity": "sha512-vB+4G/jBQCAh0jelMTY3+kgFy00Hlx2f2/1zjMoH821IbplbWZOkLiTYXQkygNTzQJTq5cvwBDgn2ppHD+bglQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@napi-rs/wasm-runtime": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-1.2.7.tgz",
      "integrity": "sha512-zJccwplOAbgfZju95IUHazLnx9RAPtPN2YGJXI6UbrgeaR9QfPjGrQL6ERkSAtnVCA4Q+83ApGyaX5zdpCaKkQ==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@tybys/wasm-util": "^0.10.3"
      },
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=23.5.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "peerDependencies": {
        "@emnapi/core": "^1.7.1 || 2.0.0-beta.2 || 2.0.0-beta.3",
        "@emnapi/runtime": "^1.7.1 || 2.0.0-beta.2 || 2.0.0-beta.3"
      }
    },
    "node_modules/@oxc-parser/binding-android-arm-eabi": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-android-arm-eabi/-/binding-android-arm-eabi-0.156.0.tgz",
      "integrity": "sha512-RMq7DKNzEp1T51QKNLTn0NryNEt2IYfh7mZBlIdi2Ju52ltOEDMeIXv0XBpA6dL7j7ChjlcovtGcc1Jv4qMipg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-android-arm64": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-android-arm64/-/binding-android-arm64-0.156.0.tgz",
      "integrity": "sha512-mwkWKhOBpmh8fWc3m4MiLsmEAtx0YuHmvyo9ff557cnb3QZ2kt2eauSz75wCGIpiZG3gUsJ4WwzEjm4R4/BHig==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-darwin-arm64": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-darwin-arm64/-/binding-darwin-arm64-0.156.0.tgz",
      "integrity": "sha512-6pGR5fUszM9M4eBBapqpGjCRJolFwuCldx8bRQjqXyM09cQysBTWVF2Ttg4UNJVxYSaw5RRINbveCOOCrsuGvA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-darwin-x64": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-darwin-x64/-/binding-darwin-x64-0.156.0.tgz",
      "integrity": "sha512-M9QghL7uCAqMKjYJv1rDGblfEvkeQu3QzTPd7Uwo16gG3uO7m9ikVQ9OL8FZTnKzU4vbCEby6kTlEkqN+JeEMA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-freebsd-x64": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-freebsd-x64/-/binding-freebsd-x64-0.156.0.tgz",
      "integrity": "sha512-lX0ANxSwAOrpOT7NHB+YsrBqDJ8sOVon5m7GS9eQtkuUeNzQMMGpFsJLsStawTbrdwOF5KDVxgPWcKmt/DIZUQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-arm-gnueabihf": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-arm-gnueabihf/-/binding-linux-arm-gnueabihf-0.156.0.tgz",
      "integrity": "sha512-iPgYpasRcqk7X3TGncQg7B+6RotDvG8weug0UrgF+FXLf4KmaNDyT91BKONlqbHcNgK9Nryp7AEZGuQn32fP6g==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-arm-musleabihf": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-arm-musleabihf/-/binding-linux-arm-musleabihf-0.156.0.tgz",
      "integrity": "sha512-sJqJDEZevtkEfoxrXfaRTkSt6Itckr549cIfBbs11UgXv8bFyqQsXTQa6iKm8mTiWYmCDDFJf7TLnqxcbqzPOw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-arm64-gnu": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-arm64-gnu/-/binding-linux-arm64-gnu-0.156.0.tgz",
      "integrity": "sha512-mrQs5OdRiqKskRuWEORPKT6YGIFhrpVvCvL9hqVaIh60EzgR4qjPvSsV6hWZcOfyWHBTbdEvfnDJPh/eQlxPRQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-arm64-musl": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-arm64-musl/-/binding-linux-arm64-musl-0.156.0.tgz",
      "integrity": "sha512-ZtPqgCU3+wpU7dvX7YbaEiw71r0UdguzuPhcx4PIEZSs4XFqc6F5wXCtNdb6M7m3DMErlxrwosryoXrzYOY/Gg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-ppc64-gnu": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-ppc64-gnu/-/binding-linux-ppc64-gnu-0.156.0.tgz",
      "integrity": "sha512-ZuGRT/adReZZJn3PYNneb1HQIOH0iIZ2fzFgC1/XJYpMQ5KsRKmWIEzy3wEFsUwIOTomCmnmTZ/zbFYo9z9VeA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-riscv64-gnu": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-riscv64-gnu/-/binding-linux-riscv64-gnu-0.156.0.tgz",
      "integrity": "sha512-T+iWCeAOoEAJpHqr6/pogHIv98g9p8Ctccysm/h962hG4ayX5OL2c0Ih4oYe+JuFndLXy/OASvwMlTPe76sIiw==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-riscv64-musl": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-riscv64-musl/-/binding-linux-riscv64-musl-0.156.0.tgz",
      "integrity": "sha512-wL55bI2kVKfwdxScbw60zVgzAqbQbmE5zpSPWPZoZ9RSG8egm6ITE/UWE5mDWlglxz1QElJCcUbpaJCtHD11BQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-s390x-gnu": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-s390x-gnu/-/binding-linux-s390x-gnu-0.156.0.tgz",
      "integrity": "sha512-+D+JilhLqwrDLODYEl4qtovVwgxKALb23FkAWBiPvgmUWYgjCV83KKuwwxZJM8GCdKlNA1vt3iKtow8HUFjXtg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-x64-gnu": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-x64-gnu/-/binding-linux-x64-gnu-0.156.0.tgz",
      "integrity": "sha512-jRfwpN4xKrsEpC+SgrUPY5k0mINYZn7aLrt22I3uQFoumiSgHgsLYgS9f84ntbkvSydH4HiwGuDa2b1XCHaJzw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-linux-x64-musl": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-linux-x64-musl/-/binding-linux-x64-musl-0.156.0.tgz",
      "integrity": "sha512-P/ajnypgLmxmuRRyCIZcp2o4lOwmCaXYH5+eqDTcCW+MCTI+csKSw/Zc6GB67jZoVa4ey3q1jXEt7S60adBEMQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-openharmony-arm64": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-openharmony-arm64/-/binding-openharmony-arm64-0.156.0.tgz",
      "integrity": "sha512-WSN6rQZZc9KqgZ4lMfjVDvqKhVOCjey/YEZIPisGXmwBqwgWOzru207dyiH50LHcf1n9LO2oceGk/id6RL9v0g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-wasm32-wasi": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-wasm32-wasi/-/binding-wasm32-wasi-0.156.0.tgz",
      "integrity": "sha512-FWs20Zd4XCqpVwiTgKhyXWplIliulfwJMCI+POY2z1YF9IFr91qDLa7Jfqu0f1i95GFOy0GUGx8s6C4EtfFM3g==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "2.0.0-alpha.6",
        "@emnapi/runtime": "2.0.0-alpha.6",
        "@napi-rs/wasm-runtime": "~1.2.6"
      },
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=23.5.0"
      }
    },
    "node_modules/@oxc-parser/binding-wasm32-wasi/node_modules/@emnapi/core": {
      "version": "2.0.0-alpha.6",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-2.0.0-alpha.6.tgz",
      "integrity": "sha512-MNVvMV7WtEJMgqaWJMvCyupK7Oi8sZctUIgPRZTsiS3cVvefk8DXPflOU3MSBddtj/rrYHygpYgpHDgwXnI3+w==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/wasi-threads": "2.2.0",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@oxc-parser/binding-wasm32-wasi/node_modules/@emnapi/runtime": {
      "version": "2.0.0-alpha.6",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-2.0.0-alpha.6.tgz",
      "integrity": "sha512-5ZR49ZsZ3cLvu5lkrVj6CMpHRgZjYz7XSlqK23GYYpyEqp749RVuIH0bEUKaGNghMh2pXRhIC3cnVrH28Y1j1Q==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@oxc-parser/binding-wasm32-wasi/node_modules/@emnapi/wasi-threads": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-2.2.0.tgz",
      "integrity": "sha512-JP7OYH38Q7+pyTAe14raZHLQIK7BDKbdwji+Xi3pcd/6QkJYQH3SX4wu6EplGrGJWRepoNzedfm0G3B9Z4e9Rw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@oxc-parser/binding-win32-arm64-msvc": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-win32-arm64-msvc/-/binding-win32-arm64-msvc-0.156.0.tgz",
      "integrity": "sha512-l21Tz6tjraGBC3JefVeJZ9pojD0fCiB62PydAv+i9nrqJX7z/pDmyDNYLamDr/PRcQ4UQbFwkSnz7NKBB9UMLw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-win32-ia32-msvc": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-win32-ia32-msvc/-/binding-win32-ia32-msvc-0.156.0.tgz",
      "integrity": "sha512-CUq0ZFl/RODqPiIgfNNSamkpTj5x8AjBTkR/y1DNVIQiTGnmWqjHcn3o08ZW3q/LgkI4g9G9g6UirmmQFvuOZw==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-parser/binding-win32-x64-msvc": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-parser/binding-win32-x64-msvc/-/binding-win32-x64-msvc-0.156.0.tgz",
      "integrity": "sha512-dcpx5Y1x2v/cs7U/q3SZMvmxfyXjVvqC86jMuw2ZZUbHDd7W2cW7uSMQfg3GLVaE68Su3H9xd/Pc4v6QNyeSRg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@oxc-project/types": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/@oxc-project/types/-/types-0.156.0.tgz",
      "integrity": "sha512-1Duyg48TdJNdyhEB8Xn1L36bT9Pv6GUtlKjHxOys8xkaF/rQq3XJE+bAurSK/AgIz5mGFsb77cn9Pb20+WCScw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/oxc-project"
      }
    },
    "node_modules/@parcel/watcher": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher/-/watcher-2.6.0.tgz",
      "integrity": "sha512-7FNeNl8NCE7aINx7WXiKQrPYZWC/hvrTsmk6zmxbI7LTXE7hVek/n8AfVgpe2y82zl3w0HvCHN0bVKMBoJcC0w==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "detect-libc": "^2.0.3",
        "is-glob": "^4.0.3",
        "node-addon-api": "^7.0.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "@parcel/watcher-android-arm64": "2.6.0",
        "@parcel/watcher-darwin-arm64": "2.6.0",
        "@parcel/watcher-darwin-x64": "2.6.0",
        "@parcel/watcher-freebsd-x64": "2.6.0",
        "@parcel/watcher-linux-arm-glibc": "2.6.0",
        "@parcel/watcher-linux-arm-musl": "2.6.0",
        "@parcel/watcher-linux-arm64-glibc": "2.6.0",
        "@parcel/watcher-linux-arm64-musl": "2.6.0",
        "@parcel/watcher-linux-x64-glibc": "2.6.0",
        "@parcel/watcher-linux-x64-musl": "2.6.0",
        "@parcel/watcher-win32-arm64": "2.6.0",
        "@parcel/watcher-win32-x64": "2.6.0"
      }
    },
    "node_modules/@parcel/watcher-android-arm64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-android-arm64/-/watcher-android-arm64-2.6.0.tgz",
      "integrity": "sha512-trgpLSCKRC/huFjXX/Smh+0sWe4+YtKfktIToiMl59ghz7z+qkH6kMvNnUbLyRs9N11t8l4svSCs1+5B3rOAhA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-darwin-arm64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-darwin-arm64/-/watcher-darwin-arm64-2.6.0.tgz",
      "integrity": "sha512-Y3QV0gl7Q1zbfueunkWIERICbEojQFCgpyG7YqOGNFLsckXyI1xu9mAIUpKY9QBYzBtSkN8dBPwd3yiAO9ovMw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-darwin-x64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-darwin-x64/-/watcher-darwin-x64-2.6.0.tgz",
      "integrity": "sha512-Ohv6OpzhUfKYD7Beb8kDvG0jbIxORCYY1JRdZnaBtnjjkJxgD7ZVL0nw2sCYd0yTMKTvz3nnTnOF3cDifK+kvw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-freebsd-x64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-freebsd-x64/-/watcher-freebsd-x64-2.6.0.tgz",
      "integrity": "sha512-5HmXvDgs8VK+74jF9y9/2FE3/OnlcKmc56tjmSrEuZjpSZOGL+fvAu+HKJBdPs9uwoP2hE6TlSUpXZ/C5jUFmQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-arm-glibc": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-arm-glibc/-/watcher-linux-arm-glibc-2.6.0.tgz",
      "integrity": "sha512-Ps/hui3A+vMbjdqlqAowK2ZL8+BO8dBjxeWXj6npTBs3jx4wWmbPpaLuqwrQrSqIVMCnpWo238bJ1U37GhQOYg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-arm-musl": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-arm-musl/-/watcher-linux-arm-musl-2.6.0.tgz",
      "integrity": "sha512-9c6AUHgHoG+IY88MRIHupztQiQnrbqHYQjkM2btA+Bf/wQnQMuiD0Wfk1EVv3TlNT3x41uU71rn6E4xh/+zvkw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-arm64-glibc": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-arm64-glibc/-/watcher-linux-arm64-glibc-2.6.0.tgz",
      "integrity": "sha512-yHRqS2owEXe6Hic9z6Mh1ECsCd+ODVOGvZDyciqRd21+v+o+DnXMOrw50DSpIG2sb8GPEaPPmfeCAWKPJdq46g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-arm64-musl": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-arm64-musl/-/watcher-linux-arm64-musl-2.6.0.tgz",
      "integrity": "sha512-WhB2e/V7rqdHHWZusBSPuy5Ei8S6lSz6FE5TKKQz5h3a0O+C+mhY7vxU9b/stqvMb8beLnPY82ZrFTLKs+SrKA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-x64-glibc": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-x64-glibc/-/watcher-linux-x64-glibc-2.6.0.tgz",
      "integrity": "sha512-ulGE6x6Oz6iAwg75T8YQSoguBWasniIbX+QWpaYPcCnDOpdWX3k+4xbEYPZVLxOuoJI+svJJPD3sEj8G7lrQ3A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-linux-x64-musl": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-linux-x64-musl/-/watcher-linux-x64-musl-2.6.0.tgz",
      "integrity": "sha512-tkBYKt7YQrjIJWYDnto2YgO8MRkjlMTSNoRHzsXinBqbLdeOM3L32wPZJvIZxqaLMfSlS/4sUjH/6STVP/XDLw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-win32-arm64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-win32-arm64/-/watcher-win32-arm64-2.6.0.tgz",
      "integrity": "sha512-gIZAP23jaHjGWasY/TY6yL7NHFClf0Ga7FN+iINvk+KN94rhm94lYZhFsbYFNcA04/onvGD9kKmiJLJB2HbNwQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@parcel/watcher-win32-x64": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/@parcel/watcher-win32-x64/-/watcher-win32-x64-2.6.0.tgz",
      "integrity": "sha512-cA+/pXV2YkfxlIcXOQ5fSWqAzzPyD78/x5qbK/I0vUkrlYHA8TIz+MXjAbGouguKVSI4bOmkTSJ1/poVSsgt+A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@rolldown/binding-android-arm-eabi": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm-eabi/-/binding-android-arm-eabi-1.2.16.tgz",
      "integrity": "sha512-ia3DwAs0OsMGS7+IConptSiyk9pEXkOx/AbJ2n/lAGxH3QkWQus1t8d7gnAT38FCU2sQu8lUbeR6AiZFv4JxaA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-android-arm64": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm64/-/binding-android-arm64-1.2.16.tgz",
      "integrity": "sha512-kx5wBiMB6E7TEvpl2B9gjLU004BkvEm2Dr941BFjx/SontPwSzNuQUIoVKxHHoSjpFIfHMmcguyLOtyn0hObRg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-arm64": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-arm64/-/binding-darwin-arm64-1.2.16.tgz",
      "integrity": "sha512-qslZrXnKJU4cUpjoAmtAo/KQM9e2IRMlmpig6Zpwj+8KWxW8v+nkAf9216Bsek9lOC1jvg2yCjygCFo2f83msQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-x64": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-x64/-/binding-darwin-x64-1.2.16.tgz",
      "integrity": "sha512-FdF+y48ND13eAyM2mQn+85kvAqNlvRWROy2rhgA463X/0Gv4vGtazZtfaF1mRBLscYvtOlh4QnLjOWiFzX69OQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-freebsd-x64": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-freebsd-x64/-/binding-freebsd-x64-1.2.16.tgz",
      "integrity": "sha512-ddjqFM5e95AgLbUPtKIS7V1KTVlA0RUgCVr5mn+/IEhsdy3pr+Vuj/HZ7nlMN2FyxIwUktOH1LEPIQXO1v9y1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm-gnueabihf": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm-gnueabihf/-/binding-linux-arm-gnueabihf-1.2.16.tgz",
      "integrity": "sha512-tHdKWbFkFBI687iim3LIyIvyL7j66VvQYkDPss5Stn/qyE2tWkR1YD0dXmXPFKKqT/o5ZEJVsaRsWS2meQwGOA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-gnu": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-gnu/-/binding-linux-arm64-gnu-1.2.16.tgz",
      "integrity": "sha512-FJiLGAblPBMlBEdbOqw6kW6QcXDWAf/oJu7gYs9ZJZwmg+K+/zjFLxPTIY9izJUzxzc24FHvmseyA0IvJSl17w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-musl": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-musl/-/binding-linux-arm64-musl-1.2.16.tgz",
      "integrity": "sha512-hrJpblMsrQ58U9veWpbXzkhV5zStunds6HWLprqq1qauvgBr1E6P+24kLj6lSLI9vjRn/RYpjprhkHQPKGWpNg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-ppc64-gnu": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-ppc64-gnu/-/binding-linux-ppc64-gnu-1.2.16.tgz",
      "integrity": "sha512-qJd/dC6j6CwLG9/s/RP2nb1RZ0GIgj7Ioj7x/SYa3RzjVrlzrmH0fhIOpfvqQDeIsdP0loi+kHaMhJzY1PBIaA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-s390x-gnu": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-s390x-gnu/-/binding-linux-s390x-gnu-1.2.16.tgz",
      "integrity": "sha512-Vx7Xg5uUJuNcujJjI70OICaH0EYj80BtOLZTSN7uOYg8QOLlyKnaG0IW7Fn/J0IpJsaKzmDKMhOQv1JBM9m9vg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-gnu": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-gnu/-/binding-linux-x64-gnu-1.2.16.tgz",
      "integrity": "sha512-TNKhgE3uJTsTzatUSSYt0Kgo+Oa2uSlSjz4r1aEIea7HX6ULBym4fAlYUhG1i6pjNf2njfCUAfKwr6C3E9Xg1w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-musl": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.2.16.tgz",
      "integrity": "sha512-7chXdpjXZ8qG0+mIxECN3cT9kvhZ3/oZhMX6Pp876P7CDrIy8nJswva6Mq357JR7eYXfuskwZxMeV1SzoZdHrA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-openharmony-arm64": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-openharmony-arm64/-/binding-openharmony-arm64-1.2.16.tgz",
      "integrity": "sha512-Kwjt+7uNTJK5/MDkGWGVO2KQPnj8yAV75dMpfwyHZrJSXWHrniOB0aUEWlVYf3H1hOqFLIStLdM5QXq6bnKmOQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-arm64-msvc": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-arm64-msvc/-/binding-win32-arm64-msvc-1.2.16.tgz",
      "integrity": "sha512-/LH6WfjDRXXJz/p5xl4TmU+jpcnwcxbKEQBW/GZE0JHfN0lGIyTtsUEGaQ/q/GikkGJ2yLKe6pwm7AnEWO8pdw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-x64-msvc": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-x64-msvc/-/binding-win32-x64-msvc-1.2.16.tgz",
      "integrity": "sha512-1lv1KvX0Z871zfk7vw+dnXMMnHNyDwMzWG8Kv3HxDXMOhzCX4SHc7HK319fInP0i+0p9D8brkfzL7pJOaGl+tw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.1.1.tgz",
      "integrity": "sha512-glFIJDvLNDtJhT9qrMFWLPbvS+skxgt4L0K8Ei2YtnhPysAJnsI7nyxSJxKj4ADeKX0OLjC4ntRkwpLOoS3rwA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@schematics/angular": {
      "version": "22.2.6",
      "resolved": "https://registry.npmjs.org/@schematics/angular/-/angular-22.2.6.tgz",
      "integrity": "sha512-3cxjqMvarqAexIwes4VLAIbJawlkiuc/o/THS1Ol/4RsRZzpjcM+lxcEqer8SnAK6M+rxw3S/0sPjfCSl29zpg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@angular-devkit/core": "22.2.6",
        "@angular-devkit/schematics": "22.2.6",
        "jsonc-parser": "3.3.1",
        "oxc-parser": "0.156.0",
        "typescript": "6.0.3"
      },
      "engines": {
        "node": "^22.22.3 || ^24.15.0 || >=26.0.0",
        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
        "yarn": ">= 1.13.0"
      }
    },
    "node_modules/@searchstax-inc/searchstudio-ux-angular": {
      "version": "4.2.70",
      "resolved": "https://registry.npmjs.org/@searchstax-inc/searchstudio-ux-angular/-/searchstudio-ux-angular-4.2.70.tgz",
      "integrity": "sha512-qBM9pqogmtAXMZ+2LYjcvQlwrCadgRKZ17yauzDPWvdQyX87GYW78b2bqxBmH+GngwqA1v7KsOqoo2szZP8PaA==",
      "dependencies": {
        "@searchstax-inc/searchstudio-ux-js": "npm:@searchstax-inc/searchstudio-ux-js@^4.2.70",
        "tslib": "^2.3.0"
      },
      "peerDependencies": {
        "@angular/common": ">=17 <23",
        "@angular/core": ">=17 <23"
      }
    },
    "node_modules/@searchstax-inc/searchstudio-ux-js": {
      "version": "4.2.70",
      "resolved": "https://registry.npmjs.org/@searchstax-inc/searchstudio-ux-js/-/searchstudio-ux-js-4.2.70.tgz",
      "integrity": "sha512-cpYSZmEuhNUgsDSKMx0dk4Gp1MbAImrEcSYbKzC50n97SNQLvrhCEqFlBPta2mz6ELzG9hqPQ0gGsyCcyvq7mQ==",
      "dependencies": {
        "dompurify": "^3.2.5",
        "eventsource": "^3.0.5",
        "marked": "^15.0.11",
        "mustache": "^4.2.0",
        "terser": "^5.44.0"
      },
      "engines": {
        "node": ">=20.19.0"
      }
    },
    "node_modules/@standard-schema/spec": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@standard-schema/spec/-/spec-1.1.0.tgz",
      "integrity": "sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w==",
      "license": "MIT"
    },
    "node_modules/@tybys/wasm-util": {
      "version": "0.10.5",
      "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.5.tgz",
      "integrity": "sha512-dOGOPxlaNV+G046mZzN+9C0dAcQZeSKcXiVaM0TYy/LM4ttTmgSBDxYfovcYI8Em3+eAbiAYpvWLOv8+ZVRJKA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/gensync": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/@types/gensync/-/gensync-1.0.5.tgz",
      "integrity": "sha512-MbsRCT7mTikHwKZ0X+LVUTLRrZZRLipTuXEO9qOYO+zmjMVk81axyClMROf6uoPD9MRVu46bx8zoR0Ad9q3NAg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/jsesc": {
      "version": "2.5.1",
      "resolved": "https://registry.npmjs.org/@types/jsesc/-/jsesc-2.5.1.tgz",
      "integrity": "sha512-9VN+6yxLOPLOav+7PwjZbxiID2bVaeq0ED4qSQmdQTdjnXJSaCVKTR58t15oqH1H5t8Ng2ZX1SabJVoN9Q34bw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/trusted-types": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/@types/trusted-types/-/trusted-types-2.0.7.tgz",
      "integrity": "sha512-ScaPdn1dQczgbl0QFTeTOmVHFULt394XJgOQNoyVhZ6r2vLnMLJfBPd53SB52T/3G36VI1/g2MZaX0cwDuXsfw==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/@vitejs/plugin-basic-ssl": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/@vitejs/plugin-basic-ssl/-/plugin-basic-ssl-2.3.0.tgz",
      "integrity": "sha512-bdyo8rB3NnQbikdMpHaML9Z1OZPBu6fFOBo+OtxsBlvMJtysWskmBcnbIDhUqgC8tcxNv/a+BcV5U+2nQMm1OQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.0.0 || ^20.0.0 || >=22.0.0"
      },
      "peerDependencies": {
        "vite": "^6.0.0 || ^7.0.0 || ^8.0.0"
      }
    },
    "node_modules/acorn": {
      "version": "8.19.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.19.0.tgz",
      "integrity": "sha512-oJlA3XiRm7Cyk6qFD2Jn8ak9B7jSy0qy00ADO3+8dpT0LSjFihQYv4C02LFCSYJV3Q37xYwwRy5m+IpIiUzqWw==",
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/agent-base": {
      "version": "9.0.0",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-9.0.0.tgz",
      "integrity": "sha512-TQf59BsZnytt8GdJKLPfUZ54g/iaUL2OWDSFCCvMOhsHduDQxO8xC4PNeyIkVcA5KwL2phPSv0douC0fgWzmnA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/ajv": {
      "version": "8.20.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-8.20.0.tgz",
      "integrity": "sha512-Thbli+OlOj+iMPYFBVBfJ3OmCAnaSyNn4M1vz9T6Gka5Jt9ba/HIR56joy65tY6kx/FCF5VXNB819Y7/GUrBGA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.3",
        "fast-uri": "^3.0.1",
        "json-schema-traverse": "^1.0.0",
        "require-from-string": "^2.0.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ajv-formats": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/ajv-formats/-/ajv-formats-3.0.1.tgz",
      "integrity": "sha512-8iUql50EUR+uUcdRQ3HDqa6EVyo3docL8g5WJ3FNcWmu62IbkGUue/pEyLBW8VGKKucTPgqeks4fIU1DA4yowQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependenciesMeta": {
        "ajv": {
          "optional": true
        }
      }
    },
    "node_modules/ansi-escapes": {
      "version": "7.3.0",
      "resolved": "https://registry.npmjs.org/ansi-escapes/-/ansi-escapes-7.3.0.tgz",
      "integrity": "sha512-BvU8nYgGQBxcmMuEeUEmNTvrMVjJNSH7RgW24vXexN4Ven6qCvy4TntnvlnwnMLTVlcRQQdbRY8NKnaIoeWDNg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "environment": "^1.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ansi-regex": {
      "version": "6.6.0",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-6.6.0.tgz",
      "integrity": "sha512-XZ5apbzreCbXSKwPjJstu8R0zOi247w3XYwWxtwBXgpZrCyc1Ka7p9/xY0A9/diMewmHbEKz+FIraWaEWjlN5g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-regex?sponsor=1"
      }
    },
    "node_modules/ansi-styles": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-7.0.0.tgz",
      "integrity": "sha512-kKvt3m4uwzqL0wlkPd09CmljPJGOZZ4D0fP65sqFSvPkMRKhNi+74MgIJ5QxE6SxqB4t4KyUFGg8+n5zjo6hew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=22"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.11.38",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.11.38.tgz",
      "integrity": "sha512-rMgy5YW7x28SMfXHLlVZDBqlWzYZ0x2rVR/6FWrNBF0chjigARK1H6nM0hKA1Um3kPOlkQFVtjJs00d2N1ezuw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/beasties": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/beasties/-/beasties-0.5.4.tgz",
      "integrity": "sha512-8/lOOjT+PElYCnaUbmhgd3Uad5R1VTQ4Wg0k4rK8bX04m5WEqHNmnlLy3Q/lJ7dk25XA+72gayzc/skTfKKpcA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "css-select": "^7.0.0",
        "css-what": "^8.0.0",
        "dom-serializer": "^3.0.0",
        "domhandler": "^6.0.0",
        "htmlparser2": "^12.0.0",
        "picocolors": "^1.1.1",
        "postcss": "^8.4.49",
        "postcss-media-query-parser": "^0.2.3",
        "postcss-safe-parser": "^7.0.1"
      },
      "engines": {
        "node": ">=20.19.0"
      }
    },
    "node_modules/boolbase": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/boolbase/-/boolbase-2.0.0.tgz",
      "integrity": "sha512-DkVaaQHymRhpYEYo9x1oo7Q7B0Y6KJUsjm3c9eTyFDby4MHLBTwZ6ZDWBel5zrYxj1WsZgC5oLpiz+93MluXeA==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/browserslist": {
      "version": "4.29.6",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.29.6.tgz",
      "integrity": "sha512-CmVVIQ3RVc5HxYEc9X84GvxK/C8C1wH8TlKAiO7uTxF8PDwt7r8t9Qk3J9NkMOVzX5O/HbLv3yzxZg9HPrnI9w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "baseline-browser-mapping": "^2.11.37",
        "caniuse-lite": "^1.0.30001826",
        "electron-to-chromium": "^1.5.486",
        "node-releases": "^2.0.64",
        "update-browserslist-db": "^1.4.0"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/buffer-from": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",
      "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",
      "license": "MIT"
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001826",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001826.tgz",
      "integrity": "sha512-wTB+9tIbLro/BCXwLuNV1meHE4L9dS6dArMDwgYfNBPMYScqClHyGunhkCSDtHhe/69Xl0sHlKgBVZ+fNsYtWA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chalk": {
      "version": "5.6.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-5.6.2.tgz",
      "integrity": "sha512-7NzBL0rN6fMUW+f7A6Io4h40qQlG+xGmtMxfbnH/K7TAtt8JQWVQK+6g0UXKMeVJoyV5EkkNsErQ8pVD3bLHbA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^12.17.0 || ^14.13 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/chardet": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/chardet/-/chardet-2.2.0.tgz",
      "integrity": "sha512-rddelWYNPRrXq6PtNEN2S3f6t9ILzvqaN5pVgi4kqt9jHQaXIial9PznB5iSPVlQSLNaaH22ItWz3EJtQ10+OA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/chokidar": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-5.0.0.tgz",
      "integrity": "sha512-TQMmc3w+5AxjpL8iIiwebF73dRDF4fBIieAqGn9RGCWaEVwQ6Fb2cGe31Yns0RRIzii5goJ1Y7xbMwo1TxMplw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "readdirp": "^5.0.0"
      },
      "engines": {
        "node": ">= 20.19.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      }
    },
    "node_modules/cli-cursor": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-5.0.0.tgz",
      "integrity": "sha512-aCj4O5wKyszjMmDT4tZj93kxyydN/K5zPWSCe6/0AV/AA1pqe5ZBIw0a2ZfPQV7lL5/yb5HsUreJ6UFAF1tEQw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "restore-cursor": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-spinners": {
      "version": "3.4.0",
      "resolved": "https://registry.npmjs.org/cli-spinners/-/cli-spinners-3.4.0.tgz",
      "integrity": "sha512-bXfOC4QcT1tKXGorxL3wbJm6XJPDqEnij2gQ2m7ESQuE+/z9YFIWnl/5RpTiKWbMq3EVKR4fRLJGn6DVfu0mpw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-truncate": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/cli-truncate/-/cli-truncate-6.2.0.tgz",
      "integrity": "sha512-5uyZew3nYoDgyltqSI8OER6DuyecorYOSVDAXl9wQ9Y8Re/HaQ/5qP0HmTUOUQqmvtpB+mlsf1gG/FUS3U1gLQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "slice-ansi": "^10.0.0",
        "string-width": "^8.3.0"
      },
      "engines": {
        "node": ">=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-width": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/cli-width/-/cli-width-4.1.0.tgz",
      "integrity": "sha512-ouuZd4/dm2Sw5Gmqy6bGyNNNe1qt9RpmxveLSO7KcgsTnU7RXfsw+/bukWGo1abgBiMAic068rclZsO4IWmmxQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/cliui": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-9.0.1.tgz",
      "integrity": "sha512-k7ndgKhwoQveBL+/1tqGJYNz097I7WOvwbmmU2AR5+magtbjPWQTS1C5vzGkBC8Ym8UWRzfKUzUUqFLypY4Q+w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "string-width": "^7.2.0",
        "strip-ansi": "^7.1.0",
        "wrap-ansi": "^9.0.0"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/cliui/node_modules/ansi-styles": {
      "version": "6.2.3",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-6.2.3.tgz",
      "integrity": "sha512-4Dj6M28JB+oAH8kFkTLUo+a2jwOFkuqb3yucU0CANcRRUbxS0cP0nZYCGjcc3BNXwRIsUVmDGgzawme7zvJHvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/cliui/node_modules/string-width": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-7.2.0.tgz",
      "integrity": "sha512-tsaTIkKW9b4N+AEj+SVA+WhJzV7/zMhcSu78mLKWSk7cXMOSHsBKFWUs0fWwq8QyK3MgJBQRX6Gbi4kYbdvGkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^10.3.0",
        "get-east-asian-width": "^1.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cliui/node_modules/wrap-ansi": {
      "version": "9.0.2",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-9.0.2.tgz",
      "integrity": "sha512-42AtmgqjV+X1VpdOfyTGOYRi0/zsoLqtXQckTmqTeybT+BDIbM/Guxo7x3pE2vtpr1ok6xRqM9OpBe+Jyoqyww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.2.1",
        "string-width": "^7.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/colorjs.io": {
      "version": "0.7.1",
      "resolved": "https://registry.npmjs.org/colorjs.io/-/colorjs.io-0.7.1.tgz",
      "integrity": "sha512-LY7OHnJZxHwT5UlzNa9bbhHHDbzB6yE5+3MIPwJEQKRvSCt/T4G7epsj+9j2BExUIIfXFIJGsIXUKdfrK9Q5tA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/color"
      }
    },
    "node_modules/commander": {
      "version": "2.20.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz",
      "integrity": "sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==",
      "license": "MIT"
    },
    "node_modules/convert-source-map": {
      "version": "1.9.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-1.9.0.tgz",
      "integrity": "sha512-ASFBup0Mz1uyiIjANan1jzLQami9z1PoYSZCiiYW2FczPbenXc45FZdBZLzOT+r6+iciuEModtmCti+hjaAk0A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/css-select": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/css-select/-/css-select-7.0.0.tgz",
      "integrity": "sha512-snmjEVXy+1LnwXdxhYvTMj1d9tOh4HxkA1YmoayVBeeyR2C14Pum7fcxJIm4SswYspVy866eYNwlH6xC3/VH5g==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "boolbase": "^2.0.0",
        "css-what": "^8.0.0",
        "domhandler": "^6.0.1",
        "domutils": "^4.0.2",
        "nth-check": "^3.0.1"
      },
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/css-what": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/css-what/-/css-what-8.0.0.tgz",
      "integrity": "sha512-DH0Bqq3DNp5tdOReuNyAA+Ev4Y2GS5FMbZpeTLP6C4CDi0h5nL0BmUPChXw3o/qbHLDWHl49sbNqQVY7bMSDdw==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/dom-serializer": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/dom-serializer/-/dom-serializer-3.1.1.tgz",
      "integrity": "sha512-4MEa38/QexBob6gFNwu+EGdWvhJ1OKuNwdYY3Y3NyeWDQfnGeDYQUDfIRzWu5B5gsv03so2Uxd28YC6zrsx3Lw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "domelementtype": "^3.0.0",
        "domhandler": "^6.0.0",
        "entities": "^8.0.0"
      },
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/cheeriojs/dom-serializer?sponsor=1"
      }
    },
    "node_modules/domelementtype": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/domelementtype/-/domelementtype-3.0.0.tgz",
      "integrity": "sha512-umCQid3jKbDmVjx8jGaW7uUykm4DEUeyV21hPxNMo2nV955DhUThwqyOIDtreepP31hl84X7G5U9ZfsWvIB3Pg==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fb55"
        }
      ],
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=20.19.0"
      }
    },
    "node_modules/domhandler": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/domhandler/-/domhandler-6.0.1.tgz",
      "integrity": "sha512-gYzvtM72ZtxQO0T048kd6HWSbbGCNOUwcnfQ01cqIJ4X2IYKFFHZ5mKvrQETcFXxsRObZulDaKmy//R7TPtsBg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "domelementtype": "^3.0.0"
      },
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/fb55/domhandler?sponsor=1"
      }
    },
    "node_modules/dompurify": {
      "version": "3.4.18",
      "resolved": "https://registry.npmjs.org/dompurify/-/dompurify-3.4.18.tgz",
      "integrity": "sha512-ofe3wI/uNm68HInABYFJYqQxRw1EaKAjNdrFVKqjUY+UZurvNd2L/HuQe097s/4RivWiZyP6tT7aoT8atjfhwg==",
      "license": "(MPL-2.0 OR Apache-2.0)",
      "optionalDependencies": {
        "@types/trusted-types": "^2.0.7"
      }
    },
    "node_modules/domutils": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/domutils/-/domutils-4.0.2.tgz",
      "integrity": "sha512-qI4JLRKnSzqFqr7hAlS5xQDusBCjKSEG4t4+7aNrIQMHBcsC2TGEhuyABJdYkgSewL57PNLYEiibY2iPKhKpaA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "dom-serializer": "^3.0.0",
        "domelementtype": "^3.0.0",
        "domhandler": "^6.0.0"
      },
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/fb55/domutils?sponsor=1"
      }
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.489",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.489.tgz",
      "integrity": "sha512-1cF87WItryk9lj5wg5SLsNegUihdkcHuOfrANPpO02y/d2krm1Oc3GjA9KBwlT5o145FTa1bbjdLc7pZnvtnYQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/emoji-regex": {
      "version": "10.6.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-10.6.0.tgz",
      "integrity": "sha512-toUI84YS5YmxW219erniWD0CIVOo46xGKColeNQRgOzDorgBi1v4D71/OFzgD9GO2UGKIv1C3Sp8DAn0+j5w7A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/empathic": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/empathic/-/empathic-2.1.0.tgz",
      "integrity": "sha512-AnfC1ATldl49/cvZdLPDjBfrRNwbDO05aibiOtzQu3qtlbJtomNLhF30HEtn/7iBz50dlMECqATo3fG0LrdEgw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/entities": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/entities/-/entities-8.1.0.tgz",
      "integrity": "sha512-kxL7msIffSuh9aaFAMD7rxAIuTRMAHMeBtgHW2yUdWw732ZNh4MehkF2gdjvtdmikkaIP9bFDDJOPlsvm7avrA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/environment": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/environment/-/environment-1.1.0.tgz",
      "integrity": "sha512-xUtoPkMggbz0MPyPiIWr1Kp4aeWJjDZ6SMvURhimjdZgsRuDplF5/s9hcgGhyXMhs+6vpnuoiZ2kFiu3FMnS8Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/eventsource": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/eventsource/-/eventsource-3.0.7.tgz",
      "integrity": "sha512-CRT1WTyuQoD771GW56XEZFQ/ZoSfWid1alKGDYMmkt2yl8UXrVR4pspqWNEcqKvVIzg6PAltWjxcSSPrboA4iA==",
      "license": "MIT",
      "dependencies": {
        "eventsource-parser": "^3.0.1"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/eventsource-parser": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/eventsource-parser/-/eventsource-parser-3.1.1.tgz",
      "integrity": "sha512-EKN1vKAMcZ8MlYMpaNuxN6R9yakzH6uajHcHVTqWJzvu5pWw9DyhbP35HH8MVBQ+dZjAfDxk+A8NiR9KWaXiyQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-string-truncated-width": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/fast-string-truncated-width/-/fast-string-truncated-width-3.0.3.tgz",
      "integrity": "sha512-0jjjIEL6+0jag3l2XWWizO64/aZVtpiGE3t0Zgqxv0DPuxiMjvB3M24fCyhZUO4KomJQPj3LTSUnDP3GpdwC0g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-string-width": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/fast-string-width/-/fast-string-width-3.0.2.tgz",
      "integrity": "sha512-gX8LrtNEI5hq8DVUfRQMbr5lpaS4nMIWV+7XEbXk2b8kiQIizgnlr12B4dA3ZEx3308ze0O4Q1R+cHts8kyUJg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-string-truncated-width": "^3.0.2"
      }
    },
    "node_modules/fast-uri": {
      "version": "3.1.9",
      "resolved": "https://registry.npmjs.org/fast-uri/-/fast-uri-3.1.9.tgz",
      "integrity": "sha512-hS/0Wt3Ya043oKXs0sIxrMpKQITXhMLIrVAKKXi4gozGC9v7YRWVnXIZzjNPTO02M9BdxLCWqK1yRXgNziVyJQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/fast-wrap-ansi": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/fast-wrap-ansi/-/fast-wrap-ansi-0.2.2.tgz",
      "integrity": "sha512-7F2Fl+TjRSenLqlU3UjSH0iyqopqoZIu7eZVpEirP2g1GtWa2G/ecEmBdgz31+Mxr+ELclgg6sokpSFIQiZ02Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-string-width": "^3.0.2"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/flru": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/flru/-/flru-1.0.2.tgz",
      "integrity": "sha512-kWyh8ADvHBFz6ua5xYOPnUroZTT/bwWfrCeL0Wj1dzG4/YOmOcfJ99W8dOVyyynJN35rZ9aCOtHChqQovV7yog==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/get-east-asian-width": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/get-east-asian-width/-/get-east-asian-width-1.7.0.tgz",
      "integrity": "sha512-XjH1AECxf0giL2V1aU8vKyRR2ppRUb5c0EvT7zuJTokQ74bNo52zOtghqdWIqrhUD79fo3x0WfKZdOqxF6LG1Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/hosted-git-info": {
      "version": "10.1.1",
      "resolved": "https://registry.npmjs.org/hosted-git-info/-/hosted-git-info-10.1.1.tgz",
      "integrity": "sha512-DeOnSPAvOndYKfw075gt8yZzQ7S2hNztw34zBTfhIzLhmBTswIBg5/y+pqu/VD5cYWm5goAFTusDmUEmKZ0PEQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "lru-cache": "^11.1.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      }
    },
    "node_modules/htmlparser2": {
      "version": "12.0.0",
      "resolved": "https://registry.npmjs.org/htmlparser2/-/htmlparser2-12.0.0.tgz",
      "integrity": "sha512-Tz7u1i95/g2x2jz81+x0FBVhBhY5aRTvD3tXXdFaljuNdzDLJ8UGNRrTcj2cgQvAg3iW/h77Fz15nLW0L0CrZw==",
      "dev": true,
      "funding": [
        "https://github.com/fb55/htmlparser2?sponsor=1",
        {
          "type": "github",
          "url": "https://github.com/sponsors/fb55"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "domelementtype": "^3.0.0",
        "domhandler": "^6.0.0",
        "domutils": "^4.0.2",
        "entities": "^8.0.0"
      },
      "engines": {
        "node": ">=20.19.0"
      }
    },
    "node_modules/https-proxy-agent": {
      "version": "9.1.0",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-9.1.0.tgz",
      "integrity": "sha512-ag87y7cJJ9/3+GxFr8Oy4O5faDsGRGnBGsJj/YjOSsSx/5eadKLYTMPlzuR6obgoCDDm0abAAZitXXQkMOPSpA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "agent-base": "9.0.0",
        "debug": "^4.3.4",
        "proxy-agent-negotiate": "1.1.0"
      },
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.7.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.7.3.tgz",
      "integrity": "sha512-IKXpvIzjnC9XTAUbVBcMfGS0EPaIXtW6v+zr+RRp+hqULEpo0owZax6wyRwPOJbWbzjYspQwusTsfVr0ifh4uQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/immutable": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/immutable/-/immutable-5.2.1.tgz",
      "integrity": "sha512-CgXNM1BhKqpMjFHTyqQSk09OWqzHNJ/U4BdeBgXoBdR2DdgBdOSv131cO1/YMgzopqnka3B/i949UaMLEKUxOA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/import-meta-resolve": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/import-meta-resolve/-/import-meta-resolve-4.2.0.tgz",
      "integrity": "sha512-Iqv2fzaTQN28s/FwZAoFq0ZSs/7hMAHJVX+w8PZl3cY19Pxk6jFFalxQoIfW2826i/fDLXv8IiEZRIT0lDuWcg==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-5.1.0.tgz",
      "integrity": "sha512-5XHYaSyiqADb4RnZ1Bdad6cPp8Toise4TzEjcOYDHZkTCbKgiUl7WTUCpNWHuxmDt91wnsZBc9xinNzopv3JMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "get-east-asian-width": "^1.3.1"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-interactive": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-interactive/-/is-interactive-2.0.0.tgz",
      "integrity": "sha512-qP1vozQRI+BMOPcjFzrjXuQvdak2pHNUMZoeG2eRbiSqyvbEf/wQtEOTOX1guk6E3t36RkaqiSt8A/6YElNxLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-unicode-supported": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-unicode-supported/-/is-unicode-supported-2.1.0.tgz",
      "integrity": "sha512-mE00Gnza5EEB3Ds0HfMyllZzbBrmLOX3vfWoj9A9PEnTfratQ/BcaJOuMhnkhjXvb2+FkY3VuHqtAGpTPmglFQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/js-tokens": {
      "version": "10.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-10.0.0.tgz",
      "integrity": "sha512-lM/UBzQmfJRo9ABXbPWemivdCW8V2G8FHaHdypQaIy523snUjog0W71ayWXTjiR+ixeMyVHN2XcpnTd/liPg/Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-schema-traverse": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-1.0.0.tgz",
      "integrity": "sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/jsonc-parser": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/jsonc-parser/-/jsonc-parser-3.3.1.tgz",
      "integrity": "sha512-HUgH65KyejrUFPvHFPbqOY0rsFip3Bo5wb4ngvdi1EpCYWUQDC5V+Y7mZws+DLkr4M//zQJoanu1SP+87Dv1oQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/lightningcss": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.33.0.tgz",
      "integrity": "sha512-WkUDrojuJs0xkgGf2udWxa3yGBRxPtxUkB79i6aCZLRgc7PM8fZe9TosfPDcvEpQZbuFASnHYmRLBLUbmLOIIA==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.33.0",
        "lightningcss-darwin-arm64": "1.33.0",
        "lightningcss-darwin-x64": "1.33.0",
        "lightningcss-freebsd-x64": "1.33.0",
        "lightningcss-linux-arm-gnueabihf": "1.33.0",
        "lightningcss-linux-arm64-gnu": "1.33.0",
        "lightningcss-linux-arm64-musl": "1.33.0",
        "lightningcss-linux-x64-gnu": "1.33.0",
        "lightningcss-linux-x64-musl": "1.33.0",
        "lightningcss-win32-arm64-msvc": "1.33.0",
        "lightningcss-win32-x64-msvc": "1.33.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.33.0.tgz",
      "integrity": "sha512-gEpRTalKdosp4Bb8qWtc2iOgE5SeIHlpS1up9bFq2wAyYhl1UdTObYiHe98zEM9SQvSoqQZ1IQD0JNpg3Ml5pg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.33.0.tgz",
      "integrity": "sha512-Sciaz8eenNTKn9b3t7+xr0ipTp9YxKQY4npwQ3mrRuL0BAVHBLyZxofhaKBAVtzmtRZ/zTyo0/to4B1uWG/Djg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.33.0.tgz",
      "integrity": "sha512-Z5UPAxzrjlWNNyGy6i65cJzzvgJ5D3T6wMvs+gWpY9d7qRhANrxqAp6LhxIgZhWEw18RfJTGcRxjuLIBr+m8XQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.33.0.tgz",
      "integrity": "sha512-QQM/Ti/hQajJwCY+RiWuCZ9sdtI/XQk7nDK5vC8kkdwixezOlDgvDx7+RT+QjK6FcFT4MpsuoBnHIo/O3StRRg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.33.0.tgz",
      "integrity": "sha512-N7FVBe6iS24MlM6R/4RBTxGhQheZGs7tiQ9U32UtF75NzP5Q7xWPRqLBCKxlRQRk3rY1jCIPLzx7WzOhuUIRLQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.33.0.tgz",
      "integrity": "sha512-j2v/itmy4HlNxlc6voKXYgBqNi0Ng2LShg4z7GufpEgs05P+2suBVyi9I6YHq5uoVFx9ETin3eCEhLVyXGQnKg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.33.0.tgz",
      "integrity": "sha512-yiO5ROMuYQgXbC60yjZU5CYSFZGKXL0HFATXt9mHJn1+zW55oCtMI9NfcVhYLMFDL7gV7oBPon/EmMMGg2OvtQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.33.0.tgz",
      "integrity": "sha512-ar+Ju7LmcN0Jo4FpL4hpFybwNG9/3A/Br5KW2n2jyODg3MEZXaDYADdemoNS+BDNfMgKvylJLj4S5tyRActuAg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.33.0.tgz",
      "integrity": "sha512-RYiYbkokw0trfKqqzfF55lginwEPrD3OJDfTuJzFs1MK6iFnDenaz1fqLLtX4ITG3OktJQXOeTaw1awrBAlZPw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.33.0.tgz",
      "integrity": "sha512-1K+MPfLSFVpphzpdbfkhlWk6wBrTObBzS2T6db10PNOZgR9GoVsAWzwNyuhUYYbTp23j+4RrncfujZ4uAzXvwA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.33.0.tgz",
      "integrity": "sha512-OlEICDx/Xl0FqSp4bry8zFnCvGpig3Gl4gCquvYwHuqJKEC1+n9NgDniFvqHGmMv1ZkqDJrDqKKSykTDX+ehuA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/listr2": {
      "version": "11.1.0",
      "resolved": "https://registry.npmjs.org/listr2/-/listr2-11.1.0.tgz",
      "integrity": "sha512-xsuczF6mWkEo/E80QHaEokQzKmTy7m80KcLRnkUt9wrcePres2w7dbQi5zOsWtDUg8Dac4gPFyu4EJ/IvKwTOg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cli-truncate": "^6.1.1",
        "log-update": "^8.0.0",
        "wrap-ansi": "^10.0.1"
      },
      "engines": {
        "node": ">=22.13.0"
      }
    },
    "node_modules/lmdb": {
      "version": "3.5.6",
      "resolved": "https://registry.npmjs.org/lmdb/-/lmdb-3.5.6.tgz",
      "integrity": "sha512-j3uE8ReKNyUWDjhfEFSJqE/1DLtfTR5Z8yFzVHvBjAk37wNg7HdScjcv8ttPHRvrdgPQMPWxFFI0SsdBzI5lBw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@harperfast/extended-iterable": "^1.0.3",
        "msgpackr": "^1.11.2",
        "node-addon-api": "^6.1.0",
        "node-gyp-build-optional-packages": "5.2.2",
        "ordered-binary": "^1.5.3",
        "weak-lru-cache": "^1.2.2"
      },
      "bin": {
        "download-lmdb-prebuilds": "bin/download-prebuilds.js"
      },
      "optionalDependencies": {
        "@lmdb/lmdb-darwin-arm64": "3.5.6",
        "@lmdb/lmdb-darwin-x64": "3.5.6",
        "@lmdb/lmdb-linux-arm": "3.5.6",
        "@lmdb/lmdb-linux-arm64": "3.5.6",
        "@lmdb/lmdb-linux-x64": "3.5.6",
        "@lmdb/lmdb-win32-arm64": "3.5.6",
        "@lmdb/lmdb-win32-x64": "3.5.6"
      }
    },
    "node_modules/lmdb/node_modules/node-addon-api": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-6.1.0.tgz",
      "integrity": "sha512-+eawOlIgy680F0kBzPUNFhMZGtJ1YmqM6l4+Crf4IkImjYrO/mqPwRMh352g23uIaQKFItcQ64I7KMaJxHgAVA==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/log-symbols": {
      "version": "7.0.1",
      "resolved": "https://registry.npmjs.org/log-symbols/-/log-symbols-7.0.1.tgz",
      "integrity": "sha512-ja1E3yCr9i/0hmBVaM0bfwDjnGy8I/s6PP4DFp+yP+a+mrHO4Rm7DtmnqROTUkHIkqffC84YY7AeqX6oFk0WFg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-unicode-supported": "^2.0.0",
        "yoctocolors": "^2.1.1"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/log-update": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/log-update/-/log-update-8.0.0.tgz",
      "integrity": "sha512-lddSgOt3bPASrylL54ZSpy8nBHns+vBVSoILlVOx+dei300pnLRN958rj/EdlVLKuWlSESU3qdnDZdAI7FXYGg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-escapes": "^7.3.0",
        "cli-cursor": "^5.0.0",
        "slice-ansi": "^9.0.0",
        "string-width": "^8.2.0",
        "strip-ansi": "^7.2.0",
        "wrap-ansi": "^10.0.0"
      },
      "engines": {
        "node": ">=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/log-update/node_modules/ansi-styles": {
      "version": "6.2.3",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-6.2.3.tgz",
      "integrity": "sha512-4Dj6M28JB+oAH8kFkTLUo+a2jwOFkuqb3yucU0CANcRRUbxS0cP0nZYCGjcc3BNXwRIsUVmDGgzawme7zvJHvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/log-update/node_modules/slice-ansi": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/slice-ansi/-/slice-ansi-9.0.1.tgz",
      "integrity": "sha512-aBY19bn/XA+hKOKX0qL7Z0UfdBsbQvc9hn993U8ALUjzxCvDcuZqLoRXjGJrUARWAlwMnsRVD9sw2AFNOYvalA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.2.3",
        "is-fullwidth-code-point": "^5.1.0"
      },
      "engines": {
        "node": ">=22"
      },
      "funding": {
        "url": "https://github.com/chalk/slice-ansi?sponsor=1"
      }
    },
    "node_modules/lru-cache": {
      "version": "11.5.3",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.5.3.tgz",
      "integrity": "sha512-U4N8FgzmWxc8k1VH8Kr6lQg18U7Fjvby6wXHVRX/ZZ7IwWbRMgrRbP0Wrb5q5NVinryp4SQampHKdvtecItxUg==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/magic-string": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-1.4.1.tgz",
      "integrity": "sha512-8lyCu36ErXR0J9uaGKlKQoiLZKmtI63YGLE8G2o9jyRPdr4X47LusSOwgOJOzcVtp81fTAAjxR7BwKz682Jhow==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.6.0"
      }
    },
    "node_modules/marked": {
      "version": "15.0.12",
      "resolved": "https://registry.npmjs.org/marked/-/marked-15.0.12.tgz",
      "integrity": "sha512-8dD6FusOQSrpv9Z1rdNMdlSgQOIP880DHqnohobOmYLElGEqAL/JvxvuxZO16r4HtjTlfPRDC1hbvxC9dPN2nA==",
      "license": "MIT",
      "bin": {
        "marked": "bin/marked.js"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/mimic-function": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/mimic-function/-/mimic-function-5.0.1.tgz",
      "integrity": "sha512-VP79XUPxV2CigYP3jWwAUFSku2aKqBH7uTAapFWCBqutsbmDo96KY5o8uh6U+/YSIn5OxJnXp73beVkpqMIGhA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mrmime": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/mrmime/-/mrmime-2.0.1.tgz",
      "integrity": "sha512-Y3wQdFg2Va6etvQ5I82yUhGdsKrcYox6p7FfL1LbK2J4V01F9TGlepTIhnK24t7koZibmg82KGglhA1XK5IsLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/msgpackr": {
      "version": "1.12.1",
      "resolved": "https://registry.npmjs.org/msgpackr/-/msgpackr-1.12.1.tgz",
      "integrity": "sha512-4EUH9tQHnMmEgzW/MdAP0KIfa1T9AF+htl0ffe2n5vb2EKn9y2co8ccpgWko6S52Jy1PQZKwRnx5/KkYjtd9MQ==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "optionalDependencies": {
        "msgpackr-extract": "^3.0.2"
      }
    },
    "node_modules/msgpackr-extract": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/msgpackr-extract/-/msgpackr-extract-3.0.7.tgz",
      "integrity": "sha512-/dOQboWnkR1cjm88XyH/cGSivECGgyQu3814+bNUAq5wACQC8Ya/CViB9WApvWJ5Hya/JJQQmUeBFOZj8MLjGA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "node-gyp-build-optional-packages": "5.2.2"
      },
      "bin": {
        "download-msgpackr-prebuilds": "bin/download-prebuilds.js"
      },
      "optionalDependencies": {
        "@msgpackr-extract/msgpackr-extract-darwin-arm64": "3.0.7",
        "@msgpackr-extract/msgpackr-extract-darwin-x64": "3.0.7",
        "@msgpackr-extract/msgpackr-extract-linux-arm": "3.0.7",
        "@msgpackr-extract/msgpackr-extract-linux-arm64": "3.0.7",
        "@msgpackr-extract/msgpackr-extract-linux-x64": "3.0.7",
        "@msgpackr-extract/msgpackr-extract-win32-x64": "3.0.7"
      }
    },
    "node_modules/mustache": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/mustache/-/mustache-4.2.0.tgz",
      "integrity": "sha512-71ippSywq5Yb7/tVYyGbkBggbU8H3u5Rz56fH60jGFgr8uHwxs+aSKeqmluIVzM0m0kB7xQjKS6qPfd0b2ZoqQ==",
      "license": "MIT",
      "bin": {
        "mustache": "bin/mustache"
      }
    },
    "node_modules/mute-stream": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/mute-stream/-/mute-stream-4.0.0.tgz",
      "integrity": "sha512-gSrprq0fJ3EiOErzjdIZrjysVVmJ4uu1QWfCDss5LypA5OXvrMje5Ym5z6V6RLyJ2eF87lasX7t6a0AnFvZblg==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.20",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.20.tgz",
      "integrity": "sha512-uKdg2G3GNCKQn9byYOpxbGqrT2fGO5KRt5J/8b3pok8rT6qxGWF6hxMyJiEYtAf+FVyYuD9hRaDqX5uPFYJ4ZQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/node-addon-api": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-7.1.1.tgz",
      "integrity": "sha512-5m3bsyrjFWE1xf7nz7YXdN4udnVtXK6/Yfgn5qnahL6bCkf2yKt4k3nuTKAtT4r3IG8JNR2ncsIMdZuAzJjHQQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/node-gyp-build-optional-packages": {
      "version": "5.2.2",
      "resolved": "https://registry.npmjs.org/node-gyp-build-optional-packages/-/node-gyp-build-optional-packages-5.2.2.tgz",
      "integrity": "sha512-s+w+rBWnpTMwSFbaE0UXsRlg7hU4FjekKU4eyAih5T8nJuNZT1nNsskXpxmeqSK9UzkBl6UgRlnKc8hz8IEqOw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "detect-libc": "^2.0.1"
      },
      "bin": {
        "node-gyp-build-optional-packages": "bin.js",
        "node-gyp-build-optional-packages-optional": "optional.js",
        "node-gyp-build-optional-packages-test": "build-test.js"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.65",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.65.tgz",
      "integrity": "sha512-PfvofsGQ+MiOQIPkX9fU8ELUWmy5zL74CdQaph/ismKszfFkfwXaw0cGiwbwym2hT9k5+mdyl8O5WQ1MD8EHmA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/npm-package-arg": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/npm-package-arg/-/npm-package-arg-14.0.0.tgz",
      "integrity": "sha512-69XQh3k+dtGa1p+7RaR57IuG3rCko96xr/nUfN4yDYBXbTYICiWcOpsFKLN2GtGE9cyIljE+f1exnaYt9MvM+Q==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "hosted-git-info": "^10.1.0",
        "proc-log": "^7.0.0",
        "semver": "^7.3.5",
        "validate-npm-package-name": "^8.0.0"
      },
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      }
    },
    "node_modules/nth-check": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/nth-check/-/nth-check-3.0.1.tgz",
      "integrity": "sha512-GX0gsdbGVCgnRgbeGaubfjpBXyYRWOOCVeYh08bSQvDZqxz5ndXs1OTfAt/h36G1xvI94YIspsI0sVFqAV9+RQ==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "boolbase": "^2.0.0"
      },
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/fb55/nth-check?sponsor=1"
      }
    },
    "node_modules/obug": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/obug/-/obug-2.2.1.tgz",
      "integrity": "sha512-XrsrhT5sybtKI6wakr2SPOlGZWWYbUXZ7a0jT8/QOeAPau+1X/bSegNe5YR75oJmEZQbKningirmGOEJCIk61Q==",
      "dev": true,
      "funding": [
        "https://github.com/sponsors/sxzz",
        "https://opencollective.com/debug"
      ],
      "license": "MIT",
      "engines": {
        "node": ">=12.20.0"
      }
    },
    "node_modules/onetime": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/onetime/-/onetime-7.0.0.tgz",
      "integrity": "sha512-VXJjc87FScF88uafS3JllDgvAm+c/Slfz06lorj2uAY34rlUu0Nt+v8wreiImcrgAjjIHp1rXpTDlLOGw29WwQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mimic-function": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ora": {
      "version": "9.4.1",
      "resolved": "https://registry.npmjs.org/ora/-/ora-9.4.1.tgz",
      "integrity": "sha512-6VlU9MLXbjVQD04AZCMX28hVtA5bUoadvUqO76MUCVA0ilwJbMiHsITRPfyVm6p/BC0Av/BXMujx39WCe1LEqw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "chalk": "^5.6.2",
        "cli-cursor": "^5.0.0",
        "cli-spinners": "^3.2.0",
        "is-interactive": "^2.0.0",
        "is-unicode-supported": "^2.1.0",
        "log-symbols": "^7.0.1",
        "stdin-discarder": "^0.3.2",
        "string-width": "^8.1.0"
      },
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ordered-binary": {
      "version": "1.6.3",
      "resolved": "https://registry.npmjs.org/ordered-binary/-/ordered-binary-1.6.3.tgz",
      "integrity": "sha512-Bc8LnA2x4ZHRQ9LjCm/NOdD3+CTQPhGNu8m7/6+ERtiB6Bb/fn7nCySwcmAC+5WCqwelpSAQgo1VX9BGpsC0tQ==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/oxc-parser": {
      "version": "0.156.0",
      "resolved": "https://registry.npmjs.org/oxc-parser/-/oxc-parser-0.156.0.tgz",
      "integrity": "sha512-7JhjgOfZjrIFJH5TlHrpRua864Si5GvwrPr5+eIRCY2sszhKXo6pyhP0HQKOGTtfO4UowwZ72XTGba0+lZphOQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@oxc-project/types": "^0.156.0"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/oxc-project"
      },
      "optionalDependencies": {
        "@oxc-parser/binding-android-arm-eabi": "0.156.0",
        "@oxc-parser/binding-android-arm64": "0.156.0",
        "@oxc-parser/binding-darwin-arm64": "0.156.0",
        "@oxc-parser/binding-darwin-x64": "0.156.0",
        "@oxc-parser/binding-freebsd-x64": "0.156.0",
        "@oxc-parser/binding-linux-arm-gnueabihf": "0.156.0",
        "@oxc-parser/binding-linux-arm-musleabihf": "0.156.0",
        "@oxc-parser/binding-linux-arm64-gnu": "0.156.0",
        "@oxc-parser/binding-linux-arm64-musl": "0.156.0",
        "@oxc-parser/binding-linux-ppc64-gnu": "0.156.0",
        "@oxc-parser/binding-linux-riscv64-gnu": "0.156.0",
        "@oxc-parser/binding-linux-riscv64-musl": "0.156.0",
        "@oxc-parser/binding-linux-s390x-gnu": "0.156.0",
        "@oxc-parser/binding-linux-x64-gnu": "0.156.0",
        "@oxc-parser/binding-linux-x64-musl": "0.156.0",
        "@oxc-parser/binding-openharmony-arm64": "0.156.0",
        "@oxc-parser/binding-win32-arm64-msvc": "0.156.0",
        "@oxc-parser/binding-win32-ia32-msvc": "0.156.0",
        "@oxc-parser/binding-win32-x64-msvc": "0.156.0"
      }
    },
    "node_modules/parse5": {
      "version": "8.1.1",
      "resolved": "https://registry.npmjs.org/parse5/-/parse5-8.1.1.tgz",
      "integrity": "sha512-EcR/6WDcU7b2N3vQSxKALCk9lXGtUMQxXio008OEMBE0kavu/7JLfBEeFPzi43nMqVDSbEn3QCK+BMCc9zO//w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "entities": "^9.0.0"
      },
      "funding": {
        "url": "https://github.com/inikulin/parse5?sponsor=1"
      }
    },
    "node_modules/parse5-html-rewriting-stream": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/parse5-html-rewriting-stream/-/parse5-html-rewriting-stream-8.0.1.tgz",
      "integrity": "sha512-NaRku2aMpUN1Sh1Gyk1KWUh2A7EJx2c6qYzvwsPtqhoHoaURshdrceYK3LunVCm3WHhm6FS7Vcczbvdh3/UIVw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "entities": "^8.0.0",
        "parse5": "^8.0.0",
        "parse5-sax-parser": "^8.0.0"
      },
      "funding": {
        "url": "https://github.com/inikulin/parse5?sponsor=1"
      }
    },
    "node_modules/parse5-sax-parser": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/parse5-sax-parser/-/parse5-sax-parser-8.0.1.tgz",
      "integrity": "sha512-6eHc4FeWwv8uBX1yMZ8Vl5zcT61k8EpK/rgRwNl/BLY4pOkUqXI1RIwGSIvxyBXzl5TGj4TvIQBJGwTU4P+ddg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "parse5": "^8.1.1"
      },
      "funding": {
        "url": "https://github.com/inikulin/parse5?sponsor=1"
      }
    },
    "node_modules/parse5/node_modules/entities": {
      "version": "9.0.0",
      "resolved": "https://registry.npmjs.org/entities/-/entities-9.0.0.tgz",
      "integrity": "sha512-oJFNDJg3kTPwAD1cNn2+WmUq4wFoo09npc3Ydf1D7ED4smRiWrsKnaLxykrTWgyGEcusc87P5dxlAleol9kpkg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/piscina": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/piscina/-/piscina-5.3.2.tgz",
      "integrity": "sha512-vv7l/mM7B9WgrhDaudIqv1x6v4LOBRYYmpWGdWushhpbCmVHp11sUB2v4hj1CAeTGXVxuZFz6xOU1RalAiPKfQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=20.x"
      },
      "optionalDependencies": {
        "@napi-rs/nice": "^1.0.4"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.33",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.33.tgz",
      "integrity": "sha512-RVHEU9/Pp1Fnjr/MpAJsZoADukCKhfIi15OunEYiGktIkYLkPVvC1sioWolGDS7XByMTx9m/IGbro0Js13zhnQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.20",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.2"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-media-query-parser": {
      "version": "0.2.3",
      "resolved": "https://registry.npmjs.org/postcss-media-query-parser/-/postcss-media-query-parser-0.2.3.tgz",
      "integrity": "sha512-3sOlxmbKcSHMjlUXQZKQ06jOswE7oVkXPxmZdoB1r5l0q6gTFTQSHxNxOrCccElbW7dxNytifNEo8qidX2Vsig==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/postcss-safe-parser": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/postcss-safe-parser/-/postcss-safe-parser-7.1.0.tgz",
      "integrity": "sha512-1WzZxRLaAFwEh6Do+zyGpjWV3nGJNxxhuh7Ubu/q1ICImMgZJnLwhoaEpRbG4pJppp2Y1ncL9ffA2f+LhrefQg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss-safe-parser"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=18.0"
      },
      "peerDependencies": {
        "postcss": "^8.4.31"
      }
    },
    "node_modules/proc-log": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-7.0.0.tgz",
      "integrity": "sha512-FYgfaA69XZ93zaXLoMNQ+ViDXGGBgR8aLh03txzcFhV+9xOXx7+8DLCULrKKpR9+GsH9ZfHm82aSUPpozX0Ztg==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      }
    },
    "node_modules/proxy-agent-negotiate": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/proxy-agent-negotiate/-/proxy-agent-negotiate-1.1.0.tgz",
      "integrity": "sha512-N8IBcM3UgCVzz2L2Lqv8DVntDnnC8/hiV4nEDUPkqq72TPUgYWjQc+bdZlBPZK9LzPAvOY//gAt0S0DApoOXWQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 20"
      },
      "peerDependencies": {
        "kerberos": "^2.0.0"
      },
      "peerDependenciesMeta": {
        "kerberos": {
          "optional": true
        }
      }
    },
    "node_modules/readdirp": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-5.1.1.tgz",
      "integrity": "sha512-Kko+Y5XQ6fM+Ce3dq3m9YGxnacYZYl9cA1wZjaF3Vbry2L3i1qVg8+CAgNPsXRArPMUMCaOR7oa9Nqntc43JKA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 20.19.0"
      },
      "funding": {
        "type": "individual",
        "url": "https://paulmillr.com/funding/"
      }
    },
    "node_modules/reflect-metadata": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/reflect-metadata/-/reflect-metadata-0.2.2.tgz",
      "integrity": "sha512-urBwgfrvVP/eAyXx4hluJivBKzuEbSQs9rKWCrCkbSxNv8mxPcUZKeuoF3Uy4mJl3Lwprp6yy5/39VWigZ4K6Q==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/require-from-string": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/restore-cursor": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-5.1.0.tgz",
      "integrity": "sha512-oMA2dcrw6u0YfxJQXm342bFKX/E4sG9rbTzO9ptUcR/e8A33cHuvStiYOwH7fszkZlZ1z/ta9AAoPk2F4qIOHA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "onetime": "^7.0.0",
        "signal-exit": "^4.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/rolldown": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/rolldown/-/rolldown-1.2.16.tgz",
      "integrity": "sha512-bWvlMpFKiTfDKfnK7FC2MPgPeWCf/Kpwsq49ApdW+FQaBZb6O6dZ4MAPbPUjp7hYQrw/RobqCzn64BRrQecGHw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@oxc-project/types": "=0.156.0",
        "@rolldown/pluginutils": "^1.0.0"
      },
      "bin": {
        "rolldown": "bin/cli.mjs"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "optionalDependencies": {
        "@rolldown/binding-android-arm-eabi": "1.2.16",
        "@rolldown/binding-android-arm64": "1.2.16",
        "@rolldown/binding-darwin-arm64": "1.2.16",
        "@rolldown/binding-darwin-x64": "1.2.16",
        "@rolldown/binding-freebsd-x64": "1.2.16",
        "@rolldown/binding-linux-arm-gnueabihf": "1.2.16",
        "@rolldown/binding-linux-arm64-gnu": "1.2.16",
        "@rolldown/binding-linux-arm64-musl": "1.2.16",
        "@rolldown/binding-linux-ppc64-gnu": "1.2.16",
        "@rolldown/binding-linux-s390x-gnu": "1.2.16",
        "@rolldown/binding-linux-x64-gnu": "1.2.16",
        "@rolldown/binding-linux-x64-musl": "1.2.16",
        "@rolldown/binding-openharmony-arm64": "1.2.16",
        "@rolldown/binding-win32-arm64-msvc": "1.2.16",
        "@rolldown/binding-win32-x64-msvc": "1.2.16"
      }
    },
    "node_modules/rxjs": {
      "version": "7.8.2",
      "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-7.8.2.tgz",
      "integrity": "sha512-dhKf903U/PQZY6boNNtAGdWbG85WAbjT/1xYoZIC7FAY0yWapOBQVsVrDl58W86//e1VpMNBtRV4MaXfdMySFA==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/sass": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass/-/sass-1.104.1.tgz",
      "integrity": "sha512-yDA+1aIG3EHgN4V/BvuhCvu61FF6hEd4e+9DxikUm9U0CAGuvdIZ/UYy7qbOxjhbbWQraoyLlMuzdRGOSV5Bmw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "chokidar": "^5.0.0",
        "immutable": "^5.1.5",
        "source-map-js": ">=0.6.2 <2.0.0"
      },
      "bin": {
        "sass": "sass.js"
      },
      "engines": {
        "node": ">=20.19.0"
      },
      "optionalDependencies": {
        "@parcel/watcher": "^2.4.1"
      }
    },
    "node_modules/sass-embedded": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded/-/sass-embedded-1.104.1.tgz",
      "integrity": "sha512-7LxbtPJ1MWKVbhzOnGx1sHTkHTcHVJ9hbgVsU29p/8gY1VeXt19fcJFr5xsx2f6zfrrR3FeOcYMt0uYDLAxpgw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@bufbuild/protobuf": "^2.5.0",
        "colorjs.io": "^0.7.0",
        "immutable": "^5.1.5",
        "rxjs": "^7.4.0",
        "supports-color": "^8.1.1",
        "sync-child-process": "^1.0.2",
        "varint": "^6.0.0"
      },
      "bin": {
        "sass": "dist/bin/sass.js"
      },
      "engines": {
        "node": ">=20.19.0"
      },
      "optionalDependencies": {
        "sass-embedded-all-unknown": "1.104.1",
        "sass-embedded-android-arm": "1.104.1",
        "sass-embedded-android-arm64": "1.104.1",
        "sass-embedded-android-riscv64": "1.104.1",
        "sass-embedded-android-x64": "1.104.1",
        "sass-embedded-darwin-arm64": "1.104.1",
        "sass-embedded-darwin-x64": "1.104.1",
        "sass-embedded-linux-arm": "1.104.1",
        "sass-embedded-linux-arm64": "1.104.1",
        "sass-embedded-linux-musl-arm": "1.104.1",
        "sass-embedded-linux-musl-arm64": "1.104.1",
        "sass-embedded-linux-musl-riscv64": "1.104.1",
        "sass-embedded-linux-musl-x64": "1.104.1",
        "sass-embedded-linux-riscv64": "1.104.1",
        "sass-embedded-linux-x64": "1.104.1",
        "sass-embedded-unknown-all": "1.104.1",
        "sass-embedded-win32-arm64": "1.104.1",
        "sass-embedded-win32-x64": "1.104.1"
      }
    },
    "node_modules/sass-embedded-all-unknown": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-all-unknown/-/sass-embedded-all-unknown-1.104.1.tgz",
      "integrity": "sha512-toyMCyUKkT6DsYlHuKZGjd8T6WltaW4TGX07F7HnF4tNJM5m/8VaVsd74zrq3QSPqGE9JjxIDK4NrNc/QY9pkA==",
      "cpu": [
        "!arm",
        "!arm64",
        "!riscv64",
        "!x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "sass": "1.104.1"
      }
    },
    "node_modules/sass-embedded-android-arm": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-android-arm/-/sass-embedded-android-arm-1.104.1.tgz",
      "integrity": "sha512-g/XPAJYAzSSQZFP4xCdGD0HLKB4mf24cJ/+5Nls8rMool3jNkBv9+AFO4EV0b+RxN8rLcEsMccH1CR64yIFYcQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-android-arm64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-android-arm64/-/sass-embedded-android-arm64-1.104.1.tgz",
      "integrity": "sha512-yW3BVW4YFpN2vu2cVQ+Pz5JrRTvoIz36aCdo+J/Mo1A9gEN8eVPV/AL7aeZ803YdKgIitd3qw3pY4wpmT6TXNg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-android-riscv64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-android-riscv64/-/sass-embedded-android-riscv64-1.104.1.tgz",
      "integrity": "sha512-ZYY8oMKQS7Q/6FBoC8w3T16O3MucDe3xv8iKym41Nht5uvLCGGpm4fC4OF5nlv7wQkJv8oactYddGG3Wd0Rqkg==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-android-x64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-android-x64/-/sass-embedded-android-x64-1.104.1.tgz",
      "integrity": "sha512-5WZKC4lSfjMIjzZdQUlYQUAV+UiatBhD8w28U7cYLLj4/dMgEPOBd4g3VMv0BwpgH2JOaycMS42dXq29W2bcDg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-darwin-arm64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-darwin-arm64/-/sass-embedded-darwin-arm64-1.104.1.tgz",
      "integrity": "sha512-oatuHzn0NsEg0d9Dcze6CuWUPvuETtMxRK4cv0eRAg7p6R0vHnv5GZRyWG6gEy3nc/ha/L+GtTasWVU82f4jrQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-darwin-x64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-darwin-x64/-/sass-embedded-darwin-x64-1.104.1.tgz",
      "integrity": "sha512-gql/5sHGzUTVwuHfM3QLCDeb6NYwen+LLj22gz81C2NKHF/4nUtDyh4N+fURWdT7J0/EhtMOd0+FLML3sGNP7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-linux-arm": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-linux-arm/-/sass-embedded-linux-arm-1.104.1.tgz",
      "integrity": "sha512-WfmshPJOp9vUKxgp8wZ2ncaKBbyrlW9J51M2aUQHWECjMNxTULnGOHWSmD7FViXv4zwn1Co5FIFQUipW7RCxtA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": "glibc",
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-linux-arm64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-linux-arm64/-/sass-embedded-linux-arm64-1.104.1.tgz",
      "integrity": "sha512-sVWUKXNTu8sP3X95Df0xo/t49Ce5IseTIMqXHxhFBKVmx7gf7kBWNLK0wH5ym+4khc+B5nNJPgq4IxpelG8tMQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": "glibc",
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-linux-musl-arm": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-linux-musl-arm/-/sass-embedded-linux-musl-arm-1.104.1.tgz",
      "integrity": "sha512-k0cQ/CxBzFVYiQEObg6CpF6CUglkdEhi/DZgZXQbwC27kbGGY+fatmIs/cFPJL2z1ulACwoAr86RQUFzYvw5eg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": "musl",
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-linux-musl-arm64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-linux-musl-arm64/-/sass-embedded-linux-musl-arm64-1.104.1.tgz",
      "integrity": "sha512-H7b+LzZ/w8pwNExInM8HDHraqvxCMdUc5ZRGU/aSJJhZ9HjeRKBjF3GxaisVHnx7o18j1l4VQ5cLBL9tTmNzZw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": "musl",
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-linux-musl-riscv64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-linux-musl-riscv64/-/sass-embedded-linux-musl-riscv64-1.104.1.tgz",
      "integrity": "sha512-9DYdn4wfrkidjxJVtEd2iCx8HKdZe+uF82GDmrYEZhgu4NjVE6a4fQyW7OLwzn3erZMHKBaObBOH1d37DnXI1A==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": "musl",
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-linux-musl-x64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-linux-musl-x64/-/sass-embedded-linux-musl-x64-1.104.1.tgz",
      "integrity": "sha512-5xz+nAr01b6yaRdrGVgE7lNvm1lGFjwNdUvnz+teidvHCbD5oTcbhrRVrnDoLHHvq5n3Jve9TzWaaHhezaEfHA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": "musl",
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-linux-riscv64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-linux-riscv64/-/sass-embedded-linux-riscv64-1.104.1.tgz",
      "integrity": "sha512-oWryPJWTXK5adtlz/FD7wd2kS4I0CEgp6mWLUVb4oMFURMLz9bA9fO87D7lc4SV++lds7T51PU1kykCbOvNHMg==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": "glibc",
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-linux-x64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-linux-x64/-/sass-embedded-linux-x64-1.104.1.tgz",
      "integrity": "sha512-j/sX/yKTx/wJKepC5/ISlR6kPeSuHKThf76D2za5i2VnbHg0MN19jQq3WMorowR3kRghqt6azs3awogG+e7IRA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": "glibc",
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-unknown-all": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-unknown-all/-/sass-embedded-unknown-all-1.104.1.tgz",
      "integrity": "sha512-RaMsYZB5mRioL4qhoI7T5mmNb2OunakbPTJW2cuu3MeIULnGoxo7Wd5QKFxeQvF7sSQL57RuaQ+q9pH+/pQ9Fg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "!android",
        "!darwin",
        "!linux",
        "!win32"
      ],
      "dependencies": {
        "sass": "1.104.1"
      }
    },
    "node_modules/sass-embedded-win32-arm64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-win32-arm64/-/sass-embedded-win32-arm64-1.104.1.tgz",
      "integrity": "sha512-fS6DL7lcnTPclqGLF4xRt8egZlFY9cU23d57ufbWqaUbCFu9JTu0+8qB4jMxfx1la6byi3GoSTfbnNOLfWv8sw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/sass-embedded-win32-x64": {
      "version": "1.104.1",
      "resolved": "https://registry.npmjs.org/sass-embedded-win32-x64/-/sass-embedded-win32-x64-1.104.1.tgz",
      "integrity": "sha512-/c4N2A93Ckms6DuRFVftKYISuI1tyC8gmlVJ8WaWFzgCBN/Swq2rARJIBUNeuxlmxjmYXfd3+2f/u887K63wbA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/signal-exit": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-4.1.0.tgz",
      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/slice-ansi": {
      "version": "10.0.1",
      "resolved": "https://registry.npmjs.org/slice-ansi/-/slice-ansi-10.0.1.tgz",
      "integrity": "sha512-CJKEH3zwVX4bOnE+bFbmh+JK/YMT9VAazqBsVBTesnYKXlNtz6oVmrhNp1jHrxHzscuUkWiKZpzNzFraZcrorg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^7.0.0",
        "string-width": "^8.3.0"
      },
      "engines": {
        "node": ">=22"
      },
      "funding": {
        "url": "https://github.com/chalk/slice-ansi?sponsor=1"
      }
    },
    "node_modules/source-map": {
      "version": "0.8.0",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.8.0.tgz",
      "integrity": "sha512-d8EqvL+k/SOXCreS/SUzg2ciyHqBBLcN/yuRjFsbvVhHTE2pgei7oAhmPM7kWFbkX6OSMQfUq4KbkF3au9lhYQ==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz",
      "integrity": "sha512-KGj/8Y43x35aZVDtt+J4mK1hoLGHULMYfSkODJNQjNDC3oW1PqPoxMwo0pLUsWM/UEGzON/NxeHywEfNXNP3Vw==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-support": {
      "version": "0.5.21",
      "resolved": "https://registry.npmjs.org/source-map-support/-/source-map-support-0.5.21.tgz",
      "integrity": "sha512-uBHU3L3czsIyYXKX88fdrGovxdSCoTGDRZ6SYXtSRxLZUzHg5P/66Ht6uoUlHu9EZod+inXhKo3qQgwXUT/y1w==",
      "license": "MIT",
      "dependencies": {
        "buffer-from": "^1.0.0",
        "source-map": "^0.6.0"
      }
    },
    "node_modules/source-map-support/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/stdin-discarder": {
      "version": "0.3.2",
      "resolved": "https://registry.npmjs.org/stdin-discarder/-/stdin-discarder-0.3.2.tgz",
      "integrity": "sha512-eCPu1qRxPVkl5605OTWF8Wz40b4Mf45NY5LQmVPQ599knfs5QhASUm9GbJ5BDMDOXgrnh0wyEdvzmL//YMlw0A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/string-width": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-8.3.0.tgz",
      "integrity": "sha512-ZbmZM0JCihQN91dWnxoipT2KOEyHqEyfRXUyjuRhW8b/xnqPDoq4gWEVApTVa9db2wN8mmoikgFBbjh71+cGeQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "get-east-asian-width": "^1.5.0",
        "strip-ansi": "^7.1.2"
      },
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/strip-ansi": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-7.2.0.tgz",
      "integrity": "sha512-yDPMNjp4WyfYBkHnjIRLfca1i6KMyGCtsVgoKe/z1+6vukgaENdgGBZt+ZmKPc4gavvEZ5OgHfHdrazhgNyG7w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^6.2.2"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/strip-ansi?sponsor=1"
      }
    },
    "node_modules/supports-color": {
      "version": "8.1.1",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-8.1.1.tgz",
      "integrity": "sha512-MpUEN2OodtUzxvKQl72cUF7RQ5EiHsGvSsVG0ia9c5RbWGL2CI4C7EpPS8UTBIplnlzZiNuV56w+FuNxy3ty2Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/supports-color?sponsor=1"
      }
    },
    "node_modules/sync-child-process": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/sync-child-process/-/sync-child-process-1.1.1.tgz",
      "integrity": "sha512-54zMOnH5qgjdKW8SGpCx3daSP+v+TtTfOxgPdhUE3P0hytMMpknZfP67S4JeRcx5IQRWJERz6890yO4dkTywww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "sync-message-port": "^1.0.0"
      },
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/sync-message-port": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/sync-message-port/-/sync-message-port-1.2.0.tgz",
      "integrity": "sha512-gAQ9qrUN/UCypHtGFbbe7Rc/f9bzO88IwrG8TDo/aMKAApKyD6E3W4Cm0EfhfBb6Z6SKt59tTCTfD+n1xmAvMg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/terser": {
      "version": "5.51.2",
      "resolved": "https://registry.npmjs.org/terser/-/terser-5.51.2.tgz",
      "integrity": "sha512-bWnjSNscmuI+GJze6ZupnHP8G/cTcsJF+bXCeQknk2SHQsgbNJnLrqiH9jZ2W4STPVXH2mDKKRX3iwPhc9Cn/Q==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "@jridgewell/source-map": "^0.3.3",
        "acorn": "^8.15.0",
        "commander": "^2.20.0",
        "source-map-support": "~0.5.20"
      },
      "bin": {
        "terser": "bin/terser"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/typescript": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-6.0.3.tgz",
      "integrity": "sha512-y2TvuxSZPDyQakkFRPZHKFm+KKVqIisdg9/CZwm9ftvKXLP8NRWj38/ODjNbr43SsoXqNuAisEf1GdCxqWcdBw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.4.0.tgz",
      "integrity": "sha512-WPJuOnjI9FWDct4fB+ej4Mz8opLaw5CDcZ2t44tFZ0vIQVYWzBhWR3mkixuUj/A7+vY4V9+ApOZ2YYLwdgq46w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/validate-npm-package-name": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/validate-npm-package-name/-/validate-npm-package-name-8.0.0.tgz",
      "integrity": "sha512-SCv6OOV6Xj2/3cXy3dGmADluJTNcL3o7hZAglNPTe+WYuEuvxgJzxPrSDLZhF+CwyQOubqgecjMmTJGMVLWjYQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^22.22.2 || ^24.15.0 || >=26.0.0"
      }
    },
    "node_modules/varint": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/varint/-/varint-6.0.0.tgz",
      "integrity": "sha512-cXEIW6cfr15lFv563k4GuVuW/fiwjknytD37jIOLSdSWuOI6WnO/oKwmP2FQTU2l01LP8/M5TSAJpzUaGe3uWg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/verkit": {
      "version": "0.3.2",
      "resolved": "https://registry.npmjs.org/verkit/-/verkit-0.3.2.tgz",
      "integrity": "sha512-zj/ob3UsvJGN0whEAKFp53REA5X66hvffVqoCtVQAakJKnKlH+/PcOfMoFwIG/o4rElqLv/ycAFlx8ZlXUorCg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.12.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/sxzz"
      }
    },
    "node_modules/vite": {
      "version": "8.3.5",
      "resolved": "https://registry.npmjs.org/vite/-/vite-8.3.5.tgz",
      "integrity": "sha512-z1YpjieJ9g0ebTmQpLBv/oq9E3F9EIlOe+7LahW8SrE3LTiG3udBRUXQOlYXP9b+IC2q2phHeVxj9xGlw34OEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "lightningcss": "^1.33.0",
        "picomatch": "^4.0.7",
        "postcss": "^8.5.30",
        "rolldown": "~1.2.14",
        "tinyglobby": "^0.2.17"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "@vitejs/devtools": "^0.7.1 || ^0.8.0",
        "esbuild": "^0.27.0 || ^0.28.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "@vitejs/devtools": {
          "optional": true
        },
        "esbuild": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/weak-lru-cache": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/weak-lru-cache/-/weak-lru-cache-1.2.3.tgz",
      "integrity": "sha512-pF0uTATIDYJFeEX4GDD5zjOe2jU9EJbBRcpcGPonUcao7eSp2hl6VA0b2Ims9jisMX33x6zgnozvaBCEsXNGPw==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/wrap-ansi": {
      "version": "10.0.2",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-10.0.2.tgz",
      "integrity": "sha512-6OLRNZqRntVGBm26ghZ5eZhCuWWyOkRCSn8XsOIuq5stpCE/tjLbdozd93naILZig0lmD8ANfRwnhn0DLeXGlg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.2.3",
        "string-width": "^8.2.0"
      },
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi/node_modules/ansi-styles": {
      "version": "6.2.3",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-6.2.3.tgz",
      "integrity": "sha512-4Dj6M28JB+oAH8kFkTLUo+a2jwOFkuqb3yucU0CANcRRUbxS0cP0nZYCGjcc3BNXwRIsUVmDGgzawme7zvJHvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/xxhash-wasm": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/xxhash-wasm/-/xxhash-wasm-1.1.0.tgz",
      "integrity": "sha512-147y/6YNh+tlp6nd/2pWq38i9h6mz/EuQ6njIrmW8D1BS5nCqs0P6DG+m6zTGnNz5I+uhZ0SHxBs9BsPrwcKDA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yargs": {
      "version": "18.1.0",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-18.1.0.tgz",
      "integrity": "sha512-2rAgRKu54VsHkqI0/tYkmluGXHD4KW7yZoycuqDQ15QOTnc2VVfy0nN/1eMhnQLO00A+dwtK20xuCnc1YGeUyg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cliui": "^9.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "string-width": "^8.2.1",
        "y18n": "^5.0.5",
        "yargs-parser": "^22.0.0"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=23"
      }
    },
    "node_modules/yargs-parser": {
      "version": "22.0.0",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-22.0.0.tgz",
      "integrity": "sha512-rwu/ClNdSMpkSrUb+d6BRsSkLUq1fmfsY6TOpYzTwvwkg1/NRG85KBy3kq++A8LKQwX6lsu+aWad+2khvuXrqw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=23"
      }
    },
    "node_modules/yoctocolors": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/yoctocolors/-/yoctocolors-2.2.0.tgz",
      "integrity": "sha512-xYqdZFUK/VYazNl/oCDYN+3WloWQwMfZxBoiNt6qNyk+xfOdi598muWE42rNZFp1kNOiqW936q5RhUdnpqElSg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "4.6.6",
      "resolved": "https://registry.npmjs.org/zod/-/zod-4.6.6.tgz",
      "integrity": "sha512-4UmzQUF5fxvfcYHlbjBmejU+w+hbDnWFx4aS8kBx7nPBHcO2SqPbpAG8snbdg+Xse4pRefR98hgjFgIMCI/UhA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    }
  }
}
`,ft=`{
  "version": 1,
  "cli": { "analytics": false },
  "projects": {
    "starter": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "outputPath": "dist/starter",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "tsConfig": "tsconfig.json",
            "assets": [{ "glob": "**/*", "input": "public", "output": "/" }],
            "styles": ["search.css"]
          },
          "configurations": {
            "development": { "optimization": false, "sourceMap": true }
          }
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": { "buildTarget": "starter:build:development" }
        }
      }
    }
  }
}
`,pt=`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "experimentalDecorators": true,
    "allowJs": true,
    "strict": true,
    "skipLibCheck": true,
    "useDefineForClassFields": false
  },
  "angularCompilerOptions": { "strictTemplates": true },
  "files": ["src/main.ts"]
}
`,mt=`import { bootstrapApplication } from '@angular/platform-browser';
import { SearchApp } from './search-app';

bootstrapApplication(SearchApp).catch(() => {
  const host = document.querySelector('search-app');
  if (host) host.textContent = 'Couldn’t start search. Check the starter setup and connection settings.';
});
`,ht=`import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SearchstudioUxAngularModule } from '@searchstax-inc/searchstudio-ux-angular';
import type { IExternalPromotion, ISearchstaxParsedResult, ISearchstaxSearchResponse, ISearchstaxSearchSortingData, Searchstax } from '@searchstax-inc/searchstudio-ux-js';
import { connection, demo, design } from './config.js';
import { contentLanguageTag } from './content-language.js';
import { starterPassages } from './starter-passages.js';
import { setupStarterServices } from './starter-services.js';
import { thumbnailAlt } from './thumbnail-alt.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { sampleSuggestionSource, setupSearchSuggestions } from './suggestions.js';
import { getAnalyticsSettings, setupResultTracking } from './result-tracking.js';
import { setupPaginationFocus } from './pagination-focus.js';

const facetLabels: Record<string, string> = demo.facetLabels;
const thumbnailPaths: Record<string, string> = demo.thumbnailPaths;

function publicLink(value: unknown) {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { /* An unmapped URL produces no link. */ }
  return '';
}



@Component({
  selector: 'search-app',
  imports: [NgTemplateOutlet, SearchstudioUxAngularModule],
  templateUrl: './search-app.html',
})
export class SearchApp implements AfterViewInit, OnDestroy {
  @ViewChild('searchForm') private form!: ElementRef<HTMLFormElement>;
  @ViewChild('searchField') private input!: ElementRef<HTMLInputElement>;
  @ViewChild('resultHost') private resultHost!: ElementRef<HTMLDivElement>;
  @ViewChild('pagination') private pagination!: ElementRef<HTMLDivElement>;
  @ViewChild('answerHost') private answerHost!: ElementRef<HTMLDivElement>;
  readonly connection = connection;
  readonly analytics = getAnalyticsSettings(connection);
  readonly design = design;
  readonly resultLanguage = contentLanguageTag(connection.language);
  readonly isDemo = connection.searchURL === demo.searchURL && connection.model === demo.model && this.resultLanguage === demo.language;
  readonly status = signal('Connecting to search…');
  private readonly initialQuery = connection.initialQuery ||
    (this.isDemo ? 'rehabilitation' : '');
  private api?: Searchstax;
  private loadingSubscription?: string;
  private timer?: number;
  private services?: ReturnType<typeof setupStarterServices>;
  private setSuggestionSource?: ReturnType<typeof setupSearchSuggestions>;
  private stopResultTracking?: () => void;
  private stopPaginationFocus?: () => void;

  initialized(instance: Searchstax) {
    this.api = instance;
    instance.setCookiesDisabled(!this.analytics.trackApiKey);
  }

  ngAfterViewInit() {
    if (!connection.searchURL || !connection.searchAuth) return;
    this.stopPaginationFocus = setupPaginationFocus(this.pagination.nativeElement, () => this.api);
    queueMicrotask(() => this.start());
  }

  ngOnDestroy() {
    this.services?.clear();
    this.stopResultTracking?.();
    this.stopPaginationFocus?.();
    this.setSuggestionSource?.(null);
    if (this.loadingSubscription) this.api?.dataLayer.$loadingChange.unsubscribe(this.loadingSubscription);
    window.clearTimeout(this.timer);
    this.api = undefined;
  }

  private start() {
    const api = this.api;
    if (!api) return;
    this.stopResultTracking = setupResultTracking(this.resultHost.nativeElement, api);
    this.loadingSubscription = api.dataLayer.$loadingChange.subscribe((loading) => {
      if (!loading) return;
      this.status.set('Searching…');
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(() => this.status.set('Search is unavailable. Try again in a moment.'), 15000);
    });
    api.dataLayer.setItemsPerPage(design.resultsPerPage);
    this.input.nativeElement.value = this.initialQuery;
    if (design.showSuggestions) {
      const source = this.isDemo ? sampleSuggestionSource : connection.suggesterURL
        ? createCustomerSuggestionSource({ token: connection.searchAuth, language: connection.language }, connection.suggesterURL)
        : null;
      if (source) {
        this.setSuggestionSource = setupSearchSuggestions(this.form.nativeElement, 'angular-search-suggestions');
        this.setSuggestionSource(source);
      }
    }
    this.services = setupStarterServices(this.form.nativeElement, this.answerHost.nativeElement, connection, design);
    if (this.initialQuery) this.runSearch(this.initialQuery);
    else this.status.set('Enter a search term.');
  }

  submit(event: Event) {
    event.preventDefault();
    this.runSearch(this.input.nativeElement.value);
  }

  private runSearch(value: string) {
    const api = this.api;
    if (!api) return;
    const term = value.trim();
    if (!term) {
      this.status.set('Enter a search term.');
      return;
    }
    const current = api.dataLayer.searchObject;
    const next = { ...current, query: term, page: 1, facets: [] };
    void this.services?.search(term);
    if (current.query === term && current.page === 1 && !current.facets.length) api.search(next);
    else api.dataLayer.setSearchObject(next);
  }

  readonly afterSearch = (items: ISearchstaxParsedResult[], response?: ISearchstaxSearchResponse) => {
    const total = response?.response?.numFound;
    if (typeof total !== 'number') return [];
    window.clearTimeout(this.timer);
    this.status.set(total + (total === 1 ? ' result' : ' results'));
    const passages = starterPassages(response, this.isDemo);
    const results = items.flatMap(item => {
      const url = publicLink(item.url);
      return url ? [{
        ...item,
        url,
        ...passages(item),
        previewThumbnail: design.showThumbnails ? (this.isDemo ? thumbnailPaths[url] : publicLink(item.thumbnail)) : '',
        previewThumbnailAlt: this.isDemo ? '' : thumbnailAlt(
          item.allFields,
          connection.thumbnailAltField,
          connection.thumbnailsWithoutAltAreDecorative,
        ),
      }] : [];
    });
    return results;
  };

  facetLabel(value: string) {
    return this.isDemo && Object.hasOwn(facetLabels, value) ? facetLabels[value] : value;
  }

  sortChoices(data: ISearchstaxSearchSortingData | null) {
    return this.isDemo ? demo.sortOptions : data?.sortOptions?.map(item => ({ label: item.value, order: item.key })) ?? [];
  }

  sortSearch(event: Event) {
    if (!this.api || !(event.target instanceof HTMLSelectElement)) return;
    const data = this.api.dataLayer;
    data.setSearchObject({ ...data.searchObject, order: encodeURIComponent(event.target.value), page: 1 });
  }

  livePromotions(entries: IExternalPromotion[] | undefined) {
    return (entries ?? []).flatMap(item => {
      const url = publicLink(item.url);
      return url ? [{ ...item, url }] : [];
    });
  }
}
`,gt=`<ng-template #passage let-parts>
  @for (part of parts; track $index) {
    @if (part.matched) {<mark class="search-result-hit">{{ part.text }}</mark>}
    @else {<ng-container>{{ part.text }}</ng-container>}
  }
</ng-template>
<main class="search-starter">
  @if (design.logoURL) {
    <img class="search-starter__logo" [src]="design.logoURL" alt="Company logo"
      referrerpolicy="no-referrer" (error)="$any($event.target).hidden = true">
  }
  <h1>{{ isDemo ? 'Search Central County' : 'Search' }}</h1>
  @if (isDemo) {
    <p>Search fictional university health content with the SearchStax Angular UI Kit.</p>
  }
  @if (!connection.searchURL || !connection.searchAuth) {
    <p>Set the Select endpoint and read-only token in src/config.js to start searching.</p>
  } @else {
  <app-searchstax-wrapper
    [searchURL]="connection.searchURL" [searchAuth]="connection.searchAuth" [model]="connection.model"
    [language]="connection.language" authType="token" suggesterURL="" [trackApiKey]="analytics.trackApiKey" [analyticsBaseUrl]="analytics.analyticsBaseUrl"
    [router]="{ enabled: false }" [afterSearch]="afterSearch" (initialized)="initialized($event)"
  >
    <div>
      <form #searchForm class="search-starter__form" role="search" (submit)="submit($event)">
        <label class="search-starter__sr-only" for="starter-query">{{ design.searchFieldText }}</label>
        <input #searchField id="starter-query" type="search" [placeholder]="design.searchFieldText" autocomplete="off" required>
        <button type="submit" class="search-starter__submit">{{ design.searchButtonText }}</button>
      </form>
    </div>
    <div #answerHost></div>
    <p role="status">{{ status() }}</p>
    @if (design.showSorting) {
      <app-searchstax-search-sorting [templateOverride]="sortControls">
        <ng-template #sortControls let-context="context">
          @if (context.sortingData?.searchExecuted && sortChoices(context.sortingData).length) {
            <label class="search-starter__sort">
              Sort by
              <select [value]="context.selectedSorting" (change)="sortSearch($event)">
                @for (choice of sortChoices(context.sortingData); track choice.order) {
                  <option [value]="choice.order">{{ choice.label }}</option>
                }
              </select>
            </label>
          }
        </ng-template>
      </app-searchstax-search-sorting>
    }
    <ng-template #promotionWidget>
      <app-searchstax-external-promotions [templateOverride]="externalPromotions">
        <ng-template #externalPromotions let-data="externalPromotionsData">
          @if (livePromotions(data?.externalPromotions); as links) {
            @if (links.length) {
              <section aria-label="External promotions">
                @for (entry of links; track entry.id ?? entry.url) {
                  <div class="search-promotion-banner">
                    <strong class="search-promotion-heading">{{ design.promotionHeading }}</strong>
                    <a [href]="entry.url" [attr.lang]="resultLanguage" referrerpolicy="no-referrer">{{ entry.name || entry.url }}</a>
                    @if (entry.description) {
                      <p [attr.lang]="resultLanguage">{{ entry.description }}</p>
                    }
                  </div>
                }
              </section>
            }
          }
        </ng-template>
      </app-searchstax-external-promotions>
    </ng-template>
    @if (design.bannerPlacement === 'above') {
      <ng-container [ngTemplateOutlet]="promotionWidget" />
    }
    <div class="search-starter__body">
      @if (design.showFilters) {
        <aside class="search-starter__filters" aria-label="Filter search results">
          <app-searchstax-search-facets
            facetingType="or" [itemsPerPageDesktop]="20" [itemsPerPageMobile]="20"
            [templateOverrideDesktop]="facetControls" [templateOverrideMobile]="emptyMobileFacets"
          >
            <ng-template #facetControls let-data="facetsTemplateDataDesktop" let-context="context"
              let-facetValues="facetValues" let-isChecked="isChecked" let-selectFacet="selectFacet">
              @for (facet of data?.facets ?? []; track facet.name) {
                <fieldset>
                  <legend>{{ facet.label || facet.name }}</legend>
                  <div class="search-facet-choices">
                    @for (option of facetValues(facet); track option.value) {
                      <label #facetRow>
                        <input type="checkbox" class="searchstax-facet-input-checkbox" [checked]="!!isChecked(option, context)"
                          [disabled]="option.disabled" (click)="selectFacet(facetRow, $event, option, true, context)">
                        <span>{{ facetLabel(option.value) }}</span><small>{{ option.count }}</small>
                      </label>
                    }
                  </div>
                </fieldset>
              }
            </ng-template>
            <ng-template #emptyMobileFacets></ng-template>
          </app-searchstax-search-facets>
        </aside>
      }
      <div #resultHost>
        <app-searchstax-results renderMethod="pagination" [resultsPerPage]="design.resultsPerPage"
          [resultsTemplate]="resultCards" [noResultsTemplate]="emptyState">
          <ng-template #resultCards let-items="searchResults">
            <div class="searchstax-search-results">
              @for (item of items ?? []; track item.uniqueId || item.url) {
                <article class="searchstax-search-result">
                  @if (item.promoted) {
                    <span class="search-promotion-marker">{{ design.promotionBadge }}</span>
                  }
                  @if (item.previewThumbnail && item.previewThumbnailAlt !== null) {
                    <img class="search-starter__result-thumbnail" [src]="item.previewThumbnail"
                      [alt]="item.previewThumbnailAlt" [attr.lang]="resultLanguage" loading="lazy" referrerpolicy="no-referrer">
                  }
                  @if (item.ribbonParts.length) {<span class="searchstax-search-result-ribbon"><ng-container [ngTemplateOutlet]="passage" [ngTemplateOutletContext]="{ $implicit: item.ribbonParts }" /></span>}
                  <h2 [attr.lang]="resultLanguage"><a [href]="item.url" [attr.data-result-id]="item.uniqueId" referrerpolicy="no-referrer"><ng-container [ngTemplateOutlet]="passage" [ngTemplateOutletContext]="{ $implicit: item.titleParts }" /></a></h2>
                  @if (item.descriptionParts.length) {
                    <p class="search-starter__result-description" [attr.lang]="resultLanguage"><ng-container [ngTemplateOutlet]="passage" [ngTemplateOutletContext]="{ $implicit: item.descriptionParts }" /></p>
                  }
                  @for (field of item.otherFields; track $index) {<p>{{ field.label ? field.label + ': ' : '' }}<ng-container [ngTemplateOutlet]="passage" [ngTemplateOutletContext]="{ $implicit: field.parts }" /></p>}
                </article>
              }
            </div>
          </ng-template>
          <ng-template #emptyState>
            <p class="search-starter__no-results">{{ design.noResultsText }}</p>
          </ng-template>
        </app-searchstax-results>
        <div #pagination tabindex="-1" role="group" aria-label="Search result pagination">
          <app-searchstax-search-pagination [templateOverride]="pageControls">
            <ng-template #pageControls let-page="paginationData">
              @if (page?.totalResults) {
                <nav class="search-starter__pagination" aria-label="Search result pages">
                  <span tabindex="-1" data-page-range [attr.data-page-start]="page.startResultIndex">{{ page.startResultIndex }}–{{ page.endResultIndex }} of {{ page.totalResults }} results</span>
                  @if (!page.isFirstPage) {
                    <button type="button" data-page-step="previous">Previous</button>
                  }
                  @if (!page.isLastPage) {
                    <button type="button" data-page-step="next">Next</button>
                  }
                </nav>
              }
            </ng-template>
          </app-searchstax-search-pagination>
          <span class="search-starter__sr-only" role="status" data-page-announcement></span>
        </div>
      </div>
    </div>
    @if (design.bannerPlacement === 'below') {
      <ng-container [ngTemplateOutlet]="promotionWidget" />
    }
  </app-searchstax-wrapper>
  }
</main>
`,Z="# SearchStax Angular Starter\n\nThis starter uses the SearchStax Angular UI Kit and your Search Lab design. A SearchLabDemo download is ready to search. For a connected-app download, add your endpoint and read-only token under **Connect Your Search App** before you run it.\n\n## Run the Demo\n\nUse Node.js 22.22.3+ on the 22.x line, Node.js 24.15+ on the 24.x line, or Node.js 26 or later.\n\n```sh\nnpm ci\nnpm run dev\n```\n\nOpen the localhost URL printed by Angular CLI. The demo search requires an internet connection. Run `npm run build` to generate the browser files in `dist/starter/browser/`.\n\n- Search for `rehabilitation` to try filters or view the optional sample thumbnails.\n- On SearchLabDemo, type `reh` to try suggestions if you enabled them in your design.\n\n## Connect Your Search App\n\nUse `src/config.js` to connect your app. Keep the `demo` object and set `connection.searchURL` to your Select endpoint, `connection.searchAuth` to an active **Read Only** token, `connection.model` to your Search Profile name, and `connection.language` to the language configured for your app. Set `connection.initialQuery` to a term that matches your content or leave it empty to start with a blank search box.\n\n1. Find the Select endpoint and token under **App Settings > All APIs > Search & Indexing**.\n2. Map Title, URL, and Description under the profile’s **Results Fields**. Map Thumbnail if you display images. Configure and publish any facets, sort options, and Promotions you want to use. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields)\n3. For live suggestions, publish Auto-Suggest, set `suggesterURL` to its endpoint, and enable `showSuggestions` in `design`. [Auto-Suggest API](https://support.searchstax.com/hc/en-us/articles/40243330090893-Auto-Suggest-API)\n\n### Promotions\n\nSearch with a published trigger on the selected profile. An elevated result gets the indexed badge from your design. External items use the banner heading, style, and placement from your design. A normal query shows the profile’s ordinary results. To try the fixed samples, choose **Fictional demo** in local Search Lab. [Promotions setup](https://support.searchstax.com/hc/en-us/articles/40155433600397-Promotions)\n\n### Related Searches and Smart Answers\n\nThe download includes the selected app’s feature settings in `src/feature-settings.js`. Related Searches uses the app entitlement and the published setting for the search language. Smart Answers uses its entitlement and the published setting for the selected profile and language. An off or unknown setting leaves that feature out.\n\nIn `src/config.js`, enter `relatedURL` and the browser-safe `discoveryKey` from **App Settings → All APIs → Discovery** to receive related terms. For Smart Answers, enter the streaming `questionURL` or a same-origin streaming proxy. Answers use the search token, language, and profile. [Related Searches API](https://support.searchstax.com/hc/en-us/articles/40243333638541-Related-Searches-API) · [Smart Answers setup](https://support.searchstax.com/hc/en-us/articles/40075209934989-Smart-Answers)\n\nIf you switch apps or the published settings change, reconnect in Build with the updated app configuration and download a fresh starter. For fixed examples of both features, choose **Fictional demo** in local Search Lab before downloading.\n\nResult links open with tracking off by default. To enable search and result-click tracking on your own app, open **App Settings > All APIs > Analytics**. In `src/config.js`, set `connection.analyticsBaseUrl` to the origin of your Tracking URL (the `https://` address before `/api/v2/track/`) and `connection.trackApiKey` to the Tracking key. Leave both blank to keep tracking off. If your site requires consent, supply these settings only after the visitor opts in.\n\n### Thumbnail Descriptions\n\nTo show informative thumbnails, enable thumbnails in the design and map the image URL field to **Thumbnail**. Add the indexed description as a Return Field with **No mapping** in **Results Fields**. Then set `connection.thumbnailAltField` in `src/config.js` to that field’s name, such as `image_alt`. Use a description that conveys the information the image adds. The starter omits a connected thumbnail when its description is missing. Set `thumbnailsWithoutAltAreDecorative` to `true` only if every thumbnail without a description is decorative or repeats the nearby text. Those images use empty alt text. [Decorative images](https://www.w3.org/WAI/tutorials/images/decorative/)\n\nBrowser code is visible to visitors. Use a server-side proxy for tokens that need to stay private. [Endpoint and token guidance](https://support.searchstax.com/hc/en-us/articles/39440547272077-Hide-Tokens-and-Endpoints-in-UI-Kits)\n\nUse `src/search-app.html` to change the Angular widget templates and `search.css` to change their appearance. Retain the `.search-starter` wrapper so the exported selectors apply. [Angular UI Kit setup](https://support.searchstax.com/hc/en-us/articles/40364056121997-Getting-Started-With-searchstudio-ux-angular)\n",_t=`import { placePromotionBanners, renderPromotionBanners, updatePromotionLabels } from './promotion-display.js';
import { setupSearchSuggestions, sampleSuggestionSource } from './sample-suggestions.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { setupRelatedSearches, relatedSource } from './related-searches.js';
import { featureStatus } from './app-configuration.js';
import { setupCustomerAnswers } from './customer-answers.js';
import { createSampleExternalPromotion, updateSampleExternalPromotion, samplePromotionMode, samplePromotionQuery, applySampleIndexedPromotion } from './sample-promotions.js';

const spanishTerms = ['campus norte', 'campus sur', 'clínica del campus norte', 'clínica del campus sur', 'rehabilitación', 'salud pública', 'simulación de enfermería'];
const spanishSuggestions = {
  label: 'Sugerencias de búsqueda', language: 'es', minimumChars: 3,
  suggest(prefix) {
    const term = prefix.toLocaleLowerCase('es');
    return spanishTerms.filter(value => value !== term && value.startsWith(term));
  },
};
const directoryRelated = {
  en: {
    campus: ['campus clinic', 'public health'],
    'campus clinic': ['campus', 'rehabilitation'],
    rehabilitation: ['physical therapy', 'rehabilitation services'],
    'physical therapy': ['rehabilitation', 'sports medicine'],
    'rehabilitation services': ['rehabilitation', 'physical therapy'],
    'sports medicine': ['physical therapy'],
  },
  es: { campus: ['campus norte', 'campus sur'], rehabilitación: ['terapia física'], clínica: ['campus norte', 'campus sur'] },
};
const relatedEnglish = query => directoryRelated.en[query.toLowerCase()] ?? [];
const relatedSpanish = query => directoryRelated.es[query.toLowerCase()] ?? [];

export const spanishPromotionQuery = 'clínica de gripe del campus';

function promotionMode(query, setting) {
  return samplePromotionMode(query.trim().toLowerCase() === spanishPromotionQuery ? samplePromotionQuery : query, setting);
}

export function orderDirectoryResults(items, sort, query, setting) {
  if (sort) {
    const direction = sort === 'url desc' ? -1 : 1;
    return items.sort((a, b) => direction * a.url.localeCompare(b.url));
  }
  const ranked = applySampleIndexedPromotion(items, { response: { start: 0 } }, promotionMode(query, setting));
  return ranked.map(item => ({ ...item, promoted: Boolean(item.sampleIndexedPromotion) }));
}

export function setupProfileFeatures(panel, submit) {
  const form = panel.querySelector('form');
  const setSuggestions = setupSearchSuggestions(form, 'profile-search-suggestions');
  const related = setupRelatedSearches(form, term => { form.querySelector('input').focus(); submit(term); });
  const answers = setupCustomerAnswers(panel);
  const sampleAnswer = panel.querySelector('.smart-answers-sample');
  const englishAnswer = [...sampleAnswer.querySelectorAll('summary, .smart-answers-sample__note, strong, .smart-answers-sample__card > p:nth-child(3), a')].map(node => [node, node.textContent]);
  const spanishAnswer = ['Ejemplo de Smart Answers', 'Un ejemplo fijo con contenido ficticio.', '¿Qué incluye la exposición del Centro de Rehabilitación?', 'Incluye la distribución de un apartamento modelo y planos de mobiliario ajustable. Los dibujos de las paredes señalan puertas, zonas de circulación y movimiento.', 'Lee la página del Centro de Rehabilitación en inglés'];
  const sampleBanner = createSampleExternalPromotion();
  const bannerLink = sampleBanner.querySelector('a');
  const englishBannerTitle = bannerLink.textContent;
  const host = panel.querySelector('[data-exp-promotions]');
  const remoteBanners = document.createElement('div');
  host.append(remoteBanners);
  let heading;
  let app;
  let active;
  let suggestions;
  let relatedTerms;
  let answerQuery;

  function clear() {
    answers.clear();
    answerQuery = undefined;
    related.clear();
    setSuggestions(null);
    sampleAnswer.hidden = true;
    sampleBanner.remove();
    sampleBanner.hidden = true;
    remoteBanners.replaceChildren();
    app = active = undefined;
  }

  return {
    clear,
    update(design, connection, profile, query) {
      if (app !== connection || active !== profile) {
        clear();
        app = connection;
        if (!app) host.prepend(sampleBanner);
        active = profile;
        const es = active.language.split(/[-_]/)[0] === 'es';
        related.setLabel(es ? 'Búsquedas relacionadas' : 'Related searches');
        englishAnswer.forEach(([node, text], i) => { node.textContent = es ? spanishAnswer[i] : text; });
        sampleAnswer.lang = es ? 'es' : 'en';
        const bannerLabel = es ? 'Promoción externa de ejemplo' : 'Sample external promotion';
        sampleBanner.setAttribute('aria-label', bannerLabel);
        sampleBanner.querySelector('p').dataset.defaultLabel = bannerLabel;
        bannerLink.textContent = es ? 'Lee el aviso ficticio de citas de vacunación' : englishBannerTitle;
        suggestions = app
          ? app.suggestEndpoint && createCustomerSuggestionSource({ ...app, ...active }, app.suggestEndpoint)
          : active.language === 'es' ? spanishSuggestions : sampleSuggestionSource;
        const entitled = app ? app.configuration?.entitlements.relatedSearches : true;
        relatedTerms = featureStatus(entitled, active.relatedSearches) !== 'On' ? null
          : app ? relatedSource(app.relatedURL, app.discoveryKey, active.language)
          : active.language === 'es' ? relatedSpanish : relatedEnglish;
      }
      heading = design.promotionHeading;
      placePromotionBanners(host, panel.querySelector('#lab-exp-results'), design.bannerPlacement);
      updatePromotionLabels(panel, design);
      setSuggestions(app || design.showSuggestions ? suggestions : null);
      void related.show(panel.querySelector('#lab-exp-results'), app && design.relatedPlacement === 'off' ? 'below' : design.relatedPlacement, query, relatedTerms);
      sampleAnswer.hidden = Boolean(app) || !active.smartAnswers || !design.showSmartAnswersSample;
      if (sampleAnswer.hidden) sampleAnswer.open = false;
      updateSampleExternalPromotion(sampleBanner, app ? 'off' : promotionMode(query, design.samplePromotions));
      if (app?.answerEndpoint && featureStatus(app.configuration?.entitlements.smartAnswers, active.smartAnswers) === 'On' && answerQuery !== query) {
        answerQuery = query;
        if (query) void answers.start({ ...app, ...active }, query);
        else answers.clear();
      }
    },
    showExternalPromotions(promotions) {
      renderPromotionBanners(remoteBanners, promotions, heading, active?.language, true);
    },
  };
}
`,vt=`import { webURL } from "./web-url.js";
const FONT_STACKS = {
	arial: "Arial, Helvetica, sans-serif",
	verdana: "Verdana, Geneva, sans-serif",
	tahoma: "Tahoma, Geneva, sans-serif",
	trebuchet: "\\"Trebuchet MS\\", Helvetica, sans-serif",
	georgia: "Georgia, \\"Times New Roman\\", serif",
	times: "\\"Times New Roman\\", Times, serif",
	courier: "\\"Courier New\\", Courier, monospace"
};
const RESULT_GAPS = {
	compact: "6px",
	standard: "12px",
	roomy: "20px"
};
const CORNER_RADII = {
	standard: "5px",
	square: "0px",
	rounded: "14px"
};
export const PAGE_SIZES = [
	5,
	10,
	20
];
export const DEFAULT_DESIGN = {
	highlightStyle: "default",
	promotionBadge: "Promoted",
	promotionHeading: "Featured link",
	badgeStyle: "text",
	bannerStyle: "tinted",
	bannerPlacement: "above",
	highlightText: "#202020",
	highlightBackground: "#ffec99",
	previewSource: "app",
	layout: "list",
	resultSpacing: "standard",
	filterPlacement: "sidebar",
	topFilterStyle: "list",
	relatedPlacement: "below",
	profileTabs: false,
	languagePicker: false,
	filters: true,
	showDescriptions: true,
	showThumbnails: false,
	showSorting: true,
	showSuggestions: false,
	showSmartAnswersSample: true,
	samplePromotions: "off",
	resultsPerPage: 10,
	color: "#263f58",
	background: "#ffffff",
	logoURL: "",
	corners: "standard",
	listDividers: true,
	underlineTitles: false,
	font: "arial",
	searchFieldText: "Search the website",
	searchButtonText: "Search",
	noResultsText: "No matching pages. Try another search or remove a filter."
};
export function isLayout(value) {
	return value === "list" || value === "cards";
}
export function isResultSpacing(value) {
	return value !== null && Object.hasOwn(RESULT_GAPS, value);
}
export function readPageSize(value) {
	return PAGE_SIZES.find((size) => String(size) === value) ?? DEFAULT_DESIGN.resultsPerPage;
}
export function readSamplePromotions(value) {
	return value === "indexed" || value === "external" || value === "both" ? value : "off";
}
export function isFont(value) {
	return value !== null && Object.hasOwn(FONT_STACKS, value);
}
export function isHexColor(value) {
	return /^#[\\da-f]{6}$/i.test(value);
}
export function readHighlightStyle(value) {
	return value === "bold" || value === "italic" || value === "color" || value === "plain" ? value : "default";
}
export function readCorners(value) {
	return value !== null && Object.hasOwn(CORNER_RADII, value) ? value : DEFAULT_DESIGN.corners;
}
export function readLogoURL(value) {
	const url = webURL(value ?? "");
	return url?.startsWith("https:") ? url : "";
}
export function resolveSearchText(value, fallback) {
	return value?.replace(/[\\r\\n]+/g, " ").trim() || fallback;
}
export function readDesignParams(params, allowFictionalPreview = false) {
	// Earlier share links and session drafts always wrote these four fields and omitted sorting when off.
	const savedDesign = [
		"lab_layout",
		"lab_color",
		"lab_font",
		"lab_filters"
	].every((key) => params.has(key));
	const layout = params.get("lab_layout");
	const topStyle = params.get("lab_top_filters");
	const spacing = params.get("lab_spacing");
	const font = params.get("lab_font");
	const color = "#" + (params.get("lab_color") ?? "").toLowerCase();
	const background = "#" + (params.get("lab_background") ?? "").toLowerCase();
	return {
		promotionBadge: resolveSearchText(params.get("lab_badge"), DEFAULT_DESIGN.promotionBadge),
		promotionHeading: resolveSearchText(params.get("lab_promo_heading"), DEFAULT_DESIGN.promotionHeading),
		badgeStyle: params.get("lab_badge_style") === "pill" ? "pill" : "text",
		bannerStyle: params.get("lab_banner_style") === "outline" ? "outline" : "tinted",
		bannerPlacement: params.get("lab_banner_placement") === "below" ? "below" : "above",
		highlightStyle: readHighlightStyle(params.get("lab_highlight")),
		highlightText: readHighlightColor(params.get("lab_hit_text"), DEFAULT_DESIGN.highlightText),
		highlightBackground: readHighlightColor(params.get("lab_hit_bg"), DEFAULT_DESIGN.highlightBackground),
		previewSource: allowFictionalPreview && params.get("lab_source") === "fictional" ? "fictional" : "app",
		layout: isLayout(layout) ? layout : DEFAULT_DESIGN.layout,
		resultSpacing: isResultSpacing(spacing) ? spacing : DEFAULT_DESIGN.resultSpacing,
		topFilterStyle: topStyle === "row" || topStyle === "tabs" ? "row" : "list",
		filterPlacement: params.get("lab_filter_placement") === "top" ? "top" : "sidebar",
		relatedPlacement: params.get("lab_related") === "above" ? "above" : params.get("lab_related") === "off" ? "off" : "below",
		languagePicker: params.has("lab_languages") ? params.get("lab_languages") === "on" : params.get("lab_profile_tabs") === "on",
		profileTabs: params.get("lab_profile_tabs") === "on",
		filters: params.get("lab_filters") !== "off",
		showDescriptions: params.get("lab_descriptions") !== "off",
		showThumbnails: params.get("lab_thumbnails") === "on",
		showSorting: params.has("lab_sorting") ? params.get("lab_sorting") === "on" : !savedDesign && DEFAULT_DESIGN.showSorting,
		showSuggestions: params.get("lab_suggestions") === "on",
		showSmartAnswersSample: params.get("lab_answer_sample") !== "off",
		samplePromotions: readSamplePromotions(params.get("lab_promotions")),
		resultsPerPage: readPageSize(params.get("lab_page_size")),
		color: isHexColor(color) ? color : DEFAULT_DESIGN.color,
		background: isHexColor(background) ? background : DEFAULT_DESIGN.background,
		logoURL: readLogoURL(params.get("lab_logo")),
		corners: readCorners(params.get("lab_corners")),
		listDividers: params.get("lab_dividers") !== "off",
		underlineTitles: params.get("lab_underline") === "on",
		font: isFont(font) ? font : DEFAULT_DESIGN.font,
		searchFieldText: resolveSearchText(params.get("lab_field_text"), DEFAULT_DESIGN.searchFieldText),
		searchButtonText: resolveSearchText(params.get("lab_button_text"), DEFAULT_DESIGN.searchButtonText),
		noResultsText: resolveSearchText(params.get("lab_no_results_text"), DEFAULT_DESIGN.noResultsText)
	};
}
export function writeDesignParams(params, design) {
	if (design.promotionBadge !== DEFAULT_DESIGN.promotionBadge) params.set("lab_badge", design.promotionBadge);
	if (design.promotionHeading !== DEFAULT_DESIGN.promotionHeading) params.set("lab_promo_heading", design.promotionHeading);
	if (design.badgeStyle !== DEFAULT_DESIGN.badgeStyle) params.set("lab_badge_style", design.badgeStyle);
	if (design.bannerStyle !== DEFAULT_DESIGN.bannerStyle) params.set("lab_banner_style", design.bannerStyle);
	if (design.bannerPlacement !== DEFAULT_DESIGN.bannerPlacement) params.set("lab_banner_placement", design.bannerPlacement);
	if (design.highlightStyle !== "default") params.set("lab_highlight", design.highlightStyle);
	else params.delete("lab_highlight");
	for (const [key, value, fallback] of [[
		"lab_hit_text",
		design.highlightText,
		DEFAULT_DESIGN.highlightText
	], [
		"lab_hit_bg",
		design.highlightBackground,
		DEFAULT_DESIGN.highlightBackground
	]]) {
		if (value !== fallback) params.set(key, value.slice(1));
		else params.delete(key);
	}
	if (design.previewSource === "fictional") params.set("lab_source", "fictional");
	else params.delete("lab_source");
	if (design.languagePicker || design.profileTabs) params.set("lab_languages", design.languagePicker ? "on" : "off");
	if (design.profileTabs) params.set("lab_profile_tabs", "on");
	params.set("lab_layout", design.layout);
	params.set("lab_color", design.color.slice(1));
	params.set("lab_font", design.font);
	params.set("lab_filters", design.filters ? "on" : "off");
	if (design.topFilterStyle !== "list") params.set("lab_top_filters", design.topFilterStyle);
	if (design.filterPlacement === "top") params.set("lab_filter_placement", "top");
	if (design.relatedPlacement !== "below") params.set("lab_related", design.relatedPlacement);
	if (design.background !== DEFAULT_DESIGN.background) params.set("lab_background", design.background.slice(1));
	if (design.logoURL) params.set("lab_logo", design.logoURL);
	if (design.corners !== DEFAULT_DESIGN.corners) params.set("lab_corners", design.corners);
	if (!design.listDividers) params.set("lab_dividers", "off");
	if (design.underlineTitles) params.set("lab_underline", "on");
	if (design.resultSpacing !== DEFAULT_DESIGN.resultSpacing) {
		params.set("lab_spacing", design.resultSpacing);
	}
	if (!design.showDescriptions) {
		params.set("lab_descriptions", "off");
	}
	if (design.showThumbnails) {
		params.set("lab_thumbnails", "on");
	}
	params.set("lab_sorting", design.showSorting ? "on" : "off");
	if (design.showSuggestions) {
		params.set("lab_suggestions", "on");
	}
	if (!design.showSmartAnswersSample) {
		params.set("lab_answer_sample", "off");
	}
	if (design.samplePromotions !== "off") {
		params.set("lab_promotions", design.samplePromotions);
	}
	if (design.resultsPerPage !== DEFAULT_DESIGN.resultsPerPage) {
		params.set("lab_page_size", String(design.resultsPerPage));
	}
	if (design.searchFieldText !== DEFAULT_DESIGN.searchFieldText) {
		params.set("lab_field_text", design.searchFieldText);
	}
	if (design.searchButtonText !== DEFAULT_DESIGN.searchButtonText) {
		params.set("lab_button_text", design.searchButtonText);
	}
	if (design.noResultsText !== DEFAULT_DESIGN.noResultsText) {
		params.set("lab_no_results_text", design.noResultsText);
	}
}
function readHighlightColor(value, fallback) {
	return value && isHexColor("#" + value) ? "#" + value.toLowerCase() : fallback;
}
function relativeLuminance(color) {
	const channels = [
		1,
		3,
		5
	].map((index) => {
		const channel = parseInt(color.slice(index, index + 2), 16) / 255;
		return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
	});
	const [red, green, blue] = channels;
	return red * .2126 + green * .7152 + blue * .0722;
}
export function contrastRatio(foreground, background) {
	const a = relativeLuminance(foreground);
	const b = relativeLuminance(background);
	return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
function contrastText(color) {
	const luminance = relativeLuminance(color);
	const contrastOnBlack = (luminance + .05) / .05;
	const contrastOnWhite = 1.05 / (luminance + .05);
	return contrastOnBlack >= contrastOnWhite ? "#000000" : "#ffffff";
}
export function designVariables(design) {
	const topStyle = design.filterPlacement === "top" ? design.topFilterStyle : "list";
	const darkBackground = contrastText(design.background) === "#ffffff";
	return {
		"--promotion-badge-padding": design.badgeStyle === "pill" ? "2px 10px" : "0",
		"--promotion-badge-border": design.badgeStyle === "pill" ? "1px solid currentColor" : "0",
		"--promotion-banner-background": design.bannerStyle === "outline" ? "transparent" : "#f3f7f4",
		"--promotion-banner-ink": design.bannerStyle === "outline" ? "inherit" : "#253a34",
		"--search-hit-weight": design.highlightStyle === "bold" ? "bold" : "inherit",
		"--search-hit-style": design.highlightStyle === "italic" ? "italic" : "inherit",
		"--search-hit-ink": design.highlightStyle === "color" ? contrastRatio(design.highlightText, design.highlightBackground) >= 4.5 ? design.highlightText : contrastText(design.highlightBackground) : design.highlightStyle === "default" ? "MarkText" : "inherit",
		"--search-hit-background": design.highlightStyle === "color" ? design.highlightBackground : design.highlightStyle === "default" ? "Mark" : "transparent",
		"--search-hit-forced-ink": ["color", "default"].includes(design.highlightStyle) ? "HighlightText" : "inherit",
		"--search-hit-forced-background": ["color", "default"].includes(design.highlightStyle) ? "Highlight" : "transparent",
		"--search-accent": design.color,
		"--search-accent-text": contrastText(design.color),
		"--search-background": design.background,
		// Keep the original palette on white and choose a contrasting ink for custom colors.
		"--search-ink": design.background === DEFAULT_DESIGN.background ? "#202e3a" : contrastText(design.background),
		"--search-title-ink": design.background === DEFAULT_DESIGN.background ? "#263f58" : contrastText(design.background),
		"--search-divider": design.background === DEFAULT_DESIGN.background ? "#d8dfe3" : darkBackground ? "#a1aab1" : "#79838a",
		"--search-corners": CORNER_RADII[design.corners],
		"--search-filter-display": topStyle === "list" ? "block" : "flex",
		"--search-font": FONT_STACKS[design.font],
		"--search-result-gap": RESULT_GAPS[design.resultSpacing]
	};
}
`,yt=`export const demoSortOptions = [
	{
		label: "Relevance",
		order: ""
	},
	{
		label: "Page address (A–Z)",
		order: "url asc"
	},
	{
		label: "Page address (Z–A)",
		order: "url desc"
	}
];
`,bt=`/** Inline feedback belongs to the control that requested the search, including a pager. */
export function createSearchRecovery(defaultControl, repeat) {
	const group = document.createElement("div");
	group.className = "search-recovery";
	group.hidden = true;
	const message = document.createElement("p");
	message.className = "search-lab__feedback";
	message.dataset.tone = "error";
	message.id = "search-error-" + ++nextId;
	message.setAttribute("role", "status");
	message.tabIndex = -1;
	const retry = document.createElement("button");
	retry.type = "button";
	retry.className = "lt-btn lt-btn--secondary";
	retry.setAttribute("aria-describedby", message.id);
	group.append(message, retry);
	let anchor;
	let control;
	let pending = false;
	let focusAtStart;
	function clear() {
		if (group.contains(document.activeElement)) {
			const target = control?.isConnected && control.getClientRects().length && !control.matches(":disabled") ? control : defaultControl;
			target.focus({ preventScroll: true });
		}
		group.hidden = true;
		message.textContent = "";
		pending = false;
	}
	retry.addEventListener("click", () => {
		if (!pending) repeat();
	});
	return {
		begin(place, trigger = defaultControl) {
			if (place !== anchor || document.activeElement !== retry) clear();
			else message.textContent = "";
			anchor = place;
			control = trigger;
			pending = true;
			focusAtStart = document.activeElement;
			retry.setAttribute("aria-disabled", "true");
		},
		error(text, label = "Retry search") {
			pending = false;
			retry.removeAttribute("aria-disabled");
			retry.textContent = label;
			if (!anchor.isConnected) anchor = defaultControl.closest("form") || defaultControl;
			if (anchor.nextElementSibling !== group) anchor.after(group);
			group.hidden = false;
			message.textContent = text;
			// If the learner has moved on during the request, leave their position alone.
			requestAnimationFrame(() => {
				if (group.hidden || pending || !anchor.getClientRects().length) return;
				const area = anchor.getBoundingClientRect();
				const bounds = group.getBoundingClientRect();
				const focus = document.activeElement;
				const stillAtControl = focus === focusAtStart || anchor.contains(focus) || group.contains(focus);
				if (stillAtControl && area.bottom >= 0 && area.top < innerHeight && (bounds.top < 8 || bounds.bottom > innerHeight - 8)) {
					group.scrollIntoView({
						block: "center",
						behavior: "instant"
					});
				}
			});
		},
		clear
	};
}
let nextId = 0;
`,xt=`import { passageParts, resultCards } from './result-card.js';
import { demoResultText, demoResultTitle } from './demo-content.js';

// Use the raw profile response so a kit-normalized description cannot discard the passage.
export function starterPassages(response, demo) {
  const documents = response?.response?.docs ?? [];
  const key = response?.responseHeader?.params?.uniqueId;
  const { cards } = resultCards(response, documents);
  const byId = new Map();
  if (key) documents.forEach((doc, i) => byId.set(String(doc[key]), cards[i]));
  return item => {
    const card = byId.get(String(item.uniqueId));
    const values = card?.values ?? [];
    function parts(role, fallback = '') {
      const field = values.find(value => value.role === role);
      if (field) return passageParts(field.value, field.highlighted);
      const value = String(fallback ?? '');
      const text = demo ? (role === 'title' ? demoResultTitle(value) : demoResultText(value)) : value;
      return passageParts(text);
    }
    const ribbonParts = parts('ribbon', item.ribbon).filter(part => part.text);
    return {
      promoted: card?.promoted ?? item.promoted === true,
      titleParts: parts('title', item.title || item.url),
      descriptionParts: parts('description', item.description).filter(part => part.text),
      hasRibbon: ribbonParts.length > 0,
      ribbonParts,
      otherFields: values.filter(field => !['title', 'description', 'ribbon'].includes(field.role))
        .map(field => ({ label: field.label, parts: passageParts(field.value, field.highlighted) })),
    };
  };
}
`,St=`import { webURL } from "./web-url.js";
function displayText(value, separator = ", ") {
	if (Array.isArray(value)) return value.map((item) => displayText(item)).filter(Boolean).join(separator);
	return [
		"number",
		"string",
		"boolean"
	].includes(typeof value) ? String(value) : "";
}
export function mapResultCard(doc, fields, highlights, unit = "") {
	const card = {
		url: "",
		thumbnail: "",
		values: [],
		promoted: doc["[elevated]"] === true
	};
	const mapped = new Set();
	for (const field of fields) {
		if (!field || typeof field.name !== "string" || !Object.hasOwn(doc, field.name) && !Object.hasOwn(highlights ?? {}, field.name)) continue;
		const role = field.result_card ?? "";
		if (role && mapped.has(role)) continue;
		mapped.add(role);
		const raw = displayText(doc[field.name], role === "paths" ? " / " : ", ");
		if (role === "url" || role === "thumbnail") {
			card[role] = webURL(raw) || "";
			continue;
		}
		const hit = displayText(highlights?.[field.name], " ");
		let value = hit || raw;
		if (!value) continue;
		if (role === "distance") {
			if (!Number.isFinite(Number(raw))) continue;
			value = [Math.floor(Number(raw)), unit].filter((value) => value !== "").join(" ");
		}
		card.values.push({
			role,
			label: typeof field.title === "string" ? field.title : "",
			value,
			highlighted: !!hit
		});
	}
	return card;
}
export function resultCards(payload, documents, configured) {
	const fields = payload.metadata?.results;
	const mappingsKnown = Array.isArray(fields);
	const params = payload.responseHeader?.params;
	const hl = params?.hl;
	const responseSetting = String(hl) === "true" ? true : String(hl) === "false" ? false : undefined;
	const highlighting = configured ?? responseSetting;
	const cards = documents.map((doc) => {
		const key = params?.uniqueId;
		const id = key && doc?.[key];
		const hits = highlighting === true && (typeof id === "string" || typeof id === "number") ? payload.highlighting?.[id] : undefined;
		return mapResultCard(doc ?? {}, mappingsKnown ? fields : [], hits, payload.metadata?.locationSearch?.unit);
	});
	return {
		cards,
		mappingsKnown,
		highlighting
	};
}
export function resultMappingNotice(mappingsKnown, displayed, total) {
	if (!mappingsKnown) return "Results Fields are unknown for this profile.";
	return !displayed && total > 0 ? "No configured Results Fields have a displayable value on this page." : "";
}
// Only the search service’s bare emphasis tags are markup. Everything else is text.
export function passageParts(value, highlighted = false) {
	if (!highlighted) return [{
		text: value,
		matched: false
	}];
	let depth = 0;
	const parts = [];
	for (const token of value.split(/(<\\/?(?:em|mark|b|strong)>)/gi)) {
		if (!token) continue;
		if (/^<(?:em|mark|b|strong)>$/i.test(token)) depth++;
		else if (/^<\\/(?:em|mark|b|strong)>$/i.test(token)) depth = Math.max(0, depth - 1);
		else parts.push({
			text: token,
			matched: depth > 0
		});
	}
	return parts;
}
function appendValue(node, field) {
	for (const part of passageParts(field.value, field.highlighted)) {
		if (part.matched) {
			const mark = document.createElement("mark");
			mark.className = "search-result-hit";
			mark.textContent = part.text;
			node.append(mark);
		} else node.append(part.text);
	}
}
export function appendResultCard(node, card) {
	node.classList.add("mapped-result-card");
	const ribbon = card.values.find((field) => field.role === "ribbon");
	if (ribbon) {
		const badge = document.createElement("span");
		badge.className = "searchstax-search-result-ribbon";
		appendValue(badge, ribbon);
		node.append(badge);
	}
	if (card.thumbnail) {
		const image = document.createElement("img");
		image.src = card.thumbnail;
		image.className = "mapped-result-thumbnail";
		image.alt = "";
		image.loading = "lazy";
		image.referrerPolicy = "no-referrer";
		node.append(image);
	}
	const title = card.values.find((field) => field.role === "title");
	if (title || card.url) {
		const heading = document.createElement("h4");
		const name = card.url ? document.createElement("a") : document.createElement("span");
		name.className = "searchstax-search-result-title";
		if (name instanceof HTMLAnchorElement) {
			name.href = card.url;
			name.referrerPolicy = "no-referrer";
		}
		if (title) appendValue(name, title);
		else name.textContent = card.url;
		heading.append(name);
		node.append(heading);
	}
	for (const field of card.values.filter((f) => f.role !== "title" && f.role !== "ribbon").sort((a, b) => Number(!a.role) - Number(!b.role))) {
		const line = document.createElement("p");
		if (field.role === "description") line.className = "search-lab__result-description";
		if (field.label) line.append(field.label + ": ");
		if (field.role === "paths" || field.role === "date" || field.role === "distance") line.className = "mapped-result-" + field.role;
		const imageURL = !field.role && /\\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(field.value) ? webURL(field.value) : null;
		if (imageURL) {
			const image = document.createElement("img");
			image.className = "mapped-result-thumbnail";
			image.src = imageURL;
			image.alt = "";
			image.referrerPolicy = "no-referrer";
			line.append(image);
		} else if (field.role === "date" && /^\\d{4}-\\d{2}-\\d{2}(?:T\\S+)?$/.test(field.value) && Number.isFinite(Date.parse(field.value))) {
			const time = document.createElement("time");
			time.dateTime = field.value;
			time.textContent = field.value;
			line.append(time);
		} else appendValue(line, field);
		node.append(line);
	}
}
`,Ct=`const record = (value) => !!value && typeof value === "object" && !Array.isArray(value);
function flag(value) {
	if (value == null) return undefined;
	if (typeof value !== "boolean") throw Error("Use true, false, or null for each feature setting.");
	return value;
}
// Search Lab snapshot format. Only these nonsecret settings enter preview state.
export function readAppConfiguration(text, endpoint) {
	let data;
	try {
		data = JSON.parse(text);
	} catch {
		throw Error("Choose a valid Search Lab configuration JSON file.");
	}
	if (!record(data) || typeof data.endpoint !== "string" || data.endpoint.replace(/\\/$/, "") !== endpoint.replace(/\\/$/, "")) {
		throw Error("The snapshot’s Select endpoint must match the app you’re connecting to.");
	}
	if (!Array.isArray(data.profiles)) throw Error("The snapshot needs a profiles array from this app.");
	const seen = new Set();
	const profiles = data.profiles.map((item) => {
		if (!record(item) || typeof item.profile !== "string" || !item.profile.trim() || typeof item.language !== "string" || !/^[a-z][a-z0-9]*(?:[-_][a-z0-9]+)*$/i.test(item.language.trim())) {
			throw Error("Each snapshot profile needs a name and a language code.");
		}
		const profile = item.profile.trim();
		const language = item.language.trim().toLowerCase().replaceAll("-", "_");
		const key = JSON.stringify([language, profile]);
		if (seen.has(key)) throw Error("The snapshot lists the same language and profile twice.");
		seen.add(key);
		return {
			language,
			profile,
			relatedSearches: flag(item.relatedSearches),
			smartAnswers: flag(item.smartAnswers),
			highlighting: flag(item.highlighting)
		};
	});
	const languageFlags = data.relatedSearchesByLanguage;
	const settings = new Map();
	if (languageFlags !== undefined) {
		if (!record(languageFlags)) throw Error("Use a language-to-setting object for Related Searches.");
		for (const [code, value] of Object.entries(languageFlags)) settings.set(code.toLowerCase().replaceAll("-", "_"), flag(value));
	} else {
		// Older snapshots stored the language setting on each profile. Conflicting values are unknown.
		for (const { language, relatedSearches } of profiles) {
			if (relatedSearches === undefined) continue;
			if (!settings.has(language)) settings.set(language, relatedSearches);
			else if (settings.get(language) !== relatedSearches) settings.set(language, undefined);
		}
	}
	for (const profile of profiles) profile.relatedSearches = settings.get(profile.language);
	const features = data.entitlements ?? {};
	if (!record(features)) throw Error("The snapshot’s entitlements must be an object.");
	return {
		profiles,
		entitlements: {
			relatedSearches: flag(features.relatedSearches),
			smartAnswers: flag(features.smartAnswers)
		}
	};
}
// Bind exported settings to the original app without including a customer's Select URL.
export async function endpointFingerprint(endpoint) {
	if (!globalThis.crypto?.subtle) return "";
	const bytes = new TextEncoder().encode(endpoint.trim().replace(/\\/$/, ""));
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export function featureStatus(entitled, configured) {
	if (entitled === false) return "Unavailable";
	if (configured === false) return "Off";
	if (entitled === true && configured === true) return "On";
	return "Unknown";
}
export function profileStatus(entitlements, profile, highlight = profile?.highlighting, connection) {
	const label = (value) => value === undefined ? "unknown" : value ? "yes" : "no";
	return ["relatedSearches", "smartAnswers"].map((key) => {
		const name = key === "relatedSearches" ? "Related Searches" : "Smart Answers";
		const status = featureStatus(entitlements[key], profile?.[key]);
		const configured = name + " — " + status + " (entitled: " + label(entitlements[key]) + ", configured: " + label(profile?.[key]) + ").";
		if (status === "On" && connection) {
			if (key === "relatedSearches" && (!connection.relatedURL || !connection.discoveryKey)) return configured + " Add the Related Searches endpoint and Discovery key to preview it.";
			if (key === "smartAnswers" && !connection.answerEndpoint) return configured + " Add the Answer endpoint to preview it.";
		}
		return configured;
	}).concat("Hit highlighting — " + (highlight === undefined ? "Unknown" : highlight ? "On" : "Off") + ".").join(" ");
}
`,wt=`import { DEFAULT_DESIGN } from "./design.js";
import { setupProfileFeatures, orderDirectoryResults, spanishPromotionQuery } from "./profile-features.js";
import { demoSortOptions } from "./demo-sorting.js";
import { contentLanguageTag } from "./content-language.js";
import { createSearchRecovery } from "./search-recovery.js";
import { searchBuildApp, CustomerSearchError } from "./customer-search.js";
import { profileStatus } from "./app-configuration.js";
import { resultMappingNotice, appendResultCard, mapResultCard } from "./result-card.js";
const demoBase = "https://mw-searchstax.github.io/university-health-search-demo/";
const directory = [
	{
		section: "programs",
		topic: ["Nursing", "Enfermería"],
		path: "education/nursing-simulation/",
		enrollment: true,
		published: "2026-03-16",
		en: ["Nursing Simulation", "Explore campus classroom exercises, equipment and observation logs."],
		es: ["Simulación de enfermería", "Explora los ejercicios de aula, los materiales y los registros de observación del campus."]
	},
	{
		section: "programs",
		topic: ["Public health", "Salud pública"],
		path: "education/public-health/",
		en: ["Public Health", "Explore campus coursework on population health and community education."],
		es: ["Salud pública", "Conoce los cursos del campus sobre salud de la población y educación comunitaria."]
	},
	{
		section: "locations",
		topic: ["North campus", "Campus norte"],
		path: "locations/north-campus-clinic/",
		en: ["North Campus Clinic", "Find the teaching annex for primary care and neurology."],
		es: ["Clínica del campus norte", "Consulta la sede docente de atención primaria y neurología."]
	},
	{
		section: "locations",
		topic: ["South campus", "Campus sur"],
		path: "locations/south-campus-clinic/",
		en: ["South Campus Clinic", "Explore the teaching annex with illustration displays and seminar rooms."],
		es: ["Clínica del campus sur", "Conoce la sede docente con salas de seminarios y exposiciones de ilustraciones."]
	},
	{
		section: "programs",
		topic: ["Rehabilitation", "Rehabilitación"],
		path: "care/services/rehabilitation/",
		en: ["Rehabilitation", "Explore rehabilitation, physical therapy and sports medicine coursework."],
		es: ["Rehabilitación", "Explora la formación en rehabilitación, terapia física y medicina deportiva."]
	},
	{
		section: "locations",
		topic: ["Rehabilitation", "Rehabilitación"],
		path: "locations/rehabilitation-center/",
		en: ["Rehabilitation Center", "See the rehabilitation center’s physical therapy teaching space."],
		es: ["Centro de rehabilitación", "Conoce el espacio docente de terapia física del centro de rehabilitación."]
	},
	{
		section: "programs",
		topic: ["Orthopedics", "Ortopedia"],
		path: "care/services/orthopedics/",
		en: ["Orthopedics", "Explore joint models and illustrated teaching materials."],
		es: ["Ortopedia", "Explora modelos articulares y materiales de enseñanza ilustrados."]
	},
	{
		section: "shared",
		topic: ["Flu clinic", "Clínica de gripe"],
		path: "news/flu-clinic-update-2024/",
		published: "2024-09-15",
		en: ["Flu Clinic Updates — 2024 Archive", "Archived campus flu clinic teaching notices."],
		es: ["Clínica de gripe — Archivo de 2024", "Avisos anteriores de la clínica de gripe del campus."]
	},
	{
		section: "shared",
		topic: ["Flu clinic", "Clínica de gripe"],
		path: "news/flu-clinic-update-2026/",
		published: "2026-09-15",
		en: ["Flu Clinic Updates — 2026 Notice", "The current campus flu clinic notice."],
		es: ["Clínica de gripe — Aviso de 2026", "El aviso actual de la clínica de gripe del campus."]
	}
];
export const demoProfiles = [
	{
		language: "en",
		profile: "Programs",
		section: "programs"
	},
	{
		language: "en",
		profile: "Locations",
		section: "locations"
	},
	{
		language: "es",
		profile: "Programas",
		section: "programs"
	},
	{
		language: "es",
		profile: "Ubicaciones",
		section: "locations"
	}
].map((item) => ({
	...item,
	relatedSearches: item.section !== "locations",
	smartAnswers: item.section === "programs",
	highlighting: item.section === "programs"
}));
function searchDirectory(active, query, tabs, filters) {
	const spanish = active.language === "es";
	const scope = demoProfiles.find((item) => item.language === active.language && item.profile === active.profile);
	const items = directory.filter((doc) => !tabs || doc.section === scope?.section || doc.section === "shared").map((doc) => {
		const [title, description] = spanish ? doc.es : doc.en;
		const type = demoProfiles.find((item) => item.language === active.language && item.section === doc.section)?.profile ?? (spanish ? "Avisos" : "Notices");
		return {
			title,
			description,
			url: demoBase + doc.path,
			type,
			topic: doc.topic[spanish ? 1 : 0],
			enrollment: doc.enrollment,
			published: doc.published
		};
	}).filter((doc) => query.toLocaleLowerCase().split(/\\s+/).every((word) => (doc.title + " " + doc.description).toLocaleLowerCase().includes(word)));
	const field = tabs ? "topic" : "type";
	const valueOf = (doc) => tabs ? doc.topic : doc.type;
	const counts = new Map();
	for (const doc of items) counts.set(valueOf(doc), (counts.get(valueOf(doc)) ?? 0) + 1);
	const entries = items.filter((doc) => !filters.has(field) || valueOf(doc) === filters.get(field));
	return {
		entries,
		total: entries.length,
		facets: [{
			field,
			label: tabs ? scope?.section === "locations" ? "Campus" : spanish ? "Área de estudio" : "Field of study" : spanish ? "Tipo de contenido" : "Content type",
			choices: [...counts].map(([value, count]) => ({
				value,
				count
			}))
		}]
	};
}
function directoryCards(entries, profile, query, thumbnails) {
	const locations = demoProfiles.find((item) => item.profile === profile.profile)?.section === "locations";
	const fields = [
		{
			name: "title",
			result_card: "title"
		},
		{
			name: "url",
			result_card: "url"
		},
		{
			name: "description",
			result_card: "description"
		},
		{
			name: "type",
			result_card: locations ? "paths" : "ribbon"
		},
		{
			name: "published",
			result_card: "date",
			title: profile.language === "es" ? "Fecha de publicación" : "Published"
		},
		{
			name: "enrollment",
			result_card: "",
			title: profile.language === "es" ? "Inscripción abierta" : "Open for enrollment"
		},
		{
			name: "topic",
			result_card: "",
			title: profile.language === "es" ? "Tema" : "Topic"
		}
	];
	return entries.map((entry) => {
		const card = mapResultCard(entry, fields);
		if (profile.highlighting) {
			for (const field of card.values) {
				const at = field.value.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
				if (at < 0) continue;
				const text = field.value;
				field.value = text.slice(0, at) + "<em>" + text.slice(at, at + query.length) + "</em>" + text.slice(at + query.length);
				field.highlighted = true;
			}
		}
		card.promoted = Boolean(entry.promoted);
		// These URLs are bundled fixture images. Connected cards use their mapped thumbnail field.
		card.thumbnail = thumbnails[entry.url] ?? "";
		return card;
	});
}
export function experienceHandoff(connected = false, catalog = demoProfiles, active = catalog[0], query = "campus", defaultLanguage = demoProfiles[0].language) {
	return {
		source: connected ? "app" : "demo",
		defaultLanguage,
		profiles: catalog.map(({ language, profile, relatedSearches, smartAnswers, highlighting }) => ({
			language,
			profile,
			relatedSearches,
			smartAnswers,
			highlighting
		})),
		selected: {
			language: active.language,
			profile: active.profile
		},
		initialQuery: connected ? "" : query
	};
}
const languageName = (code) => {
	if (!code) return "App default language";
	const tag = contentLanguageTag(code);
	if (!tag) return code;
	try {
		return new Intl.DisplayNames(["en"], { type: "language" }).of(tag) || code;
	} catch {
		return code;
	}
};
export function setupExperiencePreview(panel, thumbnails) {
	const field = (selector) => panel.querySelector(selector);
	const language = field("[data-exp-language] select");
	const tabs = field("[role=\\"tablist\\"]");
	const results = field("[role=\\"tabpanel\\"]");
	const list = field(".experience-results ul");
	const status = results.querySelector("[role=\\"status\\"]");
	const input = field("input[type=\\"search\\"]");
	const previous = field("[data-exp-prev]");
	const next = field("[data-exp-next]");
	const info = field("[data-exp-source]");
	const pages = field("[data-exp-pages]");
	let app = null;
	let allProfiles = demoProfiles;
	let tabProfiles = allProfiles;
	let catalog = allProfiles;
	let active = catalog[0];
	let defaultLanguage = demoProfiles[0].language;
	let startingProfile = active;
	function profileForLanguage(code, preferred) {
		const choices = catalog.filter((item) => item.language === code);
		return choices.find((item) => item.profile === preferred?.profile) ?? choices.find((item) => item.profile === startingProfile?.profile && item.language === startingProfile.language) ?? choices[0] ?? {
			language: code,
			profile: ""
		};
	}
	let query = "campus";
	let start = 0;
	let displayedStart = 0;
	const searchForm = field("form");
	let lastAnchor = searchForm;
	let lastControl = input;
	const recovery = createSearchRecovery(input, () => {
		void search(lastAnchor, lastControl);
	});
	let options = { ...DEFAULT_DESIGN };
	const filters = new Map();
	const facets = field("[data-exp-facets]");
	const filterPanel = field("[data-exp-filter-panel]");
	const filterButton = field("[data-exp-filter-toggle]");
	const order = field("[data-exp-sort] select");
	const empty = field("[data-exp-empty]");
	let sorts = [];
	let noMatches = false;
	let mappingNotice = "";
	let highlighting;
	const features = setupProfileFeatures(panel, submit);
	const spanish = () => active.language.split(/[-_]/)[0] === "es";
	function updatePresentation() {
		const es = spanish();
		const fieldText = es && options.searchFieldText === DEFAULT_DESIGN.searchFieldText ? "Buscar en el sitio" : options.searchFieldText;
		input.placeholder = fieldText;
		field("form label").textContent = fieldText;
		field("form").setAttribute("aria-label", fieldText);
		field("button[type=\\"submit\\"]").textContent = es && options.searchButtonText === DEFAULT_DESIGN.searchButtonText ? "Buscar" : options.searchButtonText;
		empty.textContent = es && options.noResultsText === DEFAULT_DESIGN.noResultsText ? "No hay coincidencias. Prueba otra búsqueda o quita un filtro." : options.noResultsText;
		if (mappingNotice) empty.textContent = mappingNotice;
		empty.hidden = !noMatches && !mappingNotice;
		previous.textContent = es ? "Página anterior" : "Previous page";
		next.textContent = es ? "Página siguiente" : "Next page";
		filterButton.textContent = (es ? "Filtros" : "Filters") + (filters.size ? " (" + filters.size + ")" : "");
		field("[data-exp-sort] span").textContent = es ? "Ordenar por" : "Sort by";
		field("[data-exp-sort]").hidden = !options.showSorting || !sorts.length;
		field("[data-exp-sort-hint]").hidden = !app || !active.profile || !options.showSorting || Boolean(sorts.length);
		if (active.profile) features.update(options, app, active, query);
		else features.clear();
	}
	filterButton.addEventListener("click", () => {
		filterButton.setAttribute("aria-expanded", String(filterButton.getAttribute("aria-expanded") !== "true"));
	});
	order.addEventListener("change", () => {
		start = 0;
		void search(field("[data-exp-sort]"), order);
	});
	function showFacets(fields) {
		const focused = document.activeElement;
		const hadFocus = facets.contains(focused);
		facets.replaceChildren();
		for (const { field: name, label, choices } of fields) {
			if (!options.filters || !choices.length && !filters.has(name)) continue;
			const group = document.createElement("fieldset");
			const legend = document.createElement("legend");
			legend.textContent = label;
			group.append(legend);
			const all = active.language === "es" && !app ? "Todas las opciones" : "All";
			const values = [{
				value: "",
				count: 0
			}, ...choices];
			const selected = filters.get(name) || "";
			if (!values.some((choice) => choice.value === selected)) values.push({
				value: selected,
				count: 0
			});
			for (const choice of values) {
				const text = document.createElement("label");
				const radio = document.createElement("input");
				radio.type = "radio";
				radio.name = "exp-" + name;
				radio.value = choice.value;
				radio.checked = selected === choice.value;
				radio.addEventListener("change", () => {
					if (choice.value) filters.set(name, choice.value);
					else filters.delete(name);
					start = 0;
					void search(text, radio);
				});
				text.append(radio, choice.value ? choice.value + " (" + choice.count + ")" : all);
				group.append(text);
			}
			facets.append(group);
		}
		filterPanel.hidden = !facets.childElementCount;
		if (hadFocus) [...facets.querySelectorAll("input")].find((r) => r.name === focused?.name && r.checked)?.focus();
	}
	let pending;
	function cancelSearch() {
		pending?.abort();
		pending = undefined;
		results.removeAttribute("aria-busy");
	}
	async function search(anchor = searchForm, control = input) {
		cancelSearch();
		lastAnchor = anchor;
		lastControl = control;
		recovery.begin(anchor, control);
		noMatches = false;
		mappingNotice = "";
		updatePresentation();
		features.showExternalPromotions([]);
		if (anchor !== pages) list.replaceChildren();
		if (!options.filters || !query || app && (!app.endpoint || !app.token)) showFacets([]);
		if (anchor !== pages) pages.hidden = true;
		if (!active.profile) {
			status.textContent = active.language ? "No profiles are included for " + languageName(active.language) + "." : "The default profile’s language is unknown.";
			return;
		}
		if (app && (!app.endpoint || !app.token)) {
			status.textContent = "To search your app, set the Select endpoint and read-only token in src/config.js.";
			return;
		}
		const es = spanish();
		if (!query) {
			status.textContent = es ? "Escribe un término de búsqueda." : "Enter a search term.";
			return;
		}
		const request = new AbortController();
		pending = request;
		results.setAttribute("aria-busy", "true");
		status.textContent = "Searching…";
		try {
			let cards;
			let choices = demoSortOptions.slice(1).map(({ order, label }) => ({
				value: order,
				label: es ? label.replace("Page address", "Dirección de página") : label
			}));
			let banners = [];
			let fields;
			const rows = options.resultsPerPage;
			let total;
			if (app) {
				const page = await searchBuildApp({
					...app,
					...active,
					settings: active
				}, {
					query,
					start,
					rows,
					sort: options.showSorting ? order.value : "",
					filters: new Map(filters)
				}, AbortSignal.any([request.signal, AbortSignal.timeout(12e3)]));
				if (pending !== request) return;
				mappingNotice = resultMappingNotice(page.mappingsKnown, page.cards.length, page.total);
				highlighting = page.highlighting;
				choices = page.sorts;
				banners = page.externalPromotions;
				fields = page.facets;
				cards = page.cards;
				total = page.total;
			} else {
				const samplePage = searchDirectory(active, query, options.profileTabs, filters);
				const matches = orderDirectoryResults(samplePage.entries, options.showSorting ? order.value : "", query, options.samplePromotions);
				cards = directoryCards(matches.slice(start, start + rows), active, query, thumbnails);
				total = samplePage.total;
				fields = samplePage.facets;
			}
			if (pending !== request) return;
			recovery.clear();
			displayedStart = start;
			list.replaceChildren();
			sorts = choices;
			const selected = order.value;
			order.replaceChildren(new Option(es ? "Relevancia" : "Relevance", ""), ...sorts.map((choice) => new Option(choice.label, choice.value)));
			if (sorts.some((choice) => choice.value === selected)) order.value = selected;
			noMatches = total === 0;
			updatePresentation();
			features.showExternalPromotions(banners);
			showFacets(fields);
			for (const card of cards) {
				const item = document.createElement("li");
				if (card.promoted) {
					const marker = document.createElement("strong");
					marker.className = app ? "search-promotion-marker" : "sample-indexed-promotion";
					marker.dataset.defaultLabel = es ? app ? "Promocionado" : "Promoción indexada de ejemplo" : app ? "Promoted" : "Sample indexed promotion";
					marker.textContent = options.promotionBadge === DEFAULT_DESIGN.promotionBadge ? marker.dataset.defaultLabel : options.promotionBadge;
					item.append(marker);
				}
				appendResultCard(item, card);
				const link = item.querySelector("a");
				if (link) {
					link.target = "_blank";
					link.rel = "noopener noreferrer";
					if (!app) link.hreflang = "en";
				}
				list.append(item);
			}
			reportSettings();
			list.lang = contentLanguageTag(active.language) || "";
			const range = total > rows ? start + 1 + "–" + Math.min(start + rows, total) + (es ? " de " : " of ") : "";
			const count = es ? total === 1 ? " resultado para " : " resultados para " : total === 1 ? " result for " : " results for ";
			status.textContent = total ? range + total + count + "“" + query + "”" : (es ? "Sin resultados para " : "No results for ") + "“" + query + "”.";
			previous.disabled = start === 0;
			next.disabled = start + rows >= total;
			pages.hidden = total <= rows;
		} catch (error) {
			if (pending !== request) return;
			status.textContent = anchor === pages ? es ? "Resultados de la página anterior." : "Showing the previous page." : "";
			const message = error instanceof CustomerSearchError ? error.message : es ? "No se pudo cargar la búsqueda. Inténtalo de nuevo." : "Couldn’t load this search. Try again.";
			recovery.error(message, es ? "Volver a intentar" : "Retry search");
		} finally {
			if (pending === request) {
				results.removeAttribute("aria-busy");
				pending = undefined;
			}
		}
	}
	function reportSettings() {
		const entitlements = app ? app.configuration?.entitlements ?? {} : {
			relatedSearches: true,
			smartAnswers: true
		};
		panel.dispatchEvent(new CustomEvent("profile-settings", { detail: {
			profile: active,
			entitlements,
			highlighting,
			summary: profileStatus(entitlements, active, highlighting, app ?? undefined)
		} }));
	}
	function select(item, focus = false, fromLanguage = false) {
		active = item;
		highlighting = active.highlighting;
		reportSettings();
		order.replaceChildren();
		filterButton.setAttribute("aria-expanded", "false");
		sorts = [];
		filters.clear();
		showFacets([]);
		start = 0;
		const choices = catalog.filter((choice) => choice.profile && choice.language === active.language);
		tabs.replaceChildren(...choices.map((choice) => {
			const button = document.createElement("button");
			button.type = "button";
			button.id = "lab-experience-tab-" + catalog.indexOf(choice);
			button.textContent = choice.profile;
			button.setAttribute("role", "tab");
			button.setAttribute("aria-controls", results.id);
			button.setAttribute("aria-selected", String(choice === active));
			button.tabIndex = choice === active ? 0 : -1;
			button.addEventListener("click", () => select(choice, true));
			button.addEventListener("keydown", (event) => {
				const index = choices.indexOf(choice);
				const targets = {
					ArrowLeft: (index + choices.length - 1) % choices.length,
					ArrowRight: (index + 1) % choices.length,
					Home: 0,
					End: choices.length - 1
				};
				if (Object.hasOwn(targets, event.key)) {
					event.preventDefault();
					select(choices[targets[event.key]], true);
				}
			});
			return button;
		}));
		const selected = tabs.querySelector("[aria-selected=\\"true\\"]");
		tabs.hidden = !options.profileTabs || !choices.length;
		results.setAttribute("role", options.profileTabs && selected ? "tabpanel" : "region");
		if (options.profileTabs && selected) {
			results.removeAttribute("aria-label");
			results.setAttribute("aria-labelledby", selected.id);
		} else {
			results.removeAttribute("aria-labelledby");
			results.setAttribute("aria-label", "Search results");
		}
		if (focus) selected?.focus();
		if (fromLanguage) void search(field("[data-exp-language]"), language);
		else if (focus && selected) void search(tabs, selected);
		else void search();
	}
	function render(fromLanguage = false) {
		const languages = [...new Set(allProfiles.map((item) => item.language).filter(Boolean))];
		if (active.language && !languages.includes(active.language)) languages.unshift(active.language);
		language.replaceChildren(...languages.map((code) => new Option(!app && code === "es" ? "Español" : languageName(code), code)));
		if (!defaultLanguage) language.prepend(new Option("Choose a language", ""));
		language.value = active.language;
		language.disabled = language.options.length < 2;
		field("[data-exp-language]").hidden = !options.languagePicker;
		const es = spanish();
		field("[data-exp-language] span").textContent = es ? "Idioma de búsqueda" : "Search language";
		info.textContent = !app && active.language === "es" ? "Los enlaces abren páginas del campus en inglés." : "";
		if (app && active.profile && !options.profileTabs) info.textContent = "Search Profile: " + active.profile;
		info.hidden = !info.textContent;
		select(active, false, fromLanguage);
	}
	language.addEventListener("change", () => {
		const section = !app && demoProfiles.find((item) => item.language === active.language && item.profile === active.profile)?.section;
		const translated = section && demoProfiles.find((item) => item.language === language.value && item.section === section);
		active = profileForLanguage(language.value, translated || active);
		render(true);
	});
	function submit(term) {
		query = term.trim();
		input.value = term;
		filters.clear();
		start = 0;
		void search();
	}
	field("form").addEventListener("submit", (event) => {
		event.preventDefault();
		submit(input.value);
	});
	previous.addEventListener("click", () => {
		start = Math.max(0, displayedStart - options.resultsPerPage);
		void search(pages, previous);
	});
	next.addEventListener("click", () => {
		start = displayedStart + options.resultsPerPage;
		void search(pages, next);
	});
	return {
		open(term = query, draft = term) {
			query = term;
			input.value = draft;
			render();
		},
		close() {
			cancelSearch();
			recovery.clear();
			features.clear();
		},
		setProfiles(choices) {
			if (!choices.length) return;
			tabProfiles = choices;
			if (!options.profileTabs) return;
			catalog = tabProfiles;
			active = profileForLanguage(active.language, active);
			if (!panel.hidden) render();
		},
		get searchState() {
			return {
				query,
				draft: input.value
			};
		},
		submit,
		get spanishDemo() {
			return !app && spanish();
		},
		get promotionQuery() {
			return spanish() ? spanishPromotionQuery : "campus flu clinic";
		},
		configure(design) {
			const previous = options;
			options = { ...design };
			catalog = options.profileTabs ? tabProfiles : allProfiles;
			const code = design.languagePicker ? active.language : defaultLanguage;
			const leavingTabs = previous.profileTabs && !design.profileTabs;
			if (leavingTabs || active.language !== code) active = profileForLanguage(code);
			else if (!catalog.includes(active)) active = profileForLanguage(code, active);
			panel.dataset.layout = design.layout;
			panel.dataset.filterPlacement = design.filterPlacement;
			panel.dataset.filterStyle = design.topFilterStyle;
			panel.dataset.descriptions = String(Boolean(app) || design.showDescriptions);
			panel.dataset.thumbnails = String(design.showThumbnails);
			panel.dataset.dividers = String(design.listDividers);
			panel.dataset.underline = String(design.underlineTitles);
			if (panel.hidden) return;
			if (previous.profileTabs !== design.profileTabs || previous.languagePicker !== design.languagePicker) {
				render();
			} else if (previous.filters !== design.filters || previous.resultsPerPage !== design.resultsPerPage || previous.showSorting !== design.showSorting || previous.samplePromotions !== design.samplePromotions) {
				start = 0;
				if (!design.filters) filters.clear();
				if (!design.showSorting || previous.samplePromotions !== design.samplePromotions) order.value = "";
				void search();
			} else updatePresentation();
		},
		handoff() {
			return {
				...experienceHandoff(Boolean(app), catalog, active, query, defaultLanguage),
				entitlements: app?.configuration?.entitlements
			};
		},
		setSource(connection, choices, term, selected, sourceLanguage) {
			cancelSearch();
			features.clear();
			app = connection;
			allProfiles = choices.length ? choices : connection ? [connection.settings ?? {
				language: connection.language,
				profile: connection.profile
			}] : demoProfiles;
			tabProfiles = allProfiles;
			catalog = allProfiles;
			defaultLanguage = sourceLanguage ?? (connection ? connection.language || selected?.language || "" : demoProfiles[0].language);
			startingProfile = connection?.settings ?? (!connection ? demoProfiles[0] : undefined);
			const code = options.languagePicker ? selected?.language ?? defaultLanguage : defaultLanguage;
			active = profileForLanguage(code, selected?.language === code ? selected : undefined);
			panel.dataset.descriptions = String(Boolean(app) || options.showDescriptions);
			query = term;
			start = 0;
			list.replaceChildren();
			tabs.replaceChildren();
			language.replaceChildren();
			input.value = term;
			info.textContent = "";
			status.textContent = "";
			pages.hidden = true;
			if (!panel.hidden) render();
		}
	};
}
`,Tt=`import { promotionEntries } from "./promotion-display.js";
import { webURL } from "./web-url.js";
import { resultCards } from "./result-card.js";
export { readCustomerEndpoint } from "./web-url.js";
const fieldName = /^[A-Za-z_][\\w.-]*$/;
export class CustomerSearchError extends Error {}
export class CustomerSearchTokenError extends CustomerSearchError {}
function firstText(value) {
	if (Array.isArray(value)) return value.find((item) => typeof item === "string") ?? "";
	return typeof value === "string" ? value : "";
}
async function requestSearch(connection, options, signal) {
	const url = new URL(connection.endpoint);
	url.search = new URLSearchParams({
		q: options.query,
		start: String(options.start),
		rows: String(options.rows),
		facet: "true"
	}).toString();
	if (connection.settings?.highlighting !== undefined) url.searchParams.set("hl", String(connection.settings.highlighting));
	if (connection.language) url.searchParams.set("language", connection.language);
	if (connection.profile) url.searchParams.set("model", connection.profile);
	if (options.sort) url.searchParams.set("sort", options.sort);
	for (const [filters, prefix] of [[options.filters, ""], [options.excludeFilters, "-"]]) {
		filters?.forEach((value, field) => {
			if (fieldName.test(field)) url.searchParams.append("fq", prefix + field + ":\\"" + value.replace(/[\\\\"]/g, "\\\\$&") + "\\"");
		});
	}
	const response = await fetch(url, {
		headers: { Authorization: "Token " + connection.token },
		credentials: "omit",
		redirect: "error",
		cache: "no-store",
		referrerPolicy: "no-referrer",
		signal
	});
	if (response.status === 401 || response.status === 403) {
		throw new CustomerSearchTokenError("The Search App rejected the token. Check that it’s an active read-only token for this app.");
	}
	if (response.status === 404) throw new CustomerSearchError("Search API endpoint not found. Copy the Select endpoint from App Settings.");
	if (response.status === 400) throw new CustomerSearchError("The Search App rejected the request. Check the profile, language, and search term.");
	if (response.status === 429) throw new CustomerSearchError("The Search App is receiving too many requests. Try again in a moment.");
	if (!response.ok) throw new CustomerSearchError("The Search App is unavailable. Try again in a moment.");
	return await response.json();
}
async function readPage(connection, options, signal) {
	const payload = await requestSearch(connection, options, signal);
	const response = payload?.response;
	if (!response || !Number.isSafeInteger(response.numFound) || response.numFound < 0 || !Array.isArray(response.docs)) {
		throw new CustomerSearchError("The endpoint didn’t return search results. Check the Select endpoint and Search Profile.");
	}
	const externalPromotions = promotionEntries(payload.externalLinks);
	const facets = (Array.isArray(payload.metadata?.facets) ? payload.metadata.facets : []).filter((field) => field && typeof field.name === "string" && fieldName.test(field.name)).map((field) => {
		const counts = payload.facet_counts?.facet_fields?.[field.name] ?? [];
		const choices = [];
		for (let index = 0; index < counts.length; index += 2) {
			const value = counts[index];
			const count = counts[index + 1];
			if (typeof value === "string" && value && typeof count === "number") choices.push({
				value,
				count
			});
		}
		return {
			field: field.name,
			label: field.label || field.name,
			choices
		};
	});
	const sorts = (Array.isArray(payload.metadata?.sorts) ? payload.metadata.sorts : []).filter((sort) => sort && typeof sort.name === "string" && fieldName.test(sort.name) && (sort.order === "asc" || sort.order === "desc")).map((sort) => ({
		value: sort.name + " " + sort.order,
		label: sort.label || sort.name
	}));
	return {
		payload,
		response,
		total: response.numFound,
		resultCount: response.docs.length,
		externalPromotions,
		facets,
		sorts
	};
}
export async function searchBuildApp(connection, options, signal) {
	const { payload, response, ...page } = await readPage(connection, options, signal);
	const params = payload.responseHeader?.params;
	const profile = connection.profile || params?.model;
	const language = (connection.language || params?.language)?.toLowerCase().replaceAll("-", "_");
	const matches = connection.configuration?.profiles.filter((item) => item.profile === profile && (!language || item.language === language));
	const settings = connection.settings ?? (matches?.length === 1 ? matches[0] : undefined);
	const { cards, ...metadata } = resultCards(payload, response.docs, settings?.highlighting);
	return {
		...page,
		...metadata,
		settings,
		language,
		cards: cards.filter((card) => card.url || card.thumbnail || card.values.length)
	};
}
// The prepared Improve lessons use the demo’s original linked-result projection.
export async function searchCustomerApp(connection, options, signal) {
	const { payload, response, ...page } = await readPage(connection, options, signal);
	const mappings = Array.isArray(payload.metadata?.results) ? payload.metadata.results : [];
	const mappedName = (role) => mappings.find((field) => field.result_card === role)?.name ?? role;
	const urlField = mappedName("url");
	const titleField = mappedName("title");
	const descriptionField = mappedName("description");
	const results = response.docs.flatMap((doc) => {
		const url = webURL(firstText(doc[urlField]));
		return url ? [{
			url,
			title: firstText(doc[titleField]) || url,
			description: firstText(doc[descriptionField]),
			promoted: doc["[elevated]"] === true
		}] : [];
	});
	return {
		...page,
		results
	};
}
`,Et=`<label data-exp-language><span>Search language</span> <select></select></label>
<form class="search-lab__search-form" role="search" aria-label="Search this profile">
  <label class="search-lab__sr-only" for="lab-exp-query">Search this profile</label>
  <input type="search" id="lab-exp-query" required>
  <button type="submit">Search</button>
</form>
<div role="tablist" aria-label="Search Profiles"></div>
<!-- smart-answer-sample -->
<section aria-label="Smart Answer" data-customer-answer hidden>
  <strong>Smart Answer</strong>
  <p data-customer-answer-status></p>
  <div data-customer-answer-content hidden></div>
</section>
<p class="search-lab__sr-only" role="status" data-customer-answer-announcement></p>
<div data-exp-promotions></div>
<div role="tabpanel" id="lab-exp-results" tabindex="0">
  <div class="search-results-toolbar">
    <strong role="status" data-exp-summary></strong>
    <label data-exp-sort hidden><span>Sort by</span> <select></select></label>
  </div>
  <p data-exp-empty hidden></p>
  <p data-exp-sort-hint hidden>This Search Profile hasn’t provided sort options.</p>
  <div class="experience-results">
    <aside data-exp-filter-panel aria-label="Filter results" hidden>
      <button type="button" data-exp-filter-toggle aria-controls="lab-exp-facets" aria-expanded="false">Filters</button>
      <div id="lab-exp-facets" data-exp-facets></div>
    </aside>
    <ul></ul>
  </div>
  <div data-exp-pages hidden><button type="button" data-exp-prev>Previous page</button> <button type="button" data-exp-next>Next page</button></div>
</div>
<p data-exp-source></p>
`,Dt=`.lab-experiences [data-exp-language] { display: grid; gap: .375rem; max-width: 18rem; margin-bottom: .75rem; font-size: .875rem; }
.lab-experiences [data-exp-language] select { width: 100%; min-height: 44px; }
.lab-experiences [role="tablist"] { display: flex; flex-wrap: wrap; gap: .25rem; margin-block: 1rem; border-bottom: 1px solid currentColor; }
.lab-experiences [role="tab"] { min-height: 44px; max-width: 100%; overflow-wrap: anywhere; padding: .4rem .75rem; background: transparent; color: inherit; border: 0; border-bottom: 3px solid transparent; }
.lab-experiences [role="tab"][aria-selected="true"] { font-weight: 700; border-bottom-color: var(--search-title-ink, currentColor); }
.lab-experiences ul { padding-inline-start: 1.25rem; }
.lab-experiences li { margin-block: .65rem; overflow-wrap: anywhere; }
.lab-experiences [data-exp-source] { margin: .75rem 0 0; font-size: .875em; }
.search-starter .lab-experiences form { display: flex; gap: .25rem; max-width: 42rem; margin-block: 1rem; }
.search-starter .lab-experiences input { flex: 1; min-width: 0; }
.search-starter .lab-experiences form :is(input, button) { padding: .6rem; border: 1px solid var(--search-accent); border-radius: var(--search-corners); }
.search-starter .lab-experiences form button { color: var(--search-accent-text); background: var(--search-accent); }
.search-starter .lab-experiences .search-lab__sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.lab-experiences [hidden] { display: none !important; }
.lab-experiences .experience-results { display: grid; gap: 1rem; align-items: start; padding-top: 13px; }
.lab-experiences .experience-results ul { display: grid; list-style: none; gap: var(--search-result-gap, .75rem); padding: 0; margin: 0; }
.lab-experiences .experience-results li { margin: 0; padding: .7rem 0; border-bottom: 1px solid var(--search-divider, #d8dfe3); }
.lab-experiences .experience-results li a { color: var(--search-title-ink, #263f58); font-weight: 700; text-underline-offset: .15em; }
.lab-experiences .experience-results li p { margin: .3rem 0 0; }
.lab-experiences[data-descriptions="false"] li .search-lab__result-description { display: none; }
.lab-experiences[data-layout="cards"] .experience-results ul { grid-template-columns: repeat(auto-fit, minmax(min(15rem,100%),1fr)); }
.lab-experiences[data-layout="cards"] .experience-results li { border: 1px solid var(--search-divider, #d8dfe3); border-radius: var(--search-corners, 5px); padding: 1rem; }
.lab-experiences [data-exp-facets] fieldset { min-width: 0; margin: 0 0 .5rem; border: 0; padding: 0; }
.lab-experiences [data-exp-facets] legend { margin-bottom: .5rem; font-size: .75rem; font-weight: 700; }
.lab-experiences [data-exp-facets] label { display: flex; gap: 7px; align-items: center; min-height: 36px; font-size: .8125rem; line-height: 1.4; overflow-wrap: anywhere; cursor: pointer; }
.lab-experiences [data-exp-facets] input { flex: none; width: 24px; height: 24px; margin: 0; accent-color: var(--search-accent); }
.lab-experiences[data-filter-placement="top"][data-filter-style="row"] [data-exp-facets] label { display: inline-flex; margin-inline-end: 1rem; }
@media (min-width: 851px) {
  .lab-experiences[data-filter-placement="sidebar"] .experience-results:has(aside:not([hidden])) { grid-template-columns: minmax(8rem, 22%) minmax(0, 1fr); }
}

.lab-experiences .experience-results li a {
  font-size: var(--search-result-title-size);
  line-height: var(--search-result-title-line-height);
  letter-spacing: var(--search-result-title-letter-spacing);
  text-decoration: none;
}
.lab-experiences[data-underline="true"] .experience-results li a,
.lab-experiences .experience-results li a:hover { text-decoration: underline; }
.lab-experiences .experience-results li p {
  font-size: var(--search-result-description-size);
  line-height: var(--search-result-description-line-height);
}
.lab-experiences[data-layout="list"][data-dividers="false"] .experience-results li { border-bottom-color: transparent; }
.lab-experiences .profile-result-thumbnail { display: block; width: min(100%, 12rem); margin-bottom: .5rem; border-radius: var(--search-corners); }
.lab-experiences[data-thumbnails="false"] .profile-result-thumbnail { display: none; }
.lab-experiences [data-exp-filter-toggle] { display: none; }
.search-results-toolbar > .search-recovery { flex-basis: 100%; }
.lab-experiences [data-exp-pages] { display: flex; flex-wrap: wrap; gap: .625rem; margin-top: 1rem; }
.lab-experiences :is([data-exp-pages] button, [data-exp-filter-toggle]) {
  max-width: 100%;
  min-height: 36px;
  padding: .375rem .625rem;
  border: 1px solid currentColor;
  border-radius: var(--search-corners, 5px);
  color: var(--search-ink, #202e3a);
  background: var(--search-background, #fff);
  font: inherit;
  font-size: .8125rem;
  cursor: pointer;
}
@media (max-width: 850px) {
  .lab-experiences [data-exp-filter-toggle] { display: inline-block; min-height: 44px; }
  .lab-experiences [data-exp-filter-toggle][aria-expanded="false"] + [data-exp-facets] { display: none; }
}

.mapped-result-thumbnail { display: block; width: min(100%, 12rem); height: auto; margin-bottom: .5rem; }

.mapped-result-card { position: relative; }
.mapped-result-card :is(.mapped-result-paths, .mapped-result-date, .mapped-result-distance) {
  font-size: .875em;
}
.mapped-result-card a.searchstax-search-result-title::after { content: ''; position: absolute; inset: 0; }
`,Ot=`import { setupExperiencePreview } from './profile-experiences.js';
import { readAnswerEndpoint } from './customer-answers.js';
import { readCustomerEndpoint } from './web-url.js';
import { settings, connection } from './config.js';

export function mountProfileSearch(host) {
  const main = document.createElement('main');
  main.className = 'search-starter';
  if (settings.logoURL) {
    const logo = document.createElement('img');
    logo.className = 'search-starter__logo';
    logo.alt = 'Company logo';
    logo.referrerPolicy = 'no-referrer';
    logo.src = settings.logoURL;
    main.append(logo);
  }
  const heading = document.createElement('h1');
  const live = settings.source === 'app';
  heading.textContent = live ? 'Search your site' : 'Search Central County';
  const panel = document.createElement('section');
  panel.className = 'lab-experiences';
  panel.setAttribute('aria-label', 'Search by language and profile');
  panel.innerHTML = %%EXPERIENCE_HTML%%;
  main.append(heading, panel);
  host.replaceChildren(main);

  const search = setupExperiencePreview(panel, settings.thumbnails);
  panel.hidden = true;
  search.configure(settings.navigation);
  const app = live ? {
    endpoint: readCustomerEndpoint(connection.endpoint) || '',
    token: connection.token.trim(),
    configuration: { entitlements: settings.entitlements ?? {}, profiles: settings.profiles },
    answerEndpoint: readAnswerEndpoint(connection.answerEndpoint || ''),
    suggestEndpoint: readCustomerEndpoint(connection.suggestEndpoint || '', 'emsuggest'),
    relatedURL: readCustomerEndpoint(connection.relatedURL || '', 'related-search'),
    discoveryKey: connection.discoveryKey || '',
  } : null;
  search.setSource(app, settings.profiles, settings.initialQuery, settings.selected, settings.defaultLanguage);
  panel.hidden = false;
  search.open();
  return () => { search.close(); host.replaceChildren(); };
}
`,kt=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Search by language and profile</title>
  <link rel="stylesheet" href="./search.css">
</head>
<body class="search-starter-page">
  <div id="app"></div>
  <script type="module" src="./src/main.js"><\/script>
</body>
</html>
`,At=`import React, { useEffect, useRef } from 'react';
import { mountProfileSearch } from './mount.js';

export default function SearchApp() {
  const host = useRef(null);
  useEffect(() => mountProfileSearch(host.current), []);
  return <div ref={host} />;
}
`,jt=`<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { mountProfileSearch } from './mount.js';

const host = ref(null);
let dispose;
onMounted(() => { dispose = mountProfileSearch(host.value); });
onBeforeUnmount(() => dispose?.());
<\/script>

<template><div ref="host"></div></template>
`,Mt=`import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { mountProfileSearch } from './mount.js';

@Component({ selector: 'search-app', standalone: true, template: '' })
export class SearchApp implements AfterViewInit, OnDestroy {
  private dispose?: () => void;
  constructor(private host: ElementRef<HTMLElement>) {}
  ngAfterViewInit() { this.dispose = mountProfileSearch(this.host.nativeElement); }
  ngOnDestroy() { this.dispose?.(); }
}
`;function Nt(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}function Pt(e){let t=Object.entries(C(e)).map(([e,t])=>`  ${e}: ${t};`).join(`
`),n=`${q.trimEnd()}

${Pe.trimEnd()}

${Fe.trimEnd()}

${Ne.trimEnd()}

${je.trimEnd()}

${Le.trimEnd()}

${X.trimEnd()}

${Je.trimEnd()}

/* Your design settings */
.search-starter {
${t}
  font-family: var(--search-font);
  background: var(--search-background);
  color: var(--search-ink);
}

.search-starter :is(.search-starter__form input, .search-starter__submit, .search-starter__sort select, .search-starter__result-thumbnail, .search-starter__pagination button) {
  border-radius: var(--search-corners);
}

.search-starter__submit {
  color: var(--search-accent-text);
  background: var(--search-accent);
}

.search-starter__filters input {
  accent-color: var(--search-accent);
}

.search-starter .searchstax-search-results {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--search-result-gap);
}

.search-starter .searchstax-search-result {
  border-left: 3px solid var(--search-accent);
  border-radius: var(--search-corners);
  border-block-end-color: var(--search-divider);
}

.search-starter .searchstax-search-result h2 a {
  color: var(--search-title-ink);
  text-decoration: ${e.underlineTitles?`underline`:`none`};
}

.search-starter .searchstax-search-result h2 a:hover {
  text-decoration: underline;
}

.search-starter :is(.smart-answers-sample__card a, .smart-answers-sample__note, .sample-indexed-promotion, .searchstax-search-result .search-promotion-marker) {
  color: inherit;
}
`;return(e.profileTabs||e.languagePicker)&&(n+=`
`+Dt),e.layout===`cards`?n+=`
@media (min-width: 1050px) {
  .search-starter .searchstax-search-results {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`:n+=`
.search-starter .searchstax-search-result {
  padding: 10px 0;
  border-block-start: 0;
  border-inline: 0;
  border-radius: 0;
  ${e.listDividers?``:`border-block-end-color: transparent;`}
}
`,e.showDescriptions||(n+=`
.search-starter .search-starter__result-description {
  display: none;
}
`),e.filters?e.filterPlacement===`top`?n:n+`
@media (min-width: 561px) {
  .search-starter__body {
    grid-template-columns: 145px minmax(0, 1fr);
  }
}
`:n+`
.search-starter .search-starter__filters {
  display: none;
}
`}function Ft(e){return{relatedPlacement:e.relatedPlacement,showFilters:e.filters,showSorting:e.showSorting,showSuggestions:e.showSuggestions,promotionBadge:e.promotionBadge,promotionHeading:e.promotionHeading,bannerPlacement:e.bannerPlacement,resultsPerPage:e.resultsPerPage,noResultsText:e.noResultsText}}function It(e){let t={},n={};if(e)for(let[e,r]of Object.entries(Ee)){t[e]=r.path;let i=r.source.slice(r.source.indexOf(`,`)+1);n[r.path]=Uint8Array.from(atob(i),e=>e.charCodeAt(0))}return{paths:t,files:n}}function Lt(e,t,n){let r={"search.css":Pt(t),"src/profile-experiences.js":wt,"src/app-configuration.js":Ct,"src/result-card.js":St,"src/search-recovery.js":bt,"src/profile-features.js":_t,"src/design.js":vt,"src/demo-sorting.js":yt,"src/customer-suggestions.js":Ye,"src/customer-answers.js":He,"src/sample-suggestions.js":Re,"src/promotion-display.js":Ge,"src/sample-promotions.js":Ke,"src/related-searches.js":Me,"src/customer-search.js":Tt,"src/content-language.js":J,"src/web-url.js":Ve,"src/config.js":`export const settings = ${JSON.stringify({...n,navigation:t,logoURL:t.logoURL,thumbnails:n.source===`demo`?Object.fromEntries(Object.entries(Ee).map(([e,t])=>[e,t.source])):{}},null,2)};

// Use your app’s HTTPS Select endpoint and a browser-safe read-only token.
export const connection = { endpoint: '', token: '' };
`,"src/mount.js":Ot.replace(`%%EXPERIENCE_HTML%%`,()=>JSON.stringify(Et.replace(`<!-- smart-answer-sample -->`,()=>qe)))};switch(e){case`javascript`:Object.assign(r,{"index.html":kt,"src/main.js":`import { mountProfileSearch } from './mount.js';
mountProfileSearch(document.getElementById('app'));
`});break;case`react`:Object.assign(r,{"index.html":Xe,"package.json":Ze,"package-lock.json":Qe,"src/main.jsx":$e,"src/SearchApp.jsx":At});break;case`vue`:Object.assign(r,{"index.html":nt,"package.json":rt,"package-lock.json":it,"src/main.js":ot,"src/SearchApp.vue":jt,"vite.config.js":at});break;case`angular`:Object.assign(r,{"src/index.html":lt,"package.json":ut,"package-lock.json":dt,"src/main.ts":mt,"src/search-app.ts":Mt,"angular.json":ft,"tsconfig.json":pt,"public/.gitkeep":``})}r[`README.md`]=`# Search by language and profile

## Run the starter

${e===`javascript`?"From the extracted folder, run `python3 -m http.server 8000` and open http://localhost:8000/.":"From the extracted folder, run `npm ci`, then `npm run dev` and open the local address printed in the terminal. Run `npm run build` for a production build."}

## Try the design

${n.source===`demo`?`Search for **campus** in the sample directory and open a result. The preview settings determine whether visitors can switch profiles, choose English or Spanish, and filter results.`:`Your selected languages, profiles, feature settings, and starting tab are in **src/config.js**. Add the connection settings below and enter a search term from your site.`}

When both controls are enabled, the language picker controls which profiles appear. Switching profiles keeps the submitted query and returns to the first page. Use the arrow keys to move between tabs.

## Connect your Search App

In **src/config.js**, set **settings.source** to **app**. Enter the HTTPS Select endpoint from App Settings → All APIs → Search & Indexing in **connection.endpoint**, and its browser-safe read-only token in **connection.token**. These values are visible to visitors. Use **settings.profiles** for the list of language and profile pairs and **settings.selected** for the starting pair. Empty language and profile values use the app defaults. Set **settings.initialQuery** to your preferred opening query or leave it blank.

To use optional services in your own app, add the HTTPS Auto-Suggest endpoint as **connection.suggestEndpoint**, the streaming Answer endpoint as **connection.answerEndpoint**, or the Related Searches endpoint and Discovery key as **connection.relatedURL** and **connection.discoveryKey**. Use credentials intended for browser use. Set **settings.entitlements** from the app’s entitlements. For each entry in **settings.profiles**, use the published **relatedSearches** setting for its language and the **smartAnswers** setting for its profile. Each service requires its entitlement and published setting. Related Searches requests use the search phrase and language. Smart Answers requests also use the selected profile.

Live results use the Search API. Tracking is off in this starter.
`;let i=Te(Object.fromEntries(Object.entries(r).map(([e,t])=>[e,K(t)])));return new Blob([new Uint8Array(i)],{type:`application/zip`})}function Rt(e){return{searchURL:e.customer?``:e.searchURL,searchAuth:e.customer?``:e.searchAuth,model:e.model,language:e.language,questionURL:e.questionURL,relatedURL:e.relatedURL,discoveryKey:e.discoveryKey,suggesterURL:``,analyticsBaseUrl:``,trackApiKey:``}}function Q(e,t){let n=`export const featureSettings = `+JSON.stringify(e.featureSettings,null,2)+`;
`;return{[t+`feature-settings.js`]:K(n),[t+`app-configuration.js`]:K(Ct),[t+`starter-services.js`]:K(Y),[t+`starter-answers.js`]:K(Ue)}}function zt(e,t,n){if(t.experience)return Lt(`javascript`,e,t.experience);let r=JSON.stringify({...Rt(t),...Ft(e)},null,2),i={UI_KIT_URL:t.kitURL,HEADING:t.customer?`Search`:`Search Central County`,INITIAL_QUERY:t.customer?``:`rehabilitation`,SEARCH_FIELD_TEXT:e.searchFieldText,SEARCH_BUTTON_TEXT:e.searchButtonText},a=Oe.replace(/%%(UI_KIT_URL|SEARCH_FIELD_TEXT|SEARCH_BUTTON_TEXT|HEADING|INITIAL_QUERY|COMPANY_LOGO)%%/g,(t,n)=>n===`COMPANY_LOGO`?e.logoURL?`<img class="search-starter__logo" src="${Nt(e.logoURL)}" alt="Company logo" referrerpolicy="no-referrer">`:``:Nt(i[n])),o=JSON.stringify({searchURL:t.searchURL,labels:n},null,2),{paths:s,files:c}=It(e.showThumbnails),l=ke.replace(`%%STARTER_CONFIG%%`,()=>r).replace(`%%DEMO_FACETS%%`,()=>o).replace(`%%DEMO_SORTING%%`,()=>JSON.stringify({model:t.demoModel,options:De},null,2)).replace(`%%DEMO_THUMBNAILS%%`,()=>JSON.stringify(s,null,2)),u=Te({...Q(t,``),"index.html":K(a),"search.css":K(Pt(e)),"search.js":K(l),"demo-content.js":K(Ie),"content-language.js":K(J),"web-url.js":K(Ve),"result-card.js":K(St),"starter-passages.js":K(xt),"customer-answers.js":K(He),"customer-suggestions.js":K(Ye),"suggestions.js":K(Re),"result-tracking.js":K(ze),"related-searches.js":K(Me),"pagination-focus.js":K(Be),"promotion-display.js":K(Ge),"README.md":K(Ae),...c});return new Blob([new Uint8Array(u)],{type:`application/zip`})}function Bt(e,t,n){let{paths:r,files:i}=It(e.showThumbnails),a={searchURL:t.searchURL,model:t.demoModel,language:`en`,facetLabels:n,sortOptions:De,thumbnailPaths:Object.fromEntries(Object.entries(r).map(([e,t])=>[e,`/`+t]))},o={...Ft(e),showThumbnails:e.showThumbnails,searchFieldText:e.searchFieldText,searchButtonText:e.searchButtonText,logoURL:e.logoURL},s=`// Public Central County demo. Keep this constant when connecting your own app.
export const demo = ${JSON.stringify(a,null,2)};

// Replace these values with your app’s browser-safe settings.
export const connection = ${JSON.stringify({...Rt(t),initialQuery:``,thumbnailAltField:``,thumbnailsWithoutAltAreDecorative:!1},null,2)};

export const design = ${JSON.stringify(o,null,2)};
`;return{"search.css":K(Pt(e)),"src/config.js":K(s),"src/demo-content.js":K(Ie),"src/suggestions.js":K(Re),"src/result-tracking.js":K(ze),"src/related-searches.js":K(Me),"src/pagination-focus.js":K(Be),"src/content-language.js":K(J),"src/web-url.js":K(Ve),"src/result-card.js":K(St),"src/starter-passages.js":K(xt),"src/customer-answers.js":K(He),...Q(t,`src/`),"src/thumbnail-alt.js":K(We),"src/customer-suggestions.js":K(Ye),...Object.fromEntries(Object.entries(i).map(([e,t])=>[`public/`+e,t]))}}function Vt(e,t,n){if(t.experience)return Lt(`react`,e,t.experience);let r=Te({"index.html":K(Xe),"package.json":K(Ze),"package-lock.json":K(Qe),"README.md":K(tt),"src/main.jsx":K($e),"src/SearchApp.jsx":K(et),...Bt(e,t,n)});return new Blob([new Uint8Array(r)],{type:`application/zip`})}function Ht(e,t,n){if(t.experience)return Lt(`vue`,e,t.experience);let r=Te({"index.html":K(nt),"package.json":K(rt),"package-lock.json":K(it),"README.md":K(ct),"vite.config.js":K(at),"src/main.js":K(ot),"src/SearchApp.vue":K(st),...Bt(e,t,n)});return new Blob([new Uint8Array(r)],{type:`application/zip`})}function Ut(e,t,n){if(t.experience)return Lt(`angular`,e,t.experience);let r=Te({"package.json":K(ut),"package-lock.json":K(dt),"angular.json":K(ft),"tsconfig.json":K(pt),"README.md":K(Z),"src/index.html":K(lt),"src/main.ts":K(mt),"src/search-app.ts":K(ht),"src/search-app.html":K(gt),"public/.gitkeep":new Uint8Array,...Bt(e,t,n)});return new Blob([new Uint8Array(r)],{type:`application/zip`})}async function Wt(e){try{return navigator.clipboard?(await navigator.clipboard.writeText(e),!0):!1}catch{return!1}}function Gt(e,t,n,r){e.addEventListener(`click`,async()=>{let e=n.value,i=await Wt(e);n.value===e&&(n.hidden=i,t.textContent=i?r.copied:r.manual,i||(n.focus(),n.select()))})}var Kt=`lab:lesson-start`;function $(e,t,n,r){t.addEventListener(`change`,()=>{t.checked&&(n.hidden=!1)}),e.addEventListener(Kt,()=>{t.checked=!1,n.hidden=!0;for(let e of n.querySelectorAll(`details[open]`))e.removeAttribute(`open`);r?.()})}function qt(e){switch(e){case`#lab-search-fields`:case`#lab-missing-page`:case`#lab-missing-page-takeaway`:case`#lab-missing-page-steps`:return`missing-page`;case`#lab-synonyms`:return`synonyms`;case`#lab-facets-example`:return`facets`;case`#lab-flu-clinic-order`:case`#lab-clinic-promotion`:return`flu-clinic-order`}}function Jt(e){return[`lab_layout`,`lab_color`,`lab_font`,`lab_filters`].some(t=>e.searchParams.has(t))}function Yt(e,t){if(qt(e.hash))return`improve`;switch(e.hash){case`#lab-home`:return`home`;case`#lab-improve`:return`improve`;case`#lab-design-controls`:case`#lab-more-settings`:case`#lab-filters`:case`#lab-design`:return`design`;case`#lab-spell-check`:return`spell-check`;case`#lab-data-filters`:return`data-filters`;case`#lab-find-page`:return`find-page`;case`#lab-promotions`:return`promotions`;case`#lab-promotion-teammate`:case`#lab-promotion-checklist`:return`promotion-checklist`;case`#lab-ranking-guide`:case`#lab-ranking-steps`:return`ranking-guide`;case`#lab-ranking`:case`#lab-compare-ranking`:case`#lab-examples`:return`examples`;case`#lab-preview`:return t===`design`||t===`examples`?t:e.searchParams.has(`lab_scenario`)?`examples`:`design`}let n=e.searchParams;return n.has(`lab_scenario`)||n.has(`lab_view`)?`examples`:Jt(e)?`design`:`home`}function Xt(e,t){e.toggleAttribute(`data-lab-embedded`,window.self!==window.top);let n=e.querySelectorAll(`[data-lab-screen]`),r=e.querySelectorAll(`[data-lab-design-only]`),i=e.querySelectorAll(`[data-lab-example-only]`),a=e.querySelector(`.search-lab__controls`),o=e.querySelector(`#lab-preview`),s=e.querySelector(`.search-lab__design-switch`),c=[...s.querySelectorAll(`button`)],l=window.matchMedia(`(max-width: 850px)`),u=[...a.querySelectorAll(`.search-lab__editor-tabs [role="tab"]`)],d=u[0],f=u[1];function p(e){for(let t of u){let n=t===e;t.setAttribute(`aria-selected`,String(n)),t.tabIndex=n?0:-1,document.getElementById(t.getAttribute(`aria-controls`)).hidden=!n}}for(let e of u)e.addEventListener(`click`,()=>p(e)),e.addEventListener(`keydown`,t=>{let n;switch(t.key){case`ArrowRight`:case`ArrowLeft`:n=e===d?f:d;break;case`Home`:n=d;break;case`End`:n=f;break;default:return}t.preventDefault(),p(n),n.focus()});for(let e of a.querySelectorAll(`[data-placement-target]`))e.addEventListener(`click`,()=>{let t=document.getElementById(e.dataset.placementTarget);p(t.closest(`[role=tabpanel]`)?.id===`lab-more-settings`?d:f),t.closest(`details`).open=!0,t.focus()});function m(t){e.dataset.labDesignMode=t;for(let e of c)e.setAttribute(`aria-pressed`,String(e.dataset.labDesignMode===t))}let h;a.addEventListener(`input`,e=>{e.target instanceof HTMLElement&&(h=e.target)});for(let t of c)t.addEventListener(`click`,()=>{let n=t.dataset.labDesignMode===`edit`?`edit`:`preview`;n!==e.dataset.labDesignMode&&(m(n),n===`edit`&&h?.checkVisibility()?(h.focus({preventScroll:!0}),h.scrollIntoView({block:`center`})):(n===`edit`?a:o).scrollIntoView({block:`start`}))});let g=e.querySelectorAll(`.search-lab__filter-toggle`);for(let e of g){let t=document.getElementById(e.getAttribute(`aria-controls`)),n=e.querySelector(`span`);function r(){let e=t.querySelectorAll(`input:checked:not([data-customer-facet][value=""]), select option:checked:not([value=""])`).length;n.textContent=e?` (${e})`:``}e.addEventListener(`click`,()=>{e.setAttribute(`aria-expanded`,String(e.getAttribute(`aria-expanded`)!==`true`))}),t.addEventListener(`change`,r),new MutationObserver(r).observe(t,{childList:!0,subtree:!0})}e.querySelector(`[data-lab-reset]`).addEventListener(`click`,()=>{p(d),h=void 0,m(`preview`);for(let e of g)e.setAttribute(`aria-expanded`,`false`)}),l.addEventListener(`change`,()=>{if(e.dataset.labView!==`design`)return;let t=document.activeElement;l.matches&&a.contains(t)&&m(`edit`),l.matches&&o.contains(t)&&m(`preview`),!l.matches&&s.contains(t)&&(e.dataset.labDesignMode===`edit`?e.querySelector(`#lab-design-controls`):o).focus({preventScroll:!0})});let _,v=``;function y(a){let o=new URL(window.location.href),s=Yt(o,_),c=s!==_,u=s===`examples`&&o.hash!==v&&o.hash!==`#lab-preview`;if(s===`design`&&([`#lab-design-controls`,`#lab-more-settings`,`#lab-filters`].includes(o.hash)?(p(d),m(`edit`)):o.hash===`#lab-preview`?m(`preview`):c&&(h=void 0,m(_!==`home`&&Jt(o)?`preview`:`edit`))),v=o.hash,c){let t=s===`examples`||s===`design`?`workspace`:s,a=_===`home`||_===`improve`;for(let e of n)e.hidden=e.dataset.labScreen!==t,!e.hidden&&a&&e.dispatchEvent(new Event(Kt));for(let e of r)e.hidden=s!==`design`;for(let e of i)e.hidden=s!==`examples`;_=s,e.dataset.labView=s}if((c||u||s===`improve`)&&t(s,o.hash),a){let t=document.getElementById(o.hash.slice(1)),n=document.getElementById(`lab-${s}`),r=t&&e.contains(t)?t:n,i=r?.closest(`details`);for(let e=i;e;e=e.parentElement?.closest(`details`))e.open=!0;o.hash===`#lab-improve`&&l.matches&&n?.closest(`header`)?.focus(),r?.focus({preventScroll:!0}),r===n?window.scrollTo(0,0):i?r?.scrollIntoView({block:`center`}):r?.scrollIntoView({block:l.matches&&r.matches(`h2`)?`nearest`:`start`})}}return window.addEventListener(`hashchange`,()=>y(!0)),y(!!window.location.hash),function(){l.matches&&m(`preview`)}}var Zt=[`campus flu clinic`,`international health`,`orthopedics`,`primary care`,`rehabilitation`,`rehabilitation center`,`sports medicine`,`travel vaccinations`],Qt={label:`Sample search suggestions`,minimumChars:3,suggest(e){let t=e.toLowerCase();return Zt.filter(e=>e!==t&&e.startsWith(t))}};function $t(e,t){let n=e.querySelector(`input[type="search"]`),r=document.createElement(`div`),i=document.createElement(`p`),a=document.createElement(`ul`),o=document.createElement(`p`);o.className=`search-suggestions-feedback`,o.setAttribute(`role`,`status`),r.className=`sample-search-suggestions`,r.hidden=!0,i.id=t+`-label`,a.id=t,a.setAttribute(`role`,`listbox`),a.setAttribute(`aria-labelledby`,i.id),r.append(i,a),e.after(r,o);let s=null,c=null,l=-1;function u(){c&&=(window.clearTimeout(c.timer),c.controller.abort(),null),r.hidden=!0,a.replaceChildren(),o.textContent=``,l=-1,n.removeAttribute(`aria-activedescendant`),s&&n.setAttribute(`aria-expanded`,`false`)}function d(e){e.length&&(a.replaceChildren(...e.map((e,n)=>{let r=document.createElement(`li`);return r.id=t+`-`+n,r.setAttribute(`role`,`option`),r.setAttribute(`aria-selected`,`false`),s.language&&(r.lang=s.language),r.textContent=e,r})),r.hidden=!1,n.setAttribute(`aria-expanded`,`true`))}function f(){u();let e=n.value.trim(),t=s;if(!t||e.length<t.minimumChars)return;let i={controller:new AbortController,step:0,timer:void 0};c=i;let a=async()=>{try{let a=await t.suggest(e,i.controller.signal);if(c!==i||n.value.trim()!==e)return;d(a),!r.hidden&&i.step&&m(i.step)}catch{c===i&&(o.textContent=`Search suggestions are unavailable. You can continue searching.`)}finally{c===i&&(c=null)}};t.delay?i.timer=window.setTimeout(a,t.delay):a()}function p(t){n.value=t.textContent,u(),n.focus({preventScroll:!0}),e.requestSubmit()}function m(e){if(r.hidden)return c||f(),c?(c.step=e,!0):!1;let t=a.children;l>=0&&t[l].setAttribute(`aria-selected`,`false`),l=l===-1?e>0?0:t.length-1:(l+e+t.length)%t.length;let i=t[l];return i.setAttribute(`aria-selected`,`true`),n.setAttribute(`aria-activedescendant`,i.id),i.scrollIntoView({block:`nearest`}),!0}return n.addEventListener(`input`,e=>{e.isComposing?u():f()}),n.addEventListener(`compositionend`,f),n.addEventListener(`blur`,u),n.addEventListener(`keydown`,e=>{if(!(!s||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey))switch(e.key){case`ArrowDown`:case`ArrowUp`:m(e.key===`ArrowDown`?1:-1)&&e.preventDefault();break;case`Escape`:if(r.hidden&&!c)break;e.preventDefault(),u();break;case`Enter`:if(l<0)break;e.preventDefault(),p(a.children[l])}}),e.addEventListener(`submit`,u),a.addEventListener(`mousedown`,e=>e.preventDefault()),a.addEventListener(`click`,e=>{let t=e.target.closest(`[role="option"]`);t&&p(t)}),function(e){if(s!==e){if(s=e,u(),s)i.textContent=s.label,n.setAttribute(`role`,`combobox`),n.setAttribute(`aria-autocomplete`,`list`),n.setAttribute(`aria-controls`,t);else for(let e of[`role`,`aria-autocomplete`,`aria-controls`,`aria-expanded`])n.removeAttribute(e)}}}var en=`https://mw-searchstax.github.io/university-health-search-demo/`,tn=en+`news/flu-clinic-update-2026/`,nn=`campus flu clinic`,rn={url:en+`care/resources/flu-shot-appointments/`,title:`Read the fictional flu shot appointment notice`};function an(e,t){return(typeof e==`string`?e.trim().toLowerCase().replace(/\s+/g,` `):``)===`campus flu clinic`?t:`off`}function on(e,t,n){if(n!==`indexed`&&n!==`both`)return e;let r=t.responseHeader?.params?.sort;if(t.response.start!==0||r&&r!==`score desc`)return e;let i=e.findIndex(e=>e.url===tn);return i===-1?e:[{...e[i],sampleIndexedPromotion:!0},...e.slice(0,i),...e.slice(i+1)]}function sn(){let e=document.createElement(`section`);e.className=`sample-external-promotion search-promotion-banner`,e.setAttribute(`aria-label`,`Sample external promotion`),e.hidden=!0;let t=document.createElement(`p`);t.className=`sample-external-promotion__label`,t.textContent=`Sample external promotion`;let n=document.createElement(`a`);return n.href=rn.url,n.textContent=rn.title,e.append(t,n),e}function cn(e,t){e.hidden=t!==`external`&&t!==`both`}function ln(t){function n(e){let t=Array.isArray(e)?e.find(e=>typeof e==`string`):e;return typeof t==`string`?t.trim():``}return(Array.isArray(t)?t:[]).flatMap(t=>{let r=e(n(t?.url));return r?[{url:r,title:n(t.name)||r,description:n(t.description)}]:[]})}function un(e,t,n,r,i=!1){e.replaceChildren(...t.map(e=>{let t=document.createElement(`section`);t.className=`search-promotion-banner`,t.setAttribute(`aria-label`,n);let a=document.createElement(`strong`);a.className=`search-promotion-heading`,a.textContent=n;let o=document.createElement(`a`);if(o.href=e.url,o.referrerPolicy=`no-referrer`,i&&(o.target=`_blank`,o.rel=`noopener noreferrer`),o.textContent=e.title,r&&(o.lang=r),t.append(a,o),e.description){let n=document.createElement(`p`);n.textContent=e.description,r&&(n.lang=r),t.append(n)}return t})),e.hidden=!t.length}function dn(e,t,n){n===`below`?t.nextElementSibling!==e&&t.after(e):t.previousElementSibling!==e&&t.before(e)}function fn(e,t){for(let n of e.querySelectorAll(`.search-promotion-marker, .sample-indexed-promotion`))n.textContent=t.promotionBadge===`Promoted`?n.dataset.defaultLabel||`Promoted`:t.promotionBadge;for(let n of e.querySelectorAll(`.search-promotion-heading, .sample-external-promotion__label`))n.textContent=t.promotionHeading===`Featured link`?n.dataset.defaultLabel||`Featured link`:t.promotionHeading,n.closest(`.search-promotion-banner`)?.setAttribute(`aria-label`,n.textContent)}function pn(e,n,r){let i=t(e||``,`related-search`);return!i||!n?.trim()?null:async(e,t)=>{let a=new URL(i);a.search=new URLSearchParams({search:e}),r&&a.searchParams.set(`language`,r);let o=await fetch(a,{signal:t,headers:{Authorization:n.trim(),Accept:`application/json`},credentials:`omit`,referrerPolicy:`no-referrer`,redirect:`error`});if(!o.ok)throw Error(`Discovery request failed`);let s=await o.json();if(s.success===!1||!Array.isArray(s.response?.docs))throw Error(`Discovery unavailable`);return s.response.docs.map(e=>e?.related_search).filter(e=>typeof e==`string`&&e.trim())}}function mn(e,t){let n=document.createElement(`section`);n.className=`search-related-terms`,n.setAttribute(`aria-label`,`Related searches`);let r=document.createElement(`strong`);r.textContent=`Related searches`;let i=document.createElement(`div`);n.append(r,i);let a,o,s;function c(){a?.abort(),a=void 0,s=void 0,o=void 0,n.remove(),i.replaceChildren()}async function l(r,l,u,d){if(!r||!d||!u||l===`off`){c();return}function f(){let t=e.parentElement.querySelector(`:scope > .search-suggestions-feedback`)||e,i=l===`above`?t:r;i.nextElementSibling!==n&&i.after(n)}if(o===u&&s===d){f();return}c(),o=u,s=d,n.hidden=!0,f();let p=new AbortController;a=p;try{let e=await d(u,p.signal);if(p.signal.aborted)return;for(let n of new Set(e)){let e=document.createElement(`button`);e.type=`button`,e.textContent=n,e.addEventListener(`click`,()=>t(n)),i.append(e)}n.hidden=!i.childElementCount}catch{p.signal.aborted||(i.textContent=`Related searches are unavailable for this query. Check the Discovery settings for your app.`,n.hidden=!1,o=void 0)}}return{show:l,clear:c,setLabel(e){r.textContent=e,n.setAttribute(`aria-label`,e)}}}function hn(e,t=`, `){return Array.isArray(e)?e.map(e=>hn(e)).filter(Boolean).join(t):[`number`,`string`,`boolean`].includes(typeof e)?String(e):``}function gn(t,n,r,i=``){let a={url:``,thumbnail:``,values:[],promoted:t[`[elevated]`]===!0},o=new Set;for(let s of n){if(!s||typeof s.name!=`string`||!Object.hasOwn(t,s.name)&&!Object.hasOwn(r??{},s.name))continue;let n=s.result_card??``;if(n&&o.has(n))continue;o.add(n);let c=hn(t[s.name],n===`paths`?` / `:`, `);if(n===`url`||n===`thumbnail`){a[n]=e(c)||``;continue}let l=hn(r?.[s.name],` `),u=l||c;if(u){if(n===`distance`){if(!Number.isFinite(Number(c)))continue;u=[Math.floor(Number(c)),i].filter(e=>e!==``).join(` `)}a.values.push({role:n,label:typeof s.title==`string`?s.title:``,value:u,highlighted:!!l})}}return a}function _n(e,t,n){let r=e.metadata?.results,i=Array.isArray(r),a=e.responseHeader?.params,o=a?.hl,s=n??(String(o)===`true`||String(o)!==`false`&&void 0);return{cards:t.map(t=>{let n=a?.uniqueId,o=n&&t?.[n],c=s===!0&&(typeof o==`string`||typeof o==`number`)?e.highlighting?.[o]:void 0;return gn(t??{},i?r:[],c,e.metadata?.locationSearch?.unit)}),mappingsKnown:i,highlighting:s}}function vn(e,t,n){return e?!t&&n>0?`No configured Results Fields have a displayable value on this page.`:``:`Results Fields are unknown for this profile.`}function yn(e,t=!1){if(!t)return[{text:e,matched:!1}];let n=0,r=[];for(let t of e.split(/(<\/?(?:em|mark|b|strong)>)/gi))t&&(/^<(?:em|mark|b|strong)>$/i.test(t)?n++:/^<\/(?:em|mark|b|strong)>$/i.test(t)?n=Math.max(0,n-1):r.push({text:t,matched:n>0}));return r}function bn(e,t){for(let n of yn(t.value,t.highlighted))if(n.matched){let t=document.createElement(`mark`);t.className=`search-result-hit`,t.textContent=n.text,e.append(t)}else e.append(n.text)}function xn(t,n){t.classList.add(`mapped-result-card`);let r=n.values.find(e=>e.role===`ribbon`);if(r){let e=document.createElement(`span`);e.className=`searchstax-search-result-ribbon`,bn(e,r),t.append(e)}if(n.thumbnail){let e=document.createElement(`img`);e.src=n.thumbnail,e.className=`mapped-result-thumbnail`,e.alt=``,e.loading=`lazy`,e.referrerPolicy=`no-referrer`,t.append(e)}let i=n.values.find(e=>e.role===`title`);if(i||n.url){let e=document.createElement(`h4`),r=n.url?document.createElement(`a`):document.createElement(`span`);r.className=`searchstax-search-result-title`,r instanceof HTMLAnchorElement&&(r.href=n.url,r.referrerPolicy=`no-referrer`),i?bn(r,i):r.textContent=n.url,e.append(r),t.append(e)}for(let r of n.values.filter(e=>e.role!==`title`&&e.role!==`ribbon`).sort((e,t)=>Number(!e.role)-Number(!t.role))){let n=document.createElement(`p`);r.role===`description`&&(n.className=`search-lab__result-description`),r.label&&n.append(r.label+`: `),(r.role===`paths`||r.role===`date`||r.role===`distance`)&&(n.className=`mapped-result-`+r.role);let i=!r.role&&/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(r.value)?e(r.value):null;if(i){let e=document.createElement(`img`);e.className=`mapped-result-thumbnail`,e.src=i,e.alt=``,e.referrerPolicy=`no-referrer`,n.append(e)}else if(r.role===`date`&&/^\d{4}-\d{2}-\d{2}(?:T\S+)?$/.test(r.value)&&Number.isFinite(Date.parse(r.value))){let e=document.createElement(`time`);e.dateTime=r.value,e.textContent=r.value,n.append(e)}else bn(n,r);t.append(n)}}var Sn=e=>!!e&&typeof e==`object`&&!Array.isArray(e);function Cn(e){if(e!=null){if(typeof e!=`boolean`)throw Error(`Use true, false, or null for each feature setting.`);return e}}function wn(e,t){let n;try{n=JSON.parse(e)}catch{throw Error(`Choose a valid Search Lab configuration JSON file.`)}if(!Sn(n)||typeof n.endpoint!=`string`||n.endpoint.replace(/\/$/,``)!==t.replace(/\/$/,``))throw Error(`The snapshot’s Select endpoint must match the app you’re connecting to.`);if(!Array.isArray(n.profiles))throw Error(`The snapshot needs a profiles array from this app.`);let r=new Set,i=n.profiles.map(e=>{if(!Sn(e)||typeof e.profile!=`string`||!e.profile.trim()||typeof e.language!=`string`||!/^[a-z][a-z0-9]*(?:[-_][a-z0-9]+)*$/i.test(e.language.trim()))throw Error(`Each snapshot profile needs a name and a language code.`);let t=e.profile.trim(),n=e.language.trim().toLowerCase().replaceAll(`-`,`_`),i=JSON.stringify([n,t]);if(r.has(i))throw Error(`The snapshot lists the same language and profile twice.`);return r.add(i),{language:n,profile:t,relatedSearches:Cn(e.relatedSearches),smartAnswers:Cn(e.smartAnswers),highlighting:Cn(e.highlighting)}}),a=n.relatedSearchesByLanguage,o=new Map;if(a!==void 0){if(!Sn(a))throw Error(`Use a language-to-setting object for Related Searches.`);for(let[e,t]of Object.entries(a))o.set(e.toLowerCase().replaceAll(`-`,`_`),Cn(t))}else for(let{language:e,relatedSearches:t}of i)t!==void 0&&(o.has(e)?o.get(e)!==t&&o.set(e,void 0):o.set(e,t));for(let e of i)e.relatedSearches=o.get(e.language);let s=n.entitlements??{};if(!Sn(s))throw Error(`The snapshot’s entitlements must be an object.`);return{profiles:i,entitlements:{relatedSearches:Cn(s.relatedSearches),smartAnswers:Cn(s.smartAnswers)}}}async function Tn(e){if(!globalThis.crypto?.subtle)return``;let t=new TextEncoder().encode(e.trim().replace(/\/$/,``)),n=await crypto.subtle.digest(`SHA-256`,t);return Array.from(new Uint8Array(n),e=>e.toString(16).padStart(2,`0`)).join(``)}function En(e,t){return e===!1?`Unavailable`:t===!1?`Off`:e===!0&&t===!0?`On`:`Unknown`}function Dn(e,t,n=t?.highlighting,r){let i=e=>e===void 0?`unknown`:e?`yes`:`no`;return[`relatedSearches`,`smartAnswers`].map(n=>{let a=n===`relatedSearches`?`Related Searches`:`Smart Answers`,o=En(e[n],t?.[n]),s=a+` — `+o+` (entitled: `+i(e[n])+`, configured: `+i(t?.[n])+`).`;if(o===`On`&&r){if(n===`relatedSearches`&&(!r.relatedURL||!r.discoveryKey))return s+` Add the Related Searches endpoint and Discovery key to preview it.`;if(n===`smartAnswers`&&!r.answerEndpoint)return s+` Add the Answer endpoint to preview it.`}return s}).concat(`Hit highlighting — `+(n===void 0?`Unknown`:n?`On`:`Off`)+`.`).join(` `)}function On(e){if(e)try{return Intl.getCanonicalLocales(e.trim().replaceAll(`_`,`-`))[0]}catch{return}}var kn=65536,An=/\r\n\r\n|\n\n|\r\r|\n\r\n|\r\n\n/,jn=/^ {0,3}\[([^\]\r\n]+)\]:[ \t]*(<[^>\r\n]+>|[^\s<>]+)(?:[ \t]+"[^"\r\n]*")?[ \t]*$/gm,Mn=/(!?)\[([^\]\n]+)\](?:\((<[^>\n]+>|[^\s()<>]+(?:\([^()\s]*\)[^\s()<>]*)*)(?:[ \t]+"[^"\n]*")?\)|\[([^\]\n]*)\])?/g;function Nn(e){try{let t=new URL(e.trim());return t.protocol!==`https:`||!t.hostname.endsWith(`.searchstax.com`)||t.port||t.username||t.password||t.search||t.hash||!/^\/api\/v1\/(?:\d+\/)?answer\/?$/.test(t.pathname)?null:t.href}catch{return null}}var Pn=class extends Error{};function Fn(e){return e.replace(/\[comment\]: <> \(\{[\s\S]*?(?:\}\)|$)/g,``).trim()}function In(e){if(e.includes(`[!CAUTION]`))return!0;if(!e.trimStart().startsWith(`{`))return!1;try{return JSON.parse(e)?.success===!1}catch{return!1}}async function Ln(e,t,n,r){let i=new URL(e.answerEndpoint);i.search=new URLSearchParams({q:t,model:e.profile}).toString(),e.language&&i.searchParams.set(`language`,e.language);let a=await fetch(i,{headers:{Authorization:`Token `+e.token,Accept:`text/event-stream`},credentials:`omit`,referrerPolicy:`no-referrer`,redirect:`error`,cache:`no-store`,signal:n});if(a.status===401||a.status===403)throw new Pn(`Smart Answers couldn’t access this profile. Check the read-only token and confirm Smart Answers is enabled and published.`);if(!a.ok||!a.headers.get(`content-type`)?.startsWith(`text/event-stream`)||!a.body)throw new Pn(`Smart Answers is unavailable. Check the Answer endpoint or try another search.`);let o=a.body.pipeThrough(new TextDecoderStream).getReader(),s=``,c=``;try{for(;;){let{done:e,value:t}=await o.read();if(e)throw new Pn(`The Smart Answer was interrupted. Try your search again.`);c+=t;let n=!1,i;for(;i=An.exec(c);){let e=c.slice(0,i.index);c=c.slice(i.index+i[0].length);let t=e.split(/\r\n|\r|\n/).filter(e=>e===`data`||e.startsWith(`data:`)).map(e=>e.slice(5).replace(/^ /,``)).join(`
`);if(t&&t!==`I_AM_A_QUESTION`){if(t===`I_AM_NOT_A_QUESTION`)return null;if(t===`CLOSE`)return Fn(s);if(In(t)||s.length+t.length>kn)throw new Pn(`Smart Answers couldn’t generate an answer. Try another search.`);s+=t,n=!0}}if(c.length>kn)throw new Pn(`Smart Answers returned an unreadable response.`);n&&r(Fn(s))}}finally{await o.cancel().catch(()=>{}),o.releaseLock()}}function Rn(t,n){let r=e=>e.replace(/^#{1,6}[ \t]+/gm,``).replace(/\*\*([^*\n]+)\*\*|__([^_\n]+)__/g,(e,t,n)=>t??n),i=[],a=new Map,o=t.replace(jn,(e,t,n)=>(a.set(t.trim().toLowerCase(),n),``)).trim(),s=0;for(let t of o.matchAll(Mn)){let[c,l,u,d,f]=t,p=d??a.get((f||u).trim().toLowerCase());if(!p)continue;let m=t.index??0;i.push(r(o.slice(s,m))),s=m+c.length;let h=!l&&n?e(p.replace(/^<|>$/g,``)):null;if(!h){i.push(r(u));continue}let g=document.createElement(`a`);g.href=h,g.referrerPolicy=`no-referrer`,g.textContent=r(u),i.push(g)}return i.push(r(o.slice(s))),i}function zn(e){let t=e.querySelector(`[data-customer-answer]`),n=t.querySelector(`[data-customer-answer-status]`),r=t.querySelector(`[data-customer-answer-content]`),i=e.querySelector(`[data-customer-answer-announcement]`),a=null;function o(e){n.textContent=e,i&&(i.textContent=e)}function s(){a?.abort(),a=null,t.hidden=!0,o(``),r.replaceChildren(),r.removeAttribute(`lang`),r.hidden=!0}async function c(e,n){if(s(),!e.answerEndpoint)return;let i=On(e.language);i&&(r.lang=i);let c=new AbortController;a=c,t.hidden=!1,o(`Generating a Smart Answer…`);let l=window.setTimeout(()=>c.abort(),45e3);try{let t=await Ln({...e,answerEndpoint:e.answerEndpoint},n,c.signal,e=>{a===c&&e&&(r.replaceChildren(...Rn(e,!1)),r.hidden=!1)});if(a!==c)return;t===null?s():t?(r.replaceChildren(...Rn(t,!0)),r.hidden=!1,o(`Smart Answer ready.`)):o(`No Smart Answer was returned for this search.`)}catch(e){if(a!==c)return;r.replaceChildren(),r.hidden=!0,o(e instanceof Pn?e.message:`Smart Answers is unavailable. Check the Answer endpoint or try another search.`)}finally{window.clearTimeout(l),a===c&&(a=null)}}return{clear:s,start:c}}function Bn(e,t){let n=2;return{label:`Search suggestions`,language:On(e.language),delay:250,get minimumChars(){return n},async suggest(r,i){let a=new URL(t);a.searchParams.set(`q`,r),e.language&&a.searchParams.set(`language`,e.language);let o=await fetch(a,{headers:{Authorization:`Token `+e.token},credentials:`omit`,redirect:`error`,referrerPolicy:`no-referrer`,cache:`no-store`,signal:AbortSignal.any([i,AbortSignal.timeout(5e3)])});if(!o.ok)throw Error(`Unable to fetch suggestions`);let s=await o.json();if(s?.metadata?.enabled===!1)throw Error(`Auto-Suggest is disabled`);let c=s?.metadata?.minPrefixChars;typeof c==`number`&&Number.isSafeInteger(c)&&c>0&&(n=c);let l=new Set([r.toLowerCase()]),u=[];for(let e of Object.values(s?.suggest??{}))for(let t of Object.values(e??{}))if(Array.isArray(t?.suggestions))for(let e of t.suggestions){if(typeof e?.term!=`string`)continue;let t=e.term.trim(),n=t.toLowerCase();if(t&&!l.has(n)&&(l.add(n),u.push(t),u.length===8))return u}return u}}}var Vn=[`campus norte`,`campus sur`,`clínica del campus norte`,`clínica del campus sur`,`rehabilitación`,`salud pública`,`simulación de enfermería`],Hn={label:`Sugerencias de búsqueda`,language:`es`,minimumChars:3,suggest(e){let t=e.toLocaleLowerCase(`es`);return Vn.filter(e=>e!==t&&e.startsWith(t))}},Un={en:{campus:[`campus clinic`,`public health`],"campus clinic":[`campus`,`rehabilitation`],rehabilitation:[`physical therapy`,`rehabilitation services`],"physical therapy":[`rehabilitation`,`sports medicine`],"rehabilitation services":[`rehabilitation`,`physical therapy`],"sports medicine":[`physical therapy`]},es:{campus:[`campus norte`,`campus sur`],rehabilitación:[`terapia física`],clínica:[`campus norte`,`campus sur`]}},Wn=e=>Un.en[e.toLowerCase()]??[],Gn=e=>Un.es[e.toLowerCase()]??[],Kn=`clínica de gripe del campus`;function qn(e,t){return an(e.trim().toLowerCase()===`clínica de gripe del campus`?nn:e,t)}function Jn(e,t,n,r){if(t){let n=t===`url desc`?-1:1;return e.sort((e,t)=>n*e.url.localeCompare(t.url))}return on(e,{response:{start:0}},qn(n,r)).map(e=>({...e,promoted:!!e.sampleIndexedPromotion}))}function Yn(e,t){let n=e.querySelector(`form`),r=$t(n,`profile-search-suggestions`),i=mn(n,e=>{n.querySelector(`input`).focus(),t(e)}),a=zn(e),o=e.querySelector(`.smart-answers-sample`),s=[...o.querySelectorAll(`summary, .smart-answers-sample__note, strong, .smart-answers-sample__card > p:nth-child(3), a`)].map(e=>[e,e.textContent]),c=[`Ejemplo de Smart Answers`,`Un ejemplo fijo con contenido ficticio.`,`¿Qué incluye la exposición del Centro de Rehabilitación?`,`Incluye la distribución de un apartamento modelo y planos de mobiliario ajustable. Los dibujos de las paredes señalan puertas, zonas de circulación y movimiento.`,`Lee la página del Centro de Rehabilitación en inglés`],l=sn(),u=l.querySelector(`a`),d=u.textContent,f=e.querySelector(`[data-exp-promotions]`),p=document.createElement(`div`);f.append(p);let m,h,g,_,v,y;function b(){a.clear(),y=void 0,i.clear(),r(null),o.hidden=!0,l.remove(),l.hidden=!0,p.replaceChildren(),h=g=void 0}return{clear:b,update(t,n,p,x){if(h!==n||g!==p){b(),h=n,h||f.prepend(l),g=p;let e=g.language.split(/[-_]/)[0]===`es`;i.setLabel(e?`Búsquedas relacionadas`:`Related searches`),s.forEach(([t,n],r)=>{t.textContent=e?c[r]:n}),o.lang=e?`es`:`en`;let t=e?`Promoción externa de ejemplo`:`Sample external promotion`;l.setAttribute(`aria-label`,t),l.querySelector(`p`).dataset.defaultLabel=t,u.textContent=e?`Lee el aviso ficticio de citas de vacunación`:d,_=h?h.suggestEndpoint&&Bn({...h,...g},h.suggestEndpoint):g.language===`es`?Hn:Qt,v=En(!h||h.configuration?.entitlements.relatedSearches,g.relatedSearches)===`On`?h?pn(h.relatedURL,h.discoveryKey,g.language):g.language===`es`?Gn:Wn:null}m=t.promotionHeading,dn(f,e.querySelector(`#lab-exp-results`),t.bannerPlacement),fn(e,t),r(h||t.showSuggestions?_:null),i.show(e.querySelector(`#lab-exp-results`),h&&t.relatedPlacement===`off`?`below`:t.relatedPlacement,x,v),o.hidden=!!h||!g.smartAnswers||!t.showSmartAnswersSample,o.hidden&&(o.open=!1),cn(l,h?`off`:qn(x,t.samplePromotions)),h?.answerEndpoint&&En(h.configuration?.entitlements.smartAnswers,g.smartAnswers)===`On`&&y!==x&&(y=x,x?a.start({...h,...g},x):a.clear())},showExternalPromotions(e){un(p,e,m,g?.language,!0)}}}function Xn(e,t){let n=document.createElement(`div`);n.className=`search-recovery`,n.hidden=!0;let r=document.createElement(`p`);r.className=`search-lab__feedback`,r.dataset.tone=`error`,r.id=`search-error-`+ ++Zn,r.setAttribute(`role`,`status`),r.tabIndex=-1;let i=document.createElement(`button`);i.type=`button`,i.className=`lt-btn lt-btn--secondary`,i.setAttribute(`aria-describedby`,r.id),n.append(r,i);let a,o,s=!1,c;function l(){n.contains(document.activeElement)&&(o?.isConnected&&o.getClientRects().length&&!o.matches(`:disabled`)?o:e).focus({preventScroll:!0}),n.hidden=!0,r.textContent=``,s=!1}return i.addEventListener(`click`,()=>{s||t()}),{begin(t,n=e){t!==a||document.activeElement!==i?l():r.textContent=``,a=t,o=n,s=!0,c=document.activeElement,i.setAttribute(`aria-disabled`,`true`)},error(t,o=`Retry search`){s=!1,i.removeAttribute(`aria-disabled`),i.textContent=o,a.isConnected||(a=e.closest(`form`)||e),a.nextElementSibling!==n&&a.after(n),n.hidden=!1,r.textContent=t,requestAnimationFrame(()=>{if(n.hidden||s||!a.getClientRects().length)return;let e=a.getBoundingClientRect(),t=n.getBoundingClientRect(),r=document.activeElement;(r===c||a.contains(r)||n.contains(r))&&e.bottom>=0&&e.top<innerHeight&&(t.top<8||t.bottom>innerHeight-8)&&n.scrollIntoView({block:`center`,behavior:`instant`})})},clear:l}}var Zn=0,Qn=/^[A-Za-z_][\w.-]*$/,$n=class extends Error{},er=class extends $n{};function tr(e){return Array.isArray(e)?e.find(e=>typeof e==`string`)??``:typeof e==`string`?e:``}async function nr(e,t,n){let r=new URL(e.endpoint);r.search=new URLSearchParams({q:t.query,start:String(t.start),rows:String(t.rows),facet:`true`}).toString(),e.settings?.highlighting!==void 0&&r.searchParams.set(`hl`,String(e.settings.highlighting)),e.language&&r.searchParams.set(`language`,e.language),e.profile&&r.searchParams.set(`model`,e.profile),t.sort&&r.searchParams.set(`sort`,t.sort);for(let[e,n]of[[t.filters,``],[t.excludeFilters,`-`]])e?.forEach((e,t)=>{Qn.test(t)&&r.searchParams.append(`fq`,n+t+`:"`+e.replace(/[\\"]/g,`\\$&`)+`"`)});let i=await fetch(r,{headers:{Authorization:`Token `+e.token},credentials:`omit`,redirect:`error`,cache:`no-store`,referrerPolicy:`no-referrer`,signal:n});if(i.status===401||i.status===403)throw new er(`The Search App rejected the token. Check that it’s an active read-only token for this app.`);if(i.status===404)throw new $n(`Search API endpoint not found. Copy the Select endpoint from App Settings.`);if(i.status===400)throw new $n(`The Search App rejected the request. Check the profile, language, and search term.`);if(i.status===429)throw new $n(`The Search App is receiving too many requests. Try again in a moment.`);if(!i.ok)throw new $n(`The Search App is unavailable. Try again in a moment.`);return await i.json()}async function rr(e,t,n){let r=await nr(e,t,n),i=r?.response;if(!i||!Number.isSafeInteger(i.numFound)||i.numFound<0||!Array.isArray(i.docs))throw new $n(`The endpoint didn’t return search results. Check the Select endpoint and Search Profile.`);let a=ln(r.externalLinks),o=(Array.isArray(r.metadata?.facets)?r.metadata.facets:[]).filter(e=>e&&typeof e.name==`string`&&Qn.test(e.name)).map(e=>{let t=r.facet_counts?.facet_fields?.[e.name]??[],n=[];for(let e=0;e<t.length;e+=2){let r=t[e],i=t[e+1];typeof r==`string`&&r&&typeof i==`number`&&n.push({value:r,count:i})}return{field:e.name,label:e.label||e.name,choices:n}}),s=(Array.isArray(r.metadata?.sorts)?r.metadata.sorts:[]).filter(e=>e&&typeof e.name==`string`&&Qn.test(e.name)&&(e.order===`asc`||e.order===`desc`)).map(e=>({value:e.name+` `+e.order,label:e.label||e.name}));return{payload:r,response:i,total:i.numFound,resultCount:i.docs.length,externalPromotions:a,facets:o,sorts:s}}async function ir(e,t,n){let{payload:r,response:i,...a}=await rr(e,t,n),o=r.responseHeader?.params,s=e.profile||o?.model,c=(e.language||o?.language)?.toLowerCase().replaceAll(`-`,`_`),l=e.configuration?.profiles.filter(e=>e.profile===s&&(!c||e.language===c)),u=e.settings??(l?.length===1?l[0]:void 0),{cards:d,...f}=_n(r,i.docs,u?.highlighting);return{...a,...f,settings:u,language:c,cards:d.filter(e=>e.url||e.thumbnail||e.values.length)}}async function ar(t,n,r){let{payload:i,response:a,...o}=await rr(t,n,r),s=Array.isArray(i.metadata?.results)?i.metadata.results:[],c=e=>s.find(t=>t.result_card===e)?.name??e,l=c(`url`),u=c(`title`),d=c(`description`),f=a.docs.flatMap(t=>{let n=e(tr(t[l]));return n?[{url:n,title:tr(t[u])||n,description:tr(t[d]),promoted:t[`[elevated]`]===!0}]:[]});return{...o,results:f}}var or=`https://mw-searchstax.github.io/university-health-search-demo/`,sr=[{section:`programs`,topic:[`Nursing`,`Enfermería`],path:`education/nursing-simulation/`,enrollment:!0,published:`2026-03-16`,en:[`Nursing Simulation`,`Explore campus classroom exercises, equipment and observation logs.`],es:[`Simulación de enfermería`,`Explora los ejercicios de aula, los materiales y los registros de observación del campus.`]},{section:`programs`,topic:[`Public health`,`Salud pública`],path:`education/public-health/`,en:[`Public Health`,`Explore campus coursework on population health and community education.`],es:[`Salud pública`,`Conoce los cursos del campus sobre salud de la población y educación comunitaria.`]},{section:`locations`,topic:[`North campus`,`Campus norte`],path:`locations/north-campus-clinic/`,en:[`North Campus Clinic`,`Find the teaching annex for primary care and neurology.`],es:[`Clínica del campus norte`,`Consulta la sede docente de atención primaria y neurología.`]},{section:`locations`,topic:[`South campus`,`Campus sur`],path:`locations/south-campus-clinic/`,en:[`South Campus Clinic`,`Explore the teaching annex with illustration displays and seminar rooms.`],es:[`Clínica del campus sur`,`Conoce la sede docente con salas de seminarios y exposiciones de ilustraciones.`]},{section:`programs`,topic:[`Rehabilitation`,`Rehabilitación`],path:`care/services/rehabilitation/`,en:[`Rehabilitation`,`Explore rehabilitation, physical therapy and sports medicine coursework.`],es:[`Rehabilitación`,`Explora la formación en rehabilitación, terapia física y medicina deportiva.`]},{section:`locations`,topic:[`Rehabilitation`,`Rehabilitación`],path:`locations/rehabilitation-center/`,en:[`Rehabilitation Center`,`See the rehabilitation center’s physical therapy teaching space.`],es:[`Centro de rehabilitación`,`Conoce el espacio docente de terapia física del centro de rehabilitación.`]},{section:`programs`,topic:[`Orthopedics`,`Ortopedia`],path:`care/services/orthopedics/`,en:[`Orthopedics`,`Explore joint models and illustrated teaching materials.`],es:[`Ortopedia`,`Explora modelos articulares y materiales de enseñanza ilustrados.`]},{section:`shared`,topic:[`Flu clinic`,`Clínica de gripe`],path:`news/flu-clinic-update-2024/`,published:`2024-09-15`,en:[`Flu Clinic Updates — 2024 Archive`,`Archived campus flu clinic teaching notices.`],es:[`Clínica de gripe — Archivo de 2024`,`Avisos anteriores de la clínica de gripe del campus.`]},{section:`shared`,topic:[`Flu clinic`,`Clínica de gripe`],path:`news/flu-clinic-update-2026/`,published:`2026-09-15`,en:[`Flu Clinic Updates — 2026 Notice`,`The current campus flu clinic notice.`],es:[`Clínica de gripe — Aviso de 2026`,`El aviso actual de la clínica de gripe del campus.`]}],cr=[{language:`en`,profile:`Programs`,section:`programs`},{language:`en`,profile:`Locations`,section:`locations`},{language:`es`,profile:`Programas`,section:`programs`},{language:`es`,profile:`Ubicaciones`,section:`locations`}].map(e=>({...e,relatedSearches:e.section!==`locations`,smartAnswers:e.section===`programs`,highlighting:e.section===`programs`}));function lr(e,t,n,r){let i=e.language===`es`,a=cr.find(t=>t.language===e.language&&t.profile===e.profile),o=sr.filter(e=>!n||e.section===a?.section||e.section===`shared`).map(t=>{let[n,r]=i?t.es:t.en,a=cr.find(n=>n.language===e.language&&n.section===t.section)?.profile??(i?`Avisos`:`Notices`);return{title:n,description:r,url:or+t.path,type:a,topic:t.topic[+!!i],enrollment:t.enrollment,published:t.published}}).filter(e=>t.toLocaleLowerCase().split(/\s+/).every(t=>(e.title+` `+e.description).toLocaleLowerCase().includes(t))),s=n?`topic`:`type`,c=e=>n?e.topic:e.type,l=new Map;for(let e of o)l.set(c(e),(l.get(c(e))??0)+1);let u=o.filter(e=>!r.has(s)||c(e)===r.get(s));return{entries:u,total:u.length,facets:[{field:s,label:n?a?.section===`locations`?`Campus`:i?`Área de estudio`:`Field of study`:i?`Tipo de contenido`:`Content type`,choices:[...l].map(([e,t])=>({value:e,count:t}))}]}}function ur(e,t,n,r){let i=[{name:`title`,result_card:`title`},{name:`url`,result_card:`url`},{name:`description`,result_card:`description`},{name:`type`,result_card:cr.find(e=>e.profile===t.profile)?.section===`locations`?`paths`:`ribbon`},{name:`published`,result_card:`date`,title:t.language===`es`?`Fecha de publicación`:`Published`},{name:`enrollment`,result_card:``,title:t.language===`es`?`Inscripción abierta`:`Open for enrollment`},{name:`topic`,result_card:``,title:t.language===`es`?`Tema`:`Topic`}];return e.map(e=>{let a=gn(e,i);if(t.highlighting)for(let e of a.values){let t=e.value.toLocaleLowerCase().indexOf(n.toLocaleLowerCase());if(t<0)continue;let r=e.value;e.value=r.slice(0,t)+`<em>`+r.slice(t,t+n.length)+`</em>`+r.slice(t+n.length),e.highlighted=!0}return a.promoted=!!e.promoted,a.thumbnail=r[e.url]??``,a})}function dr(e=!1,t=cr,n=t[0],r=`campus`,i=cr[0].language){return{source:e?`app`:`demo`,defaultLanguage:i,profiles:t.map(({language:e,profile:t,relatedSearches:n,smartAnswers:r,highlighting:i})=>({language:e,profile:t,relatedSearches:n,smartAnswers:r,highlighting:i})),selected:{language:n.language,profile:n.profile},initialQuery:e?``:r}}var fr=e=>{if(!e)return`App default language`;let t=On(e);if(!t)return e;try{return new Intl.DisplayNames([`en`],{type:`language`}).of(t)||e}catch{return e}};function pr(e,t){let n=t=>e.querySelector(t),r=n(`[data-exp-language] select`),i=n(`[role="tablist"]`),a=n(`[role="tabpanel"]`),s=n(`.experience-results ul`),c=a.querySelector(`[role="status"]`),l=n(`input[type="search"]`),u=n(`[data-exp-prev]`),d=n(`[data-exp-next]`),f=n(`[data-exp-source]`),p=n(`[data-exp-pages]`),m=null,h=cr,g=h,_=h,v=_[0],y=cr[0].language,b=v;function x(e,t){let n=_.filter(t=>t.language===e);return n.find(e=>e.profile===t?.profile)??n.find(e=>e.profile===b?.profile&&e.language===b.language)??n[0]??{language:e,profile:``}}let S=`campus`,C=0,w=0,T=n(`form`),E=T,D=l,O=Xn(l,()=>{B(E,D)}),k={...o},A=new Map,j=n(`[data-exp-facets]`),M=n(`[data-exp-filter-panel]`),N=n(`[data-exp-filter-toggle]`),P=n(`[data-exp-sort] select`),ee=n(`[data-exp-empty]`),te=[],F=!1,I=``,L,R=Yn(e,H),z=()=>v.language.split(/[-_]/)[0]===`es`;function ne(){let e=z(),t=e&&k.searchFieldText===o.searchFieldText?`Buscar en el sitio`:k.searchFieldText;l.placeholder=t,n(`form label`).textContent=t,n(`form`).setAttribute(`aria-label`,t),n(`button[type="submit"]`).textContent=e&&k.searchButtonText===o.searchButtonText?`Buscar`:k.searchButtonText,ee.textContent=e&&k.noResultsText===o.noResultsText?`No hay coincidencias. Prueba otra búsqueda o quita un filtro.`:k.noResultsText,I&&(ee.textContent=I),ee.hidden=!F&&!I,u.textContent=e?`Página anterior`:`Previous page`,d.textContent=e?`Página siguiente`:`Next page`,N.textContent=(e?`Filtros`:`Filters`)+(A.size?` (`+A.size+`)`:``),n(`[data-exp-sort] span`).textContent=e?`Ordenar por`:`Sort by`,n(`[data-exp-sort]`).hidden=!k.showSorting||!te.length,n(`[data-exp-sort-hint]`).hidden=!m||!v.profile||!k.showSorting||!!te.length,v.profile?R.update(k,m,v,S):R.clear()}N.addEventListener(`click`,()=>{N.setAttribute(`aria-expanded`,String(N.getAttribute(`aria-expanded`)!==`true`))}),P.addEventListener(`change`,()=>{C=0,B(n(`[data-exp-sort]`),P)});function re(e){let t=document.activeElement,n=j.contains(t);j.replaceChildren();for(let{field:t,label:n,choices:r}of e){if(!k.filters||!r.length&&!A.has(t))continue;let e=document.createElement(`fieldset`),i=document.createElement(`legend`);i.textContent=n,e.append(i);let a=v.language===`es`&&!m?`Todas las opciones`:`All`,o=[{value:``,count:0},...r],s=A.get(t)||``;o.some(e=>e.value===s)||o.push({value:s,count:0});for(let n of o){let r=document.createElement(`label`),i=document.createElement(`input`);i.type=`radio`,i.name=`exp-`+t,i.value=n.value,i.checked=s===n.value,i.addEventListener(`change`,()=>{n.value?A.set(t,n.value):A.delete(t),C=0,B(r,i)}),r.append(i,n.value?n.value+` (`+n.count+`)`:a),e.append(r)}j.append(e)}M.hidden=!j.childElementCount,n&&[...j.querySelectorAll(`input`)].find(e=>e.name===t?.name&&e.checked)?.focus()}let ie;function ae(){ie?.abort(),ie=void 0,a.removeAttribute(`aria-busy`)}async function B(e=T,n=l){if(ae(),E=e,D=n,O.begin(e,n),F=!1,I=``,ne(),R.showExternalPromotions([]),e!==p&&s.replaceChildren(),k.filters&&S&&(!m||m.endpoint&&m.token)||re([]),e!==p&&(p.hidden=!0),!v.profile){c.textContent=v.language?`No profiles are included for `+fr(v.language)+`.`:`The default profile’s language is unknown.`;return}if(m&&(!m.endpoint||!m.token)){c.textContent=`To search your app, set the Select endpoint and read-only token in src/config.js.`;return}let r=z();if(!S){c.textContent=r?`Escribe un término de búsqueda.`:`Enter a search term.`;return}let i=new AbortController;ie=i,a.setAttribute(`aria-busy`,`true`),c.textContent=`Searching…`;try{let e,n=De.slice(1).map(({order:e,label:t})=>({value:e,label:r?t.replace(`Page address`,`Dirección de página`):t})),a=[],l,f=k.resultsPerPage,h;if(m){let t=await ir({...m,...v,settings:v},{query:S,start:C,rows:f,sort:k.showSorting?P.value:``,filters:new Map(A)},AbortSignal.any([i.signal,AbortSignal.timeout(12e3)]));if(ie!==i)return;I=vn(t.mappingsKnown,t.cards.length,t.total),L=t.highlighting,n=t.sorts,a=t.externalPromotions,l=t.facets,e=t.cards,h=t.total}else{let n=lr(v,S,k.profileTabs,A);e=ur(Jn(n.entries,k.showSorting?P.value:``,S,k.samplePromotions).slice(C,C+f),v,S,t),h=n.total,l=n.facets}if(ie!==i)return;O.clear(),w=C,s.replaceChildren(),te=n;let g=P.value;P.replaceChildren(new Option(r?`Relevancia`:`Relevance`,``),...te.map(e=>new Option(e.label,e.value))),te.some(e=>e.value===g)&&(P.value=g),F=h===0,ne(),R.showExternalPromotions(a),re(l);for(let t of e){let e=document.createElement(`li`);if(t.promoted){let t=document.createElement(`strong`);t.className=m?`search-promotion-marker`:`sample-indexed-promotion`,t.dataset.defaultLabel=r?m?`Promocionado`:`Promoción indexada de ejemplo`:m?`Promoted`:`Sample indexed promotion`,t.textContent=k.promotionBadge===o.promotionBadge?t.dataset.defaultLabel:k.promotionBadge,e.append(t)}xn(e,t);let n=e.querySelector(`a`);n&&(n.target=`_blank`,n.rel=`noopener noreferrer`,m||(n.hreflang=`en`)),s.append(e)}oe(),s.lang=On(v.language)||``;let _=h>f?C+1+`–`+Math.min(C+f,h)+(r?` de `:` of `):``,y=r?h===1?` resultado para `:` resultados para `:h===1?` result for `:` results for `;c.textContent=h?_+h+y+`“`+S+`”`:(r?`Sin resultados para `:`No results for `)+`“`+S+`”.`,u.disabled=C===0,d.disabled=C+f>=h,p.hidden=h<=f}catch(t){if(ie!==i)return;c.textContent=e===p?r?`Resultados de la página anterior.`:`Showing the previous page.`:``;let n=t instanceof $n?t.message:r?`No se pudo cargar la búsqueda. Inténtalo de nuevo.`:`Couldn’t load this search. Try again.`;O.error(n,r?`Volver a intentar`:`Retry search`)}finally{ie===i&&(a.removeAttribute(`aria-busy`),ie=void 0)}}function oe(){let t=m?m.configuration?.entitlements??{}:{relatedSearches:!0,smartAnswers:!0};e.dispatchEvent(new CustomEvent(`profile-settings`,{detail:{profile:v,entitlements:t,highlighting:L,summary:Dn(t,v,L,m??void 0)}}))}function V(e,t=!1,o=!1){v=e,L=v.highlighting,oe(),P.replaceChildren(),N.setAttribute(`aria-expanded`,`false`),te=[],A.clear(),re([]),C=0;let s=_.filter(e=>e.profile&&e.language===v.language);i.replaceChildren(...s.map(e=>{let t=document.createElement(`button`);return t.type=`button`,t.id=`lab-experience-tab-`+_.indexOf(e),t.textContent=e.profile,t.setAttribute(`role`,`tab`),t.setAttribute(`aria-controls`,a.id),t.setAttribute(`aria-selected`,String(e===v)),t.tabIndex=e===v?0:-1,t.addEventListener(`click`,()=>V(e,!0)),t.addEventListener(`keydown`,t=>{let n=s.indexOf(e),r={ArrowLeft:(n+s.length-1)%s.length,ArrowRight:(n+1)%s.length,Home:0,End:s.length-1};Object.hasOwn(r,t.key)&&(t.preventDefault(),V(s[r[t.key]],!0))}),t}));let c=i.querySelector(`[aria-selected="true"]`);i.hidden=!k.profileTabs||!s.length,a.setAttribute(`role`,k.profileTabs&&c?`tabpanel`:`region`),k.profileTabs&&c?(a.removeAttribute(`aria-label`),a.setAttribute(`aria-labelledby`,c.id)):(a.removeAttribute(`aria-labelledby`),a.setAttribute(`aria-label`,`Search results`)),t&&c?.focus(),o?B(n(`[data-exp-language]`),r):t&&c?B(i,c):B()}function se(e=!1){let t=[...new Set(h.map(e=>e.language).filter(Boolean))];v.language&&!t.includes(v.language)&&t.unshift(v.language),r.replaceChildren(...t.map(e=>new Option(!m&&e===`es`?`Español`:fr(e),e))),y||r.prepend(new Option(`Choose a language`,``)),r.value=v.language,r.disabled=r.options.length<2,n(`[data-exp-language]`).hidden=!k.languagePicker;let i=z();n(`[data-exp-language] span`).textContent=i?`Idioma de búsqueda`:`Search language`,f.textContent=!m&&v.language===`es`?`Los enlaces abren páginas del campus en inglés.`:``,m&&v.profile&&!k.profileTabs&&(f.textContent=`Search Profile: `+v.profile),f.hidden=!f.textContent,V(v,!1,e)}r.addEventListener(`change`,()=>{let e=!m&&cr.find(e=>e.language===v.language&&e.profile===v.profile)?.section,t=e&&cr.find(t=>t.language===r.value&&t.section===e);v=x(r.value,t||v),se(!0)});function H(e){S=e.trim(),l.value=e,A.clear(),C=0,B()}return n(`form`).addEventListener(`submit`,e=>{e.preventDefault(),H(l.value)}),u.addEventListener(`click`,()=>{C=Math.max(0,w-k.resultsPerPage),B(p,u)}),d.addEventListener(`click`,()=>{C=w+k.resultsPerPage,B(p,d)}),{open(e=S,t=e){S=e,l.value=t,se()},close(){ae(),O.clear(),R.clear()},setProfiles(t){t.length&&(g=t,k.profileTabs&&(_=g,v=x(v.language,v),e.hidden||se()))},get searchState(){return{query:S,draft:l.value}},submit:H,get spanishDemo(){return!m&&z()},get promotionQuery(){return z()?Kn:`campus flu clinic`},configure(t){let n=k;k={...t},_=k.profileTabs?g:h;let r=t.languagePicker?v.language:y;n.profileTabs&&!t.profileTabs||v.language!==r?v=x(r):_.includes(v)||(v=x(r,v)),e.dataset.layout=t.layout,e.dataset.filterPlacement=t.filterPlacement,e.dataset.filterStyle=t.topFilterStyle,e.dataset.descriptions=String(!!m||t.showDescriptions),e.dataset.thumbnails=String(t.showThumbnails),e.dataset.dividers=String(t.listDividers),e.dataset.underline=String(t.underlineTitles),e.hidden||(n.profileTabs!==t.profileTabs||n.languagePicker!==t.languagePicker?se():n.filters!==t.filters||n.resultsPerPage!==t.resultsPerPage||n.showSorting!==t.showSorting||n.samplePromotions!==t.samplePromotions?(C=0,t.filters||A.clear(),t.showSorting&&n.samplePromotions===t.samplePromotions||(P.value=``),B()):ne())},handoff(){return{...dr(!!m,_,v,S,y),entitlements:m?.configuration?.entitlements}},setSource(t,n,a,o,u){ae(),R.clear(),m=t,h=n.length?n:t?[t.settings??{language:t.language,profile:t.profile}]:cr,g=h,_=h,y=u??(t?t.language||o?.language||``:cr[0].language),b=t?.settings??(t?void 0:cr[0]);let d=k.languagePicker?o?.language??y:y;v=x(d,o?.language===d?o:void 0),e.dataset.descriptions=String(!!m||k.showDescriptions),S=a,C=0,s.replaceChildren(),i.replaceChildren(),r.replaceChildren(),l.value=a,f.textContent=``,c.textContent=``,p.hidden=!0,e.hidden||se()}}}function mr(e,n,r,i){let a=t=>e.querySelector(t),o=a(`[data-customer-connect]`),s=e.querySelector(`[data-app-settings-summary]`),c=a(`[data-customer-submit]`),l=a(`[data-customer-connect-status]`),u=a(`#lab-customer-endpoint`),d=a(`#lab-customer-token`),f=a(`#lab-customer-profile`),p=a(`#lab-app-configuration`),m=0,h=a(`[data-customer-options]`),g=a(`#lab-customer-language`),_=a(`#lab-customer-answer-endpoint`),v=a(`#lab-customer-suggest-endpoint`),y=a(`#lab-related-endpoint`),b=a(`#lab-discovery-key`);y.addEventListener(`input`,()=>{b.value=``});let x=a(`#lab-customer-query`),S=[u,_,v],C=a(`[data-customer-preview]`),w=zn(a(`[data-single-experience]`)),T=a(`[data-customer-source]`),E=a(`[data-customer-status]`),D=a(`[data-customer-search-feedback]`),O=a(`[data-customer-previous-results]`),k=a(`[data-customer-layout]`),A=a(`[data-customer-facets]`),j=a(`[data-customer-facet-fields]`),M=a(`[data-customer-facet-hint]`),N=a(`#lab-customer-sort`),P=a(`[data-customer-sort-field]`),ee=a(`[data-customer-sort-hint]`),te=a(`[data-customer-promotions]`),F=a(`[data-customer-grid]`),I=a(`[data-customer-empty]`),L=a(`[data-customer-pager]`),R=a(`[data-customer-range]`),z=a(`[data-customer-prev]`),ne=a(`[data-customer-next]`),re=a(`[data-lab-search-form]`),ie=a(`#lab-query`),ae=re,B=ie,oe=0,V=null,se=Xn(ie,()=>{V&&U&&ye(U,V)}),H=document.createElement(`p`);H.id=`lab-connect-field-error`,H.className=`search-lab__feedback`,H.dataset.tone=`error`,H.setAttribute(`role`,`status`);let ce;function le(){if(ce){ce.removeAttribute(`aria-invalid`);let e=ce.getAttribute(`aria-describedby`)?.split(` `).filter(e=>e!==H.id);e?.length?ce.setAttribute(`aria-describedby`,e.join(` `)):ce.removeAttribute(`aria-describedby`)}ce=void 0,H.remove()}function ue(e,t){le(),l.textContent=``,h.contains(e)&&(h.open=!0),ce=e,e.after(H),H.textContent=t,e.setAttribute(`aria-invalid`,`true`),e.setAttribute(`aria-describedby`,[e.getAttribute(`aria-describedby`),H.id].filter(Boolean).join(` `)),e.focus({preventScroll:!0}),e.scrollIntoView({block:`center`,behavior:`instant`})}o.addEventListener(`input`,e=>{m++,fe&&!U&&(fe.abort(),fe=null,l.textContent=``,c.removeAttribute(`aria-disabled`)),e.target===ce&&le(),c.textContent=`Connect`});let U=null,de=null,W=null,G=null,fe=null,pe=null;function me(){d.value=``,pe=null}for(let[e,t]of S.entries())t.addEventListener(`input`,()=>{pe&&t.value.trim()!==pe[e]&&me()});d.addEventListener(`input`,()=>{pe=null}),u.addEventListener(`change`,()=>{let e;try{e=new URL(u.value)}catch{return}if(!e.searchParams.has(`model`)&&!e.searchParams.has(`language`))return;let n=e.searchParams,r=n.get(`model`)?.trim(),i=n.get(`language`)?.trim();e.search=``,t(e.href)&&(u.value=e.href,f.value=r||``,g.value=i||``,l.textContent=`Read the profile or language from your search URL. Review the settings below.`,h.open=!0)}),o.addEventListener(`invalid`,e=>{e.target instanceof HTMLElement&&h.contains(e.target)&&(h.open=!0)},!0);function he(){let e=n();A.hidden=!e.filters,k.dataset.filters=e.filters?`on`:`off`,P.hidden=!e.showSorting||!G?.sorts.length,ee.hidden=!e.showSorting||!!G?.sorts.length,G?.mappingsKnown&&G.total===0&&(I.textContent=e.noResultsText)}function ge(e,t){let r=document.activeElement,i=n().filterPlacement===`top`;j.dataset.showChoices=String(i);let a=e.facets.filter(e=>e.choices.length||t.filters.has(e.field));M.hidden=a.length>0,j.replaceChildren(...a.map(e=>{let n=document.createElement(`label`);n.className=`search-lab__field search-lab__customer-facet`;let r=document.createElement(`select`);r.dataset.customerFacet=e.field,r.add(new Option(`All`,``));for(let{value:t,count:n}of e.choices)r.add(new Option(t+` (`+n+`)`,t));let a=t.filters.get(e.field);if(a&&!e.choices.some(e=>e.value===a)&&r.add(new Option(a,a)),r.value=a??``,i){let t=document.createElement(`fieldset`),n=document.createElement(`legend`);n.textContent=e.label;let i=document.createElement(`div`);i.className=`search-facet-choices`;for(let t of r.options){let n=document.createElement(`label`),r=document.createElement(`input`);r.type=`radio`,r.name=`customer-facet-`+e.field,r.dataset.customerFacet=e.field,r.value=t.value,r.checked=t.selected,n.append(r,t.text),i.append(n)}return t.append(n,i),t}return n.append(e.label,r),n})),r?.dataset.customerFacet&&[...j.querySelectorAll(`[data-customer-facet]`)].find(e=>e.dataset.customerFacet===r.dataset.customerFacet&&(e instanceof HTMLSelectElement||e.value===r.value))?.focus()}function _e(){let e=document.createElement(`span`);return e.className=`search-promotion-marker`,e.textContent=n().promotionBadge,e}function ve(e,t,r){E.textContent=e.total+(e.total===1?` result`:` results`)+` for “`+t.query+`”`,un(te,e.externalPromotions,n().promotionHeading,r),dn(te,k,n().bannerPlacement),N.replaceChildren(new Option(`Relevance`,``),...e.sorts.map(e=>new Option(e.label,e.value))),N.value=e.sorts.some(e=>e.value===t.sort)?t.sort:``,ge(e,t),F.replaceChildren(...e.cards.map(e=>{let t=document.createElement(`article`);return t.className=`searchstax-search-result`,r&&(t.lang=r),e.promoted&&t.append(_e()),xn(t,e),t})),F.hidden=!e.cards.length,I.hidden=!!e.cards.length,I.textContent=vn(e.mappingsKnown,e.cards.length,e.total)||n().noResultsText,s&&U&&!a(`[data-single-experience]`).hidden&&(s.textContent=Dn(U.configuration?.entitlements??{},U.settings,e.highlighting,U));let i=document.activeElement;L.hidden=!e.resultCount,R.textContent=t.start+1+`–`+(t.start+e.resultCount)+` of `+e.total+` results`,z.hidden=t.start===0,ne.hidden=t.start+t.rows>=e.total,(i===z&&z.hidden||i===ne&&ne.hidden)&&R.focus(),he()}async function ye(e,t,s=!1){fe?.abort();let u=new AbortController;fe=u,V=null,s?c.textContent=`Connect`:se.begin(ae,B);let f=s?l:D;delete f.dataset.tone,f.textContent=s?`Connecting to your Search App…`:`Searching your app…`,s?(c.setAttribute(`aria-disabled`,`true`),o.contains(document.activeElement)&&(c.focus({preventScroll:!0}),c.scrollIntoView({block:`center`,behavior:`instant`}))):(W=t,O.hidden=!E.textContent,I.hidden=!0,C.setAttribute(`data-searching`,``),k.setAttribute(`aria-busy`,`true`));let m=window.setTimeout(()=>u.abort(),12e3);try{let c=await ir(e,t,u.signal);if(fe!==u)return;s&&e.configuration&&(e={...e,settings:c.settings,language:c.settings?.language??c.language??``,profile:c.settings?.profile??e.profile}),U=e,W=t,G=c,s&&(p.value=``,b.value=``,me(),de=e.suggestEndpoint?Bn(e,e.suggestEndpoint):null,o.hidden=!0,C.hidden=!1,l.textContent=`Connected to your Search App.`,T.textContent=[new URL(e.endpoint).hostname,e.profile||`Default profile`,e.language||`App default language`].join(` · `),r(t.query),a(`[data-single-experience]`).hidden||xe(e,t.query)),se.clear(),oe=t.start,D.textContent=``,ve(c,t,On(e.language)),i();let d=n().resultsPerPage;s&&d!==t.rows&&be({rows:d})}catch(n){if(fe!==u)return;let r=u.signal.aborted?`The Search App took too long to respond. Try again.`:n instanceof $n?n.message:`Couldn’t reach the Search App. Check the Select endpoint and whether it allows this browser origin.`;s?n instanceof er&&d.value.trim()===e.token?(me(),ue(d,r)):(f.dataset.tone=`error`,f.textContent=r,c.textContent=`Retry connection`,document.activeElement===c&&f.scrollIntoView({block:`nearest`,behavior:`instant`})):(V=t,f.textContent=``,se.error(r))}finally{window.clearTimeout(m),fe===u&&(fe=null,c.removeAttribute(`aria-disabled`),C.removeAttribute(`data-searching`),k.setAttribute(`aria-busy`,`false`),O.hidden=!V||!G)}}function be(e,t=re,n=ie){U&&W&&(ae=t,B=n,ye(U,{...W,start:0,...e}))}function xe(e,t){t&&e.answerEndpoint&&En(e.configuration?.entitlements.smartAnswers,e.settings?.smartAnswers)===`On`?w.start(e,t):w.clear()}function K(){let e=!!U;fe?.abort(),fe=null,w.clear(),se.clear(),le(),c.textContent=`Connect`,V=null,U=null,m++,de=null,W=null,G=null,C.hidden=!0,C.removeAttribute(`data-searching`),k.setAttribute(`aria-busy`,`false`),O.hidden=!0,D.textContent=``,F.hidden=!0,F.replaceChildren(),te.replaceChildren(),te.hidden=!0,j.replaceChildren(),N.replaceChildren(),E.textContent=``,T.textContent=``,l.textContent=``,o.reset(),h.open=!1,me(),o.hidden=!1,c.removeAttribute(`aria-disabled`),e&&r(null)}return o.addEventListener(`submit`,async e=>{if(e.preventDefault(),c.getAttribute(`aria-disabled`)===`true`)return;le();let r=t(u.value);if(!r){ue(u,`Enter the HTTPS SearchStax Select endpoint ending in /emselect.`);return}let i=d.value.trim(),a=x.value.trim();if(!i||/[\r\n\t ]/.test(i)||!a){ue(!i||/[\r\n\t ]/.test(i)?d:x,`Enter a read-only token and a test search.`);return}let o=_.value.trim(),s=v.value.trim(),l=s?t(s,`emsuggest`):null,h=o?Nn(o):null,C=f.value.trim();if(o&&!h){ue(_,`Enter the HTTPS SearchStax streaming Answer endpoint ending in /answer.`);return}if(s&&!l){ue(v,`Enter the HTTPS SearchStax Auto-Suggest endpoint ending in /emsuggest.`);return}let w=t(y.value,`related-search`),T=b.value.trim();if((y.value.trim()||T)&&(!w||!T)){ue(w?b:y,`Enter both the HTTPS Related Searches endpoint ending in /related-search/ and its Discovery key.`);return}let E,D,O=p.files?.[0],k=++m;if(O)try{if(E=wn(await O.text(),r),k!==m)return;let e=g.value.trim().toLowerCase().replaceAll(`-`,`_`);if(C){let t=E.profiles.filter(t=>t.profile===C&&(!e||t.language===e));if(t.length!==1)throw Error(`Enter a profile and language listed together in this snapshot, or leave the profile blank to use the app default.`);D=t[0]}}catch(e){k===m&&ue(p,e instanceof Error?e.message:`Check the configuration snapshot.`);return}pe=S.map(e=>e.value.trim()),ye({endpoint:r,token:i,configuration:E,settings:D,profile:D?.profile??C,language:D?.language??g.value.trim(),relatedURL:w??void 0,discoveryKey:T||void 0,answerEndpoint:h??void 0,suggestEndpoint:l??void 0},{query:a,start:0,rows:n().resultsPerPage,sort:``,filters:new Map},!0)}),c.disabled=!1,a(`[data-customer-disconnect]`).addEventListener(`click`,K),N.addEventListener(`change`,()=>be({sort:N.value},P,N)),j.addEventListener(`change`,e=>{let t=e.target;if(!(t instanceof HTMLSelectElement||t instanceof HTMLInputElement)||!t.dataset.customerFacet)return;let n=new Map(W?.filters);t.value?n.set(t.dataset.customerFacet,t.value):n.delete(t.dataset.customerFacet),be({filters:n},t.closest(`label`),t)}),z.addEventListener(`click`,()=>{W&&!fe&&be({start:Math.max(0,oe-W.rows)},L,z)}),ne.addEventListener(`click`,()=>{W&&!fe&&be({start:oe+W.rows},L,ne)}),{get connection(){return U},get query(){return W?.query},get highlighting(){return G?.highlighting},get order(){return W?.sort},showAnswers:xe,suspendAnswers:w.clear,resumeAnswers(){U&&W?.query&&xe(U,W.query)},get experiences(){return U?.configuration?.profiles??[]},get discovery(){return U?.relatedURL&&U.discoveryKey&&En(U.configuration?.entitlements.relatedSearches,U.settings?.relatedSearches)===`On`?{url:U.relatedURL,key:U.discoveryKey,language:U.language}:null},get active(){return!!U},get suggestionSource(){return de},disconnect:K,search(e){let t=e.trim();t?(be({query:t,filters:new Map}),U&&xe(U,t)):(ie.setCustomValidity(`Enter a search term for your site.`),ie.reportValidity(),ie.setCustomValidity(``))},updateDesign(e){if(!U||!W)return;he();let t=n();dn(te,k,t.bannerPlacement),fn(C,t);let r=t.filterPlacement===`top`;G&&j.dataset.showChoices!==String(r)&&ge(G,W);let i=t.showSorting?e??W.sort:``;(t.resultsPerPage!==W.rows||!t.filters&&W.filters.size||i!==W.sort)&&be({rows:t.resultsPerPage,filters:t.filters?W.filters:new Map,sort:i})}}}function hr(e){return typeof e==`string`?e.replaceAll(`Alder Coast`,`Central County`):``}function gr(e){return hr(e).replace(/<\/?(?:em|b|strong)>/gi,``).replace(/\s*\|\s*Central County University Health\s*$/,``)}var _r=`demo_content_type_s`,vr={query:`campus flu clinic`,start:0,rows:5,sort:``,filters:new Map},yr={include:{label:`Include Locations`,effect:`Only matching location pages are eligible.`,search:{...vr,filters:new Map([[_r,`location`]])}},exclude:{label:`Exclude News`,effect:`Matching news pages are omitted. Other content types can still appear.`,search:{...vr,excludeFilters:new Map([[_r,`news`]])}}};function br(e,t,n){e.textContent=n.total?`Showing ${n.results.length} of ${n.total} ${n.total===1?`result`:`results`}`:`No results`,t.replaceChildren(...n.results.map(e=>{let t=document.createElement(`li`),n=document.createElement(`a`);return n.href=e.url,n.textContent=gr(e.title),t.append(n),t}))}function xr(e,t){let n=e.querySelector(`[data-lab-screen="data-filters"]`);return n.querySelector(`[data-lab-filter-profile]`).textContent=t.profile,Sr(n,t,`lab-data-filter-rule`,yr,{describe:(e,t,n)=>`${e.total} results before the rule. ${t.total} with ${n.label}.`,renderBaseline(e){br(n.querySelector(`[data-lab-filter-before-count]`),n.querySelector(`[data-lab-filter-before-list]`),e)}})}function Sr(e,n,r,i,a){let o=e.querySelector(`[data-lab-filter-status]`),s=e.querySelector(`[data-lab-filter-after-count]`),c=e.querySelector(`[data-lab-filter-after-list]`),l=e.querySelector(`[data-lab-filter-effect]`),u=e.querySelector(`[data-lab-filter-results]`),d=e.querySelector(`[data-lab-filter-retry]`),f=`input[name="${r}"]`,p=t(n.endpoint),m;function h(){m?.abort(),m=void 0}async function g(){h();let t=document.activeElement,r=e.querySelector(f+`:checked`),g=i[r?.value??`all`];u.hidden=!0;let _=new AbortController;m=_;let v=AbortSignal.any([_.signal,AbortSignal.timeout(12e3)]);o.textContent=`Searching the fictional demo…`;try{if(!p||!n.token||!n.profile)throw Error(`Demo search is unavailable`);let t={...n,endpoint:p},[i,h]=await Promise.all([ar(t,vr,v),g.search&&ar(t,g.search,v)]);if(m!==_)return;let y=h??i;a.renderBaseline?.(i),br(s,c,y),l&&(l.textContent=g.effect??``),u.hidden=!1,o.textContent=a.describe(i,y,g),document.activeElement===d&&(r??e.querySelector(f)).focus(),d.hidden=!0}catch{if(m!==_)return;o.textContent=`The comparison couldn’t load. Try the search again.`,d.hidden=!1,requestAnimationFrame(()=>{if(m||d.hidden||!r?.getClientRects().length)return;let e=r.getBoundingClientRect();(document.activeElement===t||document.activeElement===r)&&e.bottom>0&&e.top<innerHeight&&d.getBoundingClientRect().bottom>innerHeight-8&&d.scrollIntoView({block:`center`,behavior:`instant`})})}finally{_.abort(),m===_&&(m=void 0)}}for(let t of e.querySelectorAll(f))t.addEventListener(`change`,g);return d.addEventListener(`click`,g),e=>{e?g():h()}}var Cr=5;function wr(e,t,n,r,i){let a=e.querySelector(`[data-visitor-form]`),o=a.querySelector(`[data-improve-query]`),s=e.querySelector(`[data-visitor-return]`),c=e.querySelector(`[data-preview-label]`),l=e.querySelector(`[data-browsing-label]`),u=e.querySelector(`[data-visitor-output]`),d=u.querySelector(`[data-visitor-status]`),f=u.querySelector(`[data-visitor-results]`),p=u.querySelector(`[data-visitor-prev]`),m=u.querySelector(`[data-visitor-next]`),h=u.querySelector(`[data-visitor-retry]`),g={query:n,start:0,rows:Cr,sort:``,filters:new Map},_,v,y=m.parentElement,b=0,x=!1;d.id=`visitor-status-`+o.closest(`[data-improve-lesson]`).getAttribute(`data-improve-lesson`),h.setAttribute(`aria-describedby`,d.id);function S(t){e.toggleAttribute(`data-browsing`,t),u.hidden=!t,s.hidden=!t,c.hidden=t,l.hidden=!t}function C(e,t=``){d.textContent=e,d.dataset.tone=t}function w(e){f.replaceChildren(...e.results.map(e=>i(e.url,e.title,e.description))),b=g.start,u.hidden=!1,C(e.total===0?`No results for “${g.query}”.`:`${g.start+1}–${Math.min(g.start+e.resultCount,e.total)} of ${e.total} results for “${g.query}”.`),p.hidden=g.start===0,m.hidden=g.start+g.rows>=e.total,p.disabled=g.start===0,m.disabled=g.start+g.rows>=e.total;let t=document.activeElement;(t===h||t instanceof HTMLElement&&y.contains(t)&&t.hidden)&&d.focus({preventScroll:!0}),h.hidden=!0,v=void 0}async function T(e,n=!1){_?.abort();let r=new AbortController;_=r,g=e,v=void 0,x=n,S(!0),x?y.nextElementSibling!==d&&y.after(d,h):(u.firstElementChild!==d&&u.prepend(d,h),f.replaceChildren(),p.hidden=m.hidden=!0),f.setAttribute(`aria-busy`,`true`),C(`Searching Central County…`),document.activeElement!==h&&(h.hidden=!0),h.setAttribute(`aria-disabled`,`true`);let i=window.setTimeout(()=>r.abort(),12e3);try{let n=await ar(t(),e,r.signal);if(_!==r)return;w(n)}catch{if(_!==r)return;v=e,C(`The search couldn’t load. Try again.`,`error`),h.hidden=!1,u.hidden=!1;let t=x?y:a,n=t.getBoundingClientRect();(t.contains(document.activeElement)||document.activeElement===h)&&n.bottom>=0&&n.top<innerHeight&&h.getBoundingClientRect().bottom>innerHeight-8&&h.scrollIntoView({block:`center`,behavior:`instant`})}finally{window.clearTimeout(i),_===r&&(_=void 0,f.removeAttribute(`aria-busy`),h.removeAttribute(`aria-disabled`))}}function E(){let e=o.value.trim().replace(/\s+/g,` `);!e||e.toLowerCase()===n.toLowerCase()?(D(),r(),o.focus({preventScroll:!0})):T({...g,query:e,start:0})}function D(){_?.abort(),_=void 0,v=void 0,g={query:n,start:0,rows:Cr,sort:``,filters:new Map},o.value=n,f.removeAttribute(`aria-busy`),h.removeAttribute(`aria-disabled`),f.replaceChildren(),C(``),h.hidden=!0,p.hidden=!0,m.hidden=!0,p.disabled=!0,m.disabled=!0,S(!1)}return a.addEventListener(`submit`,e=>{e.preventDefault(),E()}),s.addEventListener(`click`,()=>{D(),r(),o.focus({preventScroll:!0})}),p.addEventListener(`click`,()=>{!_&&b>=Cr&&T({...g,start:b-Cr},!0)}),m.addEventListener(`click`,()=>{_||T({...g,start:b+Cr},!0)}),h.addEventListener(`click`,()=>{!_&&v&&T(v,x)}),D(),{reset:D}}var Tr=5,Er={"missing-page":`travel vaccinations`,"flu-clinic-order":`campus flu clinic`},Dr=`/university-health-search-demo/care/services/international-health/`,Or=`/university-health-search-demo/news/flu-clinic-update-2026/`,kr=`/university-health-search-demo/locations/north-campus-clinic/`,Ar=`https://mw-searchstax.github.io/university-health-search-demo/`,jr={kind:`added`,label:`New match`},Mr={kind:`retained`,label:`Kept by filter`};function Nr(e){return Array.from(new Map(e.results.map(e=>[e.url,e])).values()).slice(0,Tr)}function Pr(e,t,n,r){if(e===`missing-page`){let e=r.find(e=>new URL(e.url).pathname===Dr);return e&&t.total<=n.length&&!n.some(t=>t.url===e.url)?{highlights:new Map([[e.url,jr]]),heading:`International Health appears`,detail:`Search skipped the service name. Adding it lets the same search match “Travel Vaccinations” on this page.`}:void 0}if(!(n.length===Tr&&r.length===Tr&&r.every(e=>n.some(t=>t.url===e.url))))return;let i=n.findIndex(e=>new URL(e.url).pathname===kr),a=r.findIndex(e=>new URL(e.url).pathname===kr),o=n.findIndex(e=>new URL(e.url).pathname===Or),s=r.findIndex(e=>new URL(e.url).pathname===Or);if(a<0||a>=i||o<0||s<0)return;let c=`North Campus Clinic moved from #${i+1} to #${a+1}.`,l=o===s?`This year’s notice stayed at #${s+1}.`:`This year’s notice moved from #${o+1} to #${s+1}.`,u=new Map([[r[a].url,{kind:`moved`,label:`#${i+1} → #${a+1}`}]]);return o!==s&&u.set(r[s].url,{kind:`moved`,label:`#${o+1} → #${s+1}`}),{highlights:u,heading:`Same five results, new order`,detail:`${c} ${l} The extra weight for title matches favored the campus clinic pages.`,explanation:`The extra weight for title matches favored the campus clinic pages.`}}function Fr(e,t){let n=t.filter(t=>!e.some(e=>e.url===t.url)).length,r=e.filter(e=>!t.some(t=>t.url===e.url)).length;return n||r?[n?n+(n===1?` page entered`:` pages entered`):``,r?r+(r===1?` page left`:` pages left`):``].filter(Boolean).join(` and `)+` the top results.`:t.some((t,n)=>t.url!==e[n]?.url)?`The same pages appear in a different order.`:`The top results stayed the same.`}function Ir(e){let{pathname:t,hostname:n}=new URL(e),r=new URL(Ar);return n!==r.hostname||!t.startsWith(r.pathname)?n:[`Home`,...t.slice(r.pathname.length).split(`/`).filter(Boolean).slice(0,-1).map(e=>e===`care`?`Departments`:(e.charAt(0).toUpperCase()+e.slice(1)).replaceAll(`-`,` `))].join(` / `)}function Lr(e,t=!1){let n=document.createElement(`li`);n.className=`improve-preview__row`,n.setAttribute(`role`,`listitem`);let r=document.createElement(`article`);r.className=`searchstax-search-result`;let i=document.createElement(`h4`),a=document.createElement(`a`);a.className=`searchstax-search-result-title`,a.href=e,i.append(a);let o=document.createElement(`p`),s=t?document.createElement(`span`):null;s&&(s.className=`improve-preview__rank`,s.setAttribute(`aria-hidden`,`true`),r.append(s));let c=document.createElement(`span`);c.className=`improve-preview__badge`,c.hidden=!0;let l=document.createElement(`div`);return l.className=`improve-preview__result-path`,l.textContent=Ir(e),r.append(l,i,o,c),n.append(r),{row:n,link:a,description:o,badge:c,rank:s}}function Rr(e,t){t?e.row.dataset.change=t.kind:delete e.row.dataset.change,e.badge.textContent=t?.label??``,e.badge.hidden=!t?.label}function zr(e,t,n=[]){let r=document.createElement(`div`),i=document.createElement(`strong`);i.textContent=e;let a=document.createElement(`p`);if(a.textContent=t,r.append(i,a),n.length>1){let e=document.createElement(`ul`);e.className=`improve-preview__takeaway-results`;for(let t of n){let n=document.createElement(`li`),r=document.createElement(`a`),i=document.createElement(`span`);r.href=`#`+t.link.id,r.textContent=t.link.textContent,i.textContent=t.badge.textContent,r.append(i),r.addEventListener(`click`,e=>{e.preventDefault(),t.link.focus({preventScroll:!0}),t.link.scrollIntoView({block:`center`})}),n.append(r),e.append(n)}r.append(e)}return r}function Br(e,t){e.textContent=t,e.toggleAttribute(`data-applied`,t===`Change applied`)}function Vr(e,t){e.dataset.applyLabel??=e.textContent.trim(),e.toggleAttribute(`data-applied`,t),e.textContent=t?`Show original results`:e.dataset.applyLabel}function Hr(e,t,n,r,i,a){let o=e.closest(`.improve-workspace`).querySelector(`[data-improve-sidebar]`),s=o.querySelector(`#lab-improve-scenario`),c=e.querySelector(`[data-improve-controls]`),l=e.querySelector(`[data-improve-toggle]`),u=e.querySelector(`[data-improve-own-site]`),d=t.content.firstElementChild.cloneNode(!0),f=d.querySelector(`[data-improve-preview-followup]`),p=d.querySelector(`[data-improve-note-anchor]`),m=d.querySelector(`[data-improve-takeaway]`),h=m.querySelector(`[data-improve-takeaway-toggle]`),g=m.querySelector(`[data-improve-callout]`),_=d.querySelector(`[data-improve-next]`),v=_.querySelector(`[data-improve-own-site-toggle]`),y=_.querySelector(`[data-improve-choose]`);y.addEventListener(`click`,()=>{s.querySelector(`input:checked`)?.focus({preventScroll:!0}),s.scrollIntoView({block:`center`})});let b=d.querySelector(`[data-improve-results]`),x=d.querySelector(`[data-improve-count]`),S=d.querySelector(`[data-improve-phase]`),C=d.querySelector(`[data-improve-status]`),w=d.querySelector(`[data-improve-retry]`),T=e.querySelector(`[data-improve-baseline-note]`);o.append(c),T&&p.append(T);let E=c.querySelector(`fieldset`);E&&(d.querySelector(`[data-improve-facet]`).append(E),E.querySelector(`legend`).textContent=`Refine results`);let D=document.createElement(`button`);D.type=`button`,D.className=`improve-workspace__jump`,c.append(D);function O(){D.textContent=m.hidden?`See what visitors find before the change ↓`:`See what changed ↓`}D.addEventListener(`click`,()=>{let t=m.hidden?x:h;t.focus({preventScroll:!0});let n=t;!m.hidden&&e.dataset.improveLesson===`synonyms`&&(N(!0),n=x.closest(`[data-lesson-results]`)),n.scrollIntoView({block:`center`})}),g.id=r+`-takeaway`,h.setAttribute(`aria-controls`,g.id),h.addEventListener(`click`,()=>N(g.hasAttribute(`hidden`))),u.id=r+`-own-site`;let k=document.createElement(`h3`);k.id=u.id+`-heading`,k.textContent=`Check this on your own site`,k.tabIndex=-1,u.setAttribute(`role`,`region`),u.setAttribute(`aria-labelledby`,k.id);let A=document.createElement(`button`);A.type=`button`,A.className=`lt-btn lt-btn--secondary`,A.textContent=`Back to the lesson`,A.addEventListener(`click`,()=>{M(!1),v.focus()}),u.prepend(k),u.append(A),v.setAttribute(`aria-controls`,u.id),v.addEventListener(`click`,()=>{let e=u.hasAttribute(`hidden`);M(e),e&&(k.focus({preventScroll:!0}),k.scrollIntoView({block:`start`}))}),f.append(u),b.id=r,l.setAttribute(`aria-controls`,b.id),e.append(d);let j=wr(d,()=>a&&S.hasAttribute(`data-applied`)?{...i,profile:a}:i,n,()=>{e.dispatchEvent(new Event(`lab:rerun-preset`))},(e,t,n)=>{let r=Lr(e);return r.link.textContent=gr(t),r.description.textContent=hr(n).replace(/<\/?(?:em|b|strong)>/gi,``),r.description.hidden=!r.description.textContent,r.row});l.addEventListener(`click`,()=>{j.reset(),Vr(l,!l.hasAttribute(`data-applied`))}),e.addEventListener(Kt,j.reset),e.addEventListener(`lab:leave-lesson`,j.reset);function M(e){u.hidden=!e,(e?u:_).append(y),v.setAttribute(`aria-expanded`,String(e))}function N(e){g.hidden=!e,h.setAttribute(`aria-expanded`,String(e))}function P(e,t=p){let n=m.hidden;m.hidden=!e,e?(t.append(m),g.replaceChildren(e),n&&N(!0)):(p.append(m),g.replaceChildren(),l.hasAttribute(`data-applied`)||M(!1)),O()}function ee(){P(),M(!1);for(let e of u.querySelectorAll(`details[open]`))e.open=!1}return O(),{preview:d,list:b,count:x,phase:S,status:C,retry:w,toggle:l,next:_,baselineNote:T,setOwnSiteOpen:M,setTakeaway:P,resetWrapUp:ee}}function Ur(e,n,r,i,a){let o=e.querySelector(`[data-ranking-watch]`),s={query:Er[r],start:0,rows:Tr,sort:``,filters:new Map},{preview:c,list:l,count:u,phase:d,status:f,retry:p,toggle:m,next:h,baselineNote:g,setOwnSiteOpen:_,setTakeaway:v,resetWrapUp:y}=Hr(e,n,s.query,`lab-`+r+`-results`,i,a),b=c.querySelector(`[data-lesson-results]`),x=c.querySelector(`[data-improve-query]`);m.after(f,p),f.id=r===`missing-page`?`lab-search-fields-status`:`lab-ranking-status`,p.setAttribute(`aria-describedby`,f.id);let S=e.querySelector(`[data-clinic-promotion]`),C=S?.querySelector(`summary`);S&&c.querySelector(`[data-improve-preview-followup]`).append(S);let w=t(i.endpoint),T=window.matchMedia(`(prefers-reduced-motion: reduce)`),E=new Map,D=new Set,O,k,A,j,M=0;function N(e,t=`visible`){f.classList.toggle(`search-lab__sr-only`,t===`spoken`),f.dataset.tone=t===`error`?`error`:``,f.textContent=e}function P(){for(let e of D)e.cancel();D.clear()}function ee(e,t,n){let r=e.animate(t,n);D.add(r),r.onfinish=()=>{D.delete(r)}}function te(e,t,n){let i=Nr(e);c.querySelector(`[data-improve-empty-hint]`).hidden=e.total!==0;let a=t&&O?Nr(O):void 0,s=a&&O?Pr(r,O,a,i):void 0;if(o){let e=a??i,t=e.findIndex(e=>new URL(e.url).pathname===kr),n=e.findIndex(e=>new URL(e.url).pathname===Or);o.textContent=t>=0&&n>=0?`Watch North Campus Clinic at #${t+1} and this year’s notice at #${n+1} in the original order.`:`Look at the order of the first few results before changing the setting.`}let f=n&&!T.matches&&E.size>0,p=new Map;if(f){let e=l.getBoundingClientRect().top;for(let[t,{row:n}]of E)p.set(t,n.getBoundingClientRect().top-e)}P();let y=document.activeElement,b=y instanceof HTMLElement&&l.contains(y)?y:void 0,x=new Set(i.map(e=>e.url));for(let[e,{row:t}]of E)x.has(e)||(t.remove(),E.delete(e));if(i.forEach((e,t)=>{let n=E.get(e.url)??Lr(e.url,r===`flu-clinic-order`);E.set(e.url,n),n.link.id||(n.link.id=l.id+`-result-`+ ++M),n.link.textContent=gr(e.title),n.description.textContent=hr(e.description).replace(/<\/?(?:em|b|strong)>/gi,``),n.description.hidden=!n.description.textContent,n.rank&&(n.rank.textContent=`#`+(t+1)),Rr(n,s?.highlights.get(e.url));let i=l.children[t];i!==n.row&&l.insertBefore(n.row,i??null)}),s){let e=Array.from(s.highlights.keys(),e=>E.get(e)),t=zr(s.heading,s.explanation??s.detail,e);if(S&&C){let e=document.createElement(`a`);e.className=`improve-preview__promotion-link`,e.href=`#`+C.id,e.textContent=`Feature one page first with a Promotion`,e.addEventListener(`click`,e=>{e.preventDefault(),S.open=!0,C.focus({preventScroll:!0}),C.scrollIntoView({block:`center`})}),t.append(e)}v(t,e[0]?.row)}else v();if(g&&(g.hidden=t||!i.length||e.total>i.length||i.some(e=>new URL(e.url).pathname===Dr)),u.textContent=e.total>i.length?`Top `+i.length+` of `+e.total+` results`:i.length+(i.length===1?` result`:` results`),d.hidden=!1,Br(d,t?`Change applied`:`Before change`),k=t,h.hidden=!t,t||_(!1),S&&!t&&window.location.hash!==`#lab-clinic-promotion`&&(S.open=!1),S&&(S.hidden=!t&&window.location.hash!==`#lab-clinic-promotion`),s?N(s.heading+`. `+s.detail+` Search Lab note available.`,`spoken`):a?N(Fr(a,i)):i.length===0?N(`No results for this search.`):N(`Before the change. `+u.textContent+`.`,`spoken`),f){let e=l.getBoundingClientRect().top;for(let[t,{row:n}]of E){let r=p.get(t);if(r===void 0){ee(n,[{opacity:0,transform:`translateY(8px)`},{opacity:1,transform:`none`}],{duration:230,easing:`ease-out`});continue}let i=r-(n.getBoundingClientRect().top-e);Math.abs(i)>1&&ee(n,[{transform:`translateY(`+i+`px)`},{transform:`none`}],{duration:320,easing:`cubic-bezier(.2,.75,.25,1)`})}}b&&document.activeElement!==b&&(l.contains(b)?b:m).focus({preventScroll:!0})}async function F(e,t=m.hasAttribute(`data-applied`),n=!1){n?b.firstElementChild!==f&&b.prepend(f,p):m.nextElementSibling!==f&&m.after(f,p),j?.abort();let r=new AbortController;j=r,A=void 0,document.activeElement!==p&&(p.hidden=!0),p.setAttribute(`aria-disabled`,`true`),l.setAttribute(`aria-busy`,`true`),k!==void 0&&Br(d,`Updating…`),N(k===void 0?`Searching Central County…`:`Rerunning the same search…`,k===void 0?`visible`:`spoken`);try{if(!w||!i.profile||!i.token||!a||a===i.profile)throw Error(`Demo profiles unavailable`);let o={...i,endpoint:w},c=AbortSignal.any([r.signal,AbortSignal.timeout(12e3)]);if(t&&!O){let e=await ar(o,s,c);if(j!==r)return;O=e}let l=await ar({...o,profile:t?a:i.profile},s,c);if(j!==r)return;t||(O=l),m.disabled=!1,Vr(m,t),document.activeElement===p&&(n?x:m).focus({preventScroll:!0}),p.hidden=!0,te(l,t,e)}catch{if(j!==r)return;A=t,Vr(m,k??!1),k!==void 0&&Br(d,k?`Change applied`:`Before change`),N(k===void 0?`The Central County results couldn’t load.`:`The search couldn’t update. The previous results are still visible.`,`error`),p.hidden=!1,n&&document.activeElement===x&&x.getBoundingClientRect().bottom>0&&x.getBoundingClientRect().top<innerHeight&&p.getBoundingClientRect().bottom>innerHeight&&p.scrollIntoView({block:`center`,behavior:`instant`})}finally{j===r&&(j=void 0,p.removeAttribute(`aria-disabled`),l.removeAttribute(`aria-busy`))}}function I(){j?.abort(),j=void 0,p.removeAttribute(`aria-disabled`),l.removeAttribute(`aria-busy`),P()}function L(){I(),O=void 0,o&&(o.textContent=``),k=A=void 0,Vr(m,!1),m.disabled=!0,p.hidden=d.hidden=h.hidden=!0,c.querySelector(`[data-improve-empty-hint]`).hidden=!0,y(),l.replaceChildren(),g&&(g.hidden=!0),E.clear(),M=0,u.textContent=`Search results`,N(``),S&&(S.hidden=!0,S.open=!1)}e.addEventListener(`lab:rerun-preset`,()=>{F(!1,void 0,!0)}),m.addEventListener(`click`,()=>{F(!0)}),p.addEventListener(`click`,()=>{j||F(!0,A,f.parentElement===b)}),T.addEventListener(`change`,P),e.addEventListener(Kt,L);function R(e){S&&e===`#`+C?.id&&(S.hidden=!1);let t=e===`#lab-missing-page-steps`||e===`#lab-missing-page-takeaway`,n=t&&!m.hasAttribute(`data-applied`);t&&(Vr(m,!0),e===`#lab-missing-page-steps`&&(h.hidden=!1,_(!0))),!n&&(j||k===m.hasAttribute(`data-applied`)&&p.hidden)||F(!1)}return{activate:R,stop:I}}function Wr(e,t,n,r,i,a){let o=Hr(e,t,n,r,a),{preview:s,phase:c,status:l}=o;return s.setAttribute(`aria-label`,`Recorded search preview`),s.querySelector(`.search-lab__preview-footnote`).textContent=i,s.querySelector(`[data-preview-label]`).textContent=`Recorded visitor preview`,l.classList.add(`search-lab__sr-only`),c.hidden=!1,o}function Gr(e,t,n,r){let i=Lr(Ar+t);return i.link.textContent=n,i.description.textContent=r,e.append(i.row),i}function Kr(e,t,n){let{preview:r,list:i,count:a,phase:o,status:s,toggle:c,next:l,setTakeaway:u,resetWrapUp:d}=Wr(e,t,`ENT`,`lab-synonym-results`,`Recorded example from the fictional Central County website.`,n),f=Gr(i,`care/services/otolaryngology/`,`Otolaryngology`,`Explore the ear, nose and throat subject areas of Central County’s fictional Otolaryngology department.`);f.link.id=i.id+`-department`,Rr(f,jr);let p=`The visitor still searched for “ENT.” The one-way synonym let search use “Otolaryngology” and find the department page.`,m=zr(`Why the department appeared`,p,[f]),h=window.matchMedia(`(prefers-reduced-motion: reduce)`),g;function _(e){let t=c.hasAttribute(`data-applied`);g?.cancel(),l.hidden=!t,r.querySelector(`[data-improve-empty-hint]`).hidden=t,f.row.hidden=!t,i.hidden=!t,u(t?m:void 0,f.row),a.textContent=t?`1 result`:`0 results`,Br(o,t?`Change applied`:`Before change`),s.classList.toggle(`search-lab__sr-only`,t),s.textContent=t?`One new match. `+p+` Search Lab note available.`:`No results for “ENT.”`,t&&e&&!h.matches&&(g=f.row.animate([{opacity:0,transform:`translateY(8px)`},{opacity:1,transform:`none`}],{duration:230,easing:`ease-out`}))}e.addEventListener(Kt,()=>{Vr(c,!1),d(),_(!1)}),e.addEventListener(`lab:rerun-preset`,()=>_(!1)),c.addEventListener(`click`,()=>_(!0)),h.addEventListener(`change`,()=>g?.cancel()),_(!1)}function qr(e,t,n){let{preview:r,list:i,count:a,phase:o,status:s,toggle:c,next:l,setTakeaway:u,resetWrapUp:d}=Wr(e,t,`campus flu clinic`,`lab-provider-results`,`Selected results recorded from Search Lab’s demo profile.`,n),f=r.querySelector(`[data-improve-context]`);i.setAttribute(`aria-label`,`Selected search results`);let p=r.querySelector(`[data-improve-provider]`);p.addEventListener(`change`,()=>{Vr(c,p.checked),x(!0)});let m=[Gr(i,`news/flu-clinic-update-2024/`,`Flu Clinic Updates — 2024 Archive`,`A fictional 2024 archive notice records a sample flu clinic updates pack of poster headings and document labels.`).row,Gr(i,`locations/north-campus-clinic/`,`North Campus Clinic`,`A fictional northern teaching annex stores Primary Care and Neurology classroom materials.`).row],h=Gr(i,`care/providers/tessa-rowan/`,`Tessa Rowan`,`Pediatrics teaching materials include age-labelled models and a campus-themed picture-book shelf.`),g=Gr(i,`care/providers/mara-ellison/`,`Mara Ellison`,`A faculty member who develops equipment demonstrations and illustrated case materials at the university’s campus center.`),_=zr(`Same search, fewer results`,`Tessa Rowan and Mara Ellison already matched. The filter hid the notice and location. In Site Search, this kind of filter is called a facet.`),v=window.matchMedia(`(prefers-reduced-motion: reduce)`),y=new Set;function b(){for(let e of y)e.cancel();y.clear()}function x(e){let t=c.hasAttribute(`data-applied`);p.checked=t,l.hidden=!t,b();for(let n of m){if(n.inert=t,!t||!e||v.matches||n.hidden){n.hidden=t;continue}let r=n.animate([{opacity:1,height:n.offsetHeight+`px`},{opacity:0,height:`0px`}],{duration:240,easing:`ease-in-out`,fill:`forwards`});y.add(r),r.onfinish=()=>{n.hidden=!0,y.delete(r),r.cancel()}}for(let e of[h,g])Rr(e,t?Mr:void 0);u(t?_:void 0),f.textContent=t?`Content type: Providers`:`Across all content`,a.textContent=t?`8 provider matches · 2 shown`:`44 matches · 4 shown`,Br(o,t?`Change applied`:`Before change`),s.textContent=t?a.textContent+`. Tessa Rowan and Mara Ellison already matched. The filter hid the notice and location. In Site Search, this kind of filter is called a facet. Search Lab note available.`:a.textContent+`.`}e.addEventListener(Kt,()=>{Vr(c,!1),d(),x(!1)}),e.addEventListener(`lab:rerun-preset`,()=>x(!1)),c.addEventListener(`click`,()=>x(!0)),v.addEventListener(`change`,()=>{if(v.matches&&y.size){b();for(let e of m)e.hidden=!0}}),x(!1)}function Jr(e,t,n,r){let i=e.querySelector(`#lab-improve-preview-template`),a=e.querySelector(`#lab-improve-scenario`),o=a.querySelectorAll(`input[type="radio"]`),s=e.querySelectorAll(`[data-improve-lesson]`),c=e.querySelectorAll(`[data-improve-controls]`),l=t=>e.querySelector(`[data-improve-lesson="${t}"]`),u={"missing-page":Ur(l(`missing-page`),i,`missing-page`,t,n),"flu-clinic-order":Ur(l(`flu-clinic-order`),i,`flu-clinic-order`,t,r),synonyms:void 0,facets:void 0};Kr(l(`synonyms`),i,t),qr(l(`facets`),i,t);let d;function f(e,t=``){if(d!==e){d&&(u[d]?.stop(),l(d).dispatchEvent(new Event(`lab:leave-lesson`))),d=e;for(let t of o)t.checked=t.value===e;for(let t of s)t.hidden=t.dataset.improveLesson!==e;for(let t of c)t.hidden=t.dataset.improveControls!==e;e&&l(e).dispatchEvent(new Event(Kt))}e&&u[e]?.activate(t)}return a.addEventListener(`change`,e=>{if(!(e.target instanceof HTMLInputElement))return;let t=e.target.value;Object.hasOwn(u,t)&&t!==d&&(window.location.hash!==`#lab-improve`&&window.history.replaceState(window.history.state,``,`#lab-improve`),f(t))}),(e,t)=>{f(e===`improve`?qt(t):void 0,t)}}var Yr=5;function Xr(e){return gr(e.title)}function Zr(e,t,n){if(!t.length&&!n.length)return`Neither profile returned results.`;if(e===`fields`){let e=e=>e.findIndex(e=>Xr(e)===`International Health`),r=e(n);if(r>=0&&e(t)<0)return`International Health appears in After at #${r+1}.`}if(t.length===n.length&&t.every((e,t)=>e.url===n[t].url))return`The displayed results stayed in the same order.`;if(!t.length)return`After returned results for this query.`;if(!n.length)return`After returned no results for this query.`;if(t[0].url===n[0].url)return`“${Xr(n[0])}” stayed first. Other displayed results changed.`;let r=t.findIndex(e=>e.url===n[0].url);return r<0?`“${Xr(n[0])}” is now first.`:`“${Xr(n[0])}” moved from #${r+1} to #1.`}function Qr(e,n){let r=e.querySelector(`[data-lab-comparison-outcome]`),i=e.querySelector(`[data-lab-comparison]`),a=i.querySelector(`button`),o,s=Xn(a,()=>o?.()),c=e.querySelector(`[data-lab-comparison-table]`),l=t(n.endpoint),u;function d(){u?.controller.abort(),u=void 0,r.textContent=``,c.hidden=!0,o=void 0,s.clear()}async function f(e,t,p){if(u?.query===e&&u.scenario===t&&u.afterProfile===p)return;d(),s.begin(i,i.querySelector(`[aria-pressed="true"]`)||a);let m=new AbortController;u={query:e,scenario:t,afterProfile:p,controller:m},r.textContent=`Loading both sets of results…`;let h=AbortSignal.any([m.signal,AbortSignal.timeout(12e3)]),g={query:e,start:0,rows:Yr,sort:``,filters:new Map};try{if(!l||!n.token||!n.profile||!p||p===n.profile)throw Error(`The comparison profiles are unavailable.`);let i={...n,endpoint:l},[a,o]=await Promise.all([ar(i,g,h),ar({...i,profile:p},g,h)]);if(u?.controller!==m)return;let s=a.results.slice(0,Yr),d=o.results.slice(0,Yr),f=Array.from({length:Math.max(s.length,d.length)},(e,t)=>{let n=document.createElement(`tr`),r=document.createElement(`th`);r.scope=`row`,r.textContent=String(t+1),n.append(r);for(let e of[s[t],d[t]])n.insertCell().textContent=e?Xr(e):`—`;return n});c.caption.textContent=`Unfiltered results for “${e}”`,c.tBodies[0].replaceChildren(...f),c.hidden=!f.length,r.textContent=Zr(t,s,d)}catch{if(u?.controller!==m)return;u=void 0,r.textContent=``,o=()=>{f(e,t,p)},s.error(`The comparison couldn’t load.`,`Retry comparison`)}finally{m.abort()}}return{compare:f,clear:d}}function $r(e,t){let n=e.querySelector(`[data-page-announcement]`),r,i;function a(i){let a=i.target instanceof Element&&i.target.closest(`button[data-page-step]`),o=t(),s=o?.dataLayer.searchObject;if(!a||a.disabled||!s?.itemsPerPage||o.dataLayer.loading)return;let c=e.querySelector(`[data-page-range]`),l=Number(c?.dataset.pageStart),u=a.dataset.pageStep;if(!Number.isSafeInteger(l)||l<1||u!==`previous`&&u!==`next`)return;let d=1+Math.floor((l-1)/s.itemsPerPage)+(u===`next`?1:-1);(document.activeElement===a||i.detail===0)&&(r={range:c.textContent.trim(),step:u},n&&(n.textContent=``),e.focus({preventScroll:!0}));let f={...s,page:d};d===s.page?o.search(f):o.dataLayer.setSearchObject(f)}function o(){if(!r||document.activeElement!==e)return;let a=e.querySelector(`[data-page-range]`),s=a?.textContent.trim();if(!s||s===r.range)return;if(t()?.dataLayer.loading){i??=requestAnimationFrame(()=>{i=void 0,o()});return}let c=e.querySelector(`button[data-page-step="${r.step}"]:not(:disabled)`);r=void 0,c?(c.focus(),n&&(n.textContent=s)):a.focus()}function s(t){t.target===e&&(r=void 0)}let c=new MutationObserver(o);return c.observe(e,{childList:!0,characterData:!0,subtree:!0}),e.addEventListener(`click`,a),e.addEventListener(`focusout`,s),()=>{i!==void 0&&cancelAnimationFrame(i),c.disconnect(),e.removeEventListener(`click`,a),e.removeEventListener(`focusout`,s)}}(function(){var e=document.querySelector(`[data-search-lab]`);if(!e)return;let n=[`localhost`,`127.0.0.1`,`[::1]`].includes(window.location.hostname);var r={fields:{query:`travel vaccinations`,name:`SEARCH FIELDS`,intro:`See how Search Fields can help a page match a search.`,copy:`The fictional International Health page is already indexed. Its service-name field contains “Travel Vaccinations”.`,before:`Before: the service-name field isn’t included in Search Fields.`,after:`After: the service-name field is included in Search Fields.`,note:`The same query runs against a prepared demo profile. Adding a field can make a page eligible to match; it doesn’t guarantee its position.`,doc:`https://support.searchstax.com/hc/en-us/articles/40483375841421-Search-Fields`,docLabel:`Learn about Search Fields`,video:`https://support.searchstax.com/hc/en-us/articles/50357414946317-Search-Fields-Video`,videoLabel:`Watch the Search Fields video`},ranking:{query:`campus flu clinic`,name:`RANKING`,intro:`See what happens when matches in page titles count more.`,copy:`Choose a search to compare its top five results. Switch between Before and After to explore either profile in Live Preview.`,before:`The Before profile uses the default weight for title matches.`,after:`The After profile applies a 1.5 Search Field boost to title matches.`,note:`A boost can move several pages. The order depends on which fields match and how closely they match.`,doc:`https://support.searchstax.com/hc/en-us/articles/40151648011149-Ranking`,docLabel:`Follow the Ranking setup steps`,video:`https://support.searchstax.com/hc/en-us/articles/50357479982989-Give-Selected-Search-Fields-More-Influence-Video`,videoLabel:`Watch the Search Field Boosts video`}},i={community:`Community`,hub:`Overview pages`,location:`Locations`,news:`News`,program:`Education programs`,provider:`Providers`,research:`Research`,resource:`Resources`,service:`Services`},y=e.querySelector(`[data-lab-search-form]`),b=e.querySelector(`#lab-query`),S=y.querySelector(`label[for="lab-query"]`),w=y.querySelector(`button[type="submit"]`),T={promotionHeading:e.querySelector(`#lab-promo-heading`),promotionBadge:e.querySelector(`#lab-promo-badge`),searchFieldText:e.querySelector(`#lab-field-text`),searchButtonText:e.querySelector(`#lab-button-text`),noResultsText:e.querySelector(`#lab-no-results-text`)},E=e.querySelector(`#lab-filters`),D=e.querySelector(`#lab-descriptions`),O=e.querySelector(`#lab-thumbnails`),k=e.querySelector(`#lab-sorting`),A=e.querySelector(`#lab-suggestions`),j=e.querySelector(`#lab-smart-answers-sample`),M=e.querySelector(`#lab-sample-promotions`),N=$t(y,`lab-search-suggestions`),P=e.querySelector(`#lab-sort-order`),ee=e.querySelector(`#lab-accent`),te=e.querySelector(`#lab-background`),F=e.querySelector(`#lab-corners`),I=e.querySelector(`#lab-logo-url`),L=e.querySelector(`[data-lab-preview-logo]`),R=e.querySelector(`[data-lab-logo-status]`),z,ne=e.querySelector(`#lab-dividers`),re=e.querySelector(`#lab-underline`),ie=e.querySelector(`#lab-preview .search-lab__site`),ae=e.querySelector(`#lab-font`),B=e.querySelector(`#lab-spacing`),oe=e.querySelector(`#lab-page-size`),V=e.querySelector(`#lab-scenario`),se=e.querySelector(`[data-lab-facets-panel]`),H=e.querySelector(`#lab-facets`),ce=e.querySelector(`[data-lab-results-layout]`),le=document.createElement(`section`);le.setAttribute(`aria-label`,`External promotions`),le.hidden=!0,ce.before(le);var ue=e.querySelector(`[data-lab-results-content]`),U=e.querySelector(`[data-lab-previous-results]`),de=e.querySelector(`[data-lab-no-results]`),W=e.querySelector(`#lab-pagination`);$r(W.parentElement,function(){return X});var G=e.querySelector(`[data-lab-status]`),fe=e.querySelector(`[data-lab-preview-brand]`),pe=e.querySelector(`[data-lab-demo-output]`),me=y,he=b,ge=Xn(b,function(){let e=X?.dataLayer.searchObject;e&&!Q.active&&Fn(e.query,!1,!0,e)});function _e(e){he=e instanceof HTMLElement?e:b,me=Ue===`examples`&&!pe.contains(he)&&!y.contains(he)?y:he.closest(`[data-pagination-focus], .search-lab__facet-option, .search-lab__sort, .search-lab__comparison, .search-lab__sample, .search-lab__actions, .search-lab__scenario`)||y}for(let t of[`click`,`change`,`submit`])e.addEventListener(t,function(e){(pe.contains(e.target)||y.contains(e.target)||Fe.includes(e.target)||e.target===V)&&(e.target.closest(`.search-recovery`)||_e(e.target===y?b:e.target))},!0);var ve=e.querySelectorAll(`[data-lab-fictional-only]`),ye=e.querySelector(`[data-lab-summary]`);e.querySelector(`[data-lab-feedback]`);var be=e.querySelectorAll(`.search-lab__share-url`),xe=e.querySelector(`[data-lab-css-feedback]`),K=e.querySelector(`[data-lab-code-feedback]`),Se=e.querySelector(`[data-lab-design-feedback]`),Ce=e.querySelector(`[data-lab-reset]`),we=e.querySelector(`[data-lab-undo-reset]`),Te=e.querySelector(`[data-lab-explanation]`),Oe=e.querySelector(`[data-lab-profile-label]`),ke=e.querySelector(`[data-lab-facet-empty]`),Ae=Array.prototype.slice.call(e.querySelectorAll(`[data-lab-phase]`)),je=e.querySelector(`[data-lab-sample]`),Me=Array.from(e.querySelectorAll(`[data-lab-ranking-query]`)),Ne=!1,Pe=e.querySelector(`[data-lab-try-no-results]`),Fe=[...Ae,je,...Me,Pe],q={searchURL:e.getAttribute(`data-search-url`)||``,searchAuth:e.getAttribute(`data-search-credential`)||``,build:e.dataset.buildProfile||e.dataset.beforeProfile,before:e.getAttribute(`data-before-profile`)||``,after:e.getAttribute(`data-after-profile`)||``,rankingAfter:e.getAttribute(`data-ranking-profile`)||``},Ie={endpoint:q.searchURL,token:q.searchAuth,profile:q.before,language:`en`};let Le={...Ie,profile:q.build,answerEndpoint:Nn(e.dataset.answerEndpoint||``),relatedURL:t(e.dataset.relatedEndpoint||``,`related-search`),discoveryKey:e.dataset.discoveryKey||``};e.removeAttribute(`data-discovery-key`);var Re=Jr(e,Ie,q.after,q.rankingAfter),ze=xr(e,Ie),Be=Qr(e,Ie),J={...o},Ve=null,He=`search-lab:design:`+window.location.pathname+window.location.search,Y={scenario:`fields`,phase:`before`,rankingPreset:``},Ue,We=b.defaultValue,X,Ge,Ke=!1,Je=!1,Ye=!1,Xe,Ze,Qe=e.querySelector(`#lab-related-toggle`),$e=e.querySelector(`#lab-related-placement`),et=e.querySelector(`#lab-top-filter-style`);let tt=[[`#lab-badge-style`,`badgeStyle`],[`#lab-banner-style`,`bannerStyle`],[`#lab-banner-placement`,`bannerPlacement`]],nt=e.querySelector(`#lab-hit-style`),rt=e.querySelector(`#lab-hit-text`),it=e.querySelector(`#lab-hit-bg`);var at=e.querySelector(`#lab-filter-placement`),ot;let st,ct=``,lt,ut,dt,ft=new WeakSet;var pt=``,mt=mn(y,function(e){b.value=e,b.focus(),y.requestSubmit()});function ht(){let t=Q.active;if(e.dataset.labView!==`design`||!Z.hidden){mt.clear(),ct&&Q.suspendAnswers(),ct=``;return}let n=t?e.querySelector(`[data-customer-layout]`):ce,r=J.relatedPlacement===`off`?`below`:J.relatedPlacement;mt.show(n,r,pt,t?ot:st),t?ct=``:pt!==ct&&(ct=pt,Q.showAnswers(Le,pt))}async function gt(){try{let e=await fetch(`./config/searchlabdemo.json`,{cache:`no-cache`,credentials:`omit`,signal:AbortSignal.timeout(12e3)});if(!e.ok)throw Error(`The built-in app configuration is unavailable.`);let t=wn(await e.text(),Le.endpoint);Le.configuration=t,Le.settings=t.profiles.find(e=>e.profile===Le.profile&&e.language===Le.language),En(t.entitlements.relatedSearches,Le.settings?.relatedSearches)===`On`&&(st=pn(Le.relatedURL,Le.discoveryKey,Le.language))}catch{lt=void 0}e.dataset.labView===`design`&&ut&&ut.request===Ge&&Ke&&X.dataLayer.setSearchResults(Ln(ut.items,ut.response)),e.dataset.labView===`design`&&!Q.active&&J.previewSource===`app`&&(It(),ct=``,At(),ht())}let Z=e.querySelector(`#lab-experiences`);Z.insertAdjacentHTML(`afterbegin`,Et.replace(`<!-- smart-answer-sample -->`,()=>qe));let _t=e.querySelector(`[data-profile-choices]`),vt=e.querySelector(`[data-profile-catalog-status]`),yt=e.querySelector(`[data-lab-source-label]`),bt=e.querySelector(`#lab-preview-source`),xt=n?document.createElement(`p`):null;xt&&(xt.dataset.appSettingsSummary=``,bt.closest(`[data-preview-source-field]`).after(xt));let St=[],Ct,wt=St,Tt=[],Dt=cr[0].language,Ot;function kt(e,t,n,r=e?.highlighting){Ot={profile:e,entitlements:t,highlighting:r},xt&&(xt.textContent=n??Dn(t,e,Q?.highlighting,Q?.connection)),At()}function At(){let t=!!Q?.active,r=!t&&J.previewSource===`fictional`,i=!t&&!r&&Z.hidden;bt.value=J.previewSource,bt.closest(`[data-preview-source-field]`).hidden=t||!n;let a=i?Le.settings:Ot?.profile,o=i?Le.configuration?.entitlements:Ot?.entitlements;xt&&i&&(xt.textContent=Dn(o??{},a,a?.highlighting??dt,Le));let s=i?a?.highlighting??dt:Z.hidden?Q?.highlighting:Ot?.highlighting;e.querySelector(`#lab-hit-hint`).textContent=s===!1?`Enable hit highlighting in this profile’s Results Fields to see matched passages.`:s===!0?`Search for a matching term to see its emphasis in the results.`:`Highlighting settings are unknown for this profile. A search response can supply them.`;let c=i?Le.profile:a?.profile;yt.textContent=!t&&!r&&e.dataset.labView===`design`?[e.dataset.searchAppName||`Live app`,c].filter(Boolean).join(` · `):`Fictional demo`;let l=En(o?.relatedSearches,a?.relatedSearches)===`On`,u=Qe.closest(`details`);u.hidden=!l,Qe.disabled=!r,Qe.checked=l&&(!r||J.relatedPlacement!==`off`),$e.closest(`.search-lab__field`).hidden=!l||!Qe.checked,e.querySelector(`[data-placement-target="lab-related-placement"]`).hidden=!l||!Qe.checked,!r&&J.relatedPlacement===`off`&&($e.value=`below`),j.closest(`.search-lab__field`).hidden=!r||!a?.smartAnswers,M.closest(`details`).querySelector(`summary`).textContent=r&&a?.smartAnswers?`Promotions and answers`:`Promotions`,O.closest(`.search-lab__field`).hidden=!i,D.closest(`.search-lab__field`).hidden=t||!r&&!i,M.closest(`details`).hidden=!r,e.querySelector(`[data-promotion-hint]`).textContent=r?`Choose a sample under Features to try both formats.`:!t&&c===`SearchLabBuild`?`Search for “campus flu clinic” to try these styles.`:`Search with a published promotion trigger to see these styles.`,A.closest(`details`).hidden=t||!i&&!r}Z.addEventListener(`profile-settings`,e=>{if(Z.hidden)return;let{profile:t,entitlements:n,summary:r,highlighting:i}=e.detail;Dt!==t.language&&(Dt=t.language,jt()),kt(t,n,r,i)});function jt(){let e=wt.filter(e=>e.language===Dt);_t.hidden=!J.profileTabs||!e.length,_t.querySelector(`div`).replaceChildren(...e.map(t=>{let n=document.createElement(`label`),r=document.createElement(`input`);return r.type=`checkbox`,r.checked=Tt.includes(t),r.disabled=r.checked&&Tt.length===1,r.addEventListener(`change`,()=>{Tt=wt.filter(e=>e===t?r.checked:Tt.includes(e)),Ft.setProfiles(Tt),jt(),_t.querySelectorAll(`input`)[e.indexOf(t)]?.focus()}),n.append(r,` `+t.profile+` (`+t.language+`)`),n}))}let Mt=e.querySelector(`#lab-profile-tabs`),Nt=e.querySelector(`#lab-language-picker`),Ft=pr(Z,Object.fromEntries(Object.entries(Ee).map(([e,t])=>[e,t.source])));function It(t){let n=Q?.connection,r=n??(J.previewSource===`fictional`?null:Le),i=r?r.configuration?.profiles??St:cr,a=Ct!==r||i!==wt,o=Z.hidden?null:Ft.searchState,s=t??o?.query??Q?.query??Ge?.query??b.value,c=t??o?.draft??b.value;a&&(Ct=r,wt=i,Tt=[...i],Dt=r?r.language:cr[0].language,Ft.close(),Z.hidden=!0,Ft.setSource(r,i,s,r?.settings),jt());let l=i.length>0;n&&!l&&(J.profileTabs=!1,J.languagePicker=!1);let u=e.dataset.labView===`design`&&(!r||l&&(J.profileTabs||J.languagePicker));Mt.disabled=!l,Nt.disabled=!l,Mt.checked=l&&J.profileTabs,Nt.checked=l&&J.languagePicker,_t.hidden=!Mt.checked||!_t.querySelector(`input`),vt.textContent=l?``:r?.configuration?`This snapshot lists no Search Profiles.`:n?`Search Profiles are unknown. Connect with an app configuration snapshot to choose tabs.`:`Search Profiles are unknown.`,e.querySelector(`[data-single-experience]`).hidden=u;let d=!u&&!Z.hidden;d&&(Z.hidden=!0,Ft.close()),Ft.configure(J),u&&Z.hidden?(Q.suspendAnswers(),Z.hidden=!1,Ft.open(s,c)):!u&&(d||a)&&(n?kt(n.settings,n.configuration?.entitlements??{}):Ot=null)}function Lt(){let e=Z.hidden?null:Ft.searchState;J.profileTabs=Mt.checked,J.languagePicker=Nt.checked,e&&!J.profileTabs&&!J.languagePicker&&(pt=e.query),$(),Rt(e)}function Rt(e){e&&Z.hidden&&(pt=e.query,Q.active?e.query===Q.query?Q.resumeAnswers():(ht(),Q.search(e.query)):X?e.query===Ge?.query&&Ke||Fn(e.query,!0):Rn(e.query),b.value=e.draft)}bt.addEventListener(`change`,()=>{if(!n)return;let e=Z.hidden?null:Ft.searchState;J.previewSource=bt.value,$(),Rt(e)}),Mt.addEventListener(`change`,Lt),Nt.addEventListener(`change`,Lt),e.querySelector(`[data-exp-disconnect]`).addEventListener(`click`,()=>Q.disconnect());var Q=mr(e,function(){return J},function(t){var n=t!==null;n&&(window.clearTimeout(Xe),ge.clear(),pe.removeAttribute(`data-searching`),ce.setAttribute(`aria-busy`,`false`)),e.querySelector(`[data-exp-disconnect]`).hidden=!n,It(t??en());var r=Q.discovery;ot=r?pn(r.url,r.key,r.language):null,pt=t||``,ht(),e.toggleAttribute(`data-customer-connected`,n),e.toggleAttribute(`data-hide-result-descriptions`,!n&&!J.showDescriptions),fe.hidden=!n,pe.hidden=n,ve.forEach(function(e){e.hidden=n}),At(),Gt(),Bt(),e.dataset.labView===`design`&&(b.disabled=!1,w.disabled=!1,b.value=t??en(),(Z.hidden?b:Z.querySelector(`input`)).focus({preventScroll:!0}),n||Z.hidden&&(X?Fn(b.value,!0):Rn()))},At);e.removeAttribute(`data-search-credential`),P.replaceChildren(...De.map(({label:e,order:t})=>new Option(e,t))),oe.replaceChildren(...a.map(e=>new Option(String(e),String(e))));function Bt(){var e=Ue===`examples`?o:J,t=Q.active&&e.searchFieldText===o.searchFieldText?`Search your site`:e.searchFieldText;S.textContent=t,b.placeholder=t,w.textContent=e.searchButtonText,de.textContent=e.noResultsText}function Gt(){var t=Q.active?Q.suggestionSource:J.showSuggestions?Qt:null;N(e.dataset.labView===`design`&&Z.hidden?t:null)}function Kt(){xe.textContent=``,Ve=null,we.hidden=!0,Se.textContent=``}function $(t){It(),Kt();for(let[e,t]of Object.entries(C(J)))ie.style.setProperty(e,t);e.setAttribute(`data-layout`,J.layout),e.toggleAttribute(`data-hide-result-descriptions`,!Q.active&&!J.showDescriptions),e.toggleAttribute(`data-show-demo-thumbnails`,J.showThumbnails),e.toggleAttribute(`data-show-sorting`,J.showSorting),ie.dataset.filterPlacement=J.filterPlacement,at.value=J.filterPlacement,et.closest(`[data-top-filter-options]`).hidden=!J.filters||J.filterPlacement!==`top`,et.value=J.topFilterStyle,at.closest(`.search-lab__field`).hidden=!J.filters,e.querySelector(`[data-placement-target="lab-filter-placement"]`).hidden=!J.filters,Qe.checked=J.relatedPlacement!==`off`,$e.closest(`.search-lab__field`).hidden=!Qe.checked,e.querySelector(`[data-placement-target="lab-related-placement"]`).hidden=!Qe.checked,Qe.checked&&($e.value=J.relatedPlacement),ht(),ie.toggleAttribute(`data-hide-list-dividers`,!J.listDividers),ie.toggleAttribute(`data-underline-titles`,J.underlineTitles),ce.setAttribute(`data-filters`,J.filters?`on`:`off`),se.hidden=!J.filters,E.checked=J.filters,D.checked=J.showDescriptions,O.checked=J.showThumbnails,k.checked=J.showSorting,A.checked=J.showSuggestions,j.checked=J.showSmartAnswersSample,M.value=J.samplePromotions,je.textContent=en(),At(),Gt(),J.showSorting||(P.value=``),ee.value=J.color,te.value=J.background;for(let[t,n]of tt)e.querySelector(t).value=J[n];dn(le,ce,J.bannerPlacement),fn(pe,J),nt.value=J.highlightStyle,rt.value=J.highlightText,it.value=J.highlightBackground,e.querySelector(`#lab-hit-colors`).hidden=J.highlightStyle!==`color`;let n=x(J.highlightText,J.highlightBackground);e.querySelector(`#lab-hit-contrast`).textContent=n>=4.5?`Text contrast `+n.toFixed(2)+`:1.`:`Selected colors have `+n.toFixed(2)+`:1 contrast. An accessible text color is used until the pair reaches 4.5:1.`,F.value=J.corners,window.clearTimeout(z),I.value=J.logoURL,I.removeAttribute(`aria-invalid`),Jt(),ne.checked=J.listDividers,ne.closest(`[data-lab-list-option]`).hidden=J.layout!==`list`,re.checked=J.underlineTitles,ae.value=J.font,B.value=J.resultSpacing,oe.value=String(J.resultsPerPage),Object.keys(T).forEach(function(e){T[e].value=J[e]}),Bt(),e.querySelector(`input[name="lab-layout"][value="`+J.layout+`"]`).checked=!0,K.textContent=``,Z.hidden&&Q.updateDesign(t),gn()}function qt(e){R.textContent=e,R.hidden=!e}function Jt(){(L.getAttribute(`src`)??``)===J.logoURL?qt(J.logoURL&&L.complete&&!L.naturalWidth?`The logo couldn’t load. Check the image URL.`:``):(L.hidden=!0,qt(``),J.logoURL?L.src=J.logoURL:L.removeAttribute(`src`))}function Yt(){Cn(),Ae.forEach(function(e){e.setAttribute(`aria-pressed`,String(e.getAttribute(`data-lab-phase`)===Y.phase))}),Oe.textContent=Y.phase===`after`?`After`:`Before`,Te.textContent=r[Y.scenario][Y.phase]}function Zt(){var t=r[Y.scenario],n=Ue===`examples`&&Y.scenario===`ranking`;V.value=Y.scenario,e.querySelector(`[data-lab-lesson-intro]`).textContent=t.intro,e.querySelector(`[data-lab-lesson-name]`).textContent=t.name,e.querySelector(`[data-lab-lesson-copy]`).textContent=t.copy,e.querySelector(`[data-lab-lesson-note]`).textContent=t.note,e.querySelector(`[data-lab-comparison]`).setAttribute(`aria-label`,(Y.scenario===`ranking`?`Ranking`:`Search Fields`)+` comparison`),je.textContent=en(),je.parentElement.hidden=n||Q.active,e.querySelector(`[data-lab-ranking-queries]`).hidden=!n,e.querySelector(`[data-lab-ranking-checklist]`).hidden=!n,e.querySelector(`[data-lab-doc]`).href=t.doc,e.querySelector(`[data-lab-doc-label]`).textContent=t.docLabel,e.querySelector(`[data-lab-video]`).href=t.video,e.querySelector(`[data-lab-video-label]`).textContent=t.videoLabel,e.querySelector(`[data-lab-field-checklist]`).hidden=Y.scenario!==`fields`,Yt()}function en(){return Ue===`examples`?Y.scenario===`ranking`&&Y.rankingPreset||r[Y.scenario].query:J.previewSource===`fictional`&&J.samplePromotions!==`off`?nn:We}function tn(e){return Me.some(function(t){return t.dataset.labRankingQuery===e})}function rn(){le.hidden=!0,Q.active||pe.hasAttribute(`data-searching`)||(pe.setAttribute(`data-searching`,``),Ke=!1,ge.begin(me.isConnected?me:y,he),window.clearTimeout(Xe),Xe=window.setTimeout(on,15e3),ce.setAttribute(`aria-busy`,`true`),G.removeAttribute(`data-tone`),G.textContent=`Searching the demo…`,U.hidden=!Ye,de.hidden=!0)}function an(e){Q.active||(e&&(document.activeElement===b||document.activeElement===w||document.activeElement===V||document.activeElement===P||Fe.includes(document.activeElement))&&(Ze=document.activeElement),e?rn():(pe.removeAttribute(`data-searching`),ce.setAttribute(`aria-busy`,`false`),U.hidden=!0),H.inert=e,W.inert=e,w.disabled=e,b.disabled=e,V.disabled=e,P.disabled=e||!X,Fe.forEach(function(t){t.disabled=e}),!e&&Ne&&Bn(),!e&&Ze&&((document.activeElement===document.body||document.activeElement===document.documentElement)&&Ze.focus({preventScroll:!0}),Ze=null))}function on(e){window.clearTimeout(Xe),Q.active||(an(!1),X||(b.disabled=!0,w.disabled=!0,Fe.forEach(function(e){e.disabled=!0})),X&&!e?(G.textContent=``,U.hidden=!Ye,ge.error(`The demo search didn’t finish. Try again.`)):(G.dataset.tone=`error`,G.textContent=e||`The live demo is unavailable right now. Please try again later.`),ue.hidden=!Ye,W.hidden=!Ye,de.hidden=!0)}function sn(){!Q.active&&Ke&&X&&!X.dataLayer.loading&&(window.clearTimeout(Xe),an(!1),ge.clear(),ue.hidden=!1,Ye=!0,de.hidden=!Je,W.hidden=!1,G.textContent=``,ke.hidden=!!H.querySelector(`input`))}function cn(){H.querySelectorAll(`[data-lab-type]`).forEach(function(e){var t=e.getAttribute(`data-lab-type`),n=i[t]||t;e.textContent!==n&&(e.textContent=n)}),ke.hidden=!!H.querySelector(`input`)}function hn(){var e=new URL(window.location.href).searchParams,t=null;if(window.performance.getEntriesByType(`navigation`)[0]?.type===`reload`)try{t=window.sessionStorage.getItem(He)}catch{}J=_(t===null?e:new URLSearchParams(t),n);var i=e.get(`lab_scenario`),a=e.get(`lab_view`),o=e.get(`lab_query`);Object.prototype.hasOwnProperty.call(r,i)&&(Y.scenario=i),(a===`before`||a===`after`)&&(Y.phase=a),Y.scenario===`ranking`&&tn(o)&&(Y.rankingPreset=o)}function gn(){Cn();var e=new URLSearchParams;v(e,J);try{window.sessionStorage.setItem(He,e.toString())}catch{}}function yn(){var e=new URL(window.location.href);return e.search=``,e.hash=Ue===`examples`?`lab-examples`:`lab-design`,v(e.searchParams,J),Ue===`examples`&&(e.searchParams.set(`lab_scenario`,Y.scenario),e.searchParams.set(`lab_view`,Y.phase),Y.scenario===`ranking`&&tn(Ge?.query)&&e.searchParams.set(`lab_query`,Ge.query)),e.href}function bn(e,t){var n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.appendChild(r);try{r.click()}finally{r.remove(),window.setTimeout(function(){URL.revokeObjectURL(n)},1e3)}}async function Sn(e){try{let n=Q.connection,r=n??Le,a=Z.hidden?void 0:Ft.handoff(),o={...J};!a&&!n&&await lt;let s=r.settings,c={customer:!!n,language:r.language,featureSettings:{...n?{endpointHash:a?void 0:await Tn(r.endpoint)}:{endpoint:r.endpoint},entitlements:r.configuration?.entitlements??{},relatedSearchesByLanguage:s?{[s.language]:s.relatedSearches}:{},profiles:s?[{language:s.language,profile:s.profile,smartAnswers:s.smartAnswers}]:[]},questionURL:n?``:r.answerEndpoint||``,relatedURL:n?``:Le.relatedURL||``,discoveryKey:n?``:Le.discoveryKey||``,searchURL:q.searchURL,searchAuth:q.searchAuth,model:r.profile,demoModel:q.build,experience:a,kitURL:document.querySelector(`#searchstax-ui-kit`).src};var t={javascript:{create:zt,name:`searchstax-vanilla-starter.zip`},react:{create:Vt,name:`searchstax-react-starter.zip`},vue:{create:Ht,name:`searchstax-vue-starter.zip`},angular:{create:Ut,name:`searchstax-angular-starter.zip`}}[e];bn(t.create(o,c,i),t.name),K.textContent=`Download started. Unzip the starter and open its README for setup.`}catch{K.textContent=`Couldn’t prepare the starter. Try downloading it again.`}}function Cn(){for(let e of be)e.value&&e.value!==yn()&&(e.hidden=!0,e.value=``,e.parentElement.querySelector(`[role="status"]`).textContent=``)}function On(){if(typeof window.Searchstax==`function`)return window.Searchstax;if(window.Searchstax&&typeof window.Searchstax.Searchstax==`function`)return window.Searchstax.Searchstax;var e=window[`@searchstaxInc/searchstudioUxJs`];return e&&typeof e.Searchstax==`function`?e.Searchstax:null}function kn(e){try{var t=new URL(e);return t.protocol===`https:`&&/(^|\.)searchstax\.com$/i.test(t.hostname)&&/\/emselect\/?$/.test(t.pathname)}catch{return!1}}function An(e){try{let t=new URL(e);return t.protocol===`https:`&&t.hostname===`mw-searchstax.github.io`&&t.pathname.startsWith(`/university-health-search-demo/`)}catch{return!1}}function jn(e){return e.filter(e=>An(e.url)).map(function(e){return Object.assign({},e,{title:gr(e.title),description:hr(e.description),demoThumbnail:Ee[e.url]?.source})})}function Mn(){return Ue===`design`&&J.showSorting?P.value:``}function Pn(){return Ue===`design`?J.resultsPerPage:o.resultsPerPage}function Fn(e,t,n=!1,r){if(!(!X||Q.active||Ue===`design`&&!Z.hidden)){if(!e.trim())b.setCustomValidity(`Enter a search term to explore the demo.`),b.reportValidity(),b.setCustomValidity(``);else{var i=X.dataLayer.searchObject,a=Ue===`examples`&&Y.scenario===`ranking`&&Y.phase===`after`,o=Ue===`design`?q.build:Y.phase===`before`?q.before:a?q.rankingAfter:q.after;if(!o||a&&(o===q.before||o===q.after))on(`The Ranking example hasn’t been configured yet.`);else{pt=e.trim(),ht();var s=e.trim();if(Ue===`examples`){var c=Y.scenario===`ranking`?q.rankingAfter:q.after;Be.compare(s,Y.scenario,c)}var l=Mn(),u=Pn(),d=r?.page??1,f=r?JSON.stringify(i.facets)===JSON.stringify(r.facets):!t||!i.facets.length,p=i.query===s&&i.model===o&&i.page===d&&i.order===l&&i.itemsPerPage===u&&f;if(p&&Ke&&Ge.view===Ue)n||(b.value=s),G.textContent=``,ue.hidden=!1,W.hidden=!1;else{Ge={query:s,model:o,order:l,itemsPerPage:u,view:Ue},Cn(),Ke=!1,Ue===`examples`&&(ye.textContent=``),n||(b.value=Ge.query),an(!0),X.dataLayer.setModel(o),X.dataLayer.setItemsPerPage(u);var m=Object.assign({},i,{query:Ge.query,page:d,itemsPerPage:u,facets:r?.facets??(t?[]:i.facets),model:o,order:l});p?X.search(m):X.dataLayer.setSearchObject(m)}}}}}function In(){if(Z.hidden){var e=X?.dataLayer.searchObject;e?.query&&(e.order!==Mn()||e.itemsPerPage!==Pn())&&Fn(e.query,!1,!0)}}function Ln(e,t){let{cards:n,mappingsKnown:r,highlighting:i}=_n(t,t.response.docs,Le.settings?.highlighting);dt=i;let a=n.flatMap((t,n)=>{if(t.url&&!An(t.url)||!t.url&&!t.thumbnail&&!t.values.length)return[];let r=document.createElement(`div`);xn(r,t);let i=r.querySelector(`a`);return i&&i.setAttribute(`data-searchstax-unique-result-id`,e[n]?.uniqueId??``),[{...e[n],url:t.url,mappedBody:r.innerHTML,promoted:t.promoted,promotionBadge:J.promotionBadge,demoThumbnail:t.thumbnail?``:Ee[t.url]?.source}]}),o=t.response.numFound,s=vn(r&&!ft.has(t),a.length,o);return ye.textContent=o+(o===1?` result`:` results`)+` for “`+t.responseHeader.params.q+`”`+(s?`. `+s:``),Z.hidden&&!Q.active&&At(),un(le,ln(t.externalLinks),J.promotionHeading,`en`),a}function Rn(e=en()){var t=On();if(!kn(q.searchURL)||!q.searchAuth||!q.before||!q.after||q.before===q.after)on();else if(!t)on();else try{class n extends t{parseSearchResultsResponse(e){return Ue===`design`&&Array.isArray(e?.response?.docs)&&!Array.isArray(e.metadata?.results)&&(e={...e,metadata:{...e.metadata,results:[]}},ft.add(e)),super.parseSearchResultsResponse(e)}}X=new n,X.initialize({language:`en`,model:Ue===`design`?q.build:q.before,searchURL:q.searchURL,searchAuth:q.searchAuth,authType:`token`,suggesterURL:``,trackApiKey:``,router:{enabled:!1},hooks:{afterSearch:function(e,t){var n=t&&t.responseHeader&&t.responseHeader.params,r=t&&t.response&&t.response.numFound;return!Ge||!n||n.q!==Ge.query||n.model!==Ge.model||(n.sort||`score desc`)!==(Ge.order||`score desc`)||Number(n.rows)!==Ge.itemsPerPage||typeof r!=`number`?X.dataLayer.searchResults||[]:(Ke=!0,Je=r===0,ye.textContent=r+(r===1?` result`:` results`)+` for “`+Ge.query+`”`,window.setTimeout(sn,0),Ue===`design`?(ut={items:e,response:t,request:Ge},Ln(e,t)):jn(e||[]))}}}),X.setCookiesDisabled(!0),X.addSearchResultsWidget(`lab-results`,{renderMethod:`pagination`,resultsPerPage:Pn(),templates:{mainTemplate:{template:`<div id="lab-results-list" class="searchstax-search-results"></div>`,searchResultsContainerId:`lab-results-list`},searchResultTemplate:{template:`<article class="searchstax-search-result {{#mappedBody}}mapped-result-card{{/mappedBody}}">{{#promoted}}<span class="search-promotion-marker">{{promotionBadge}}</span>{{/promoted}}{{#demoThumbnail}}<img class="search-lab__result-thumbnail" src="{{demoThumbnail}}" alt="" width="384" height="216" loading="lazy">{{/demoThumbnail}}{{#mappedBody}}{{{mappedBody}}}{{/mappedBody}}{{^mappedBody}}<h4><a class="searchstax-search-result-title" href="{{url}}" data-searchstax-unique-result-id="{{uniqueId}}">{{title}}</a></h4><p class="search-lab__result-description">{{description}}</p>{{/mappedBody}}</article>`,searchResultUniqueIdAttribute:`data-searchstax-unique-result-id`},noSearchResultTemplate:{template:` `}}}),X.addFacetsWidget(`lab-facets`,{facetingType:`or`,specificFacets:[`demo_content_type_s`],itemsPerPageDesktop:20,itemsPerPageMobile:20,templates:{mainTemplateDesktop:{template:`<div class="lab-facet-groups"></div>`,facetsContainerClass:`lab-facet-groups`},mainTemplateMobile:{template:` `},facetItemContainerTemplate:{template:`<fieldset><legend>Content type</legend><div class="lab-facet-options search-facet-choices"></div></fieldset>`,facetListContainerClass:`lab-facet-options`},facetItemTemplate:{template:`<label class="search-lab__facet-option"><input class="lab-facet-checkbox" type="checkbox" {{#disabled}}disabled{{/disabled}} {{#isChecked}}checked{{/isChecked}}><span data-lab-type="{{value}}">{{value}}</span><span class="search-lab__facet-count">{{count}}</span></label>`,inputCheckboxClass:`lab-facet-checkbox`,checkTriggerClasses:[]}}}),new MutationObserver(cn).observe(H,{childList:!0,subtree:!0}),X.addPaginationWidget(`lab-pagination`,{templates:{mainTemplate:{template:`{{#results.length}}<nav class="search-lab__pagination" aria-label="Search result pages"><span tabindex="-1" data-page-range data-page-start="{{startResultIndex}}">{{startResultIndex}}–{{endResultIndex}} of {{totalResults}} results</span>{{^isFirstPage}}<button type="button" data-page-step="previous">Previous</button>{{/isFirstPage}}{{^isLastPage}}<button type="button" data-page-step="next">Next</button>{{/isLastPage}}</nav>{{/results.length}}`}}}),X.dataLayer.$loadingChange.subscribe(function(e){e?rn():(sn(),window.setTimeout(sn,0))}),Fn(e,!0)}catch{X=null,on()}}e.querySelectorAll(`input[name="lab-layout"]`).forEach(function(e){e.addEventListener(`change`,function(){s(e.value)&&(J.layout=e.value),$()})});for(let[t,n]of tt){let r=e.querySelector(t);r.addEventListener(`change`,()=>{J[n]=r.value,$()})}nt.addEventListener(`change`,function(){J.highlightStyle=p(nt.value),$()});for(let[e,t]of[[ee,`color`],[te,`background`],[rt,`highlightText`],[it,`highlightBackground`]])e.addEventListener(`input`,function(){f(e.value)&&(J[t]=e.value),$()});F.addEventListener(`change`,function(){J.corners=m(F.value),$()});function zn(){window.clearTimeout(z);let e=I.value.trim(),t=h(e);e&&!t?(I.setAttribute(`aria-invalid`,`true`),qt(`Enter a valid HTTPS image URL.`)):(I.removeAttribute(`aria-invalid`),J.logoURL!==t&&(Kt(),K.textContent=``),J.logoURL=t,Jt(),gn())}I.addEventListener(`change`,zn),I.addEventListener(`input`,function(){window.clearTimeout(z),z=window.setTimeout(zn,350)}),L.addEventListener(`load`,function(){L.hidden=!1,qt(``)}),L.addEventListener(`error`,function(){L.hidden=!0,L.hasAttribute(`src`)&&qt(`The logo couldn’t load. Check the image URL.`)}),ne.addEventListener(`change`,function(){J.listDividers=ne.checked,$()}),re.addEventListener(`change`,function(){J.underlineTitles=re.checked,$()}),ae.addEventListener(`change`,function(){d(ae.value)&&(J.font=ae.value),$()}),B.addEventListener(`change`,function(){c(B.value)&&(J.resultSpacing=B.value),$()}),oe.addEventListener(`change`,function(){J.resultsPerPage=l(oe.value),$(),In()}),Object.keys(T).forEach(function(e){var t=T[e];t.addEventListener(`input`,function(){J[e]=g(t.value,o[e]),Kt(),Bt(),Ft.configure(J),fn(ie,J),K.textContent=``,gn()})}),V.addEventListener(`change`,function(){Object.prototype.hasOwnProperty.call(r,V.value)&&(Y.scenario=V.value,Y.phase=`before`,Y.rankingPreset=``,Zt(),b.value=r[Y.scenario].query,Fn(b.value,!0))}),et.addEventListener(`change`,function(){J.topFilterStyle=et.value,$()}),at.addEventListener(`change`,function(){J.filterPlacement=at.value,$()}),$e.addEventListener(`change`,function(){J.relatedPlacement=$e.value,$()}),Qe.addEventListener(`change`,function(){J.relatedPlacement=Qe.checked?$e.value:`off`,$(),!Qe.checked||Q.active||Z.hidden||(Wn(),Z.querySelector(`.search-related-terms:not([hidden])`)||Ft.submit(Ft.spanishDemo?`rehabilitación`:`rehabilitation`),requestAnimationFrame(()=>Z.querySelector(`.search-related-terms:not([hidden])`)?.scrollIntoView({block:`center`})))}),E.addEventListener(`change`,function(){J.filters=E.checked,$(),Z.hidden&&!J.filters&&X&&X.dataLayer.searchObject.facets.length&&Fn(b.value,!0)}),D.addEventListener(`change`,function(){J.showDescriptions=D.checked,$()}),O.addEventListener(`change`,function(){J.showThumbnails=O.checked,$()}),k.addEventListener(`change`,function(){J.showSorting=k.checked,$(),In()}),P.addEventListener(`change`,In);function Bn(){if(!Ne||Z.hidden&&b.disabled||(Ne=!1,!J.showSuggestions||Q.active||e.dataset.labView!==`design`))return;Wn();let t=Z.hidden?b:Z.querySelector(`input[type="search"]`);t.value=`reh`,t.focus(),t.scrollIntoView({block:`center`}),t.dispatchEvent(new Event(`input`,{bubbles:!0}))}A.addEventListener(`change`,function(){J.showSuggestions=A.checked,Ne=J.showSuggestions,$(),Bn()}),j.addEventListener(`change`,function(){J.showSmartAnswersSample=j.checked,$()}),M.addEventListener(`change`,function(){J.samplePromotions=u(M.value),$(),J.samplePromotions===`off`?In():((J.samplePromotions===`indexed`||J.samplePromotions===`both`)&&(P.value=``),Wn(),Ft.submit(Ft.promotionQuery),Z.querySelector(`[data-exp-promotions]`).scrollIntoView({block:`center`}))}),Ae.forEach(function(e){e.addEventListener(`click`,function(){Y.phase=e.getAttribute(`data-lab-phase`),Yt(),Fn(b.value,!0)})}),y.addEventListener(`submit`,function(e){e.preventDefault(),Q.active?(pt=b.value.trim(),ht(),Q.search(b.value)):(Fn(b.value,!0),b.value.trim()||b.focus())}),je.addEventListener(`click`,function(){Fn(en(),!0)}),Pe.addEventListener(`click`,function(){Wn(),Z.hidden?(b.focus(),Fn(`qzxvzz`,!0)):(Z.querySelector(`input[type="search"]`).focus(),Ft.submit(`qzxvzz`))}),Me.forEach(function(e){e.addEventListener(`click`,function(){Fn(e.dataset.labRankingQuery,!0)})});let Vn=[...e.querySelectorAll(`.search-lab__handoff-actions button`)];function Hn(e){for(let t of Vn){let n=t===e;t.setAttribute(`aria-expanded`,String(n)),document.getElementById(t.getAttribute(`aria-controls`)).hidden=!n}}for(let e of Vn)e.addEventListener(`click`,function(){Hn(e.getAttribute(`aria-expanded`)===`true`?null:e)});e.querySelector(`[data-lab-local-share]`).hidden=!n,e.querySelectorAll(`[data-lab-share]`).forEach(function(e){let t=e.parentElement.querySelector(`.search-lab__share-url`),n=e.parentElement.querySelector(`[role="status"]`);e.addEventListener(`click`,async function(){let r=yn(),i=await Wt(r);r===yn()&&(t.hidden=i,t.value=i?``:r,n.textContent=i?`Link copied.`:`Copy the link below to share it.`,!i&&e===document.activeElement&&(t.focus(),t.select(),t.scrollLeft=0))})}),e.querySelectorAll(`[data-lab-download-starter]`).forEach(function(e){e.addEventListener(`click`,function(){Sn(e.dataset.labDownloadStarter)})}),e.querySelector(`[data-lab-download-css]`).addEventListener(`click`,function(){bn(new Blob([Pt(J)],{type:`text/css`}),`searchstax-search.css`),xe.textContent=`CSS download started.`}),e.querySelector(`[data-lab-copy-css]`).addEventListener(`click`,async function(){xe.textContent=await Wt(Pt(J))?`CSS copied. Use it with the starter markup or adapt the selectors for your templates.`:`Use Download CSS to save your stylesheet.`}),Ce.addEventListener(`click`,function(){let t=X?.dataLayer.searchObject,n=Ve??{design:{...J},connectedOrder:Q.order,profileSearch:Z.hidden?null:Ft.searchState,preview:!Q.active&&t?.query?{query:t.query,draft:b.value,page:t.page,facets:[...t.facets],order:P.value}:null};J={...o},P.value=``,$(``),Hn(null),e.querySelectorAll(`#lab-design-controls details`).forEach(e=>{e.open=e.hasAttribute(`data-default-open`)}),Q.active||(b.value=en(),Fn(b.value,!0)),Ve=n,we.hidden=!1,Se.textContent=Q.active?`Design settings reset.`:`Design and demo search reset.`}),we.addEventListener(`click`,function(){if(!Ve)return;let{design:e,preview:t,profileSearch:n,connectedOrder:r}=Ve;J=e,Ce.focus({preventScroll:!0}),$(r),t&&!Q.active&&(P.value=t.order,b.value=t.draft,Fn(t.query,!1,!0,t)),n&&!Z.hidden&&Ft.open(n.query,n.draft),Se.textContent=`Previous design restored.`}),hn(),$();var Un=new Map([[`#lab-ranking`,{scenario:`ranking`,back:`#lab-find-page`,label:`Back to Tool Options`}],[`#lab-compare-ranking`,{scenario:`ranking`,back:`#lab-ranking-guide`,label:`Back to the Ranking Walkthrough`}]]);let Wn=Xt(e,function(t,n){if(It(),Re(t,n),ze(t===`data-filters`),t!==`examples`&&Be.clear(),t===`design`?lt??=gt():ht(),t!==`design`&&Q.disconnect(),At(),Gt(),t===`design`||t===`examples`){var r=Un.get(n);if(t===`examples`){var i=e.querySelector(`[data-lab-example-back]`),a=e.querySelector(`[data-lab-example-back-label]`);i.href=r?.back??`#lab-improve`,a.textContent=r?.label??`Back to Improve What People Find`}if(r)Y.scenario=r.scenario,Y.phase=`before`,Y.rankingPreset=``;else if(t===Ue)return;var o=!Ue;Ue=t,Bt(),Zt(),b.value=en(),_e(b),(t===`examples`||Z.hidden)&&(o||!X?Rn():Fn(b.value,!0))}})})();var ei=`campus flu clinic`,ti=`transit access`,ni=`https://mw-searchstax.github.io/university-health-search-demo/`,ri=ni+`news/`,ii=ni+`locations/`,ai=[{title:`Flu Clinic Updates — 2024 Archive`,url:ri+`flu-clinic-update-2024/`,summary:`A fictional 2024 archive notice records a sample flu clinic updates pack of poster headings and document labels.`},{title:`Flu Clinic Updates — 2025 Archive`,url:ri+`flu-clinic-update-2025/`,summary:`A fictional 2025 archive notice describes revised headings and a large-print version of the sample flu clinic updates pack.`},{title:`Flu Clinic Updates — 2026 Notice`,url:ri+`flu-clinic-update-2026/`,summary:`A fictional 2026 notice brings the sample flu clinic updates pack and its historical editions into one reference set.`},{title:`North Campus Clinic`,url:ii+`north-campus-clinic/`,summary:`A fictional northern teaching annex stores Primary Care and Neurology classroom materials.`},{title:`South Campus Clinic`,url:ii+`south-campus-clinic/`,summary:`The South Campus Clinic building houses seminar rooms and teaching displays for Dermatology, Endocrinology, and Women’s Health.`}],oi=[{title:`Transit Access`,url:ni+`community/transit-access/`,summary:`A fictional campus-map guide explains pedestrian, covered-link and transit symbols without real routes or schedules.`},{title:`Community at Central County`,url:ni+`community/`,summary:`Explore enduring programs for reading health information, understanding campus maps and connecting university teaching with public-service subjects.`},{title:`Accessibility and Language Support`,url:ni+`care/resources/accessibility-and-language-support/`,summary:`Large-print samples, glossary layouts, and fictional wayfinding symbols are grouped as design references.`}],[si,ci,li,ui,di]=ai;function fi(e){return[li,...e.filter(e=>e!==li)]}var pi=[ui,di,si,ci,li];function mi(e){let t=fi(ai);ai.forEach((n,r)=>{let i=e.insertRow(),a=document.createElement(`th`);a.scope=`row`,a.textContent=String(r+1),i.append(a);for(let e of[n,t[r],pi[r]]){let t=i.insertCell(),n=e.title.replace(/^Flu Clinic Updates — /,``);if(e===li){t.className=`promotions-lab__current-notice`;let e=document.createElement(`strong`);e.textContent=n,t.append(e)}else t.textContent=n}})}function hi(e,t,n=!1){e.replaceChildren(...t.map(e=>{let t=document.createElement(`li`);t.className=`promotions-lab__result`;let r=document.createElement(`a`);if(r.href=e.url,r.textContent=e.title,t.append(r),n&&e===li){let e=document.createElement(`span`);e.className=`promotions-lab__promoted`,e.textContent=`Promoted`,t.append(e)}let i=document.createElement(`p`);return i.textContent=e.summary,t.append(i),t}))}function gi(e,t){e.replaceChildren(...t.map(e=>{let t=document.createElement(`li`);t.className=`promotions-lab__result`,t.classList.toggle(`promotions-lab__current-notice`,e===li);let n=document.createElement(`a`);return n.href=e.url,n.textContent=e.title,t.append(n),t}))}function _i(e){let t=e.querySelector(`[data-promotion-results]`),n=e.querySelector(`[data-promotion-feature]`),r=e.querySelector(`[data-promotion-query]`),i=e.querySelector(`[data-promotion-why]`),a=e.querySelector(`[data-promotion-heading]`),o=e.querySelector(`[data-promotion-outcome]`),s=e.querySelector(`[data-promotion-optional]`),c=e.querySelector(`[data-promotion-switch]`),l=e.querySelector(`[data-promotion-next]`),u=!1;function d(){let e=n.checked&&!u,l=u?oi:ai;hi(t,e?fi(l):l,e),r.textContent=u?ti:ei,i.hidden=s.hidden=!n.checked,a.textContent=u?`Why Transit Access is still first`:`Why the notice moved up`,o.textContent=u?`This search doesn’t contain “flu clinic,” so the promotion has no effect.`:`You chose the 2026 notice for searches containing “flu clinic.” The visitor searched for “campus flu clinic,” so your choice applies. Both archives are still available below it. In Site Search, this is called a promotion.`,c.textContent=u?`Back to “campus flu clinic”`:`Check “transit access”`}function f(){u=!1,d()}$(e,n,l,f),n.addEventListener(`change`,f),c.addEventListener(`click`,()=>{u=!u,d()}),d()}var vi=document.querySelector(`[data-clinic-promoted-order]`);vi&&gi(vi,fi(ai).slice(0,3));var yi=document.querySelector(`[data-lab-screen="promotions"]`);yi&&_i(yi);var bi=document.querySelector(`[data-clinic-comparison]`);bi&&mi(bi);var xi={profile:`[test Search App and Search Profile]`,query:`[trigger phrase]`,longerQuery:`[exact longer query containing the trigger phrase]`,controlQuery:`[exact unrelated control query]`,page:`[indexed page title or URL]`,baseline:`[first result and position of the intended page for each query]`};function Si(e,t,n){let{profile:r,query:i,longerQuery:a,controlQuery:o,page:s,baseline:c}=e,l=t===`exact`?`Exact Match`:t===`contains`?`Contains`:`Please help me choose`;return[`Hi, could you help set up an indexed promotion so people searching for the phrase below see the intended page at the top of their results?`,``,`Test Search App and Search Profile — ${r}`,`Trigger phrase — ${i}`,`Match type — ${l}`,`Page to promote — ${s}`,`Longer query — ${a}`,`Control query — ${o}`,``,`Recorded baseline in Preview`,c,``,`Please confirm which Search App and Search Profile the live site uses, including the default profile if the site doesn't specify one. Use a Sandbox or staging App if available, and confirm no live search uses the App and profile we'll test.`,`Confirm or complete the baseline in Preview for the test profile using the three queries above. For each, record the first result and where the intended page appears, if at all.`,`In the test Search App and profile, go to Optimizations → Promotions and select Create a Promotion. Name the promotion, select Create, and enter the trigger phrase and match type.`,`Confirm the page is indexed and select it under Indexed Items. Select Save Draft, then publish to the confirmed test profile only.`,`Repeat the same searches in Preview. Confirm the correct page is first in the regular results for the trigger phrase. The longer search should promote it only with Contains. The unrelated search should show no promotion for this page and the same first result as before.`,``,`Please share the before-and-after results so we can review them before publishing to live search.`,``,`Promotions guide — ${n}`].join(`
`)}function Ci(e){let t=Object.keys(xi).map(t=>({name:t,input:e.querySelector(`[data-promotion-input="${t}"]`)})),n=e.querySelector(`[data-promotion-request-match]`),r=e.querySelector(`[data-promotion-copy]`),i=e.querySelector(`[data-promotion-copy-status]`),a=e.querySelector(`[data-promotion-request]`),o=e.querySelector(`[data-promotion-guide]`).href;function s(){let e={...xi};for(let{name:n,input:r}of t)e[n]=r?.value.trim()||xi[n];a&&(a.value=Si(e,n?.value??``,o)),i&&a?.hidden&&(i.textContent=``)}for(let{input:e}of t)e?.addEventListener(`input`,s);n?.addEventListener(`change`,s),r&&i&&a&&Gt(r,i,a,{copied:`Request copied.`,manual:`Select and copy the request below.`}),s()}var wi=document.querySelector(`[data-promotion-checklist]`);wi&&Ci(wi);var Ti={fields:{name:`Search Fields`,queries:`Visitor’s query`,queryPrompt:`[query that should find the target page]`,expectedPrompt:`[indexed field to include and target page the visitor’s query should find]`,steps:[`In Preview, select the test App, language, and profile. Run all three queries and record the first results and whether each search finds the target URL.`,`Confirm the page is indexed and eligible for the test profile. In Configurations → Basic Configurations → Search Fields, select the indexed text field that contains the visitor’s words.`,`Save a draft and publish to the confirmed test profile only. Repeat the three searches in Preview. Confirm the visitor’s query finds the target URL, the title query still finds the page, and the control query keeps its top results.`]},ranking:{name:`Ranking`,queries:`Two queries to improve`,queryPrompt:`[two queries where the target pages should rank higher]`,expectedPrompt:`[searchable field and boost to try, and which pages should move up]`,steps:[`In Preview, select the test App, language, and profile. Run the two queries to improve and the control query. Record the top five in relevance order and the current position of each target page.`,`In Configurations → Advanced Configurations → Ranking, enable Field Ranking if needed. Under Search Field, choose a searchable field and try a small boost.`,`Save a draft and publish to the confirmed test profile only. Repeat the three searches in Preview. Verify the target pages moved up and the control query kept the same top five in the same order.`]}};function Ei(e,t){let n=Ti[t],r=Array.from(e.querySelectorAll(`input[name], textarea[name]`)),i=e.querySelector(`[data-test-plan-copy]`),a=e.querySelector(`[data-test-plan-status]`),o=e.querySelector(`[data-test-plan-request]`);function s(){let e=new Map(r.map(e=>[e.name,e.value.trim()])),i=(t,n)=>e.get(t)||n,s=[`${n.queries} — ${i(`query`,n.queryPrompt)}`];t===`fields`&&s.push(`Query using the page title — ${i(`title-query`,`[distinctive part of the page title]`)}`),o.value=[`Hi, could you help test a ${n.name} change in Site Search?`,``,`Test Search App, language, and profile — ${i(`scope`,`[test Search App, language, and Search Profile]`)}`,`Target page or pages — ${i(`page`,`[URL or title of each target page]`)}`,...s,`Control query — ${i(`control`,`[query whose top results should stay the same]`)}`,``,`Baseline in Preview`,i(`baseline`,`[record the current top results and where the target appears for each query]`),``,`Expected change`,i(`expected`,n.expectedPrompt),``,`Confirm which App, language, and profile the live site uses. Use a Sandbox or staging App if available, and confirm the selected test profile serves no live searches.`,...n.steps,``,`Please share the before-and-after results so we can review them before publishing to live search.`].join(`
`),o.hidden&&(a.textContent=``)}for(let e of r)e.addEventListener(`input`,s);Gt(i,a,o,{copied:`Test plan copied.`,manual:`Select and copy the test plan below.`}),s()}for(let e of document.querySelectorAll(`[data-lab-test-plan]`)){let t=e.dataset.labTestPlan;(t===`fields`||t===`ranking`)&&Ei(e,t)}function Di(e){let t=e.querySelector(`[data-spell-no-results]`),n=e.querySelector(`[data-spell-before-results]`),r=e.querySelector(`[data-spell-after-results]`),i=e.querySelector(`[data-spell-correction]`),a=e.querySelector(`[data-spell-results]`),o=e.querySelector(`[data-spell-status]`);n.append(a.content.cloneNode(!0)),r.append(a.content.cloneNode(!0));function s(e){let r=e.value===`typo`;t.hidden=!r,n.hidden=r,i.hidden=!r,o.textContent=r?`Spell Check recovers 8 results for rehabilitation.`:`Both searches return 8 results for rehabilitation.`}for(let t of e.querySelectorAll(`input[name="spell-check-query"]`))t.checked&&s(t),t.addEventListener(`change`,()=>s(t))}var Oi=document.querySelector(`[data-lab-screen="spell-check"]`);Oi&&Di(Oi);