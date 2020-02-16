import React, { useEffect, useState } from "react"
import image from "./assets/map.svg"
import styled from "styled-components"
import GraphicsContainer from "./components/GraphicsContainer"
import Timeline from "./components/molecules/Timeline"
import { useSelector } from "./store"

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
            lat: 43.5338611,
            long: -79.6960901,
            date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        },
        {
            lat: 52.7330371,
            long: -68.8860427,
            date: new Date(new Date().getTime() - 48 * 60 * 60 * 1000)
        },
        {
            lat: 38.8454059,
            long: -9.1758703,
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

    return (
        <Container className="App">
            <Image src={image} />
            <GraphicsContainer data={data} locations={locations} />
            <TimelineBackdrop>
                <DayLabel>
                    {`${
                        months[currentDate.getMonth()]
                    }. ${currentDate.getDate()}`}
                </DayLabel>
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
    display: grid;
    justify-items: center;
    align-items: center;
`

const DayLabel = styled.div`
    color: white;
    font-size: 32px;
    font-weight: 700;
`
