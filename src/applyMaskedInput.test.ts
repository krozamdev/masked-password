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

    it("should mask input value default char", () => {
        const maskedInput = applyMaskedInput(inputElement);

        // simulate user typing hello
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "h" }));

        expect(inputElement.value).toBe("•");
        expect(maskedInput.getOriginalValue()).toBe("h");
        expect(inputElement.selectionStart).toBe(1);
    });

    it("should mask input value default char", () => {
        const maskedInput = applyMaskedInput(inputElement);
    
        // spy on internal functions
        const getCaretSpy = jest.spyOn(inputElement, "selectionStart", "get");
        const getSelectionSpy = jest.spyOn(inputElement, "selectionEnd", "get");
        const setCaretSpy = jest.spyOn(inputElement, "setSelectionRange");
    
        // simulate user typing "h"
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "h" }));
    
        expect(inputElement.value).toBe("•");
        expect(maskedInput.getOriginalValue()).toBe("h");
        expect(inputElement.selectionStart).toBe(1);
    
        // check if our functions were called (test coverage)
        expect(getCaretSpy).toHaveBeenCalled();
        expect(getSelectionSpy).toHaveBeenCalled();
        expect(setCaretSpy).toHaveBeenCalledWith(1, 1);
    });

    it("should use fallback value when selectionStart is null", () => {
        const maskedInput = applyMaskedInput(inputElement);
    
        // mock selectionStart dan selectionEnd menjadi null
        jest.spyOn(inputElement, "selectionStart", "get").mockReturnValue(null);
        jest.spyOn(inputElement, "selectionEnd", "get").mockReturnValue(null);
        
        // simulate user typing "h"
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "h" }));
    
        expect(inputElement.value).toBe("•");
        expect(maskedInput.getOriginalValue()).toBe("h");
        
        // fallback check
        expect(inputElement.selectionStart).toBeNull();
        expect(inputElement.selectionEnd).toBeNull();
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
    
    it("should mask input value paste with destroy", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});

        // test double purge destroy
        maskedInput.purgeDestroy();
        maskedInput.purgeDestroy();

        // create paste event with clipboard data
        fireEvent.paste(inputElement, {
            clipboardData: { getData: () => "test123" }
        });

        expect(inputElement.value).toBe("");
        expect(maskedInput.getOriginalValue()).toBe("");
        expect(inputElement.selectionStart).toBe(0);
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

    it("should mask input type force to text", () => {
        inputElement.setAttribute('type', 'password');
        applyMaskedInput(inputElement, {character : "*"});

        expect(inputElement.getAttribute('type')).toBe("text");
    });
    
    it("should mask input valid attributes", () => {
        inputElement.setAttribute('type', 'password');
        applyMaskedInput(inputElement, {character : "*"});

        expect(inputElement.getAttribute('type')).toBe("text");
        expect(inputElement.getAttribute('autocomplete')).toBe("off");
        expect(inputElement.getAttribute('autocorrect')).toBe("off");
        expect(inputElement.getAttribute('spellcheck')).toBe("false");
    });
    
    it("should mask input return realtime original value on change option", () => {
        const onChangeEvent = jest.fn();
        applyMaskedInput(inputElement, {
            onChange : onChangeEvent
        });
        
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "secret" }));

        expect(onChangeEvent).toHaveBeenCalledWith("secret");
        expect(inputElement.value).toBe("••••••");
    });
    
    it("should mask input return realtime original value on change option : paste event", () => {
        const onChangeEvent = jest.fn();
        applyMaskedInput(inputElement, {
            onChange : onChangeEvent
        });

        fireEvent.paste(inputElement, {
            clipboardData: { getData: () => "test123" }
        });

        expect(onChangeEvent).toHaveBeenCalledWith("test123");
        expect(inputElement.value).toBe("•••••••");

    });
    
    it("should mask input return realtime original value on change option : paste event - destroy", () => {
        const onChangeEvent = jest.fn();
        const maskedInput = applyMaskedInput(inputElement, {
            onChange : onChangeEvent
        });

        maskedInput.destroy();

        fireEvent.paste(inputElement, {
            clipboardData: { getData: () => "test123" }
        });

        expect(onChangeEvent).toHaveBeenCalledWith("");
        expect(inputElement.value).toBe("");

    });
    
    it("should mask input return realtime original value on change option : paste null event", () => {
        const onChangeEvent = jest.fn();
        applyMaskedInput(inputElement, { onChange: onChangeEvent });

        // mock clipboardData no data
        const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });

        Object.defineProperty(pasteEvent, "clipboardData", {
            get: () => undefined,
            configurable: true,
        });

        // simulate paste event
        inputElement.dispatchEvent(pasteEvent);

        expect(onChangeEvent).toHaveBeenCalledWith("");
        expect(inputElement.value).toBe("");
    });
    
    it("should mask input destroy and add event", () => {
        const maskedInput = applyMaskedInput(inputElement, {character : "*"});
        
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "secret" }));

        expect(maskedInput.getOriginalValue()).toBe("secret");
        expect(inputElement.value).toBe("******");
        
        // destroy masked password
        maskedInput.destroy();
        
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "secret" }));

        expect(maskedInput.getOriginalValue()).toBe("secret");
        expect(inputElement.value).toBe("secret");
        
        // add event masked password
        maskedInput.addEvent();
        
        expect(maskedInput.getOriginalValue()).toBe("secret");
        expect(inputElement.value).toBe("******");
        
        // purge destroy event masked password
        maskedInput.purgeDestroy();

        expect(maskedInput.getOriginalValue()).toBe("secret");
        expect(inputElement.value).toBe("secret");
        
    });
    
    it("should mask input destroy and add event on realtime input change", () => {
        const onChangeEvent = jest.fn();
        const maskedInput = applyMaskedInput(inputElement, {
            character : "*",
            onChange : onChangeEvent
        });
        
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "secret" }));

        expect(maskedInput.getOriginalValue()).toBe("secret");
        expect(onChangeEvent).toHaveBeenCalledWith("secret");
        expect(inputElement.value).toBe("******");
        
        // destroy masked password
        maskedInput.destroy();
        
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "secret" }));

        expect(maskedInput.getOriginalValue()).toBe("secret");
        expect(onChangeEvent).toHaveBeenCalledWith("secret");
        expect(inputElement.value).toBe("secret");
        
        // test double add event masked password
        maskedInput.addEvent();
        maskedInput.addEvent();
        
        expect(maskedInput.getOriginalValue()).toBe("secret");
        expect(onChangeEvent).toHaveBeenCalledWith("secret");
        expect(inputElement.value).toBe("******");
        
        // purge destroy event masked password
        maskedInput.purgeDestroy();

        expect(maskedInput.getOriginalValue()).toBe("secret");
        expect(onChangeEvent).toHaveBeenCalledWith("secret");
        expect(inputElement.value).toBe("secret");
        
    });

    it("should call onChange when destroy is called", () => {
        const onChangeMock = jest.fn();
        const maskedInput = applyMaskedInput(inputElement, { character: "*", onChange: onChangeMock });
        inputElement.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: "1" }));
    
        maskedInput.destroy();
        maskedInput.destroy();
        inputElement.dispatchEvent(new InputEvent("input", { inputType: "insertText", data: "1" }));
    
        expect(onChangeMock).toHaveBeenCalledWith("1");
    });

    it("should not call onChange if it is not a function", () => {
        const maskedInput = applyMaskedInput(inputElement, { onChange: "not a function" as any });
    
        fireEvent.paste(inputElement, {
            clipboardData: { getData: () => "1234" }
        });
    
        // if onChange not a function
        expect(maskedInput.getOriginalValue()).toBe("1234");
    });

});