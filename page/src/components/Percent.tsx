import { useState } from 'react'

export default function Percent({ start, end, className }: {
    start: Date
    end: Date
    className?: string
}) {
    const [now, setNow] = useState(new Date())
    setTimeout(() => setNow(new Date()), 10)
    return (<span className={(className || '')} style={{ fontFamily: "monospace" }}>
        {((now.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100).toFixed(6)}%
    </span>)
}