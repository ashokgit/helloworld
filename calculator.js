let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = currentInput;
}

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        // Prevent multiple operators in a row
        const lastChar = currentInput[currentInput.length - 1];
        const operators = ['+', '-', '*', '/', '%'];
        
        if (operators.includes(lastChar) && operators.includes(value)) {
            // Replace the last operator with the new one
            currentInput = currentInput.slice(0, -1) + value;
        } else {
            currentInput += value;
        }
    }
    
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    try {
        // Replace × with * for calculation
        let expression = currentInput.replace(/×/g, '*');
        
        // Validate expression
        if (expression === '' || expression === '0') {
            return;
        }
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle percentage
        if (expression.includes('%')) {
            // Simple percentage calculation: if last number has %, divide by 100
            expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
            result = eval(expression);
        }
        
        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;
        
        // Convert to string and update display
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            clearDisplay();
        }, 2000);
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-') {
        appendToDisplay(key);
    } else if (key === '*') {
        appendToDisplay('*');
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize display
updateDisplay();
