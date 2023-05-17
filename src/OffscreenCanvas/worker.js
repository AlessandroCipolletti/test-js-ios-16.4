import {
  drawCircle,
  getRandomNumber,
  getRandomHexColor,
  getCanvasBlobAsync,
  blobToBase64Async,
  getCanvasBase64Async,
} from './utils'


self.addEventListener('message', async event => {
  const { id, canvas } = event.data

  const N = 3_000_000

  const context = canvas.getContext('2d')

  for (let i = 0; i < N; i++) {
    drawCircle(
      context,
      getRandomNumber(canvas.width),
      getRandomNumber(canvas.height),
      getRandomNumber(0.1, true) + 0,
      (getRandomNumber(50) + 10) * 2,
      0,
      getRandomHexColor(),
      0
    )
  }

  // const blob = await getCanvasBlobAsync(canvas)

  // await blobToBase64Async(blob)

  // await getCanvasBase64Async(canvas)

  // canvas.toDataURL('image/png')
  // canvas.transferToImageBitmap()

  self.postMessage({ id })
})
