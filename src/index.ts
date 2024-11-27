export const applyMaskedInput = (
    inputElement: HTMLInputElement,
    config: { character?: string } = {}
): { getOriginalValue: () => string } => {
    inputElement.setAttribute("autocomplete","off");
    let originalValue: string = "";
    const character: string = config?.character ?? "*";

    const getCaretPosition = (el: HTMLInputElement): number => {
        return el.selectionStart ?? 0;
    };

    const getSelectionLength = (el: HTMLInputElement): number => {
        return (el.selectionEnd ?? 0) - (el.selectionStart ?? 0);
    };

    const setCaretPosition = (el: HTMLInputElement, position: number): void => {
        el.setSelectionRange(position, position);
    };

    // Handle pasting text
    inputElement.addEventListener("paste", (e) => {
        // Get the pasted text
        const pastedText = (e as ClipboardEvent).clipboardData?.getData("text") ?? "";
        const caretPosition = getCaretPosition(inputElement);

        // Prevent the default paste action
        e.preventDefault();

        // Insert the pasted text at the caret position, and adjust originalValue
        originalValue =
            originalValue.slice(0, caretPosition) +
            pastedText +
            originalValue.slice(caretPosition);

        // Update the masked value
        inputElement.value = character.repeat(originalValue.length);

        // Restore the caret position after paste
        setCaretPosition(inputElement, caretPosition);
    });

    inputElement.addEventListener("beforeinput", (e) => {
        const caretPosition: number = getCaretPosition(inputElement);
        const selectionLength: number = getSelectionLength(inputElement);
        const inputType: string = (e as InputEvent).inputType;
        const addedChar: string = (e as InputEvent).data || "";

        if (inputType === "insertText") {
            if (selectionLength > 0) {
                // Replace selected text
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    addedChar +
                    originalValue.slice(caretPosition + selectionLength);
            } else {
                // Insert new character
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    addedChar +
                    originalValue.slice(caretPosition);
            }
        } else if (inputType === "deleteContentBackward") {
            if (selectionLength > 0) {
                // Delete selected text
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    originalValue.slice(caretPosition + selectionLength);
            } else if (caretPosition > 0) {
                // Delete single character before caret
                originalValue =
                    originalValue.slice(0, caretPosition - 1) +
                    originalValue.slice(caretPosition);
            }
        } else if (inputType === "deleteContentForward") {
            if (selectionLength > 0) {
                // Delete selected text
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    originalValue.slice(caretPosition + selectionLength);
            } else {
                // Delete single character after caret
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    originalValue.slice(caretPosition + 1);
            }
        } else {
            return; // Ignore other input types
        }

        // Prevent default behavior since we handle value manually
        e.preventDefault();

        // Update masked value
        inputElement.value = character.repeat(originalValue.length);

        // Restore caret position
        const newCaretPosition =
            inputType === "insertText"
                ? caretPosition + 1
                : caretPosition - (selectionLength > 0 ? selectionLength : 1);
        setCaretPosition(inputElement, Math.max(0, newCaretPosition));
    });

    return {
        getOriginalValue: (): string => originalValue,
    };
};
