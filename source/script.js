// Detect platform
var isWebCollect = (document.body.className.indexOf("web-collect") >= 0);
var isAndroid = (document.body.className.indexOf("android-collect") >= 0);
var isIOS = (document.body.className.indexOf("ios-collect") >= 0);

// Find the input element
var input = document.getElementById('integer-field');

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
    function restrictInput() {
        if (inputFilter(this.value)) {
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

    // Set/remove the "inputmode".
    function setInputMode(attributeValue) {
        if (attributeValue === null) {
            input.removeAttribute("inputmode");
        } else {
            input.setAttribute("inputmode", attributeValue);
        }
    }

    // For iOS, we'll default the inputmode to "numeric", unless some specific value is
    // passed as plug-in parameter.
    if (isIOS) {
        var inputModeIOS = getPluginParameter("inputmode-ios");
        if (inputModeIOS === undefined) {
            inputModeIOS = "numeric";
        }
        setInputMode(inputModeIOS);
    }
    // For Android, we'll default the inputmode to "decimal" (as defined in the template.html) file,
    // unless some specific value is passed as plug-in parameter.
    else if (isAndroid) {
        var inputModeAndroid = getPluginParameter("inputmode-android");
        if (inputModeAndroid !== undefined) {
            setInputMode(inputModeAndroid);
        }
    }
    // For WebCollect, we'll default the inputmode to "decimal" (as defined in the template.html) file,
    // unless some specific value is passed as plug-in parameter.
    else if(isWebCollect) {
        var inputModeWebCollect = getPluginParameter("inputmode-web");
        if (inputModeWebCollect !== undefined) {
            setInputMode(inputModeWebCollect);
        }
    }

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
    input.value = '';
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
