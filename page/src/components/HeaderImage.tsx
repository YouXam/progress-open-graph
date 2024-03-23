import { useEffect, useState } from 'react'


function HeaderImage({
  onLoad
}: {
  onLoad?: (svg: string) => any
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [svg, setSvg] = useState("")

  const [showArrow, setShowArrow] = useState(window.innerWidth / 2 - window.scrollY >= window.innerHeight * 0.8)

  function onScroll() {
    setShowArrow(window.innerWidth / 2 - window.scrollY >= window.innerHeight * 0.8)
  }

  useEffect(() => {
    fetch("/svg")
      .then(res => res.text())
      .then(res => {
        const parser = new DOMParser()
        const svg = parser.parseFromString(res, "image/svg+xml")
        const img = svg.querySelector("svg")
        img?.setAttribute("width", "100%")
        img?.setAttribute("height", "100%")
        setSvg(svg.documentElement.outerHTML)
        setIsLoading(false)
        onLoad?.(res)
      })
    window.addEventListener("scroll", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      {isLoading ?
        <div className="aspect-[2/1] w-full relative bg-slate-100 flex justify-center items-center z-50">
          <svg className="w-20 h-20" width="24" height="24" stroke="#000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g className="spinner_loader">
              <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
            </g>
          </svg>
        </div> :
        <div className="aspect-[2/1] w-full relative max-h-[100vh]">
          <div className="absolute inset-0 z-0" dangerouslySetInnerHTML={{ __html: svg }} />
          {showArrow && !isLoading && <div className="absolute bottom-2 left-[calc(50%-1.25rem)] z-10" onClick={() => window.scrollTo({ top: window.innerWidth / 2, behavior: 'smooth' })}>
            <div className="animate-bounce bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>}
        </div>}
      
    </>
  )
}

export default HeaderImage
