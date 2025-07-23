import React from 'react';
import ReactDOM from 'react-dom/client';

function handleDelete(target){
    target.classList.remove("incorrect", "correct", "setting_font");
    target.value = "";
}

export default handleDelete;