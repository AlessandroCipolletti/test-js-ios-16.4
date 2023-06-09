import { v4 as uuidv4 } from 'uuid'
import './main.css'
import {
  initUtils,
  waitWorkerMessage,
  drawCircle,
  imgToCanvas,
  getRandomNumber,
  getRandomHexColor,
  getCanvasBlobAsync,
  blobToBase64Async,
  getCanvasBase64Async,
  findImageContentCoords,
  getOneFullCanvas,
} from '../utils/utils'


const init = async () => {
  const N = 1_000_000
  const PXR = window.devicePixelRatio

  // setInterval(() => {
  //   console.log('interval')
  // }, 100)


  // const image = new Image()
  // image.onload = async() => {
  //   const bitmap = await createImageBitmap(image)

  //   context.drawImage(bitmap, 0, 0)

  //   const img = new Image()
  //   console.log(bitmap)
  //   console.log(await blobToBase64Async(bitmap))
  //   console.log(encodeURIComponent(bitmap))
  //   img.src = encodeURIComponent(bitmap)
  //   canvas.parentNode.insertBefore(img, canvas)
  // }
  // image.src = 'https://thumbs.dreamstime.com/b/imge-de-menthe-79631310.jpg'

  /*
    TODO
      - tot test tutti gli step main thread
      - blob e base64 step inside worker
      - tot tutti gli step dentro worker
      - cropImageWithMargin and resizeImageAndGetBase64
  */


  console.time(`TEST 1 - main thread - drawing ${N} circles on a canvas`)
  const canvas = getOneFullCanvas(window.innerWidth * PXR, window.innerHeight * PXR * 3, N)
  console.timeEnd(`TEST 1 - main thread - drawing ${N} circles on a canvas`)
  document.body.appendChild(canvas)

  console.time('TEST 2 - main thread - canvas to blob async')
  const blob = await getCanvasBlobAsync(canvas)
  console.timeEnd('TEST 2 - main thread - canvas to blob async')

  console.time('TEST 3 - main thread - blob to base64 async')
  await blobToBase64Async(blob)
  console.timeEnd('TEST 3 - main thread - blob to base64 async')

  console.time('TEST 4 - main thread - canvas to base64 async')
  await getCanvasBase64Async(canvas)
  console.timeEnd('TEST 4 - main thread - canvas to base64 async')

  console.time('TEST 5 - main thread - canvas toDataUrl')
  canvas.toDataURL('image/png')
  console.timeEnd('TEST 5 - main thread - canvas toDataUrl')



  const worker = new Worker(
    new URL('worker.js', import.meta.url),
    { type: 'module' }
  )

  const canvas2 = document.createElement('canvas')
  canvas2.id = 'canvas2'
  canvas2.width = canvas.width
  canvas2.height = canvas.height
  document.body.appendChild(canvas2)

  console.log(canvas2.toDataURL('image/png').length)

  const offscreenCanvas = canvas2.transferControlToOffscreen()
  canvas2.style.width = '33vw'

  console.log(canvas2.width, canvas2.height, offscreenCanvas.width, offscreenCanvas.height)

  let id1 = uuidv4()
  console.time(`TEST 6 - worker - drawing ${N} circles on a offscreen canvas`)
  worker.postMessage({ id: id1, canvas: offscreenCanvas, N }, [offscreenCanvas])
  await waitWorkerMessage(worker, id1)
  console.timeEnd(`TEST 6 - worker - drawing ${N} circles on a offscreen canvas`)


  console.time('TEST 6.1 - main thread - canvas transferred to offscrreen -> to base64')
  console.log(canvas2.toDataURL('image/png').length)
  console.timeEnd('TEST 6.1 - main thread - canvas transferred to offscrreen -> to base64')
  console.log(canvas2.width, canvas2.height, offscreenCanvas.width, offscreenCanvas.height)


  const canvas3 = document.createElement('canvas')
  canvas3.id = 'canvas3'
  canvas3.width = canvas.width
  canvas3.height = canvas.height
  document.body.appendChild(canvas3)
  const destinationContext = canvas3.getContext('bitmaprenderer')
  const offscreenCanvas2 = new OffscreenCanvas(canvas3.width, canvas3.height)
  const offscreenContext = offscreenCanvas2.getContext('2d')

  console.time(`TEST 7 - main thread - drawing ${N} circles on a offscreen canvas`)
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
  console.timeEnd(`TEST 7 - main thread - drawing ${N} circles on a offscreen canvas`)

  console.time('TEST 8 - main thread - offscreen canvas to bitmap')
  const drawing = offscreenCanvas2.transferToImageBitmap()
  console.timeEnd('TEST 8 - main thread - offscreen canvas to bitmap')

  console.time('TEST 9 - main thread - filling a canvas with a bitmap')
  destinationContext.transferFromImageBitmap(drawing)
  console.timeEnd('TEST 9 - main thread - filling a canvas with a bitmap')

  console.time('TEST 10 - main thread - put canvas content inside a bitmap')
  const bitmap = await createImageBitmap(canvas3, 0, 0, canvas3.width, canvas3.height)
  console.timeEnd('TEST 10 - main thread - put canvas content inside a bitmap')

  console.time('TEST 11 - main thread - put canvas content inside a bitmap (with resize)')
  await createImageBitmap(canvas3, 0, 0, canvas3.width / 10, canvas3.height / 10)
  console.timeEnd('TEST 11 - main thread - put canvas content inside a bitmap (with resize)')



  console.time('TEST 12 - main thread - bitmap to canvas')
  imgToCanvas(bitmap)
  console.timeEnd('TEST 12 - main thread - bitmap to canvas')


  console.time('TEST 13 - main thread - bitmap to base64')
  await getCanvasBase64Async(bitmap)
  console.timeEnd('TEST 13 - main thread - bitmap to base64')


  // console.time('TEST 14 - main thread - bitmap to blob url')
  // console.log(URL.createObjectURL(imgToCanvas(bitmap)))
  // console.timeEnd('TEST 14 - main thread - bitmap to blob url')


  const offscreenCanvas3 = new OffscreenCanvas(canvas3.width, canvas3.height)
  const offscreenContext3 = offscreenCanvas3.getContext('2d')
  offscreenContext3.drawImage(canvas, 0, 0)
  console.time('TEST 14 - main thread - offscreen canvas to blob')
  const blob3 = await offscreenCanvas3.convertToBlob()
  console.timeEnd('TEST 14 - main thread - offscreen canvas to blob')



  const worker2 = new Worker(
    new URL('worker2.js', import.meta.url),
    { type: 'module' }
  )
  const id2 = uuidv4()
  console.time('TEST 15 - worker- bitmap to base64')
  worker2.postMessage({ id: id2, bitmap })
  await waitWorkerMessage(worker2, id2)
  console.timeEnd('TEST 15 - worker- bitmap to base64')


  console.time('TEST 16 - main thread - duplicate bitmap')
  const bitmap2 = await createImageBitmap(bitmap)
  console.timeEnd('TEST 16 - main thread - duplicate bitmap')
  console.log(bitmap2)


  console.time('TEST 17 - main thread - canvas getImageData')
  const imageData = context.getImageData(0, 0, canvas3.width, canvas3.height)
  console.timeEnd('TEST 17 - main thread - canvas getImageData')
  console.log(imageData.data.length)



  const canvas4 = document.createElement('canvas')
  canvas4.id = 'canvas4'
  canvas4.width = canvas.width
  canvas4.height = canvas.height
  canvas4.context = canvas4.getContext('2d')
  console.time('TEST 18 - main thread - findImageContentCoords su un canvas delegato a offscreen')
  const coords = await findImageContentCoords(canvas4)
  console.log(coords)
  console.timeEnd('TEST 18 - main thread - findImageContentCoords su un canvas delegato a offscreen')

  // const worker3 = new Worker(
  //   new URL('worker3.js', import.meta.url),
  //   { type: 'module' }
  // )
  // const canvas4 = document.createElement('canvas')
  // canvas4.id = 'canvas4'
  // canvas4.width = canvas.width
  // canvas4.height = canvas.height
  // // const context42D = canvas4.getContext('2d')
  // document.body.appendChild(canvas4)

  // id = uuidv4()
  // console.time('worker2 drawing and coping')
  // worker3.postMessage({ id, width: canvas4.width, height: canvas4.height, N })
  // const res = await waitWorkerMessage(worker3, id)

  // console.log(res.drawing)

  // // console.time('worker2 drawImage')
  // // context42D.drawImage(res.drawing, 0, 0)
  // // console.timeEnd('worker2 drawImage')

  // console.timeEnd('worker2 drawing and coping')
}

document.onreadystatechange = async () => {
  if (document.readyState === 'complete') {
    initUtils()
    await init()
  }
}
