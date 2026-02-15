function buildMat(rows, cols) {
    const mat = []
    for (var i = 0; i < rows; i++) {
        const row = []
        for (var j = 0; j < cols; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function buildBoard() {
    const board = buildMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            }
        }
    }

    var minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        var row = getRandomInt(0, gLevel.SIZE)
        var col = getRandomInt(0, gLevel.SIZE)

        if (!board[row][col].isMine) {
            board[row][col].isMine = true
            minesPlaced++
        }
    }
    // board[2][2].isMine = true
    // board[3][3].isMine = true

    setMinesNegsCount(board)

    return board
}

function renderBoard(board, selector) {
    var strHTML = '<table><tbody>'

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            const className = `cell cell-${i}-${j}`

            var cellContent = ''
            if (currCell.isRevealed) {
                cellContent = currCell.isMine ? '💣' : currCell.minesAroundCount
            } else if (currCell.isMarked) {
                cellContent = '🚩'
            } else {
                cellContent = '🧱'
            }

            strHTML += `<td class="${className}"
                        onclick="onCellClicked(${i},${j})"
                        oncontextmenu="onCellMarked(${i},${j}); return false;">
                        ${cellContent}
                        </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elBoard = document.querySelector(selector)
    elBoard.innerHTML = strHTML
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
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

            if (!currCell.isMine && !currCell.isRevealed) {
                currCell.isRevealed = true
                gGame.revealedCount++
            }
        }
    }
} 