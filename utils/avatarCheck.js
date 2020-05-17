const gifFrames = require('gif-frames');
const fetch = require('node-fetch');


module.exports = async function(url) {
    let animated = false;
    let buffer;
    const fetched = await fetch(url);
    const gifReg = /.gif$/i;

    if (gifReg.test(url)) {
        animated = true;
    }

    const prebuffer = await fetched.buffer();

    if (animated) {
        buffer = await gifFrames({
            url: prebuffer,
            frames: 0,
            culmative: true,
        });
        // this isn't the good way, but getImage returns a stream, when the buffer (which is needed) is right there in a private var
        // if it does get busted, fork gif-frames with the buffer option, and PR, if not, add it as a new util
        buffer = buffer[0].getImage()._obj;
    }

    return ((animated) ? buffer : prebuffer);
};