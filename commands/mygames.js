//Sort function to do total game time, the return values are reversed as I want to sort by descending order
function compare_time_total(a,b){
    if (a.time_total>b.time_total){
        return -1;
    }
    if (a.time_total<b.time_total){
        return 1;
    }
    return 0;
}

function compare_time_last_played(a,b){
    if (a.time_last_played>b.time_last_played){
        return -1;
    }
    if (a.time_last_played<b.time_last_played){
        return 1;
    }
    return 0;
}

//Convert ms to hours, minutes, and seconds and output as a string
function militohour_string(ms){
    var n_ms=parseInt(ms,10);
    var n_s=Math.round(n_ms/1000);
    var hours=Math.floor(n_s/3600);
    var minutes=Math.floor((n_s%3600)/60);
    var seconds=n_s%3600%60;

    var str=`${hours} hours ${minutes} minutes and ${seconds} seconds`

    return str;

}

exports.run = function (client,message,args,config){
    const fs = require("fs");
    const people = require("../Profiles.json");
    const util = require("../Util.js");
    var game_record=JSON.parse(fs.readFileSync("./game_status.json","utf8"));

    let out_obj={};
    let out_array=[];
    let member_id=message.author.id;
    
    //out_array.push({id:game_record[i].id, game_name=game_record[i].games_name[j], game_time=game_record[i].time_total[j]})

         for (var i=0;i<game_record.length;i++){
            if (game_record[i].id==member_id){
                out_obj=game_record[i]
                break;
            }
        }

    
        //util.Echo(out_obj);
        //util.Echo(out_array);
        //Could improve the error handling here, but this will do for now
        //Basically, if the fetched array is empty, return an error
        try{
            for(var i=0;i<out_obj.games_name.length;i++){
                //Convert Epoch time (time since 1970-01-01 to human readable object)
                var date_converted = new Date(out_obj.time_lastplayed[i]);
                var time_lastplayed_string=util.date_to_time(date_converted);
                var last_session_end_time = "???";
                var last_session_length = "??? amount of time";

                var session_info=out_obj.session_info;
                //console.log(session_info);

                if (typeof session_info != "undefined"){
                    var session_elements=session_info[i];
                    //console.log(session_elements);
                    if (session_elements != null){
                        //console.log(session_elements);
                        session_dates=session_elements.session_date;
                        session_lengths=session_elements.session_length;
                        last_session_end_time = session_dates[session_dates.length-1];
                        last_session_length = util.ms_to_readable(session_lengths[session_lengths.length-1]);

                    }
                }
                
                out_array.push({games_name:out_obj.games_name[i],time_total:out_obj.time_total[i],time_last_played:out_obj.time_lastplayed[i], time_lastplayed_str:time_lastplayed_string, last_session_end:last_session_end_time, last_session_length_out: last_session_length})
            }
            //util.Echo(out_array);
            if (args[0] == 'recent') {
                out_array.sort(compare_time_last_played);
            }
            else {
                out_array.sort(compare_time_total);
            }
        }
        catch(err){
            console.error(err);
            message.channel.send(`Fetch unsucessful, have you played games while I'm here?`)
            return;
        }
        //util.Echo(out_array);
        
    

    //Output message
    var msg=`\`\`\`Personal Gaming Time Ranking (Based on time spent in game) \n`+ `Tracking based on as far as Airi knows..if Airi is not online Airi doesn't know you're playing~ \n`;
    for (var i=0;i<8;i++){
        try{
        msg += `${i+1}) ${out_array[i].games_name} - Total Time: ${militohour_string(out_array[i].time_total)}, Last Launch: ${out_array[i].time_lastplayed_str}, Last Session: Ended on ${out_array[i].last_session_end} for ${out_array[i].last_session_length_out}\n`;
        }
        catch(err){
        console.log(`Error occured in mygames.js: ${err}`);
        msg += `${i+1}) \n`
        }
    }
    msg+=`\`\`\``

    message.channel.send(msg);
    


    
}