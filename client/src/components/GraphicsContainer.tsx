import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import { DrawEngine, utils } from "artgenjs"
import {
    Draw,
    RGBA,
    DrawableFunction,
    DecoratedPoint
} from "artgenjs/dist/types/types"
import { connect } from "react-redux"
import { AppState } from "../store"

/**
 * Mapping
 * 0, 0 on our coordinate system corresponds to lat/long: -1.039768, 9.281471
 */

interface GraphicsProps {
    data: {
        index: number
        wheel: number
    }
    locations: { id: string; lat: number; long: number; date: Date }[]
    timeInterval: number
    initialDate: Date
}

class GraphicsContainer extends React.Component<
    GraphicsProps,
    { pointer: boolean }
> {
    canvasRef: React.RefObject<HTMLDivElement>
    data: {
        index: number
        wheel: number
    } = {
        index: 0,
        wheel: 0
    }
    circles: DecoratedPoint[]
    mousePos: { x: number; y: number }

    state = {
        pointer: false
    }
    drawFun = (
        locations: { lat: number; long: number; date: Date }[]
    ): DrawableFunction => {
        const width = 1024
        const height = 1024 / 1.777778
        return () => {
            const defaultX = (width / 360) * (180 + -1.039768) - 512
            const defaultY = (height / 180) * (90 + 9.281471) - height / 2

            this.circles = locations.map((location, i) => {
                const x =
                    (width / 360) * (180 + location.long) - 512 + defaultX - 20
                const y =
                    (height / 180) * (90 + location.lat) -
                    height / 2 +
                    defaultY -
                    20
                return utils.GenPoint(x, y, {
                    fill: utils.rgba(0, [200, 255], [50, 100], 0),
                    stateIndex: i,
                    radius: 1,
                    zIndex: i
                })
            })
            const draw: Draw = () => {
                const index = Math.max(0, Math.floor(this.data.wheel / 100))
                const date = new Date(
                    this.props.initialDate.getTime() -
                        index * this.props.timeInterval * 1000
                )

                this.circles.forEach((circle, i) => {
                    const rgba = circle.fill as RGBA
                    const expectedIndex = Math.floor(
                        (this.props.initialDate.getTime() -
                            this.props.locations[i].date.getTime()) /
                            this.props.timeInterval /
                            1000
                    )

                    let modifiedWheel = 0
                    if (expectedIndex - index > 3) modifiedWheel = 400
                    else if (expectedIndex - index < 0) modifiedWheel = 0
                    else {
                        modifiedWheel =
                            this.props.data.wheel - (expectedIndex - 3) * 100
                    }
                    const value =
                        ((-Math.cos((modifiedWheel / 400) * Math.PI) + 1) / 2) *
                        20

                    let value2 = Math.sin((modifiedWheel / 400) * Math.PI) * 0.6
                    if (value2 < 0.5) value2 /= 4

                    if (this._isInCircle(this.mousePos, circle)) {
                        circle.mutate({
                            radius: value + i / 50,
                            fill: utils.rgba(value2 * 280, 200, rgba.b, 1)
                        })
                    } else
                        circle.mutate({
                            radius: value + i / 50,
                            fill: utils.rgba(
                                value2 * 280,
                                rgba.g,
                                rgba.b,
                                value2
                            )
                        })
                })

                return this.circles.filter((_, i) => {
                    const diff =
                        date.getTime() - this.props.locations[i].date.getTime()
                    return diff <= 3000 * this.props.timeInterval && diff >= 0
                })
            }
            return {
                draw,
                iterate: x => x + 1,
                endIf: () => false
            }
        }
    }

    constructor(props) {
        super(props)
        this.mousePos = { x: 0, y: 0 }
        this.canvasRef = React.createRef()
    }

    shouldComponentUpdate(newProps: GraphicsProps) {
        this.data = newProps.data
        const width = 1024
        const height = 1024 / 1.777778
        const defaultX = (width / 360) * (180 + -1.039768) - 512
        const defaultY = (height / 180) * (90 + 9.281471) - height / 2
        this.circles = newProps.locations.map((location, i) => {
            const lat = location.lat
            const long = location.long
            const x = (width / 360) * (180 + long) - 512 + defaultX - 20
            const y = (height / 180) * (90 + lat) - height / 2 + defaultY - 20
            return utils.GenPoint(x, y, {
                fill: utils.rgba(0, [200, 255], [50, 100], 0),
                stateIndex: i,
                radius: 1,
                zIndex: i
            })
        })
        return newProps.data.index != this.props.data.index
    }

    componentDidMount() {
        const drawEngine = new DrawEngine(
            this.drawFun(this.props.locations),
            this.canvasRef.current
        )
        drawEngine.start()

        window.addEventListener("mousemove", this.mouseListener)
        window.addEventListener("click", this.clickListener)
    }

    componentWillUnmount() {
        window.removeEventListener("mousemove", this.mouseListener)
        window.removeEventListener("click", this.clickListener)
    }

    componentDidUpdate() {
        let i = 0
        const interval = setInterval(() => {
            this.data.wheel += 1
            i++
            if (i >= 10) clearInterval(interval)
        }, 10)
    }

    mouseListener = (evt: MouseEvent) => {
        if (!this.canvasRef.current) return
        const gap =
            window.innerHeight -
            this.canvasRef.current.getBoundingClientRect().height
        this.mousePos = {
            x:
                (evt.clientX /
                    this.canvasRef.current.getBoundingClientRect().width) *
                    1024 -
                512,
            y:
                (1 -
                    (evt.clientY - gap) /
                        this.canvasRef.current.getBoundingClientRect().height) *
                    (1024 / 1.77778) -
                512 / 1.77778
        }
    }

    clickListener = (evt: MouseEvent) => {
        const gap =
            window.innerHeight -
            this.canvasRef.current.getBoundingClientRect().height
        const position = {
            x:
                (evt.clientX /
                    this.canvasRef.current.getBoundingClientRect().width) *
                    1024 -
                512,
            y:
                (1 -
                    (evt.clientY - gap) /
                        this.canvasRef.current.getBoundingClientRect().height) *
                    (1024 / 1.77778) -
                512 / 1.77778
        }
        for (let i = 0; i < this.circles.length; ++i) {
            if (this._isInCircle(position, this.circles[i])) {
                const index = Math.floor(this.props.data.wheel / 100)
                //if (this.props.locations[i].date == index * this.props.
                window.open(
                    `https://www.twitter.com/mrkarezina/status/${this.props.locations[i].id}`,
                    "_blank"
                )
                return
            }
        }
    }

    _isInCircle(pos: { x: number; y: number }, point: DecoratedPoint) {
        return (
            Math.pow(pos.x - utils.unwrap(point.x), 2) +
                Math.pow(pos.y - utils.unwrap(point.y), 2) <=
            Math.pow(utils.unwrap(point.radius), 2)
        )
    }

    render() {
        return <Canvas ref={this.canvasRef} pointer={this.state.pointer} />
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        timeInterval: state.timeInterval,
        initialDate: state.initialDate
    }
}
export default connect(mapStateToProps)(GraphicsContainer)

const Canvas = styled.div<{ pointer: boolean }>`
    position: absolute;
    left: 0;
    height: 55.28vw;
    bottom: 0;
    width: 100vw;
`
