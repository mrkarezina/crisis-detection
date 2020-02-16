import React, { useEffect, useState } from "react"
import image from "./assets/map.svg"
import styled from "styled-components"
import GraphicsContainer from "./components/GraphicsContainer"
import Timeline from "./components/molecules/Timeline"
import { useSelector } from "./store"
import Button from "./components/atoms/Button"

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]

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

    const locations = [
        {
            lat: -20.9,
            long: 167.266,
            date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        }
    ]

    useEffect(() => {
        const wheelListener = (evt: WheelEvent) => {
            evt.preventDefault()
            setData({ ...data, wheel: data.wheel + evt.deltaY / 30 })
        }
        window.addEventListener("wheel", wheelListener, { passive: false })
        return () => window.removeEventListener("wheel", wheelListener)
    })
    const { initialDate, timeInterval } = useSelector(state => state)
    const currentDate = new Date(
        initialDate.getTime() -
            Math.floor(data.wheel / 100) * timeInterval * 1000
    )

    function animate(direction: "next" | "back") {
        function loop(i) {
            if (i >= 20) return
            setData({
                ...data,
                wheel: data.wheel += direction == "back" ? 5 : -5
            })
            requestAnimationFrame(() => loop(i + 1))
        }
        loop(0)
    }

    return (
        <Container className="App">
            <Image src={image} />
            <GraphicsContainer data={data} locations={locations} />
            <TimelineBackdrop>
                <BottomRow>
                    <Button onClick={() => animate("back")}>Back</Button>
                    <DayLabel>
                        {`${
                            months[currentDate.getMonth()]
                        }. ${currentDate.getDate()}`}
                    </DayLabel>
                    <Button onClick={() => animate("next")}>Next</Button>
                </BottomRow>
            </TimelineBackdrop>
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
    display: grid;
    justify-items: center;
    align-items: center;
`

const DayLabel = styled.div`
    color: white;
    font-size: 32px;
    font-weight: 700;
`

const BottomRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
`
