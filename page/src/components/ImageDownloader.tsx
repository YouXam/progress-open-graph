import { Button } from "./ui/button"

import { Loader2 } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"


export default function ImageDownloader({
    title,
    disabled,
    onDownload
}: {
    title: string,
    disabled?: boolean,
    onDownload: (type: "svg" | "png", quality: 'low' | 'medium' | 'high') => Promise<void>
}) {

    const [downloading, setDownloading] = useState(false)
    const [quality, setQuality] = useState<'low' | 'medium' | 'high'>("medium")
	const [selectOpen, setSelectOpen] = useState(false)

    return (
        <div className="flex flex-col w-full">
            <div className="container flex flex-col gap-4 px-4 py-6 space-y-4 md:space-y-8 md:py-12 justify-center items-center">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-bold sm:text-5xl">
                        {title}
                    </h1>
                </div>
                <div className="gap-4 flex flex-col w-full justify-center items-center">
                    <div className="flex flex-col gap-1 sm:flex-row w-full max-w-md">
                        <Select
							onValueChange={x => setQuality(x as 'low' | 'medium' | 'high')}
							defaultValue="medium"
							onOpenChange={opened => {
								if (opened) setSelectOpen(true)
								else setTimeout(() => setSelectOpen(false), 100)
							}}
						>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Image quality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low quality</SelectItem>
                                <SelectItem value="medium">Medium quality</SelectItem>
                                <SelectItem value="high">High quality</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            disabled={downloading || disabled || selectOpen}
                            onClick={async () => {
                                setDownloading(true)
                                await onDownload("png", quality)
                                setDownloading(false)
                            }}
                        >
                            {downloading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {downloading ? "Rendering..." : "Render PNG"}
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2 min-[500px]:flex-row w-full max-w-md justify-center items-center">
                        <Button
                            variant="outline"
                            className="w-full"
                            disabled={disabled || selectOpen}
                            onClick={async () => {
                                await onDownload("svg", "high")
                            }}
                        >
                            Download SVG
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
