

//Airi v 1.00
//Discord Core
const Discord = require("discord.js");
const fs = require("fs");

//json files
const config = require ("./config.json");
const quotes = require("./oyasumi.json");
const words = require("./Dictionary.json");
const people = require("./Profiles.json");
const songs_games=require("./songs_games.json");

//Global Constants
const client = new Discord.Client();
const prefix = config.prefix;
const alpha = config.alpha;

//Global Variables

//var game_record= [];
//var game_record_legacy=JSON.parse(fs.readFileSync("./game_status.json","utf8"));
var game_record=JSON.parse(fs.readFileSync("./game_status.json","utf8"));
var id_records=game_record.map(xx=>xx.id);
//Debug file for game logs
const game_change_logs=`GameChangeLogs.txt`

//Command js Files
const util = require("./Util.js");

//let command_files_priv=require("./commands/priv")

//Cooldown trackers
let cd_where=0;
let cd_whereall=0;
let cd_imgnet=0;
let status_update_cd=false;



client.on("ready",()=> {console.log("Setup")
    client.user.setActivity(`v1.10 | &help`);
    //client.user.setActivity([`Enjoying my pie`]);

    client.users.fetch(config.OwnerID).then( (owner)=>{
        owner.createDM().then((dm_channel)=>{
            let ready_time=client.readyAt;
            let date_string=util.date_to_time(ready_time);



            dm_channel.send(`Local Time: ${date_string}`);
            dm_channel.send("Airi start/restart is completed");
        })
    })
    
});


client.on("message",(message)=>{
    //Bot checker/blacklist checker
    if (message.author.bot && message.author.id != people.redacted.ID){ return;
    }
    //console.log(client.user.presence.activities);

    //whos talking?
    var talker = util.talkercheck(people,message);

    //Airi random status update
    if (client.uptime>=1800*1e3){
        if (status_update_cd==false){
            client.user.setActivity(`${util.ReplyRdm(songs_games.songs,songs_games.games,songs_games.memes)} | &help`);
            status_update_cd=true;
        }
        setTimeout(()=>{
            status_update_cd=false;
        },3600*1e3);

    }
    //Echo(message.author.id);

    //util.Echo(talker); 

    //Chatbot Functionalities
    var res=Math.random();
    if (!message.content.startsWith(prefix) && res >= alpha){
        return;
         }
    
    if(util.DictionaryStart (message,...words.greet_start) && !util.DictionaryStart(message,...words.sleep_start)){
        if (talker==null){
                message.channel.send(util.ReplyRdm(quotes.greet,quotes.greet_indep));
        }
        else{
                message.channel.send(util.ReplyRdm(quotes.greet)+' '+util.ReplyRdm(talker.nicknames));
                if(Math.random()>=config.unique_reply_rate){
                    message.channel.send(util.ReplyRdm(talker.uniqe_greets));
                }
            }
    }

        //make a dictionary file? -->DONE
    if(util.DictionaryStart (message,...words.sleep_start)){
           

            let time_hr=message.createdAt.getHours();
            //util.Echo(time_hr);
            message.channel.send(util.ReplyRdm(quotes.sleep));
    
            if (time_hr>8 && time_hr<21){
                message.channel.send(util.ReplyRdm(quotes.sleep_tooearly));
            }
            else if(time_hr >=21 || time_hr <=2 ){
            }
            else if(time_hr>2 && time_hr <=8){
                message.channel.send(util.ReplyRdm(quotes.sleep_toolate))
            }
            
    }

    if(util.DictionaryStart(message,...words.where_start) && !util.DictionaryStart(message,...words.where_all_start)){
        var keyword=util.DictionaryStartWord(message,...words.where_start);
        //console.log(keyword);
        message.content=message.content.toLowerCase().slice(keyword.length).trim();
        message.content=`&where ${message.content}`;

    }

    if(util.DictionaryStart(message,...words.where_all_start)){
        //console.log('durr');
        message.content=`&whereall`;
    }

    if (util.DictionaryStart(message,...words.morning_start)){
        let time_hr=message.createdAt.getHours();
        //util.Echo(time_hr);
        

        if (time_hr>5 && time_hr<13){
            message.channel.send(util.ReplyRdm(quotes.morning));
        }
        else if(time_hr >=13 || time_hr <=3 ){
            message.channel.send(util.ReplyRdm(quotes.morning_late));
        }
        else if(time_hr>3 && time_hr <=5){
            message.channel.send(util.ReplyRdm(quotes.morning_tooearly))
        }

    }

    if(message.content.startsWith('!8ball')){
        message.channel.awaitMessages(msg => msg.author.id == people.redacted.ID,{max:1, time: 5000, errors:['time'] }).then((collected)=>{
            let rdm=Math.random();
            if (rdm>0.5){
                message.channel.send(util.ReplyRdm(quotes.correct_8ball))
            }
            else{
                message.channel.send(util.ReplyRdm(quotes.incorrect_8ball))
            }
        }).catch((collected) =>{
            message.channel.send(util.ReplyRdm(quotes.wangbot_missing))
        })
    }

    if(util.DictionaryStart(message,...words.dad_start)){
        let rdm_dad=0.3;
        if (message.author.id==people.redacted.ID){
            rdm_dad=0.45;
        }

        if(Math.random()<=rdm_dad){
            var keyword_dad=util.DictionaryStartWord(message,...words.dad_start);
            let dad_message=message.content.slice(keyword_dad.length).trim().split(" ");
            console.log(dad_message);
            console.log(dad_message.length);
            if (dad_message.length==1){
                let reply_message=`Hi ${dad_message}, I'm Airi. \n`
                message.channel.send(reply_message);
            }
            
        }

    }
            
        


    
    //PREFIX DETECTION
    if (message.content.startsWith(prefix)){

    //Arguments and command name grab
    const args=message.content.slice(prefix.length).trim().split(/ +/g);
    //.shift() command eliminates the first part of the args array, so it gets rid of the command word, and leaves args array with just the content afterwards
    const command = args.shift().toLowerCase(); 

    //Public Command Section
    try{
    let command_files=require("./commands/index.js");
    if (command=='where'){
        if (cd_where==1){
        message.channel.send('Calm down there..this command is currently on cooldown');
        return;
        }
        cd_where=1;
        setTimeout(()=>{
            cd_where=0;
        },5000);
    }
    if (command=='whereall'){
        if (cd_whereall==1){
        message.channel.send('Calm down there..this command is currently on cooldown');
        return;
        }
        cd_whereall=1;
        setTimeout(()=>{
            cd_whereall=0;
        },15000);
    }
    if (command=='imgnet'){
        if (cd_imgnet==1){
        message.channel.send('Calm down there..this command is currently on cooldown, CD time is ~30 seconds for ImgNet');
        return;
        }
        //Only load imagenet when its called, this will hopefully prevent some errors that requries Airi to restart as often
        let imgnet_command=require("./commands/ImgNet.js");
        imgnet_command.run(client,message,args,config);
        cd_imgnet=1;
        setTimeout(()=>{
            cd_imgnet=0;
        },15000);
    }
    if (command != 'imgnet'){
    command_files[command].run(client,message,args,config);
    }

    }
    catch(err){
        console.error(err);
        message.channel.send("Error");
    }

    } //Bracket for prefix detection
    


});

