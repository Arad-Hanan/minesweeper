function renderBoard(board, selector) {
    var strHTML = '<table><tbody>'

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var className = `cell cell-${i}-${j}`
            if(currCell.isRevealed) className += ' revealed'

            var cellContent = ''
            if (currCell.isRevealed) {
                if(currCell.isMine){
                    cellContent = '💣'
                } else {
                    cellContent = currCell.minesAroundCount === 0 ? '' : currCell.minesAroundCount
                }
            } else if (currCell.isMarked) {
                cellContent = '🚩'
            } else {
                cellContent = ''
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

function renderSafeClicks() {
    const elSafe = document.querySelector('.extras .safe-clicks')
    if(!elSafe) return

    var strHTML = ''
    for(var i = 0; i < gGame.safeClicks; i++){
        strHTML += `<span class="safe-click" onclick="onSafeClick()">${SAFE_CLICK_IMAGE}</span>`
    }
    elSafe.innerHTML = strHTML
}