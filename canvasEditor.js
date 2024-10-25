const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let texts = []; // Stores text objects
let undoStack = [];
let redoStack = [];
let selectedText = null;
let isDragging = false;

// Add text to canvas
function addText() {
  const textInput = document.getElementById('textInput').value;
  const fontSize = parseInt(document.getElementById('fontSizeInput').value);
  const fontFamily = document.getElementById('fontSelect').value;
  const fontStyle = document.getElementById('fontStyle').value;
  
  if (!textInput) return; // Do nothing if input is empty

  const text = {
    text: textInput,
    x: canvas.width / 2,
    y: canvas.height / 2,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontStyle: fontStyle,
  };

  texts.push(text);
  saveState();
  drawCanvas();
}

// Draw text on canvas
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  texts.forEach((text) => {
    ctx.font = `${text.fontStyle} ${text.fontSize}px ${text.fontFamily}`;
    ctx.fillText(text.text, text.x, text.y);
  });
}

// Save state for undo
function saveState() {
  undoStack.push(JSON.parse(JSON.stringify(texts)));
  redoStack = []; // Clear redo stack
}

// Undo function
function undo() {
  if (undoStack.length > 0) {
    redoStack.push(JSON.parse(JSON.stringify(texts)));
    texts = undoStack.pop();
    drawCanvas();
  }
}

// Redo function
function redo() {
  if (redoStack.length > 0) {
    undoStack.push(JSON.parse(JSON.stringify(texts)));
    texts = redoStack.pop();
    drawCanvas();
  }
}

// Event listeners for dragging text
canvas.addEventListener('mousedown', (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  selectedText = texts.find((text) => 
    mouseX > text.x && mouseX < text.x + ctx.measureText(text.text).width &&
    mouseY < text.y && mouseY > text.y - text.fontSize
  );
  if (selectedText) {
    isDragging = true;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging && selectedText) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    selectedText.x = mouseX;
    selectedText.y = mouseY;
    drawCanvas();
  }
});

canvas.addEventListener('mouseup', () => {
  if (isDragging) {
    saveState();
    isDragging = false;
    selectedText = null;
  }
});

// Font change functions
function changeFont() {
  if (selectedText) {
    selectedText.fontFamily = document.getElementById('fontSelect').value;
    saveState();
    drawCanvas();
  }
}

function changeFontSize() {
  if (selectedText) {
    selectedText.fontSize = parseInt(document.getElementById('fontSizeInput').value);
    saveState();
    drawCanvas();
  }
}

function changeFontStyle() {
  if (selectedText) {
    selectedText.fontStyle = document.getElementById('fontStyle').value;
    saveState();
    drawCanvas();
  }
}
