//Where is EVERYONE?

function AdvancedSearch(available_channels,last_msg,id,msgfetch_promises){
    for (let v of available_channels.values()){
        //util.Echo(v);
        if (v.type=='text'){

               let msgfetch_promise=v.messages.fetch({limit: 100}).then((messages) => {
           
                   for (let vv of messages.values()) {

                       if (vv.author.id == id){
                            last_msg.abs_time.push(vv.createdAt.getTime());
                            last_msg.content.push(vv.content);
                            last_msg.time.push(vv.createdAt);
                           //console.log(last_msg.content);
                           break;
                           
                       
                       }

                   }
               }).catch(console.error);
        
               msgfetch_promises.push(msgfetch_promise);

        }
        //var temp_messagelog=v.fetchMessages({limit: 250});
    }



}

function printStatus(client,message,arr_member){
    const Discord = require ('discord.js');
    var embed = new Discord.MessageEmbed()
    .setTitle("Where did everyone go?")
    .setColor('BLUE')
    .setThumbnail('thumbnail',true)

    for (var i=0;i<arr_member.length;i++){
        embed.addField(`${arr_member[i].name}`,`\*\*Status:\*\* ${arr_member[i].status}\n\*\*Last Seen:\*\* ${arr_member[i].last_msg_time}\n\*\*Last Message:\*\* ${arr_member[i].last_msg_cont}  \n\*\*-----------------------------------------------------\*\* \n`);
        //embed.addField(`Status`,`${arr_member[i].status}`);
        //embed.addField(`Last Message`,`Last Message: ${arr_member[i].last_msg_cont}`);
        //embed.addField(`Last Seen`,`${arr_member[i].last_msg_time}`)
       // embed.addBlankField();
    }
    embed.setFooter('TextHere')
    message.channel.send(embed);


    

   /* msg=`\`\`\`           Where did everyone go?          \n`;
    for (var i=0;i<arr_member.length;i++){
        msg += `${arr_member[i].name} \n` +
        `Status: ${arr_member[i].status} \n`+
        `Last Message: ${arr_member[i].last_msg_cont} \n`+
        `Last Seen: ${arr_member[i].last_msg_time} \n`+
        `\n`;
    }
    msg+=`\`\`\` \n`;

    message.channel.send(msg);*/

}

async function OutputStatus(client,message,args,config, arr_member){
    var AS_active=0;
    for (var i=0;i<arr_member.length;i++){
        //assign object
        var person=await message.guild.members.fetch(arr_member[i].id).catch(err=>{
            
            console.log(err);
            person=null;

        });
        if (person == null){
            arr_member[i].status='Not in this server';
            arr_member[i].last_msg_cont='Not in this server';
            arr_member[i].last_msg_time='Not in this server';
            continue;
        }
        arr_member[i].status=person.presence.status.toUpperCase();
        if(person.lastMessage !=null){
            //Simple
            arr_member[i].last_msg_cont=person.lastMessage.content;
            arr_member[i].last_msg_time=person.lastMessage.createdAt;
        }
        else{
            //Advance Search
            AS_active=1;
            var avai_ch=message.guild.channels.cache;
            var last_message_obj={content:[],time:[],abs_time:[]};
            var msg_promise_arr=[];
            var msgfetch_promise_arr=[];

            var memberfetch_promise_arr=[];
            var min_time=0;
            var last_message=``;
            var last_message_time=``;
            console.log('checkpoint - AS');
            AdvancedSearch(avai_ch,last_message_obj,arr_member[i].id,msgfetch_promise_arr);

            var memberfetch_promise=Promise.all(msgfetch_promise_arr).then(()=>{
                for (var j=0;j<last_message_obj.abs_time.length;j++){
                    var curr_time=last_message_obj.abs_time[j];
        
                        if (last_message_obj.abs_time[j]>=min_time){
                            min_time=curr_time;
                            last_message=last_message_obj.content[j];
                            last_message_time=last_message_obj.time[j]
                        }
        
                }
            }).catch(console.error);
            memberfetch_promise_arr.push(memberfetch_promise);
            //console.log(i)
            await memberfetch_promise;
            //console.log(arr_member[i])
            //console.log(i)
            arr_member[i].last_msg_cont=last_message;
            arr_member[i].last_msg_time=last_message_time;
        }
         
    }

    if (AS_active==1){
        Promise.all(memberfetch_promise_arr).then(()=>{
            //console.log(arr_member);
            printStatus(client,message,arr_member);
        }).catch(console.error);
    }
    else{
            printStatus(client,message,arr_member);
            //console.log(arr_member);
    }


}

//initialize local person profile prototype
function Member(name,id,status,last_msg_cont,last_msg_time){
    this.name=name;
    this.id=id;
    this.status=status;
    this.last_msg_cont=last_msg_cont;
    this.last_msg_time=last_msg_time;
}

exports.run=function(client,message,args,config){
    //load stuffs
    const quotes = require("../oyasumi.json");
    const words = require("../Dictionary.json");
    const people = require("../Profiles.json");
    const util = require("../Util.js");

    //Generate id array
    var id_arr=[];
  
    
    //initialize array of person objects
    var arr_member=[]
    //generate array of people of interest
    for (var i in people){
        if(people[i].whereall_incl!=1){
            continue;
        }
        var current_person=new Member(people[i].nicknames[0],people[i].ID,null,null,null);
        arr_member.push(current_person);
    }
    //console.log(arr_member);
    
    

    //check and fill in status and last message
    OutputStatus(client,message,args,config,arr_member);
   
    //console.log(WAS_active)








}