//It is the number of steps it move in one second.
const SnakeSpeed=10;

//  This is the initial position of the snake
const SnakeBody=[{x: 11,y: 11}];

var food={x:4,y:4};

//the number of boxes to be added when the snake eats the food.
const expansionRate=1;

//default direction should be static so that the snake does not move                                    
var inputDirection={x:0,y:0};
var lastinputDirection={x:0,y:0};
var segments=0;
var gameOver=false;

const gameBoard=document.getElementById('game-board');

var lastTime=0;


function main(currentTime)
{
    if(gameOver===true)
    {
        alert('You Lost and Your score is   ' + SnakeBody.length);
        window.location.reload();
        return;
    }
    window.requestAnimationFrame(main);

    //diff will be in millisecond
    var diff=currentTime-lastTime;

    if( (diff/1000) < (1/SnakeSpeed) )
    {
        return;
    }
    
    lastTime=currentTime;
    console.log("RENDERING");

    //This will tell us either to increase the legth of the snake or we have lost the game 
    update();

    //This will draw all the changes mentioned by update
    gameBoard.innerHTML='';
    draw();
}

function update(){
    updateSnake();
    updateFood();
    CheckLost();
}

function draw(){
    drawSnake();
    drawFood();
}



/******************************  SNAKE UPDATE AND DRAW   ******************************* */
/******            updateSnake,drawSnake expandSnake onSnake checkEqual    ************* */
function updateSnake(){
    for(let i=SnakeBody.length-2;i>=0;i--)
    {
        SnakeBody[i+1]={...SnakeBody[i]};
    }
    SnakeBody[0].x+=inputDirection.x;
    SnakeBody[0].y+=inputDirection.y;
}


function drawSnake(){
    
    SnakeBody.forEach(small=>{
      const SnakeElement=document.createElement('div');
      SnakeElement.style.gridRowStart=small.y;  
      SnakeElement.style.gridColumnStart =small.x; 
      SnakeElement.classList.add('snake');
      gameBoard.appendChild(SnakeElement);
    })
}




function expandSnake(){
    for(var i=0;i<expansionRate;i++)
    {
        SnakeBody.push({...SnakeBody[SnakeBody.length-1]});
    }
}

function onSnake(food,{ignore=false}={}){
    return (SnakeBody.some((small,index)=>{
        if(ignore===true && index===0) return false;
        return checkEqual(small,food);
    }))
}


function checkEqual(part1,part2){
    return part1.x===part2.x && part1.y===part2.y;
}


/*************************** FOOD UPDATE AND DRAW ***********************************/
/************* getRandFood updateFood drawFood ************* */


function getRandFood(){
    var newfood;
    while(newfood==null ||  !onSnake(food))
    {
        //console.log("a");
        newfood={x:Math.floor(Math.random()*21)+1,y:Math.floor(Math.random()*21)+1};
    }
    return newfood;
}


function updateFood(){
    if(onSnake(food)){
        expandSnake();
        food=getRandFood();
    }
}


function drawFood(){
    const foodElement=document.createElement('div');
    foodElement.style.gridRowStart=food.y;  
    foodElement.style.gridColumnStart =food.x; 
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}


/****************************** KEY EVENTS ********************************************* */

window.addEventListener('keydown',event=>{
    switch(event.key){
        case 'ArrowUp':
            if(lastinputDirection.y!=0) break;
            inputDirection={x:0,y:-1};
            break;
        case 'ArrowDown':
            if(lastinputDirection.y!=0) break;
            inputDirection={x:0,y:1};
            break;
        case 'ArrowLeft':
            if(lastinputDirection.x!=0) break;
            inputDirection={x:-1,y:0};
            break;
        case 'ArrowRight':
            if(lastinputDirection.x!=0) break;
            inputDirection={x:1,y:0};
            break;
    }
    lastinputDirection=inputDirection;
})



/************************LOST OR NOT **********************************/


function outsideGrid(pos){
    return (pos.x<1|| pos.x>21 || pos.y<1 || pos.y>21)
}

function headSnake(){
    return (SnakeBody[0]);
}

function intersectionOfSnake(){
    var head=headSnake();
    for(var i=2;i<SnakeBody.length;i++)
    {
        if(checkEqual(head,SnakeBody[i]))
        {
            return true;
        }
    }
    return false;
}

function CheckLost(){
    gameOver=outsideGrid(headSnake())||intersectionOfSnake();
}

window.requestAnimationFrame(main);

