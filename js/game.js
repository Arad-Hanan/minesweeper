const FLAG_IMAGE = '🚩'
const LIFE_IMAGE = '❤️'
const HINT_IMAGE = '💡'
const SAFE_CLICK_IMAGE = '🛟'
const SMILY_IMAGES = ['😀', '😟', '😎']

var gBoard

var gTimerInterval

var gHint = {
    isHint: false,
    hints: 3
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    safeClicks: 3,
    secsPassed: 0,
    lives: 3,
    isFirstClick: true,
    history: []
}

function onInit() {
    loadTheme()

    const elEndGame = document.querySelector('.end-game')
    elEndGame.style.display = 'none';

    const elSmily = document.querySelector('.smilyy-btn')
    elSmily.innerText = SMILY_IMAGES[0]

    const elTimer = document.querySelector('.timer');
    elTimer.innerText = '00:00'

    initGameVars()

    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    renderHearts()
    renderHints()
    renderSafeClicks()

    clearInterval(gTimerInterval)
    startTimer()
}

function initGameVars() {
    gGame.isOn = true
    gGame.revealedCount = 0;
    gGame.markedCount = 0
    gGame.lives = 3
    gGame.safeClicks = 3
    gGame.secsPassed = 0
    gGame.isFirstClick = true

    gHint.hints = 3
    gHint.isHint = false
}

function buildBoard() {
    const board = buildMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isPermanentlyRevealed: false,
                isMine: false,
                isMarked: false,
            }
        }
    }

    return board
}

function onCellClicked(i, j) {
    if (!gGame.isOn) return

    const cell = gBoard[i][j]

    if (cell.isRevealed) return

    if (gGame.isFirstClick) {
        gGame.isFirstClick = false
        placeMines(gBoard, i, j)
        saveState()
    } else {
        saveState()
    }

    if (gHint.isHint) {
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
    cell.isPermanentlyRevealed = true

    if (cell.isMine) {
        checkGameOver(true)
        renderBoard(gBoard, '.board-container')

        if (gGame.lives > 0) {
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

    saveState()

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
        }
    } else if (gGame.revealedCount === totalSafeCells && gGame.markedCount === gLevel.MINES) {
        gameOver(true)
    }
}

function gameOver(isWin) {
    clearInterval(gTimerInterval)
    gGame.isOn = false

    const elEndGame = document.querySelector('.end-game')
    const elEndText = document.querySelector('.end-text')

    elEndText.innerText = isWin ? 'You Win! 🎉' : 'Game Over! 💥'
    elEndGame.style.display = 'block';
    renderSmily(isWin)
}

function onChangeDifficulty(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines

    onInit()
}

function onHintClicked() {
    if (!gGame.isOn || gHint.isHint) return

    gHint.isHint = true
    gHint.hints--
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            if (currCell.isMine) continue

            currCell.minesAroundCount = countMinesAround(board, i, j)
        }
    }
}

function countMinesAround(board, row, col) {
    var mines = 0
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i < 0 ||
                i >= board.length ||
                j < 0 ||
                j >= board[0].length ||
                i === row && j === col) continue

            if (board[i][j].isMine) mines++
        }
    }
    return mines
}

function expandReveal(board, row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i < 0 ||
                i >= board.length ||
                j < 0 ||
                j >= board[0].length ||
                i === row && j === col) continue

            var currCell = board[i][j]

            if (!currCell.isMine && !currCell.isRevealed && !currCell.isMarked) {
                currCell.isRevealed = true
                gGame.revealedCount++

                if (currCell.minesAroundCount === 0) {
                    expandReveal(board, i, j)
                }
            }
        }
    }
}

function revealNegs(board, row, col, isReveal) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (isReveal) {
                currCell.isRevealed = true
            } else {
                if (!currCell.isPermanentlyRevealed) {
                    currCell.isRevealed = false
                }
            }
        }
    }
}

function startTimer() {
    const elTimer = document.querySelector('.timer')
    gTimerInterval = setInterval(() => {
        gGame.secsPassed++

        const minute = Math.floor(gGame.secsPassed / 60)
        const second = gGame.secsPassed % 60

        const minuteTxt = minute.toString().padStart(2, '0')
        const secondTxt = second.toString().padStart(2, '0')

        elTimer.innerText = `${minuteTxt}:${secondTxt}`
    }, 1000)
}

function onToggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode')

    const elBtn = document.querySelector('.dark-mode-btn')
    elBtn.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode'

    localStorage.setItem('darkMode', isDark)
}

function loadTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true'
    const elBtn = document.querySelector('.dark-mode-btn')

    if (isDark) {
        document.body.classList.add('dark-mode');
        if (elBtn) elBtn.innerText = '☀️ Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        if (elBtn) elBtn.innerText = '🌙 Dark Mode';
    }
}

function onSafeClick() {
    if (!gGame.isOn || gGame.safeClicks === 0) return

    const safeCells = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = gBoard[i][j]
            if (!cell.isMine && !cell.isRevealed && !cell.isMarked) {
                safeCells.push({ i, j })
            }
        }
    }

    if (safeCells.length === 0) return

    gGame.safeClicks--
    renderSafeClicks()

    const randomIdx = getRandomInt(0, safeCells.length)
    const pos = safeCells[randomIdx]

    const elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`)
    elCell.classList.add('safe-highlight')

    setTimeout(() => {
        elCell.classList.remove('safe-highlight')
    }, 1500)
}

function placeMines(board, skipRow, skipCol) {
    var minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        var row = getRandomInt(0, gLevel.SIZE)
        var col = getRandomInt(0, gLevel.SIZE)

        if (!board[row][col].isMine && (row !== skipRow || col !== skipCol)) {
            board[row][col].isMine = true
            minesPlaced++
        }
    }
    // board[2][2].isMine = true
    // board[3][3].isMine = true
    setMinesNegsCount(board)
}

function onUndo() {
    if (gGame.history.length === 0 || !gGame.isOn) return

    const lastState = gGame.history.pop()

    gBoard = lastState.board
    gGame.revealedCount = lastState.revealedCount
    gGame.markedCount = lastState.markedCount
    gGame.lives = lastState.lives

    renderBoard(gBoard, '.board-container')
    renderHearts()
    renderSafeClicks()
}

function saveState() {
    const stateSnapshot = {
        board: copyBoard(gBoard),
        revealedCount: gGame.revealedCount,
        markedCount: gGame.markedCount,
        lives: gGame.lives
    }

    gGame.history.push(stateSnapshot)
}

function copyBoard(board) {
    var newBoard = []
    for (var i = 0; i < board.length; i++) {
        newBoard[i] = []
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]

            newBoard[i][j] = {
                minesAroundCount: cell.minesAroundCount,
                isRevealed: cell.isRevealed,
                isPermanentlyRevealed: cell.isPermanentlyRevealed,
                isMine: cell.isMine,
                isMarked: cell.isMarked
            }
        }
    }
    return newBoard
}
