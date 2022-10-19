function compare(a,b){
    if (a.game_time>b.game_time){
        return -1;
    }
    if (a.game_time<b.game_time){
        return 1;
    }
    return 0;
}

function militohour_string(ms){
    var n_ms=parseInt(ms,10);
    var n_s=Math.round(n_ms/1000);
    var hours=~~(n_s/3600);
    var minutes=~~((n_s%3600)/60);
    var seconds=n_s%3600%60;

    var str=`${hours} hours ${minutes} minutes and ${seconds} seconds`

    return str;

}


exports.run = async function (client,message,args,config){
    const fs = require("fs");
    const game_record=JSON.parse(fs.readFileSync("./game_status.json","utf8"));
    const people = require("../Profiles.json");
    const util = require("../Util.js");
    
    let out_array=[];
    
    //out_array.push({id:game_record[i].id, game_name=game_record[i].games_name[j], game_time=game_record[i].time_total[j]})

    for (var i=0;i<game_record.length;i++){
        //util.Echo(`the id is ${out_array[i].id}`)
        try{
        out_array.push({game_name:null, game_time:null,name_of_person:null})

        //client version
        let current_user= await client.users.fetch(game_record[i].id);
        //console.log(current_user);
        let name=current_user.username;

        //guild version
        //let name=message.guild.members.resolve(game_record[i].id).displayName;
        out_array[i].name_of_person=name;
        }
        catch(err){
        console.log(err);
        continue;
        }
        var min_time=0;
        for (var j=0;j<game_record[i].games_name.length;j++){
            var curr_time=game_record[i].time_total[j];

            if (curr_time>min_time){
                min_time=curr_time;
                out_array[i].game_name=game_record[i].games_name[j];
                out_array[i].game_time=game_record[i].time_total[j];
            }
            
        }
        //util.Echo(out_array);
        
    }

    out_array.sort(compare);
    var msg=`\`\`\`Gaming Time Ranking (Based on time spent on most played game) \n`+ `Tracking based on as far as she knows..if she's not online she doesn't know you're playing~ \n`;
    for (var i=0;i<10;i++){
        try{
        msg += `${i+1}) ${out_array[i].name_of_person}:${out_array[i].game_name} for ${militohour_string(out_array[i].game_time)}. \n`
        }
        catch(err){
        //console.log(err);
        msg += `${i+1}) \n`
        }
    }
    msg+=`\`\`\``

    message.channel.send(msg);
    


    
}