const help= require('./helpfile.js');
const helpfile = help.help();

exports.run = function(client,message,args,config) {
    message.channel.send("Help My!")
    message.channel.send(helpfile);

}