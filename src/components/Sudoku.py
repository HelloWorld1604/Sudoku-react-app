from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import random

def generateSudokuTable(level):
    # check the 3x3 grid start point of current coordinate
    def find_start_point(x, y):
        return [x//3*3, y//3*3]


    # check n in 4 directions and 3x3 grid
    def is_valid(num, x, y):
        
        #check colunm
        for pos_col in range(0,9):
            # pass if count to num's position
            if pos_col == x:
                continue
            # if num have been filled in the column then pass
            if table[pos_col][y] == num:
                return False
        
        #check line
        for pos_line in range(0,9):
            #pass if count to num's position
            if pos_line == y:
                continue
            # if num have been filled in the line then pass
            if table[x][pos_line] == num:
                return False
        
        #check 3x3 grid
        #size[0]: 3x3 grid's column start point
        #size[1]: 3x3 grid's line start point
        size = find_start_point(x, y)

        for pos_x in range(size[0], size[0]+3):
            for pos_y in range(size[1], size[1]+3):
                # pass if position is the num's position
                if pos_x == x and pos_y == y:
                    continue
                if table[pos_x][pos_y] == num:
                    return False
        #print(table)
        #print(col_line_3x3)
        # if there are no problems
        return True


    def solve():
        for i in range(9):
            for j in range(9):
                if table[i][j] == 0:
                    nums = list(range(1, 10))
                    random.shuffle(nums)
                    for n in nums:
                        if is_valid(n, i, j):
                            table[i][j] = n
                            if solve():
                                return True
                            table[i][j] = 0  # backtrack
                    return False  # if there are no valid numbers
        return True  # have been full-filled


    def count_solutions(board):
        count = [0]
        def solve_count():
            for i in range(9):
                for j in range(9):
                    if board[i][j] == 0:
                        for n in range(1, 10):
                            if is_valid(n, i, j):
                                board[i][j] = n
                                solve_count()
                                board[i][j] = 0
                        return

            count[0] += 1
            if count[0] > 1:
                return
        
        solve_count()
        return count[0]
        
    def has_unique_solution(board):
        return count_solutions(np.copy(board)) == 1


    # create a 9x9 sudoku table
    table = np.zeros((9, 9), dtype=int)
    solve()

    # create a puzzle
    puzzle = table.copy()

    # create a sudoku board depend on difficulty
    if level == "easy": cells = 45
    elif level == "medium": cells = 55
    elif level == "hard": cells = 65

    count = 0
    while (count != cells):
        x = random.randint(0,8)
        y = random.randint(0,8)
        if puzzle[x][y] == 0:
            continue
        puzzle[x][y] = 0
        if has_unique_solution(puzzle) == True:
            count += 1
        else: 
            puzzle[x][y] = table[x][y]
            continue
    
    return {
    "puzzle":puzzle.tolist(),
    "solution":table.tolist()
    }

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
@app.route("/generate-sudoku", methods=['POST'])
def sudoku():
    # get the difficulty from levelButton in Sudoku.js
    data = request.get_json()
    sudoku = generateSudokuTable(data)

    extra = request.args.get("extra")
    if extra:
        sudoku["extra"] = extra

    return jsonify(sudoku)

if __name__ == "__main__":
    app.run(debug=True)