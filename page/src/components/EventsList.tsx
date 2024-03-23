import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import Percent from "./Percent"

export type Event = {
    name: string
    description: string
    start: string
    end: string
}

function toUTC8DateString(date: string) {
	return new Date(date).toLocaleDateString('zh-cn', {
		timeZone: "Asia/Shanghai",
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
}

export default function EventsList({
    events
}: { events: Event[] }) {
    const now = new Date()

    return (<div className="w-full flex flex-col gap-4">

        {events
            .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
            .map((event, id) => (<Card key={id} className="relative">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl">{event.name}</CardTitle>
                    <CardDescription className="text-lg flex flex-col">
                        <span>{toUTC8DateString(event.start)} - {toUTC8DateString(event.end)}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="z-10 flex">{event.description}</div>
                    <div className="space-x-2 z-10">
                        {new Date(event.end) < now && (<Badge variant={"outline"}>Finished</Badge>)}
                        {new Date(event.start) < now && new Date(event.end) > now && (<Badge>
                            <Percent
                                start={new Date(event.start)}
                                end={new Date(event.end)}
                            />
                        </Badge>)}
                        {new Date(event.start) > now && (<Badge variant={"secondary"}>Upcoming</Badge>)}
                    </div>
                </CardContent>
            </Card>))}
    </div>)
}