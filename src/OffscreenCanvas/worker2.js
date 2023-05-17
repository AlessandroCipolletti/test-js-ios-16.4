import {
  drawCircle,
  getRandomNumber,
  getRandomHexColor,
} from './utils'


self.addEventListener('message', async event => {
  const { id, width, height } = event.data

  const canvas = new OffscreenCanvas(width, height)
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

  const drawing = canvas.transferToImageBitmap()

  self.postMessage({ id, drawing })
})
