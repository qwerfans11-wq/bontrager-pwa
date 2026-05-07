// js/init.js — Startup event wiring for static global scripts
(function(){
  var DEFAULT_FONT_SIZE = 15;
  var DEFAULT_FLASHCARD_FONT_SIZE = 16;
  var HOME_BUTTON_IDS = [
    'learnChaptersHomeBtn','learnSubChHomeBtn','learnPosHomeBtn','quizChaptersHomeBtn',
    'anatHomeBtn','settingsHomeBtn','bookHomeBtn','aboutHomeBtn','devManagerHomeBtn',
    'aiHomeBtn','qrHomeBtn','posHomeBtn'
  ];

  function on(id, event, handler){
    var el = document.getElementById(id);
    if(el) el.addEventListener(event, handler);
  }

  function call(fnName){
    var args = Array.prototype.slice.call(arguments, 1);
    if(typeof window[fnName] === 'function') return window[fnName].apply(null, args);
  }

  function nav(id){
    if(typeof navTo === 'function') navTo(id);
    if(typeof closeSidebar === 'function') closeSidebar();
  }

  function sendAiFromInput(){
    var input = document.getElementById('aiInput');
    call('sendAI', input ? input.value : '');
  }

  function adjustNumberInput(inputId, defaultValue, delta, callbackName){
    var input = document.getElementById(inputId);
    if(!input) return;
    var parsed = parseInt(input.value || String(defaultValue),10);
    var base = Number.isNaN(parsed) ? defaultValue : parsed;
    input.value = String(base + delta);
    call(callbackName);
  }

  // Home cards
  on('homeLearnCard','click',function(){ nav('learn-chapters'); });
  on('homeQuizCard','click',function(){ nav('quiz-chapters'); });
  on('homeQuickReviewCard','click',function(){ nav('quickreview'); });
  on('homeAnatomyCard','click',function(){ nav('anatomy'); });
  on('homeBookCard','click',function(){ nav('book'); });

  // Sidebar navigation
  on('nav-home','click',function(){ nav('home'); });
  on('nav-learn-chapters','click',function(){ nav('learn-chapters'); });
  on('nav-quiz-chapters','click',function(){ nav('quiz-chapters'); });
  on('nav-ai','click',function(){ nav('ai'); });
  on('nav-quickreview','click',function(){ nav('quickreview'); });
  on('nav-anatomy','click',function(){ nav('anatomy'); });
  on('nav-settings','click',function(){ nav('settings'); });
  on('nav-profile','click',function(){ call('openProfileModal'); });

  // Bottom navigation
  on('bnav-home','click',function(){ nav('home'); });
  on('bnav-learn','click',function(){ nav('learn-chapters'); });
  on('bnav-quiz','click',function(){ nav('quiz-chapters'); });
  on('bnav-ai','click',function(){ nav('ai'); });
  on('bnav-more','click',function(){ call('toggleSidebar'); });

  // Header actions
  on('aboutHeaderBtn','click',function(){ nav('about'); });
  on('studyModeBtn','click',function(){ call('toggleStudyMode'); });
  on('colorModeBtn','click',function(){ call('toggleDark'); });
  on('devAppearanceBtn','click',function(){ call('openDevAppearance'); });

  // Home/back buttons
  HOME_BUTTON_IDS.forEach(function(id){
    on(id,'click',function(){ nav('home'); });
  });
  on('bookReaderBackBtn','click',function(){ nav('book'); });

  // Auth / profile / confirm / appearance
  on('devLoginCancelBtn','click',function(){ call('cancelDevLogin'); });
  on('devLoginSubmitBtn','click',function(){ call('submitDevLogin'); });
  on('pmSaveBtn','click',function(){ call('saveProfile'); });
  on('confirmYesBtn','click',function(){ call('confirmYes'); });
  on('confirmNoBtn','click',function(){ call('confirmNo'); });
  on('dapApplyBtn','click',function(){ call('saveAppearance'); });
  on('dapCancelBtn','click',function(){ call('closeDevAppearance'); });
  on('dapResetBtn','click',function(){ call('resetAppearance'); });

  // Quiz actions
  on('nextBtn','click',function(){ call('nextQ'); });
  on('exitQuizBtn','click',function(){ call('confirmExitQuiz'); });
  on('quizCountCancelBtn','click',function(){ call('_qcCancel'); });
  on('quizCountStartBtn','click',function(){ call('_qcStart'); });
  on('quizCountCustom','input',function(){ call('_qcSelectCustom'); });
  on('editModalSaveBtn','click',function(){ call('saveEdit'); });
  on('editModalCancelBtn','click',function(){ call('closeEditModal'); });

  // AI helpers
  on('aiSendBtn','click',sendAiFromInput);
  on('aiPlanBtn','click',function(){ call('sendAI','Build me a 7-day study plan based on Bontrager chapters.'); });
  on('aiMistakesBtn','click',function(){ call('askAIAboutMistakes'); });
  on('aiClearBtn','click',function(){ call('aiClearChat'); });
  on('aiInput','keydown',function(e){
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      sendAiFromInput();
    }
  });

  // Settings toggles and controls
  on('darkToggle','click',function(){ call('toggleDark'); });
  on('largeToggle','click',function(){ call('toggleLarge'); });
  on('highContrastToggle','click',function(){ call('toggleHighContrast'); });
  on('bottomNavToggle','click',function(){ call('toggleBottomNav'); });

  on('shuffleToggle','click',function(e){
    e.currentTarget.classList.toggle('on');
    call('_saveQuizSettings');
  });
  on('hintToggle','click',function(e){
    e.currentTarget.classList.toggle('on');
    call('_saveQuizSettings');
  });
  on('qCount','change',function(){ call('_saveQuizSettings'); });

  on('resetViewedBtn','click',function(){ call('resetViewedPositions'); });
  on('resetQuizBtn','click',function(){ call('resetQuizScores'); });
  on('resetFontDefaultsBtn','click',function(){ call('resetFontAppearanceDefaults'); });

  on('fontSelect','change',function(){ call('onFontChange'); });
  on('fontWeightSelect','change',function(){ call('onFontWeightChange'); });
  on('fontSizeInput','change',function(){ call('onFontSizeChange'); });
  on('flashcardFontSizeInput','change',function(){ call('onFlashcardFontSizeChange'); });
  on('textColorPicker','input',function(){ call('onTextColorChange'); });
  ['fcFront1','fcFront2','fcBack1','fcBack2'].forEach(function(id){
    on(id,'input',function(){ call('onFlashcardColorChange'); });
  });

  on('fontSizeDecBtn','click',function(){
    adjustNumberInput('fontSizeInput', DEFAULT_FONT_SIZE, -1, 'onFontSizeChange');
  });
  on('fontSizeIncBtn','click',function(){
    adjustNumberInput('fontSizeInput', DEFAULT_FONT_SIZE, 1, 'onFontSizeChange');
  });
  on('flashFontSizeDecBtn','click',function(){
    adjustNumberInput('flashcardFontSizeInput', DEFAULT_FLASHCARD_FONT_SIZE, -1, 'onFlashcardFontSizeChange');
  });
  on('flashFontSizeIncBtn','click',function(){
    adjustNumberInput('flashcardFontSizeInput', DEFAULT_FLASHCARD_FONT_SIZE, 1, 'onFlashcardFontSizeChange');
  });

  // Restore session buttons
  on('sbRestoreSession','click',function(){ call('offerRestoreSession'); });
  on('restoreSessionCloseBtn','click',function(){
    var el = document.getElementById('restoreSessionOverlay');
    if(el) el.classList.remove('open');
  });
  on('restoreSessionDiscardBtn','click',function(){ call('_discardSavedSession'); });
  on('restoreSessionRestoreBtn','click',function(){ call('_doRestoreSession'); });

  // Role switch
  on('roleStudent','click',function(){ if(typeof setRole==='function') setRole('student'); });
  on('roleDev','click',function(){ if(typeof requestDevRole==='function') requestDevRole(); });

  // Initial font setup if available
  call('initAppFont');
})();
