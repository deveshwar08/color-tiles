const colors = ["red","blue","yellow","orange","green","violet"];//reference for the colrs invloved

var mode = "easy";

var name = "";
var score = 0;

var highScore = {"Player-1" : 0};

var reference = {"tile-1":["tile-2","tile-6"],
"tile-2":["tile-1","tile-3","tile-7"],
"tile-3":["tile-2","tile-4","tile-8"],
"tile-4":["tile-3","tile-9","tile-5"],
"tile-5":["tile-4","tile-10"],
"tile-6":["tile-1","tile-7","tile-11"],
"tile-7":["tile-2","tile-6","tile-8","tile-12"],
"tile-8":["tile-3","tile-7","tile-9","tile-13"],
"tile-9":["tile-4","tile-8","tile-10","tile-14"],
"tile-10":["tile-5","tile-9","tile-15"],
"tile-11":["tile-6","tile-12","tile-16"],
"tile-12":["tile-7","tile-11","tile-13","tile-17"],
"tile-13":["tile-8","tile-12","tile-14","tile-18"],
"tile-14":["tile-9","tile-13","tile-15","tile-19"],
"tile-15":["tile-10","tile-14","tile-20"],
"tile-16":["tile-11","tile-17","tile-21"],
"tile-17":["tile-12","tile-16","tile-18","tile-22"],
"tile-18":["tile-13","tile-17","tile-19","tile-23"],
"tile-19":["tile-14","tile-18","tile-20","tile-24"],
"tile-20":["tile-15","tile-19","tile-25"],
"tile-21":["tile-16","tile-22"],
"tile-22":["tile-17","tile-21","tile-23"],
"tile-23":["tile-18","tile-22","tile-24"],
"tile-24":["tile-19","tile-23","tile-25"],
"tile-25":["tile-20","tile-24"]};//reference for tiles that can be swapped with empty tile
var innerTiles = ["tile-7","tile-8","tile-9","tile-12","tile-13","tile-14","tile-17","tile-18","tile-19"];
var outerTiles = ["tile-1","tile-2","tile-3","tile-4","tile-5","tile-6","tile-10","tile-11","tile-15","tile-16","tile-20","tile-21","tile-22","tile-23","tile-24","tile-25"];

var numberOfColors = {"red":0,"blue":0,"yellow":0,"orange":0,"green":0,"violet":0};//number of each color used in the puzzle
var puzzleSolution = [];//this is the puzzle solution
var inner = 3;
var outer = 5;
var min = 0;
var sec = 0;
var solved = false;
var moves = 0;


document.getElementById("solved").className = "solved-easy";
document.getElementById("container").className = "container-easy";

function addSolutionLi()
{
    sec = 0;
    min = 0;
    let parentElement = document.getElementById("solved-puzzle");
    parentElement.innerHTML = "";
    for(let i = 1;i <= inner*inner;i++)
    {
        let element = document.createElement("li");
        let id = i.toString();
        id = "solved-"+id;
        parentElement.appendChild(element);
        element.id = id;
    }
    addPuzzleLi();
}
function addPuzzleLi()
{
    let parentElement = document.getElementById("puzzle");
    parentElement.innerHTML="";
    for(let i = 1;i <= outer*outer;i++)
    {
        let element = document.createElement("li");
        let id = i.toString();
        id = "tile-"+id;
        parentElement.appendChild(element);
        element.id = id;      
    }

    generatePuzzleSolution();
}

