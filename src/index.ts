export const applyMaskedInput = (
    inputElement: HTMLInputElement,
    config: { character?: string } = {}
): { getOriginalValue: () => string } => {
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

    inputElement.addEventListener("beforeinput", (e) => {
        const caretPosition: number = getCaretPosition(inputElement);
        const selectionLength: number = getSelectionLength(inputElement);
        const inputType: string = (e as InputEvent).inputType;
        const addedChar: string = (e as InputEvent).data || "";

        if (selectionLength > 0) {
            // Handle deletion or replacement of selected text
            if (inputType === "insertText") {
                // Replace selected text with new character
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    addedChar +
                    originalValue.slice(caretPosition + selectionLength);
            } else if (inputType === "deleteContentBackward" || inputType === "deleteContentForward") {
                // Remove selected text
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    originalValue.slice(caretPosition + selectionLength);
            }
        } else if (inputType === "insertText") {
            // Insert new character without selection
            originalValue =
                originalValue.slice(0, caretPosition) +
                addedChar +
                originalValue.slice(caretPosition);
        }
    });

    inputElement.addEventListener("input", () => {
        const caretPosition: number = getCaretPosition(inputElement);

        // Update masked value in the input
        inputElement.value = character.repeat(originalValue.length);
        setCaretPosition(inputElement, caretPosition);
    });

    return {
        getOriginalValue: (): string => originalValue,
    };
};
