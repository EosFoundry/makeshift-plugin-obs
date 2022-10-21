import ObsWebSocket from 'obs-websocket-js';
import url from 'node:url'

const obs = new ObsWebSocket();

let sendLog = console.log
let sendError = console.error
const pluginData = {
    name: 'makeshiftctrl-obs',
    webSocketAddress: '',
    obsWebSocketVersion: '',
    connected: false,
}

obs.on('Hello', () => {
    console.log('Got hello.')
})

obs.on('Identified', () => {
    console.log('Identified.')
})

obs.on('ConnectionOpened', () => {
    console.log(`Connecting...`);
});

obs.on('ConnectionClosed', () => {
    console.log('Closing...')
})

obs.on('error', err => {
    sendError('Socket error:', err);
});


// here's some indented comments
// here's a double line comment!
// TODO: CALIBER you will need to add your websocket address and password here
export async function init(
    password,
    address = new URL('ws://127.0.0.1'),
    port = 4455) {

    try { // here's an inline comment
        const osbUrl = new URL(address + port.toString())
        const {
            obsWebSocketVersion,
        } = await obs.connect(
            osbUrl,
            password,
            {
                rpcVersion: 1
            });
        pluginData.obsWebSocketVersion = obsWebSocketVersion
        pluginData.connected = true;
        log(`Connected to server ${pluginData.obsWebSocketVersion}`)
    } catch (error) {
        error('Failed to connect', error.code, error.message)
    }
}

export function getState() {
    return pluginData
}

export function call(functionName, requestField) {
    obs.call(functionName, requestField)
        .then((data) => {
            console.log(JSON.stringify(data))
        }).catch((err) => {
            console.log(`RunObs Error:${err}`)
        })
}