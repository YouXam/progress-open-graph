
export interface Env {
}

import { svg } from './progress'
import { Resvg, initWasm } from "@resvg/resvg-wasm"

import wasm from "@resvg/resvg-wasm/index_bg.wasm"

await initWasm(wasm)

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url)

		switch (url.pathname) {
			case "/svg":
				return new Response(await svg(), {
					headers: {
						"Content-Type": "image/svg+xml",
					},
				})
			case "/png":
				const cache = caches.default
				const cached = await cache.match("https://local.cache.com/res.png")

				if (cached) {
					const lastModified: string | null = cached.headers.get("Last-Modified")
					if (lastModified) {
						const lastModifiedTime = new Date(lastModified)
						const currentTime = new Date()
						if (lastModifiedTime.getFullYear() === currentTime.getFullYear() &&
							lastModifiedTime.getMonth() === currentTime.getMonth() &&
							lastModifiedTime.getDate() === currentTime.getDate()) {
							console.log("cache hit")
							return cached
						} else {
							console.log("cache expired")
						}
					}
				} else {
					console.log("cache miss")
				}

				const svgRes = await svg()

				const renderer = new Resvg(svgRes, {
					fitTo: {
						mode: 'width',
						value: 4000,
					},
				})
				const image = renderer.render()
				const pngBuffer = image.asPng()
				const response = new Response(pngBuffer, {
					headers: {
						"Content-Type": "image/png",
					},
				})
				response.headers.set("Cache-Control", "public, max-age=86400")
				response.headers.set("Last-Modified", new Date().toUTCString())
				ctx.waitUntil(cache.put("https://local.cache.com/res.png", response.clone()))
				return response
			default:
				return new Response("not found", { status: 404 })
		}
	},
};
