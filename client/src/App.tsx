import React, { useEffect, useState } from "react"
import image from "./assets/map.svg"
import styled from "styled-components"
import GraphicsContainer from "./components/GraphicsContainer"
import Timeline from "./components/molecules/Timeline"
let running: "back" | "forward" | null = null
let isScrolling: any
let invalidated = false

const App = () => {
    const [data, setData] = useState({ index: 0, wheel: 0 })
    useEffect(() => {
        fetch("/getClusters", {
            method: "POST"
        })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error(err))
    }, [])

    function onEndScroll() {
        const oldRunning = running
        running = null
        setData({
            index: Math.max(
                0,
                oldRunning == "back" ? data.index + 1 : data.index - 1
            ),
            wheel: 0
        })
    }

    useEffect(() => {
        const wheelListener = (evt: WheelEvent) => {
            evt.preventDefault()
            window.clearTimeout(isScrolling)

            // Set a timeout to run after scrolling ends
            isScrolling = setTimeout(function() {
                if (!invalidated) onEndScroll()
                invalidated = false
            }, 66)
            if (!running && Math.abs(evt.deltaY) > 20) {
                running = evt.deltaY > 0 ? "back" : "forward"
            } else if (Math.abs(evt.deltaY) > 20) {
                setData({ ...data, wheel: data.wheel + evt.deltaY / 40 })
            } else if (running) {
                invalidated = true
                onEndScroll()
            }
        }
        window.addEventListener("wheel", wheelListener, { passive: false })
        return () => window.removeEventListener("wheel", wheelListener)
    })

    return (
        <Container className="App">
            <Image src={image} />
            <GraphicsContainer />
            <TimelineBackdrop />
            <CustomTimeline
                data={{ index: data.index, preTranslate: data.wheel }}
                updateIndex={index => setData({ index, wheel: 0 })}
            />
        </Container>
    )
}

export default App

const Container = styled.div`
    background-color: #1a2b35;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`

const Image = styled.img`
    position: absolute;
    left: 0;
    width: 100vw;
    bottom: 0;
`
const CustomTimeline = styled(Timeline)`
    position: absolute;
    bottom: 120px;
    width: 80vw;
    left: 10vw;
    z-index: 10;
`

const TimelineBackdrop = styled.div`
    background: linear-gradient(
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.3)
    );
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 30vh;
`
