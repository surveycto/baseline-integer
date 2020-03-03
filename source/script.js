// Find the input element
var input = document.getElementById('integer-field');

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter, inputReplacer) {
    textbox.inputReplacer = inputReplacer;

    function restrictInput() {
        if (inputFilter(this.value)) {
            if (this.inputReplacer) {
                this.value = this.inputReplacer(this.value);
            }
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
            this.value = "";
        }
    }

    // Apply restriction when typing, copying/pasting, dragging-and-dropping, etc.
    textbox.addEventListener("input", restrictInput);
    textbox.addEventListener("keydown", restrictInput);
    textbox.addEventListener("keyup", restrictInput);
    textbox.addEventListener("mousedown", restrictInput);
    textbox.addEventListener("mousedown", restrictInput);
    textbox.addEventListener("contextmenu", restrictInput);
    textbox.addEventListener("drop", restrictInput);
}

// If the field is not marked readonly, then restrict input to integer only.
if(!fieldProperties.READONLY) {
    setInputFilter(input, function (value) {
        // Empty value.
        if (value === "" || value === "-") {
            return true;
        }

        // Only allow digits to be entered.
        // A negative sign at the beginning is also allowed.
        var isValidInteger = /^-?\d*$/.test(value);
        if (isValidInteger) {
            var integer = parseInt(value, 10);
            isValidInteger = (integer >= -999999999 && integer <= 999999999); // match our existing limits for integer values.
        }

        return isValidInteger;
    });
}

// Define what happens when the user attempts to clear the response
function clearAnswer() {
    input.innerHTML = '';
} 

// If the field is not marked readonly, then focus on the field and show the on-screen keyboard (for mobile devices)
function setFocus() {
    if(!fieldProperties.READONLY){
        input.focus();
        if (window.showSoftKeyboard) {
            window.showSoftKeyboard();
        }
    }
}

// Save the user's response (update the current answer)
input.oninput = function() {
    setAnswer(input.value === "-" ? "" : input.value);
};
