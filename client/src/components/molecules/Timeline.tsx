import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useSelector } from "../../store"

interface TimelineProps {
    currentDate: Date
    dateGap: number
    className?: string
    timeline(action: "increment" | "decrement"): void
}

const Timeline: React.FC<TimelineProps> = ({ className, currentDate }) => {
    const points = [...Array(7)]

    useEffect(() => {
        updateTimeline(selectedDate, currentDate)
    }, [currentDate])

    return (
        <Container className={className}>
            <Line>
                {points.map((_, i) => {
                    return (
                        <LabelContainer key={i}>
                            <Label offset={i % 2 == 0}>Date</Label>
                            <Point />
                        </LabelContainer>
                    )
                })}
            </Line>
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
    background-color: ${props => props.theme.colors.dark};
    border: 5px solid ${props => props.theme.colors.primary};
    border-radius: 20px;
    grid-row: 2/3;
`

const Label = styled.div<{ offset?: boolean }>`
    color: ${props => props.theme.colors.light};
    ${props =>
        props.offset &&
        `
        grid-row: 3/4;
    `}

    text-align: center;

    font-size: 18px;
`
