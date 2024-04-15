import { useEffect, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import { heroVideo, smallHeroVideo } from "../../utils"

const Hero = () => {
    const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)

    const handleVideoSrcSet = () => {
        if (window.innerWidth < 760) setVideoSrc(smallHeroVideo)
        else setVideoSrc(heroVideo)
    }

    useEffect(() => {
        window.addEventListener("resize", handleVideoSrcSet)

        return () => window.removeEventListener("resize", handleVideoSrcSet)
    }, [])

    useGSAP(() => {
        gsap.to("#hero", { opacity: 1, delay: 2 })
        gsap.to("#cta", { opacity: 1, y: -50, delay: 2 })
    }, [])

    return (
        <section className="relative w-full bg-black nav-height">
            <div className="flex-col w-full h-5/6 flex-center">
                <p id="hero" className="hero-title">
                    iPhone 15 Pro
                </p>
                <div className="w-9/12 md:w-10/12">
                    <video
                        className="pointer-events-none"
                        autoPlay
                        loop
                        muted
                        playsInline={true}
                        key={videoSrc}>
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                </div>
            </div>

            <div id="cta" className="flex flex-col items-center translate-y-20 opacity-0">
                <a href="#highlights" className="btn">
                    Buy
                </a>
                <p className="text-xl font-normal">From $199/month or $999</p>
            </div>
        </section>
    )
}

export default Hero
