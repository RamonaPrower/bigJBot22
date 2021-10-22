const Canvas = require('canvas');
const { measureText } = require('node-canvas-with-twemoji-and-discord-emoji');

module.exports = {
    emoji: new RegExp('<(a?):.*?:(.*?)>'),
    spongebobNewLineCreator(text, fontSize, maxWidth, maxHeight, fontName) {
        // set up the variables we'll need for calculation
        const canvas = Canvas.createCanvas(640, 480);
        const ctx = canvas.getContext('2d');
        let lines = [];
        let result;
        const cachedTokens = text.split(/\r\n|\r|\n/).join(' ').split(' ');
        let tokens = cachedTokens;
        let dynamFontSize = fontSize;
        ctx.font = dynamFontSize + 'px ' + fontName;
        // while there's tokens left
        while (tokens.length > 0) {
            let width = 0, i;
            let lastValid = 1;
            // we do this forward for reasons of performance, on 1000 characters, going backwards it was taking upwards of 15 seconds
            // this entire loop now takes about 80ms
            // it does mean we have to set up some jank here and there but it's *so* much faster
            for (i = 1; i <= tokens.length; i++) {
                width = measureText(ctx, tokens.slice(0, i).join(' ')).width;
                // if this fits the layout
                if (width <= maxWidth) {
                    lastValid = i;
                }
                // if it fits the layout and it's the last few lines
                if (width <= maxWidth && tokens.length == i) {
                    lastValid = i;
                    break;
                }
                // if the line is too long
                if (width > maxWidth) {
                    break;
                }
                // if it's one big line
                if (width > maxWidth && tokens.length === 1) {
                    dynamFontSize--;
                    ctx.font = dynamFontSize + 'px ' + fontName;
                    i--;
                }
                if (tokens.length == 0) {
                    return { lines };
                }
            }
            // slice by calculated amount of words
            result = tokens.slice(0, lastValid).join(' ');
            lines.push(result);
            width = Math.max(width, measureText(ctx, result).width);
            tokens = tokens.slice(lastValid);
            // figure out how far over the height limit we are
            if ((lines.length * dynamFontSize) > maxHeight && tokens.length == 0) {
                const overValue = (lines.length * dynamFontSize) - maxHeight;
                const fontSizeReduc = Math.ceil(overValue / dynamFontSize);
                // we reduce it by half, as that seems to clear up edge cases.
                // this works because of the fact that we're counting from the whole image, but only need to reduce from the middle
                // this was figured out 3 days after i did this code though
                dynamFontSize = dynamFontSize - (fontSizeReduc / 2);
                ctx.font = dynamFontSize + 'px ' + fontName;
                tokens = cachedTokens;
                lines = [];
            }
        }


        return { lines, dynamFontSize };
    },
    drilNewLineCreator(text, fontSize, maxWidth) {
        // set up the variables we'll need for calculation
        const canvas = Canvas.createCanvas(640, 480);
        const ctx = canvas.getContext('2d');
        const lines = [];
        let result;
        const cachedTokens = text.split(/\r\n|\r|\n/).join(' ').split(' ');
        let tokens = cachedTokens;
        ctx.font = fontSize + 'px "Segoe UI",Arial,sans-serif';
        // while there's tokens left
        while (tokens.length > 0) {
            let width = 0, i;
            let lastValid = 1;
            for (i = 1; i <= tokens.length; i++) {
                width = measureText(ctx, tokens.slice(0, i).join(' ')).width;
                // if this fits the layout
                if (width <= maxWidth) {
                    lastValid = i;
                }
                // if it fits the layout and it's the last few lines
                if (width <= maxWidth && tokens.length == i) {
                    lastValid = i;
                    break;
                }
                // if the line is too long
                if (width > maxWidth) {
                    break;
                }
                if (tokens.length == 0) {
                    return { lines };
                }
            }
            // slice by calculated amount of words
            result = tokens.slice(0, lastValid).join(' ');
            lines.push(result);
            width = Math.max(width, measureText(ctx, result).width);
            tokens = tokens.slice(lastValid);
        }
        const canvasWidth = 631;
        const canvasHeight = 255 + (fontSize + 5) * lines.length;

        return { canvasWidth, canvasHeight, lines };
    },
};