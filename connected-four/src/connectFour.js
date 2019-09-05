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
            //console.log(this.grid);
            return this.matchWon(rowIndex, columnChoosen);
        }
        return undefined;
    }

    onGrid(f) {
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                f(r, c, this.grid[r][c]);
            }
        }
    }

    matchWon(lastPlayedRow, lastPlayedColumn) {
        if (this.grid[lastPlayedRow][lastPlayedColumn] === '') return undefined;

        let moveAndCount = (rowIndex, columnIndex, moveRowIndex, moveColumnIndex) => {
            let count = 0;
            const winning = this.grid[rowIndex][columnIndex];
            rowIndex = moveRowIndex(rowIndex);
            columnIndex = moveColumnIndex(columnIndex);
            while (rowIndex >= 0 && rowIndex < this.grid.length && columnIndex >= 0 && columnIndex < this.grid[0].length && this.grid[rowIndex][columnIndex] === winning) {
                if (this.grid[rowIndex][columnIndex] === winning) count++;
                rowIndex = moveRowIndex(rowIndex);
                columnIndex = moveColumnIndex(columnIndex);
                console.log(rowIndex, columnIndex, count, winning);
            }
            return count;
        }

        let backAndForwardCheck = (lastPlayedRow, lastPlayedColumn, moveRowIndexBack, moveColumnIndexBack, moveRowIndexForward, moveColumnIndexForward) => {
            let winning = this.grid[lastPlayedRow][lastPlayedColumn];
            let count = 1;
            count += moveAndCount(lastPlayedRow, lastPlayedColumn, moveRowIndexBack, moveColumnIndexBack);
            count += moveAndCount(lastPlayedRow, lastPlayedColumn, moveRowIndexForward, moveColumnIndexForward);
            if (count >= 4) return winning;
        }

        //check column
        let checkColumn = backAndForwardCheck(lastPlayedRow, lastPlayedColumn, (r) => r + 1, (c) => c, (r) => r - 1, (c) => c);
        if (checkColumn) return checkColumn;
        
        //check row
        let checkRow = backAndForwardCheck(lastPlayedRow, lastPlayedColumn, (r) => r, (c) => c + 1, (r) => r, (c) => c-1);
        if (checkRow) return checkRow;
        
        //check so-ne diag
        let checkSONE = backAndForwardCheck(lastPlayedRow, lastPlayedColumn, (r) => r - 1, (c) => c + 1, (r) => r + 1, (c) => c - 1);
        if (checkSONE) return checkSONE;

        //check no-se diag
        let checkNOSE = backAndForwardCheck(lastPlayedRow, lastPlayedColumn, (r) => r + 1, (c) => c + 1, (r) => r - 1, (c) => c - 1);
        if (checkNOSE) return checkNOSE;
        
    }

}

export { ConnectFour };