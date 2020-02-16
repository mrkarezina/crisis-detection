import React, { MutableRefObject, useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { useSelector } from "../../store"

interface TimelineProps {
    className?: string
    index: number
}

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

const Timeline: React.FC<TimelineProps> = ({ className, index }) => {
    const points = [...Array(7)]

    const pointsRef: React.MutableRefObject<(HTMLDivElement | null)[]> = useRef(
        points.map(() => null)
    )
    const lineRef: React.MutableRefObject<HTMLDivElement> = useRef(null)

    const [pointPositions, setPointPositions] = useState<number[]>(
        points.map(() => 0)
    )

    const date = useSelector(state => state.initialDate)
    const timeInterval = useSelector(state => state.timeInterval)

    const dates = points.map(
        (_, i) => new Date(date.getTime() - (6 - i) * timeInterval * 1000)
    )

    useEffect(() => {
        setPointPositions(
            pointsRef.current.map(
                ref =>
                    ref.getBoundingClientRect().x -
                    lineRef.current.getBoundingClientRect().x
            )
        )
    }, [])

    return (
        <Container className={className}>
            <Line ref={lineRef}>
                {points.map((_, i) => {
                    return (
                        <LabelContainer key={i}>
                            <Label shouldOffset={i % 2 == 0}>{`${
                                months[dates[i].getMonth()]
                            }. ${dates[i].getDate()}`}</Label>
                            <Point ref={el => (pointsRef.current[i] = el)} />
                        </LabelContainer>
                    )
                })}
            </Line>
            <TargetPoint
                translateX={pointPositions[index < 3 ? 6 - index : 3]}
            />
        </Container>
    )
}

export default Timeline

const Container = styled.div``
const Line = styled.div`
    background-color: ${props => props.theme.colors.primary};
    height: 5px;
    width: 100%;
    border-radius: 5px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`

const LabelContainer = styled.div`
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-column: 1fr;
    align-items: center;
    grid-gap: 5px;
    justify-items: center;
`
const Point = styled.div`
    width: 20px;
    height: 20px;
    background-color: ${props => props.theme.colors.primaryDark};
    border: 5px solid ${props => props.theme.colors.primary};
    border-radius: 20px;
    grid-row: 2/3;
`

const TargetPoint = styled.div<{ translateX: number }>`
    position: absolute;
    top: 50%;
    transform: translate(${props => props.translateX + 5}px, -50%);
    transition: transform 0.2s ease;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background-color: ${props => props.theme.colors.highlight};
`

const Label = styled.div<{ shouldOffset?: boolean }>`
    color: ${props => props.theme.colors.light};
    ${props =>
        props.shouldOffset &&
        `
        grid-row: 3/4;
    `}

    text-align: center;

    font-size: 18px;
`
