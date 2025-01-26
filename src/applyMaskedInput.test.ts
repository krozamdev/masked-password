/**
 * @jest-environment jsdom
 */

import { applyMaskedInput } from './index';
import { fireEvent } from '@testing-library/dom';

describe("index as applyMaskedInput", () => {

    let inputElement: HTMLInputElement;

    beforeEach(() => {
        document.body.innerHTML = '<input type="text" id="test-input" />';
        inputElement = document.getElementById("test-input") as HTMLInputElement;
    });

    it("should mask input value", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        // simulate user typing hello
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "h" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "e" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "l" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "l" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "o" }));

        expect(inputElement.value).toBe("*****");
        expect(maskedInput.getOriginalValue()).toBe("hello");
        expect(inputElement.selectionStart).toBe(5);
    });
    
    it("should mask input value with the specified character", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        // simulate user typing
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "h" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "e" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "l" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "l" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "o" }));
        
        // simulate user typing caret position 5
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "1" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "2" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "3" }));

        expect(inputElement.value).toBe("********");
        expect(maskedInput.getOriginalValue()).toBe("hello123");
        expect(inputElement.selectionStart).toBe(8);
    });
    
    it("should mask input value with selected character", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        // simulate user typing
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "hello world" }));
        
        // simulate user typing caret position 5 and selected 5 chars
        inputElement.setSelectionRange(5,11);
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "1" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "2" }));
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "3" }));

        expect(inputElement.value).toBe("********");
        expect(maskedInput.getOriginalValue()).toBe("hello123");
        expect(inputElement.selectionStart).toBe(8);
    });
    
    it("should mask input value with delete character : backspace", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        // simulate user typing
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "hello world" }));
        
        // simulate user typing caret position 10
        inputElement.setSelectionRange(10,10);
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "deleteContentBackward" }));

        expect(inputElement.value).toBe("**********");
        expect(maskedInput.getOriginalValue()).toBe("hello word");
        expect(inputElement.selectionStart).toBe(9);
    });
    
    it("should mask input value with delete selected character : backspace", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        // simulate user typing
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "hello world" }));
        
        // simulate user typing caret position 5
        inputElement.setSelectionRange(5,10);
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "deleteContentBackward" }));

        expect(inputElement.value).toBe("******");
        expect(maskedInput.getOriginalValue()).toBe("hellod");
        expect(inputElement.selectionStart).toBe(5);
    });
    
    it("should mask input value with delete character : delete", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        // simulate user typing
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "hello world" }));
        
        // simulate user typing caret position 10
        inputElement.setSelectionRange(10,10);
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "deleteContentForward" }));

        expect(inputElement.value).toBe("**********");
        expect(maskedInput.getOriginalValue()).toBe("hello worl");
        expect(inputElement.selectionStart).toBe(10);
    });
    
    it("should mask input value with delete selected character : delete", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        // simulate user typing
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "hello world" }));
        
        // simulate user typing caret position 5
        inputElement.setSelectionRange(5,10);
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "deleteContentForward" }));

        expect(inputElement.value).toBe("******");
        expect(maskedInput.getOriginalValue()).toBe("hellod");
        expect(inputElement.selectionStart).toBe(5);
    });
    
    it("should mask input value with paste", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        // create paste event with clipboard data
        fireEvent.paste(inputElement, {
            clipboardData: { getData: () => "test123" }
        });

        expect(inputElement.value).toBe("*******");
        expect(maskedInput.getOriginalValue()).toBe("test123");
        expect(inputElement.selectionStart).toBe(7);
    });
    
    it("should mask input value with paste block character", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "hello world" }));
        inputElement.setSelectionRange(5,10);

        // create paste event with clipboard data
        fireEvent.paste(inputElement, {
            clipboardData: { getData: () => "test123" }
        });

        expect(inputElement.value).toBe("*************");
        expect(maskedInput.getOriginalValue()).toBe("hellotest123d");
        expect(inputElement.selectionStart).toBe(12);
    });

});