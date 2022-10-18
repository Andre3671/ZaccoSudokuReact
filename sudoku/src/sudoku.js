import { useEffect, useState } from 'react';
import './Sudoku.css';
const difficulty = [1,2,3];
let board = [];
//x,y,number
let SolvedNumbers = [];
let pressedNumber = 0;
let SolverNumbersAmount = 0;

 function Sudoku() {
    useEffect(() => {
        document.addEventListener('keydown',detectKeyDown,true)
         // eslint-disable-next-line react-hooks/exhaustive-deps
        document.addEventListener('keyup',detectKeyUp,true)
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const detectKeyDown = (e) => {
        var re = new RegExp("^([1-9])");
        let key = parseInt(e.key)
        if( re.test(key)){
            pressedNumber =  key; 
        }
    }

    const detectKeyUp = async (e) => {
        console.log("pressed: " + pressedNumber)
        const verticalCheck = CheckVertical()
        console.log("Vertikal: " + verticalCheck)
       const HorisontalCheck = CheckHorisontal();
       console.log("Horisontell: " + HorisontalCheck)
       const BlockCheck = CheckBlock();
       console.log("Block: " + BlockCheck)
       if(verticalCheck === true && HorisontalCheck === true && BlockCheck === false){
        AddSolved();
       // GameBoard[SelectedRow][SelectedColumn] = stringnumber;
       // GameBoard = board;
        Setgame(StartGame());
        
       }
    }

    function AddSolved(){
        //console.log("blocket kan ligga där " && SelectedRow && " " && SelectedColumn)
       
         GameBoard[SelectedRow[0]][SelectedColumn[0]]  = pressedNumber.toString();
    }

//lägga i apin
    function CheckVertical(){
        let CorrectPressed = true;
      GameBoard.forEach((row,index) => {
        //kan jag lägga in numret på den platsen?
        //finns redan numret i kolumnen?
        if(pressedNumber === parseInt(row[SelectedColumn[0]])){
            CorrectPressed = false;
        }
      });
      return  CorrectPressed ;
    }

    function CheckHorisontal(){
        let CorrectPressed = true;
        GameBoard[SelectedRow[0]].forEach((col) => {
            if(pressedNumber === parseInt(col)){
                CorrectPressed = false;
            }
        })
        return  CorrectPressed;
    };
    
    function CheckBlock(){
        let CorrectPressed = true;
        let blocklist =[[]];
        let block = 0;
        let row = 0;
        for(let x = 0; x < 7; x+=3){
           // console.log("test" + x);
      //dela upp brädet i block
    for(let i = 0; i < 3; i++){
       
        let NewBlock  = GameBoard[row].slice(0 + x,3 + x)
       
        const NewBlock2 = GameBoard[row + 1].slice(0 + x,3 + x)
        const NewBlock3  = GameBoard[row + 2].slice(0 + x,3 + x)
        NewBlock = NewBlock.concat(NewBlock2).concat(NewBlock3);
        blocklist[block] = NewBlock;
        block++;
     //   console.log("loop1")
        row = row + 3;
    }
   // console.log("loop2")
    row = 0;
}
console.log(blocklist)

        //-1 - 3 rad 1
        
        if(SelectedColumn[0] > -1 && SelectedColumn[0] < 3){
           
            if(SelectedRow[0] > -1 && SelectedRow[0] < 3){
                return blocklist[0].some((element) => element === pressedNumber);
               
                
            } else if(SelectedRow[0] > 2 && SelectedRow[0] < 6){
           
                return blocklist[1].some((element) => element === pressedNumber);
            }else if(SelectedRow[0] > 5 && SelectedRow[0] < 9){
                
                return blocklist[2].some((element) => element === pressedNumber);
            }
        

        }else if(SelectedColumn[0] > 2 && SelectedColumn[0] < 6){
          
            if(SelectedRow[0] > -1 && SelectedRow[0] < 3){
                return blocklist[3].some((element) => element === pressedNumber);
               } else if(SelectedRow[0] > 2 && SelectedRow[0] < 6){
                
                return blocklist[4].some((element) => element === pressedNumber);
               }else if(SelectedRow[0] > 5 && SelectedRow[0] < 9){
                
                return blocklist[5].some((element) => element === pressedNumber);
               }
        }else if(SelectedColumn[0] > 5 && SelectedColumn[0] < 9){
          
            if(SelectedRow[0] > -1 && SelectedRow[0] < 3){
              
                return blocklist[6].some((element) => element === pressedNumber);
               } else if(SelectedRow[0] > 2 && SelectedRow[0] < 6){
               
                return blocklist[7].some((element) => element === pressedNumber);
               }else if(SelectedRow[0] > 5 && SelectedRow[0] < 9){
                
                return blocklist[8].some((element) => element === pressedNumber);
               }
        }

        
        return  CorrectPressed;
    }
 
    const [game,Setgame] = useState(null)
    let [StatusText,SetStatusText] = useState("")
    let SelectedRow = useState(0)
    let SelectedColumn = useState(0)
    let GameBoard = useState(board)
    let ChoosenDifficulty = useState(1)
   
    //Api Requests
    async function GetBoard(difficulty) {
       
    var response = await fetch("https://sudokuapizacco.azurewebsites.net/api/GetNewBoard?difficulty=" + ChoosenDifficulty[0], {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        
    });
        const data =  await response.json();
        console.log(JSON.stringify(data))
        return(data)
    }

     
     async function CheckDifficulty(){
        let test = await GetBoard(ChoosenDifficulty);
        //console.log("test: " + JSON.stringify(test));
        if(test !== null){
            GameBoard = test;
        }
       
        //console.log(GameBoard)
        return StartGame();
    }

    function StartGame(){
       return <div><div  className="board">
        {
            GameBoard.map((row,Rindex) => {
                
                return <div key={Rindex} className="row">
                    {
                      
                        row.map((col,Cindex) => {      
                           return CheckEmptyNumber(Rindex,Cindex)
                        })
                    }

                </div>
            })
        }    
        </div>
        {/* <button onClick={() =>ShowSolution()}>Visa lösning</button> */}
        </div>
    }

 

function CheckEmptyNumber(RowIndex, ColIndex ){
   let number = GameBoard[RowIndex][ColIndex];
     if(number === ""  ){
            return <button key={ColIndex} className="number emptynumber" onClick={() => OnCLickEmptyNumber(RowIndex,ColIndex)}>
            <div  key={ColIndex} >           
        </div></button>          
        }else{
             return <div key={ColIndex} className="number">
             {number}
         </div>
        }

   
}
//loopa igenom checkarna
//skicka till api
// function CheckGameCompletion(){
//    
// }

function OnCLickEmptyNumber(row,col){
    SelectedRow[0] = row;
    SelectedColumn[0] = col;
    console.log("row +" + row  +" col" + col)
}




  return (
    <div className="Sudoku">
        <label>Svårighetsgrad</label>
        <div>{StatusText}</div>
      <select onChange={(e) =>ChoosenDifficulty[0] = parseInt(e.target.value) } >
        {
            difficulty.map((diffi,index) => {
                return <option key={diffi} value={diffi}>{diffi}</option>
            })
        }
      </select>
      <button onClick={(async () =>  Setgame(await CheckDifficulty()))}>Starta Spelet</button>
      {game}
    </div>
  );
}

export default Sudoku;



