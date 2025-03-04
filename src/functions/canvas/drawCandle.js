import lightenDarkenHex from '../lightenDarkenHex';

export default barDrawData => {
    const {ctx, bar, nextBar, barWidth, i, getY, colors} = {...barDrawData};

    const [minPrice, maxPrice] = [Math.min(bar.close, bar.open), Math.max(bar.close, bar.open)];

    let [startPos, endPos] = [getY(maxPrice), getY(minPrice)];

    let color;

    if(nextBar) {
        color = bar.close <= nextBar.open ? colors.green : colors.red;

        ctx.lineWidth = 1;
        ctx.strokeStyle = lightenDarkenHex(color,-20);
        ctx.beginPath();
        ctx.moveTo(barWidth * i + (barWidth), getY(bar.close));
        ctx.lineTo(barWidth * i + (barWidth), getY(nextBar.open));
        ctx.closePath();
        ctx.stroke();
    }

    color = bar.open <= bar.close ? colors.green : colors.red;

    if(Math.abs(startPos - endPos) < 1) {
        [startPos, endPos] = [startPos-0.5, endPos+0.5];
        color = colors.lightGray;
    } 

    ctx.strokeStyle = colors.lightGray;
    ctx.lineWidth = Math.max(barWidth/10, 1);
    ctx.beginPath();
    ctx.moveTo(barWidth * i + barWidth/2, getY(bar.high));
    ctx.lineTo(barWidth * i + barWidth/2, getY(bar.low));
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.lineWidth = barWidth - 2;
    ctx.beginPath();
    ctx.moveTo(barWidth * i + barWidth/2, startPos);
    ctx.lineTo(barWidth * i + barWidth/2, endPos);
    ctx.closePath();
    ctx.stroke();


    /*
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(highBarWidth + indX + barWidth * i, getY(bar.high) + indY/2);
    ctx.lineTo(highBarWidth + indX + barWidth * i, getY(bar.low) - indY/2);
    ctx.lineTo(-highBarWidth -indX + barWidth * (i+1), getY(bar.low) - indY/2);
    ctx.lineTo(-highBarWidth -indX + barWidth * (i+1), getY(bar.high) + indY/2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    */
}