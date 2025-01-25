import { applyMaskedInputInterface, MaskedInputConfig } from "./interfaces/main";

export const applyMaskedInput = (
    inputElement: HTMLInputElement,
    config: MaskedInputConfig = {}
):  applyMaskedInputInterface => {
    inputElement.setAttribute("autocomplete", "off");
    let originalValue: string = "";
    const character: string = config?.character ?? "•";
    let activeEvent = true;

    const getOriginalValue = () : string => {
        return activeEvent ? originalValue : String(inputElement.value);
    }

    const getCaretPosition = (el: HTMLInputElement): number => {
        return el.selectionStart ?? 0;
    };

    const getSelectionLength = (el: HTMLInputElement): number => {
        return (el.selectionEnd ?? 0) - (el.selectionStart ?? 0);
    };

    const setCaretPosition = (el: HTMLInputElement, position: number): void => {
        el.setSelectionRange(position, position);
    };

    const onChangeValue = () => {
        if (config?.onChange) {
            config.onChange(getOriginalValue())
        }
    }

    // handle pasting text
    const handlePaste = (e: ClipboardEvent) => {
        // get the pasted text
        const pastedText = (e as ClipboardEvent).clipboardData?.getData("text") ?? "";
        const caretPosition = getCaretPosition(inputElement);
        const selectionLength: number = getSelectionLength(inputElement);

        e.preventDefault();  // prevent default paste behavior

        if (selectionLength > 0) {
            // remove the selected text from originalValue
            originalValue = originalValue.slice(0, caretPosition) + originalValue.slice(caretPosition + selectionLength);
        }

        // insert the pasted text at the caret position, and adjust originalValue
        originalValue =
            originalValue.slice(0, caretPosition) +
            pastedText +
            originalValue.slice(caretPosition);

        // mask the value
        inputElement.value = character.repeat(originalValue.length);

        // move caret to end of pasted text
        setCaretPosition(inputElement, caretPosition + pastedText.length);
        onChangeValue();
    };

    const handleBeforeInput = (e: InputEvent) => {
        const caretPosition: number = getCaretPosition(inputElement);
        const selectionLength: number = getSelectionLength(inputElement);
        const inputType: string = (e as InputEvent).inputType;
        const addedChar: string = (e as InputEvent).data || "";

        if (inputType === "insertText") {
            // handle insertion of new character
            if (selectionLength > 0) {
                // replace selected text
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    addedChar +
                    originalValue.slice(caretPosition + selectionLength);
            } else {
                // insert new character at caret position
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    addedChar +
                    originalValue.slice(caretPosition);
            }
        } else if (inputType === "deleteContentBackward") {
            // handle deletion backward (Backspace)
            if (selectionLength > 0) {
                // remove selected text
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    originalValue.slice(caretPosition + selectionLength);
            } else if (caretPosition > 0) {
                // delete character before caret
                originalValue =
                    originalValue.slice(0, caretPosition - 1) +
                    originalValue.slice(caretPosition);
            }
        } else if (inputType === "deleteContentForward") {
            // handle deletion forward (Delete)
            if (selectionLength > 0) {
                // remove selected text
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    originalValue.slice(caretPosition + selectionLength);
            } else if (caretPosition < originalValue.length) {
                // delete character after caret
                originalValue =
                    originalValue.slice(0, caretPosition) +
                    originalValue.slice(caretPosition + 1);
            }
        } else {
            return;  // ignore other input types
        }

        e.preventDefault();  // prevent default behavior as we are handling the value

        // mask the value
        inputElement.value = character.repeat(originalValue.length);

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
        newCaretPosition = Math.max(0, Math.min(newCaretPosition, originalValue.length));

        // restore caret position
        setCaretPosition(inputElement, newCaretPosition);
        onChangeValue();
    };

    const handleEventOnDestroy = () => {
        onChangeValue();
    }

    // add events
    inputElement.addEventListener("paste", handlePaste);
    inputElement.addEventListener("beforeinput", handleBeforeInput);

    return {
        getOriginalValue: (): string => getOriginalValue(),
        destroy: () => { // destroy events
            if (!activeEvent) {
                return;
            }
            inputElement.removeEventListener("paste", handlePaste);
            inputElement.removeEventListener("beforeinput", handleBeforeInput);
            if (config?.onChange) {
                inputElement.addEventListener("paste", handleEventOnDestroy);
                inputElement.addEventListener("input", handleEventOnDestroy);
            }
            inputElement.value = originalValue;
            activeEvent = false;
        },
        addEvent : () => {
            if (activeEvent) { // handle duplicate events                
                return;
            }
            
            if (config?.onChange) {
                inputElement.removeEventListener("paste", handleEventOnDestroy);
                inputElement.removeEventListener("input", handleEventOnDestroy);
            }

            activeEvent = true;
            inputElement.addEventListener("paste", handlePaste);
            inputElement.addEventListener("beforeinput", handleBeforeInput);
            originalValue = inputElement.value;
            inputElement.value = character.repeat(originalValue.length);
            setCaretPosition(inputElement, originalValue.length);
        },
        purgeDestroy : () => {
            if (activeEvent) {
                inputElement.removeEventListener("paste", handlePaste);
                inputElement.removeEventListener("beforeinput", handleBeforeInput);
            }else{
                inputElement.removeEventListener("paste", handleEventOnDestroy);
                inputElement.removeEventListener("input", handleEventOnDestroy);
            }
            inputElement.value = originalValue;
            activeEvent = false;
        }
    };
};
