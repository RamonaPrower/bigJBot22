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
        buffer = buffer[0].getImage()._obj;
    }

    return ((animated) ? buffer : prebuffer);
};