//generates puzzle solution using math.random
function generatePuzzleSolution(){
    for(let i = 0;i < 6;i++)
        numberOfColors[colors[i]] = 0;
    puzzleSolution = [];    
    for(let i = 0;i < inner*inner;i++)
    {
        puzzleSolution.push(colors[Math.floor(Math.random() * 6)]);//adds the color into the list
    }
    for(let j = 0;j < inner*inner;j++)
    {
        numberOfColors[colors[colors.indexOf(puzzleSolution[j])]]++;//updates number of each color used
    }
    for(let k = 0;k <inner*inner;k++)
    {
        //assign the colors to the elements using classes
        let elements = document.getElementById("solved-puzzle").children;
        elements[k].className = puzzleSolution[k];
    }
    generatePuzzle(numberOfColors);
}
//this genrates the puzzle to be solved
function generatePuzzle(numberOfColors){
    var tempNumberOfColors = {"red":0,"blue":0,"yellow":0,"orange":0,"green":0,"violet":0};//creates a temporary clone for numberOfColors list
    for(let i = 0;i < 6;i++)
        tempNumberOfColors[colors[i]] = numberOfColors[colors[i]]; 
    innerTiles.forEach(assignColorsInner);
    function assignColorsInner(tile)
    {
        while(1)
        {
            let rnd = Math.floor(Math.random() * 6);
            if(tempNumberOfColors[colors[rnd]] != 0) //checks if the color is used up or not
            {
                let element = document.getElementById(tile);//  assigns the colors to the elements using classes
                element.className = colors[rnd];
                tempNumberOfColors[colors[rnd]]--;
                break;
            }
        }

    }
    outerTiles.forEach(assignColorsOuter);
    function assignColorsOuter(tile)
    {
        let rnd = Math.floor(Math.random() * 6);
        let element = document.getElementById(tile);//  assigns the colors to the elements using classes
        element.className = colors[rnd];
    }
    document.getElementById("tile-"+outer*outer.toString()).className = "white";
    addOnClick();
}
function addOnClick()
{
    for(let i = 1;i <= outer*outer;i++)
    {
        let id = i.toString();
        id = "tile-"+id;
        let element = document.getElementById(id);
        element.setAttribute("onclick","clickingTile(id)");
    }
    displayHighScore();
}
function displayHighScore()
{
    document.getElementById("high-score").innerHTML = "";
    if(localStorage.getItem(highScore) == null)
    {
        alert("no");
        localStorage.setItem(highScore);

    }
    highScore, {name : score};
    localStorage.setItem(highScore)
    let entries = Object.entries(highScore);
    let sorted = entries.sort((a, b) => a[1] - b[1]);
    for(let i = 0;i < 5;i++)
    {
        let ul = document.getElementById("high-score");
        let li = document.createElement("LI");
        let text = document.createTextNode(sorted[i]);
        li.appendChild(text);
        ul.appendChild(li);
    }
    
}

function getName()
{
    name = prompt("Hey!What's your name?");
}

//create a list specifying the current state of game
function getCurrentState(){
    var currentState = [];
    innerTiles.forEach(pushCurrentState);
    function pushCurrentState(tile)
    {
        let element = document.getElementById(tile);
        currentState.push(element.className);
    }
    return currentState;
}

//checks whether the puzzle is solved or not
function checkSolution(puzzleSolution, currentState){
    let flag = 0;
    for(let i = 0;i < inner*inner;i++)
    {
        if(puzzleSolution[i] != currentState[i])
        {
            flag = 1;
            break;
        }
    }
    if(flag == 0)
    {
        document.getElementById("win-music").play();
        for(let i = 1;i <= outer*outer;i++)
        {
            let id = i.toString();
            id = "tile-"+id;
            let element = document.getElementById(id);
            element.onclick = null;
            solved = true;
        }
        getName();
    }
} 

//checks whether the tile can be swapped with empty area
function checkReference(string1, string2)
{
    let flag = 0;
    if(reference.hasOwnProperty(string1))
    {
        reference[string1].forEach(checkFunction); 
        function checkFunction(string)
        {
            if(string2 === string)
                flag++;
        }
    }
    if(flag > 0)
        return true;
    else
        return false;
}

//called when clicking the tile
function clickingTile(clickingElementId){
    let clickingElement = document.getElementById(clickingElementId);
    let emptyElement = document.getElementsByClassName("white")[0];
    let emptyElementId = emptyElement.id;
    if(!(clickingElement == emptyElement)  && checkReference(clickingElementId,emptyElementId))// checks the clicked one is not the empty area and it is swappable with empty area
    {
        emptyElement.className = clickingElement.className;
        clickingElement.className = "white";
        moves++;
        checkSolution(puzzleSolution, getCurrentState());
    }
}

function setMoves(){
    const movesElement = document.getElementById("moves");
    if(solved == false)
    {
        movesElement.innerHTML = moves;
        setTimeout("setMoves()", 1);
    }
}

