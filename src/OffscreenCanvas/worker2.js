import {
  getCanvasBase64Async,
} from './utils'


self.addEventListener('message', async event => {
  const { id, bitmap } = event.data

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  canvas.getContext('2d').drawImage(bitmap, 0, 0)

  // canvas.toDataURL('image/png')
  await getCanvasBase64Async(canvas)

  self.postMessage({ id })
})
