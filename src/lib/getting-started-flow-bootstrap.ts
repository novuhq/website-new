import {
  GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
  GETTING_STARTED_FLOW_CLI_UPPER_BOUND,
  GETTING_STARTED_FLOW_COOKIE_MAX_AGE_SECONDS,
  GETTING_STARTED_FLOW_COOKIE_NAME,
  GETTING_STARTED_FLOW_EVENT_ENDPOINT,
  GETTING_STARTED_FLOW_EXPERIMENT_KEY,
  GETTING_STARTED_FLOW_EXPOSED_EVENT,
  GETTING_STARTED_FLOW_PREHYDRATION_COPIED_ATTRIBUTE,
  GETTING_STARTED_FLOW_QA_PARAM,
  GETTING_STARTED_FLOW_READY_ATTRIBUTE,
  GETTING_STARTED_FLOW_SELECTED_EVENT,
  GETTING_STARTED_FLOW_UI_UPPER_BOUND,
  GETTING_STARTED_FLOW_VARIANTS,
  SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
  SEGMENT_ANONYMOUS_ID_MAX_AGE_SECONDS,
  WEBSITE_CLI_COMMAND_COPIED_EVENT,
  WEBSITE_PROMPT_COPIED_EVENT,
} from "@/lib/getting-started-flow-experiment"

interface BuildBootstrapScriptOptions {
  enabled: boolean
  qaEnabled: boolean
}

/**
 * Assigns the visible arm before first paint and keeps its primary action
 * functional if application chunks are slow or unavailable. The hydrated
 * runtime takes ownership as soon as React is ready.
 */
