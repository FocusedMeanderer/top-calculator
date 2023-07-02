const controls = document.querySelectorAll('div.control');
const CALCWIDTH = 700;
const CALCHEIGHT = 500;
const equation = document.querySelector('div.equation');
const result = document.querySelector('div.result');

function Calculator() {
  this.op = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => a % b,
  }
}

const calc = new Calculator();

function reset() {
  equation.textContent = '0';
  result.textContent = '0';
}

function arrangeControls() {
  controls.forEach(element => {
    element.style.width = `${(CALCWIDTH - 24)/4}px`;
    element.style.height = `${(CALCHEIGHT - 35)/6}px`;
    element.style.border = '1px dotted #1f2937';
  });
}

function isOperator(char) {
  return (char === '+' || char === '-' || char === '/' || char === '*'
    || char === '%' || char === '=');
}

function sanityCheck() {
  const text = equation.textContent;

  if (text.match(/[%\+-\/\*\.]\s*[%\+-\/\*\.=]+/) ||
    (text.match(/^\s*[%\+-\/\*\.]/)))
    return false;

  return true;
}

/*
  Evaluation is from left to right, MDAS is not followed
  For each iteration, perform the operation on the first two operands
    the operator between them,
    then replace them with the result.
    If there are more operations to be done, the new result will
    be one of the operands for the next operation.
  We remove the ' = ' before we begin so as to leave us with only
    the numbers and operators between them.
  When we only have one element left, we have our final result.
*/
function evaluate() {
  const tokens = equation.textContent.replace(/\s?=\s?$/, '').split(' ');

  let precisionDigits = 6;

  tokens.forEach(token => {
    if (token.indexOf('.') > -1) {
      precisionDigits = (token.length - 1 - token.indexOf('.') > precisionDigits) ?
        token.length - 1 - token.indexOf('.') : precisionDigits;
    }
  });

  if (sanityCheck() === false) {
    result.textContent = 'Error';
    return
  }

  if (tokens.length === 1 && !isOperator(tokens[0])) {
    result.textContent = tokens[0];
    return;
  }

  do {
    if (tokens[1] === '/' && +tokens[2] === 0) {
      result.textContent = 'Divide by Zero Error';
      return;
    }
    let thisOperation = calc.op[tokens[1]](+tokens[0], +tokens[2]);
    tokens.splice(0, 3, thisOperation);
  } while (tokens.length >= 3);

  result.textContent = +tokens[0].toFixed(precisionDigits);
}

function deleteLast() {
  if (equation.textContent.charAt(equation.textContent.length - 1) === ' '){
    equation.textContent = equation.textContent.slice(0, equation.textContent.length - 3);
  }
  else {
    equation.textContent = equation.textContent.slice(0, equation.textContent.length - 1);
  }
    
  if (equation.textContent.length === 0)
    reset();
}

function padOperator(char) {
  return ` ${char} `;
}

function equationBuilder(char) {
  const arr = equation.textContent.split(' ');

  if (char == 'c' || char == 'C') {
    reset();
    return;
  }

  if (char === 'Backspace') {
    deleteLast();
    return;
  }

  /*
   Was the last entry '=' sign? Then, we should start over
   unless the button pressed is also "="
   */
  if (equation.textContent.match(/\s*=\s*$/)) {
    if (char === '=') return;
    reset();
  }

  if (equation.textContent.length >= 26 && char !== '='){
    // Will overflow, suppress further entries
    return;
  }

  if (arr[arr.length - 1].length >= 15 && Number.isInteger(+char)) {
    // Limit 15 digits per operand
    return;
  }

  if (equation.textContent === '0') {
    if (!isOperator(char))
      equation.textContent = char;
      if (char === '.') {
        equation.textContent = '0'.concat(equation.textContent);
      }
  }
  else {
    if (isOperator(char)) {
      equation.textContent = equation.textContent.concat(padOperator(char));
    }
    else {
      const arr = equation.textContent.split(' ');
      const token = arr[arr.length - 1];

      switch (char) {
        case '.':
          if (token.length === 0) {
            equation.textContent = equation.textContent.concat('0', char);
          }
          else if (token.indexOf(char) >= 0) {
            return; // suppress more '.' in the same token
          }
          else {
            equation.textContent = equation.textContent.concat(char);
          }
          break;
        default:
          equation.textContent = equation.textContent.concat(char);
      }
    }

    if (char === '=') {
      evaluate();
      return;
    }

    if (sanityCheck()) {
      result.textContent = '0';
    }
    else {
      result.textContent = 'Error';
    }
  }
}

function handleKeyboardInput(e) {
  const keys = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                 '+', '-', '*', '/', '%', 'c', 'C', '.', '=', 'Backspace', 'Enter' ];

  if (keys.includes(e.key)) {
    let dataKey = `[data-key='${e.key}']`;
    
    if (e.key === 'C') {
      dataKey = `[data-key='${e.key.toLowerCase()}']`;
    }
    if (e.key === 'Enter') {
      dataKey = `[data-key='=']`;
    }
    
    const key = document.querySelector(dataKey);
    
    if (key && key.classList.contains('active')) {
      key.classList.add('pressed');
    }

    if (e.key === 'Enter') {
      equationBuilder('=');
    }
    else {
      equationBuilder(e.key);
    }
  }
}

function handleKeyboardUp(e) {
  const keys = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                 '+', '-', '*', '/', '%', 'c', 'C', '.', '=', 'Backspace', 'Enter' ];

  if (keys.includes(e.key)) {
    let dataKey = `[data-key='${e.key}']`;
    
    if (e.key === 'C') {
      dataKey = `[data-key='${e.key.toLowerCase()}']`;
    }
    if (e.key === 'Enter') {
      dataKey = `[data-key='=']`;
    }
    
    const key = document.querySelector(dataKey);
    
    if (key && key.classList.contains('active')) {
      key.classList.remove('pressed');
    }
  }
}

function handleClick(e) {
  if (e.target.classList.contains('active')) {
    equationBuilder(e.target.dataset.key);
  }
}

function handleHover(e) {
  if (e.target.classList.contains('active')) {
    e.target.classList.add('pressed');
  }
}

function handleMouseLeave(e) {
  if (e.target.classList.contains('active')) {
    e.target.classList.remove('pressed')
  }
}

arrangeControls();

const body = document.querySelector('body');
const divControls = document.querySelector('div.controls');

body.addEventListener('keydown', handleKeyboardInput);
body.addEventListener('keyup', handleKeyboardUp);
divControls.addEventListener('click', handleClick);

controls.forEach(control => {
  control.addEventListener('mouseover', handleHover);
  control.addEventListener('mouseleave', handleMouseLeave);
});

reset();