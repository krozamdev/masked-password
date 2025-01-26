import { pasteHandlerConfig, pasteHandlerInterface } from "../interfaces/main";

export const pasteHandler = (
    {
        originalValue,
        caretPosition,
        pastedText,
        selectionLength = 0,
    } : pasteHandlerConfig
) : pasteHandlerInterface => {
    if (selectionLength > 0) {
        // remove the selected text from originalValue
        originalValue = originalValue.slice(0, caretPosition) + originalValue.slice(caretPosition + selectionLength);
    }

    // insert the pasted text at the caret position, and adjust originalValue
    const newOriginalValue : string =
        originalValue.slice(0, caretPosition) +
        pastedText +
        originalValue.slice(caretPosition);
    
    const newCaretPosition = caretPosition + pastedText.length;

    return {
        newOriginalValue,
        newCaretPosition
    }
}