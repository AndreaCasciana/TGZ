
//displays the register form
function switchRegister() {
    $('#signIn, #footerLogin, .brand_logo_container ').hide(500);
    $('.user_card').animate({height: '565px'}, 500);
    $('#signUp, #footerRegister').stop(true, true).delay(500).slideDown(500);
    $('.brand_logo_container').stop(true, true).delay(500).fadeIn(500);
}

//displays the login form
function switchLogin() {
    $('#signUp, #footerRegister, .brand_logo_container, #resetPassword, #footerReset ').hide(500);
    $('.user_card').animate({height: '450px'}, 500);
    $('#signIn, #footerLogin').stop(true, true).delay(500).slideDown(500);
    $('.brand_logo_container').stop(true, true).delay(500).fadeIn(500);
}

//displays the 'forgot password' form
function forgotPassword() {
    $('#signUp, #signIn, #footerRegister, #footerLogin, .brand_logo_container ').hide(500);
    $('.user_card').animate({height: '320px'}, 500);
    $('#resetPassword, #footerReset').stop(true, true).delay(500).slideDown(500);
    $('.brand_logo_container').stop(true, true).delay(500).fadeIn(500);
}

//if not signed in, it displays the login button; otherwise it displays the user/admin menu
function updateAccountMenu(){
    $.ajax({
        url: urlWebsite + "/isLoggedIn",
        type: "POST",
        success: function (data) {
            if (data != false){
                $("#account").html(data);
            $target = $("[ng-app]");
            angular.element($target).injector().invoke(['$compile', function ($compile) {
                var $scope = angular.element($target).scope();
                $compile($('#account'))($scope);
                $scope.$apply();
            }]);
        }
    }
    });
}

//displays the window for managing the user account
function manageAccount(){
    $(".navbar-collapse").collapse('hide');
    $("footer, .pagination, [id*='pg'], #resultsNumber, #gameInformation, #gameQuery, #cart, #support, #privacy_policy, #terms_and_conditions, #about").fadeOut(500);
    $("#manage_account").show();
    $("#carousels").fadeOut(500);
}

//displays the cart window
function cart(){
    $(".navbar-collapse").collapse('hide');
    $("footer, .pagination, [id*='pg'], #resultsNumber, #gameInformation, #gameQuery, #manage_account, #support, #privacy_policy, #terms_and_conditions, #about").fadeOut(500);
    $("#cart").show();
    $("#carousels").fadeOut(500);
}

//displaus the 'terms and conditions' window
function termsConditions(){
    $(".navbar-collapse").collapse('hide');
    $("footer, .pagination, [id*='pg'], #resultsNumber, #gameInformation, #gameQuery, #manage_account, #support, #privacy_policy, #cart, #about").fadeOut(500);
    $("#terms_and_conditions").show();
    $("#carousels").fadeOut(500);
}

//displays the 'privacy policy & cookies' window
function privacyCookies(){
    $(".navbar-collapse").collapse('hide');
    $("footer, .pagination, [id*='pg'], #resultsNumber, #gameInformation, #gameQuery, #manage_account, #support, #terms_and_conditions, #cart, #about").fadeOut(500);
    $("#privacy_policy").show();
    $("#carousels").fadeOut(500);
}

//displays the 'about us' window
function about(){
    $(".navbar-collapse").collapse('hide');
    $("footer, .pagination, [id*='pg'], #resultsNumber, #gameInformation, #gameQuery, #manage_account, #support, #terms_and_conditions, #cart, #privacy_policy").fadeOut(500);
    $("#about").show();
    $("#carousels").fadeOut(500);
}

//displays the window for customer support
function support(){
    $('#emailSupport').val("");
    $('#descSupport').val("");
    $("#support").fadeOut(100);
    $(".navbar-collapse").collapse('hide');
    $("footer, .pagination, [id*='pg'], #resultsNumber, #gameInformation, #gameQuery, #manage_account, #cart, #terms_and_conditions, #privacy_policy, #about").fadeOut(500);
    $("#support").fadeIn(100);
    $("#carousels").fadeOut(500);
}

//displays the window for managing games in the MongoDB
function manageGames(){
    $(".navbar-collapse").collapse('hide');
    $("footer, .pagination, [id*='pg'], #resultsNumber, #gameInformation, #gameQuery, #manage_account, #cart, #terms_and_conditions, #privacy_policy, #about, #support").fadeOut(500);
    $("#manage_games").fadeIn(100);
    $("#carousels").fadeOut(500);
}

