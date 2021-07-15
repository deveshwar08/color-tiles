const colors = ["red","blue","yellow","orange","green","violet"];//reference for the colrs invloved

var mode = "easy";

var playerName = "";

var defaultHighScore = [];
var innerTiles = [];
var outerTiles = [];

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

function addInnerOuterTiles(){
    innerTiles = [];
    outerTiles = [];
    for(let i = 1;i <= outer;i++)
    {
        for(let j = 1;j <= outer;j++)
        {
            if(i == 1 || j == 1 || i == outer || j == outer)
                outerTiles.push("tile-" + i.toString() + j.toString());
            else
                innerTiles.push("tile-" + i.toString() + j.toString());
        }
    }
    addSolutionLi();
}


function addSolutionLi()
{
    sec = 0;
    min = 0;
    moves = 0;
    solved = false;
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
    for(let i = 1;i <= outer;i++)
    {
        for(let j = 1;j <= outer;j++)
        {
            let element = document.createElement("li");
            let id = i.toString() + j.toString();
            id = "tile-"+id;
            parentElement.appendChild(element);
            element.id = id;   
        }

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
    document.getElementById("tile-"+outer.toString()+outer.toString()).className = "white";
    addOnClick();
}
function addOnClick()
{
    for(let i = 1;i <= outer;i++)
    {
        for(let j = 1;j <= outer;j++)
        {
            let id = i.toString() + j.toString();
            id = "tile-"+id;
            let element = document.getElementById(id);
            element.setAttribute("onclick","clickingTile(id)");
        }
    }
    displayHighScore();
}
function displayHighScore()
{
    document.getElementById("high-score").innerHTML = "";
    if(localStorage.getItem("highScore") == null)
        localStorage.setItem("highScore",JSON.stringify(defaultHighScore));
    let highScore = JSON.parse(localStorage.getItem("highScore"));
    let highScoreTemp = [];

    for (var i = 0; i < highScore.length; i++)
        highScoreTemp[i] = highScore[i].slice();

    highScoreTemp.sort(function(a, b) { return(parseInt(a[1]) - parseInt(b[1]));});
    for(let i = 0;i < 5;i++)
    {
        if(highScoreTemp[i] != null)  
        {        
            let ul = document.getElementById("high-score");
            let li = document.createElement("li");
            let text = document.createTextNode(highScoreTemp[i][0] + " : " + highScoreTemp[i][1]);
            li.appendChild(text);
            ul.appendChild(li);
        }
    }
    
}


function addScore()
{
    let highScore = JSON.parse(localStorage.getItem("highScore"));
    let highScoreTemp = [];

    for (var i = 0; i < highScore.length; i++)
        highScoreTemp[i] = highScore[i].slice();
    highScoreTemp.push([playerName, (parseInt(min)*60 + parseInt(sec))]);
    localStorage.removeItem("highScore");
    localStorage.setItem("highScore",JSON.stringify(highScoreTemp));
    displayHighScore();
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
        for(let i = 1;i <= outer;i++)
        {
            for(let j = 1;j <= outer;j++)
            {
                let id = i.toString() + j.toString();
                id = "tile-"+id;
                let element = document.getElementById(id);
                element.onclick = null;
                solved = true;
            }
        }
        playerName = prompt("Hey!What's your name?");
        addScore();
    }
} 

//checks whether the tile can be swapped with empty area
function checkReference(string1, string2)
{
    let flag = 0;
    let row1 = parseInt(string1.substr(5,1));
    let col1 = parseInt(string1.substr(6,1));
    let row2 = parseInt(string2.substr(5,1));
    let col2 = parseInt(string2.substr(6,1));

    if(row1 < 5 && row2 == row1 + 1 && col1 == col2)
        flag++;
    else if(row1 > 1 && row2 == row1 - 1 && col1 == col2)
        flag++;
    else if(col1 < 5 && col2 == col1 + 1 && row1 == row2)
        flag++;
    else if(col1 > 1 && col2 == col1 - 1 && row1 == row2)
        flag++;
    
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
        document.getElementById("solved").className = "solved-easy";
        document.getElementById("container").className = "container-easy";
    }
    if(mode == "normal")
    {
        inner = 4;
        outer = 6;
        document.getElementById("solved").className = "solved-normal";
        document.getElementById("container").className = "container-normal";
    }
    addInnerOuterTiles();
}

addInnerOuterTiles();
setMoves();
timerCycle();