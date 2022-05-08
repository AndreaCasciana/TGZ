var offsetTemp =0, nElements = 0,  dataResponse;

//displays  the game information window when clicked on a game
function displayInformation(){
    $("#carousels, #gameQuery, footer").fadeOut(500);
    $("#gameInformation").delay(700).fadeIn(1000);
    $("footer").stop(true, true).delay(700).fadeIn(100);
    $(".navbar-collapse").collapse('hide');
}

//function for the back button, it returns to the previous page or main page based on where you are
function mainPage(){
    var backToSection = $("#back").attr('back');
    $("#descHidden").collapse('hide');
    $("#gameInformation, footer").fadeOut(500);
    stopTrailer(); clearLabels();
    if(backToSection == "Query") {
        $("#gameQuery").stop(true, true).delay(500).fadeIn(500);
        $("#back").attr("back","");
    }
    else {
        $("#back").attr("back","");
        $("#gameQuery, #manage_account, #cart, #manage_balance, #support, #privacy_policy, #terms_and_conditions, #about, #manage_games").fadeOut(500);
        $("#carousels").stop(true, true).delay(500).fadeIn(500, function () {
        });
    }
    $("footer").stop(true,true).delay(1100).fadeIn(100);

}

//displays rating wheel
function displayRating(){

    $(".progress").each(function() {

        let value = $(this).attr('data-value');
        let left = $(this).find('.progress-left .progress-bar');
        let right = $(this).find('.progress-right .progress-bar');

        if (value > 0) {
            if (value <= 50) {
                right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)');
            } else {
                right.css('transform', 'rotate(180deg)');
                left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)');
            }
        }
    });

    function percentageToDegrees(percentage) {
        return percentage / 100 * 360;
    }
}

//searches the game when pressed enter on the search bar
$(document).on("keyup", "#search", function(e){
    if(e.which == 13){
        searchGame(0,'');
    }
});

/*search for a game or category and displays the result (calling displayQuery())
* type: 0 = normal search of a game; 1= browsing a category; 2 = browsing a theme; 3 = browsing First Person or Third Person Shooters
* */
function searchGame(type, query){

    $(".navbar-collapse").collapse('hide');
    stopTrailer();
    $("footer, .pagination, [id*='pg'], #resultsNumber, #gameInformation, #manage_account, #cart, #manage_balance, #support, #privacy_policy, #terms_and_conditions, #about, #manage_games").hide();
    nElements = 0;
    let urlQuery = "", stringQuery = "";
    document.getElementById("back").setAttribute("back","query");
    $("#gameQuery").show();
    $("#carousels").fadeOut(500);

    if(type == 0) {
        urlQuery = urlWebsite + "/searchGame";
        stringQuery = document.getElementById("search").value;
    }
    else if(type == 1){
        urlQuery = urlWebsite + "/browseCategory";
        stringQuery = query;
    }
    else if(type == 2){
        urlQuery = urlWebsite + "/browseTheme";
        stringQuery = query;
    }
    else if(type == 3){
        urlQuery = urlWebsite + "/Shooters";
        stringQuery = query;
    }


    $.ajax({
        url: urlQuery,
        type: "GET",
        async:false,
        data: {
            'name': stringQuery,
        },
        success: function (data) {

            for(var id in data)
                if(data.hasOwnProperty(id))
                    nElements++;

            if(type == 3)
                stringQuery += " shooter";

            if(nElements != 1)
                document.getElementById("resultsNumber").innerText = nElements + ' results for "' + stringQuery + '"';
            else
                document.getElementById("resultsNumber").innerText = nElements + ' result for "' + stringQuery + '"';

            $("#resultsNumber").show(200);

            dataResponse = data;
            offsetTemp = 0;
            displayQuery(0);

        }
    });
}

