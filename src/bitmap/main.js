import {
  initUtils,
  round,
  getOneFullCanvas,
  getCanvasBase64Async,
  delay,
} from '../utils/utils'


const init = async () => {
  const N = 15_000
  const oneMB = 1024 * 1024

  // setInterval(() => {
  //   console.log(`Memory used: ${round(performance.memory.usedJSHeapSize / oneMB, 1)} MB`)
  // }, 3000)

  await delay(1000)

  console.time(`TEST 1 - drawing ${N} circles on a canvas`)
  const canvas = getOneFullCanvas(window.innerWidth, window.innerHeight, N)
  console.timeEnd(`TEST 1 - drawing ${N} circles on a canvas`)
  document.body.appendChild(canvas)

  await delay(1000)

  console.time('TEST 2 - create 50 bitmaps from canvas one after the other')
  let bitmaps = []
  for (let i = 0; i < 50; i++) {
    bitmaps.push(await createImageBitmap(canvas))
  }
  console.timeEnd('TEST 2 - create 50 bitmaps from canvas one after the other')
  bitmaps.forEach(bitmap => bitmap.close())
  bitmaps = []

  await delay(1000)

  console.time('TEST 3 - create 50 bitmaps from canvas in parallel')
  bitmaps = await Promise.all(
    Array.from({ length: 50 }).map(() => createImageBitmap(canvas))
  )
  console.timeEnd('TEST 3 - create 50 bitmaps from canvas in parallel')
  bitmaps.forEach(bitmap => bitmap.close())
  bitmaps = []

  await delay(1000)

  console.time('TEST 4 - get 5 base64 one after the other')
  for (let i = 0; i < 5; i++) {
    await getCanvasBase64Async(canvas)
  }
  console.timeEnd('TEST 4 - get 5 base64 one after the other')

  await delay(1000)

  console.time('TEST 5 - get 5 base64 in parallel')
  await Promise.all(
    Array.from({ length: 5 }).map(() => getCanvasBase64Async(canvas))
  )
  console.timeEnd('TEST 5 - get 5 base64 in parallel')

  await delay(1000)

  let canvases = []
  for (let i = 0; i < 5; i++) {
    canvases.push(getOneFullCanvas(window.innerWidth, window.innerHeight))
  }
  console.time('TEST 6 - get 5 base64 one after the other from 5 canvases')
  for (let i = 0; i < 5; i++) {
    await getCanvasBase64Async(canvases[i])
  }
  console.timeEnd('TEST 6 - get 5 base64 one after the other from 5 canvases')
  // canvases = []

  await delay(1000)

  // canvases = []
  // for (let i = 0; i < 5; i++) {
  //   canvases.push(getOneFullCanvas(window.innerWidth, window.innerHeight))
  // }
  console.time('TEST 7 - get 5 base64 in parallel from 5 canvases')
  await Promise.all(
    canvases.map(canvas => getCanvasBase64Async(canvas))
  )
  console.timeEnd('TEST 7 - get 5 base64 in parallel from 5 canvases')
  // canvases = []

  await delay(1000)

  canvases = []
  for (let i = 0; i < 20; i++) {
    canvases.push(getOneFullCanvas(window.innerWidth, window.innerHeight))
  }
  console.time('TEST 8 - create 20 bitmaps one after the other from 20 canvases')
  for (let i = 0; i < 20; i++) {
    bitmaps.push(await createImageBitmap(canvases[i]))
  }
  console.timeEnd('TEST 8 - create 20 bitmaps one after the other from 20 canvases')
  bitmaps.forEach(bitmap => bitmap.close())
  bitmaps = []

  await delay(1000)

  canvases = []
  for (let i = 0; i < 20; i++) {
    canvases.push(getOneFullCanvas(window.innerWidth, window.innerHeight))
  }
  console.time('TEST 9 - create 20 bitmaps in parallel from 20 canvases')
  bitmaps = await Promise.all(
    Array.from(canvases.map((canvas) => createImageBitmap(canvas)))
  )
  console.timeEnd('TEST 9 - create 20 bitmaps in parallel from 20 canvases')
  bitmaps.forEach(bitmap => bitmap.close())
  bitmaps = []


  // const objects = []
  // console.time('TEST 10 - get base64 from 20 bitmaps one after the other')
  // for (let i = 0; i < 20; i++) {
  //   objects.push(
  //     await getCanvasBase64Async(bitmaps[i])
  //   )
  // }
  // console.timeEnd('TEST 10 - get base64 from 20 bitmaps one after the other')
  // console.log(objects.length, round(objects.reduce((tot, base64) => tot + base64.length, 0) / oneMB, 1))


  // console.time('TEST 11 - get base64 from 10 bitmaps in parallel')
  // objects.push(...(await Promise.all(
  //   bitmaps.map(bitmap => getCanvasBase64Async(bitmap))
  // )))
  // console.timeEnd('TEST 11 - get base64 from 10 bitmaps in parallel')
  // console.log(objects.length, round(objects.reduce((tot, base64) => tot + base64.length, 0) / oneMB, 1))

  // // window.objects = objects
}

document.onreadystatechange = async () => {
  if (document.readyState === 'complete') {
    initUtils()
    await init()
  }
}
