# Sudoku-react-app
A simple sudoku game. This project have been conbined between React (font-end) and Python Flask (back-end).

---
## 🌕 SET UP BACK-END
The back-end logic is in `Sudoku.py`, built with:
* `Flask`
* `Flask_cors`
* `numpy`
* `random`

### 1. Install required packages
Make sure you have Python installed. Then, run the following commands in **Terminal/CMD**:
* `pip install flask`
* `pip install flask-cors`

### 2. Run the server
From **Terminal/CMD**, go to the project folder `Sudoku-react-app`. The back-end will start at: http://localhost:5000

---
## ☀️ SET UP FRONT-END
The front-end is built with React.
### 1. Install dependencies
`npm install`

### 2. Start the front-end
`npm start`

The front-end will start at: http://localhost:3000

---
## 🚀 Features
1. Generate Sudoku puzzles with different difficulty levels (Easy / Medium / Hard), default difficulty is Medium.
2. Supported methods:
* Note-taking mode
* Auto-checking correct/wrong answers
* Delete inputs
* Get hints

---
## 🛸 Future Features
* Add timer and win animation
* Highlight the selected cell its row, column, and 3x3
* Add a leader-board to support multiplayer competition
