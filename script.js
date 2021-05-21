// TODO: for...of cleanup: To Array.find()
{
const selectionButtons = document.querySelectorAll('[data-selection]')
const findButton = document.getElementById('find')
const prestigeButton = document.getElementById('prestige')
const finalColumn = document.querySelector('[data-final-column]')
const computerScoreSpan = document.querySelector('[data-computer-score]')
const computerLevelSpan = document.querySelector('[data-computer-level]')
const yourScoreSpan = document.querySelector('[data-your-score]')
const yourLevelSpan = document.querySelector('[data-your-level]')
const LEVELS = [
  {
    name: 'coconut',
    emoji: '🥥',
    onLose: 'coconut'/*,
    num: 1*/
  },
  {
    name: 'palmtree',
    emoji: '🌴',
    onLose: 'palmtree'/*,
    num: 2*/
  },
  {
    name: 'volcano',
    emoji: '🌋',
    onLose: 'volcano'/*,
    num: 3*/
  },
  {
    name: 'royalty',
    emoji: '✊',
    onLose: 'coconut'/*,
    num: 4*/
  },
  {
    name: 'angel',
    emoji: '👼',
    onLose: 'royalty'/*,
    num: 5*/
  }
]
const SELECTIONS = [
  {
    name: 'rock',
    emoji: '✊',
    beats: ['scissors', 'shield'],
    levelRequired: false
  },
  {
    name: 'paper',
    emoji: '✋',
    beats: ['rock', 'pointer'],
    levelRequired: false
  },
  {
    name: 'scissors',
    emoji: '✌',
    beats: ['paper', 'shield'],
    levelRequired: false
  },
  {
    name: 'shield',
    emoji: '🛡️',
    beats: ['paper', 'pointer'],
    levelRequired: LEVELS[3].name
  },
  {
    name: 'pointer',
    emoji: '👆',
    beats: ['rock', 'scissors'],
    levelRequired: LEVELS[3].name
  }
]

selectionButtons.forEach(selectionButton => {
  selectionButton.addEventListener('click', e => {
    const selectionName = selectionButton.dataset.selection
    const selection = SELECTIONS.find(selection => selection.name === selectionName)
    makeSelection(selection)
  })
})

function makeSelection(selection) {
  const check = yourLevelSpan.innerText === computerLevelSpan.innerText
  if (check) {
    const levelRequired = SELECTIONS.find(thing => thing.name === selection).levelRequired // FIXME: Line 87
    if (levelRequired) {
      if (atLeastLevel(levelRequired, yourLevelSpan)) {
        makeSelectionNow(selection)
      } else {
        alert(`You must be at least ${SELECTIONS.find(thing => thing.name === levelRequired).emoji} ${capitalizeFirstLetter(levelRequired)} to do that move!`)
      }
    } else {
      makeSelectionNow(selection)
    }
  } else {
    alert(`You must find another ${yourLevelSpan.innerText}.`) // TODO: Find and Prestige buttons (Cannot try others without having a winner/loser for the one already chosen)
  }
}
    
function makeSelectionNow(selection) {
  const computerSelection = randomSelection()
  const yourWinner = isWinner(selection, computerSelection)
  const computerWinner = isWinner(computerSelection, selection)

  addSelectionResult(computerSelection, computerWinner)
  addSelectionResult(selection, yourWinner)

  if (yourWinner) {
    incrementScore(yourScoreSpan)
    advance(yourLevelSpan)
    loseLevel(computerLevelSpan)
  }
  if (computerWinner) {
    incrementScore(computerScoreSpan)
    advance(computerLevelSpan)
    loseLevel(yourLevelSpan)
  }
}

function incrementScore(scoreSpan) {
  scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1
}

function advance(span) {
  for (const level of LEVELS) {
    const index = LEVELS.indexOf(level)
    const length = LEVELS.length
    const notPathEnd = index + 1 < length
    if (span.innerText.includes(capitalizeFirstLetter(level.name)) && notPathEnd) {
      return span.innerText = `${LEVELS[index + 1].emoji} ${capitalizeFirstLetter(LEVELS[index + 1].name)}`
    }
  }
}

function loseLevel(span) {
  for (const level of LEVELS) {
    const setDemotion = level.onLose
    let demotion
    ;(function(){
      for (const level2 of LEVELS) {
        if (level2.name === setDemotion) return demotion = level2
      }
    })()
    if (span.innerText.includes(capitalizeFirstLetter(level.name))) {
      return span.innerText = `${demotion.emoji} ${capitalizeFirstLetter(demotion.name)}`
    }
  }
}

function addSelectionResult(selection, winner) {
  const div = document.createElement('div')
  div.innerText = selection.emoji
  div.classList.add('result-selection')
  if (winner) div.classList.add('winner')
  finalColumn.after(div)
}

function isWinner(selection, opponentSelection) {
  for (const beating of selection.beats) {
    if (beating === opponentSelection.name) return true
  }
  return false
}

function randomSelection() {
  const purportedLength = SELECTIONS.length
  let realLength = purportedLength
  for (const selection of SELECTIONS) {
    if (selection.levelRequired) {
      if (!atLeastLevel(selection.levelRequired, computerLevelSpan)) {
        --realLength
      }
    }
  }
  const randomIndex = Math.floor(Math.random() * realLength)
  return SELECTIONS[randomIndex]
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
    
function atLeastLevel(name, span) {
  const wantedLevel = LEVELS.find(level => level.name === name)
  const wantedLevelIndex = LEVELS.indexOf(wantedLevel)
  const actualLevel = LEVELS.find(level => span.innerText.toLowerCase().includes(level.name))
  const actualLevelIndex = LEVELS.indexOf(actualLevel)
  if (actualLevelIndex >= wantedLevelIndex) {
    return true
  } else {
    return false
  }
}
}
