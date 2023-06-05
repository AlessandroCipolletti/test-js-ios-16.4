import {
  initUtils,
  round,
  getOneFullCanvas,
  getCanvasBase64Async,
} from '../utils/utils'


const init = async () => {
  console.log(`Memory used: ${round(performance.memory.usedJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.totalJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.jsHeapSizeLimit / (1024 * 1024), 1)}MB`)
  const canvas = getOneFullCanvas(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio * 3)
  console.log(`Canvas Px: ${canvas.width * canvas.height}`)
  console.log(`Memory used: ${round(performance.memory.usedJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.totalJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.jsHeapSizeLimit / (1024 * 1024), 1)}MB`)

  let base64 = await getCanvasBase64Async(canvas)
  console.log(`String: ${round(base64.length / (1024 * 1024), 1)}`)
  console.log(`Memory used: ${round(performance.memory.usedJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.totalJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.jsHeapSizeLimit / (1024 * 1024), 1)}MB`)

  base64 = `${base64}${base64}`
  console.log(`String: ${round(base64.length / (1024 * 1024), 1)}`)
  console.log(`Memory used: ${round(performance.memory.usedJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.totalJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.jsHeapSizeLimit / (1024 * 1024), 1)}MB`)

  base64 = `${base64}${base64}`
  console.log(`String: ${round(base64.length / (1024 * 1024), 1)}`)
  console.log(`Memory used: ${round(performance.memory.usedJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.totalJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.jsHeapSizeLimit / (1024 * 1024), 1)}MB`)

  base64 = `${base64}${base64}`
  console.log(`String: ${round(base64.length / (1024 * 1024), 1)}`)
  console.log(`Memory used: ${round(performance.memory.usedJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.totalJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.jsHeapSizeLimit / (1024 * 1024), 1)}MB`)

  base64 = `${base64}${base64}`
  console.log(`String: ${round(base64.length / (1024 * 1024), 1)}`)
  console.log(`Memory used: ${round(performance.memory.usedJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.totalJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.jsHeapSizeLimit / (1024 * 1024), 1)}MB`)

  const canvases = []
  for (let i = 0; i < 10; i++) {
    canvases.push(getOneFullCanvas(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio * 3))
  }
  console.log(`Memory used: ${round(performance.memory.usedJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.totalJSHeapSize / (1024 * 1024), 1)}MB - ${round(performance.memory.jsHeapSizeLimit / (1024 * 1024), 1)}MB`)


}

document.onreadystatechange = async () => {
  if (document.readyState === 'complete') {
    initUtils()
    await init()
  }
}
