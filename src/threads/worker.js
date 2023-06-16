import {
  delay,
  drawCircle,
  getRandomNumber,
  getRandomHexColor,
} from '../utils/utils'


self.addEventListener('message', async event => {
  const { id, canvas } = event.data

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
    await delay(5)
  }

  // self.postMessage({ id })
})
