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
    '%': (a, b) => a / b,
  }
}

const calc = new Calculator();

function reset() {
  equation.textContent = '0';
  result.textContent = '0';
}

function arrangeControls() {
  controls.forEach(element => {
    element.style.width = `${CALCWIDTH/4}px`;
    element.style.height = `${CALCHEIGHT/6}px`;
    element.style.border = '1px dotted #1f2937';
  });
}

function isOperator(char) {
  return (char === '+' || char === '-' || char === '/' || char === '*'
    || char === '=');
}

function sanityCheck() {
  const text = equation.textContent;

  if (text.match(/[\+-\/\*\.]\s*[\+-\/\*\.]+/) ||
    (text.match(/^\s*[\+-\/\*\.]/)))
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
  const tokens = equation.textContent.replace(/\s*=\s*$/, '').split(' ');

  if (sanityCheck() === false) {
    result.textContent = 'Error';
    return
  }

  if (tokens.length === 1 && !isOperator(tokens[0])) {
    result.textContent = tokens[0];
    return;
  }

  do {
    let thisOperation = calc.op[tokens[1]](+tokens[0], +tokens[2]);
    tokens.splice(0, 3, thisOperation);
  } while (tokens.length >= 3);

  result.textContent = tokens[0];
}

function deleteLast() {
  if (equation.textContent.match(/\s*=\s*$/)) {
    reset();
  }
  else {
    equation.textContent = equation.textContent.replace(/\s*.\s*$/, '');
    
    if (equation.textContent.length === 0)
      reset();
  }
}

function padOperator(char) {
  return ` ${char} `;
}

function equationBuilder(char) {

  if (char == 'c' || char == 'C') {
    reset();
    return;
  }

  if (char === 'Backspace') {
    deleteLast();
    return;
  }

  /*
   Was the last entry = sign? Then, we should start over
   */
  if (equation.textContent.match(/\s*=\s*$/)) {
    if (char === '=') return;
    reset();
  }

  if (equation.textContent === '0') {

    if (isOperator(char)) {
      equation.textContent = padOperator(char);
      result.textContent = 'Error';
    }
    else {
      equation.textContent = char;
    }
  }
  else {
    if (isOperator(char)) {
      equation.textContent = equation.textContent.concat(padOperator(char));
    }
    else {
      equation.textContent = equation.textContent.concat(char);
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
  switch(e.key) {
    case '.':
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '+':
    case '-':
    case '*':
    case '/':
    case '=':
    case '%':
    case 'c':
    case 'C':
    case 'Backspace':
      equationBuilder(e.key);
      break;
    case 'Enter':
      equationBuilder('=');
      break;
    default:
      break;
  }
}

function handleClick(e) {
  if (e.target.classList.contains('active')) {
    equationBuilder(e.target.dataset.key);
  }
}

arrangeControls();

const body = document.querySelector('body');
const divControls = document.querySelector('div.controls');

body.addEventListener('keydown', handleKeyboardInput);
divControls.addEventListener('click', handleClick);

reset();