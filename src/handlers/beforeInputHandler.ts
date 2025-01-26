import { beforeInputHandlerConfig, beforeInputHandlerInterface } from "../interfaces/main";

export const beforeInputHandler = (
    {
        originalValue,
        inputType,
        caretPosition,
        selectionLength = 0,
        addedChar = ""
    }: beforeInputHandlerConfig
) : beforeInputHandlerInterface => {
    
    let newOriginalValue = originalValue;

    if (inputType === "insertText") {
        // handle insertion of new character
        if (selectionLength > 0) {
            // replace selected text
            newOriginalValue =
                originalValue.slice(0, caretPosition) +
                addedChar +
                originalValue.slice(caretPosition + selectionLength);
        } else {
            // insert new character at caret position
            newOriginalValue =
                originalValue.slice(0, caretPosition) +
                addedChar +
                originalValue.slice(caretPosition);
        }
    } else if (inputType === "deleteContentBackward") {
        // handle deletion backward (Backspace)
        if (selectionLength > 0) {
            // remove selected text
            newOriginalValue =
                originalValue.slice(0, caretPosition) +
                originalValue.slice(caretPosition + selectionLength);
        } else if (caretPosition > 0) {
            // delete character before caret
            newOriginalValue =
                originalValue.slice(0, caretPosition - 1) +
                originalValue.slice(caretPosition);
        }
    } else if (inputType === "deleteContentForward") {
        // handle deletion forward (Delete)
        if (selectionLength > 0) {
            // remove selected text
            newOriginalValue =
                originalValue.slice(0, caretPosition) +
                originalValue.slice(caretPosition + selectionLength);
        } else if (caretPosition < originalValue.length) {
            // delete character after caret
            newOriginalValue =
                originalValue.slice(0, caretPosition) +
                originalValue.slice(caretPosition + 1);
        }
    }

    // adjust caret position
    let newCaretPosition = caretPosition;

    if (inputType === "insertText") {
        newCaretPosition = caretPosition + 1;
    } else if (inputType === "deleteContentBackward") {
        newCaretPosition = selectionLength > 0 ? caretPosition : caretPosition - 1;
    } else if (inputType === "deleteContentForward") {
        newCaretPosition = caretPosition;
    }

    // ensure the caret stays within valid bounds
    newCaretPosition = Math.max(0, Math.min(newCaretPosition, newOriginalValue.length));

    return { newOriginalValue, newCaretPosition };
};
