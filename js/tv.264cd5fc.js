(function(t){function e(e){for(var a,r,c=e[0],u=e[1],o=e[2],p=0,d=[];p<c.length;p++)r=c[p],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&d.push(i[r][0]),i[r]=0;for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(t[a]=u[a]);l&&l(e);while(d.length)d.shift()();return s.push.apply(s,o||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],a=!0,c=1;c<n.length;c++){var u=n[c];0!==i[u]&&(a=!1)}a&&(s.splice(e--,1),t=r(r.s=n[0]))}return t}var a={},i={tv:0},s=[];function r(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=a,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="https://cdn.jx3box.com/static/index/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=e,c=c.slice();for(var o=0;o<c.length;o++)e(c[o]);var l=u;s.push([2,"chunk-vendors"]),n()})({2:function(t,e,n){t.exports=n("80f7")},"22b2":function(t,e,n){"use strict";n("986d")},4360:function(t,e,n){"use strict";n("caad"),n("2532");var a=n("2b0e"),i=n("2f62");a["default"].use(i["a"]);var s={state:{client:location.href.includes("origin")?"origin":"std",profile:{server:"蝶恋花"},server:"蝶恋花",config:{index_live_status:0,index_video_status:0,index_live_url:"",index_video_url:""},timezone:"Asia/Shanghai",showAlert:!1,type:"all",q:""},mutations:{setShowAlert:function(t,e){t.showAlert=e},changeQuery:function(t,e){t.q=e},changeType:function(t,e){t.type=e}},getters:{showAlert:function(t){return t.showAlert}},actions:{},modules:{}};e["a"]=new i["a"].Store(s)},6208:function(t,e,n){"use strict";n("cfed")},"73ea":function(t,e,n){},"80f7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("2b0e"),i=n("5c96"),s=n.n(i),r=n("6a69"),c=(n("6b30"),n("c5b4"),n("16e5")),u=n("4360"),o=function(){var t=this,e=t._self._c;return e("div",{staticClass:"p-tv"},[e("Header",{attrs:{overlayEnable:!0}}),e("div",{staticClass:"m-tv-title"}),e("div",{staticClass:"m-tv-content",attrs:{loading:t.loading}},[e("List",{attrs:{data:t.list}}),e("Toolbar",{attrs:{total:t.total,pages:t.pages},on:{update:t.update}})],1),t._m(0),e("Footer",{attrs:{darkMode:""}})],1)},l=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-jx3box"},[e("img",{staticClass:"u-img",attrs:{src:n("a8f1"),alt:"盒子娘"}})])}],p=(n("d3b7"),n("9911"),function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-tv-list"},[e("div",{staticClass:"wp"},[t.data&&t.data.length?t._l(t.data,(function(n,a){return e("a",{key:a,staticClass:"m-item",attrs:{href:n.link,target:"_blank"}},[e("el-image",{staticClass:"u-img",attrs:{src:t.resolveImagePath(n.img),fit:"cover"}}),e("span",{staticClass:"u-mark"})],1)})):e("div",{staticClass:"m-null"},[e("span",{staticClass:"u-text"},[t._v("~ 暂无对应历史头条 ~")])])],2)])}),d=[],f=n("85e4"),g={name:"List",props:["data"],data:function(){return{}},methods:{resolveImagePath:f["s"]}},m=g,h=(n("cfac"),n("2877")),v=Object(h["a"])(m,p,d,!1,null,null,null),b=v.exports,_=(n("4de4"),n("b0c0"),n("e9f5"),n("910d"),function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-tv-toolbar"},[e("div",{staticClass:"m-toolbar"},[e("div",{staticClass:"m-toolbar-filter"},[e("span",{staticClass:"u-label"},[t._v("筛选")]),e("span",{staticClass:"u-button",class:{active:t.filter},on:{click:function(e){return e.stopPropagation(),t.open("filter")}}},[t._v(" "+t._s(t.filterName)+" ")])]),e("div",{staticClass:"m-toolbar-pagination"},[e("span",{staticClass:"u-turn u-per",on:{click:function(e){return t.turnPages("per")}}},[t._v("上一页")]),e("span",{staticClass:"u-turn u-next",on:{click:function(e){return t.turnPages("next")}}},[t._v("下一页")]),e("span",{staticClass:"u-jump",class:{active:t.jump},on:{click:function(e){return t.open("jump")}}},[t._v("页面跳转")]),e("el-pagination",{staticClass:"u-pagination",attrs:{"current-page":t.pageIndex,"page-size":t.pageSize,"pager-count":9,layout:"pager",total:t.total},on:{"update:pageSize":function(e){t.pageSize=e},"update:page-size":function(e){t.pageSize=e},"current-change":t.changePage}})],1),e("div",{directives:[{name:"show",rawName:"v-show",value:t.filter,expression:"filter"}],staticClass:"m-popup m-popup-filter"},t._l(t.nav,(function(n,a){return e("div",{key:a,staticClass:"m-item",class:{active:t.source_type==a}},[n.list?[e("span",{staticClass:"u-title"},[t._v(t._s(n.name))]),t._l(n.list,(function(n,a){return e("span",{key:a,staticClass:"u-nav",class:a==t.source_type?"active":"",on:{click:function(e){return t.change(a)}}},[t._v(" "+t._s(n)+" ")])}))]:[e("span",{staticClass:"u-title u-all",class:{active:"all"==t.source_type},on:{click:function(e){return t.change(a)}}},[t._v(" "+t._s(n)+" ")])]],2)})),0),e("div",{directives:[{name:"show",rawName:"v-show",value:t.jump,expression:"jump"}],staticClass:"m-popup m-popup-jump"},[e("span",{staticClass:"u-label"},[t._v("跳转页数")]),e("el-pagination",{staticClass:"u-pagination",attrs:{"current-page":t.pageIndex,"page-size":t.pageSize,"pager-count":5,layout:"pager",total:t.total},on:{"update:pageSize":function(e){t.pageSize=e},"update:page-size":function(e){t.pageSize=e},"current-change":t.changePage}}),e("el-input",{staticClass:"u-input",attrs:{type:"number",size:"mini"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.toJump.apply(null,arguments)}},model:{value:t.index,callback:function(e){t.index=e},expression:"index"}}),e("span",{staticClass:"u-button",on:{click:t.toJump}},[t._v("确认")])],1)]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.mark,expression:"mark"}],staticClass:"m-toolbar-mark",on:{click:t.hide}})])}),x=[],y=n("5530"),j=(n("13d5"),n("9485"),n("07ac"),n("65c2")),k={name:"Toolbar",props:["total","pages"],data:function(){return{source_type:"all",pageIndex:1,pageSize:10,filter:!1,jump:!1,mark:!1,index:""}},computed:{nav:function(){return{all:"ALL全部",post:{name:"常用",list:Object(y["a"])({},j["__postType"])},wiki:{name:"百科",list:Object(y["a"])({},j["__wikiType"])},pvx:{name:"PVX",list:Object(y["a"])({},j["__gameType"])},app:{name:"其他",list:Object(y["a"])({},j["__appType"])}}},filterName:function(){var t=Object.values(this.nav).reduce((function(t,e){return e.list&&(t=Object(y["a"])(Object(y["a"])({},t),e.list)),t}),{});return"all"==this.source_type?this.nav[this.source_type]:t[this.source_type]||""},client:function(){return this.$store.state.client},params:function(){var t={client:this.client,type:"slider",per:this.pageSize,page:this.pageIndex};return"all"!==this.source_type&&(t.source_type=this.source_type),t}},watch:{params:{deep:!0,immediate:!0,handler:function(t){this.$emit("update",t)}}},methods:{change:function(t){this.source_type=t,this.pageIndex=1,this.filter=!1,this.mark=!1},changePage:function(t){this.pageIndex=~~t},toJump:function(){this.index>this.pages&&(this.index=this.pages),this.index<1&&(this.index=1),this.changePage(this.index),this.jump=!1,this.mark=!1,this.index=""},turnPages:function(t){"next"==t&&(this.index=this.pageIndex<this.pages?this.pageIndex+1:this.pages),"per"==t&&(this.index=this.pageIndex>1?this.pageIndex-1:1),this.changePage(this.index)},open:function(t){this[t]=!this[t],(this.filter||this.jump)&&(this.mark=!0)},hide:function(){this.filter=!1,this.jump=!1,this.mark=!1}}},O=k,w=(n("6208"),Object(h["a"])(O,_,x,!1,null,null,null)),C=w.exports,P=n("c402"),S={name:"TV",components:{List:b,Toolbar:C},data:function(){return{list:[],params:{},loading:!1,total:0,pages:0}},watch:{params:{deep:!0,immediate:!0,handler:function(t){this.load(t)}}},methods:{load:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.params;this.loading=!0,Object(P["d"])(e).then((function(e){t.list=e.data.data.list||[],t.total=e.data.data.total,t.pages=e.data.data.pages,window.scrollTo(0,0)})).finally((function(){t.loading=!1}))},update:function(t){this.params=t}}},z=S,T=(n("22b2"),Object(h["a"])(z,o,l,!1,null,null,null)),I=T.exports;a["default"].config.productionTip=!1,a["default"].use(s.a),a["default"].use(r["a"]),c["a"].install(a["default"]),new a["default"]({store:u["a"],render:function(t){return t(I)}}).$mount("#app")},"986d":function(t,e,n){},a8f1:function(t,e,n){t.exports=n.p+"img/box.616b60b4.png"},c402:function(t,e,n){"use strict";n.d(e,"i",(function(){return u})),n.d(e,"h",(function(){return o})),n.d(e,"g",(function(){return l})),n.d(e,"l",(function(){return p})),n.d(e,"j",(function(){return d})),n.d(e,"b",(function(){return f})),n.d(e,"d",(function(){return c})),n.d(e,"c",(function(){return g})),n.d(e,"m",(function(){return m})),n.d(e,"e",(function(){return h})),n.d(e,"a",(function(){return v})),n.d(e,"k",(function(){return b})),n.d(e,"f",(function(){return _}));var a=n("41cb"),i=n("bc3a"),s=n.n(i),r=n("65c2");function c(t){return Object(a["a"])().get("api/cms/config/banner",{params:t})}function u(t){return Object(a["a"])().get("/api/cms/posts",{params:t})}function o(t){return Object(a["a"])().get("/api/cms/post/".concat(t))}function l(t){return Object(a["a"])().get("/api/cms/config/menu/".concat(t))}function p(t){return Object(a["a"])().get("/api/cms/user/decoration",{params:t})}function d(){var t=r["__cdn"]+"design/decoration/index.json";return s.a.get(t)}function f(t){return Object(a["a"])().get("/api/cms/game/celebrity",{params:t})}function g(t){return Object(a["a"])().get("/api/cms/pve/skill/changelog",{params:t})}function m(t){return Object(a["a"])().get("/api/cms/wiki/post/latest",{params:t})}function h(t){return Object(a["a"])().get("/api/cms/dbm/pkg",{params:t})}function v(t){return Object(a["f"])().get("/api/team/battle/public-list",{params:t})}function b(t){return Object(a["a"])().get("/api/cms/app/pz",{params:t})}function _(t){return Object(a["a"])().get("/api/cms/game/news",{params:t})}},cfac:function(t,e,n){"use strict";n("73ea")},cfed:function(t,e,n){}});