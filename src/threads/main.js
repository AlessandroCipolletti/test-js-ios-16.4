// import { v4 as uuidv4 } from 'uuid'
import './main.css'
import {
  initUtils,
  delay,
  drawCircle,
  getRandomNumber,
  getRandomHexColor,
  // waitWorkerMessage,
} from '../utils/utils'


const appendOneCanvas = async() => {
  // const worker = new Worker(
  //   new URL('worker.js', import.meta.url),
  //   { type: 'module' }
  // )

  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth // * window.devicePixelRatio
  canvas.height = window.innerHeight // * window.devicePixelRatio
  document.body.appendChild(canvas)
  // const offscreenCanvas = canvas.transferControlToOffscreen()

  // const id = uuidv4()
  // worker.postMessage({ id, canvas: offscreenCanvas }, [offscreenCanvas])
  // return waitWorkerMessage(worker, id)


  const N = 500
  const context = canvas.getContext('2d')

  while(true) {
  // for (let i = 0; i < N; i++) {
    drawCircle(
      context,
      getRandomNumber(canvas.width),
      getRandomNumber(canvas.height),
      getRandomNumber(0.2, true) + 0,
      (getRandomNumber(canvas.width * 0.2) + canvas.width * 0.05),
      0,
      getRandomHexColor(),
      0
    )
    await delay(20)
  }
}


const init = async () => {
  const N = new URLSearchParams(document.location.search).get('n') || 5

  try {
    // while(true) {
    for (let i = 0; i < N; i++) {
      // await appendOneCanvas()
      appendOneCanvas()
    }
  } catch (error) {
    alert(error.message)
  }
}

document.onreadystatechange = async () => {
  if (document.readyState === 'complete') {
    initUtils()
    await init()
  }
}

