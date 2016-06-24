//Створюємо canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
//помістити елемент canvas в DOM(в кінець тіла body)
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
// Функція для перевірки чм зображення завантажилось, помилка якщо ви намагаєтесь намалювати зображення перш ніж воно завантажиться
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// HeroX image

var heroXReady = false;
var heroXImage = new Image();
heroXImage.onload = function () {
	heroXReady = true;
};
heroXImage.src = "images/heroX.png";



// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 230, // movement in pixels per second
    x: 0,
    y: 0
};

var heroX = {
	speed: 230, // movement in pixels per second
    x: 0,
    y: 0
};

var monster = {
    x: 0,
    y: 0
};
var heroCaught = 0;
var heroXCaught = 0;


// Handle keyboard controls
var keysDown = {};

//The HTML DOM Document Object
//e.keyCode код клавіші що була натиснута
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

 //if the keyCode is present in the Object 'keysDown' it will be deleted.
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when we restart game
var reset = function () {
	hero.x = 100;
	hero.y = 100;
    
    heroX.x = 640;
	heroX.y = 440;

	// Throw the monster somewhere on the screen randomly
    //The size of the hero and monster sprites are 32x32 pixels
    //для тошо щоб монстер був у межах майданчика для гри
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));

		
};


var lose = function () {
    if (hero.x >= (canvas.width - 64) || hero.y >= (canvas.height - 64) || hero.x <= 32 || hero.y <= 32)     
              hero.speed = 0;
    
    if (heroX.x >= (canvas.width - 64) || heroX.y >= (canvas.height - 64) || heroX.x <= 32 || heroX.y <= 32)
          heroX.speed = 0;
}


  
var loseMessage = function () {
	var div = document.createElement('div');
  	div.className = "alert alert-success";
    if(hero.speed == 0)
  	     div.innerHTML = "<strong>RED LOSE!!!</strong>";
    else
        div.innerHTML = "<strong>YELLOW LOSE!!!</strong>";
    //div.innerHTML = "<button>TRY AGAIN</button>";
	document.body.insertBefore(div, document.body.firstChild);
}




// Update game objects
//modifier is a time-based number, speed of heroes * on modifier Help as to do speed of heroes static no matter how fast (or slowly!) the script is running. 
var update = function (modifier) {
	if (87 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (83 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (65 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (68 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
    
    if (38 in keysDown) { // Player2 holding up
		heroX.y -= heroX.speed * modifier;
	}
	if (40 in keysDown) { // Player2 holding down
		heroX.y += heroX.speed * modifier;
	}
	if (37 in keysDown) { // Player2 holding left
		heroX.x -= heroX.speed * modifier;
	}
	if (39 in keysDown) { // Player2 holding right
		heroX.x += heroX.speed * modifier;
	}

   lose();
 
   	
	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++heroCaught;
       // console.error("LOSE0");
		reset();
	} else if (
		heroX.x <= (monster.x + 32) && monster.x <= (heroX.x + 32) && heroX.y <= (monster.y + 32 ) && monster.y <= (heroX.y + 32)
	) {
		++heroXCaught;
       // console.error("LOSE0");
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
    if (heroXReady) {
		ctx.drawImage(heroXImage, heroX.x, heroX.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("RED caught: " + heroCaught, 32, 12);
    ctx.fillText("YELLOW caught: " + heroXCaught, 562, 12);
};


// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
/*
The main game loop is what controls the flow of the game. First we want to get the current timestamp so we can calculate the delta (how many milliseconds have passed since the last interval). We get the modifier to send to update by dividing by 1000 (the number of milliseconds in one second). Then we call render and record the timestamp.
*/
	update(delta / 1000);
    
	render();
   
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
   if(hero.speed == 0 || heroX.speed == 0) {
        loseMessage();
       stop();
   }
        
};



var stop = function(){  
    if(hero.speed == 0 ){
        hero.x = canvas.width / 2;
	   hero.y = canvas.height / 2;  
        heroX.speed = 0;
    }else{
        heroX.x = canvas.width / 2;
	    heroX.y = canvas.height / 2; 
    }
   // if (confirm("Do you want play again?")) {
        // location.reload();
       /* break;
    } else {
        break;*

}*/
}



// Cross-browser support for requestAnimationFrame
var w = window;
//confirm("Сказать привет?");
/*
Метод window.requestAnimationFrame () говорить браузеру, що ви хочете виконати 
анімацію і просить, щоб браузер викликати певну функцію для поновлення анімації 
до наступного перефарбовувати. Метод приймає в якості аргументу зворотного виклику, 
який буде викликаний до перефарбовування.
Ви повинні викликати цей метод щоразу, коли ви будете готові оновити анімації на екрані. Це зажадає, щоб ваша функція анімації викликатися перед браузер виконує наступний перефарбовувати.
*/
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();