function timerCycle()
{
    const timer = document.getElementById("timer");
    if (solved == false) {
        sec = parseInt(sec);
        min = parseInt(min);     
        if (sec == 60) {
          min = min + 1;
          sec = 0;
        }  
        if (sec < 10) {
          sec = '0' + sec;
        }
        if (min < 10) {
          min = '0' + min;
        }    
        timer.innerHTML = min + ':' + sec;  
        sec++;  
        setTimeout("timerCycle()", 1000);
      }
}
document.getElementById("easy").checked = true;
function toggleDifficulty(){
    if(document.getElementById("normal").checked == true)
        mode = "normal";
    if(document.getElementById("easy").checked == true)
        mode = "easy"
    if(mode == "easy")
    {
        inner = 3;
        outer = 5;
        reference = {"tile-1":["tile-2","tile-6"],
        "tile-2":["tile-1","tile-3","tile-7"],
        "tile-3":["tile-2","tile-4","tile-8"],
        "tile-4":["tile-3","tile-9","tile-5"],
        "tile-5":["tile-4","tile-10"],
        "tile-6":["tile-1","tile-7","tile-11"],
        "tile-7":["tile-2","tile-6","tile-8","tile-12"],
        "tile-8":["tile-3","tile-7","tile-9","tile-13"],
        "tile-9":["tile-4","tile-8","tile-10","tile-14"],
        "tile-10":["tile-5","tile-9","tile-15"],
        "tile-11":["tile-6","tile-12","tile-16"],
        "tile-12":["tile-7","tile-11","tile-13","tile-17"],
        "tile-13":["tile-8","tile-12","tile-14","tile-18"],
        "tile-14":["tile-9","tile-13","tile-15","tile-19"],
        "tile-15":["tile-10","tile-14","tile-20"],
        "tile-16":["tile-11","tile-17","tile-21"],
        "tile-17":["tile-12","tile-16","tile-18","tile-22"],
        "tile-18":["tile-13","tile-17","tile-19","tile-23"],
        "tile-19":["tile-14","tile-18","tile-20","tile-24"],
        "tile-20":["tile-15","tile-19","tile-25"],
        "tile-21":["tile-16","tile-22"],
        "tile-22":["tile-17","tile-21","tile-23"],
        "tile-23":["tile-18","tile-22","tile-24"],
        "tile-24":["tile-19","tile-23","tile-25"],
        "tile-25":["tile-20","tile-24"]};
        innerTiles = ["tile-7","tile-8","tile-9","tile-12","tile-13","tile-14","tile-17","tile-18","tile-19"];
        outerTiles = ["tile-1","tile-2","tile-3","tile-4","tile-5","tile-6","tile-10","tile-11","tile-15","tile-16","tile-20","tile-21","tile-22","tile-23","tile-24","tile-25"];
        document.getElementById("solved").className = "solved-easy";
        document.getElementById("container").className = "container-easy";
    }
    if(mode == "normal")
    {
        inner = 4;
        outer = 6;
        reference = {"tile-1":["tile-2","tile-7"],
        "tile-2":["tile-1","tile-3","tile-8"],
        "tile-3":["tile-2","tile-4","tile-9"],
        "tile-4":["tile-3","tile-5","tile-10"],
        "tile-5":["tile-4","tile-6","tile-11"],
        "tile-6":["tile-5","tile-12"],
        "tile-7":["tile-1","tile-8","tile-13"],
        "tile-8":["tile-2","tile-7","tile-9","tile-14"],
        "tile-9":["tile-3","tile-8","tile-10","tile-15"],
        "tile-10":["tile-4","tile-9","tile-11","tile-16"],
        "tile-11":["tile-5","tile-10","tile-12","tile-17"],
        "tile-12":["tile-6","tile-11","tile-18"],
        "tile-13":["tile-7","tile-14","tile-19"],
        "tile-14":["tile-8","tile-13","tile-15","tile-20"],
        "tile-15":["tile-9","tile-14","tile-16","tile-21"],
        "tile-16":["tile-10","tile-15","tile-17","tile-22"],
        "tile-17":["tile-11","tile-16","tile-18","tile-23"],
        "tile-18":["tile-12","tile-17","tile-24"],
        "tile-19":["tile-13","tile-20","tile-25"],
        "tile-20":["tile-14","tile-19","tile-21","tile-26"],
        "tile-21":["tile-15","tile-20","tile-22","tile-27"],
        "tile-22":["tile-16","tile-21","tile-23","tile-28"],
        "tile-23":["tile-17","tile-22","tile-24","tile-29"],
        "tile-24":["tile-18","tile-23","tile-30"],
        "tile-25":["tile-19","tile-26","tile-31"],
        "tile-26":["tile-20","tile-25","tile-27","tile-32"],
        "tile-27":["tile-21","tile-26","tile-28","tile-33"],
        "tile-28":["tile-22","tile-27","tile-29","tile-34"],
        "tile-29":["tile-23","tile-28","tile-30","tile-35"],
        "tile-30":["tile-24","tile-29","tile-36"],
        "tile-31":["tile-25","tile-32"],
        "tile-32":["tile-26","tile-31","tile-33"],
        "tile-33":["tile-27","tile-32","tile-34"],
        "tile-34":["tile-28","tile-33","tile-35"],
        "tile-35":["tile-29","tile-34","tile-36"],
        "tile-36":["tile-30","tile-35"]};
        innerTiles = ["tile-8","tile-9","tile-10","tile-11","tile-14","tile-15","tile-16","tile-17","tile-20","tile-21","tile-22","tile-23","tile-26","tile-27","tile-28","tile-29"];
        outerTiles = ["tile-1","tile-2","tile-3","tile-4","tile-5","tile-6","tile-7","tile-12","tile-13","tile-18","tile-19","tile-24","tile-25","tile-30","tile-31","tile-32","tile-33","tile-34","tile-35","tile-36"];
        document.getElementById("solved").className = "solved-normal";
        document.getElementById("container").className = "container-normal";
    }
    addSolutionLi();
}

addSolutionLi();
setMoves();
timerCycle();
