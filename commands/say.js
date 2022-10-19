//say command, deletes the &say message and just saids it
exports.run = function (client,message,args,config){

    message.channel.send(message.content.slice(4).trim());
    message.delete();
    
}
