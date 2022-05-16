document.addEventListener('deviceready', onDeviceReady, false);

//Variablen

var storage = window.localStorage;
var username = "None"
var mobile = false;
var id;
var resultsRemaining;
var distance = 0;
var touchstartX = 0;
var touchendX = 0;
var travelDistance = 150;
var prevX = 0;
var currentOffset = 0;
var distanceToTravel = 0;
storage.setItem("LoggedIn", false);
var LoggedIn = storage.getItem("LoggedIn");
var storedName = storage.getItem("Username");

var swipedRight = [];
var swipedLeft = [];

var screens = {
    intro: {
        content: `
            <div class="main intro">
                <img src="img/matchpan.svg" width="50%" alt="">
                <h2>The first App, that makes decisions and social gatherings easy.</h2>
                <div class="button" id="start">Start now</div>
            </div>
        `,
        functions: `
            $('#start').click(function () {
                switchToScreen("username")
            })
        `
    },
    username: {
        content: `
            <div class="mainSpace">
                <img src="img/profile.png" width="30%" alt="">
                <div class="inputs">
                    <input type="text" id="username" class="textfield" placeholder="Create username">
                    <input type="text" id="email" class="textfield" placeholder="E-Mail">
                    <input type="text" id="passwd" class="textfield" placeholder="Password">
                    <input type="text" id="rpasswd" class="textfield" placeholder="Repeat password">
                </div>
                <div class="button">Lets matchpan!</div>
            </div >
        `,
        functions: `
            $('#matchpan').click(async function () {
                validateCredentials();
            })
        `
    },
    home: {
        content: `
            <div class="main">
                <h1>Home</h1>
            </div>
        `
    },
    pans: {
        content: `
            <div class="return" id="return">←Back</div>
            <div class="listContainer">
                <h1>Your pans</h1>
                <div class="list">
                    <div class="element" id="food">
                        <img src="img/pizza.jpg" alt="" class="listImg">
                        <div class="shadow"></div>
                        <p>Food</p>
                    </div>
                </div>
            </div>
            <div id="navbar">
                <svg class="svgIcon" id="heartIcon" data-name="heartIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                    <path d="M500.35,962.43l0,0,.36.35S50.72,523.39,24.07,416.37C-3.57,319.82-6.53,43.15,214.57,37.49c214.93-5.51,282.36,224.14,286,237l-.08-.39c3.61-12.84,71-242.49,286-237,221.1,5.66,218.14,282.33,190.5,378.88C950.28,523,500.31,962.41,500.31,962.41l.36-.35,0,0" />
                </svg>
                <svg class="svgIcon active" id="pansIcon" data-name="pansIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                    <rect y="45.5" width="1000" height="430" rx="44.25" />
                    <rect y="527" width="1000" height="430" rx="44.25" />
                </svg>
            </div>
        `,
        functions: `
            $('#heartIcon').click(function() {
                switchToScreen("profile");
            })
            $("#return").click(function() {
                switchToScreen("profile");
            })
            $("#food").click(function() {
                switchToScreen("swiping");
            })
        `
    },
    swiping: {
        content: `
            <div class="mainSwipe">
                <div class="return" id="return">←Back</div>
                <div class="swipeContainer">
                    <div class="swipeElement" id="schnitzel">
                        <img src="img/schnitzel.jpg" alt="">
                        <h1 class="title">Wiener Schnitzel</h1>
                    </div>
                    <div class="swipeElement" id="chili">
                        <img src="img/chili.jpg" alt="">
                        <h1 class="title">Chili con Carne</h1>
                    </div>
                    <div class="swipeElement" id="steak">
                        <img src="img/steak.jpg" alt="">
                        <h1 class="title">Steak</h1>
                    </div>
                    <div class="swipeElement" id="padthai">
                        <img src="img/padthai.jpg" alt="">
                        <h1 class="title">Pad Thai</h1>
                    </div>
                    <div class="swipeActive" id="pizza">
                        <img src="img/pizza.jpg" alt="">
                        <h1 class="title">Pizza</h1>
                    </div>
                </div>
            </div>
            <div class="swpbuttons">
                <div class="swpbutton" id="minus">
                    <svg id="minusIcon" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                        <defs>
                            <style>
                                .cls-2 {
                                    fill: #e20f00;
                                }
                            </style>
                        </defs>
                        <rect class="cls-2" x="-0.65" y="376.35" width="1000" height="250" rx="50"
                            transform="translate(-208.25 499.94) rotate(-45)" />
                        <rect class="cls-2" x="373.65" y="1.35" width="250" height="1000" rx="50"
                            transform="translate(-208.46 499.44) rotate(-45)" />
                    </svg>
                </div>
                <div class="swpbutton" id="plus">
                    <svg id="plusIcon" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                        <defs>
                            <style>
                                .cls-1 {
                                    fill: #54c242;
                                }
                            </style>
                        </defs>
                        <rect class="cls-1" x="374.5" y="1" width="250" height="1000" rx="50" />
                        <rect class="cls-1" x="-1" y="376.5" width="1000" height="250" rx="50" />
                    </svg>
                </div>
            </div>
        `,
        functions: `
            swipedRight = [];
            swipedLeft = [];
            loadSwipeElement();
            $("#return").click(function() {
                switchToScreen("pans");
            })
            $("#minus").click(function() {
                swipeLeft();
            })
            $("#plus").click(function() {
                swipeRight();
            })
        `
    },
    results: {
        content: `
            <div class="resultContainer">
                <h1 class="resultTitle">You are set!</h1>
                <h2 class="subtitle">You liked:</h2>
                <div class="results">
                </div>
            </div>
            <div class="button">
                Send link to your group
            </div>
            <div class="buttonBorderless" id="continue">
                Continue →
            </div>
        `,
        functions: `
            $('body').css('background-image', 'linear-gradient(to bottom, #D50535, #CB356B)');
            processResults();
        `
    },
    thanks: {
        content: `
            <div class="main">
                <h1>You have reached the end.</h1>
                <h1>Thank you for trying this techdemo!</h1>
                <div class="button" id="returnToProfile">Return to profile...</div>
            </div>
        `,
        functions: `
            $("#returnToProfile").click(function() {
                switchToScreen("profile");
            })
        `
    },
    sorry: {
        content: `
            <div class="main">
                <h1>You have reached the end, but apparently you didn't really like anything...</h1>
                <div class="button" id="returnToProfile">Return to profile</div>
            </div>
        `,
        functions: `
            $("#returnToProfile").click(function() {
                switchToScreen("profile");
            })
        `
    }
}

