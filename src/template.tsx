import * as React from 'react'

function toUTC8DateString(date: Date) {
	return date.toLocaleDateString('zh-cn', {
		timeZone: "Asia/Shanghai",
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
}

function toUTC8String(date: Date) {
	return date.toLocaleString('zh-cn', {
		timeZone: "Asia/Shanghai",
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})
}

export const template = (start: Date, end: Date, title: string, copyright: string) => {
	const p = ((new Date()).getTime() - start.getTime()) /
		(end.getTime() - start.getTime()) * 100;
	const maxt = 85, mint = 20;
	const pr = maxt - mint;
	const px = pr * p / 100 + mint;
	return <div
		style={{
			display: 'flex',
			height: '100%',
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column',
			backgroundImage: 'linear-gradient(to bottom, rgb(255,240,219), rgb(255, 241, 241) 30%, white 100%)',
			fontSize: 60,
			letterSpacing: -2,
			fontWeight: 700,
			textAlign: 'center',
		}}
		lang="zh-cn"
	>
		<div
			style={{
				backgroundImage: `linear-gradient(180deg, rgb(156, 230, 253), rgb(156, 230, 253)  ${100 - px - 15}%, rgb(254, 220, 98) ${100 - px + 15}%, rgb(254, 220, 98))`,
				backgroundClip: 'text',
				color: 'transparent',
				fontSize: "4.6em",
				position: "absolute",
				bottom: "-60px",
				right: "-10px",
				display: "flex",
				letterSpacing: "-20"
			}}
		>
			{p == 100 ? p : p.toFixed(1)}
			<span style={{ fontSize: "0.5em", marginTop: "140px", marginRight: "40px", marginLeft: "20px" }}>%</span>
		</div>
		<div
			style={{
				backgroundImage: 'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
				backgroundClip: 'text',
				color: 'transparent',
				left: 10,
				top: 10,
				position: "absolute"
			}}
		>
			{title}
		</div>
		<div
			style={{
				backgroundImage: 'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
				backgroundClip: 'text',
				color: 'transparent',
				fontSize: "0.6em",
				marginTop: "25px",
				position: "absolute",
				left: 10,
				top: 60,
				fontWeight: 100,
				display: 'flex'
			}}
		>
			{toUTC8DateString(start)} - {toUTC8DateString(end)}
		</div>

		<div
			style={{
				position: "absolute",
				height: "30px",
				width: `${p}%`,
				backgroundColor: "#ff0078",
				bottom: 0,
				left: 0,
			}}>
		</div>
		<div
			style={{
				position: "absolute",
				height: "30px",
				width: `${100 - p}%`,
				backgroundColor: "rgb(254, 220, 98)",
				bottom: 0,
				right: 0,
			}}>
		</div>

		<div
			style={{
				color: 'black',
				fontSize: "1rem",
				position: "absolute",
				left: 10,
				top: 135,
				fontWeight: 100,
				display: 'flex',
				letterSpacing: 0
			}}
		>
			{toUTC8String(new Date())}
		</div>
		<div
			style={{
				color: '#999',
				fontSize: "0.7rem",
				position: "absolute",
				left: 10,
				top: 160,
				fontWeight: 100,
				display: 'flex',
				letterSpacing: 0
			}}
		>
			{copyright}
		</div>
	</div>
}
