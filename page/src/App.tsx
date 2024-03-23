import { useEffect, useState } from 'react'
import HeaderImage from './components/HeaderImage'
import ImageDownloader from './components/ImageDownloader'
import EventsList, { type Event } from './components/EventsList'

import Worker from './resvg_worker?worker'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"


import { Button } from './components/ui/button'
import { cn } from './lib/utils'


let resvg: Worker | null = null
let workerResolver: ((value: ArrayBuffer | PromiseLike<ArrayBuffer>) => void) | null = null

type Config = {
  title: string
  events: Event[]
  site_copyrights: string
}

declare global {
  interface Window {
    config?: Config
  }
}

let imageBuffer: ArrayBuffer | null = null
let lastQuality: 'low' | 'medium' | 'high' | null = null

function App() {
  useEffect(() => {
    resvg = new Worker()
    resvg.onmessage = e => workerResolver?.(e.data as ArrayBuffer)
    return () => {
      resvg?.terminate()
    }
  }, [])

  function callWorker(quality: 'low' | 'medium' | 'high') {
    return new Promise<ArrayBuffer>(resolve => {
      if (!resvg) {
        console.error("Worker not initialized")
        return
      }
      resvg.postMessage({ svg, quality })
      workerResolver = resolve
    })
  }

  const [config, setConfig] = useState((window?.config as Config) || {
    title: "Progress",
    events: [],
    site_copyrights: ""
  })

  const [svg, setSvg] = useState("")

  if (!window?.config) {
    useEffect(() => {
      fetch('/config')
        .then(res => res.json())
        .then(res => {
          document.title = res.title
          setConfig(res)
        })
    }, [])
  }

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  return (
    <>
      <HeaderImage onLoad={setSvg} />
      <ImageDownloader
        title={config.title}
        disabled={svg == ''}
        onDownload={async (type, quality) => {
          if (type == 'svg') {
            const a = document.createElement('a')
            a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
            a.download = 'progress.svg'
            a.click()
          } else {
            if (quality !== lastQuality) {
              imageBuffer = await callWorker(quality)
              setImage(URL.createObjectURL(new Blob([imageBuffer!], { type: 'image/png' })))
              lastQuality = quality
            }
            setOpen(true)
          }
        }}
      />
      <hr />
      <div className='max-w-3xl p-10 flex flex-col justify-center items-center mx-auto py-12'>
        <EventsList events={config.events} />
      </div>

      {window.matchMedia("(min-width: 768px)").matches ?
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Render complete
              </DialogTitle>
            </DialogHeader>
            {image ?
              <img src={image} alt="Rendered image" /> :
              <p>
                Rendering failed
              </p>
            }

            {image && <DialogFooter className={
              cn(
                "grid gap-2",
                {
                  "grid-cols-1": !globalThis.ClipboardItem,
                  "grid-cols-2": globalThis.ClipboardItem
                }
              )
            }>
              {globalThis.ClipboardItem && <Button
                onClick={async () => {
                  const blob = new Blob([imageBuffer!], { type: 'image/png' })
                  navigator.clipboard.write([
                    new ClipboardItem({
                      'image/png': blob
                    })
                  ]);
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1000)
                }}
                variant="secondary"
              >
                {copied ? "Copied" : "Copy"}
              </Button>}
              <Button
                onClick={() => {
                  const a = document.createElement('a')
                  a.href = image!
                  a.download = 'progress.png'
                  a.click()
                }}
              >
                Download
              </Button>
            </DialogFooter>}

          </DialogContent>
        </Dialog> :
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>
                Render complete
              </DrawerTitle>
            </DrawerHeader>
            {image ?
              <img src={image} alt="Rendered image" /> :
              <p>
                Rendering failed
              </p>
            }

            {image && <DrawerFooter className={
              cn(
                "grid gap-2",
                {
                  "grid-cols-1": !globalThis.ClipboardItem,
                  "grid-cols-2": globalThis.ClipboardItem
                }
              )
            }>
              {globalThis.ClipboardItem && <Button
                onClick={async () => {
                  const blob = new Blob([imageBuffer!], { type: 'image/png' })
                  navigator.clipboard.write([
                    new ClipboardItem({
                      'image/png': blob
                    })
                  ]);
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1000)
                }}
                variant="secondary"
              >
                {copied ? "Copied" : "Copy"}
              </Button>}
              <Button
                onClick={() => {
                  const a = document.createElement('a')
                  a.href = image!
                  a.download = 'progress.png'
                  a.click()
                }}
              >
                Download
              </Button>
            </DrawerFooter>}
          </DrawerContent>
        </Drawer>
      }

      <hr />

      <footer
        className='max-w-3xl p-10 flex flex-col justify-center items-center mx-auto py-12'
      >
        <p>{new Date().getFullYear()} {config.site_copyrights}</p>
        <a
          href="https://github.com/YouXam/progress-open-graph"
          target="_blank"
          rel="noopener noreferrer"
          className='text-blue-500 hover:underline'
        >
          GitHub
        </a>
      </footer>
    </>
  )
}

export default App
