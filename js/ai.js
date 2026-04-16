// ══════════════════════════════════════════════
// AI MODULE — Offline AI Chat System
// ══════════════════════════════════════════════

let aiChatHistory = [];
let aiEnabled = true;

// ═══ INITIALIZE AI ═══
function initAI() {
  aiChatHistory = JSON.parse(localStorage.getItem('bontrager_ai_history_v1') || '[]');
  renderChatHistory();
}

// ═══ SEND MESSAGE ═══
function sendAI(message) {
  if (!message.trim()) return;
  
  // Add user message
  aiChatHistory.push({
    type: 'user',
    text: message,
    timestamp: Date.now()
  });
  
  renderUserBubble(message);
  
  // Generate AI response
  setTimeout(() => {
    const response = generateAIResponse(message);
    aiChatHistory.push({
      type: 'ai',
      text: response,
      timestamp: Date.now()
    });
    
    renderAIBubble(response);
    
    // Save history
    localStorage.setItem('bontrager_ai_history_v1', JSON.stringify(aiChatHistory));
  }, 500);
  
  // Clear input
  const aiInput = document.getElementById('aiInput');
  if (aiInput) aiInput.value = '';
}

// ═══ RESPONSE GENERATION ═══
function generateAIResponse(userMsg) {
  const lower = userMsg.toLowerCase();
  
  // Check for specific queries
  if (lower.includes('cr') || lower.includes('central ray')) {
    return generateCRResponse(userMsg);
  }
  
  if (lower.includes('kv') || lower.includes('kilovolt') || lower.includes('kVp')) {
    return generateKVResponse(userMsg);
  }
  
  if (lower.includes('technique') || lower.includes('technical')) {
    return generateTechniqueResponse(userMsg);
  }
  
  if (lower.includes('position')) {
    return generatePositionResponse(userMsg);
  }
  
  if (lower.includes('list') || lower.includes('all')) {
    return generateListResponse(userMsg);
  }
  
  if (lower.includes('difference') || lower.includes('compare') || lower.includes('vs')) {
    return generateComparisonResponse(userMsg);
  }
  
  if (lower.includes('error') || lower.includes('wrong') || lower.includes('mistake')) {
    return generateErrorResponse(userMsg);
  }
  
  // Default response
  return generateDefaultResponse(userMsg);
}

// ═══ SPECIFIC RESPONSES ═══
function generateCRResponse(userMsg) {
  // Find mentioned position
  const pos = findPositionInMessage(userMsg);
  
  if (pos) {
    const posData = getPositionData(pos.name);
    if (posData && posData.info) {
      return `Central Ray for ${pos.name}:\n${posData.info.cr || 'Information not available'}`;
    }
  }
  
  return 'Please specify which position you want to know the CR (Central Ray) direction for. For example: "CR for PA Chest" or "Central Ray for AP Abdomen".';
}

function generateKVResponse(userMsg) {
  const pos = findPositionInMessage(userMsg);
  
  if (pos) {
    const posData = getPositionData(pos.name);
    if (posData && posData.info) {
      return `kVp Settings for ${pos.name}:\n${posData.info.kv || 'Standard range: 60-100 kVp'}`;
    }
  }
  
  // General kVp info
  return `General kVp Ranges:\n- Extremities: 40-60 kVp\n- Chest: 80-100 kVp\n- Abdomen: 70-90 kVp\n- Spine: 75-95 kVp`;
}

function generateTechniqueResponse(userMsg) {
  const pos = findPositionInMessage(userMsg);
  
  if (pos) {
    const posData = getPositionData(pos.name);
    if (posData && posData.info) {
      return `Technical Parameters for ${pos.name}:\n- CR: ${posData.info.cr || 'N/A'}\n- IR: ${posData.info.ir || 'N/A'}\n- SID: ${posData.info.sid || 'N/A'}\n- kVp: ${posData.info.kv || 'N/A'}\n- Respiration: ${posData.info.resp || 'N/A'}`;
    }
  }
  
  return 'Which position would you like technique information for?';
}

function generatePositionResponse(userMsg) {
  const pos = findPositionInMessage(userMsg);
  
  if (pos) {
    const posData = getPositionData(pos.name);
    if (posData) {
      return `${pos.name}\nType: ${posData.type}\nDescription: ${posData.info.desc || 'Position for radiographic evaluation'}\n\nTechnique:\n- CR: ${posData.info.cr}\n- IR: ${posData.info.ir}\n- SID: ${posData.info.sid}`;
    }
  }
  
  return 'Which position would you like to know more about?';
}

