// TODO
// 1. Change Theme
// 2. Revise word-list
// 3. Fix "disappearing timer" issue.
// 4. Instructions/Tutorial Navbar or something

// Verify script is running
console.log("JS Equipped!");

// Team Elements
const teams= {
    "team1": {
        "card": document.querySelector("#team1"),
        "span": team1.querySelector("span"),
        "form": team1.querySelector("form"),
        "name": team1.querySelector("input[name='newName']"),
        "color": team1.querySelector("input[name='newColor']"),
        "button": document.querySelector("#buttonTeam1"),
        "score": 0,
        "scoreDisplay": document.querySelector("#scoreDisplayTeam1"),
        "winningWords": document.querySelector("#winsTeam1 ul")
    },
    "team2": {
        "card": document.querySelector("#team2"),
        "span": team2.querySelector("span"),
        "form": team2.querySelector("form"),
        "name": team2.querySelector("input[name='newName']"),
        "color": team2.querySelector("input[name='newColor']"),
        "button": document.querySelector("#buttonTeam2"),
        "score": 0,
        "scoreDisplay": document.querySelector("#scoreDisplayTeam2"),
        "winningWords": document.querySelector("#winsTeam2 ul")
    }
}

// Initialize Settings
let isGameOver= false;
let totalTime= 15000;

let countdownTimeout= null;
let timerInterval= null;

const winningScoreSelect= document.querySelector("#playTo");
let winningScore= parseInt(winningScoreSelect.value);

const newWordButton= document.querySelector("button");
const newWordElt= document.querySelector("#word");

const blinker= document.querySelector("#blinker");

const circleContainer= document.querySelector("#circle-container");
let circle= circleContainer.querySelector("#circle");
const textDiv= circleContainer.querySelector("div#text");
const text= textDiv.querySelector("span");

const rematchBtn= document.querySelector("#rematchButton");

teams["team1"].button.style.backgroundColor= teams["team1"].color.value;
teams["team2"].button.style.backgroundColor= teams["team2"].color.value;

// Get a Word or a New Word
newWordButton.addEventListener("click", function() {
    blinker.classList.add("hide");
    pickNewWord();
});

const pickNewWord= () => {

    clearTimeout(countdownTimeout);
    clearInterval(timerInterval);
    text.innerHTML= "";

    startTimer(totalTime);

    if (document.querySelector("span#newWord")) {
        newWordElt.removeChild(document.querySelector("span#newWord"));
    }
    let num= Math.floor(Math.random() * wordArr.length);
    let newWord= document.createElement("span");
    newWord.append(wordArr[num]);
    newWord.id= "newWord";
    newWordElt.append(newWord);
}

// Enable the Timer
const startTimer= (totalTime) => {
    circle= circleContainer.querySelector("#circle");
    let newCircle= circle.cloneNode(true);
    newCircle.classList.remove("shrink");
    circleContainer.append(newCircle);
    circle.parentNode.replaceChild(newCircle, circle);
    setTimeout(() => {
        newCircle.classList.add("shrink");
    }, 10);

    countdownTimeout= setTimeout(() => {
        console.log("Starting Timeout");
        let count= 3;
        timerInterval= setInterval(() => {
            if (count === 0) {
                clearInterval(timerInterval);
                textDiv.classList.remove("grow");
                text.innerText= "";
                circle.classList.remove("shrink");
            } else {
                textDiv.classList.remove("grow");
                console.log(count);
                textDiv.classList.add("grow");
                text.innerText= count;
                count--;
            }
        }, 1000);
    }, totalTime - (1000 * 4));
}

// Name Change Functionality
teams["team1"].card.addEventListener("dblclick", () => {
    changeNameDblClick(teams["team1"]);
});
teams["team1"].form.addEventListener("submit", (e) => {
    e.preventDefault();
    changeNameSubmit(teams["team1"]);
});
teams["team2"].card.addEventListener("dblclick", () => {
    changeNameDblClick(teams["team2"]);
});
teams["team2"].form.addEventListener("submit", (e) => {
    e.preventDefault();
    changeNameSubmit(teams["team2"]);
});

