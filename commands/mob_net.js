const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');
const tfnode = require ('@tensorflow/tfjs-node');
const sharp = require('sharp');

//Load all modules
console.log('Module Load Complete');



/*/Make sure argument is correct, console applicationo nly
if (process.argv.length !==3){
    console.error('Wrong agument count, use mob_net.js <File>');
    return;
}

//take input from command line
const image_file=process.argv[2];*/

//Convert image to jpeg, then classify, and delete temporary files after
exports.run=function(){sharp(`image_file2.jpg`).jpeg({quality: 100}).toFile('output.jpeg')};

/*sharp(`image_file.jpg`).jpeg({quality: 100}).toFile('output.jpeg').then(()=>{
    ImgClassify('output.jpeg');
}).then(()=>{
    console.log('deleting temporary file')
    fs.unlinkSync('output.jpeg');
}).catch((err)=>{console.log(err);});*/

//let timeout = new Promise ((resolve, reject)=>{
    //setTimeout(reject('Timed out!'),10000);
//})

//console.log(Promise.race(pr, timeout));
//;
//Run main function




//console.log(image.metadata(size()));


//Main Classification Comamnd
//ImgClassify(process.argv[2]);




//Read Image Function, decode using tensorflow nodejs extension
function readImage (path){
    console.log('Reading image...')
    const imageBuffer = fs.readFileSync(path);
    const tfimage = tfnode.node.decodeImage(imageBuffer);
    return tfimage;
}

//Classify image using Imagenet, note: categories only limited to top 1000 from ImageNet, see https://gist.github.com/yrevar/942d3a0ac09ec9e5eb3a
async function ImgClassify(path){
    const image = readImage(path);
    console.log('Classifying...Please wait')
    const model = await mobilenet.load();
    const predictions = await model.classify(image);
    console.log('Classifications:',predictions);
}
//const img = document.getElementById('img');


//const predictions = await model.classify(img);

//console.log('Predictions:');
//console.log(predictions);
