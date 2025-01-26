import { beforeInputHandler } from "./beforeInputHandler";


describe("beforeInputHandler", () => {

    it("should insert a character at the correct position", () => {
        const result = beforeInputHandler({
            inputType : "insertText",
            originalValue : "abc",
            caretPosition : 1,
            addedChar : "x"
        });
        expect(result.newOriginalValue).toBe("axbc");
        expect(result.newCaretPosition).toBe(2);
    });

    it("should handle backspace correctly", () => {
        const result = beforeInputHandler({
            inputType : "deleteContentBackward",
            originalValue : "abc",
            caretPosition : 2
        });
        expect(result.newOriginalValue).toBe("ac");
        expect(result.newCaretPosition).toBe(1);
    });
    
    it("should handle backspace with selection correctly", () => {
        const result = beforeInputHandler({
            inputType : "deleteContentBackward",
            originalValue : "abcdefghij",
            caretPosition : 2,
            selectionLength : 4
        });
        expect(result.newOriginalValue).toBe("abghij");
        expect(result.newCaretPosition).toBe(2);
    });

    it("should handle forward delete correctly", () => {
        const result = beforeInputHandler({
            inputType : "deleteContentForward",
            originalValue : "abc",
            caretPosition : 1
        });
        expect(result.newOriginalValue).toBe("ac");
        expect(result.newCaretPosition).toBe(1);
    });
    
    it("should handle forward delete with selection first caret position correctly", () => {
        const result = beforeInputHandler({
            inputType : "deleteContentForward",
            originalValue : "abcdefghijkl",
            caretPosition : 0,
            selectionLength : 5
        });
        expect(result.newOriginalValue).toBe("fghijkl");
        expect(result.newCaretPosition).toBe(0);
    });
    
    it("should handle forward delete with selection middle caret position correctly", () => {
        const result = beforeInputHandler({
            inputType : "deleteContentForward",
            originalValue : "abcdefghijkl",
            caretPosition : 4,
            selectionLength : 5
        });
        expect(result.newOriginalValue).toBe("abcdjkl");
        expect(result.newCaretPosition).toBe(4);
    });

    it("should handle selection replacement", () => {
        const result = beforeInputHandler({
            inputType : "insertText",
            originalValue : "abcdef",
            caretPosition : 2,
            selectionLength : 3,
            addedChar : "x"
        });
        expect(result.newOriginalValue).toBe("abxf");
        expect(result.newCaretPosition).toBe(3);
    });
});