//edits user information (except password)
function editInfo(){
    clearLabels();
    const newUsername = document.getElementById("username").value;
    const newName = document.getElementById("name").value;
    const newSurname = document.getElementById("surname").value;
    const myUsername = document.getElementById("myUsername").innerText;
    let exist = false;

    $.ajax({
        url: urlWebsite + "/userExist",
        type: "GET",
        async: false,
        data:{
            "username":newUsername
        },
        success: function (response) {
            if (response == true && (newUsername != myUsername))
                exist = true;
        }
    });

    if(exist){
        document.getElementById("labelChangeInfo").innerHTML = '<br>' +
            '<p class="text-danger">That username is taken. Try another</p>';
        return;
    }


    $.ajax({
        url: urlWebsite + "/editInfo",
        type: "POST",
        async: false,
        data:{
            "name":newName,
            "surname":newSurname,
            "username":newUsername,
            "currentUsername":myUsername
        },
        success: function (response) {
            document.getElementById("labelChangeInfo").innerHTML = '<br>' +
                '<p class="text-success">Account information successfully updated!</p>';
            angular.element(document.getElementById("account")).scope().getInfoAccount();
            updateAccountMenu();
        }
    });
}

//changes user password
function changePassword(){
    clearLabels();
    const currPwd = document.getElementById("currPwd").value;
    const newPwd = document.getElementById("newPwd").value;
    const newPwd2 = document.getElementById("newPwd2").value;
    const myUsername = document.getElementById("myUsername").innerText;
    let match = false;

    if(newPwd != newPwd2){
        document.getElementById("labelChangePassword").innerHTML = '<br>' +
            '<p class="text-danger">Passwords do not match</p>';
        return;
    }

    $.ajax({
        url: urlWebsite + "/passwordMatch",
        type: "POST",
        async: false,
        data:{
            "username":myUsername,
            "password":currPwd
        },
        success: function (response) {
            if (response == true) {
                match = true;
            }
        }
    });

    if(!match){
        document.getElementById("labelChangePassword").innerHTML = '<br>' +
            '<p class="text-danger">Invalid password</p>';
        return;
    }

    $.ajax({
        url: urlWebsite + "/changePassword",
        type: "POST",
        async: false,
        data:{
            "username":myUsername,
            "password":newPwd
        },
        success: function (response) {
            document.getElementById("labelChangePassword").innerHTML = '<br>' +
                '<p class="text-success">Password successfully updated!</p>';
        }
    });
}

//deletes the user account
function deleteAccount() {
    clearLabels();
    const pwd = document.getElementById("pwdDelete").value;
    const myUsername = document.getElementById("myUsername").innerText;
    let match = false;

    $.ajax({
        url: urlWebsite + "/passwordMatch",
        type: "POST",
        async: false,
        data: {
            "username": myUsername,
            "password": pwd
        },
        success: function (response) {
            if (response == true) {
                match = true;
            }
        }
    });

    if (!match) {
        document.getElementById("labelDeleteAccount").innerHTML = '<br>' +
            '<p class="text-danger">Invalid password</p>';
        return;
    }

    if (confirm("Do you really want to delete your account? \nThis action is irreversible and your account\nwill be permanently deleted.")) {
        $.ajax({
            url: urlWebsite + "/deleteAccount",
            type: "POST",
            async: false,
            success: function (response) {
                window.location.replace(urlWebsite + "/logout");
            }
        });
    }
    clearLabels();
}

//clear all labels
function clearLabels(){
    document.getElementById("labelChangePassword").innerHTML = '';
    document.getElementById("labelChangeInfo").innerHTML = '';
    document.getElementById("labelDeleteAccount").innerHTML = "";
    document.getElementById("labelSupport").innerHTML = "";
    document.getElementById("labelAddGame").innerHTML = "";
}