///-------------------------------------------------------PRESENCE COMMANDS--------------------------------------------------------------------------

client.on("presenceUpdate",(oldMember, newMember)=>{
    //The first return is here because discordjs makes oldmember undefined if the client has not seen them online before
    if (oldMember==undefined){
        console.log('old member was UNDEFINED!');
        return;
    }

    //This second return ensures that bot activity changes are not being recorded
    if (oldMember.user.bot || newMember.user.bot){
        return;
    }

    //This third return stops double counting - it only counts presence changes in the main_server
    if (oldMember.guild.id != config.main_server_ID|| newMember.guild.id != config.main_server_ID){
        return;
    }
    let old_activity_empty=1;
    let new_activity_empty=1;

    //console.log(oldMember);
    //console.log(newMember);

//check what sort of presence change it is, if its just a status change (activities are empty for new and old) or a change of "listening or streaming, we forget about it"
//First get arrays
let old_activity_arr=oldMember.activities;
let new_activity_arr=newMember.activities;

//console.log(old_activity_arr);
//console.log(new_activity_arr);

var old_game=null;
var new_game=null;

old_activity_arr.forEach(v=>{
    console.log(`checking old array`)
    if (v.type==`PLAYING`){
        //console.log("found it!")
        old_game=v;
    }
})

new_activity_arr.forEach(v=>{
    console.log(`checking new array`)
    if (v.type==`PLAYING`){
        //console.log("found it!")
        new_game=v;
    }
})
//console.log(old_game);
//console.log(new_game);

//This filters the game, if the activity change is not associated with a game, stop the code

// if (old_game==null && new_game==null ){
//     //console.log('This activity update does nothing');
//     return;
// }




    const ready_time=client.readyAt.getTime();
    //util.Echo("durr, it happened");
    var current_time=new Date();
    //util.Echo(current_time);
    //console.log(util.date_to_time(current_time));
    current_time=current_time.getTime();
    
    var mem_id=newMember.user.id;

    if (new_game!=null && !new_game.equals(old_game)) {
        //util.Echo("durr, new game is not null");
        ii=id_records.indexOf(mem_id);
        if(ii==-1){
        id_records.push(mem_id);
        game_record.push({id:mem_id, games_name:[],time_lastplayed:[],time_total:[]})
        ii=id_records.indexOf(mem_id);
        }

        game_name_new=new_game.name;
        jj=game_record[ii].games_name.indexOf(game_name_new);
    

        if (jj==-1){
        game_record[ii].games_name.push(game_name_new);
        game_record[ii].time_lastplayed.push(current_time);
        game_record[ii].time_total.push(0);
        }
        else {
        game_record[ii].time_lastplayed[jj]=current_time;
        }
        //util.Echo(game_record[ii]);
    }

    if (old_game!=null && !old_game.equals(new_game)) {
        //util.Echo("durr, old game is not null");
        ii=id_records.indexOf(mem_id);
        if(ii==-1){
            id_records.push(mem_id);
            game_record.push({id:mem_id, games_name:[],time_lastplayed:[],time_total:[]})
            ii=id_records.indexOf(mem_id);
        }
    
        game_name_old=old_game.name;
        jj=game_record[ii].games_name.indexOf(game_name_old);
        
    
        if (jj==-1){
            game_record[ii].games_name.push(game_name_old);
            game_record[ii].time_lastplayed.push(ready_time);
            game_record[ii].time_total.push(0);
            jj=game_record[ii].games_name.indexOf(game_name_old);
        }

        //util.Echo(game_record[ii].time_lastplayed[jj]);
        //If the last played time is before the ready time (i.e. a disconnect has occured), and if we calculate last played time and its more than 5 hours, we give 5 hours of credit regardless of how many hours actually occured
        //This is to prevent issues such as airi disconnect for more than a day, and giving massive hours due to previous unfinished changes
        if(game_record[ii].time_lastplayed[jj]<ready_time && (current_time-game_record[ii].time_lastplayed[jj])>5*(3600*1e3)){
            game_record[ii].time_lastplayed[jj]=current_time-5*(3600*1e3);
        }
        
        
        try {
            fs.appendFileSync(`${game_change_logs}`,
                `------------------------- \n \n 
        Date: ${util.date_to_time(new Date(current_time))} \n 
        [User Name (oldMember)]: ${oldMember.user.username} \n 
        [User Name (newMember)]: ${newMember.user.username} \n 
        [Game]: ${game_name_old} \n 
        [Last Start]: ${util.date_to_time(new Date(game_record[ii].time_lastplayed[jj]))} \n 
        [Session Length(ms)]: ${current_time - game_record[ii].time_lastplayed[jj]} \n 
        [Session Length (Readable)]: ${util.ms_to_readable(current_time - game_record[ii].time_lastplayed[jj])} \n
        [Time on Record Before Update(ms)]: ${game_record[ii].time_total[jj]} \n 
        [Time on Record Before Update(Readable)]: ${util.ms_to_readable(game_record[ii].time_total[jj])} \n`,
            );
        }
        catch (err) {
            console.log(err);
        }

        game_record[ii].time_total[jj] += current_time - game_record[ii].time_lastplayed[jj];

        if (typeof game_record[ii].session_info == 'undefined') {
            game_record[ii].session_info=[];
        }

        if (typeof game_record[ii].session_info[jj] == 'undefined' || game_record[ii].session_info[jj] == null ) {
            game_record[ii].session_info[jj]={session_date:[],session_length:[]};
        }
            
        game_record[ii].session_info[jj].session_date.push(util.date_to_time(new Date(current_time)));
        game_record[ii].session_info[jj].session_length.push(current_time - game_record[ii].time_lastplayed[jj]);


        try {
            fs.appendFileSync(`${game_change_logs}`, `
        [Time on Record After Update(ms)]: ${game_record[ii].time_total[jj]} \n
        [Time on Record After Update (Readable)]: ${util.ms_to_readable(game_record[ii].time_total[jj])} \n \n`,
            );
        }
        catch (err) {
            console.log(err);
        };

        //util.Echo(game_record[ii]);

        }

    fs.writeFile("./game_status.json", JSON.stringify(game_record), (err) => {
        if (err) {
            console.error(err)
        };
    })

})

client.login(config.token);

