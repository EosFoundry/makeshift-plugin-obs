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
  scenes: [],
}

obs.on('Hello', () => {
  console.log('Got hello.');
})

obs.on('Identified', () => {
  console.log('Identified.');
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

obs.on('SceneCreated', (data) => {
  let newSceneIndex = pluginData.scenes[pluginData.scenes.length - 1].sceneIndex
  newSceneIndex++
  pluginData.scenes.push({
    sceneIndex: newSceneIndex,
    sceneName: data.sceneName
  })
  console.log('Scene Created: ')
  console.log(pluginData.scenes)
})

obs.on('SceneRemoved', (data) => {
  pluginData.scenes = pluginData.scenes.filter((val) => val.sceneName !== data.sceneName)
  console.log('Scene Removed: ')
  console.log(pluginData.scenes)
})

obs.on('SceneNameChanged', (data) => {
  console.log('Scene Name Changed with data object: ')
  console.log(data)
  // data: { oldSceneName: <string> , sceneName: <string> }
  // sceneObject: { sceneIndex: <string> , sceneName: <string> }
  let matchedIndex = pluginData.scenes.findIndex((sceneObject) => {
    console.log(`array element AKA sceneObject:`)
    console.log(sceneObject)
    console.log(`Is current element AKA sceneObject a match: `)
    let isMatch = (sceneObject.sceneName === data.oldSceneName)
    console.log(isMatch)
    // return false
    return isMatch
  })
  
  console.log(`found matched index:`)
  console.log(matchedIndex)
  console.log(`Array element with index ${matchedIndex}`)
  console.log(pluginData.scenes[matchedIndex])
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
    const ret = await obs.call('GetSceneList')
    pluginData.scenes = ret.scenes
    console.log("Scenes: ")
    console.log(pluginData.scenes)
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
export function changeScene(newSceneName) {
  obs.call('SetCurrentProgramScene', {
    sceneName: newSceneName
  })
}

export function createScene(newSceneName) {
  obs.call('CreateScene', {
    sceneName: newSceneName
  })
}

export function toggleSource() {

}

/**
 * testing function that logs a string
 */
export function test() {
  console.log('testing plugin-obs')
  console.log(pluginData.scenes)
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