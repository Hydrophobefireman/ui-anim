import{createContext as t,useMemo as e,createElement as n,useContext as r,useRef as i,useLayoutEffect as s,useEffect as a}from"https://cdn.skypack.dev/@hydrophobefireman/ui-lib";import{FakeSet as o}from"https://cdn.skypack.dev/@hydrophobefireman/j-utils";function c(){return(c=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function u({from:t,to:e,callback:n,steps:r}){return h(t,e,(e-t)/r,n)}function l(t,e,n){return-n*t+n*e+t}function h(t,e,n,r){if(n>0?t>=e:t<=e)return r(e);requestAnimationFrame(()=>h(t+n,e,n,r)),r(t)}const d="freeze"in Object?Object.freeze:function(t){return t};function m(t,e,n){return e?0:t}const f=t(null);class p{constructor(){this._snapshots=new Map,this._snapshotToDomMap=new WeakMap}getSnapshot(t){return this._snapshots.get(t)}measure(t,e,n){const r=function(t){t.style.transform="";const e=t.getBoundingClientRect(),{height:n,width:r,x:i,y:s,left:a,right:o,top:c,bottom:u}=e;return d({height:n,width:r,x:i,y:s,originPoints:{x:l(a,o,.5),y:l(c,u,.5)}})}(e);return this._snapshots.set(t,r),this._snapshotToDomMap.set(r,e),r}}function g({children:t}){const r=e(()=>new p,[]);return n(f.Provider,{value:r,children:t})}const y=t(null);class w{constructor(){this.children=new o,this._config={id:null,isRoot:null,time:null,wrappedDomNode:null,parent:null}}setManager(t){this._motionManager=t}getSnapshot(){return this._motionManager.getSnapshot(this._config.id)}attach(t){this.children.add(t)}detach(t){this.children.delete(t)}measure(){return this._motionManager.measure(this._config.id,this._config.wrappedDomNode,this._config.time||300)}requestLayout(t={x:1,y:1},e){const n=this.getSnapshot();if(!n)return;const r=function(t,e){const{originPoints:n,width:r,height:i}=e,{originPoints:s,width:a,height:o}=t;return{currWidth:a,currHeight:o,x:{translate:n.x-s.x,scale:r/a},y:{translate:n.y-s.y,scale:i/o}}}(this.measure(),n),i={x:r.x.scale,y:r.y.scale};this.children.forEach(t=>t.requestLayout(i,r)),this.animateTreeDelta(r,t,e)}animateTreeDelta(t,e={x:1,y:1},n){!function(t,e,n=300,r,i){const{x:s,y:a}=e;u({from:0,to:1,callback(e){const n=a.scale/r.y,o={scaleX:l(s.scale/r.x,1,e),scaleY:l(n,1,e),translateX:l(m(s.translate,i&&i.x.translate),0,e),translateY:l(m(a.translate,i&&i.y.translate),0,e)};!function(t,e){t.style.transform=`\n  translateX(${e.translateX}px) \n  translateY(${e.translateY}px) \n  scaleX(${e.scaleX}) \n  scaleY(${e.scaleY})`}(t,o)},steps:n/16})}(this._config.wrappedDomNode,t,this._config.time,e,n)}setTreeState({wrappedDomNode:t,time:e,id:n,parent:r}){const i=null==r;this._config={wrappedDomNode:t,time:e,id:n,isRoot:i,parent:r},i?this._resizeListener||(this._resizeListener=()=>{this.measure(),this.children.forEach(t=>t.measure())},window.addEventListener("resize",this._resizeListener)):this._resizeListener&&(window.removeEventListener("resize",this._resizeListener),this._resizeListener=null)}}function _(t){const{element:o,animId:u,ref:l,time:h}=t,d=function(t,e){if(null==t)return{};var n,r,i={},s=Object.keys(t);for(r=0;r<s.length;r++)e.indexOf(n=s[r])>=0||(i[n]=t[n]);return i}(t,["element","animId","ref","time"]),m=r(f),p=r(y),g=e(()=>new w,[]),_=i(),x=i(!1),b=i("");if(s(()=>{_.current&&(b.current=_.current.style.visibility,_.current.style.visibility="hidden"),g.setManager(m)},[m,g]),a(()=>{l&&(l.current=_.current),_.current&&!x.current&&(x.current=!0,p&&p.attach(g),g.setTreeState({wrappedDomNode:_.current,time:h,id:u,parent:p}),!g.getSnapshot()&&g.measure(),g.requestLayout(),_.current&&null!=b.current&&(_.current.style.visibility=b.current,b.current=null))},[_.current,u,h,p,g]),s(()=>{x.current&&!p&&g.requestLayout()}),!m)throw new Error("Cannot render without an existing motion context!");return n(y.Provider,{value:g},n(o,c({ref:_},d)))}export{_ as AnimateLayout,g as Motion};
//# sourceMappingURL=ui-anim.modern.js.map
