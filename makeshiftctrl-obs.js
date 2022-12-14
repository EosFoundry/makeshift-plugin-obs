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


/**
 * Spins up the 
 * @param {*} password - password field
 * @param {*} address - IP address that OBS is listening on
 * @param {*} port - the port
 */
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

/**
 * gets all the 
 * @returns pluginData
 */
export function getState() {
    return pluginData
}

/**
 * Directly calls the obs websocket interface
 * @param {string} functionName 
 * @param {object} requestField 
 */
export function call(functionName, requestField) {
    obs.call(functionName, requestField)
        .then((data) => {
            console.log(JSON.stringify(data))
        }).catch((err) => {
            console.log(`RunObs Error:${err}`)
        })
}