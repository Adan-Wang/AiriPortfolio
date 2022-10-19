//ping command, does the regular ping thing

exports.run = async function (client,message,args,config) {
    const delay=Math.round(client.ping);
    let msg_time = message.createdTimestamp;
    const m = await message.channel.send('Ping test');
    let msg_sent_time=m.createdTimestamp;
    m.delete().catch(console.log('o_o'));
    let real_ping = msg_sent_time-msg_time;

    if(message.author.id == config.specificID){
        message.channel.send("[Joke Prompt]");
        message.channel.awaitMessages(msg => msg.author.id=config.specificID && msg.content.toLowerCase()=='yes',{max:1, time: 5000, errors:['time'] }).then((collected)=>{
            message.channel.send( `Ding'de ding ding ding, the API ping is ${delay} ms, your ping to Airi is ${real_ping} ms`);
            
            return;

        }).catch((collected) =>{
            message.channel.send(`[Joke], the API ping is ${delay} ms, your ping to Airi is ${real_ping} ms`);
            return;
        })
    }
    else{
        message.channel.send( `Ding'de ding ding ding, the API ping is ${delay} ms, your ping to Airi is ${real_ping} ms`);

    }


    
    
}