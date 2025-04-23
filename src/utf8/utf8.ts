function getStrFromCodePoint(codePoint: number): { character: string, error: string | undefined } {

    return (codePoint >= 0 && codePoint <= 0x10FFFF)
        ? {
            character: String.fromCodePoint(codePoint),
            error: undefined
        }
        : {
            character: "\uFFFD",
            error: "⚠️ Error converting code point to string."
        }


}

export function processUtf8Bytes(
    num: number
): {
    utf: string,
    codepoint: string,
    character: string,
    error: string | undefined
} {

    const byte1 = (num >> 24) & 0xFF;
    const byte2 = (num >> 16) & 0xFF;
    const byte3 = (num >> 8) & 0xFF;
    const byte4 = num & 0xFF;

    let stringValue = "⚠️ Error";
    let codePoint = "—";
    let utfEncoding = "—"
    let error: string | undefined = undefined;

    // There are better ways process UTF-8, but this is for simplicity and clarity.

    // If the first byte starts with 0b0xxxxxxx, it's a 1-byte character.
    // Resulting codepoint: U+xxxxxxx
    if ((byte1 >> 7 | 0) === 0) {
        const result = getStrFromCodePoint(byte1 & 0x7F);
        stringValue = result.character;
        error = result.error;
        codePoint = `U+${byte1.toString(16).padStart(4, '0').toUpperCase()}`;
        utfEncoding = `0x${byte1.toString(16).padStart(2, '0').toUpperCase()}`;
    }

    // If the first byte starts with 0b10xxxxxx or 0b11111xxx, that's an invalid UTF-8 sequence.
    else if ((byte1 >> 6 | 0) === 0b10 || (byte1 >> 3 | 0) === 0b11111) {
        error = "⚠️ Error: Not a valid UTF-8 encoding.";
    }

    // If the first byte starts with 0b110xxxyyy, it's a 2-byte character.
    // First byte: 0b110xxxyy, second byte: 10yyzzzz
    // Resulting codepoint: U+xxxyyyzzzz
    else if ((byte1 >> 5 | 0) === 0b110) {
        if ((byte2 >> 6 | 0) === 0b10) {
            const byte = ((byte1 & 0x1F) << 6) | (byte2 & 0x3F)
            const result = getStrFromCodePoint(byte);
            stringValue = result.character;
            error = result.error;
            codePoint = `U+${byte.toString(16).padStart(4, '0').toUpperCase()}`;
            utfEncoding = `0x${byte1.toString(16).padStart(2, '0').toUpperCase()}${byte2.toString(16).padStart(2, '0').toUpperCase()}`;
        } else {
            error = "⚠️ Error: Invalid UTF-8 sequence: Expected continuation byte for 2-byte character.";
        }
    }

    // If the first byte starts with 0b1110xxxx, it's a 3-byte character.
    // First byte: 0b1110wwww, Second byte: 10xxxxyy, third byte: 10yyzzzz
    // Resulting codepint: U+wwwxxxxyyyyzzzz
    else if ((byte1 >> 4 | 0) === 0b1110) {
        if ((byte2 >> 6 | 0) === 0b10 && (byte3 >> 6 | 0) === 0b10) {
            const byte = ((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F);
            const result = getStrFromCodePoint(byte);
            stringValue = result.character;
            error = result.error;
            codePoint = `U+${byte.toString(16).padStart(4, '0').toUpperCase()}`;
            utfEncoding = `0x${byte1.toString(16).padStart(2, '0').toUpperCase()}${byte2.toString(16).padStart(2, '0').toUpperCase()}${byte3.toString(16).padStart(2, '0').toUpperCase()}`;
        } else {
            error = "⚠️ Error: Invalid UTF-8 sequence: Expected continuation byte for 3-byte character.";
        }
    }

    // If the first byte starts with 0b11110uvv, it's a 4-byte character.
    // First byte: 11110uvv, second byte: 10vvwwww, third byte: 10xxxxyy, fourth byte: 10yyzzzz
    // Resulting codepoint: U+uvvvvwwwwzzzzyyyyzzzz
    else if ((byte1 >> 3 | 0) === 0b11110) {
        if ((byte2 >> 6 | 0) === 0b10 && (byte3 >> 6 | 0) === 0b10 && (byte4 >> 6 | 0) === 0b10) {
            const byte = ((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F);
            const result = getStrFromCodePoint(byte);
            stringValue = result.character;
            error = result.error;
            codePoint = `U+${byte.toString(16).padStart(6, '0').toUpperCase()}`;
            utfEncoding = `0x${byte1.toString(16).padStart(2, '0').toUpperCase()}${byte2.toString(16).padStart(2, '0').toUpperCase()}${byte3.toString(16).padStart(2, '0').toUpperCase()}${byte4.toString(16).padStart(2, '0').toUpperCase()}`;
        } else {
            error = "⚠️ Error: Invalid UTF-8 sequence: Expected continuation byte for 4-byte character.";
        }
    }

    return {
        utf: utfEncoding,
        codepoint: codePoint,
        character: stringValue,
        error: error
    };
}