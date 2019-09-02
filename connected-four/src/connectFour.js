const matchWon = (grid, lastPlayedRow, lastPlayedColumn) => {
    //check column
    if (lastPlayedRow <= 2) {
        if (grid[lastPlayedRow][lastPlayedColumn] === grid[lastPlayedRow + 1][lastPlayedColumn] && 
            grid[lastPlayedRow + 1][lastPlayedColumn] === grid[lastPlayedRow + 2][lastPlayedColumn] &&
            grid[lastPlayedRow + 2][lastPlayedColumn] === grid[lastPlayedRow + 3][lastPlayedColumn] 
            ) return grid[lastPlayedRow][lastPlayedColumn];
    }
    
    //console.log(grid);
    return undefined;
}

export {matchWon};