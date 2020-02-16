import React, { MutableRefObject, useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { AppState } from "../../store"

interface TimelineProps {
    className?: string
    data: {
        index: number
        preTranslate: number
    }
    startDate?: Date
    timeInterval?: number
    updateIndex: (index: number) => void
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

class Timeline extends React.Component<TimelineProps> {
    points: undefined[]
    pointRefs: React.RefObject<HTMLDivElement>[]
    labelRefs: React.RefObject<HTMLDivElement>[]
    lineRef: React.RefObject<HTMLDivElement>
    targetPointRef: React.RefObject<HTMLDivElement>
    pointPositions: number[]
    internalRange: [number, number]

    constructor(props: TimelineProps) {
        super(props)
        this.points = [...Array(7)]

        this.pointRefs = this.points.map(() => React.createRef())
        this.lineRef = React.createRef()
        this.targetPointRef = React.createRef()
        this.internalRange = [0, 6]
        this.labelRefs = this.points.map(() => React.createRef())
    }

    componentDidMount() {
        this.pointPositions = this.pointRefs.map(
            ref =>
                ref.current?.getBoundingClientRect().x -
                this.lineRef.current?.getBoundingClientRect().x
        )
        this.targetPointRef.current.style.transform = `translate(${this
            .pointPositions[this._transform(this.props.data.index)] +
            5}px, -50%)`
    }

    shouldComponentUpdate(nextProps: TimelineProps) {
        if (nextProps.data.index !== this.props.data.index) {
            return true
        }
        this.targetPointRef.current.style.transform = `translate(${this
            .pointPositions[this._transform(this.props.data.index)] -
            this.props.data.preTranslate}px, -50%)`
        return false
    }

    componentDidUpdate(prevProps: TimelineProps) {
        const { index } = this.props.data

        const handleEnd = () => {
            if (index == this.internalRange[1]) {
                // shift data
                let x = 0
                const desiredWidth =
                    this.pointPositions[1] - this.pointPositions[0]
                const interval = setInterval(() => {
                    x += desiredWidth / 20

                    this.labelRefs.forEach(point => {
                        point.current.style.transform = `translateX(${x}px)`
                        this.targetPointRef.current.style.transform = `translate(${x}px, -50%)`
                    })
                    if (x >= desiredWidth - 0.1) clearInterval(interval)
                }, 10)
                return
            }
        }

        const rawD =
            this.pointPositions[this._transform(index)] -
            this.pointPositions[this._transform(prevProps.data.index)] +
            prevProps.data.preTranslate
        const d = Math.abs(rawD)
        let x = 0
        const interval = setInterval(() => {
            x += d / 20
            this.targetPointRef.current.style.transform = `translate(${this
                .pointPositions[this._transform(index)] -
                rawD -
                (rawD < 0 ? x : -x) +
                5}px, -50%)`

            if (x >= d - 0.1) {
                clearInterval(interval)
                handleEnd()
            }
        }, 10)
    }

    render() {
        const { className, startDate, timeInterval } = this.props

        const dates = this.points.map((_, i) => {
            return new Date(
                startDate.getTime() - this._transform(i) * timeInterval * 1000
            )
        })

        return (
            <Container className={className}>
                <Line ref={this.lineRef}>
                    {this.points.map((_, i) => (
                        <LabelContainer key={i} ref={this.labelRefs[i]}>
                            <Label shouldOffset={i % 2 == 0}>{`${
                                months[dates[i].getMonth()]
                            }. ${dates[i].getDate()}`}</Label>
                            <Point
                                ref={this.pointRefs[i]}
                                onClick={() =>
                                    this.props.updateIndex(this._transform(i))
                                }
                            />
                        </LabelContainer>
                    ))}
                </Line>
                <TargetPoint ref={this.targetPointRef} />
            </Container>
        )
    }
    _transform = (i: number) => {
        return this.internalRange[1] - i
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        startDate: state.initialDate,
        timeInterval: state.timeInterval
    }
}

export default connect(mapStateToProps)(Timeline)

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
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
        background-color: ${props => props.theme.colors.primary};
    }
`

const TargetPoint = styled.div`
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    transform: translate(0, -50%);
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
