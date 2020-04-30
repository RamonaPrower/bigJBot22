const Canvas = require('canvas');
const { performance } = require('perf_hooks');
module.exports = {
    emoji: new RegExp('<(a?):.*?:(.*?)>'),
    newLineCreator(text, fontSize, maxWidth, fontName) {
        // set up the variables we'll need for calculation
        let perfA = performance.now();
        const canvas = Canvas.createCanvas(640, 480);
        const ctx = canvas.getContext('2d');
        let lines = [];
        let loopAmount = 0;
        let result;
        const cachedTokens = text.split(/\r\n|\r|\n/).join(' ').split(' ');
        let tokens = cachedTokens;
        let dynamFontSize = fontSize;
        ctx.font = dynamFontSize + 'px ' + fontName;
        let perfB = performance.now();
        console.log(`initial setup took ${Math.round(perfB - perfA)}ms`);
        // while there's tokens left
        while (tokens.length > 0) {
          let width = 0, i;
          perfA = performance.now();
          for (i = tokens.length; i > 0; i--) {

            width = ctx.measureText(tokens.slice(0, i).join(' ')).width;
            // if it fits
            if (width <= maxWidth) {
              break;
            }
            // if someone makes one big old string this SHOULD reduce the font to a degree where it fits
            if (width > maxWidth && tokens.length === 1) {
              dynamFontSize--;
              ctx.font = dynamFontSize + 'px ' + fontName;
              i++;
            }
            if (i == 0) {
              return { lines };
            }
          }
          // slice by calculated amount of words
          result = tokens.slice(0, i).join(' ');
          lines.push(result);
          width = Math.max(width, ctx.measureText(result).width);
          tokens = tokens.slice(i);
          perfB = performance.now();
          console.log(`measurement slice loop took ${Math.round(perfB - perfA)}ms`);
          if ((lines.length * dynamFontSize) > 420 && tokens.length == 0) {
            // figure out how far over we are
            perfA = performance.now();
            const overValue = (lines.length * dynamFontSize) - 420;
            const fontSizeReduc = Math.ceil(overValue / dynamFontSize);
            dynamFontSize = dynamFontSize - fontSizeReduc;
            loopAmount++;
            ctx.font = dynamFontSize + 'px ' + fontName;
            tokens = cachedTokens;
            lines = [];
            perfB = performance.now();
            console.log(`height adjust loop took ${Math.round(perfB - perfA)}ms, looped ${loopAmount} times so far`);
          }
            // if there's over 19 lines, it's going to start getting cramped, so reduce the font size, and run again
        //   if (lines.length > 19 && tokens.length == 0) {
        //     dynamFontSize = dynamFontSize - (lines.length - 19);
        //     loopAmount++;
        //     ctx.font = dynamFontSize + 'px ' + fontName;
        //     tokens = text.split(/\r\n|\r|\n/).join(' ').split(' ');
        //     lines = [];
        //   }
        }


        return { lines, dynamFontSize };
      },
};