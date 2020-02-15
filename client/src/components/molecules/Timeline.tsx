import React from "react"
import styled from "styled-components"

interface TimelineProps {
    currentDate: Date
    dateGap: number
}

const Timeline: React.FC<TimelineProps> = ({ currentDate, dateGap }) => {
    console.log(currentDate, dateGap)
    return (
        <Container>
            <Line />
        </Container>
    )
}

export default Timeline

const Container = styled.div``
const Line = styled.div`
    background-color: ${props => props.theme.colors.primary};
    height: 5px;
    width: 100%;
`
