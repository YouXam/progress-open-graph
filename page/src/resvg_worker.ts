import * as resvg from '@resvg/resvg-wasm'

const wasmPath = new URL('@resvg/resvg-wasm/index_bg.wasm', import.meta.url)

const initPromise = (async function() {
    const res = await fetch(wasmPath)
    await resvg.initWasm(res)
})()

self.onmessage = async (e) => {
    await initPromise
    const { svg, quality } = e.data
    const width = quality === 'low' ? 1600 : quality === 'medium' ? 4000 : 8000
    const renderer = new resvg.Resvg(svg, {
        fitTo: {
            mode: 'width',
            value: width,
        },
    })
    const image = renderer.render()
    self.postMessage(image.asPng())
    image.free()
}