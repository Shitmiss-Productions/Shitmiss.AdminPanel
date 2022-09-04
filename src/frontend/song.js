"use strict";
let currentSong = "";
let currentDiff = "";
function updateScores(player, score, combo, acc) {
    p1counters = [0, 0, 0, 0];
    p2counters = [0, 0, 0, 0];
    // if (combo > 0) {
    // P1ComboCounter++;
    if (P1 == player) {
        console.log("P1 | Score: " + score + " | Combo: " + combo + " | ACC: " + acc + "%");
        acc = acc.toFixed(2);
        playertext1score.innerHTML = score;
        playertext1combo.innerHTML = combo + "x";
        playertext1acc.innerHTML = acc + "%";
    }
    if (P2 == player) {
        console.log("P2 | Score: " + score + " | Combo: " + combo + " | ACC: " + acc + "%");
        acc = acc.toFixed(2);
        playertext2score.innerHTML = score;
        playertext2combo.innerHTML = combo + "x";
        playertext2acc.innerHTML = acc + "%";
    }
}
function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || +2) + '})?');
    return num.toString().match(re)[0];
}
function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
async function getMap(LevelId, LevelDiff) {
    var songHash = LevelId.replace("custom_level_", "");
    var songDiff = LevelDiff;
    switch (songDiff) {
        case 0:
            var diffText = "Easy";
            var diffColor = "#008055";
            break;
        case 1:
            var diffText = "Normal";
            var diffColor = "#1268A1";
            break;
        case 2:
            var diffText = "Hard";
            var diffColor = "#BD5500";
            break;
        case 3:
            var diffText = "Expert";
            var diffColor = "#B52A1C";
            break;
        case 4:
            var diffText = "Expert+";
            var diffColor = "#900000";
            break;
    }
    if (currentSong != songHash) {
        currentSong = songHash;
        currentDiff = songDiff;
        console.log(currentSong + " " + currentDiff);
        fetch('https://api.beatsaver.com/maps/hash/' + songHash)
            .then(response => response.json())
            .then(data => {
            document.getElementById("SongBox").style.opacity = "0";
            setTimeout(function () {
                document.getElementById("SongCover").style.background = 'url(https://eu.cdn.beatsaver.com/' + songHash.toLowerCase() + '.jpg)';
                document.getElementById("SongCover").style.backgroundSize = 'cover';
                document.getElementById("SongCover").style.borderColor = diffColor;
                document.getElementById("SongInfo").style.borderColor = diffColor;
                document.getElementById("DiffTag").style.background = diffColor;
                if (data.metadata.songSubName !== "") {
                    document.getElementById("SongTitle").innerHTML = data.metadata.songName + " - " + data.metadata.songSubName;
                }
                else {
                    document.getElementById("SongTitle").innerHTML = data.name;
                }
                document.getElementById("SongMapper").innerHTML = data.metadata.levelAuthorName;
                document.getElementById("SongArtist").innerHTML = data.metadata.songAuthorName;
                document.getElementById("SongKey").innerHTML = data.id;
                document.getElementById("DiffText").innerHTML = diffText;
                document.getElementById("SongLength").innerHTML = fancyTimeFormat(data.metadata.duration);
                document.getElementById("SongBox").style.opacity = "1";
            }, 2000);
        });
    }
    else if (currentSong == songHash && currentDiff != songDiff) {
        currentDiff = songDiff;
        document.getElementById("DiffText").style.opacity = "0";
        setTimeout(function () {
            document.getElementById("DiffText").innerHTML = diffText;
            document.getElementById("DiffText").style.opacity = "1";
        }, 1000);
        document.getElementById("DiffTag").style.background = diffColor;
        document.getElementById("SongCover").style.borderColor = diffColor;
        document.getElementById("SongInfo").style.borderColor = diffColor;
    }
}
