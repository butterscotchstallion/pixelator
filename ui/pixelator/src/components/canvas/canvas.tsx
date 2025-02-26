import * as React from "react";
import {RefObject, useEffect, useRef} from "react";

const Canvas = props => {
    const canvasRef: RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement>(null);

    function getCanvasAndContext() {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
        return {canvas, context}
    }

    function resizeCanvas(canvas) {
        const {width, height} = canvas.getBoundingClientRect()
        if (canvas.width !== width || canvas.height !== height) {
            const {devicePixelRatio: ratio = 1} = window
            const context = canvas.getContext('2d')
            canvas.width = width * ratio
            canvas.height = height * ratio
            context.scale(ratio, ratio)
            return true
        }
        return false
    }

    const getCoordinates = (event, canvas) => {
        const x = event.pageX || event.touches[0].pageX
        const y = event.pageY || event.touches[0].pageY
        return {
            x: x - canvas.offsetLeft,
            y: y - canvas.offsetTop
        }
    }

    function drawGrid(x, y, width, height, gridCellSize, color, lineWidth = 1) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;

        for (let lx = x; lx <= x + width; lx += gridCellSize) {
            ctx.moveTo(lx, y);
            ctx.lineTo(lx, y + height);
        }

        for (let ly = y; ly <= y + height; ly += gridCellSize) {
            ctx.moveTo(x, ly);
            this.ctx.lineTo(x + width, ly);
        }

        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }


    function handleClick(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const {canvas, context} = getCanvasAndContext();
        const rect = event.target.getBoundingClientRect();
        const {x, y} = getCoordinates(event, canvas);
        context.fillStyle = "orange";
        context.fillRect(x, y, 32, 32);
        console.log("drawing at ", [x, y].join(','))
    }

    useEffect(() => {
        const {canvas, context} = getCanvasAndContext();
        resizeCanvas(canvas);
        drawGrid(props.width, props.height, context);
    }, [])
    return <canvas ref={canvasRef} {...props} onClick={handleClick}/>
}

export default Canvas