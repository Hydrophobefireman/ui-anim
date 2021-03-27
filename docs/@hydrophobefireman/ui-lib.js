const d={},j=[],se=/^aria[\-A-Z]/,_t=/^xlink:?/,I={},x=function(){};function yt(t,e,n){if(!t)return e;for(let r=0;r<t.length;r++){const o=t[r];Array.isArray(o)?yt(o,e,n):e.push(n?n(o):o)}return e}function K(t,e){return yt(t,[],e)}const ce=d.hasOwnProperty,gt=d.constructor,C=gt.assign||function(t){for(let e=1;e<arguments.length;e++){const n=arguments[e];for(const r in n)ce.call(n,r)&&(t[r]=n[r])}return t},Y=(t,e)=>{let n,r={};for(n in t)e.indexOf(n)===-1&&(r[n]=t[n]);return r};function tt(t,e){t.indexOf(e)===-1&&t.push(e)}function xt(t){return j.slice.call(t,2)}const ie=gt.create||function(){return{}},vt=typeof Promise!="undefined"?Promise.prototype.then.bind(Promise.resolve()):t=>setTimeout(t),bt=typeof requestAnimationFrame=="function",D={createElement:x,_hookSetup:x,diffStart:x,diffEnd:x,lifeCycle:x,domNodeCreated:x,componentInstance:x};function St(t){for(const e in t){const n=t[e];if(!n)throw new Error("invalid callback: "+n);let r=D[e];D[e]=function(){r.apply(0,arguments),n.apply(0,arguments)}}}const R={scheduleRender:bt?t=>requestAnimationFrame(t):vt,warnOnUnmountRender:!1,RAF_TIMEOUT:100,debounceEffect:null,inMemoryRouter:!1,memoryRouteStore:localStorage,unmountOnError:!0},Ct=["key","ref"];function U(t,e){if(t==null||typeof t=="boolean")return null;let n;e==null&&(e=d);const r=e.ref,o=e.key;let s;(e=Y(e,Ct)).children!=null?s=K([e.children]):(n=xt(arguments)).length&&(s=K(n)),e.children=s;const c=B(t,e,o,r);return D.createElement(c),c}function et(t){return t==null||typeof t=="boolean"?U(I):typeof t=="string"||typeof t=="number"?B(null,String(t)):Array.isArray(t)?U(x,null,t):t._used?B(t.type,t.props,t.key):(t._used=!0,t)}function B(t,e,n,r){return C(ie(null),{type:t,props:e,key:n,ref:r,_dom:null,_children:null,_component:null,_renders:null,_parentDom:null,_used:!1,constructor:void 0})}const ue={value:1,checked:1},kt={key:1,ref:1,children:1};function ae(t,e,n){n=n||"";const r=t.style;if(typeof(e=e||"")=="string")return void(r.cssText=e);const o=typeof n=="string";if(o)r.cssText="";else for(const s in n)e[s]==null&&(r[s]="");for(const s in e){const c=e[s];(o||c!==n[s])&&(r[s]=c)}}const wt=t=>t.trim();function le(t,e,n,r){const o=Array.isArray;o(e)&&(e=wt(e.join(" "))),o(n)&&(n=wt(n.join(" "))),e!==n&&r.batch.push({node:t,action:1,attr:r.isSvg?"class":"className",value:e})}function Ut(t,e,n,r){if(e[0]==="o"&&e[1]==="n")return function(s,c,i){c=c.substr(2).toLowerCase();const p=s._events;i==null?(s.removeEventListener(c,Et),delete p[c]):(p[c]||s.addEventListener(c,Et),p[c]=i)}(t,e,n);const o=n==null||n===!1&&!se.test(e);return!r&&e in t?t[e]=o?"":n:o?t.removeAttribute(e):t.setAttribute(e,n)}function Et(t){return this._events[t.type].call(this,t)}function Rt(t){const e=[];for(let n=0;n<t.length;n++){const r=t[n],o=r.node,s=r.action;if(s===2){e.push(r);continue}const c=r.refDom,i=r.value,p=r.VNode;let _=r.attr;switch(s){case 4:i.insertBefore(o,c);break;case 1:Ut(o,_,i);break;case 3:ae(o,i.newValue,i.oldValue);break;case 7:Vt(p,o);break;case 6:o.removeAttributeNS("http://www.w3.org/1999/xlink",_);break;case 5:_!==(_=_.replace(_t,""))?o.setAttributeNS("http://www.w3.org/1999/xlink",_.toLowerCase(),i):Ut(o,_,i,!0)}}for(let n=0;n<e.length;n++){const r=e[n],o=r.node,s=r.VNode;pe(o),Vt(s,o)}}function pe(t){if(t==null)return;const e=t.parentNode;e&&e.removeChild(t)}function Vt(t,e){!function(n){Nt(fe,n)}(e),function(n){Nt(de,n)}(t)}const fe={_VNode:1,_events:1},de={_children:1,_component:1,_dom:1,_renders:1,_parentDom:1,_used:1,key:1,ref:1};function Nt(t,e){if(e!=null)for(const n in t)e[n]=null}function nt(t,e){t&&(typeof t=="function"?t(e):t.current=e)}function Pt(t,e,n){const r=t.ref,o=(e||d).ref;r&&r!==o&&(nt(r,n),o&&nt(e.ref,null))}function he(){return{current:null}}function Dt(){R.warnOnUnmountRender&&console.warn("Component state changed after unmount",this)}function W(t,e,n){if(t==null||t===d)return;n=t.type===x||typeof t.props=="string"?-1:n||0,nt(t.ref,null),W(t._renders,e,n);const r=t._component;r!=null&&(r.setState=Dt,r.forceUpdate=Dt,r._VNode=null,ot({name:"componentWillUnmount",bind:r}));const o=t._children;if(function(s,c,i){let p;(function(_){return typeof _.type!="function"})(s)?(p=s._dom,p!=null&&(function(_,y,l){const h=_.props;for(const V in h)V[0]==="o"&&V[1]==="n"&&l.batch.push({action:1,node:y,attr:V})}(s,p,c),c.batch.push({node:p,action:i>0?7:2,VNode:s}))):c.batch.push({action:7,VNode:s,node:p})}(t,e,n),o){const s=o.length;for(let c=0;c<s;c++)W(o[c],e,n+1);o.length=0}}const At=[],Mt=[];function Ot(t){t.splice(0).forEach(Tt)}function ot(t){const e=t.name;return e==="componentDidMount"?At.push(t):e==="componentDidUpdate"?Mt.push(t):void Tt(t)}function Tt(t){const e=t.name,n=t.bind,r=n[e];if(D.lifeCycle(e,n),n._lastLifeCycleMethod=e,!r)return;const o=t.args,s=typeof n.componentDidCatch=="function";try{r.apply(n,o)}catch(c){if(s)return n.componentDidCatch(c);if(R.unmountOnError){const i=[];W(n._VNode,{batch:i}),Rt(i)}throw c}}function rt(t){Rt(t),D.diffEnd(),Ot(At),Ot(Mt)}const st=[];class L{constructor(e,n){this.state={},this.props=e,this.context=n,D.componentInstance(this,e)}render(e,n,r){return null}setState(e){if(this._oldState=C({},this.state),this._nextState=C({},this._nextState||this.state),typeof e=="function"){const n=e(this._nextState,this.props);if(n==null)return;C(this._nextState,n)}else C(this._nextState,e);Lt(this)}forceUpdate(e,n){if(this._VNode==null)return;const r=n==null,o=n||[],s=e!==!1;D.diffStart(this,s),z(this._VNode,C({},this._VNode),this._VNode._parentDom,s,{depth:this._depth,batch:o,isSvg:!1,context:this._sharedContext||{}}),typeof e=="function"&&e(),r&&rt(o)}}function Lt(t){t._dirty=!0,st.push(t)===1&&R.scheduleRender(me)}function me(){let t;st.sort((n,r)=>n._depth-r._depth);const e=[];for(;t=st.pop();)t._dirty&&(t._dirty=!1,t.forceUpdate(!1,e));rt(e)}let _e=0;function ye(t){const e="$"+_e++,n=function(o,s){const c=o.children;return typeof c=="function"?c(s):c[0](s)},r={$id:e,Consumer:n,Provider:class extends L{constructor(o,s){super(o,s),this._subs=[],this._o={[e]:this}}getChildContext(){return this._o}shouldComponentUpdate(o){return o.value!==this.props.value&&this._subs.some(s=>Lt(s))||!0}add(o){const s=this._subs;tt(s,o);const c=o.componentWillUnmount;o.componentWillUnmount=()=>{s.splice(s.indexOf(o),1),c&&c.call(o)}}render(){return U(x,null,this.props.children)}},def:t};return n.contextType=r,r}const G=t=>typeof t=="function"&&t!==x;function ge(t){return this.constructor(t,this.context)}function It(t,e){t._sharedContext=e.context,t.context=e.contextValue;const n=e.provider;n&&n.add(t)}function Ft(t,e,n,r){if(t.type===I)return;const o=t._children||j,s=(e||d)._children||j;return o!==s?function(c,i,p,_,y){const l=c.type===x,h=i.length,V=p.length,v=Math.max(h,V),O=l?y.next||(Z(p[V-1])||d).nextSibling:null;for(let b=0;b<v;b++){const A=i[b]||(b<h?U(I):null);let S=p[b]||d,w=(Z(S)||d).nextSibling||O;z(A,S,_,!1,C({},y,{next:w}))}}(t,o,s,n,r):void 0}function Z(t){if(t&&t!==d){for(;G(t.type);)t=t._renders;if(t.type===x){const e=t._children||j;return Z(e[e.length-1])}return t._dom}}function z(t,e,n,r,o){if(t==null||typeof t=="boolean")return void W(e,o);if(!((s=t)&&s.constructor===void 0||(console.warn("component not of expected type =>",s),0)))return null;var s;if(e===t)return t._dom;let c=(e=e||d).type,i=t.type,p=G(i);if(i===c&&p&&(t._component=e._component),t._parentDom=n,t._used=!0,i!==c){if(!o.next){const l=Z(e);o.next=(l||d).nextSibling}W(e,o),e=d}const _=t;if(typeof t.props!="string"&&i!==I&&(t=function(l,h,V,v){let O;if(l!=null&&G(O=l.type)){let b;h=h||d;const A=O.contextType,S=A&&v.context[A.$id];v.contextValue=S?S.props.value:A&&A.def,v.provider=S,b=function(u){const g=u.prototype;return!(!g||!g.render)}(O)?function(u,g,T,N){let f;const P=u.type;let a=u._component;const E=a!=null;if(E){if(f="componentDidUpdate",a.shouldComponentUpdate!=null&&!T&&a.shouldComponentUpdate(u.props,a._nextState||a.state)===!1)return d}else f="componentDidMount",a=new P(u.props,N.contextValue),u._component=a,a._depth=++N.depth;It(a,N),a._VNode=u;const m=a._oldState,M=g.props;ot({bind:a,name:E?"componentWillUpdate":"componentWillMount",args:E?[u.props,a._nextState,N.contextValue]:null}),a.state=function(dt,te,ee){const X=C({},dt.state||d,dt._nextState||d),ht=function(ne,oe,re){const mt=ne.getDerivedStateFromProps;return mt!=null?C({},mt(oe,re)):null}(te,ee.props,X);return ht&&C(X,ht),X}(a,P,u),a._oldState=null,a._nextState=null,a.props=u.props;const $=et(a.render(a.props,a.state,N.contextValue));let ft=null;return E&&a.getSnapshotBeforeUpdate!=null&&(ft=a.getSnapshotBeforeUpdate(M,m)),ot({bind:a,name:f,args:E?[M,m,ft]:[]}),Pt(u,g,a),$}(l,h,V,v):function(u,g){let T;const N=u.type;let f;return u._component?f=u._component:(f=new L(u.props,g.contextValue),u._component=f,f.render=ge,f.constructor=N,f.props=u.props,f._depth=++g.depth),It(f,g),f._VNode=u,D._hookSetup(f),T=et(f.render(u.props,null,g.contextValue)),D._hookSetup(null),T}(l,v),l._renders=b,v.provider=v.contextValue=void 0;const w=l._component;if(w&&typeof w.getChildContext=="function"){const u=w.getChildContext();v.context=C({},v.context,u)}return b}return l}(t,e,r,o),o.isSvg=t.type==="svg"||o.isSvg),G(e.type)&&(e=e._renders),t!==_)return t===d?void 0:z(t,e,n,r,o);let y;return t._children=function(l){let h=l.props.children;if(l.type!==x){if(h==null)return[]}else h&&!h.length&&(h=null);return K([h],et)}(t),c=e.type,i=t.type,c!==i&&(e=null),i===x?Ft(t,e,n,o):(function(l,h,V,v){const O=(h=h||d)===d;let b;const A=h._dom;b=l.type!==h.type||A==null?function(S,w){if(typeof S.props=="string")return document.createTextNode("");{const u=S.type;if(u===I)return document.createComment("$");let g;return g=w.isSvg?document.createElementNS("http://www.w3.org/2000/svg",u):document.createElement(u),g._events={},D.domNodeCreated(g,S),g}}(l,v):A,b._VNode=l,l._dom=b,function(S,w,u,g){if(w.type===I)return;if(u=u||d,typeof w.props=="string")return function(f,P,a){return P===a||(f.nodeValue=P)}(S,w.props,u.props);const T=u.props,N=w.props;T!=null&&function(f,P,a,E){for(let m in P)if(!kt[m]&&a[m]==null&&P[m]!=null){const M=m===(m=m.replace(_t,""))?1:6;E.batch.push({node:f,action:M,attr:m})}}(S,T,N,g),function(f,P,a,E){for(let m in a){if(m in kt)continue;let M=a[m],$=ue[m]?f[m]:P[m];M!==$&&(m=m==="class"?"className":m,m!=="className"?E.batch.push(m!=="style"?{node:f,action:E.isSvg?5:1,attr:m,value:M}:{node:f,action:3,value:{newValue:M,oldValue:$}}):le(f,M,$,E))}}(S,T||d,N,g)}(b,l,O?null:h,v),O&&v.batch.push({node:b,action:4,refDom:v.next,value:V,VNode:l})}(t,e,n,o),y=t._dom,o.isSvg=i!="foreignObject"&&o.isSvg,Ft(t,e,y,o),Pt(t,e,y)),y}function xe(t,e){let n;const r=U(x,n,[t]);e.hasChildNodes()&&function(s){let c;for(;c=s.firstChild;)s.removeChild(c)}(e);const o=[];z(r,n,e,!1,{depth:0,batch:o,isSvg:e.ownerSVGElement!==void 0,context:{}}),rt(o)}const ve=["boolean","string","number"];function q(t,e){return t==null||ve.indexOf(typeof t)>-1?t:t.constructor===void 0?function(n){let r;return(r=(n=function(o,s){if(!o)return null;s=C({},o.props,s),arguments.length>2&&(s.children=xt(arguments));let c=Y(s,Ct);return B(o.type,c,s.key||o.key,s.ref||o.ref)}(n)).props.children)&&(n.props.children=K([r],q)),n}(t):U(t,e)}const J=t=>t.promise||t.componentPromise;class be extends L{componentDidMount(){this._init()}componentDidUpdate(e){(e&&J(e))!==J(this.props)&&this._init()}_init(){this.setState({inProgress:!0});const e=J(this.props);e().then(n=>{e===J(this.props)&&this.setState({render:n,inProgress:!1,error:!1})}).catch(n=>this.setState({error:!0,inProgress:!1}))}render(e,n){return n.inProgress?q(e.fallback||e.fallbackComponent)||"Loading":n.error?q(e.errorComponent)||"An Error Occured":q(n.render,Y(e,["fallback","fallbackComponent","promise","componentPromise"]))}}const Se=/\/+$/;function $t(t){return t.length===1?t:t.replace(Se,"")}const H=[],F={subscribe(t){tt(H,t)},unsubscribe(t){H.splice(H.indexOf(t),1)},emit(t,e){H.forEach(n=>n(t,e))},unsubscribeAll(){H.length=0}};function Wt(t,e){if(!R.inMemoryRouter)return window.history[e](null,"",t);R.memoryRouteStore.setItem("UI--ROUTE",t)}function qt(t){Wt(t,"pushState"),F.emit(t,{type:"load",native:!1})}function Ce(t){Wt(t,"replaceState"),F.emit(t,{type:"redirect",native:!1})}class k extends L{constructor(e){super(e),this.state={},this._routeChangeHandler=this._routeChangeHandler.bind(this),this.componentDidUpdate=this._setRouteMethod}_setRouteMethod(){R.inMemoryRouter=!!this.props.inMemoryRouter}static __emitter(){F.emit(k.path+k.qs,{type:"popstate",native:!0})}static get path(){return location.pathname}static get qs(){return location.search}static get searchParams(){return new URLSearchParams(k.qs)}static _getParams(e,n){const r={};for(const o in e)r[e[o]]=decodeURIComponent(n[o]);return r}static getCurrentParams(e){const n=(e=ct(e)).params,r=e.regex.exec(k.path);return r?k._getParams(n,r):{}}componentDidMount(){this._setRouteMethod(),F.subscribe(this._routeChangeHandler),window.addEventListener("popstate",k.__emitter),this._routeChangeHandler(null)}componentWillUnmount(){window.removeEventListener("popstate",k.__emitter),F.unsubscribe(this._routeChangeHandler)}_notFoundComponent(){return U("div",null,`The Requested URL "${k.path}" was not found`)}_routeChangeHandler(e){const n=this._previous,r=k.path;if(this._previous=r,n===r)return;const o=$t(R.inMemoryRouter?R.memoryRouteStore.getItem("UI--ROUTE")||this.props.defaultRoute||"/":k.path);let s=[];this.props.children.forEach(c=>{const i=ct(c.props.match),p=i.regex.exec(o);if(p){const _=c.props,y=k._getParams(i.params,p);s.push(q(_.component,C({},c.props,{params:y})))}}),s.length||(s=U(this.props.fallbackComponent||this._notFoundComponent)),this.setState({child:s})}render(e,n){return U(x,null,n.child)}}function ct(t){if(!t)throw Error("Invalid value for match: "+t);if(t.regex!=null)return t;t=$t(t);const e={};let n=0;return{regex:(r=t.split("/").map(o=>o[0]===":"?(e[++n]=o.substr(1),"([^?\\/]+)"):o).join("/"),RegExp(`^${r}(/?)$`)),params:e};var r}function ke(t){if(t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)return;t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation(),t.preventDefault();const e=new URL(this.href,location.href);qt(e.pathname+e.search+e.hash)}function Ht(t,e,n){return t.call(n,e)}class we extends L{constructor(e){super(e),this._onClick=n=>{const r=n.currentTarget;Ht(ke,n,r);const o=this.props.onClick;o&&Ht(o,n,r)}}render(e){return U("a",C({},e,{onClick:this._onClick}))}}const Ue={};function jt(t,e){return!t||e.some((n,r)=>n!==t[r])}function it(t,e,n){return t[e]||(t[e]=ut(0,n))}function ut(t,e){return typeof e=="function"?e(t):e}let Kt=0,at=null;const Bt=[],lt=[];function Gt(t){const e=t.cleanUp;typeof e=="function"&&(e(),t.cleanUp=null)}function Zt(t){let e=t.cb;e&&typeof(e=e())=="function"&&(t.cleanUp=e),t.resolved=!0,t.cb=null}function Ee(t){t.resolved||Gt(t),Zt(t)}function zt(t){t.forEach(e=>{for(const n in e)Ee(e[n])})}function Re(){return zt(Bt)}const Ve=R.debounceEffect||(bt?function(t){const e=()=>{cancelAnimationFrame(n),clearTimeout(r),t()};let n,r;r=setTimeout(e,R.RAF_TIMEOUT),n=requestAnimationFrame(e)}:vt);function Q(){if(at==null)throw new Error("Hook candidate not found, make sure you're running cooks inside a component");return[at,Kt++]}function pt(t,e){const n=Q(),r=n[1],o=n[0]._hooksData;let s=o[r]||{};return jt(s.args,e)&&(o[r]=null,s=it(o,r,()=>({hookState:t()})),s.args=e),s.hookState}function Ne(t,e){return pt(()=>t,e)}function Pe(t){const e=Q(),n=e[0],r=e[1],o=n._sharedContext&&n._sharedContext[t.$id];if(!o)return t.def;const s=n._hooksData;it(s,r,{args:null,hookState:!1});const c=s[r];return c.hookState||(c.hookState=!0,o.add(n)),o.props.value}function Jt(t,e){for(const n in t||d)Gt(t[n]);e._pendingEffects=null}function Qt(){const t=this._pendingEffects||d,e=t.async;Jt(t.sync,this),Jt(e,this)}function Xt(t,e,n){const r=n===lt?"sync":"async",o=Q(),s=o[0],c=o[1],i=s._hooksData;let p=i[c]||{};const _=(s._pendingEffects=s._pendingEffects||{sync:{},async:{}})[r],y=_[c];if(!jt(p.args,e))return void(y&&(y.resolved=!0));i[c]=p,p.args=e;const l=y?(y.resolved=!1)||Zt(y)||y.cleanUp:null;if(_[c]={cb:t,cleanUp:l},tt(n,_),!s.__attachedUnmount){s.__attachedUnmount=!0;const h=s.componentWillUnmount;s.componentWillUnmount=h?function(){h.call(s),Qt.call(s)}:Qt}}function De(t,e){return Xt(t,e,Bt)}function Ae(t,e){return Xt(t,e,lt)}St({_hookSetup:function(t){at=t,Kt=0,t&&(t._hooksData||(t._hooksData=[]))},diffEnd:function(){zt(lt),Ve(Re)}});const Me={};function Yt(t,e,n){const r=Q(),o=r[0],s=it(o._hooksData,r[1],()=>({hookState:n?n(e):ut(null,e)}));return[s.hookState,s.args||(s.args=c=>{const i=t(s.hookState,c);s.hookState=i,o.setState(Me)})]}function Oe(t){return pt(()=>({current:t}),[])}function Te(t){return Yt(ut,t)}export default L;export{we as A,be as AsyncComponent,L as Component,x as Fragment,Ue as Path,k as Router,F as RouterSubscription,St as addPluginCallback,R as config,ye as createContext,U as createElement,he as createRef,ct as createRoutePath,U as h,qt as loadURL,Ce as redirect,xe as render,Ne as useCallback,Pe as useContext,De as useEffect,Ae as useLayoutEffect,pt as useMemo,Yt as useReducer,Oe as useRef,Te as useState};