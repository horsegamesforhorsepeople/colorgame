let storedColor;
const inputBox = document.querySelector("input[type='text']");
const sliders = document.querySelectorAll("input[type='range']");
let correctColor;

function generateColor() {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);
  document.querySelector("body").style.backgroundColor = `rgb(${red}, ${green}, ${blue})`
  //console.log(red, green, blue);
  storedColor = "#FFFFFF";
  inputBox.value = storedColor;
  updateSliders(storedColor)
  updatePreview(storedColor);
  if (isColorBright(red, green, blue)) createCSSVariable("color", "black");
  else createCSSVariable("color", "white");
  const redHex = red.toString(16).toUpperCase().padStart(2, '0');
  const greenHex = green.toString(16).toUpperCase().padStart(2, '0');
  const blueHex = blue.toString(16).toUpperCase().padStart(2, '0');
  correctColor = redHex + greenHex + blueHex;
  //console.log(correctColor)
}

generateColor();

function updatePreview(hexColor) {
  document.getElementById("preview").style.backgroundColor = hexColor;
}

sliders.forEach(slider => {
  slider.addEventListener('input', event => {
    const value = Number(event.target.value);
    const valueInHex = value.toString(16).toUpperCase().padStart(2, '0');
    let newHex = inputBox.value;
    //console.log(valueInHex[0], valueInHex[1], valueInHex)

    if (newHex.length < 7) newHex = fillColorIfNotFull(newHex);

    newHex = newHex.split("");
    

    if (event.target.id === "red") {
      [newHex[1], newHex[2]] = [valueInHex[0], valueInHex[1]];
    } else if (event.target.id === "green") {
      [newHex[3], newHex[4]] = [valueInHex[0], valueInHex[1]];
    } else if (event.target.id === "blue") {
      [newHex[5], newHex[6]] = [valueInHex[0], valueInHex[1]];
    }

    newHex = newHex.join("");

    if (newHex.length < 7) newHex = fillColorIfNotFull(newHex);

    inputBox.value = newHex;
    updatePreview(newHex);
  });
});

const allowedChars = "0123456789ABCDEF".split("");
document.querySelector("input[type='text']").oninput = function() {
  let value = inputBox.value;
  inputBox.value = inputBox.value.toUpperCase()
  value = value.toUpperCase();
  // if the length is 0 just put a #
  if (inputBox.value.length === 0 || inputBox.value.length === 1 && inputBox.value[0] !== "#") {
    inputBox.value = "#";
    value = "#";
  } 
  // check so theres no bad character
  value = value.split("");
  for (let i = 1; i < inputBox.value.length; i++) {
    if (!allowedChars.includes(value[i])) value[i] = "F";
  }
  value = value.join("");
  inputBox.value = value;
  storedColor = inputBox.value;
  // if the color isn't "full" we want to fill it with Fs but not show it
  if (value.length < 7) value = fillColorIfNotFull(value);
  updatePreview(value)
  updateSliders(value);
}

function updateSliders(value) {
  const red = parseInt(value[1] + value[2], 16);
  const green = parseInt(value[3] + value[4], 16);
  const blue = parseInt(value[5] + value[6], 16);
  document.getElementById("red").value = red;
  document.getElementById("green").value = green;
  document.getElementById("blue").value = blue;
}

function fillColorIfNotFull(value) {
  for (let i = value.length; i < 7; i++) {
    value += "F";
  }
  return value;
}

function isColorBright(red, green, blue) {

  // Calculate brightness using the YIQ formula
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  // You can adjust the threshold value as per your preference
  const brightnessThreshold = 128;

  return brightness >= brightnessThreshold;
}

function createCSSVariable(property, value) {
  document.documentElement.style.setProperty(property, value);
}

function showResults() {
  document.querySelector("button").remove();
  // parse things
  let guessedValue = inputBox.value;
  if (guessedValue.length < 7) guessedValue = fillColorIfNotFull(guessedValue);
  guessedValue = guessedValue.substring(1)

  const yourRed = parseInt(guessedValue.substr(0, 2), 16);
  const yourGreen = parseInt(guessedValue.substr(2, 2), 16);
  const yourBlue = parseInt(guessedValue.substr(4, 2), 16);
  const correctRed = parseInt(correctColor.substr(0, 2), 16);
  const correctGreen = parseInt(correctColor.substr(2, 2), 16);
  const correctBlue = parseInt(correctColor.substr(4, 2), 16);
  const changeFactorRed = (yourRed / correctRed);
  const changeFactorGreen = (yourGreen / correctGreen);
  const changeFactorBlue = (yourBlue / correctBlue);
  const redText = getCorrectText(changeFactorRed, "red");
  const greenText = getCorrectText(changeFactorGreen, "green");
  const blueText = getCorrectText(changeFactorBlue, "blue");
  // console.log(yourRed, correctRed)
  // console.log(yourGreen, correctGreen)
  // console.log(yourBlue, correctBlue)
  let stats = document.createElement("p");
  stats.innerHTML = `correct: ${correctColor}<br>your guess: ${guessedValue}<br><br>${redText}<br>${greenText}<br>${blueText}`
  document.querySelector("main").append(stats)
}

function getCorrectText(factor, color) {
  //console.log(factor)
  if (factor < 1) return `your ${color} was ${((1 - factor) * 100).toFixed(2)}% too small`
  return `your ${color} was ${((factor - 1) * 100).toFixed(2)}% too big`
}