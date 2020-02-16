import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import { DrawEngine, utils } from "artgenjs"
import { Draw, RGBA } from "artgenjs/dist/types/types"

/**
 * Mapping
 * 0, 0 on our coordinate system corresponds to lat/long: -1.039768, 9.281471
 */

const GraphicsContainer: React.FC<{}> = () => {
    const canvasRef = useRef<HTMLDivElement>(null)

    function drawFun() {
        const circles = utils.generate(200, i => {
            return utils.GenPoint(
                utils.unwrap([-200, 200]),
                utils.unwrap([-100, 100]),
                {
                    fill: utils.rgba(0, [200, 255], [50, 100], 0),
                    stateIndex: i,
                    zIndex: i
                }
            )
        })
        const draw: Draw = () => {
            circles.forEach((circle, i) => {
                const rgba = circle.fill as RGBA
                let modifiedWheel = 50 + i
                if (modifiedWheel < 0) modifiedWheel = 0
                if (modifiedWheel > 100) modifiedWheel = 100
                const value =
                    ((-Math.cos((modifiedWheel / 100) * Math.PI) + 1) / 2) * 20

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

    useEffect(() => {
        const drawEngine = new DrawEngine(drawFun, canvasRef.current)
        drawEngine.start()
    }, [])

    return <Canvas ref={canvasRef} />
}

export default GraphicsContainer

const Canvas = styled.div`
    position: absolute;
    left: 0;
    height: 55.28vw;
    bottom: 0;
    width: 100vw;
`
