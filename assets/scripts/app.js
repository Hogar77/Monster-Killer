const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt ("Podesi maksimalan broj životnih poena za vas i za čudovište!",100)

let chosenMaxLife = parseInt(enteredValue);

let battleLog = [];

if (isNaN(chosenMaxLife)|| chosenMaxLife <= 0) {
  chosenMaxLife=100;
}

let currentMonsterHealth=chosenMaxLife;
let currentPlayerHealth=chosenMaxLife;
let hasBonusLife = true ;

adjustHealthBars (chosenMaxLife);  //funkcija iz vendor.js

function writeToLog (ev, val, monsterHealth, PlayerHealth) {
  let logEntry;

  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: 'MONSTER',
        finalMonsterHealtH: monsterHealth,
        finalPlayerHealth: PlayerHealth
      };
      break;
      case LOG_EVENT_PLAYER_STRONG_ATTACK:
        logEntry = {
          event: ev,
          value: val,
          target: 'MONSTER',
          finalMonsterHealtH: monsterHealth,
          finalPlayerHealth: PlayerHealth
        };
      break;
      case LOG_EVENT_MONSTER_ATTACK:
        logEntry = {
          event: ev,
          value: val,
          target: 'PLAYER',
          finalMonsterHealtH: monsterHealth,
          finalPlayerHealth: PlayerHealth
        };
      break;
      case LOG_EVENT_PLAYER_HEAL:
        logEntry = {
          event: ev,
          value: val,
          target: 'PLAYER',
          finalMonsterHealtH: monsterHealth,
          finalPlayerHealth: PlayerHealth
        };    
      break;
      case LOG_EVENT_GAME_OVER:
        logEntry = {
          event: ev,
          value: val,
          finalMonsterHealtH: monsterHealth,
          finalPlayerHealth: PlayerHealth
        };
      break;
      default:
        logEntry = {}; 
  }

  // if (ev === LOG_EVENT_PLAYER_ATTACK){
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     target: 'MONSTER',
  //     finalMonsterHealtH: monsterHealth,
  //     finalPlayerHealth: PlayerHealth
  //   };
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     target: 'MONSTER',
  //     finalMonsterHealtH: monsterHealth,
  //     finalPlayerHealth: PlayerHealth
  //   };
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     target: 'PLAYER',
  //     finalMonsterHealtH: monsterHealth,
  //     finalPlayerHealth: PlayerHealth
  //   };
  // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     target: 'PLAYER',
  //     finalMonsterHealtH: monsterHealth,
  //     finalPlayerHealth: PlayerHealth
  //   };    
  // } else if (ev === LOG_EVENT_GAME_OVER) {
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     finalMonsterHealtH: monsterHealth,
  //     finalPlayerHealth: PlayerHealth
  //   };
  // }
  battleLog.push(logEntry);
}

function reset () {
  currentMonsterHealth=chosenMaxLife;
  currentPlayerHealth=chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound () {
  const initialPlayerHealth=currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE); // funkcija u vendor.js prikazuje umanjen progres bar 
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK, 
    playerDamage, 
    currentMonsterHealth, 
    currentPlayerHealth
    );

    if (currentPlayerHealth <= 0 && hasBonusLife === true){
      hasBonusLife = false;
      removeBonusLife();
      currentPlayerHealth=initialPlayerHealth;
      setPlayerHealth(initialPlayerHealth);
      alert('Umro si ali te je spasio rezervni život! uradi šta treba da pokušaš da se povratiš.');
    }
  
    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('Ti si pobedio!');
    writeToLog(
      LOG_EVENT_GAME_OVER, 
      'PLAYER WON', 
      currentMonsterHealth, 
      currentPlayerHealth
      );
        } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
      alert('Izgubio si!');
      writeToLog(
        LOG_EVENT_GAME_OVER, 
        'MONSTER WON', 
        currentMonsterHealth, 
        currentPlayerHealth
        );
        } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
      alert('Nije rešeno ko je pobednik! Obojica ste mrtvi!');
      writeToLog(
        LOG_EVENT_GAME_OVER, 
        'A DRAW', 
        currentMonsterHealth, 
        currentPlayerHealth
        );
        }
    if(currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
      reset();
    }
}

function attackMonster(modeAttack){
  const maxDamage = modeAttack === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent = 
    modeAttack === MODE_ATTACK 
    ? LOG_EVENT_PLAYER_ATTACK 
    : LOG_EVENT_PLAYER_STRONG_ATTACK; // Zamena za IF statement ispod
    
  // if (modeAttack === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent=LOG_EVENT_PLAYER_ATTACK;
  // } else if (modeAttack === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent=LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage); // funkcija u vendor.js prikazuje umanjen progres bar 
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent, 
    damage, 
    currentMonsterHealth, 
    currentPlayerHealth
    );
  endRound ();
}

function attackHandler () {
attackMonster (MODE_ATTACK);
}

// function strongAttackHandler (){
// attackMonster (MODE_STRONG_ATTACK)
// }
let lastStrongAttackTime = 0;
let lastHealTime = 0;
const strongAttackCooldown = 30000; // 30 sekundi u milisekundama
const healCooldown = 30000; // 30 sekundi u milisekundama

function strongAttackHandler (){
  const currentTime = new Date().getTime();
  if (currentTime - lastStrongAttackTime >= strongAttackCooldown) {
    attackMonster(MODE_STRONG_ATTACK);
    lastStrongAttackTime = currentTime;
    // Pokrenite tajmer za "Strong Attack" cooldown
    startCooldownTimer('strongAttack');
  } else {
    alert('Strong Attack je na hlađenju! Pričekajte da se ponovo napuni.');
  }
}

function healPlayerHandler(){
  const currentTime = new Date().getTime();
  if (currentTime - lastHealTime >= healCooldown) {
    lastHealTime = currentTime;
    // Pokrenite tajmer za "Heal" cooldown
    startCooldownTimer('heal');

    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
      alert("Dostigao si maximum izlečenja!");
      healValue = chosenMaxLife - currentPlayerHealth;
    } else {
      healValue = HEAL_VALUE;
    }

    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
      LOG_EVENT_PLAYER_HEAL, 
      healValue, 
      currentMonsterHealth, 
      currentPlayerHealth
    );
    endRound ();
  } else {
    alert('Heal je na hlađenju! Pričekajte da se ponovo napuni.');
  }
}


function startCooldownTimer(type) {
  const progressBar = type === 'strongAttack' ? strongAttackProgressBar : healProgressBar;
  progressBar.max = 100;
  progressBar.value = 0;

  const startTime = new Date().getTime();
  const endTime = startTime + (type === 'strongAttack' ? strongAttackCooldown : healCooldown);

  const updateInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const remainingTime = Math.max(0, endTime - currentTime);
    const progress = 100 - (remainingTime / (endTime - startTime)) * 100;
    progressBar.value = progress;

    if (remainingTime <= 0) {
      clearInterval(updateInterval);
      progressBar.value = 100;
    }
  }, 1000);
}



function printLogHandler () {
  console.log(battleLog);
}


attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);