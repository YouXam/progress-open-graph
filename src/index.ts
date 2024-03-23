
export interface Env {
}

import { svg } from './progress'
import { Resvg, initWasm } from "@resvg/resvg-wasm"
import wasm from "@resvg/resvg-wasm/index_bg.wasm"
import { Hono } from 'hono'
import config from '../config'
import { serveStatic } from 'hono/cloudflare-workers'
import { getContentFromKVAsset } from './static'

// @ts-ignore
import manifest from '__STATIC_CONTENT_MANIFEST'


const initWasmPromise = initWasm(wasm)

export default new Hono()
	.get('/svg', async _ => new Response(await svg(), {
		headers: {
			"Content-Type": "image/svg+xml",
		},
	}))
	.get('/png', async c => {
		await initWasmPromise
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
		c.executionCtx.waitUntil(cache.put("https://local.cache.com/res.png", response.clone()))
		return response
	})
	.get('/config', c => c.json(config))
	// .use('/*', async c => {
	// 	const request = c.req.raw.clone()
	// 	const url = new URL(request.url)
	// 	return await fetch(url.href.replace(url.origin, "http://localhost:5173"), request) as unknown as Response
	// })
	.use("/", async c => {
		const index = await getContentFromKVAsset(c.env, "index.html")
		if (!index) {
			return new Response("Not found", { status: 404 })
		}
		return new HTMLRewriter()
			.on('head', new HeaderHandler())
			.on('title', new TitleHandler())
			.transform(new Response(index, {
				headers: {
					"Content-Type": "text/html",
				},
			}))

	})
	.use('/*', serveStatic({ root: './', manifest }))


class HeaderHandler {
	element(element: Element) {
		element.append(`<script>window.config = ${JSON.stringify(config)}</script>`, { html: true })
		element.append(`<meta name="description" content="${config.description}">`, { html: true })
		element.append(`<meta property="og:site_name" content="${config.title}">`, { html: true })
		element.append(`<meta property="og:title" content="${config.title}">`, { html: true })
		element.append(`<meta property="og:description" content="${config.description}">`, { html: true })
		element.append(`<meta property="og:image" content="/png">`, { html: true })
	}
}

class TitleHandler {
	element(element: Element) {
		element.setInnerContent(config.title)
	}
}
