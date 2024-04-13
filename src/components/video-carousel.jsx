import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

import { ScrollTrigger } from "gsap/all"
gsap.registerPlugin(ScrollTrigger)

import { hightlightsSlides } from "../constant"
import { pauseImg, playImg, replayImg } from "../utils"

export default function VideoCarousel() {
    const videoRef = useRef([])
    const videoSpanRef = useRef([])
    const videoDivRef = useRef([])

    // video and indicator
    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    })

    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video

    const [loadedData, setLoadedData] = useState([])

    useGSAP(() => {
        // slider animation to move the video out of the screen and bring the next video in
        gsap.to("#slider", {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut", // show visualizer https://gsap.com/docs/v3/Eases
        })

        // video animation to play the video when it is in the view
        gsap.to("#video", {
            scrollTrigger: { trigger: "#video", toggleActions: "restart none none none" },
            onComplete: () => {
                setVideo((prevState) => ({ ...prevState, startPlay: true, isPlaying: true }))
            },
        })
    }, [isEnd, videoId])

    useEffect(() => {
        let currentProgress = 0
        let span = videoSpanRef.current

        if (span[videoId]) {
            // animation to move the indicator
            let anim = gsap.to(span[videoId], {
                // when the video is ended, replace the progress bar with the indicator and change the background color
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: "12px",
                        })
                        gsap.to(span[videoId], {
                            backgroundColor: "#afafaf",
                        })
                    }
                },
                onUpdate: () => {
                    // get the progress of the video
                    const progress = Math.ceil(anim.progress() * 100)

                    if (progress != currentProgress) {
                        currentProgress = progress

                        // set the width of the progress bar
                        gsap.to(videoDivRef.current[videoId], {
                            width:
                                window.innerWidth < 760
                                    ? "10vw" // mobile
                                    : window.innerWidth < 1200
                                    ? "10vw" // tablet
                                    : "4vw", // laptop
                        })

                        // set the background color of the progress bar
                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: "white",
                        })
                    }
                },
            })

            if (videoId == 0) anim.restart()

            // update the progress bar
            const animUpdate = function () {
                anim.progress(
                    videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration
                )
            }

            if (isPlaying) {
                // ticker to update the progress bar
                gsap.ticker.add(animUpdate)
            } else {
                // remove the ticker when the video is paused (progress bar is stopped)
                gsap.ticker.remove(animUpdate)
            }
        }
    }, [videoId, startPlay, isPlaying])

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) videoRef.current[videoId].pause()
            else startPlay && videoRef.current[videoId].play()
        }
    }, [startPlay, videoId, isPlaying, loadedData])

    // vd id is the id for every video until id becomes number 3
    function handleProcess(type, i) {
        switch (type) {
            case "video-end":
                setVideo((prevState) => ({ ...prevState, isEnd: true, videoId: i + 1 }))
                break
            case "video-last":
                setVideo((prevState) => ({ ...prevState, isLastVideo: true }))
                break
            case "video-reset":
                setVideo((prevState) => ({ ...prevState, videoId: 0, isLastVideo: false }))
                break
            case "pause":
                setVideo((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }))
                break
            case "play":
                setVideo((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }))
                break
            default:
                return video
        }
    }

    function handleLoadedMetaData(_index, event) {
        return setLoadedData((prevState) => [...prevState, event])
    }

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="pr-10 sm:pr-20">
                        <div className="video-carousel_container">
                            <div className="w-full h-full overflow-hidden bg-black flex-center rounded-3xl">
                                <video
                                    id="video"
                                    playsInline={true}
                                    className={`
                                    ${list.id === 2 && "translate-x-44"} pointer-events-none`}
                                    preload="auto"
                                    muted
                                    ref={(element) => (videoRef.current[i] = element)}
                                    onPlay={() =>
                                        setVideo(function (prevState) {
                                            return { ...prevState, isPlaying: true }
                                        })
                                    }
                                    onEnded={() =>
                                        i !== 3
                                            ? handleProcess("video-end", i)
                                            : handleProcess("video-last")
                                    }
                                    onLoadedMetadata={function (event) {
                                        return handleLoadedMetaData(i, event)
                                    }}>
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>

                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text, i) => (
                                    <p key={i} className="text-xl font-medium md:text-2xl">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative mt-10 flex-center">
                <div className="py-5 bg-gray-300 rounded-full flex-center px-7 backdrop-blur">
                    {videoRef.current.map((_, i) => (
                        <span
                            key={i}
                            className="relative w-3 h-3 mx-2 bg-gray-200 rounded-full cursor-pointer"
                            ref={(element) => (videoDivRef.current[i] = element)}>
                            <span
                                className="absolute w-full h-full rounded-full"
                                ref={(element) => (videoSpanRef.current[i] = element)}
                            />
                        </span>
                    ))}
                </div>

                <button className="control-btn">
                    <img
                        src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                        onClick={
                            isLastVideo
                                ? () => handleProcess("video-reset")
                                : !isPlaying
                                ? () => handleProcess("play")
                                : () => handleProcess("pause")
                        }
                    />
                </button>
            </div>
        </>
    )
}