function generateListResponse(userMsg) {
  const chapters = Object.keys(BOOK);
  
  if (lower.includes('chapter')) {
    return `Available Chapters:\n${chapters.map((ch, i) => `${i + 1}. ${ch}`).join('\n')}`;
  }
  
  // List first chapter's positions
  const firstCh = chapters[0];
  if (BOOK[firstCh]) {
    let positions = [];
    for (let sub in BOOK[firstCh]) {
      if (BOOK[firstCh][sub].positions) {
        positions.push(...BOOK[firstCh][sub].positions.map(p => p.name));
      }
    }
    return `Positions in ${firstCh}:\n${positions.slice(0, 10).join('\n')}`;
  }
  
  return 'What would you like me to list? Try: "List chapters" or "List positions in chest"';
}

function generateComparisonResponse(userMsg) {
  return 'Radiographic Comparisons:\n\nPA vs AP Chest:\n- PA: Patient faces detector, more accurate heart size\n- AP: Portable, used supine/upright, magnifies heart\n\nRAO vs LAO:\n- RAO: Right anterior oblique, 45° rotation\n- LAO: Left anterior oblique, opposite rotation\n\nMay I ask which specific positions you want to compare?';
}

function generateErrorResponse(userMsg) {
  return `Common Radiographic Errors:\n\n1. Rotation errors: Patient not straight\n2. Centering errors: CR not on IR\n3. Exposure errors: Over/underexposure\n4. Collimation errors: Field too large/small\n5. Student errors: Improper technique\n\nFor a specific position, tell me which position and I can list common errors.`;
}

function generateDefaultResponse(userMsg) {
  return `Hello! I'm your Bontrager positioning assistant. I can help you with:\n• Position techniques (CR, kVp, SID, etc.)\n• Radiographic anatomy\n• Comparisons between positions\n• Error analysis\n• Chapter and position listings\n\nWhat would you like to know?`;
}

// ═══ HELPER FUNCTIONS ═══
function findPositionInMessage(msg) {
  // Search BOOK for mentioned positions
  for (let ch in BOOK) {
    for (let sub in BOOK[ch]) {
      if (BOOK[ch][sub].positions) {
        for (let pos of BOOK[ch][sub].positions) {
          if (msg.toLowerCase().includes(pos.name.toLowerCase())) {
            return pos;
          }
        }
      }
    }
  }
  return null;
}

function getPositionData(posName) {
  // Find position in BOOK
  for (let ch in BOOK) {
    for (let sub in BOOK[ch]) {
      if (BOOK[ch][sub].positions) {
        const found = BOOK[ch][sub].positions.find(p => p.name.toLowerCase() === posName.toLowerCase());
        if (found) return found;
      }
    }
  }
  return null;
}

// ═══ RENDERING ═══
function renderUserBubble(text) {
  const chatDiv = document.getElementById('aiChat');
  if (!chatDiv) return;
  
  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble user';
  bubble.textContent = text;
  chatDiv.appendChild(bubble);
  
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function renderAIBubble(text) {
  const chatDiv = document.getElementById('aiChat');
  if (!chatDiv) return;
  
  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble ai';
  bubble.textContent = text;
  chatDiv.appendChild(bubble);
  
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function renderChatHistory() {
  const chatDiv = document.getElementById('aiChat');
  if (!chatDiv) return;
  
  chatDiv.innerHTML = '';
  
  aiChatHistory.forEach(msg => {
    const bubble = document.createElement('div');
    bubble.className = `ai-bubble ${msg.type}`;
    bubble.textContent = msg.text;
    chatDiv.appendChild(bubble);
  });
  
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// ═══ SUGGESTED PROMPTS ═══
function useSuggestedPrompt(prompt) {
  const aiInput = document.getElementById('aiInput');
  if (aiInput) {
    aiInput.value = prompt;
    aiInput.focus();
  }
}

// ═══ CLEAR HISTORY ═══
function clearAIChatHistory() {
  if (confirm('Clear all chat history?')) {
    aiChatHistory = [];
    localStorage.removeItem('bontrager_ai_history_v1');
    renderChatHistory();
  }
}

// ═══ KEYBOARD HANDLING ═══
document.addEventListener('DOMContentLoaded', () => {
  const aiInput = document.getElementById('aiInput');
  if (aiInput) {
    aiInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAI(aiInput.value);
      }
    });
  }
  
  const aiSendBtn = document.getElementById('aiSendBtn');
  if (aiSendBtn) {
    aiSendBtn.addEventListener('click', () => {
      const input = document.getElementById('aiInput');
      if (input) sendAI(input.value);
    });
  }
  
  initAI();
});
