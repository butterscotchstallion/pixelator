import {useEffect, useRef} from "react";

const Canvas = props => {
    const canvasRef = useRef(null)
    const canvas = canvasRef.current

    if (!canvas) return null
    
    const context = canvas.getContext('2d')
    useEffect(() => {
        const draw = ctx => {
            ctx.fillStyle = '#000000'
            ctx.beginPath()
            ctx.arc(50, 100, 20, 0, 2 * Math.PI)
            ctx.fill()
        }
        draw(context)
    }, [context])
    return <canvas ref={canvasRef} {...props}/>
}

export default Canvas