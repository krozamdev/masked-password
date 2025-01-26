import { pasteHandler } from './pasteHandler';

describe("pasteHandler", () => {

    it("should paste a character at the correct position", () => {
        const result = pasteHandler({
            originalValue : "abcdfghij",
            caretPosition : 2,
            pastedText : "123"
        });
        expect(result.newOriginalValue).toBe("ab123cdfghij");
        expect(result.newCaretPosition).toBe(5);
    });
    
    it("should paste a character at the correct position with selection", () => {
        const result = pasteHandler({
            originalValue : "abcdfghij",
            caretPosition : 2,
            pastedText : "123",
            selectionLength : 4
        });
        expect(result.newOriginalValue).toBe("ab123hij");
        expect(result.newCaretPosition).toBe(5);
    });

});