let arr; //this is the array of strings
const timeDelay = 100;
const factor = 4;
const txtArea = document.querySelector(".typed-text");

function deleteLetters(value) {
  let index = value.length;

  const endId = setInterval(() => {
    let newTxt = value.substr(0, index);
    index--;
    txtArea.innerHTML = newTxt;
    if (index == -1) {
      clearInterval(endId);
      randomIdgenerator();
    }
  }, timeDelay);
}

function addLetters(i) {
  const value = arr[i];
  if (arr.length == 0) {
    setTimeout(newLetters, timeDelay * factor);
    return;
  }
  arr.splice(i, 1);

  let index = 0;

  const startId = setInterval(() => {
    let newTxt = value.substr(0, index + 1);
    index++;
    txtArea.innerHTML = newTxt;

    if (index == value.length) {
      clearInterval(startId);
      setTimeout(() => {
        deleteLetters(value);
      }, timeDelay * factor);
    }
  }, timeDelay);
}

function randomIdgenerator() {
  const i = Math.floor(Math.random() * arr.length);
  setTimeout(() => {
    addLetters(i);
  }, timeDelay * factor);
}

async function newLetters() {
  let randomTextCollection = await fetch("assets/extraTxt.txt");
  randomTextCollection = await randomTextCollection.text();
  arr = await randomTextCollection.split("\n");
  randomIdgenerator();
}

newLetters();
