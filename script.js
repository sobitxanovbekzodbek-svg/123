// 10-Player Quiz – Core Logic
const questions = [
  {question: 'What is the capital of France?', options: ['Paris', 'Berlin', 'Rome', 'Madrid'], answer: 0},
  {question: '2 + 2 * 2 = ?', options: ['6', '8', '4', '10'], answer: 0},
  {question: 'Which language runs in the browser?', options: ['Python', 'C++', 'JavaScript', 'Rust'], answer: 2},
  {question: 'Who wrote "1984"?', options: ['Orwell', 'Huxley', 'Austen', 'Shakespeare'], answer: 0},
  {question: 'Largest planet in our Solar System?', options: ['Earth', 'Saturn', 'Jupiter', 'Mars'], answer: 2}
];
let players = [];
let currentPlayer = null;
let currentQIdx = 0;
let score = 0;
const gameDiv = document.getElementById('game');
function init(){
  const stored = localStorage.getItem('quiz_players');
  if(stored) players = JSON.parse(stored);
  showWelcome();
}
function savePlayers(){localStorage.setItem('quiz_players', JSON.stringify(players));}
function showWelcome(){
  gameDiv.innerHTML = `
    <h2>Welcome!</h2>
    <p>Enter your name (max 10 players):</p>
    <input id="nameInput" type="text" maxlength="20" placeholder="Your name" />
    <button id="startBtn">Start</button>
    <hr/>
    <h3>Current Leaderboard</h3>
    <ul class="leaderboard" id="lb"></ul>
  `;
  document.getElementById('startBtn').onclick = () => {
    const name = document.getElementById('nameInput').value.trim();
    if(!name) return alert('Please enter a name');
    if(players.length >= 10 && !players.some(p=>p.name===name)) return alert('Maximum 10 players reached');
    currentPlayer = {name, score:0};
    if(!players.some(p=>p.name===name)) players.push(currentPlayer);
    startQuiz();
  };
  renderLeaderboard();
}
function renderLeaderboard(){
  const lb = document.getElementById('lb');
  const sorted = [...players].sort((a,b)=>b.score-a.score);
  lb.innerHTML = sorted.map(p=>`<li>${p.name}: ${p.score}</li>`).join('');
}
function startQuiz(){
  currentQIdx = 0; score = 0; showQuestion();
}
function showQuestion(){
  if(currentQIdx >= questions.length){ finishQuiz(); return; }
  const q = questions[currentQIdx];
  gameDiv.innerHTML = `<h2>${q.question}</h2>` +
    q.options.map((opt,i)=>`<div class="choice" data-idx="${i}">${opt}</div>`).join('') +
    `<p>Question ${currentQIdx+1} of ${questions.length}</p>`;
  document.querySelectorAll('.choice').forEach(el=>{
    el.onclick = () => {
      const idx = Number(el.dataset.idx);
      if(idx===q.answer) score++;
      currentQIdx++;
      showQuestion();
    };
  });
}
function finishQuiz(){
  const p = players.find(pl=>pl.name===currentPlayer.name);
  if(p) p.score = Math.max(p.score, score);
  savePlayers();
  gameDiv.innerHTML = `
    <h2>Well done, ${currentPlayer.name}!</h2>
    <p>Your score: ${score} / ${questions.length}</p>
    <button id="againBtn">Play Again</button>
    <button id="nextBtn">Next Player</button>
    <hr/>
    <h3>Leaderboard</h3>
    <ul class="leaderboard" id="lb2"></ul>
  `;
  document.getElementById('againBtn').onclick = () => startQuiz();
  document.getElementById('nextBtn').onclick = () => showWelcome();
  renderLeaderboard();
}
init();
