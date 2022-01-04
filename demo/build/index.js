import{c as S,m as v,o as l,a as h,b as o,t as u,w as d,v as k,F as g,r as f,n as p,d as m,e as C,f as P,g as b,h as w,i as _,T as y,j as A}from"./vendor.js";const F=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerpolicy&&(i.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?i.credentials="include":r.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}};F();const L=[255,255,255],O=[[L]];class T{constructor(t,e,n=[0,0,0],r=2){const i=t instanceof HTMLCanvasElement?t:document.querySelector(t);this.canvas=i,this.ctx=i.getContext("2d"),this.ctx.globalCompositeOperation="multiply",e||(e=O),this.params={width:i.offsetWidth,height:i.offsetHeight,ratio:r,bg:n,figure:e},i.width=this.params.width,i.height=this.params.height,this.clear()}get bg(){return this.params.bg}set bg(t){this.params.bg=t,this.clear()}get width(){return this.params.width}set width(t){this.params.width=t,this.canvas.width=t,this.clear()}get height(){return this.params.height}set height(t){this.params.height=t,this.canvas.height=t,this.clear()}get figure(){const t=Math.ceil(255*(1/this.iterations));return this.params.figure.map(e=>e.map(n=>Array.isArray(n)?[n[0]||0,n[1]||0,n[2]|0,t]:n?[255,255,255,t]:[0,0,0,t]))}set figure(t){this.params.figure=t}get figureSize(){return{width:this.params.figure[0].length,height:this.params.figure.length}}get iterations(){let t=this.params.ratio,e=0;const{width:n,height:r}=this.figureSize;for(;e<100&&(t=Math.pow(this.params.ratio,e),!(n*t>this.width||r*t>this.height));)e++;return e}get image(){const{width:t,height:e}=this.figureSize,n=Uint8ClampedArray.from(this.figure.flat().flat()),r=new ImageData(n,t,e),i=document.createElement("canvas");return i.width=t,i.height=e,i.getContext("2d").putImageData(r,0,0),i}rgba(t,e,n,r){return Array.isArray(t)&&([t,e,n,r]=t),`rgba(${t||0}, ${e||0}, ${n||0}, ${r||1})`}getFigure(t=1,e=this.image){const n=Math.pow(this.params.ratio,t),r=e.width*n,i=e.height*n,a=document.createElement("canvas");a.width=r,a.height=i;const c=a.getContext("2d");return c.imageSmoothingEnabled=!1,c.drawImage(e,0,0,r,i),a}getPatttern(t=0,e=this.image){const n=this.getFigure(t,e);return this.ctx.createPattern(n,"repeat")}clear(){this.stop(),this.iteration=0,this.ctx.fillStyle=this.rgba(this.params.bg),this.ctx.clearRect(0,0,this.width,this.height),this.ctx.fillRect(0,0,this.width,this.height)}stop(){this._drawTO&&cancelAnimationFrame(this._drawTO)}draw(){this.clear();const t=this.iterations+0,e=this.image,n=r=>{this._drawTO=requestAnimationFrame(()=>{this._drawStep(e)<t?n(r):r(this.canvas)})};return new Promise(r=>{n(r)})}_drawStep(t=this.image){const e=this.getPatttern(this.iteration,t);return this.ctx.fillStyle=e,this.ctx.fillRect(0,0,this.width,this.height),++this.iteration}step(t=this.iteration){const e=this.getPatttern(t,this.image);return this.ctx.fillStyle=e,this.ctx.fillRect(0,0,this.width,this.height),t+1}getBlob(t="image/png"){return new Promise(e=>{this.canvas.toBlob(e,t)})}}var U=(s,t)=>{const e=s.__vccOpts||s;for(const[n,r]of t)e[n]=r;return e};const E={data:()=>({size:{w:4,h:4},background:"n",color:"w",figureSize:"screen",points:[],drawing:!1,drawed:!1,permalinkCopied:!1,fractal:null,iteration:0}),computed:{colors:()=>({n:[0,0,0],w:[255,255,255],r:[255,50,50],g:[50,255,50],b:[50,50,255],y:[255,255,50]}),figureSizes:()=>[{value:"screen",label:"Screen size"},{value:"fixed",label:"2500x2500"}],colorsKeys(){return Object.keys(this.colors)},params(){return{bg:this.colors[this.background],color:this.colors[this.color],fragment:S(v(this.points,s=>this.colors[s]),this.size.w)}}},watch:{"size.w":{handler(s,t){this.size.h==t&&(this.size.h=s),this.updateFragment()},immediate:!0},"size.h":{handler(){this.updateFragment()},immediate:!0},color:{immediate:!0,handler(){this.color==="n"&&this.background==="n"&&(this.background="w"),this.color==="w"&&this.background==="w"&&(this.background="n")}},background:{immediate:!0,handler(s,t){this.background==="n"&&this.color==="n"&&(this.color="w"),this.background==="w"&&this.color==="w"&&(this.color="n"),this.points=this.points.map(e=>e==t?s:e)}},figureSize:{handler(){requestAnimationFrame(()=>{if(!this.$refs.draw||!this.fractal)return;const s=this.$refs.draw.offsetWidth,t=this.$refs.draw.offsetHeight;this.fractal.width=s,this.fractal.height=t})}},"params.fragment":{handler(){this.fractal&&(this.fractal.figure=this.params.fragment)}},"params.bg":{handler(){this.fractal&&(this.fractal.bg=this.params.bg)}}},mounted(){this.fractal=new T(this.$refs.draw,this.params.fragment,this.params.bg);const s=new URLSearchParams(location.search),t=Object.fromEntries(s.entries());if(t.w){const e=parseInt(t.w);!isNaN(e)&&e>=1&&e<=15&&(this.size.w=e)}if(t.h){const e=parseInt(t.h);!isNaN(e)&&e>=1&&e<=15&&(this.size.h=e)}if(t.b&&this.colors[t.b]&&(this.background=t.b),t.c&&this.colors[t.c]&&(this.color=t.c),t.s&&this.figureSizes.map(({value:n})=>n).includes(t.s)&&(this.figureSize=t.s),t.p){const e=t.p.split(""),n=new Array(this.size.w*this.size.h);this.points=v(n,(r,i)=>this.colors[e[i]]?e[i]:this.background)}},methods:{updateFragment(){const s=this.size.w*this.size.h;if(this.points.length>s)this.points=this.points.slice(0,s);else if(this.points.length<s){const t=[];for(let e=0;e<s-this.points.length;e++)t.push(this.background);this.points=this.points.concat(t)}},onChangePoint(s,t){this.points[s]=t.target.checked?this.color:this.background},async draw(){this.drawing||(this.drawed=!1,this.drawing=!0,this.iteration=0,window.scrollTo({top:this.$refs.content.offsetTop,behavior:"smooth"}),await this.fractal.draw(),this.drawing=!1,this.drawed=!0)},step(){this.drawing||(this.iteration=this.fractal.step(),this.fractal.iteration=this.iteration)},clear(){this.drawing||(this.iteration=0,this.fractal.clear())},clearPoints(){if(this.drawing)return;const s=this.size.w*this.size.h,t=[];for(let e=0;e<s;e++)t.push(this.background);this.points=t},stop(){!this.drawing||(this.drawed=!1,this.drawing=!1,this.iteration=0,this.fractal.stop())},async download(){if(!this.drawed)return;const s="image/png",t="fractal.png",e=await this.fractal.getBlob(s),n=new File([e],t,{type:s}),r=URL.createObjectURL(n),i=document.createElement("A");if(i.setAttribute("href",r),i.setAttribute("download",t),window.MouseEvent){const a=new MouseEvent("click",{bubbles:!0,cancelable:!0});i.dispatchEvent(a)}else i.click();URL.revokeObjectURL(r)},async permalink(){const s={w:this.size.w,h:this.size.h,b:this.background,c:this.color,s:this.figureSize,p:this.points.join("")},t=new URLSearchParams(s);history.replaceState(null,"",`?${t.toString()}`),navigator.clipboard&&(await navigator.clipboard.writeText(location.href),this.permalinkCopied=!0,setTimeout(()=>{this.permalinkCopied=!1},1500))}}},N={class:"layout"},R={class:"layout__controls"},j={class:"layout__controls_group"},I={class:"layout__label"},M={class:"layout__controls_group"},V=o("div",{class:"layout__label"}," Pixel color ",-1),B={class:"colors"},D=["value"],q={key:0,class:"color__check"},K=o("div",{class:"layout__label"}," Background color ",-1),H={class:"colors"},W=["value"],x={key:0,class:"color__check"},G={class:"layout__controls_group"},J=o("div",{class:"layout__label"}," Figure ",-1),Q=["checked","onInput"],X={class:"controls"},Y=["disabled"],Z={class:"layout__controls_group"},$=o("div",{class:"layout__label"}," Image size ",-1),tt={class:"controls"},et=["value"],st={class:"bool__label"},it={key:0,class:"bool__check"},at={class:"layout__controls_group"},rt=o("div",{class:"layout__label"}," Control ",-1),ot={class:"controls"},nt=["disabled"],lt=["disabled"],ht=P(" Step"),ct={key:0},dt=["disabled"],ut=["disabled"],gt=["disabled"],ft={key:0},pt={key:1},mt=["disabled"],bt={class:"layout__content"},wt={ref:"draw",class:"draw__canvas"};function _t(s,t,e,n,r,i){return l(),h("div",N,[o("aside",R,[o("div",j,[o("label",I,"Size: "+u(s.size.w)+"x"+u(s.size.h),1),d(o("input",{"onUpdate:modelValue":t[0]||(t[0]=a=>s.size.w=a),class:"range",type:"range",min:"1",max:"15"},null,512),[[k,s.size.w]]),d(o("input",{"onUpdate:modelValue":t[1]||(t[1]=a=>s.size.h=a),class:"range",type:"range",min:"1",max:"15"},null,512),[[k,s.size.h]])]),o("div",M,[V,o("div",B,[(l(!0),h(g,null,f(i.colorsKeys,a=>(l(),h("label",{key:a,class:"color",style:p({"background-color":`rgba(${i.colors[a].join(",")})`})},[d(o("input",{"onUpdate:modelValue":t[2]||(t[2]=c=>s.color=c),value:a,type:"radio",name:"color",class:"color__input"},null,8,D),[[b,s.color]]),w(y,{"enter-from-class":"m_hidden","leave-to-class":"m_hidden"},{default:_(()=>[a===s.color?(l(),h("div",q)):m("",!0)]),_:2},1024)],4))),128))]),K,o("div",H,[(l(!0),h(g,null,f(i.colorsKeys,a=>(l(),h("label",{key:a,class:"color",style:p({"background-color":`rgba(${i.colors[a].join(",")})`})},[d(o("input",{"onUpdate:modelValue":t[3]||(t[3]=c=>s.background=c),value:a,type:"radio",name:"color",class:"color__input"},null,8,W),[[b,s.background]]),w(y,{"enter-from-class":"m_hidden","leave-to-class":"m_hidden"},{default:_(()=>[a===s.background?(l(),h("div",x)):m("",!0)]),_:2},1024)],4))),128))])]),o("div",G,[J,o("div",{class:"grid",style:p({"grid-template-columns":`repeat(${s.size.w}, 1fr)`,"grid-template-rows":`repeat(${s.size.h}, 1fr)`})},[(l(!0),h(g,null,f(s.points,(a,c)=>(l(),h("label",{key:c,class:"pixel",style:p({"background-color":`rgba(${i.colors[a].join(",")})`})},[o("input",{type:"checkbox",checked:a===s.color,class:"pixel__input",onInput:z=>i.onChangePoint(c,z)},null,40,Q)],4))),128))],4),o("div",X,[o("button",{type:"button",class:"button",disabled:s.drawing,onClick:t[4]||(t[4]=(...a)=>i.clearPoints&&i.clearPoints(...a))}," Clear ",8,Y)])]),o("div",Z,[$,o("div",tt,[(l(!0),h(g,null,f(i.figureSizes,a=>(l(),h("label",{key:a.value,class:"bool"},[d(o("input",{"onUpdate:modelValue":t[5]||(t[5]=c=>s.figureSize=c),value:a.value,type:"radio",name:"figure_size",class:"bool__input"},null,8,et),[[b,s.figureSize]]),o("span",st,u(a.label),1),w(y,{"enter-from-class":"m_hidden","leave-to-class":"m_hidden"},{default:_(()=>[a.value===s.figureSize?(l(),h("div",it)):m("",!0)]),_:2},1024)]))),128))])]),o("div",at,[rt,o("div",ot,[o("button",{type:"button",class:"button",disabled:s.drawing,onClick:t[6]||(t[6]=(...a)=>i.draw&&i.draw(...a))}," Draw ",8,nt),o("button",{type:"button",class:"button",disabled:s.drawing,onClick:t[7]||(t[7]=(...a)=>i.step&&i.step(...a))},[ht,s.iteration?(l(),h("span",ct,"\xA0"+u(s.iteration),1)):m("",!0)],8,lt),o("button",{type:"button",class:"button",disabled:s.drawing,onClick:t[8]||(t[8]=(...a)=>i.clear&&i.clear(...a))}," Clear ",8,dt),o("button",{type:"button",class:"button",disabled:!s.drawing,onClick:t[9]||(t[9]=(...a)=>i.stop&&i.stop(...a))}," Stop ",8,ut),o("button",{type:"button",class:"button",disabled:s.drawing,onClick:t[10]||(t[10]=(...a)=>i.permalink&&i.permalink(...a))},[s.permalinkCopied?(l(),h("span",pt,"Copied")):(l(),h("span",ft,"Parmalink"))],8,gt),o("button",{type:"button",class:"button",disabled:!(!s.drawing&&s.drawed),onClick:t[11]||(t[11]=(...a)=>i.download&&i.download(...a))}," Download ",8,mt)])])]),o("article",bt,[o("div",{ref:"content",class:C(["draw",`m_${s.figureSize}`])},[o("canvas",wt,null,512)],2)])])}var yt=U(E,[["render",_t]]);const vt=A(yt);vt.mount("body");
