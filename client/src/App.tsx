import React, { useEffect } from "react"
import image from "./assets/map.svg"
import styled from "styled-components"
import GraphicsContainer from "./components/GraphicsContainer"
import Timeline from "./components/molecules/Timeline"

let wheel = 0
const App = () => {
    useEffect(() => {
        const wheelListener = (evt: WheelEvent) => {
            evt.preventDefault()
            wheel += Math.pow(evt.deltaY / 30, 1)
            if (Math.abs(evt.deltaY) > 100) console.log(wheel)
        }
        window.addEventListener("wheel", wheelListener, { passive: false })
        return () => window.removeEventListener("wheel", wheelListener)
    })

    return (
        <Container className="App">
            <Image src={image} />
            <GraphicsContainer />
            <TimelineBackdrop />
            <CustomTimeline index={0} />
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