//displays the pagination based on the n. of search results
function setPagination(idx){

    $("[id*='pg']").removeClass("active");
    $("[id*='pg']").children("a").removeClass("btn disabled");
    $("#pg" + parseInt(idx+1)).addClass("active");
    $("#pg" + parseInt(idx+1)).children("a").addClass("btn disabled");


    $("#pg1").stop(true,true).show();
    if (nElements > 18) {
        $("#pg2").stop(true, true).show();
        if (nElements > 36) {
            $("#pg3").stop(true, true).show();
            if (nElements > 54) {
                $("#pg4").stop(true, true).show();
                if (nElements > 72) {
                    $("#pg5").stop(true, true).show();
                }
            }
        }
    }
if(nElements > 0)
    $(".pagination").stop(true,true).delay(500).fadeIn(500);

}

//displays the search query when looking for a game or category, based on the number of results
function displayQuery(offset){

    if(offset === "prev") {
        if (offsetTemp == 0)
            return;
        offsetTemp--;
        offset = offsetTemp;
    }
    else if(offset === "next") {
        if ((nElements - 18* (offsetTemp+1)) <= 0)
            return;
        offsetTemp++;
        offset = offsetTemp;
    }
    else
        offsetTemp = offset;

    var nCards = 0, idxOffset = 18 * offset;

    $("footer, .pagination, [id*='pg'], [id*='cardQuery']").hide();

    if(nElements - idxOffset >= 18)
        nCards = 18;
    else
        nCards = nElements - idxOffset;


    for (let j = idxOffset, i = 0; i < nCards; i++, j++) {

        if (dataResponse[j].name.length > 17)
            document.getElementById("titleQuery" + (i + 1).toString().replace(/^0/, '')).innerText = dataResponse[j].name.slice(0, 16) + "...";
        else
            document.getElementById("titleQuery" + (i + 1).toString().replace(/^0/, '')).innerText = dataResponse[j].name;
        document.getElementById("idQuery" + (i + 1).toString().replace(/^0/, '')).innerText = dataResponse[j].id;
        if((dataResponse[j].id.toString()).indexOf("TGZ")!=-1)
            document.getElementById("imgQuery" + (i + 1).toString().replace(/^0/, '')).src = dataResponse[j].cover.toString();
        else
        document.getElementById("imgQuery" + (i + 1).toString().replace(/^0/, '')).src = dataResponse[j].cover.url.toString().replace('t_thumb', 't_cover_big');

        $("#"+ "cardQuery" + (i+1).toString().replace(/^0/,'')).stop(true,true).delay(200+i*200).show(200);

    }

    $("footer").stop(true, true).stop(true,true).delay(1000).show(500);
    setPagination(offset);
}

function stopTrailer(){
    $("[id*=youtubeTrailer]").each(function(){
        this.contentWindow.postMessage('{"event":"command", "func":"stopVideo","args":""}', '*');
    });
    $(" [id*=youtubeTrailer]").hide();
}

//adds the item to the user cart
function addToCart(){
    let item = document.getElementById("item").innerText;
    let price = document.getElementById("price").innerText.split(" ")[0];
    let isAlreadyInCart = false, loggedIn = true;
    $.ajax({
        url: urlWebsite + "/isLoggedIn",
        type: "POST",
        async:false,
        success: function (data) {
            if (data == false){
                window.location.replace(urlWebsite + "/#!/login");
                loggedIn = false;
            }
        }
    });

    if(!loggedIn)
        return;

    $.ajax({
        url: urlWebsite + "/isItemInCart",
        type: "POST",
        async:false,
        data: {
            'item': item,
        },
        success: function (response) {
            if (response == true){
                alert("This game is already in your cart!");
                isAlreadyInCart = true;
            }
        }
    });

    if(isAlreadyInCart)
        return;

    $.ajax({
        url: urlWebsite + "/addToCart",
        type: "POST",
        async:false,
        data: {
            'item': item,
            'price':price
        },
        success: function (data) {
            alert("Game added to your cart!")
        }
    });
}

//it removes the item from the user's cart
function removeFromCart(item) {
    $.ajax({
        url: urlWebsite + "/removeFromCart",
        type: "POST",
        async:false,
        data: {
            'item': item,
        },
        success: function (data) {
            console.log("SUCCESS");
        }
    });

    angular.element(document.getElementById("account")).scope().getCart();
}