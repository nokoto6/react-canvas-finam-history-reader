export default (ctx, text, x, y, maxWidth, lineHeight) => {
    text.split('\n').forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight, maxWidth));
}