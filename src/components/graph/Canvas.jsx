import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

function Canvas(props) {
    const ref = useRef();

    const draw = props.draw;

    useEffect(() => {
        const canvas = ref.current;
        const context = canvas.getContext('2d');

        canvas.width = props.width;
        canvas.height = props.height;

        context.clearRect(0, 0, canvas.width, canvas.height);
        draw(context);
      }, [draw])
    
    return (
        <canvas className="graph-canvas" ref={ref}></canvas>
    )
}

export default Canvas