const changeNameDblClick= (team) => {
    team.form.classList.toggle("hide");
    team.span.classList.toggle("hide");
    team.name.focus();
}
const changeNameSubmit= (team) => {
    team.span.innerText= team.form.elements.newName.value;
    team.button.innerText= `+1 ${team.form.elements.newName.value.length <= 15 ? `${team.form.elements.newName.value}` : `${team.form.elements.newName.value.slice(0,10)}...`}`;
    team.button.style.backgroundColor= team.color.value;
    team.form.classList.toggle("hide");
    team.span.classList.toggle("hide");
}

// Add Points to the Winning Team
teams["team1"].button.addEventListener("click", () => {
    addPoint(teams["team1"], teams["team2"]);
    // pickNewWord();

})
teams["team2"].button.addEventListener("click", () => {
    addPoint(teams["team2"], teams["team1"]);
    // pickNewWord();

})

const addPoint= (team, opponent) => {
    // Define gameOver
    const gameOver= (winner, loser) => {
        isGameOver= true;

        console.log(countdownTimeout);
        if (countdownTimeout) {
            clearTimeout(countdownTimeout);
            countdownTimeout= null;
        }

        newWordElt.querySelector("#newWord").innerText= "";
        blinker.classList.remove("hide");

        clearInterval(timerInterval);
        text.innerHTML= "";

        circle= circleContainer.querySelector("#circle");
        circle.classList.remove("shrink");
    
        winner.scoreDisplay.classList.add("winner");
        winner.button.parentElement.classList.add("hide");
        winner.button.disabled=true;
        loser.scoreDisplay.classList.add("loser");
        loser.button.parentElement.classList.add("hide");
        loser.button.disabled=true;        
        rematchBtn.parentElement.classList.remove("hide");
    }
    // Add Point
    if(!isGameOver) {
        team.score++;
        if ((team.score >= winningScore) && (team.score >= opponent.score + 2)) {
            gameOver(team, opponent);
        }
        team.scoreDisplay.textContent= team.score;
    }
    // Add Word to Team's List of Winning Words
    let newWin= document.createElement("li");
    newWin.innerText= newWordElt.textContent;
    team.winningWords.appendChild(newWin);
}

// Rematch!
rematchBtn.addEventListener("click", () => {
    teams["team1"].score = 0;
    teams["team1"].scoreDisplay.innerText= teams["team1"].score; 
    teams["team1"].scoreDisplay.classList.remove("winner");
    teams["team1"].scoreDisplay.classList.remove("loser");
    teams["team1"].button.parentElement.classList.remove("hide");
    teams["team1"].button.disabled= false;
    teams["team2"].score = 0;
    teams["team2"].scoreDisplay.innerText= teams["team2"].score; 
    teams["team2"].scoreDisplay.classList.remove("winner");
    teams["team2"].scoreDisplay.classList.remove("loser");
    teams["team2"].button.parentElement.classList.remove("hide");
    teams["team2"].button.disabled= false;

    rematchBtn.parentElement.classList.add("hide");

    isGameOver= false;
})

// Reset Game
const resetBtn= document.querySelector("#reset");
resetBtn.addEventListener("click", () => {
    let confirmation= window.confirm("Are you sure you want to reset?");
    if (confirmation) {
        winningScore= parseInt(winningScoreSelect.value);

        teams["team1"].score = 0;
        teams["team1"].scoreDisplay.innerText= teams["team1"].score; 
        teams["team1"].scoreDisplay.classList.remove("winner");
        teams["team1"].scoreDisplay.classList.remove("loser");
        teams["team1"].button.parentElement.classList.remove("hide");
        teams["team1"].button.disabled= false;
        teams["team1"].winningWords.innerHTML= "";
        teams["team2"].score = 0;
        teams["team2"].scoreDisplay.innerText= teams["team2"].score; 
        teams["team2"].scoreDisplay.classList.remove("winner");
        teams["team2"].scoreDisplay.classList.remove("loser");
        teams["team2"].button.parentElement.classList.remove("hide");
        teams["team2"].button.disabled= false;
        teams["team2"].winningWords.innerHTML= "";

        rematchBtn.parentElement.classList.add("hide");
        
        isGameOver= false;

        circle.classList.remove("shrink");
        clearTimeout(countdownTimeout);
        clearInterval(timerInterval);
    }
})

