import React from 'react';
import ReactDOM from 'react-dom/client';
import {useState, useEffect} from 'react';
import './SudokuGrid.css';

import defaultData from './Sudoku.json';
import handleDelete from './trashCan.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faLightbulb } from '@fortawesome/free-solid-svg-icons';



function SudokuGrid(){
  // Default attributes setting ---------------------------------------------------
  // Type of this array is Int
  const [puzzle, setPuzzle] = useState(defaultData.puzzle.flat());

  // Type of this array is Int
  const [solution, setSolution] = useState(defaultData.solution.flat());

  /* Save the answer have been typed */
  // Type of this array is Str
  const [cells, setCells] = useState(
    Array(81).fill().map(() => ({value:"", notes: []}))
  );

  /* Save the current pointing place on the board */
  const [focusIndex, setFocusIndex] = useState(null);
  /* Save the state of the Note method */
  const [noteMode, setNoteMode] = useState(false);
  // -------------------------------------------------------------------------------

  /* Change the Sudoku board depend on user requested level */
  const handleClick = async (level) => {
    try {
      //console.log("level:",level);
      fetch('http://localhost:5000/generate-sudoku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(level) // pass the request level to Sudoku.py
      })
        .then(res => res.json())
        .then(data => {
          setPuzzle(data.puzzle.flat());
          setSolution(data.solution.flat());
          // Reset all the attributes
          setCells(Array(81).fill().map(() => ({value:"", notes: []})));
          setFocusIndex(null);
          setNoteMode(false);
        });  
  
    } catch (error) {
      console.error("Error calling Python script:", error);
    }
  };
  

  /* Move the typing mouse up, down, left, right on the board */
  const handleKeyDown = (e, index) => {
    let row = Math.floor(index / 9);
    let col = index % 9;
    let newIndex = index;

    switch (e.key) {
      case 'ArrowUp':
        if (row > 0) newIndex = index - 9;
        break;
      case 'ArrowDown':
        if (row < 8) newIndex = index + 9;
        break;
      case 'ArrowLeft':
        if (col > 0) newIndex = index - 1;
        break;
      case 'ArrowRight':
        if (col < 8) newIndex = index + 1;
        break;
      default:
        return;
    }

    e.preventDefault(); // Ngăn scroll hoặc hành vi mặc định
    const nextInput = document.getElementById("cell" + newIndex);
    if (nextInput) nextInput.focus();
  };

  /* Edit the input when onInput */
  function handleInputChange(e, index) {
    const inputE1 = e.target;
    const input = e.target.value;
    const newCells = [...cells];

    /* On Note Mode */
    if(noteMode){
      const num = parseInt(input);
      if (num >= 1 && num <= 9) {
        if (newCells[index].notes.includes(num)){
          let del_place = newCells[index].notes.indexOf(parseInt(input));
          newCells[index].notes.splice(del_place, 1);
        }
      else{
        newCells[index].notes.push(num);
      }
        
        inputE1.value = "";
    }}

    /* Off Note Mode */
    else{
      /* If the answer is wrong change the text color into RED, to ALERT */
      if(parseInt(input) !== solution[index] && input != ""){
          inputE1.classList.remove("correct", "setting_font");
          inputE1.classList.add("incorrect", "setting_font");
      }
       /* If user have deleted the value, then setting the orgin text's color */
      else if (input == "") inputE1.classList.remove("incorrect", "correct", "setting_font");
      else inputE1.classList.add("correct", "setting_font");

      newCells[index].value = input;
      newCells[index].notes = [];
    }

    setCells(newCells);
  }

  /* Using hook to save the current on focus place */
  function handleFocus(e){
    setFocusIndex(e.target);
  }
  
  /* Turn on/off the Note button */
  function handleNoteMode(){
    if(noteMode == false) {
      document.getElementById("pen").style.backgroundColor = "#5ea8fd";
      setNoteMode(true);
    }
    else {
      document.getElementById("pen").style.backgroundColor = "#404040";
      setNoteMode(false);
    }
  }

  /* Get a hint */
  function handleHint(target){
    // cut the number index from element's id
    const id = target.id;
    const id_num = parseInt(id.slice(4, id.length+1));
    const newCells = [...cells];
    
    // check the cell is empty
    if (target.value == ""){
    // set up the cell after typed
    target.classList.add("correct", "setting_font");

    newCells[id_num].value = String(solution[id_num]);
    setCells(newCells);
    }
    
  }


    return(
      <div className="frame">
          <div className="sudoku-container">
            {puzzle.map((cellValue, index) => {
            const commonProps = {
            maxLength: 1,
            id: "cell" + index,
            key: index,
            onKeyDown: (e) => handleKeyDown(e, index),
            onInput: (e) => handleInputChange(e, index)
          };

          return cellValue === 0 ? (
            <div className="inputWrap">
              <input {...commonProps} className="cell_blank" onFocus={(e) => handleFocus(e, index)} value={cells[index].value}/>
              {noteMode && cells[index].value === "" && cells[index].notes.length > 0 && (
                <div className="noteWrap">
                  {cells[index].notes.sort().map((n) => (
                    <span key={n} className="note">{n}</span>
                  ))}
                </div>)}
            </div>
          ) : (
            <input {...commonProps} value={cellValue} className="cell_filled" readOnly tabIndex={-1} />
          );
        })}</div>


          <div className="navigate">
            <div style={{display:"inline", alignItems:"center"}}> 
              <button onClick={() => handleNoteMode()} className="iconButton" id="pen"><FontAwesomeIcon icon={faPen} /></button>
              <button onClick={() => handleDelete(focusIndex)} className="iconButton" id="trashCan"><FontAwesomeIcon icon={faTrashCan} /></button>
              <button onClick={() => handleHint(focusIndex)} className="iconButton" id="lightbulb"><FontAwesomeIcon icon={faLightbulb} /></button>     
            </div>
            <div style={{display:"inline", alignItems:"center", borderRadius:"3vw", border: "3px dashed #404040" }}>
              <button className="levelButton" onClick={() => handleClick("easy")}>Easy</button>
              <button className="levelButton" onClick={() => handleClick("medium")}>Medium</button>
              <button className="levelButton" onClick={() => handleClick("hard")}>Hard</button>
            </div>
          </div>
      </div>
    );
}

export default SudokuGrid; 