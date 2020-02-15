import React from "react"
import image from "./assets/map.svg"
import styled from "styled-components"
import GraphicsContainer from "./components/GraphicsContainer"
import Timeline from "./components/molecules/Timeline"
const App = () => {
    return (
        <Container className="App">
            <Image src={image} />
            <GraphicsContainer />
            <CustomTimeline currentDate={new Date()} dateGap={24 * 60 * 60} />
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
    bottom: 20px;
`
