import { useEffect, useState } from 'react';
import './Sudoku.css';
const difficulty = [1,2,3];
let board = [];
//x,y,number
let pressedNumber = 0;

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
        const check = await CheckNumber(pressedNumber,SelectedRow[0],SelectedColumn[0]);
       if(check === false){
        AddSolved(pressedNumber,SelectedRow[0],SelectedColumn[0]);
        SetStatusText("Rätt nummer");
        Setgame(StartGame());
        CheckCompletion();
       }else{
        SetStatusText("Fel nummer");
       }
    }

    function AddSolved(number,row,col){
         GameBoard[row][col]  = number.toString();
    }
   
//upp till api
    function CheckCompletion(){
        let i = 0;
        GameBoard.forEach((row,Rindex) => {
         if(row.includes((element) => element === "")){
             i++;
             console.log("rad"+i+" är klar")
         }
        });
        if(i === 9){
         SetStatusText("Brädet är klart");
        }
    }

    function Solveboard(){
    let TempBoard = GameBoard;
    TempBoard.forEach((row,Rindex) => {
      
            row.forEach(async (col,Cindex) => {
                
               
                if(col === ""){
                    console.log("test "  + col)
                    for(let i = 1; i < 10; ){
                        const check = await CheckNumber(i,Rindex,Cindex);
                        console.log("number: "+ i + " row: " + Rindex+ " col:"+Cindex + " check:" + check)
                        if(check === false){
                          row[Cindex] = i.toString()
                         //AddSolved(i.toString(),Rindex,Cindex);
                        }
                        i++
                    }
                }
                

            });

        })
        GameBoard = TempBoard;
       // Setgame(StartGame());
        SetStatusText("Brädet är klart");
        return StartGame();
       
    }
   async function CheckNumber(number,row,col){
    var response = await fetch("https://sudokuapizacco.azurewebsites.net/api/CheckAllowNumber?difficulty="+ChoosenDifficulty[0] +"&row="+row+"&column="+col+"&pressed=" + number, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
    });
       let  data =  await response.json();
        return(data)  
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
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        
    });
   
       let  data =  await response.json();
       // console.log(JSON.stringify(data))
     
        
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
         <button onClick={() =>Setgame(Solveboard())}>Visa lösning</button> 
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
   // console.log("row +" + row  +" col" + col)
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



