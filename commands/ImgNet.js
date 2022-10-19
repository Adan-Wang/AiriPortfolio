const fs= require('fs');
const path = require ('path');
const axios = require ('axios');
const mobilenet = require('@tensorflow-models/mobilenet');
const tfnode = require ('@tensorflow/tfjs-node');
const sharp = require('sharp');

//Check URL format will return object with two things, format_ok, which indicates if its supported, and format_name, which indicates the format of the image
function checkURLformat(url){
    const accepted_formats = ['.jpg','.jpeg','.bmp','.png'];
    //Recall, "i" here doesnt refer to element number, it refers to the element itself!
    for (const i of accepted_formats){
        if (url.toLowerCase().endsWith(i)){
            console.log(`Correct Format Found, format is is ${i}`);
            return {
                format_ok: 1,
                format_name: i
            };
        }
    }
    return {
        format_ok: 0,
        format_name: null
    };
}

async function downloadImage(url,format,path_time){
    let file_path=`image_file_${path_time}${format}`;
    const dir = path.resolve(__dirname, file_path);
    const writer = fs.createWriteStream(dir);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer);

    return new Promise((resolve,reject)=> {
        writer.on('finish',resolve)
        //Function used to stop the write stream after 15 seconds, to prevent huge files from being downloaded
        setTimeout(()=>{
            writer.end();
            reject(`Download took too long`)
        },15000)
        writer.on('error',reject)
    })
}

function timeout(timeout_ms){
    return new Promise ((resolve, reject)=>{
        setTimeout (()=>{
            reject(`Timed out in ${timeout_ms} ms`)
        },timeout_ms)
    })
}

//MobileNet classification functions

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
    //console.log('Classifications:',predictions);
    return predictions;
}


function printResults(client,message,results,url){
    const Discord = require ('discord.js');
    var embed = new Discord.MessageEmbed()
    .setTitle("title text")
    .setColor('BLUE')
    .setThumbnail(url,true)

    for (var i=0;i<results.length;i++){
        embed.addField(`${i+1}.\*${results[i].className}\* \n`,`\*\*Probability:\*\* ${(100*results[i].probability).toFixed(3)}%\n\*\*-----------------------------------------------------\*\* \n`);
        //embed.addField(`Status`,`${arr_member[i].status}`);
        //embed.addField(`Last Message`,`Last Message: ${arr_member[i].last_msg_cont}`);
        //embed.addField(`Last Seen`,`${arr_member[i].last_msg_time}`)
       // embed.addBlankField();
    }
    embed.setFooter('Footer text')
    message.channel.send(embed);

}

function printHelpFile(client,message){
    const Discord = require ('discord.js');
    var embed = new Discord.MessageEmbed().setTitle("&imgnet help")
    .setColor('GREEN')
    embed.addField(`\*\*Description\*\*\n`,`&imgnet is a image recognition function using the machine learning library of mobilenet V2, Airi will try to classify what your image is based on the top 1000 results from imagenet (https://gist.github.com/yrevar/942d3a0ac09ec9e5eb3a)`);
    embed.addField(`\*\*Usage\*\*\n`, `&imgnet currently supports URL and attachements, use &imgnet [URL] to link to an image file, use &imgnet with an attached image for attachement classification. Currently, only jpeg, jpg, png, and bmp is supported.
           If you image is too big (or if Airi's internet is lagging), it will not work! Note that this takes a while, so it has a 45s cooldown.`)
    embed.setFooter('Powered by mobilenet V2/Tensorflow-js library')
    message.channel.send(embed);
}




exports.run = function(client, message, args, config){
    message.channel.send('Image My!');
    var text_argument=args[0];
    //console.log(text_argument);
    //check input type, if it's not "help", a URL with the correct format image, or an attachement with the correct format, then it should return
    if (text_argument!=null){
        if (text_argument.toLowerCase()=='help'){
            printHelpFile(client,message);
            return;
        }
        if (text_argument.toLowerCase().startsWith("http")) {
                //console.log("URL Detected");
                //insert code here to make sure url ends with the correct format, need an array of accepted formats, and need array to check if url ends with those specific formats, spits out error if the url doesn't end correctly
                //after everything is good, save the correct url as a variable
                var format_check=checkURLformat(text_argument);
                if (format_check.format_ok!=1){
                    //console.log("URL detected, wrong format, try again");
                    message.channel.send('Airi only takes attachements or URLs o.o, only .jpg, .jpeg, .bmp, or .png will work, run &imgnet help for help tool');
                    return;
                }
                var img_url=text_argument;
                var img_format=format_check.format_name;
            }
            else{
                message.channel.send('Airi only takes attachements or URLs o.o, only .jpg, .jpeg, .bmp, or .png will work, run &imgnet help for help tool');
                return;
         }
        
    }
    else if(message.attachments.first()!= null){
        console.log('Attachement Detected')
        //insert function here to make sure url ends with the correct format
        var format_check = checkURLformat(message.attachments.first().url);
        if (format_check.format_ok!=1){
            message.channel.send('Incorrect mesage type, Airi only takes attachements or URLs. Run &imgnet help for more details on how to use this command')
            //console.log("Attachment URL detected, wrong format, try again");
           // console.log(`The wrong format URL was this: ${message.attachments.first().url}`);
            return;
        }
        var img_url=message.attachments.first().url;
        var img_format=format_check.format_name;
    }
    else if (text_argument == undefined){
        message.channel.send('Incorrect mesage type, Airi only takes attachements or URLs. Run &imgnet help for more details on how to use this command')
        return;
    }
    else{
        message.channel.send('Incorrect mesage type, how is this even triggered');
        return;
    }

    //message.channel.send(`Heres your URL: ${img_url} ,acquiring now, the format is ${img_format}`);

    message.channel.send(`Image classification start`);


    //This is the classification sequence, its a super fat then chain, it can probably look better...?
    //Determine unique temporary file name
    let current_time=new Date();
    let time_string= current_time.getTime();
    console.log(`The current temporary path_time is ${time_string}`)
    //
    let recog_sequence = downloadImage(img_url,img_format,time_string).then(
    //on fufillment of download
    ()=>{

    //message.channel.send(`Download complete`);
    
    let image_file=`./commands/image_file_${time_string}${img_format}`;
    //console.log(image_file);
    //let IBuffer = fs.readFileSync('./commands/image_file.jpg');
    message.channel.send('Image download sucessful, classifying now...this might take a while');

    sharp(image_file).resize({width: 1000}).jpeg({quality: 100}).toFile('output.jpeg').then(()=>{
        ImgClassify('output.jpeg').then((predictions)=>{
            printResults(client, message, predictions, img_url);
        });
    }).then(()=>{
        console.log('Deleting temporary file')
        fs.unlinkSync('output.jpeg');
        fs.unlinkSync(image_file);
    }).then(()=>{
        return new Promise ((resolve)=>{resolve('Classficiation Complete')})
    }).catch((err)=>{console.log('error during classification step'); console.log(err);message.channel.send(`It errored, Adan needs to debug something...`)});

    
    },
    //on rejection of download
    (reason)=>{

    console.log(reason);
    message.channel.send(reason);

    return new Promise ((reject)=>{reject('Download Error')});

    }).catch(//final error catch
    (err)=>{

    message.channel.send(`An error has occured`);
    console.log(err);

    });


    let timed_out=timeout(10000);
    
    
    Promise.race([recog_sequence,timed_out]).then(()=>{message.channel.send('Classification sequence complete, it may have been sucessful.')},(reason)=>{
        message.channel.send('Timed out!');
        console.log(reason);
        return;
    }).catch((err)=>console.log(err));


}