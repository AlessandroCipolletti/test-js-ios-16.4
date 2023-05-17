import { v4 as uuidv4 } from 'uuid'
import './main.css'
import {
  waitWorkerMessage,
  delay,
  drawCircle,
  getRandomNumber,
  getRandomHexColor,
  getCanvasBlobAsync,
  blobToBase64Async,
  getCanvasBase64Async,
} from './utils'

// TODOs
// - comparare le performance di esportazione di un OffscreenCanvas con transferToImageBitmap VS gli altri metodi che avevo usato in drawith.me

// const destinationContext = destinationVisibleCanvas.getContext('bitmaprenderer')
// const offscreenCanvas = new OffscreenCanvas(destinationVisibleCanvas.width, destinationVisibleCanvas.height)
// const offscreenContext = offscreenCanvas.getContext('2d')
// // Drawing something on the offscreen canvas
// const drawing = offscreenCanvas.transferToImageBitmap()  // <- here
// destinationContext.transferFromImageBitmap(drawing) // <- and here



const init = async () => {
  const N = 3_000_000
  const PXR = window.devicePixelRatio

  const textArea = document.querySelector('textarea')
  textArea.focus()
  // await delay(1000)

  const canvas = document.querySelector('canvas')
  canvas.width = window.innerWidth * PXR
  canvas.height = window.innerHeight * PXR * 3
  const context = canvas.getContext('2d')

  console.time('canvas drawing')

  for (let i = 0; i < N; i++) {
    drawCircle(
      context,
      getRandomNumber(canvas.width),
      getRandomNumber(canvas.height),
      getRandomNumber(0.1, true) + 0,
      (getRandomNumber(50) + 10) * PXR,
      0,
      getRandomHexColor(),
      0
    )
  }

  console.timeEnd('canvas drawing')

  console.time('canvas to blob')
  const blob = await getCanvasBlobAsync(canvas)
  console.timeEnd('canvas to blob')

  console.time('blob to base64')
  await blobToBase64Async(blob)
  console.timeEnd('blob to base64')

  console.time('canvas to base64')
  await getCanvasBase64Async(canvas)
  console.timeEnd('canvas to base64')

  console.time('canvas toDataUrl')
  canvas.toDataURL('image/png').length
  console.timeEnd('canvas toDataUrl')



  const worker = new Worker(
    new URL('worker.js', import.meta.url),
    { type: 'module' }
  )

  const canvas2 = document.createElement('canvas')
  canvas2.id = 'canvas2'
  canvas2.width = canvas.width
  canvas2.height = canvas.height
  document.body.appendChild(canvas2)

  const offscreenCanvas = canvas2.transferControlToOffscreen()

  let id = uuidv4()
  console.time('worker drawing')
  worker.postMessage({ id, canvas: offscreenCanvas }, [offscreenCanvas])
  await waitWorkerMessage(worker, id)
  console.timeEnd('worker drawing')



  const canvas3 = document.createElement('canvas')
  canvas3.id = 'canvas3'
  canvas3.width = canvas.width
  canvas3.height = canvas.height
  document.body.appendChild(canvas3)
  const destinationContext = canvas3.getContext('bitmaprenderer')
  const offscreenCanvas2 = new OffscreenCanvas(canvas3.width, canvas3.height)
  const offscreenContext = offscreenCanvas2.getContext('2d')

  console.time('offscreen canvas drawing')
  for (let i = 0; i < N; i++) {
    drawCircle(
      offscreenContext,
      getRandomNumber(canvas.width),
      getRandomNumber(canvas.height),
      getRandomNumber(0.1, true) + 0,
      (getRandomNumber(50) + 10) * PXR,
      0,
      getRandomHexColor(),
      0
    )
  }
  console.timeEnd('offscreen canvas drawing')

  console.time('offscreen canvas to image bitmap')
  const drawing = offscreenCanvas2.transferToImageBitmap()  // <- here
  console.timeEnd('offscreen canvas to image bitmap')

  console.time('offscreen canvas to visible canvas')
  destinationContext.transferFromImageBitmap(drawing) // <- and here
  console.timeEnd('offscreen canvas to visible canvas')



  const worker2 = new Worker(
    new URL('worker2.js', import.meta.url),
    { type: 'module' }
  )
  const canvas4 = document.createElement('canvas')
  canvas4.id = 'canvas4'
  canvas4.width = canvas.width
  canvas4.height = canvas.height
  const context4Bitmap = canvas4.getContext('bitmaprenderer')
  // const context42D = canvas4.getContext('2d')
  document.body.appendChild(canvas4)

  id = uuidv4()
  console.time('worker2 drawing and coping')
  worker2.postMessage({ id, width: canvas4.width, height: canvas4.height })
  const res = await waitWorkerMessage(worker2, id)

  console.time('worker2 transferFromImageBitmap')
  context4Bitmap.transferFromImageBitmap(res.drawing)
  console.timeEnd('worker2 transferFromImageBitmap')
  console.log(res.drawing)

  // console.time('worker2 drawImage')
  // context42D.drawImage(res.drawing, 0, 0)
  // console.timeEnd('worker2 drawImage')

  console.timeEnd('worker2 drawing and coping')
}

document.onreadystatechange = async () => {
  if (document.readyState === 'complete') {
    await init()
  }
}
