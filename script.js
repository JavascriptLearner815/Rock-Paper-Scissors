const selectionButtons = document.querySelectorAll('[data-selection]')
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
  const randomIndex = Math.floor(Math.random() * SELECTIONS.length)
  return SELECTIONS[randomIndex]
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
