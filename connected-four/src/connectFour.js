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
        let row = this.lastRowFree(columnChoosen);
        if (row !== undefined) {
            this.grid[row][columnChoosen] = player;
        }
        return row;
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
        
        //check row
        let row = this.grid[lastPlayedRow];
        let winning = row[lastPlayedColumn];
        let count = 1;
        let columnR = lastPlayedColumn + 1;
        while (columnR < row.length && row[columnR] === winning) {
            if (row[columnR] === winning) count ++;
            columnR ++;
        }
        let columnL = lastPlayedColumn -1;
        while (columnL > 0 && row[columnL] === winning) {
            if (row[columnL] === winning) count ++;
            columnL -= 1;
        }
        if (count >= 4) return winning;
    }

}

export { ConnectFour };