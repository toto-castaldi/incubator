class ConnectFour {
    constructor() {
        this.grid = [
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '']
        ];
    }

    lastRowFree(columnChoosen) {
        let row = 0;
        while (row < this.grid.length && this.grid[row][columnChoosen] === '') row++;
        if (row > 0) return row - 1; else return undefined;
    }

    isColumnAvailable(columnChoosen) {
        return this.grid[0][columnChoosen] === '';
    }

    play(columnChoosen, player) {
        let rowIndex = this.lastRowFree(columnChoosen);
        if (rowIndex !== undefined) {
            this.grid[rowIndex][columnChoosen] = player;
            console.log(this.grid);
            return this.matchWon(rowIndex, columnChoosen);
        }
        return undefined;
    }

    onGrid(f) {
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                f(r,c, this.grid[r][c]);
            }
        }
    }

    matchWon(lastPlayedRow, lastPlayedColumn) {
        if (this.grid[lastPlayedRow][lastPlayedColumn] === '') return undefined;
        //check column
        if (lastPlayedRow <= 2) {
            if (this.grid[lastPlayedRow][lastPlayedColumn] === this.grid[lastPlayedRow + 1][lastPlayedColumn] &&
                this.grid[lastPlayedRow + 1][lastPlayedColumn] === this.grid[lastPlayedRow + 2][lastPlayedColumn] &&
                this.grid[lastPlayedRow + 2][lastPlayedColumn] === this.grid[lastPlayedRow + 3][lastPlayedColumn]
            ) return this.grid[lastPlayedRow][lastPlayedColumn];
        }
        
        let winning = this.grid[lastPlayedRow][lastPlayedColumn];
        
        //check row
        let row = this.grid[lastPlayedRow];
        let count = 1;
        let columnR = lastPlayedColumn + 1;
        while (columnR < row.length && row[columnR] === winning) {
            if (row[columnR] === winning) count ++;
            //console.log(row, winning, columnR, count);
            columnR ++;
        }
        let columnL = lastPlayedColumn -1;
        while (columnL >= 0 && row[columnL] === winning) {
            if (row[columnL] === winning) count ++;
            //console.log(row, winning, columnL, count);
            columnL -= 1;
        }
        if (count >= 4) return winning;

        //check so-ne diag
        count = 1;
        columnR = lastPlayedColumn + 1;
        let rowR = lastPlayedRow -1;
        while (columnR < row.length && rowR >= 0 && this.grid[rowR][columnR] === winning) {
            if (this.grid[rowR][columnR] === winning) count ++;
            //console.log(row, winning, columnR, count);
            columnR ++;
            rowR --;
        }
        columnL = lastPlayedColumn - 1;
        let rowL = lastPlayedRow +1;
        while (columnL >= 0 && rowL < this.grid.length && this.grid[rowL][columnL] === winning) {
            if (this.grid[rowL][columnL] === winning) count ++;
            //console.log(row, winning, columnR, count);
            columnL --;
            rowL ++;
        }
        if (count >= 4) return winning;


    }

}

export { ConnectFour };