import {
  drawCircle,
  getRandomNumber,
  getRandomHexColor,
  // getCanvasBlobAsync,
  // blobToBase64Async,
  // getCanvasBase64Async,
} from '../utils/utils'


self.addEventListener('message', async event => {
  const { id, width, height, N } = event.data

  const canvas = new OffscreenCanvas(width, height)

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

  const drawing = canvas.transferToImageBitmap()
  drawing.width = canvas.width
  drawing.height = canvas.height
  drawing.naturalWidth = canvas.width
  drawing.naturalHeight = canvas.height

  self.postMessage({ id, drawing })
})