//Funktionen

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function processResults() {
    if (swipedRight.length > 4) {
        var toDisplay = swipedRight.slice(0, 4);
        resultsRemaining = swipedRight.slice(4);
        toDisplay.forEach(element => {
            $(".results").append('<div class="result"><img src="img/' + element + '.jpg" alt ="" ></div >');
        });
        $(".results").append('<p class="showButton" id="showAll">... Show all</p>');
        $("#showAll").click(function() {
            $(this).remove();
            resultsRemaining.forEach(element => {
                $(".results").append('<div class="result"><img src="img/' + element + '.jpg" alt ="" ></div >');
            });
        })
    } else if(swipedRight.length == 0) {
        switchToScreen("sorry")
    } else {
        swipedRight.forEach(element => {
            $(".results").append('<div class="result"><img src="img/' + element + '.jpg" alt ="" ></div >');
        });
    }
    $("#continue").click(function() {
        switchToScreen("thanks");
    })
}

function createProfile() {
    var profile = {
        content: `
            <div class= "main" >
                <div id="profile">
                    <div class="contentContainer">
                        <img src="img/profile.png" width="30%" alt="">
                            <h1 id="username">` + username + `</h1>
                    </div>
                    <div class="contentContainer">
                        <div class="button">Create group</div>
                        <input type="text" placeholder="Put in code..." class="textfield">
                    </div>
                    <div class="button">Give feedback!</div>
                </div>
            </div >
            <div id="navbar">
                <svg class="svgIcon active" id="heartIcon" data-name="heartIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                    <path d="M500.35,962.43l0,0,.36.35S50.72,523.39,24.07,416.37C-3.57,319.82-6.53,43.15,214.57,37.49c214.93-5.51,282.36,224.14,286,237l-.08-.39c3.61-12.84,71-242.49,286-237,221.1,5.66,218.14,282.33,190.5,378.88C950.28,523,500.31,962.41,500.31,962.41l.36-.35,0,0" />
                </svg>
                <svg class="svgIcon" id="pansIcon" data-name="pansIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                    <rect y="45.5" width="1000" height="430" rx="44.25" />
                    <rect y="527" width="1000" height="430" rx="44.25" />
                </svg>
            </div>`
        ,
        functions: `
            $('#pansIcon').click(function () {
                switchToScreen("pans");
            })
            $('body').css('background-image', 'none');
            `
    }
    screens["profile"] = profile
    storage.setItem("Username", username);
}

function clearScreen() {
    $("body > *").remove();
}

async function validateCredentials() {
    var uname = $("#username").val();
    var email = $("#email").val();
    var passwd = $("#passwd").val();
    var rpasswd = $("#rpasswd").val();
    if (uname.length > 0 || email.length > 0 || passwd.length > 0 || rpasswd.length > 0) {
        if (passwd == rpasswd) {
            username = uname;
            createProfile();
            storage.setItem("LoggedIn", true);
            switchToScreen("profile");
            $('body').css('background-image', 'none');
        } else {
            alert("Your passwords dont match!")
        }
    } else {
        alert("Please fill out all necessary fields!")
    }
}

async function switchToScreen(screen) {
    clearScreen();
    $("body").append(screens[screen]["content"]);
    await sleep(100);
    if (screens[screen]["functions"] != undefined) {
        eval(screens[screen]["functions"]);
    }
}

