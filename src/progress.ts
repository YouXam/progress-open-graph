import satori from 'satori'
import config from '../config'
import { template } from './template'


export const svg = async function () {
	let progress = null
	const now = new Date()
	for (const i of config.events) {
		if (i.start <= now && i.end >= now) {
			progress = i
			break
		}
	}
	if (!progress) {
		throw new Error("No progress found")
	}
	const fonts: Record<string, ArrayBuffer> = {}

	console.log("downloading fonts...")
	const [
		extraLight,
		bold
	] = await Promise.all([
		fetch("https://cdn.jsdelivr.net/gh/youxam/progress-open-graph/src/NotoSansSC/NotoSansSC-ExtraLight.ttf"),
		fetch("https://cdn.jsdelivr.net/gh/youxam/progress-open-graph/src/NotoSansSC/NotoSansSC-Bold.ttf"),
	])
	const [
		extraLightFont,
		boldFont
	] = await Promise.all([
		extraLight.arrayBuffer(),
		bold.arrayBuffer(),
	])
	console.log("fonts downloaded")
	fonts.extraLight = extraLightFont
	fonts.bold = boldFont
	// fonts.extraLight = (await import("./NotoSansSC/NotoSansSC-ExtraLight.ttf")).default
	// fonts.bold = (await import("./NotoSansSC/NotoSansSC-Bold.ttf")).default

	return await satori(
		template(progress.start, progress.end, progress.name, config.image_copyrights),
		{
			width: 800,
			height: 400,
			fonts: [
				{
					name: 'Noto',
					data: fonts.extraLight,
					weight: 100,
					style: 'normal',
				},
				{
					name: 'Noto',
					weight: 400,
					data: fonts.bold,
					style: 'normal'
				}
			],
		},
	)
}
