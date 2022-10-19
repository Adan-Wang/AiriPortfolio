//Converts date to human readable string
exports.date_to_time = function (input_date) {
    let hours=null;
    let minutes=null;
    let seconds=null;
    
    //To fix the issue that sometimes it shows "x" for obtianed values when it should read "0x", for example, am hours, 0x minutes, and 0x seconds
    hours = input_date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    minutes = input_date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    seconds = input_date.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }


    let out_string = `${input_date.getFullYear()}-${input_date.getMonth() + 1}-${input_date.getDate()} at ${hours}:${minutes}:${seconds}`;
    return out_string;



}
//Convert value in ms to something human readable
exports.ms_to_readable = function(input_ms){
    var n_ms=parseInt(input_ms,10);
    var n_s=Math.round(n_ms/1000);
    var hours=Math.floor(n_s/3600);
    var minutes=Math.floor((n_s%3600)/60);
    var seconds=n_s%3600%60;
    var str=`${hours} hours ${minutes} minutes and ${seconds} seconds`

    return str;

}

//exact start
exports.DictionaryStart = function (input_msg) {
    for (var i = 1; i < arguments.length; i++) {
        let length_of_arg = arguments[i].length;
        if (input_msg.content.toLowerCase().startsWith(arguments[i]) && (input_msg.content[length_of_arg] == null || input_msg.content[length_of_arg] == ' ')) {
            return 1;
        }
    }
    return 0;
}

exports.DictionaryStartWord = function (input_msg) {
    for (var i = 1; i < arguments.length; i++) {
        if (input_msg.content.toLowerCase().startsWith(arguments[i])) {
            return arguments[i];
        }
    }
    return 0;
}


exports.Echo = function (input) {
    return console.log(input);
}

exports.ReplyRdm = function (subj) {
    if (arguments.length > 1);
    for (var i = 1; i < arguments.length; i++) {
        subj = subj.concat(arguments[i])
    }
    var n = Math.floor((subj.length) * Math.random())
    return subj[n]
}

exports.talkercheck = function (people, message) {
    switch (message.author.id) {
        case people.Person1.ID:
            talker = people.Person1;
            break;

        case people.Person2.ID:
            talker = people.Person2;
            break;

        case people.adan.ID:
            talker = people.adan;
            break;

        case people.Person4.ID:
            talker = people.Person4.school;
            break;

        case people.Person5.ID:
            talker = people.Person5;
            break;

        case people.Person6.ID:
            talker = people.Person6;
            break;

        case people.Person7.ID:
            talker = people.Person7;
            break;

        case people.Person8.ID:
            talker = people.Person8;
            break;

        case people.Person9.ID:
            talker = people.Person9;
            break;

        case people.Person10.ID:
            talker = people.Person10;
            break;

        case people.Person11.ID:
            talker = people.Person11;
            break;

        default:
            talker = null;

    }
    return talker;
}
