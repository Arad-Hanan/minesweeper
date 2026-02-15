const CELL_IMAGE = '🧱'
const FLAG_IMAGE = '🚩'

var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gGame.isOn = true
    gGame.revealedCount = 0;
    gGame.markedCount = 0

    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
}

function onCellClicked(i, j) {
    if (!gGame.isOn) return

    const cell = gBoard[i][j]

    if(cell.isRevealed) return

    cell.isRevealed = true

    if (cell.isMine) {
        gameOver(false)
        renderBoard(gBoard, '.board-container')
        return
    }

    gGame.revealedCount++

    if (!cell.isMine && cell.minesAroundCount === 0) expandReveal(gBoard, i, j)

    renderBoard(gBoard, '.board-container')
    checkGameOver()
}

function onCellMarked(i, j) {
    if (!gGame.isOn) return

    const cell = gBoard[i][j]

    if (cell.isRevealed) return

    cell.isMarked = !cell.isMarked
    gGame.markedCount = cell.isMarked ? gGame.markedCount + 1 : gGame.markedCount - 1
    
    renderBoard(gBoard, '.board-container')
    checkGameOver()
}

function checkGameOver() {
    const totalSafeCells = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES

    if (gGame.revealedCount === totalSafeCells && gGame.markedCount === gLevel.MINES) {
        gameOver(true)
    }
}

function gameOver(isWin){
    gGame.isOn = false
    
    if(isWin){
        alert('you win! 🎉')
    } else {
        alert('Game Over! 💥')
    }
}