const MATH = Math
const PI = MATH.PI
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
  if (dom.tagName.toLowerCase() !== 'canvas') {
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
