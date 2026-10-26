import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server.mjs';
test('HTTP clients create/join, authenticate, isolate secrets, and reject unauthorized actions',async t=>{
const app=createApp();await new Promise(r=>app.server.listen(0,'127.0.0.1',r));let base='http://127.0.0.1:'+app.server.address().port;const controllers=[];
t.after(()=>{controllers.forEach(c=>c.abort());app.server.closeAllConnections();app.server.close()});
const post=async(path,data,token)=>{const r=await fetch(base+'/api/'+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(data)});return {status:r.status,data:await r.json()}};
const a=await post('create',{name:'A',avatar:0});assert.equal(a.status,200);const code=a.data.state.code;
const b=await post('join',{name:'B',code}),c=await post('join',{name:'C',code});const people=[a,b,c].map(x=>x.data);
for(const p of people){const ctrl=new AbortController();controllers.push(ctrl);const res=await fetch(base+'/api/events',{headers:{Authorization:'Bearer '+p.token},signal:ctrl.signal});assert.equal(res.status,200);assert.match(res.headers.get('content-type'),/event-stream/);res.body.getReader().read().catch(()=>{});}
assert.equal((await post('action',{type:'start'})).status,401);
for(const p of people)assert.equal((await post('action',{type:'ready',ready:true},p.token)).status,200);
assert.equal((await post('action',{type:'start'},b.data.token)).status,400);
let s=(await post('action',{type:'start'},a.data.token)).data;
assert.equal(s.phase,'propose');const target=s.subject;for(const p of people.filter(p=>p.state.me!==target)){const r=await post('action',{type:'propose',seq:s.seq,text:'UNIQUE_SECRET'},p.token);assert.equal(r.status,200)}
const owner=people.find(p=>p.state.me===target);const own=await fetch(base+'/api/state',{headers:{Authorization:'Bearer '+owner.token}});const ownState=await own.json();assert.equal(ownState.players.find(p=>p.id===target).secret,null);assert.ok(!JSON.stringify(ownState).includes('UNIQUE_SECRET'));
const other=people.find(p=>p!==owner);const otherState=await (await fetch(base+'/api/state',{headers:{Authorization:'Bearer '+other.token}})).json();assert.equal(otherState.players.find(p=>p.id===target).secret,'UNIQUE_SECRET');
const cross=await fetch(base+'/api/action',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json',Authorization:'Bearer '+owner.token},body:'{}'});assert.equal(cross.status,403);
assert.equal((await fetch(base+'/health')).status,200);assert.equal((await fetch(base+'/')).status,200);assert.match(await (await fetch(base+'/')).text(),/online.js/);
});
