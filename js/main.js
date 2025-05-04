// This file contains the core functionality of the terminal interface.
// It handles user input, displays output, manages command history,
// and integrates the interactive commands.

// Attempt to import commands. Make sure commands.js exists and exports these.
// If commands.js is not a module or doesn't export, handle potential errors.
let commands = {};
try {
    // Assuming commands.js is in the same directory and exports functions
    // NOTE: The user provided commands.js code uses 'help' in the export,
    // but the function is named 'commands'. Ensure consistency.
    // Assuming the function is exported as 'help' based on user's commands.js export statement.
    commands = await import('./commands.js');
    // If the exported function is actually named 'commands', adjust the import or usage below.
} catch (e) {
    console.warn("Could not load commands from ./commands.js. Using placeholders.", e);
    // Define placeholder functions if import fails
    commands = {
        help: () => "Available commands: help, about, projects, contact, clear (Commands module not loaded)",
        about: () => "About information unavailable.",
        projects: () => "Project information unavailable.",
        contact: () => "Contact information unavailable.",
        // The clear command logic is handled within executeCommand now
        clear: () => null // Placeholder, actual clear logic is below
    };
}

// Get references to DOM elements
const terminalOutput = document.getElementById('output');
const terminalInput = document.getElementById('input'); // The actual <input> element
const inputArea = document.getElementById('input-area'); // The container div
const terminalContainer = document.getElementById('terminal'); // The main terminal div

// Store command history
const commandHistory = [];
let historyIndex = -1;

/**
 * Resizes the input field to fit its content.
 * Calculates width based on character count using 'ch' units.
 */
function resizeInput() {
    // Ensure terminalInput exists before trying to access its properties
    if (terminalInput) {
        // Set width to the number of characters + 1 (for the cursor position)
        // Use max(1, ...) to ensure it's at least 1ch wide
        terminalInput.style.width = Math.max(1, terminalInput.value.length + 1) + 'ch';
    }
}

/**
 * Keeps focus on the input field.
 * Called when clicking anywhere in the terminal area.
 */
function keepFocus() {
    if (terminalInput) {
        // Use requestAnimationFrame to ensure focus happens after any potential
        // text selection processing by the browser.
        requestAnimationFrame(() => {
            terminalInput.focus();
        });
    }
}

/**
 * Appends a message or HTML element to the terminal output.
 * @param {string | HTMLElement} message - The content to display.
 * @param {string[]} [classes=[]] - Optional CSS classes to add to the output line div.
 */
function displayOutput(message, classes = []) {
    if (!terminalOutput) return; // Exit if output element doesn't exist

    const outputLine = document.createElement('div');

    // Add any specified classes BEFORE adding content if they affect layout/styling
    classes.forEach(cls => outputLine.classList.add(cls));

    if (typeof message === 'string') {
        // Preserve whitespace and newlines
        outputLine.style.whiteSpace = 'pre-wrap'; // Use CSS for better handling
        outputLine.appendChild(document.createTextNode(message)); // Append text safely
    } else if (message instanceof HTMLElement) {
        outputLine.appendChild(message); // Append HTML element directly
    }

    terminalOutput.appendChild(outputLine);
    // Auto-scroll to the bottom to show the latest output
    if (terminalContainer) {
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }
}

/**
 * Handles keydown events on the input field (Enter, Arrow Keys).
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function handleKeyDown(event) {
    if (!terminalInput) return; // Exit if input element doesn't exist

    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission/newline
        const originalInputValue = terminalInput.value; // Store original value before trimming
        const inputText = originalInputValue.trim(); // Get trimmed input value for logic

        // Display the entered command in the output (use original value)
        const inputLine = document.createElement('div');
        // Add a class to easily identify command lines if needed later
        inputLine.classList.add('command-line');
        inputLine.innerHTML = `<span class="prompt">user@portfolio:~$</span> `;
        inputLine.appendChild(document.createTextNode(originalInputValue)); // Append original text safely
        terminalOutput.appendChild(inputLine);


        if (inputText) {
            // Add to history only if it's not empty and different from the last command
            if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== inputText) {
                 commandHistory.push(inputText);
            }
            historyIndex = commandHistory.length; // Reset history index to the end
            executeCommand(inputText); // Process the command
        } else {
             // If input is empty, just scroll down to show the empty prompt line
             terminalContainer.scrollTop = terminalContainer.scrollHeight;
        }


        terminalInput.value = ''; // Clear the input field
        resizeInput(); // Resize the input field (it should be minimal width now)

    } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent cursor moving to start/end
        if (commandHistory.length > 0 && historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
            resizeInput(); // Resize after setting value
            // Move cursor to the end of the input after a brief delay
            setTimeout(() => {
                 terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
            }, 0);
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent cursor moving
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
            resizeInput(); // Resize after setting value
             // Move cursor to the end of the input after a brief delay
             setTimeout(() => {
                terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
             }, 0);
        } else if (historyIndex >= commandHistory.length - 1) {
            // If at or beyond the end of history, clear the input
            historyIndex = commandHistory.length; // Ensure index is at the end
            terminalInput.value = '';
            resizeInput(); // Resize after clearing
        }
    }
     // Scrolling is handled after command execution or on Enter for empty input
}

/**
 * Executes the given command string.
 * @param {string} input - The command string entered by the user.
 */
