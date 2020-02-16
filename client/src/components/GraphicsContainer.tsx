import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import { DrawEngine, utils } from "artgenjs"
import { Draw, RGBA, DrawableFunction } from "artgenjs/dist/types/types"

/**
 * Mapping
 * 0, 0 on our coordinate system corresponds to lat/long: -1.039768, 9.281471
 */

interface GraphicsProps {
    data: {
        index: number
        wheel: number
    }
    locations: { lat: number; long: number; date: Date }[]
}

class GraphicsContainer extends React.Component<GraphicsProps> {
    canvasRef: React.RefObject<HTMLDivElement>
    data: {
        index: number
        wheel: number
    } = {
        index: 0,
        wheel: 0
    }

    drawFun = (
        locations: { lat: number; long: number; date: Date }[]
    ): DrawableFunction => {
        const width = 1024
        const height = 1024 / 1.777778
        return () => {
            const defaultX = (width / 360) * (180 + -1.039768) - 512
            const defaultY = (height / 180) * (90 + 9.281471) - height / 2

            const circles = locations.map((location, i) => {
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
                    zIndex: i
                })
            })
            console.log(circles)
            const draw: Draw = () => {
                circles.forEach((circle, i) => {
                    const rgba = circle.fill as RGBA
                    const modifiedWheel =
                        this.data.wheel / 4 + this.data.index * 20
                    const value =
                        ((-Math.cos((modifiedWheel / 100) * Math.PI) + 1) / 2) *
                        20

                    let value2 = Math.sin((modifiedWheel / 100) * Math.PI) * 0.6
                    if (value2 < 0.5) value2 /= 2.5
                    circle.mutate({
                        radius: value + i / 50,
                        fill: utils.rgba(value2 * 280, rgba.g, rgba.b, value2)
                    })
                })
                return circles
            }
            return {
                draw,
                iterate: x => x + 1,
                endIf: () => false
            }
        }
    }

    shouldComponentUpdate(newProps: GraphicsProps) {
        this.data = newProps.data
        return newProps.data.index != this.props.data.index
    }

    componentDidUpdate() {
        let i = 0
        const interval = setInterval(() => {
            this.data.wheel += 1
            i++
            if (i >= 10) clearInterval(interval)
        }, 10)
    }

    constructor(props) {
        super(props)
        this.canvasRef = React.createRef()
    }

    componentDidMount() {
        const drawEngine = new DrawEngine(
            this.drawFun(this.props.locations),
            this.canvasRef.current
        )
        drawEngine.start()
    }
    render() {
        return <Canvas ref={this.canvasRef} />
    }
}

export default GraphicsContainer

const Canvas = styled.div`
    position: absolute;
    left: 0;
    height: 55.28vw;
    bottom: 0;
    width: 100vw;
`
