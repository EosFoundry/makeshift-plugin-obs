import {
  init,
  getState,
  getSceneList,
  changeScene,
  test,
  createScene
} from "./makeshiftctrl-obs.js";

await init('aMG1az60s0gfL5wE', 'ws://192.168.1.25', 4455)

const scenes = getSceneList()

console.log(scenes)