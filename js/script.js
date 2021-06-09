const colors = ["red","blue","yellow","orange","green","violet"];//reference for the colrs invloved
const reference = {"tile-1":["tile-2","tile-6"],
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
const innerTiles = ["tile-7","tile-8","tile-9","tile-12","tile-13","tile-14","tile-17","tile-18","tile-19"];
const outerTiles = ["tile-1","tile-2","tile-3","tile-4","tile-5","tile-6","tile-10","tile-11","tile-15","tile-16","tile-20","tile-21","tile-22","tile-23","tile-24","tile-25"]

var numberOfColors = {"red":0,"blue":0,"yellow":0,"orange":0,"green":0,"violet":0};//number of each color used in the puzzle
var puzzleSolution = [];//this is the puzzle solution
const inner = 3;
const outer = 5;

var min = 0;
var sec = 0;
var solved = false;
var moves = 0;

function addPuzzleLi()
{
    let parentElement = document.getElementById("puzzle");
    for(let i = 1;i <= outer*outer;i++)
    {
        let element = document.createElement("li");
        let id = i.toString();
        id = "tile-"+id;
        parentElement.appendChild(element);
        element.id = id;      
    }

    generatePuzzleSolution(numberOfColors,puzzleSolution);
}
function addSolutionLi()
{
    let parentElement = document.getElementById("solved-puzzle");
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

//generates puzzle solution using math.random
function generatePuzzleSolution(numberOfColors,puzzleSolution){
    
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
    document.getElementById("tile-25").className = "white";
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
        alert("Yo!!!");//If user solves puzzle
        for(let i = 1;i <= outer*outer;i++)
        {
            let id = i.toString();
            id = "tile-"+id;
            let element = document.getElementById(id);
            element.onclick = null;
            solved = true;
        }
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
        sec++;    
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
        setTimeout("timerCycle()", 1000);
      }
}
addSolutionLi();

for(let i = 1;i <= outer*outer;i++)
{
    let id = i.toString();
    id = "tile-"+id;
    let element = document.getElementById(id);
    element.setAttribute("onclick","clickingTile(id)");
}
setMoves();
timerCycle();
