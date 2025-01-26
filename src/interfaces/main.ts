/**
 * interface describing the methods provided by the applyMaskedInput function's output.
 */
export interface applyMaskedInputInterface {
    
    /**
     * returns the original value of the input before applying the mask.
     * @returns string
     */
    getOriginalValue: () => string;
    
    /**
     * cleans up or disables or change event worker (`if config onChange active`) the masked input feature from the input element.
     * @returns void
     */
    destroy: () => void;

    /**
     * adds additional event listeners (e.g., for handling input changes).
     * @returns void
     */
    addEvent : () => void;

    /**
     * cleans up or disables the masked input feature from the input element.
     * @returns void
     */
    purgeDestroy: () => void;
}

/**
 * interface for the configuration options used by applyMaskedInput.
 */
export interface MaskedInputConfig {
    /**
     * optional character used as the mask in the input (e.g., `*` or `_`). *Default : •*.
     */
    character?: string;
    /**
     * optional callback invoked whenever the input value changes,
     * returning the original value on param.
     * @param value string
     * @returns void
     */
    onChange?: (value : string) => void;
}

export type inputTypeUnion = "insertText" | "deleteContentBackward" | "deleteContentForward";

export interface beforeInputHandlerConfig {
    originalValue : string;
    inputType : inputTypeUnion;
    caretPosition : number;
    selectionLength? : number;
    addedChar? : string;
}

export interface beforeInputHandlerInterface {
    newOriginalValue: string;
    newCaretPosition: number
}