async function swipeLeft() {
    currentOffset = parseInt($('.swipeActive').css("transform").split(",")[4]);
    for (var i = 0; i > -400; i -= 8) {
        var temp = currentOffset + i;
        $('.swipeActive').css("transform", "translateX(" + temp + "px)");
        await sleep(0.1);
    }
    id = $('.swipeActive').attr("id");
    var doc = document.getElementsByClassName("swipeElement");
    var next = doc[doc.length - 1];
    $(".swipeActive").remove();
    swipedLeft.push(id);
    var pansLeft = countElements();
    if (pansLeft > 0) {
        next.classList.remove("swipeElement");
        next.classList.add("swipeActive");
        loadSwipeElement();
    } else {
        switchToScreen("results")
    }
}

async function swipeRight() {
    currentOffset = parseInt($('.swipeActive').css("transform").split(",")[4]);
    for (var i = 0; i < 400; i += 8) {
        var temp = currentOffset + i;
        $('.swipeActive').css("transform", "translateX(" + temp + "px)");
        await sleep(0.1);
    }
    id = $('.swipeActive').attr("id");
    var doc = document.getElementsByClassName("swipeElement");
    var next = doc[doc.length - 1];
    $(".swipeActive").remove();
    swipedRight.push(id);
    var pansLeft = countElements();
    if (pansLeft > 0) {
        next.classList.remove("swipeElement");
        next.classList.add("swipeActive");
        loadSwipeElement();
    } else {
        switchToScreen("results")
    }
}

function handleStart(e) {
    e.preventDefault();
    touchstartX = e.changedTouches[0].screenX
    dist = 0;
    prevX = e.touches[0].clientX;
}

function handleSwipe(e) {
    e.preventDefault();
    const touches = e.changedTouches;
    var x = e.touches[0].clientX;
    if(prevX > x) {
        dist -= touches.length;
        prevX = e.touches[0].clientX;
    } else {
        dist += touches.length;
        prevX = e.touches[0].clientX;
    }
    currentOffset = parseInt($('.swipeActive').css("transform").split(",")[4]);
    $('.swipeActive').css("transform", "translateX(" + dist*3 + "px)");
}

async function handleEnd(e) {
    touchendX = e.changedTouches[0].screenX
    e.preventDefault();
    if (touchendX < touchstartX - travelDistance) {
        currentOffset = parseInt($('.swipeActive').css("transform").split(",")[4]);
        for (var i = 0; i > -400; i -= 8) {
            var temp = currentOffset + i;
            $('.swipeActive').css("transform", "translateX(" + temp + "px)");
            await sleep(0.1);
        }
        id = $('.swipeActive').attr("id");
        var doc = document.getElementsByClassName("swipeElement");
        var next = doc[doc.length - 1];
        $(".swipeActive").remove();
        swipedLeft.push(id);
        var pansLeft = countElements();
        if (pansLeft > 0) {
            next.classList.remove("swipeElement");
            next.classList.add("swipeActive");
            loadSwipeElement();
        } else {
            switchToScreen("results")
        }
    } else if (touchendX > touchstartX + travelDistance) {
        currentOffset = parseInt($('.swipeActive').css("transform").split(",")[4]);
        for (var i = 0; i < 400; i += 8) {
            var temp = currentOffset + i;
            $('.swipeActive').css("transform", "translateX(" + temp + "px)");
            await sleep(0.1);
        }
        id = $('.swipeActive').attr("id");
        var doc = document.getElementsByClassName("swipeElement");
        var next = doc[doc.length - 1];
        $(".swipeActive").remove();
        swipedRight.push(id);
        var pansLeft = countElements();
        if (pansLeft > 0) {
            next.classList.remove("swipeElement");
            next.classList.add("swipeActive");
            loadSwipeElement();
        } else {
            switchToScreen("results")
        }
    } else {
        currentOffset = parseInt($('.swipeActive').css("transform").split(",")[4]);
        while(currentOffset > 0) {
            currentOffset = parseInt($('.swipeActive').css("transform").split(",")[4]);
            currentOffset -= 1;
            $('.swipeActive').css("transform", "translateX(" + currentOffset + "px)");
            await sleep(0.1);
        }
        while (currentOffset < 0) {
            currentOffset = parseInt($('.swipeActive').css("transform").split(",")[4]);
            currentOffset += 1;
            $('.swipeActive').css("transform", "translateX(" + currentOffset + "px)");
            await sleep(0.1);
        }
    }
}

function loadSwipeElement() {
    const container = document.getElementsByClassName('swipeActive')[0];
    container.addEventListener("touchstart", handleStart);
    container.addEventListener("touchmove", handleSwipe);
    container.addEventListener("touchend", handleEnd);
}

function countElements() {
    return document.getElementsByClassName("swipeElement").length;
}

//Main

onDeviceReady();
async function onDeviceReady() {
    await sleep(50)
    if (mobile) {
        if (LoggedIn == null || LoggedIn == "false") {
            switchToScreen("intro")
        } else {
            if (storedName == null) {
                switchToScreen("username")
            } else {
                username = storedName
                createProfile()
                switchToScreen("profile")
            }
        }
    }
    loadSwipeElement();
}
