import './graph.css';
import { useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import Canvas from './canvas';
import drawLine from '../../functions/canvas/drawLine';
import drawCandle from '../../functions/canvas/drawCandle';
import drawText from '../../functions/canvas/drawText';

function Graph(props) {
    const ref = useRef();
    const sliderRef = useRef();
    const [size, setSize] = useState({});
    const [scroll, setScroll] = useState(0);
    const [cursorParams, setCursorParams] = useState({});

    const resizeHandler = () => {
        const { clientHeight, clientWidth } = ref.current || {};
        setSize({ clientHeight: clientHeight-20, clientWidth });
    };

    useLayoutEffect(() => {
        window.addEventListener("resize", resizeHandler);
        resizeHandler();
        return () => {
          window.removeEventListener("resize", resizeHandler);
        };
    }, []);

    const volumeMaxHigh = 110;
    const gap = 5;

    const barWidth = 12;
    const drawCount = Math.ceil(size.clientWidth / barWidth);
    const localPrivilegeCoeff = 10;

    const slideStyle = { width: Math.max(size.clientWidth, props.data.length*barWidth) || 0 };

    const handleScroll = () => {
        if (ref.current) {
          const { scrollLeft } = ref.current;
          setScroll(scrollLeft);
        }
    };

    const colors = {
        red: '#a61c1c',
        green: '#1ca664',
        purple: '#511ca6',
        gray: '#272727',
        lightGray : '#3a3a3a',
    }

    const mouseProperties = {
        hover: false,
        pos: {x: 0, y: 0}
    }

    const mouseGraphMove = (e) => {
        if(ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setCursorParams({
                hover: true,
                pos: {x: e.clientX - rect.left, y: e.clientY - rect.top}
            });
        }
    }

    const mouseGraphLeave = () => {
        setCursorParams({hover:false});
    }

    const canvasDraw = ctx => {
        let [localMin, localMax] = [Infinity, -Infinity];

        for (let index = Math.floor(scroll/barWidth); index < Math.floor(scroll/barWidth) + drawCount; index++) {
            const bar = props.data[index];

            if( bar ) {
                localMax = (bar.high > localMax ? bar.high : localMax);
                localMin = (bar.low < localMin ? bar.low : localMin);
            }
        }

        const [middleMin, middleMax] = [(props.min + localMin*localPrivilegeCoeff)/(localPrivilegeCoeff+1), (props.max + localMax*localPrivilegeCoeff)/(localPrivilegeCoeff+1)];

        const getY = priceValue => {
            const dotSize = (size.clientHeight - volumeMaxHigh - gap) / (middleMax - middleMin);
            return size.clientHeight - volumeMaxHigh - gap + (-priceValue + middleMin)*dotSize;
        }

        const getVolY = volume => {
            const dotSize = (volumeMaxHigh + gap) / (props.maxVol);
            return size.clientHeight + (-volume + 0)*dotSize;
        }

        // line between bars and volume
        ctx.strokeStyle = colors.gray;
        ctx.beginPath();
        ctx.moveTo(0, getVolY(props.maxVol) - gap/2);
        ctx.lineTo(size.clientWidth, getVolY(props.maxVol) - gap/2);
        ctx.closePath();
        ctx.stroke();
        // line between bars and volume

        // Bars
        let i = 0;
        for (let index = Math.floor(scroll/barWidth); index < Math.floor(scroll/barWidth) + drawCount; index++) {
            const bar = props.data[index];

            if( bar ) {
                const nextBar = props.data[index+1];
                //drawLine({ctx, bar, nextBar, barWidth, i, getY, colors});
                drawCandle({ctx, bar, nextBar, barWidth, i, getY, colors});
            }
            i++;
        }
        // Bars

        ctx.stroke();

        // Volume
        i = 0;
        for (let index = Math.floor(scroll/barWidth); index < scroll/barWidth + drawCount; index++) {
            const bar = props.data[index];

            if( bar ) {
                ctx.strokeStyle = colors.purple;
                ctx.lineWidth = barWidth - 2;
                ctx.beginPath();
                ctx.moveTo(barWidth * i + barWidth/2, getVolY(0));
                ctx.lineTo(barWidth * i + barWidth/2, getVolY(bar.vol));
                ctx.closePath();
                ctx.stroke();
            }
            i++;
        }
        // Volume

        
        // Mouse
        if(cursorParams.hover) {
            const {x, y} = {...cursorParams.pos};

            const localIndex = Math.floor(x/barWidth);
            const index = localIndex + Math.floor(scroll/barWidth);

            const bar = props.data[index];

            const mX = localIndex*barWidth + barWidth/2;
            //const mX = x;

            if( bar ) {
                // Infobox
                const infoText = `Id(${index}):\n\n-Дата: ${bar.dateTime.toLocaleString()}\n-Цена открытия: ${bar.open}\n-Пик: ${bar.high}\n-Низ: ${bar.low}\n-Цена закрытия: ${bar.close}\n-Объем: ${bar.vol}\n-Диапазон: ${(bar.high - bar.low).toFixed(3)}`
                const boxSize = {x: 250, y: 20*10 - 7};

                const boxPosX = mX <= size.clientWidth - boxSize.x ? 0 : -boxSize.x
                const boxPosY = y >= boxSize.y ? -boxSize.y : 0

                ctx.globalAlpha = 0.4;
                ctx.rect(mX + boxPosX, y + boxPosY, boxSize.x, boxSize.y);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                ctx.fillStyle = 'gray';
                ctx.font = "16px serif";
                drawText(ctx,infoText, mX + 5 + boxPosX, y + 20 + boxPosY, boxSize.x, 20);
                // Infobox

                // Crosslines
                ctx.strokeStyle = colors.lightGray;
                ctx.lineWidth = 0.5;

                ctx.beginPath();
                ctx.moveTo(0, getY(bar.close));
                ctx.lineTo(size.clientWidth, getY(bar.close));
                ctx.closePath();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(mX, 0);
                ctx.lineTo(mX, size.clientHeight);
                ctx.closePath();
                ctx.stroke();
                // Crosslines
            }
        }
        // Mouse
    }

    return (
        <div onMouseMove={mouseGraphMove} onMouseLeave={mouseGraphLeave} className="graph-container" ref={ref} onScroll={handleScroll}>
            <Canvas draw={canvasDraw} height={size.clientHeight} width={size.clientWidth}></Canvas>
            <div className="preslider-container"><div className="slider-container" ref={sliderRef} style={slideStyle}></div></div>
        </div>
    )
}

export default Graph