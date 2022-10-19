
exports.run = function(client,message,args,config) {
    //Intruder detection
    if (message.author.id != config.OwnerID ){
        message.channel.send("Go away, this is admin only");
        return;
    }
    else{
        let command_files=require("./index.js");
        let command=args.shift().toLowerCase();

        if (command == "np"){
            //message.channel.send("now playing.....")
            client.user.setActivity(message.content.slice(config.prefix.length+command.length+6).trim()); //6 is the length of the word "admin" and one space, since the command reads &admin np whatever, we need to slice the lengthof(&)+lengthof(admin)+SPACE+lengthof(np)
        } 

        if(command=="reload"){
            if (args[0]==null) {
                message.channel.send("Must refresh a command");
                return;
            }
            const command_name=args[0];
            for (var i=0;i<command_files.known_commands.length;i++){
                if (command_name==command_files.known_commands[i]){
                    delete require.cache[require.resolve('./index.js')]
                    delete require.cache[require.resolve(`./${command_name}.js`)];
                    message.channel.send(`All done! Reloaded ${args[0]} `);
                    return;
                }
            }
            message.channel.send(`That's not a valid command`);
        }

    
    
    
    
    }
    
}