//user register
function register(){
    document.getElementById("labelRegister").innerHTML = '';
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("pwd").value;
    const password2 = document.getElementById("pwd2").value;
    let exist = false;

    if(password != password2){
        document.getElementById("labelRegister").innerHTML =  '<p class="text-danger">Passwords do not match</p>';
        return;
    }

    $.ajax({
        url: urlWebsite + "/userExist",
        type: "GET",
        async: false,
        data:{
            "username":username
        },
        success: function (response) {
            if (response == true)
                exist = true;
        }
    });

    if(exist){
        document.getElementById("labelRegister").innerHTML =  '<p class="text-danger">That username is taken. Try another</p>';
        return;
    }

    $.ajax({
        url: urlWebsite + "/emailExist",
        type: "GET",
        async: false,
        data:{
            "email":email
        },
        success: function (response) {
            if (response == true)
                exist = true;
        }
    });

    if(exist){
        document.getElementById("labelRegister").innerHTML = '<p class="text-danger">Email already taken. Try another</p>';
        return;
    }


    $.ajax({
        url: urlWebsite + "/register",
        type: "POST",
        async: false,
        data:{
            "email":email,
            "name":name,
            "surname":surname,
            "username":username,
            "password":password
        },
        success: function (response) {
            window.location.replace(urlWebsite + "/#!/registration-successful");
        }
    });
}

//user or admin login
function login(){
    document.getElementById("labelLogin").innerHTML = '';
    const username = document.getElementById("loginUsr").value;
    const password = document.getElementById("loginPwd").value;
    let success = false, verification = true;

    $.ajax({
        url: urlWebsite + "/login",
        type: "POST",
        async: false,
        data:{
            "username":username,
            "password":password
        },
        success: function (response) {
            if (response == true)
                success = true;
            if(response == "failedVerification")
                verification = false;
        }
    });

    if(!verification){
        window.location.replace(urlWebsite + "/#!/not-verified");
        return;
    }


    if(!success){
        document.getElementById("labelLogin").innerHTML =  '<p class="text-danger">Incorrect username or password</p>';
        return;
    }
    window.location.replace(urlWebsite + "");

}

//verifies the user's email address
function verify(){
    const url = window.location.href;
    const verificationString = decodeURIComponent(url.substr(url.indexOf("ver=")+4));
    let success=false;

    $.ajax({
        url: urlWebsite + "/verify",
        type: "POST",
        async: false,
        data:{
            "ver":verificationString,
        },
        success: function (response) {
            if (response == true)
                success = true;
        }
    });

    if(success){
        document.getElementById("verification").innerHTML =  '<div class="container">\n' +
            '    <div class="row text-center">\n' +
            '        <div class="col-sm-6 col-sm-offset-3">\n' +
            '            <br><br> <h2 style="color:#0fad00">Success</h2>\n' +
            '            <img src="https://i.pinimg.com/originals/45/7c/6c/457c6ca866199f192e8ef30e0cd85de2.png">\n' +
            '            <h3>Your email has been verified</h3>\n' +
            '            <p style="font-size:20px;color:#5C5C5C;">Congratulations! You can now sign in with your new account.</p>\n' +
            '            <a href="#!login" class="btn btn-success">     Log in      </a>\n' +
            '            <br><br>\n' +
            '        </div></div>\n' +
            '</div>';
        return;
    }

    window.location.replace(urlWebsite + "");
}

//sends a reset password email to the specified email address
function resetPasswordEmail(){
    let username = document.getElementById("usrReset").value;
    $.ajax({
        url: urlWebsite + "/resetPasswordEmail",
        type: "POST",
        async: false,
        data:{
            "username":username,
        },
        success: function (response) {
                alert("We have e-mailed your password reset link!");
        }
    });
}

//displays the reset password dialog
function resetLink(){
    const url = window.location.href;
    const resetString = decodeURIComponent(url.substr(url.indexOf("str=")+4));
    let success=false;

    $.ajax({
        url: urlWebsite + "/isResetRequested",
        type: "GET",
        async: false,
        data:{
            "str":resetString,
        },
        success: function (response) {
            if (response == true)
                success = true;
        }
    });

    if(success){
        document.getElementById("resetPassword").innerHTML =  '<div class="container">\n' +
            '    <div class="row text-center">\n' +
            '        <div class="col-sm-6 col-sm-offset-3">\n' +
            '            <br><br> <h2 style="color:#0fad00">Reset Password</h2>\n' +
            '        <form onsubmit="javascript:resetPassword()"  method="POST">\n' +
            '            <div class="col-md-12"><label class="labels"><b>New Password: </b></label><input class="form-control" size="12" type="password" placeholder="new password" id="newPwd"/></div>\n' +
            '            <div class="col-md-12"><label class="labels"><b>Confirm New Password: </b></label><input class="form-control" size="12" type="password" placeholder="repeat new password" id="newPwd2"/></div>\n' +
            '            <br>\n' +
            '            <button type="submit" class="btn btn-primary edit">Reset Password</button>\n' +
            '            <br><br>\n' +
            '        </div></div>\n' +
            '</div>';
        return;
    }

    window.location.replace(urlWebsite + "");
}