export function buildGettingStartedFlowBootstrapScript({
  enabled,
  qaEnabled,
}: BuildBootstrapScriptOptions): string {
  const config = JSON.stringify({
    assignmentGlobal: "__novuGettingStartedFlowAssignment",
    assignmentVersion: GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
    anonymousCookieMaxAge: SEGMENT_ANONYMOUS_ID_MAX_AGE_SECONDS,
    anonymousCookieName: SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
    cliUpperBound: GETTING_STARTED_FLOW_CLI_UPPER_BOUND,
    cookieMaxAge: GETTING_STARTED_FLOW_COOKIE_MAX_AGE_SECONDS,
    cookieName: GETTING_STARTED_FLOW_COOKIE_NAME,
    enabled,
    eventEndpoint: GETTING_STARTED_FLOW_EVENT_ENDPOINT,
    events: {
      cliCopied: WEBSITE_CLI_COMMAND_COPIED_EVENT,
      exposed: GETTING_STARTED_FLOW_EXPOSED_EVENT,
      promptCopied: WEBSITE_PROMPT_COPIED_EVENT,
      selected: GETTING_STARTED_FLOW_SELECTED_EVENT,
    },
    experimentKey: GETTING_STARTED_FLOW_EXPERIMENT_KEY,
    exposureGlobal: "__novuGettingStartedFlowExposureKey",
    listenerGlobal: "__novuGettingStartedFlowPreHydrationListenerInstalled",
    preHydrationCopiedAttribute:
      GETTING_STARTED_FLOW_PREHYDRATION_COPIED_ATTRIBUTE,
    qaEnabled,
    qaParam: GETTING_STARTED_FLOW_QA_PARAM,
    readyAttribute: GETTING_STARTED_FLOW_READY_ATTRIBUTE,
    rootAttribute: "data-getting-started-flow",
    uiUpperBound: GETTING_STARTED_FLOW_UI_UPPER_BOUND,
    variants: GETTING_STARTED_FLOW_VARIANTS,
  })

  return `(function(){
var c=${config},r=document.documentElement,w=window;
var valid=function(v){return c.variants.indexOf(v)!==-1};
var read=function(n){
  try{
    var p=n+"=",a=document.cookie?document.cookie.split(";"):[];
    for(var i=0;i<a.length;i+=1){
      var x=a[i].trim();
      if(x.indexOf(p)===0)return x.slice(p.length);
    }
  }catch(_){}
  return null;
};
var uuid=function(){
  try{return w.crypto.randomUUID()}catch(_){}
  var b=new Uint8Array(16);
  try{w.crypto.getRandomValues(b)}catch(_){for(var i=0;i<16;i+=1)b[i]=Math.floor(Math.random()*256)}
  b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;
  var h=Array.prototype.map.call(b,function(x){return x.toString(16).padStart(2,"0")}).join("");
  return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20);
};
var parseId=function(v,encoded){
  if(!v)return null;
  try{if(encoded)v=decodeURIComponent(v)}catch(_){return null}
  try{var parsed=JSON.parse(v);v=typeof parsed==="string"?parsed:""}catch(_){}
  return v&&v.length<=128?v:null;
};
var anonymousId=function(){
  if(w.__novuSegmentAnonymousId)return w.__novuSegmentAnonymousId;
  var stored=null;
  try{stored=parseId(w.localStorage.getItem(c.anonymousCookieName))}catch(_){}
  var id=stored||parseId(read(c.anonymousCookieName),true)||uuid();
  w.__novuSegmentAnonymousId=id;
  try{w.localStorage.setItem(c.anonymousCookieName,JSON.stringify(id))}catch(_){}
  try{
    var shared=w.location.hostname==="novu.co"||w.location.hostname.slice(-8)===".novu.co"?"; Domain=.novu.co":"";
    document.cookie=c.anonymousCookieName+"="+encodeURIComponent(JSON.stringify(id))
      +"; Max-Age="+c.anonymousCookieMaxAge+"; Path=/; SameSite=Lax"+shared
      +(w.location.protocol==="https:"?"; Secure":"");
  }catch(_){}
  return id;
};
var beacon=function(body){
  try{return navigator.sendBeacon(c.eventEndpoint,new Blob([body],{type:"application/json"}))}catch(_){return false}
};
var timestamp=function(){
  var now=Math.max(Date.now(),(w.__novuGsfTs||0)+1);
  w.__novuGsfTs=now;return new Date(now).toISOString();
};
var emit=function(event,extra){
  var assignment=w[c.assignmentGlobal];
  if(!assignment)return false;
  var properties={
    experiment_key:c.experimentKey,
    assignment_version:c.assignmentVersion,
    getting_started_flow:assignment.variant,
    variant:assignment.variant,
    assignment_source:assignment.source,
    is_qa:assignment.isQa
  };
  for(var key in extra)properties[key]=extra[key];
  var occurredAt=timestamp();
  var body=JSON.stringify({
    anonymousId:anonymousId(),assignment:assignment,event:event,
    messageId:"gsf-"+uuid(),properties:properties,sentAt:timestamp(),timestamp:occurredAt
  });
  try{
    if(typeof fetch==="function"){
      fetch(c.eventEndpoint,{body:body,credentials:"same-origin",headers:{"Content-Type":"application/json"},keepalive:true,method:"POST"})
        .then(function(response){if(!response.ok)beacon(body)},function(){beacon(body)});
      return true;
    }
  }catch(_){}
  return beacon(body);
};
var expose=function(){
  var assignment=w[c.assignmentGlobal];
  if(w.location.pathname!=="/"||!assignment)return;
  var key=c.experimentKey+":"+c.assignmentVersion+":"+assignment.variant+":"+(assignment.isQa?"qa":"production");
  if(w[c.exposureGlobal]===key)return;
  if(emit(c.events.exposed,{}))w[c.exposureGlobal]=key;
};
var eventElement=function(event){
  return event.target&&event.target.closest?event.target:null;
};
var prepareSignup=function(event){
  if(r.hasAttribute(c.readyAttribute))return;
  var target=eventElement(event),link=target&&target.closest("a[data-getting-started-flow-signup]");
  if(!link)return;
  try{
    var url=new URL(link.href,w.location.href);
    if(url.hostname!=="dashboard.novu.co")return;
    url.searchParams.set("ajs_aid",anonymousId());link.href=url.toString();
  }catch(_){}
};
var fallbackCopy=function(value){
  var area,focused=document.activeElement,copied=false;
  try{
    area=document.createElement("textarea");area.value=value;area.setAttribute("readonly","");
    area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();
    copied=document.execCommand("copy");
  }catch(_){}
  if(area)area.remove();if(focused&&focused.focus)focused.focus();return copied;
};
var copy=function(value){
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){
      return navigator.clipboard.writeText(value).then(function(){return true},function(){return fallbackCopy(value)});
    }
  }catch(_){}
  return Promise.resolve(fallbackCopy(value));
};
var showCopiedFeedback=function(target,action){
  var token=String(+(target.getAttribute(c.preHydrationCopiedAttribute)||0)+1);
  target.setAttribute(c.preHydrationCopiedAttribute,token);
  target.setAttribute("aria-label","Copied");
  var live=target.querySelector("[aria-live]")||target.nextElementSibling;
  if(live&&live.getAttribute("aria-live")){
    live.textContent=action==="copy_cli"?"Command copied to clipboard":"Prompt copied to clipboard";
  }
  setTimeout(function(){
    if(target.getAttribute(c.preHydrationCopiedAttribute)!==token)return;
    target.removeAttribute(c.preHydrationCopiedAttribute);
    target.setAttribute("aria-label",action==="copy_prompt"?"Copy prompt":"Copy to clipboard");
    if(live&&live.getAttribute("aria-live"))live.textContent="";
  },2000);
};
var trackAction=function(event){
  if(r.hasAttribute(c.readyAttribute))return;
  if(event.type==="mouseup"&&event.button!==1||event.type==="click"&&event.button!==0)return;
  var element=eventElement(event),target=element&&element.closest("[data-getting-started-flow-action]");
  if(!target)return;
  var action=target.getAttribute("data-getting-started-flow-action");
  if(action==="sign_up_primary"){
    event.stopImmediatePropagation();expose();emit(c.events.selected,{action:action});return;
  }
  if(event.type!=="click"||(action!=="copy_cli"&&action!=="copy_prompt"))return;
  var value=target.getAttribute("data-getting-started-flow-copy-value");
  if(!value)return;
  event.preventDefault();event.stopImmediatePropagation();
  copy(value).then(function(copied){
    if(!copied)return;
    showCopiedFeedback(target,action);
    expose();emit(c.events.selected,{action:action});
    var property=action==="copy_cli"?"command":"prompt",details={};details[property]=value;
    emit(action==="copy_cli"?c.events.cliCopied:c.events.promptCopied,details);
  });
};
var activate=function(){
  if(w[c.listenerGlobal])return;
  w[c.listenerGlobal]=true;
  document.addEventListener("pointerdown",prepareSignup,true);
  document.addEventListener("auxclick",prepareSignup,true);
  document.addEventListener("click",prepareSignup,true);
  document.addEventListener("contextmenu",prepareSignup,true);
  document.addEventListener("mouseup",trackAction,true);
  document.addEventListener("click",trackAction,true);
  setTimeout(expose,0);
};
var override=null;
try{override=new URLSearchParams(window.location.search).get(c.qaParam)}catch(_){}
if(c.qaEnabled&&valid(override)){
  r.setAttribute(c.rootAttribute,override);
  w[c.assignmentGlobal]={isQa:true,source:"qa",variant:override};
  activate();
  return;
}
if(!c.enabled){
  r.removeAttribute(c.rootAttribute);
  delete w[c.assignmentGlobal];
  return;
}
var variant=read(c.cookieName),source="cookie";
if(!valid(variant)){
  source="random";
  var randomValue=Math.random();
  try{
    var values=new Uint32Array(1);
    window.crypto.getRandomValues(values);
    randomValue=values[0]/4294967296;
  }catch(_){}
  variant=randomValue<c.uiUpperBound?"ui":randomValue<c.cliUpperBound?"cli":"prompt";
  try{
    document.cookie=c.cookieName+"="+variant
      +"; Max-Age="+c.cookieMaxAge
      +"; Path=/; SameSite=Lax"
      +(window.location.protocol==="https:"?"; Secure":"");
  }catch(_){}
}
r.setAttribute(c.rootAttribute,variant);
w[c.assignmentGlobal]={isQa:false,source:source,variant:variant};
activate();
})();`.replace(/\n\s*/g, "")
}

export const GETTING_STARTED_FLOW_VISIBILITY_CSS = `
html [data-getting-started-flow-variant] {
  display: none;
}

html:not([data-getting-started-flow="ui"]):not([data-getting-started-flow="cli"]):not([data-getting-started-flow="prompt"])
  [data-getting-started-flow-variant="baseline"],
html[data-getting-started-flow="ui"]
  [data-getting-started-flow-variant="ui"],
html[data-getting-started-flow="cli"]
  [data-getting-started-flow-variant="cli"],
html[data-getting-started-flow="prompt"]
  [data-getting-started-flow-variant="prompt"] {
  display: flex;
}

[${GETTING_STARTED_FLOW_PREHYDRATION_COPIED_ATTRIBUTE}] {
  position: relative;
  color: transparent;
}

[${GETTING_STARTED_FLOW_PREHYDRATION_COPIED_ATTRIBUTE}]::after {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  content: "Copied";
}

`
