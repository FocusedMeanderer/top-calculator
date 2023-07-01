const controls = document.querySelectorAll('div.control');
const CALCWIDTH = 700;
const CALCHEIGHT = 500;

function arrangeControls() {
  controls.forEach(element => {
    console.log(element.className);
    element.style.width = `${CALCWIDTH/4}px`;
    element.style.height = `${CALCHEIGHT/6}px`;
    element.style.border = '1px dotted #1f2937';
  });
}

arrangeControls();