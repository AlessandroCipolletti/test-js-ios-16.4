import { v4 as uuidv4 } from 'uuid'
const MATH = Math
const PI = MATH.PI
let tempCanvas
let tempContext

const MAX_THUMBNAIL_SIZE = 400


export const initUtils = () => {
  tempCanvas = document.createElement('canvas')
  tempContext = tempCanvas.getContext('2d')
}

export const getOneFullCanvas = (width, height, N = 15_000) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  for (let i = 0; i < N; i++) {
    drawCircle(
      context,
      getRandomNumber(canvas.width),
      getRandomNumber(canvas.height),
      getRandomNumber(0.1, true) + 0,
      (getRandomNumber(100) + 50),
      0,
      getRandomHexColor(),
      0
    )
  }
  return canvas
}

export const round = (n, d = 0) => {
  const m = d ? MATH.pow(10, d) : 1
  return MATH.round(n * m) / m
}
export const getRandomNumber = (n, float = false) => float ? MATH.random() * n : MATH.random() * n | 0
export const getRandomHexColor = () => {
  const a = getRandomNumber(256)
  const b = getRandomNumber(256)
  const c = getRandomNumber(256)
  return `#${((256+a<<8|b)<<8|c).toString(16).slice(1)}`
}
export const drawCircle = (destinationContext, x, y, alpha, size, rotation, color, blur = 0) => {
  destinationContext.beginPath()
  destinationContext.fillStyle = color
  destinationContext.globalAlpha = alpha
  destinationContext.lineJoin = 'round'
  destinationContext.lineCap = 'round'
  destinationContext.lastDrawCoordX = x
  destinationContext.lastDrawCoordY = y

  if (blur) {
    destinationContext.shadowColor = color
    destinationContext.shadowBlur = blur
  } else {
    destinationContext.shadowColor = ''
    destinationContext.shadowBlur = 0
  }

  destinationContext.arc(x, y, size / 2, 0, 2 * PI, true)
  destinationContext.fill()
}
export const getCanvasBase64Async = async(dom) => {
  if (dom.tagName?.toLowerCase() !== 'canvas' && !(dom instanceof OffscreenCanvas)) {
    dom = imgToCanvas(dom)
  }
  return blobToBase64Async(await getCanvasBlobAsync(dom))
}
export const imgToCanvas = (img) => {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth || img.width
  canvas.height = img.naturalHeight || img.height
  canvas.getContext('2d').drawImage(img, 0, 0)
  return canvas
}
export const blobToBase64Async = (blob) => {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
      reader = reader.onload = undefined
    }
    reader.readAsDataURL(blob)
  })
}
export const getCanvasBlobAsync = (canvas) => {
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob()
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(resolve)
  })
}
export const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))
export const waitWorkerMessage = (worker, id) => {
  return new Promise((resolve, reject) => {
    const onLoaded = (event) => {
      const { id: idMsg } = event.data
      if (id === idMsg) {
        worker.removeEventListener('message', onLoaded)
        resolve(event.data)
      }
    }
    worker.addEventListener('message', onLoaded)
  })
}

export const cropImageWithMargin = (image, l, t, r, b, margin = 0.1) => {
  const imageWidth = (image.naturalWidth || image.width)
  const imageHeight = (image.naturalHeight || image.height)
  let w = round(r - l, 0)
  let h = round(b - t, 0)
  const x = round(Math.max(l - w * (margin / 2), 0), 0)
  const y = round(Math.max(t - h * (margin / 2), 0), 0)
  w = round(Math.min(w * (1 + margin), imageWidth - x), 0)
  h = round(Math.min(h * (1 + margin), imageHeight - y), 0)
  return [cropImage(image, x, y, w, h), x, y, w, h]
}

export const cropImage = (image, x, y, width, height) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (Number.isFinite(width) && Number.isFinite(height)) {
    canvas.width = width
    canvas.height = height
    context.drawImage(image, x, y, width, height, 0, 0, width, height)
  }
  return canvas
}

export const resizeImageAndGetBase64 = (image, maxSize = MAX_THUMBNAIL_SIZE) => {
  const imgRatio = (image.naturalWidth || image.width) / (image.naturalHeight || image.height)
  if (imgRatio > 1) {
    tempCanvas.width = maxSize
    tempCanvas.height = maxSize / imgRatio
  } else {
    tempCanvas.height = maxSize
    tempCanvas.width = maxSize * imgRatio
  }
  tempContext.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height)
  return tempCanvas.toDataURL('image/png')
}

export const getCanvasColorAtPx = (destinationContext, x, y, canvasWidth, canvasHeight) => {
  const canvasData = destinationContext.getImageData(0, 0, canvasWidth, canvasHeight)
  const pxIndex = (MATH.floor(x) + MATH.floor(y) * canvasWidth) * 4
  const targetColor = {
    r: canvasData.data[pxIndex + 0],
    g: canvasData.data[pxIndex + 1],
    b: canvasData.data[pxIndex + 2],
    a: canvasData.data[pxIndex + 3],
  }
  return targetColor
}

const coordsWorker = new Worker(
  new URL('./canvasContentCoords.js', import.meta.url),
  { type: 'module' }
)
export const findImageContentCoords = async(dom, pxPrecision = 1, alphaTollerance = 0.01) => {
  alphaTollerance = round(255 * alphaTollerance, 0)
  pxPrecision = round(pxPrecision, 1)

  const width = dom.width
  const height = dom.height
  const data = dom.context.getImageData(0, 0, width, height).data

  const id = uuidv4()
  coordsWorker.postMessage({ id, data, width, height, pxPrecision, alphaTollerance })
  const res = await waitWorkerMessage(coordsWorker, id)
  delete res.id
  return res
}
