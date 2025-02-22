import { beforeInputHandler } from "./handlers/beforeInputHandler";
import { pasteHandler } from "./handlers/pasteHandler";
import { applyMaskedInputInterface, inputTypeUnion, MaskedInputConfig } from "./interfaces/main";

export const applyMaskedInput = (
    inputElement: HTMLInputElement,
    config: MaskedInputConfig = {}
):  applyMaskedInputInterface => {
    inputElement.setAttribute("autocomplete", "off");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("autocorrect", "off");
    inputElement.setAttribute("spellcheck", "false");
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

        const { newCaretPosition, newOriginalValue } = pasteHandler({
            originalValue,
            caretPosition,
            pastedText,
            selectionLength
        });

        originalValue = newOriginalValue;

        // mask the value
        inputElement.value = character.repeat(originalValue.length);

        // move caret to end of pasted text
        setCaretPosition(inputElement, newCaretPosition);
        onChangeValue();
    };

    const handleBeforeInput = (e: InputEvent) => {
        const caretPosition: number = getCaretPosition(inputElement);
        const selectionLength: number = getSelectionLength(inputElement);
        const inputType: inputTypeUnion = (e as InputEvent).inputType as inputTypeUnion;
        const addedChar: string = (e as InputEvent).data || "";

        const { newCaretPosition, newOriginalValue } = beforeInputHandler({
            originalValue,
            inputType,
            caretPosition,
            selectionLength,
            addedChar
        });

        originalValue = newOriginalValue;

        e.preventDefault();  // prevent default behavior as we are handling the value
        
        // mask the value
        inputElement.value = character.repeat(originalValue.length);

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
