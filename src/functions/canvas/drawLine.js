import lightenDarkenHex from '../lightenDarkenHex';

export default barDrawData => {
    const {ctx, bar, nextBar, barWidth, i, getY, colors} = {...barDrawData};

    let color = colors.green;

    //ctx.strokeStyle = colors.lightGray;
    //ctx.lineWidth = Math.max(barWidth/10, 1);
    //ctx.beginPath();
    //ctx.moveTo(barWidth * i + barWidth/2, getY(bar.high));
    //ctx.lineTo(barWidth * i + barWidth/2, getY(bar.low));
    //ctx.closePath();
    //ctx.stroke();

    ctx.lineWidth = 1;

    color = bar.open <= bar.close ? colors.green : colors.red;

    // Lined bar - start draw
    ctx.strokeStyle = lightenDarkenHex(color,-50);
    ctx.beginPath();
    ctx.moveTo(barWidth * i, getY(bar.open));
    ctx.lineTo(barWidth * i + (barWidth), getY(bar.close));
    ctx.closePath();
    ctx.stroke();

    if(nextBar) {

        color = bar.close <= nextBar.open ? colors.green : colors.red;

        ctx.strokeStyle = lightenDarkenHex(color,-50);
        ctx.beginPath();
        ctx.moveTo(barWidth * i + (barWidth), getY(bar.close));
        ctx.lineTo(barWidth * i + (barWidth), getY(nextBar.open));
        ctx.closePath();
        ctx.stroke();
    }
}