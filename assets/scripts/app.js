const ATTACK_VALUE = 10;
const STRONG_ATACK_VALUE = 17;
const MONSTER_ATACK_VALUE = 14;
const HEAL_VALUE = 20;

let chosenMaxLife = 100;
let currentMonsterHealth=chosenMaxLife;
let currentPlayerHealth=chosenMaxLife;
let hasBonusLife = true ;

adjustHealthBars (chosenMaxLife);  //funkcija iz vendor.js

function endRound () {
  const initialPlayerHealth=currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATACK_VALUE); // funkcija u vendor.js prikazuje umanjen progres bar 
  currentPlayerHealth -= playerDamage

    if (currentPlayerHealth <= 0 && hasBonusLife === true){
      hasBonusLife = false;
      removeBonusLife();
      currentPlayerHealth=initialPlayerHealth;
      setPlayerHealth(initialPlayerHealth);
      alert('Umro si ali te je spasio rezervni život! uradi šta treba da pokušaš da se povratiš.');
    }
  
    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('Ti si pobedio!');
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
      alert('Izgubio si!');
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
      alert('Nije rešeno ko je pobednik! Obojica ste mrtvi!');
    }
}

function attackMonster(modeAttack){
  let maxDamage;
  if (modeAttack === 'ATTACK') {
    maxDamage = ATTACK_VALUE;
  } else if (modeAttack ==='STRONG_ATTACK') {
    maxDamage = STRONG_ATACK_VALUE;
  }
  const damage = dealMonsterDamage(maxDamage); // funkcija u vendor.js prikazuje umanjen progres bar 
  currentMonsterHealth -= damage;
  endRound ();
  // const playerDamage = dealPlayerDamage(MONSTER_ATACK_VALUE); // funkcija u vendor.js prikazuje umanjen progres bar 
  // currentPlayerHealth -= playerDamage
  
  //   if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
  //   alert('Ti si pobedio!');
  //   } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
  //     alert('Izgubio si!');
  //   } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
  //     alert('Nije rešeno ko je pobednik! Obojica ste mrtvi!');
  //   }
}

function attackHandler () {
attackMonster ('ATTACK');
}

function strongAttackHandler (){
attackMonster ('STRONG_ATTACK')
}

function healPlayerHandler(){
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife-HEAL_VALUE){
    alert("Dostigao si maximum izlečenja!");
    healValue=chosenMaxLife-currentPlayerHealth
  } else {
    healValue = HEAL_VALUE;
  }
  
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  endRound ();
  

}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);