// Reset game when changing the Winning Score
winningScoreSelect.addEventListener("change", () => {
    resetBtn.click();
})

// Add words to array
const addWordElt= document.querySelector("form#addWordForm");
addWordElt.addEventListener("submit", (e) => {
    e.preventDefault();
    wordArr.push(addWordElt.elements.addWordInput.value);
    addWordElt.querySelector("input").value= "";
});

// Array of words
const wordArr= [
    "Yeah",
    "Feel",
    "Girl",
    "Heart",
    "Take",
    "Life",
    "Back",
    "Never",
    "Die",
    "Away",
    "Give",
    "Time",
    "Night",
    "Day",
    "Man",
    "Dream",
    "World",
    "Little",
    "Baby",
    "Good",
    "Keep",
    "Around",
    "Again",
    "Eye",
    "Mind",
    "Fall",
    "World",
    "Time",
    "Hell",
    "We",
    "Like",
    "Breathe",
    "Ya",
    "You",
    "Thang",
    "Get",
    "Fire",
    "Rock",
    "Don’t",
    "Woman",
    "Music",
    "Dancing",
    "Lonely",
    "Like",
    "Polka",
    "Serenade",
    "Boogie",
    "We",
    "Yeah",
    "Hell",
    "Die",
    "U",
    "Like",
    "Breathe",
    "It",
    "Ya",
    "U",
    "You",
    "Up",
    "Get",
    "Thang",
    "Love",
    "Fire",
    "Don’t",
    "Rock",
    "On",
    "Woman",
    "Disco",
    "Rock",
    "Music",
    "Dancin'",
    "Baby",
    "Twist",
    "Little",
    "Lonely",
    "Christmas",
    "Penny",
    "Mambo",
    "Three",
    "Polka",
    "Serenade",
    "Boogie",
    "Blue",
    "Moon",
    "In",
    "Swing",
    "Sing",
    "Blues",
    "Pal",
    "Sweetheart",
    "Rose",
    "Mammy",
    "Dick",
    "Chain",
    "Shawty",
    "Run",
    "Green",
    "Party",
    "Without",
    "Beat",
    "Over",
    "Up",
    "Burn",
    "Gangsta",
    "Touch",
    "Lights",
    "Pussy",
    "Bring",
    "Romeo",
    "Fly",
    "Bass",
    "Jesus",
    "Down",
    "Cold",
    "Favorite",
    "Independent",
    "Boss",
    "Body",
    "Ass",
    "Boy",
    "Remember",
    "Hold",
    "Yeah",
    "Use",
    "Sing",
    "Because",
    "Know",
    "Star",
    "Find",
    "Lucky",
    "Hate",
    "Game",
    "Don't",
    "Diamond",
    "Time",
    "Look",
    "Go",
    "Dress",
    "Shoes",
    "Mr.",
    "Blue",
    "Sky",
    "Jukebox",
    "Sorry",
    "Pop",
    "About",
    "Send",
    "Leave",
    "Somebody",
    "Maybe",
    "Tomorrow",
    "Night",
    "Year",
    "River",
    "Crazy",
    "Hot",
    "Beer",
    "Drink",
    "Try",
    "Sunshine",
    "High",
    "Eyes",
    "Doctor",
    "Cry",
    "Hard",
    "Ball",
    "Friends",
    "Lover",
    "Good",
    "Breath",
    "Breathe",
    "Mirror",
    "Help",
    "Family",
    "Floor",
    "Hey",
    "What",
    "Sexy",
    "Call",
    "Stop",
    "Soldier",
    "Young",
    "Kiss",
    "Wrong",
    "One",
    "Hole"
]