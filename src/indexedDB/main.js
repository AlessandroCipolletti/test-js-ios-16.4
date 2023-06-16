import {
  initUtils,
  addObjectInsideIndexDB,
  delay,
  round,
  getOneFullCanvas,
  getCanvasBase64Async,
} from '../utils/utils'


const init = async () => {
  const N = 15_000
  const oneMB = 1024 * 1024

  console.time(`TEST 1 - drawing ${N} circles on a canvas`)
  const canvas = getOneFullCanvas(window.innerWidth, window.innerHeight, N)
  console.timeEnd(`TEST 1 - drawing ${N} circles on a canvas`)
  document.body.appendChild(canvas)

  await delay(1000)

  console.time('TEST 2 - get base64')
  const base64 = await getCanvasBase64Async(canvas)
  console.log(`${round(base64.length / oneMB, 1)} mb`)
  console.timeEnd('TEST 2 - get base64')

  await delay(1000)

  console.time('TEST 3 - creo grande oggetto')
  const obj = JSON.parse(JSON.stringify({
    // a: `${base64}`, b: `${base64}`,
    // c: `${base64}`, d: `${base64}`,
    // e: `${base64}`, f: `${base64}`,
    // g: `${base64}`, h: `${base64}`,
    // i: `${base64}`, j: `${base64}`,
    // k: `${base64}`, l: `${base64}`,
    // m: `${base64}`, n: `${base64}`,
    // o: `${base64}`, p: `${base64}`,
    // q: `${base64}`, r: `${base64}`,
    // s: `${base64}`, t: `${base64}`,
    // u: `${base64}`, v: `${base64}`,
    // w: `${base64}`, x: `${base64}`,
    // y: `${base64}`, z: `${base64}`,

    // a1: `${base64}`, b1: `${base64}`,
    // c1: `${base64}`, d1: `${base64}`,
    // e1: `${base64}`, f1: `${base64}`,
    // g1: `${base64}`, h1: `${base64}`,
    // i1: `${base64}`, j1: `${base64}`,
    // k1: `${base64}`, l1: `${base64}`,
    // m1: `${base64}`, n1: `${base64}`,
    // o1: `${base64}`, p1: `${base64}`,
    // q1: `${base64}`, r1: `${base64}`,
    // s1: `${base64}`, t1: `${base64}`,
    // u1: `${base64}`, v1: `${base64}`,
    // w1: `${base64}`, x1: `${base64}`,
    // y1: `${base64}`, z1: `${base64}`,
  }))
  console.timeEnd('TEST 3 - creo grande oggetto')

  await delay(1000)

  console.time('TEST 4 - obj stringify')
  const objStr = JSON.stringify(obj)
  console.log(`${round(objStr.length / oneMB, 1)} mb`)
  console.timeEnd('TEST 4 - obj stringify')

  await delay(1000)

  console.time('TEST 5 - insert big object inside indexedDB')
  await addObjectInsideIndexDB(obj)
  console.timeEnd('TEST 5 - insert big object inside indexedDB')

  await delay(1000)

  console.time('TEST 6 - insert big string inside indexedDB')
  await addObjectInsideIndexDB(objStr)
  console.timeEnd('TEST 6 - insert big string inside indexedDB')
}

document.onreadystatechange = async () => {
  if (document.readyState === 'complete') {
    await initUtils()
    await init()
  }
}
