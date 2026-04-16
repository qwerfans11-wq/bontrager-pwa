// ══════════════════════════════════════════════
// FEATURES MODULE — Quiz, Flashcards, Progress
// ══════════════════════════════════════════════

let currentQuiz = null;
let quizScore = 0;
let quizIndex = 0;

// ═══ PROGRESS TRACKING ═══
function savePositionProgress(positionName) {
  let viewed = JSON.parse(localStorage.getItem('bontrager_viewed_v2') || '[]');
  if (!viewed.includes(positionName)) {
    viewed.push(positionName);
    localStorage.setItem('bontrager_viewed_v2', JSON.stringify(viewed));
  }
}

function getProgressPercentage() {
  let viewed = JSON.parse(localStorage.getItem('bontrager_viewed_v2') || '[]');
  const stats = getStatistics();
  return stats.positions > 0 ? Math.round((viewed.length / stats.positions) * 100) : 0;
}

// ═══ QUIZ FUNCTIONS ═══
function startQuiz(chapterKey) {
  quizScore = 0;
  quizIndex = 0;
  currentQuiz = QUIZ[chapterKey] || { questions: [] };
  
  if (currentQuiz.questions.length === 0) {
    alert('No quiz questions available for this chapter.');
    navTo('quiz-chapters');
    return;
  }
  
  loadQuestion();
  navTo('quiz');
}

function loadQuestion() {
  if (!currentQuiz || quizIndex >= currentQuiz.questions.length) {
    showScore();
    return;
  }
  
  const q = currentQuiz.questions[quizIndex];
  document.getElementById('qCounter').textContent = `Question ${quizIndex + 1} / ${currentQuiz.questions.length}`;
  document.getElementById('qScore').textContent = `Score: ${quizScore}`;
  document.getElementById('qText').textContent = q.text;
  
  const optsGrid = document.getElementById('optsGrid');
  optsGrid.innerHTML = '';
  
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.textContent = String.fromCharCode(65 + idx) + '. ' + opt;
    btn.onclick = () => selectOption(idx, q.correct);
    
    const letter = document.createElement('div');
    letter.className = 'opt-letter';
    letter.textContent = String.fromCharCode(65 + idx);
    btn.prepend(letter);
    
    optsGrid.appendChild(btn);
  });
  
  // Update progress bar
  const percent = ((quizIndex + 1) / currentQuiz.questions.length) * 100;
  document.getElementById('qProgress').style.width = percent + '%';
}

function selectOption(idx, correctIdx) {
  const opts = document.querySelectorAll('.opt');
  opts.forEach(o => o.disabled = true);
  
  opts[idx].classList.add(idx === correctIdx ? 'correct' : 'wrong');
  opts[correctIdx].classList.add('correct');
  
  if (idx === correctIdx) {
    quizScore++;
    document.getElementById('feedbackDiv').textContent = '✓ Correct!';
    document.getElementById('feedbackDiv').className = 'feedback show ok';
  } else {
    document.getElementById('feedbackDiv').textContent = '✗ Incorrect. The correct answer is: ' + opts[correctIdx].textContent;
    document.getElementById('feedbackDiv').className = 'feedback show bad';
  }
  
  document.getElementById('qScore').textContent = `Score: ${quizScore}`;
  document.getElementById('nextBtn').classList.add('show');
}

function nextQ() {
  quizIndex++;
  document.getElementById('nextBtn').classList.remove('show');
  document.getElementById('feedbackDiv').className = 'feedback';
  loadQuestion();
}

function showScore() {
  const total = currentQuiz.questions.length;
  const percent = Math.round((quizScore / total) * 100);
  
  document.getElementById('scoreNum').textContent = `${quizScore}/${total}`;
  document.getElementById('scoreTitle').textContent = percent >= 80 ? '✓ Excellent!' : percent >= 60 ? 'Good!' : 'Try again';
  document.getElementById('scoreSub').textContent = `You scored ${percent}% on this chapter.`;
  
  navTo('score');
}

function restartQuiz() {
  // Get current chapter from quiz
  for (let ch in QUIZ) {
    if (QUIZ[ch] === currentQuiz) {
      startQuiz(ch);
      return;
    }
  }
}

// ═══ QUICK REVIEW ═══
function buildQuickReview() {
  // Placeholder for quick review content
  console.log('Quick review builder called');
}
