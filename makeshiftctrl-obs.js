import ObsWebSocket from 'obs-websocket-js';
import url from 'node:url'

const obs = new ObsWebSocket();

let sendLog = console.log
let sendError = console.error
export const pluginData = {
  name: 'makeshiftctrl-obs',
  webSocketAddress: '',
  obsWebSocketVersion: '',
  connected: false,
  sceneNames:[]
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

obs.on('SceneCreated', (sceneName, isGroup) => {
  
})


/**
 * TODO: document this properly
 * @param {*} password - password field
 * @param {*} address - IP address that OBS is listening on
 * @param {*} port - the port
 */
export async function init(password, address, port) {
  const stringUrl = address + ':' + port.toString()
  console.log('stringUrl: ' + stringUrl)

  const osbUrl = new URL(stringUrl)
  console.log('obsurl: ' + osbUrl)
  try { // here's an inline comment
    const { obsWebSocketVersion, } = await obs.connect(osbUrl, password, { rpcVersion: 1 });
    pluginData.obsWebSocketVersion = obsWebSocketVersion
    pluginData.connected = true;
    sendLog(`Connected to server ${pluginData.obsWebSocketVersion}`)
    obs.call('GetSceneList')
  } catch (error) {
    sendError('Failed to connect', error.code, error.message)
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
 * - switch scenes
 * - adding captures
 */
export function changeScene(sceneName) {
  
}

export function toggleSource() {

}

/**
 * testing function that logs a string
 */
export function test() {
  console.log('testing plugin-obs')
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
      console.log(`RunObs Error: ${err}`)
    })
}