//resets a user's password
function resetPassword() {
    const url = window.location.href;
    const resetString = decodeURIComponent(url.substr(url.indexOf("str=")+4));

    let newPwd = document.getElementById("newPwd").value;
    let newPwd2 = document.getElementById("newPwd2").value;
    if(newPwd != newPwd2){
        alert("The passwords do not match!");
        return;
    }

    $.ajax({
        url: urlWebsite + "/resetPassword",
        type: "POST",
        async: false,
        data:{
            "resetString":resetString,
            "pwd": newPwd,
        },
        success: function (response) {
            alert("Your password has been changed! You will now be redirected to the login page");
            window.location.replace(urlWebsite + "/#!/login");
        }
    });

}

//sends a mail to TGZ email address for customer support
function sendSupport(){
    clearLabels();
    let category = $('.selectpicker').val();
    let email = $('#emailSupport').val();
    let desc = $('#descSupport').val();

    if(category == "" || email == "" || desc == ""){
        document.getElementById("labelSupport").innerHTML =  '<p class="text-danger">All fields must be filled!</p>';
        return;
    }
    $.ajax({
        url: urlWebsite + "/sendSupport",
        type: "POST",
        async: false,
        data:{
            "category":category,
            "email": email,
            "text":desc,
        },
        success: function (response) {
            alert("An email has been sent, we will reply as soon as possible to the email address provided in order to help you with your problem.");
            window.location.replace(urlWebsite + "");
        }
    });
}

//adds a game to the MongoDB
function addGame(){
    clearLabels();
    const id = document.getElementById("addID").value;
    const name = document.getElementById("addName").value;
    const cover = document.getElementById("addCover").value;
    const releaseDate = document.getElementById("addReleaseDate").value;
    const price = document.getElementById("addPrice").value;
    const summary = document.getElementById("addSummary").value;
    const rating = document.getElementById("addRating").value;
    const ratingCount = document.getElementById("addRatingCount").value;
    const youtube = document.getElementById("addYoutube").value;
    const screenshot1 = document.getElementById("addScreenshot1").value;
    const screenshot2 = document.getElementById("addScreenshot2").value;
    const screenshot3 = document.getElementById("addScreenshot3").value;

    if(id =="" || name =="" || cover ==""||releaseDate==""||price==""||summary==""||rating==""||ratingCount==""||screenshot1==""){
        document.getElementById("labelAddGame").innerHTML =  '<p class="text-danger">All mandatory fields must be filled!</p>';
        return;
    }

    $.ajax({
        url: urlWebsite + "/addGame",
        type: "POST",
        async:false,
        data: {
            'id': "TGZ"+id,
            'name':name,
            'cover':cover,
            'releaseDate': releaseDate,
            'price': price,
            'summary':summary,
            'rating': rating,
            'ratingCount':ratingCount,
            'youtube': youtube,
            'screenshot1':screenshot1,
            'screenshot2':screenshot2,
            'screenshot3':screenshot3
        },
        success: function (data) {
            alert("Game added!")
        }
    });
    angular.element(document.getElementById("account")).scope().getGamesList();
    $('#addID,  #addName, #addCover, #addReleaseDate, #addPrice, #addSummary, #addRating, #addRatingCount, #addYoutube, #addScreenshot1, #addScreenshot2, #addScreenshot3').val("");
}

//given the ID, it deletes a game from the MongoDB
function deleteGame(item) {
    if (confirm("Do you really want to delete this game? \nThis action is irreversible and the game\nwill be permanently deleted.")) {
        $.ajax({
            url: urlWebsite + "/deleteGame",
            type: "POST",
            async: false,
            data: {
                'id': item,
            },
            success: function (data) {
                alert("Game Deleted!");
            }
        });

        angular.element(document.getElementById("account")).scope().getGamesList();
    }
}