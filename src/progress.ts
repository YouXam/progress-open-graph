import satori from 'satori'
import progressData from '../data'
import { template } from './template'

import extraLightFont from './NotoSansSC/NotoSansSC-ExtraLight.ttf'
import boldFont from './NotoSansSC/NotoSansSC-Bold.ttf'

export const svg = async function () {
	let progress = null
	const now = new Date()
	for (const i of progressData) {
		if (i.start <= now && i.end >= now) {
			progress = i
			break
		}
	}
	if (!progress) {
		throw new Error("No progress found")
	}

	// console.log("downloading fonts...")
	// const [
	// 	extraLight,
	// 	bold
	// ] = await Promise.all([
	// 	fetch("https://files.yxm.pl/NotoSansSC/NotoSansSC-ExtraLight.ttf"),
	// 	fetch("https://files.yxm.pl/NotoSansSC/NotoSansSC-Bold.ttf"),
	// ])
	// const [
	// 	extraLightFont,
	// 	boldFont
	// ] = await Promise.all([
	// 	extraLight.arrayBuffer(),
	// 	bold.arrayBuffer(),
	// ])
	// console.log("fonts downloaded")
	return await satori(
		template(progress.start, progress.end, progress.name),
		{
			width: 800,
			height: 400,
			fonts: [
				{
					name: 'Noto',
					data: extraLightFont,
					weight: 100,
					style: 'normal',
				},
				{
					name: 'Noto',
					weight: 400,
					data: boldFont,
					style: 'normal'
				}
			],
		},
	)
}
