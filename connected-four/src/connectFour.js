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
    }

    onGrid(f) {
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                f(r,c, this.grid[r][c]);
            }
        }
    }

    matchWon(lastPlayedRow, lastPlayedColumn) {
        //check column
        if (lastPlayedRow <= 2) {
            if (this.grid[lastPlayedRow][lastPlayedColumn] === this.grid[lastPlayedRow + 1][lastPlayedColumn] &&
                this.grid[lastPlayedRow + 1][lastPlayedColumn] === this.grid[lastPlayedRow + 2][lastPlayedColumn] &&
                this.grid[lastPlayedRow + 2][lastPlayedColumn] === this.grid[lastPlayedRow + 3][lastPlayedColumn]
            ) return this.grid[lastPlayedRow][lastPlayedColumn];
        }
        let winning = undefined;
        //check row
        //TODO use even lastPlayedColumn
        let row = this.grid[lastPlayedRow];
        let count = 0;
        let lastPlayed = row[0];
        row.forEach((cell) => {
            if (cell === '') {
                count = 0;
            } else if (cell === lastPlayed) {
                count++;
            } else {
                count = 1;
            }
            lastPlayed = cell;
            if (count === 4 && winning === undefined) return winning = cell;
        });
        return winning;
    }

}

export { ConnectFour };