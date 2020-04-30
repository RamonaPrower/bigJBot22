const Canvas = require('canvas');
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
            for (i = 1; i <= tokens.length; i++) {
                width = ctx.measureText(tokens.slice(0, i).join(' ')).width;
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
            width = Math.max(width, ctx.measureText(result).width);
            tokens = tokens.slice(lastValid);
            if ((lines.length * dynamFontSize) > maxHeight && tokens.length == 0) {
                // figure out how far over we are
                const overValue = (lines.length * dynamFontSize) - maxHeight;
                const fontSizeReduc = Math.ceil(overValue / dynamFontSize);
                dynamFontSize = dynamFontSize - (fontSizeReduc / 2);
                ctx.font = dynamFontSize + 'px ' + fontName;
                tokens = cachedTokens;
                lines = [];
            }
        }


        return { lines, dynamFontSize };
    },
};