function executeCommand(input) {
    const [command, ...args] = input.toLowerCase().split(' ').filter(Boolean); // Split and remove empty parts

    let result = ''; // To store the output of the command

    switch (command) {
        case 'help':
        case 'commands':
            // Use the imported 'help' function (assuming export name is 'help')
            result = commands.help ? commands.help() : 'Help command not available.';
            break;
        case 'about':
            result = commands.about ? commands.about() : 'About command not available.';
            break;
        case 'projects':
            result = commands.projects ? commands.projects() : 'Projects command not available.';
            break;
        case 'contact':
            result = commands.contact ? commands.contact() : 'Contact command not available.';
            break;
        case 'clear':
            // --- MODIFIED CLEAR LOGIC ---
            if (terminalOutput) {
                // Select all direct children of the output div
                const children = Array.from(terminalOutput.children);
                children.forEach(child => {
                    // Remove the child IF it does NOT have the classes 'all-rights-reserved' OR 'welcome-message'
                    if (!child.classList.contains('all-rights-reserved') && !child.classList.contains('welcome-message')) {
                        terminalOutput.removeChild(child);
                    }
                });
            }
            // Call the imported clear function if it needs to do other cleanup (unlikely now)
            // if (commands.clear) commands.clear(); // This might not be needed anymore

             // No text output needed for clear itself
            result = null; // Indicate no standard output to display
            break;
         case '': // Handle empty input case (already handled in handleKeyDown)
             result = null;
             break;
        default:
            // Add a class for error messages if desired
            // displayOutput(`Command not found: ${command}. Type 'help' for available commands.`, ['error-message']);
             result = `Command not found: ${command}. Type 'help' for available commands.`;

    }

    // Display the result if it's not null (clear command returns null)
    if (result !== null) {
        // Pass the result to displayOutput. Add classes if needed.
        displayOutput(result);
    }

    // Ensure scroll to bottom after command execution or clear
    if (terminalContainer) {
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }
}

// --- Event Listeners Setup ---

// Resize input whenever text is typed or pasted
if (terminalInput) {
    terminalInput.addEventListener('input', resizeInput);
    // Handle special keys like Enter and Arrows
    terminalInput.addEventListener('keydown', handleKeyDown);
}

// Keep focus on the input when clicking anywhere inside the terminal container
// --- MODIFIED: Attach listener to body instead of terminalContainer ---
if (terminalInput && inputArea) { // Ensure input and its container exist
    document.body.addEventListener('click', (event) => {
        // Check if the click target is inside the input area or is the input itself
        const isClickInsideInputArea = inputArea.contains(event.target);

        // Check if the user is trying to select text anywhere on the page.
        const selection = window.getSelection();
        const isSelectingText = selection?.type === 'Range' && selection.toString().length > 0;

        // Focus the input if the click was *outside* the input area
        // AND the user is *not* actively selecting text.
        if (!isClickInsideInputArea && !isSelectingText) {
             keepFocus();
        }
        // If the click *was* inside the input area but *not* on the input itself
        // (e.g., clicking the prompt or the cursor span), also focus.
        else if (isClickInsideInputArea && event.target !== terminalInput && !isSelectingText) {
            keepFocus();
        }
    });

    // Add focus listener to input itself to ensure cursor visibility
    terminalInput.addEventListener('focus', () => {
        // You could add a class to the inputArea or cursor for visual feedback
        inputArea.classList.add('focused'); // Example: Add focus style
    });
    terminalInput.addEventListener('blur', () => {
        // Remove the focus class if you added one
        inputArea.classList.remove('focused'); // Example: Remove focus style
    });
}

// Initial setup when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Ensure initial messages are present before setup
    // (HTML should already contain them)

    resizeInput(); // Set initial size
    keepFocus();   // Set initial focus
    // Ensure the terminal scrolls to the bottom initially if there's overflow
    if (terminalContainer) {
         terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }
});

