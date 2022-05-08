var app = angular.module('myApp', ['ngRoute']);
app.controller('selectionCtrl', function ($scope, $http) {

    //given the ID, it gets and displays the game's info from the public API or MongoDB
    $scope.selectGame = function (event) {
        document.getElementById("read-more").style.visibility = "hidden";
        document.getElementById("descHidden").innerText = "";
        let descResponse, descHidden, descVisible, urlSelectGame, videoID;
        let id = "id" + event.target.id.replace("img", "").replace("title", "").replace("card", "");
        if(document.getElementById(id).innerText.indexOf("TGZ")!=-1)
            urlSelectGame =  urlWebsite + "/selectGameMongo";
        else
            urlSelectGame =  urlWebsite + "/selectGame";
        let price;
        $http({
            url: urlSelectGame,
            method: "POST",
            async: false,
            params: {
                'id': document.getElementById(id).innerText,
            },
        }).then(function (response) {
            $scope.title = response.data[0].name;
            $scope.item = response.data[0].name;
            if((response.data[0].id.toString()).indexOf("TGZ")!=-1)
                $scope.cover = response.data[0].cover.toString();
            else
                $scope.cover = response.data[0].cover.url.toString().replace('t_thumb', 't_cover_big');
            $scope.screenshot1 = $scope.screenshot2 = $scope.screenshot3 = "xxx";

            if((response.data[0].id.toString()).indexOf("TGZ")!=-1) {
                $scope.screenshot1 = response.data[0].screenshot1.toString();
                if(response.data[0].screenshot2.toString() !="")
                    $scope.screenshot2 = response.data[0].screenshot2.toString();
                if(response.data[0].screenshot3.toString() !="")
                    $scope.screenshot3 = response.data[0].screenshot3.toString();
            }else{
                if (response.data[0].hasOwnProperty('screenshots')) {
                    $scope.screenshot1 = response.data[0].screenshots[0].url.toString().replace('t_thumb', 't_screenshot_med');
                    if (response.data[0].screenshots.length > 1)
                        $scope.screenshot2 = response.data[0].screenshots[1].url.toString().replace('t_thumb', 't_screenshot_med');
                    if (response.data[0].screenshots.length > 2)
                        $scope.screenshot3 = response.data[0].screenshots[2].url.toString().replace('t_thumb', 't_screenshot_med');
                }
            }

            if((response.data[0].id.toString()).indexOf("TGZ")!=-1)
                videoID =  response.data[0].youtube.toString();
            else {
                if(response.data[0].hasOwnProperty('videos'))
                    videoID = response.data[0].videos[0].video_id.toString();
                else
                    videoID="";
            }
            if ((response.data[0].hasOwnProperty('videos') || (response.data[0].id.toString()).indexOf("TGZ")!=-1) &&videoID!="")
                $(".youtubeTrailer").attr("src", "https://www.youtube.com/embed/" +
                    videoID + "?enablejsapi=1&version=3&playerapiid=ytplayer").show();


            $(".wikipedia, .facebook, .twitter").hide();

            if (response.data[0].hasOwnProperty('websites'))
                for (let i = 0; i < response.data[0].websites.length; i++) {
                    if (response.data[0].websites[i].category == 3) {
                        $scope.wikipedia = response.data[0].websites[i].url;
                        $(".wikipedia").show();
                    }
                    if (response.data[0].websites[i].category == 4) {
                        $scope.facebook = response.data[0].websites[i].url;
                        $(".facebook").show();
                    }
                    if (response.data[0].websites[i].category == 5) {
                        $scope.twitter = response.data[0].websites[i].url;
                        $(".twitter").show();
                    }
                }

            if (response.data[0].hasOwnProperty('storyline'))
                descResponse = response.data[0].summary + " " + response.data[0].storyline;
            else
                descResponse = response.data[0].summary;

            if(descResponse.length > 650){
                descVisible = descResponse.substr(0, 650);
                descHidden = descResponse.substr(650, descResponse.length-1);
                document.getElementById("descVisible").innerText = descVisible;
                document.getElementById("descHidden").innerText = descHidden;
                document.getElementById("read-more").style.visibility = "visible";
            }else
                document.getElementById("descVisible").innerText = descResponse;

            $scope.ratingCount = parseFloat(response.data[0].aggregated_rating_count);
            $scope.rating = parseInt((parseFloat(response.data[0].aggregated_rating)) + 0.5);
            document.getElementById("progress1").setAttribute("data-value", Math.round(response.data[0].aggregated_rating * 10) / 10);
            document.getElementById("progress2").setAttribute("data-value", Math.round(response.data[0].aggregated_rating * 10) / 10);
            document.getElementById("back").setAttribute("back", event.target.id.replace("img", "").replace("title", "").replace("card", "").replace(new RegExp("[0-9]", "g"), ""));
            if((response.data[0].id.toString()).indexOf("TGZ")!=-1)
                document.getElementById("gameInformation").style.backgroundImage = "url('" + response.data[0].screenshot1.toString()+ "')";
            else
                document.getElementById("gameInformation").style.backgroundImage = "url('" + response.data[0].screenshots[0].url.toString().replace('t_thumb', 't_screenshot_huge') + "')";
            displayRating();

            if((response.data[0].id.toString()).indexOf("TGZ")!=-1) {
                $scope.releaseDate = response.data[0].release_date;
                $scope.price = response.data[0].price + " ETH";
            }
            else {
                let date = new Date(parseInt(response.data[0].release_dates[0].date) * 1000),
                    yyyy = date.getFullYear(),
                    mm = ('0' + (date.getMonth() + 1)).slice(-2),
                    dd = ('0' + date.getDate()).slice(-2);
                $scope.releaseDate = dd + "/" + mm + "/" + yyyy;

                let tempYear = "0.0" + (2022 - date.getFullYear()).toString();
                let tempRating = "0.00"+response.data[0].aggregated_rating.toString();
                price = ((((0.029 - parseFloat(tempYear)*2)+parseFloat(tempRating))*response.data[0].aggregated_rating_count)/100)*4;
                if(price < 0)
                    price = (price*-1)*0.1;
                $scope.price = (price*1.5).toFixed(4) + " ETH";
            }

        });
    };

    //gets and displays the information of the logged in account
    $scope.getInfoAccount = async function () {
        let purchaseHistory ={}, purchaseTable = "";

        await $http({
            url: urlWebsite + "/getInfoAccount",
            method: "POST",
        }).then(function (response) {
            $scope.email = response.data.email;
            $scope.name = response.data.name;
            $scope.surname = response.data.surname;
            $scope.username = response.data.username;
            let registration_date = new Date(response.data.registration_date);
            $scope.registration_date = registration_date.toLocaleDateString();
            purchaseHistory = response.data.purchase_history;
        });

        if(purchaseHistory.length > 0){
            purchaseTable = purchaseTable.concat('<table class="table table-striped table-hover">');
            purchaseTable = purchaseTable.concat('<thead>');
            purchaseTable = purchaseTable.concat(' <tr>');
            purchaseTable = purchaseTable.concat('<th>Game</th>');
            purchaseTable = purchaseTable.concat('<th>Purchase Date</th>');
            purchaseTable = purchaseTable.concat('<th>Price</th>');
            purchaseTable = purchaseTable.concat('</tr>');
            purchaseTable = purchaseTable.concat('</thead>');
            purchaseTable = purchaseTable.concat('<tbody>');

            for(let i = 0; i < purchaseHistory.length; i++){
                purchaseTable = purchaseTable.concat("<tr>");
                purchaseTable = purchaseTable.concat("<td>"+purchaseHistory[i].item+"</td>");
                purchaseTable = purchaseTable.concat("<td>"+purchaseHistory[i].date+"</td>");
                purchaseTable = purchaseTable.concat("<td>"+purchaseHistory[i].price+"</td>");
                purchaseTable = purchaseTable.concat("</tr>");
            }

        }else {
            document.getElementById("tablePurchaseHistory").innerHTML = "<h6 class='text-center'>You haven't purchased anything yet.</h6>";
            return;
        }
        purchaseTable = purchaseTable.concat('</tbody>');
        purchaseTable = purchaseTable.concat('</table>');
        document.getElementById("tablePurchaseHistory").innerHTML = purchaseTable;

    };

    //gets the items in the user's cart and displays the table with those items
    $scope.getCart = async function () {
        let cart ={}, cartTable = "", total=0.0;
        document.getElementById("btnPurchaseCartItems").style.visibility="hidden";
        await $http({
            url: urlWebsite + "/getInfoAccount",
            method: "POST",
        }).then(function (response) {
            cart = response.data.cart;
        });

        if(cart.length > 0){
            cartTable = cartTable.concat('<table class="table table-striped table-hover">');
            cartTable = cartTable.concat('<thead>');
            cartTable = cartTable.concat(' <tr>');
            cartTable = cartTable.concat('<th>Game</th>');
            cartTable = cartTable.concat('<th>Price</th>');
            cartTable = cartTable.concat('<th></th>');
            cartTable = cartTable.concat('</tr>');
            cartTable = cartTable.concat('</thead>');
            cartTable = cartTable.concat('<tbody>');

            for(let i = 0; i < cart.length; i++){
                cartTable = cartTable.concat("<tr>");
                cartTable = cartTable.concat("<td>"+cart[i].item+"</td>");
                cartTable = cartTable.concat("<td>"+cart[i].price+" ETH</td>");
                cartTable = cartTable.concat("<td><btn type=button class='btn btn-danger' onclick='removeFromCart(\""+ cart[i].item +"\")'>-</btn></td>");
                cartTable = cartTable.concat("</tr>");
                total+=parseFloat(cart[i].price);
            }
            cartTable = cartTable.concat("<tr>");
            cartTable = cartTable.concat("<td></td>");
            cartTable = cartTable.concat("<td> <b>TOTAL:</b> <span id='totalPrice'>"+total.toFixed(4)+"</span> ETH</td>");
            cartTable = cartTable.concat("<td></td>");
            cartTable = cartTable.concat("</tr>");
        }else {
            document.getElementById("tableCart").innerHTML = "<h6 class='text-center'>Your cart is empty.</h6>";
            return;
        }
        cartTable = cartTable.concat('</tbody>');
        cartTable = cartTable.concat('</table>');
        document.getElementById("btnPurchaseCartItems").style.visibility="visible";
        document.getElementById("tableCart").innerHTML = cartTable;

    };


    $scope.support = function (option) {
        switch(option) {
            case 1:
                $scope.support1 = "Key not working when trying to redeem it";
                $scope.support2 = "Received the wrong key";
                $scope.support3 = "Other";
                break;
            case 2:
                $scope.support1 = "Email not received after the purchase";
                $scope.support2 = "Can't process payment";
                $scope.support3 = "Other";
                break;
            case 3:
                $scope.support1 = "My account has been stolen";
                $scope.support2 = "Purchase history/cart not displaying data correctly";
                $scope.support3 = "Other";
                break;
        }
    }


//displays the games in the MongoDB
    $scope.getGamesList = async function () {
        let data, gamesTable = "";
        await $http({
            url: urlWebsite + "/getGamesList",
            method: "GET",
        }).then(function (response) {
            data = response.data;
        });
        if(data.length > 0){
            gamesTable = gamesTable.concat('<table class="table table-striped table-hover">');
            gamesTable = gamesTable.concat('<thead>');
            gamesTable = gamesTable.concat(' <tr>');
            gamesTable = gamesTable.concat('<th scope="col">ID</th>');
            gamesTable = gamesTable.concat('<th scope="col">Name</th>');
            gamesTable = gamesTable.concat('<th scope="col">Cover URL</th>');
            gamesTable = gamesTable.concat('<th scope="col">Release Date</th>');
            gamesTable = gamesTable.concat('<th scope="col">Price (ETH)</th>');
            gamesTable = gamesTable.concat('<th scope="col">Summary</th>');
            gamesTable = gamesTable.concat('<th scope="col">Rating</th>');
            gamesTable = gamesTable.concat('<th scope="col">Rating Count</th>');
            gamesTable = gamesTable.concat('<th scope="col">Youtube Video ID</th>');
            gamesTable = gamesTable.concat('<th scope="col">Screenshot1 URL</th>');
            gamesTable = gamesTable.concat('<th scope="col">Screenshot2 URL</th>');
            gamesTable = gamesTable.concat('<th scope="col">Screenshot3 URL</th>');
            gamesTable = gamesTable.concat('<th scope="col"></th>');
            gamesTable = gamesTable.concat('</tr>');
            gamesTable = gamesTable.concat('</thead>');
            gamesTable = gamesTable.concat('<tbody>');

            for(let i = 0; i < data.length; i++){
                gamesTable = gamesTable.concat("<tr>");
                gamesTable = gamesTable.concat('<td scope="row">'+data[i].id+'</td>');
                gamesTable = gamesTable.concat("<td>"+data[i].name+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].cover+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].release_date+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].price+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].summary+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].aggregated_rating+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].aggregated_rating_count+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].youtube+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].screenshot1+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].screenshot2+"</td>");
                gamesTable = gamesTable.concat("<td>"+data[i].screenshot3+"</td>");
                gamesTable = gamesTable.concat("<td><btn type=button class='btn btn-danger' onclick='deleteGame(\""+ data[i].id +"\")'>-</btn></td>");
                gamesTable = gamesTable.concat("</tr>");
            }
        }else {
            document.getElementById("tableGamesList").innerHTML = "<h6 class='text-center'>No games in the database.</h6>";
            return;
        }
        gamesTable = gamesTable.concat('</tbody>');
        gamesTable = gamesTable.concat('</table>');
        document.getElementById("tableGamesList").innerHTML = gamesTable;

    };

});