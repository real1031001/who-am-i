import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const js=readFileSync(new URL('../dist/online.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../dist/online.css',import.meta.url),'utf8');
test('WHO AM I welcome lobby links to OSOGIL without an in-game control',()=>{
 const welcome=js.slice(js.indexOf('function welcome()'),js.indexOf('async function enter('));
 assert.match(welcome,/href="https:\/\/real1031001\.github\.io\/Osolgil\//);
 assert.match(welcome,/target="_blank" rel="noopener noreferrer"/);
 assert.match(welcome,/🎮 더 많은 게임/);
 assert.match(css,/\.online \.osogil-more-games\{/);
 assert.doesNotMatch(js.slice(js.indexOf('function update(')),/osogil-more-games/);
});
