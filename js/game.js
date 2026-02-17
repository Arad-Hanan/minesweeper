const CELL_IMAGE = '🧱'
const FLAG_IMAGE = '🚩'
const LIFE_IMAGE = '❤️'
const HINT_IMAGE = '💡'
const SMILY_IMAGES = ['😀','😟','😎']

var gBoard

var gHint = {
    isHint : false,
    hints : 3
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
}

function onInit() {
    const elSmily = document.querySelector('.smilyy-btn')
    elSmily.innerText = SMILY_IMAGES[0]

    gGame.isOn = true
    gGame.revealedCount = 0;
    gGame.markedCount = 0
    gGame.lives = 3
    gHint.hints = 3
    gHint.isHint = false
    
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    renderHearts()
    renderHints()
}

function onCellClicked(i, j) {
    if (!gGame.isOn) return

    const cell = gBoard[i][j]

    if (cell.isRevealed) return

    if(gHint.isHint){
        revealNegs(gBoard, i, j, true)
        renderBoard(gBoard, '.board-container')

        setTimeout(() => {
                revealNegs(gBoard, i, j, false)
                gHint.isHint = false
                renderBoard(gBoard, '.board-container')
                renderHints()
            }, 1500);
            return
    }

    cell.isRevealed = true

    if (cell.isMine) {
        checkGameOver(true)
        renderBoard(gBoard, '.board-container')

        if(gGame.lives > 0){
            setTimeout(() => {
                cell.isRevealed = false
                renderBoard(gBoard, '.board-container')
            }, 1500);
        }
        return
    }

    gGame.revealedCount++

    if (!cell.isMine && cell.minesAroundCount === 0) expandReveal(gBoard, i, j)

    renderBoard(gBoard, '.board-container')
    checkGameOver(false)
}

function onCellMarked(i, j) {
    if (!gGame.isOn) return

    const cell = gBoard[i][j]

    if (cell.isRevealed) return

    cell.isMarked = !cell.isMarked
    gGame.markedCount = cell.isMarked ? gGame.markedCount + 1 : gGame.markedCount - 1

    renderBoard(gBoard, '.board-container')
    checkGameOver(false)
}

function checkGameOver(isMineHit) {
    const totalSafeCells = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES

    if (isMineHit) {
        gGame.lives--
        renderHearts()
        if (gGame.lives === 0) {
            gameOver(false)
        }} else if (gGame.revealedCount === totalSafeCells && gGame.markedCount === gLevel.MINES) {
        gameOver(true)
    }
}

function gameOver(isWin) {
    gGame.isOn = false

    const elEndGame = document.querySelector('.end-game')
    const elEndText = document.querySelector('.end-text')

    elEndText.innerText = isWin ? 'You Win! 🎉' : 'Game Over! 💥'
    elEndGame.style.visibility = 'visible'
    renderSmily(isWin)
}

function changeDifficulty(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines

    onInit()
}

function restartGame() {
    const elEndGame = document.querySelector('.end-game')
    elEndGame.style.visibility = 'hidden'

    onInit()
}

function renderHearts() {
    const elLives = document.querySelector('.extras .lives')
    var livesText = ''

    for (var i = 0; i < gGame.lives; i++) {
        livesText += LIFE_IMAGE
    }
    elLives.innerText = livesText
}

function renderHints() {
    const elHints = document.querySelector('.extras .hints')
    var hintsText = ''

    for (var i = 0; i < gHint.hints; i++) {
        hintsText += `<span class="hint" onclick="onHintClicked()">${HINT_IMAGE}</span>`
    }
    elHints.innerHTML = hintsText
}

function renderSmily(isWin){
    const elSmily = document.querySelector('.smilyy-btn')
    elSmily.innerText = isWin ? SMILY_IMAGES[2] : SMILY_IMAGES[1]
}

function onHintClicked(){
    if (!gGame.isOn || gHint.isHint) return

    gHint.isHint = true
    gHint.hints--
}