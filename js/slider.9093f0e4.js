(function(t){function e(e){for(var r,i,c=e[0],s=e[1],u=e[2],f=0,p=[];f<c.length;f++)i=c[f],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&p.push(o[i][0]),o[i]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);l&&l(e);while(p.length)p.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],r=!0,c=1;c<n.length;c++){var s=n[c];0!==o[s]&&(r=!1)}r&&(a.splice(e--,1),t=i(i.s=n[0]))}return t}var r={},o={slider:0},a=[];function i(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=r,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="https://cdn.jx3box.com/static/index/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=e,c=c.slice();for(var u=0;u<c.length;u++)e(c[u]);var l=s;a.push([2,"chunk-vendors","chunk-common"]),n()})({2:function(t,e,n){t.exports=n("80f7")},"80f7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),o=n("5c96"),a=n.n(o),i=n("6a69"),c=(n("6b30"),n("c5b4"),n("4360")),s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"p-tv"},[r("Header",{attrs:{overlayEnable:!0}}),r("div",{staticClass:"m-tv-main"},[r("div",{staticClass:"m-tv-content"},[r("div",{staticClass:"wp"},t._l(t.list,(function(t,e){return r("a",{key:e,staticClass:"m-box",attrs:{href:t.link,target:"_blank"}},[r("img",{staticClass:"u-img",attrs:{src:t.img}})])})),0),r("img",{staticClass:"m-jx3box",attrs:{src:n("a8f1"),alt:"盒子娘"}})])]),r("Footer")],1)},u=[],l=n("c402"),f={name:"TV",props:[],components:{},data:function(){return{list:[]}},computed:{client:function(){return this.$store.state.client},params:function(){return{client:this.client,type:"slider",status:1,per:8}}},watch:{},methods:{load:function(){var t=this;Object(l["d"])(this.params).then((function(e){t.list=e.data.data.list}))}},mounted:function(){this.load()}},p=f,d=(n("c92e"),n("2877")),b=Object(d["a"])(p,s,u,!1,null,null,null),h=b.exports;r["default"].config.productionTip=!1,r["default"].use(a.a),r["default"].use(i["a"]),new r["default"]({store:c["a"],render:function(t){return t(h)}}).$mount("#app")},a7d7:function(t,e,n){},a8f1:function(t,e,n){t.exports=n.p+"img/box.2c2d7cd9.png"},c92e:function(t,e,n){"use strict";n("a7d7")}});
//# sourceMappingURL=slider.9093f0e4.js.map