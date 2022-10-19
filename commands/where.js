//where is everyone?

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


exports.run=async function(client,message,args,config){
    const quotes = require("../oyasumi.json");
    const words = require("../Dictionary.json");
    const people = require("../Profiles.json");
    const util = require("../Util.js");

    if (args[0]==null){
        message.channel.send("Can only display one person with this command, use &whereall for everyone.");
        return;
    }




    const name_of_person = message.content.slice(config.prefix.length+5).trim().toLowerCase();
    //util.Echo(name_of_person);
    
    var id=null;
//Search for person
 for (var i in people){
     names =people[i].nicknames.concat(people[i].aka);
    
     for (var j=0; j<names.length;j++){
         if (name_of_person == names[j].toLowerCase()){
             //util.Echo("Found them!!")
             //util.Echo(names[j]);
             id=people[i].ID;
             break;
         }
     }
     if (id!=null){
         break;
     }
 }
 //util.Echo(id);
 
 /*if (id!=null){
    message.channel.send(`Found them! The person is ${util.ReplyRdm(people[i].nicknames).toLowerCase()}`)
    
 }*/
 //If the person is not recorded
 if (id==null) {
    message.channel.send(`I don't know this person...`)
    return;
 }
 if (id==people.airi.ID){
     message.channel.send(`I'm right here >.>`)
     return;
 }

//If the person is recorded
 try{
    //Assign object
    person=await message.guild.members.fetch(id);
    //console.log(person);
    //Assign name for this instance
    tempname=util.ReplyRdm(people[i].nicknames);
    if (person == null){
        message.channel.send(`This person isn't in this server...`);
        return;
    }
 }
 catch(err){
     message.channel.send(`Something is wrong grabbing the person's ID, go check your code`)
     return;
 }

 var game_phrase=``
//Check their game status and generate game phrase
 if (person.presence.activites != null){
    var curr_game=person.presence.activities.name
    game_phrase=`They're playing ${curr_game}`;
 }
 else{
     var curr_game=null;
     game_phrase=`They don't seem to be playing games...`;
 }

 
 //Check their current status and generate status phrase(s)
 const curr_status=person.presence.status;
 console.log(person.presence);
 console.log(person.presence.status);
 console.log(person);
 var last_message=``;
 var last_message_time=``;
 var last_msg_phrase=``;
 var status_phrase = ``;
 var search_type = ``;
 var temp_messagelog = '';
 var min_time=0;
 //var self=client.user;




 if (person.lastMessage !=null){
     //SimpleSearch
    last_message=person.lastMessage.content;
    last_message_time=person.lastMessage.createdAt;
    search_type=`SimpleSearch`;
    if (curr_status == 'online'){
        status_phrase=util.ReplyRdm(quotes.online_status);
        last_msg_phrase=`**Latest Message**: "\`${last_message}" -- ${tempname} at ${last_message_time}.\``;
     }
     else if (curr_status=='offline'){
         status_phrase=util.ReplyRdm(quotes.offline_status);
         game_phrase=``;
         last_msg_phrase=`**Latest Message**: "\`${last_message}" -- ${tempname} at ${last_message_time}.\``;
     }
     else if  (curr_status=='idle'){
         var status_phrase=util.ReplyRdm(quotes.idle_status);
         last_msg_phrase=`**Latest Message**: "\`${last_message}" -- ${tempname} at ${last_message_time}.\``;
     }
     else if (curr_status == 'dnd'){
         curr_status='do not disturb';
         status_phrase=util.ReplyRdm(quotes.dnd_status);
         last_msg_phrase=`**Latest Message**: "\`${last_message}"  -- ${tempname} at ${last_message_time}.\``;
     }
        //util.Echo(last_message_time);
        msg=`${search_type}...complete, ${tempname}'s current status is ${curr_status}.${status_phrase} ${game_phrase} \n${last_msg_phrase}`;
        
    
        //self.lastMessage.delete();
        message.channel.send(msg);
    }
 else{
     //AdvancedSearch
     //console.log("AdvancedSearch start")
     var last_message_obj={content:[], time:[], abs_time: []};
     
     //console.log(last_message_obj.content);
     //console.log(last_message_obj.time);
     var msgfetch_promises_arr=[];
     var min_time=0;
     avai_channels=message.guild.channels.cache;
     message.channel.send("SimpleSearch failed to retrive data..conducting AdvancedSearch..this might take a while.");

        AdvancedSearch(avai_channels,last_message_obj,id,msgfetch_promises_arr);
        Promise.all(msgfetch_promises_arr).then( () => {
            for (i=0;i<last_message_obj.abs_time.length;i++){
                var curr_time=last_message_obj.abs_time[i];

                if (last_message_obj.abs_time[i]>=min_time){
                    min_time=curr_time;
                    last_message=last_message_obj.content[i];
                    last_message_time=last_message_obj.time[i]

                }

            }
            search_type='AdvancedSearch';
            if (curr_status == 'online'){
                status_phrase=util.ReplyRdm(quotes.online_status);
                last_msg_phrase=`**Latest Message**: "\`${last_message}" -- ${tempname} at ${last_message_time}.\``;
             }
             else if (curr_status=='offline'){
                 status_phrase=util.ReplyRdm(quotes.offline_status);
                 game_phrase=``;
                 last_msg_phrase=`**Latest Message**: "\`${last_message}" -- ${tempname} at ${last_message_time}.\``;
             }
             else if  (curr_status=='idle'){
                 status_phrase=util.ReplyRdm(quotes.idle_status);
                 last_msg_phrase=`**Latest Message**: "\`${last_message}" -- ${tempname} at ${last_message_time}.\``;
             }
             else if (curr_status == 'dnd'){
                 curr_status='do not disturb';
                 status_phrase=util.ReplyRdm(quotes.dnd_status);
                 last_msg_phrase=`**Latest Message**: "\`${last_message}"  -- ${tempname} at ${last_message_time}.\``;
             }
                //util.Echo(last_message_time);
                msg=`${search_type}...complete, ${tempname}'s current status is ${curr_status}. ${status_phrase} ${game_phrase} \n${last_msg_phrase}`;
                
            
                //self.lastMessage.delete();
                message.channel.send(msg);

        })

     


    }
    

}