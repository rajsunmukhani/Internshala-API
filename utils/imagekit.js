const ImageKit = require('imagekit');

exports.initImageKit = () => {
    var imagekit = new ImageKit({
        publicKey : process.env.IMAGEKIT_PUBLICKEY ,
        privateKey : process.env.IMAGEKIT_PRIVATEKEY ,
        urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT 
    })

    return imagekit;
};