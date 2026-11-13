// Fails if the demo API and the server's list of allowed calls drift apart (a call the page makes that the server would refuse, or the reverse).
// Run: node scripts/dogpage-tests/api-parity.cjs
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const sandbox = { window: {}, console }; sandbox.self = sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'public/dog-api.js'), 'utf8'), sandbox);
const local = Object.keys(sandbox.DogAPI || sandbox.window.DogAPI || {}).filter(k => typeof (sandbox.DogAPI || sandbox.window.DogAPI)[k] === 'function');
const LOCAL_ONLY = (fs.readFileSync(path.join(root, 'public/dog-api-remote.js'), 'utf8').match(/LOCAL_ONLY = \[(.*?)\]/)[1].match(/'(\w+)'/g) || []).map(x => x.slice(1, -1));
const server = (fs.readFileSync(path.join(root, 'server/handler.mjs'), 'utf8').match(/METHODS = new Set\(\[([\s\S]*?)\]\)/)[1].match(/'(\w+)'/g) || []).map(x => x.slice(1, -1));
const remote = local.filter(k => !LOCAL_ONLY.includes(k));
const missing = remote.filter(k => !server.includes(k)), extra = server.filter(k => !remote.includes(k));
if (missing.length || extra.length) { console.error('MISMATCH\n  sent to the server but not allowed by it:', missing, '\n  allowed by the server but not in the demo API:', extra); process.exit(1); }
console.log('ok: ' + remote.length + ' calls match between the page and the server');
