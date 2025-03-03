const args = process.argv.slice(2);
console.log('Server received args:', args);

const DEFAULT_FRONTEND_PORT = 5421;
const DEFAULT_REST_PORT = 4000;
const DEFAULT_REST_HOST = '192.168.1.147';

const portIdx = args.indexOf('--port');
const restPortIdx = args.indexOf('--rest-port');
const restHostIdx = args.indexOf('--rest-host');

let FRONTEND_PORT = portIdx !== -1 && args[portIdx + 1] ? parseInt(args[portIdx + 1], 10) : DEFAULT_FRONTEND_PORT;
let REST_PORT = restPortIdx !== -1 && args[restPortIdx + 1] ? parseInt(args[restPortIdx + 1], 10) : DEFAULT_REST_PORT;
let REST_HOST = restHostIdx !== -1 && args[restHostIdx + 1] ? args[restHostIdx + 1] : DEFAULT_REST_HOST;
const bypassAuth = args.includes('--bypass-auth');

console.log('Parsed FRONTEND_PORT:', FRONTEND_PORT);
console.log('Parsed REST_PORT:', REST_PORT);
console.log('Parsed REST_HOST:', REST_HOST);
console.log('Parsed bypassAuth:', bypassAuth);

// FIXME: BIG MESS
const setup = (h, p1, p2) => {
  REST_HOST = h
  FRONTEND_PORT = p1
  REST_PORT = p2
}


module.exports = {
    FRONTEND_PORT,
    REST_PORT,
    REST_HOST,
    setup,
    bypassAuth
};
