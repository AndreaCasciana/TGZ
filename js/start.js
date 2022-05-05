//called when the website is opened
$(document).ready(function(){

//checks if the user is logged in and displays the menu if the user/admin is logged in
 updateAccountMenu();


 //gets the data of the category and displays the carousels on the main page//
    $.ajax({
        url: "https://scascian2.alwaysdata.net/Shooters",
        type: "GET",
        data: {
            'name': 'First person',
        },
        success: function (data) {
            for (let i = 0; i < 18; i++) {
                if (data[i].name.length > 25)
                    document.getElementById("titleFPS" + (i + 1).toString().replace(/^0/, '')).innerText = data[i].name.slice(0, 24) + "...";
                else
                    document.getElementById("titleFPS" + (i + 1).toString().replace(/^0/, '')).innerText = data[i].name;
                document.getElementById("idFPS" + (i + 1).toString().replace(/^0/, '')).innerText = data[i].id;
                document.getElementById("imgFPS" + (i + 1).toString().replace(/^0/, '')).src = data[i].cover.url.toString().replace('t_thumb', 't_cover_big');
                $("#"+ "cardFPS" + (i+1).toString().replace(/^0/,'')).stop(true,true).delay(200+i*300).show(200);
            }
            $("#titleCarousel1, #controlFPS").stop(true,true).delay(1100).show(200);
        }
    });

    $.ajax({
        url: "https://scascian2.alwaysdata.net/browseCategory",
        type: "GET",
        data: {
            'name': 'Platform',
        },
        success: function (data) {
            for(let i = 0; i< 18; i++){
                if(data[i].name.length > 25)
                    document.getElementById("titlePlatformer" + (i+1).toString().replace(/^0/,'')).innerText = data[i].name.slice(0, 24) + "...";
                    else
                    document.getElementById("titlePlatformer" + (i+1).toString().replace(/^0/,'')).innerText = data[i].name;
                    document.getElementById("idPlatformer" + (i + 1).toString().replace(/^0/, '')).innerText = data[i].id;
                document.getElementById( "imgPlatformer" +( i+1).toString().replace(/^0/,'')).src = data[i].cover.url.toString().replace('t_thumb','t_cover_big');
                $("#"+ "cardPlatformer" + (i+1).toString().replace(/^0/,'')).stop(true,true).delay(1500+i*100).show(200);
            }
            $("#titleCarousel2, #controlPlatformer").stop(true,true).delay(1800).show(200);
        }
    });

    $.ajax({
        url:  "https://scascian2.alwaysdata.net/start_mmorpg",
        type: "GET",
        success: function (data) {
            for(let i = 0; i< 18; i++){
                if(data[i].name.length > 25)
                    document.getElementById("titleMMORPG" + (i+1).toString().replace(/^0/,'')).innerText = data[i].name.slice(0, 24) + "...";
                else
                    document.getElementById("titleMMORPG" + (i+1).toString().replace(/^0/,'')).innerText = data[i].name;
                document.getElementById("idMMORPG" + (i + 1).toString().replace(/^0/, '')).innerText = data[i].id;
                document.getElementById( "imgMMORPG" +( i+1).toString().replace(/^0/,'')).src = data[i].cover.url.toString().replace('t_thumb','t_cover_big');
                $("#"+ "cardMMORPG" + (i+1).toString().replace(/^0/,'')).stop(true,true).delay(2500+i*100).show(200);
            }
            $("#titleCarousel3, #controlMMORPG").stop(true,true).delay(2800).show(200);
        }
    });

    $.ajax({
        url: "https://scascian2.alwaysdata.net/browseCategory",
        type: "GET",
        data: {
            'name': 'Role-playing (RPG)',
        },
        success: function (data) {
            for(let i = 0; i< 18; i++){
                if(data[i].name.length > 25)
                    document.getElementById("titleRPG" + (i+1).toString().replace(/^0/,'')).innerText = data[i].name.slice(0, 24) + "...";
                else
                document.getElementById("titleRPG" + (i+1).toString().replace(/^0/,'')).innerText = data[i].name;
                document.getElementById("idRPG" + (i + 1).toString().replace(/^0/, '')).innerText = data[i].id;
                document.getElementById( "imgRPG" +( i+1).toString().replace(/^0/,'')).src = data[i].cover.url.toString().replace('t_thumb','t_cover_big');
                $("#"+ "cardRPG" + (i+1).toString().replace(/^0/,'')).stop(true,true).delay(3800+i*100).show(200);
            }
            $("#titleCarousel5, #controlRPG").stop(true,true).delay(4100).show(200);
        }
    });

    $.ajax({
        url: "https://scascian2.alwaysdata.net/browseCategory",
        type: "GET",
        data: {
            'name': 'Racing',
        },
        success: function (data) {
            for(let i = 0; i< 18; i++){
                if(data[i].name.length > 25)
                    document.getElementById("titleRacing" + (i+1).toString().replace(/^0/,'')).innerText = data[i].name.slice(0, 24) + "...";
                else
                    document.getElementById("titleRacing" + (i+1).toString().replace(/^0/,'')).innerText = data[i].name;
                document.getElementById("idRacing" + (i + 1).toString().replace(/^0/, '')).innerText = data[i].id;
                document.getElementById( "imgRacing" +( i+1).toString().replace(/^0/,'')).src = data[i].cover.url.toString().replace('t_thumb','t_cover_big');
                $("#"+ "cardRacing" + (i+1).toString().replace(/^0/,'')).stop(true,true).delay(3500+i*100).show(200);
            }
            $("#titleCarousel4, #controlRacing").stop(true,true).delay(3800).show(200);
        }
    });
});
//gets the data of the category and displays the carousels on the main page//