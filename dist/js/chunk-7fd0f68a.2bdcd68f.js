(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7fd0f68a"],{"2e6f":function(n,e,t){"use strict";var i=t("efd8"),c=t.n(i);c.a},b5db:function(n,e,t){"use strict";t.r(e);var i=function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"social-signup-container"},[t("div",{staticClass:"sign-btn",on:{click:function(e){return n.wechatHandleClick("wechat")}}},[t("span",{staticClass:"wx-svg-container"},[t("svg-icon",{staticClass:"icon",attrs:{"icon-class":"wechat"}})],1),n._v(" Wechat ")]),t("div",{staticClass:"sign-btn",on:{click:function(e){return n.tencentHandleClick("tencent")}}},[t("span",{staticClass:"qq-svg-container"},[t("svg-icon",{staticClass:"icon",attrs:{"icon-class":"qq"}})],1),n._v(" QQ ")])])},c=[];function o(n,e,t,i){var c=void 0!==window.screenLeft?window.screenLeft:screen.left,o=void 0!==window.screenTop?window.screenTop:screen.top,s=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,r=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height,a=s/2-t/2+c,d=r/2-i/2+o,l=window.open(n,e,"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width="+t+", height="+i+", top="+d+", left="+a);window.focus&&l.focus()}var s={name:"login-social-signin",methods:{wechatHandleClick:function(n){this.$store.commit("SET_AUTH_TYPE",n);var e="xxxxx",t=encodeURIComponent("xxx/redirect?redirect="+window.location.origin+"/authredirect"),i="https://open.weixin.qq.com/connect/qrconnect?appid="+e+"&redirectUri="+t+"&response_type=code&scope=snsapi_login#wechat_redirect";o(i,n,540,540)},tencentHandleClick:function(n){this.$store.commit("SET_AUTH_TYPE",n);var e="xxxxx",t=encodeURIComponent("xxx/redirect?redirect="+window.location.origin+"/authredirect"),i="https://graph.qq.com/oauth2.0/authorize?response_type=code&clientId="+e+"&redirectUri="+t;o(i,n,540,540)}}},r=s,a=(t("2e6f"),t("2877")),d=Object(a["a"])(r,i,c,!1,null,"0c04c5b0",null);e["default"]=d.exports},efd8:function(n,e,t){}}]);
//# sourceMappingURL=chunk-7fd0f68a.2bdcd68f.js.map