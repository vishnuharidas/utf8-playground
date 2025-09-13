import unicodeTable from './unicode_table.json';

function getStrFromCodePoint(codePoint: number): { character: string, error: string | undefined } {

    return (codePoint >= 0 && codePoint <= 0x10FFFF)
        ? {
            character: String.fromCodePoint(codePoint), // Convert valid code point to character
            error: undefined
        }
        : {
            character: "\uFFFD", // U+FFFD is the official replacement character
            error: "⚠️ Error converting code point to string."
        }


}

// Checks if a byte is a valid UTF-8 continuation byte (starts with 0b10xxxxxx).
function isValidFollowingByte(byte: number): boolean {
    return (byte >> 6 | 0) === 0b10;
}

export function processUtf8Bytes(
    num: number
): {
    utf?: string,
    codepoint?: string,
    character?: string,
    error?: string,
    overlongBy?: number
} {

    const byte1 = (num >> 24) & 0xFF;
    const byte2 = (num >> 16) & 0xFF;
    const byte3 = (num >> 8) & 0xFF;
    const byte4 = num & 0xFF;

    let stringValue = "";
    let codePoint: string | undefined = undefined;
    let utfEncoding: string | undefined = undefined;
    let error: string | undefined = undefined;
    let overlongBy: number = 0;

    // This function processes UTF-8 bytes from a 32-bit integer.
    // It prioritizes clear, step-by-step logic for educational purposes over optimal performance.
    // For example, it checks for specific byte pattern errors upfront for clearer error messages,
    // even if some checks might seem redundant with the main processing logic later.

    // Rule out control bit errors first for the first byte.
    // These checks ensure the first byte conforms to valid UTF-8 start patterns.

    // If the first byte starts with 0b10xxxxxx (is a continuation byte), it's an invalid UTF-8 sequence.
    if ((byte1 >> 6) === 0b10) {
        return {
            error: "⚠️ Error: First byte cannot start with <code>10xxxxxx</code>. <br/>Possible options are <code>0xxxxxxx</code>, <code>110xxxxx</code>, <code>1110xxxx</code>, or <code>11110xxx</code>."
        };
    }

    // If the first byte starts with 0b11111xxx (indicating a 5-byte or longer sequence, which is invalid), it's an invalid UTF-8 sequence.
    if ((byte1 >> 3) === 0b11111) {
        return {
            error: "⚠️ Error: First byte cannot start with <code>11111xxx</code>.<br/>Possible options are <code>0xxxxxxx</code>, <code>110xxxxx</code>, <code>1110xxxx</code>, or <code>11110xxx</code>."
        };
    }

    // For multi-byte sequences, check if the required continuation bytes are valid.
    // If the first byte starts with 0b110xxxxx, it's a 2-byte character.
    // Binary format: First byte: 0b110yyyyy, Second byte: 0b10xxxxxx
    // 'y' bits from byte1 and 'x' bits from byte2 form the code point.
    if ((byte1 >> 5) === 0b110 && !isValidFollowingByte(byte2)) {
        return {
            error: "⚠️ Error: For a 2-byte sequence, the second byte must start with <code>10xxxxxx</code>."
        };
    }

    // If the first byte starts with 0b1110xxxx, it's a 3-byte character.
    // Binary format: First byte: 0b1110zzzz, Second byte: 0b10yyyyyy, Third byte: 0b10xxxxxx
    // 'z', 'y', and 'x' bits form the code point.
    if ((byte1 >> 4) === 0b1110 && (!isValidFollowingByte(byte2) || !isValidFollowingByte(byte3))) {
        return {
            error: "⚠️ Error: For a 3-byte sequence, the second and third bytes must start with <code>10xxxxxx</code>."
        };
    }

    // If the first byte starts with 0b11110xxx, it's a 4-byte character.
    // Binary format: First byte: 0b11110uuu, Second byte: 0b10uuzzzz, Third byte: 0b10yyyyyy, Fourth byte: 0b10xxxxxx
    // 'u', 'z', 'y', and 'x' bits form the code point.
    if ((byte1 >> 3) === 0b11110 && (!isValidFollowingByte(byte2) || !isValidFollowingByte(byte3) || !isValidFollowingByte(byte4))) {
        return {
            error: "⚠️ Error: For a 4-byte sequence, the second, third, and fourth bytes must start with <code>10xxxxxx</code>."
        };
    }

    // If initial control bit checks passed, proceed to decode the sequence.

    // If the first byte starts with 0b0xxxxxxx, it's a 1-byte character.
    // Code point range: U+0000 to U+007F
    if ((byte1 >> 7 | 0) === 0) { // Equivalent to checking if byte1 < 0x80
        const result = getStrFromCodePoint(byte1 & 0x7F); // Mask to get the 7 payload bits
        stringValue = result.character;
        error = result.error;
        codePoint = `U+${byte1.toString(16).padStart(4, '0').toUpperCase()}`;
        utfEncoding = `0x${byte1.toString(16).padStart(2, '0').toUpperCase()}`;
        overlongBy = 0;
    }
    // Note: The following 'else if' for (byte1 >> 6 | 0) === 0b10 is technically redundant due to earlier checks,
    // but kept for logical flow. It would only be hit if those initial checks were removed.
    // Similarly for (byte1 >> 3 | 0) === 0b11111.
    else if ((byte1 >> 6 | 0) === 0b10 || (byte1 >> 3 | 0) === 0b11111) {
        // This case should ideally not be reached if prior checks are exhaustive.
        error = "⚠️ Error: Not a valid UTF-8 encoding (Invalid start byte).";
    }

    // If the first byte starts with 0b110xxxxx, it's a 2-byte character.
    // Code point range: U+0080 to U+07FF
    // Binary format: 110yyyyy 10xxxxxx. Code point: 00000yyy yyxxxxxx
    else if ((byte1 >> 5 | 0) === 0b110) {
        if ((byte2 >> 6 | 0) === 0b10) {
            const byte = ((byte1 & 0x1F) << 6) | (byte2 & 0x3F)
            const result = getStrFromCodePoint(byte);
            stringValue = result.character;
            error = result.error;
            codePoint = `U+${byte.toString(16).padStart(4, '0').toUpperCase()}`;
            utfEncoding = `0x${byte1.toString(16).padStart(2, '0').toUpperCase()}${byte2.toString(16).padStart(2, '0').toUpperCase()}`;
            overlongBy = byte >= 0x80 ? 0 : 1; // Overlong if code point < U+0080
        } else {
            error = "⚠️ Error: Invalid UTF-8 sequence: Expected continuation byte for 2-byte character.";
        }
    }

    // If the first byte starts with 0b1110xxxx, it's a 3-byte character.
    // First byte: 0b1110wwww, Second byte: 10xxxxyy, third byte: 10yyzzzz
    // Resulting code point: U+wwwxxxxyyyyzzzz
    else if ((byte1 >> 4 | 0) === 0b1110) { // Equivalent to 0xE0 to 0xEF
        if (isValidFollowingByte(byte2) && isValidFollowingByte(byte3)) {
            const byte = ((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F);
            const result = getStrFromCodePoint(byte);
            stringValue = result.character;
            error = result.error;
            codePoint = `U+${byte.toString(16).padStart(4, '0').toUpperCase()}`;
            utfEncoding = `0x${byte1.toString(16).padStart(2, '0').toUpperCase()}${byte2.toString(16).padStart(2, '0').toUpperCase()}${byte3.toString(16).padStart(2, '0').toUpperCase()}`;
            overlongBy = byte >= 0x800 ? 0 : (byte >= 0x80 ? 1 : 2); // Overlong if code point < U+0800
        } else {
            error = "⚠️ Error: Invalid UTF-8 sequence: Expected continuation byte for 3-byte character.";
        }
    }

    // If the first byte starts with 0b11110uvv, it's a 4-byte character.
    // First byte: 11110uvv, second byte: 10vvwwww, third byte: 10xxxxyy, fourth byte: 10yyzzzz
    // Resulting code point: U+0uuuuuxxxxxxxxxxxxxxxx (where u bits are from byte1, x from others)
    // Corrected structure: 11110uuu 10uuxxxx 10xxxxxx 10xxxxxx
    else if ((byte1 >> 3 | 0) === 0b11110) { // Equivalent to 0xF0 to 0xF7
        if (isValidFollowingByte(byte2) && isValidFollowingByte(byte3) && isValidFollowingByte(byte4)) {
            const byte = ((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F);
            const result = getStrFromCodePoint(byte);
            stringValue = result.character;
            error = result.error;
            codePoint = byte > 0xE18080
                ? `U+${byte.toString(16).toUpperCase()}`
                : `U+${byte.toString(16).padStart(4, '0').toUpperCase()}`; // Overlong code points
            utfEncoding = `0x${byte1.toString(16).padStart(2, '0').toUpperCase()}${byte2.toString(16).padStart(2, '0').toUpperCase()}${byte3.toString(16).padStart(2, '0').toUpperCase()}${byte4.toString(16).padStart(2, '0').toUpperCase()}`;
            overlongBy = byte >= 0x10000 ? 0 : (byte >= 0x800 ? 1 : (byte >= 0x80 ? 2 : 3)); // Overlong if code point < U+10000
        } else {
            error = "⚠️ Error: Invalid UTF-8 sequence: Expected continuation byte for 4-byte character.";
        }
    }

    return {
        utf: utfEncoding,
        codepoint: codePoint,
        character: stringValue,
        error: error,
        overlongBy: overlongBy
    };
}

// Determines which byte input fields should be enabled in the UI based on the first byte of a UTF-8 sequence.
export function getEnabledBytes(num: number): boolean[] {

    const byte1 = (num >> 24) & 0xFF;

    return [
        true,
        (byte1 >> 5 | 0) === 0b110 || (byte1 >> 4 | 0) === 0b1110 || (byte1 >> 3 | 0) === 0b11110,
        (byte1 >> 4 | 0) === 0b1110 || (byte1 >> 3 | 0) === 0b11110,
        (byte1 >> 3 | 0) === 0b11110,
    ];
}

// Returns a 32-bit integer representing the control bit masks for a UTF-8 sequence,
// based on the pattern of the first byte. Useful for UI highlighting.
export function getControlBits(num: number): number {

    const byte1 = (num >> 24) & 0xFF;

    let mainByte: number;
    if ((byte1 >> 5 | 0) === 0b110) {
        mainByte = 0b11100000;
    } else if ((byte1 >> 4 | 0) === 0b1110) {
        mainByte = 0b11110000;
    } else if ((byte1 >> 3 | 0) === 0b11110) {
        mainByte = 0b11111000;
    } else {
        mainByte = 0b00000000;
    }

    const otherBytes = 0b11000000

    return mainByte << 24 | otherBytes << 16 | otherBytes << 8 | otherBytes;

}

// Generates a random valid UTF-8 integer representation for a character from the unicodeTable.
// Falls back to a small random number if conversion fails (should be rare with valid table).
export function getRandomUtf8Int() {

    return codePointToUtf8Int(
        unicodeTable[Math.floor(Math.random() * unicodeTable.length)].code
    ) ?? Math.floor(Math.random() * 500); // Fallback for very rare cases

}

export function lookupUnicode(code: string) {

    // If the code has more than 4 characters (common for U+xxxxx inputs),
    // remove leading 0s to match the 'XXXX' format in unicode_table.json.
    // If after stripping, the code is empty (e.g., "00000" -> ""), default to "0" for U+0000.
    if (code.length > 4) {
        code = code.replace(/^0+/, '') || '0';
    }
    
    if (code.length < 4) { // if code length <4 then add leading 0s
        code = code.padStart(4, '0');
    }

    return unicodeTable.find(item => item.code === code);
}

// Converts a hexadecimal code point string to its 32-bit integer representation
// where UTF-8 bytes are packed into the most significant bytes.
export function codePointToUtf8Int(hexString: string): number | null {
    const codePoint = parseInt(hexString, 16);

    // Check if parsing resulted in NaN (e.g. "ZZZ") or if codePoint is out of Unicode range
    if (isNaN(codePoint) || codePoint < 0 || codePoint > 0x10FFFF) {
        return null;
    }

    let bytes: number[] = [];

    if (codePoint <= 0x7F) {
        // 1-byte UTF-8: 0xxxxxxx
        bytes = [codePoint];
    } else if (codePoint <= 0x7FF) {
        // 2-byte UTF-8: 110yyyyy 10xxxxxx
        bytes = [
            0b11000000 | (codePoint >> 6),          // 5 bits for y
            0b10000000 | (codePoint & 0b00111111)   // 6 bits for x
        ];
    } else if (codePoint <= 0xFFFF) {
        // 3-byte UTF-8: 1110zzzz 10yyyyyy 10xxxxxx
        bytes = [
            0b11100000 | (codePoint >> 12),         // 4 bits for z
            0b10000000 | ((codePoint >> 6) & 0b00111111), // 6 bits for y
            0b10000000 | (codePoint & 0b00111111)    // 6 bits for x
        ];
    } else if (codePoint <= 0x10FFFF) { // Max Unicode code point
        // 4-byte UTF-8: 11110uuu 10uuxxxx 10xxxxxx 10xxxxxx
        bytes = [
            0b11110000 | (codePoint >> 18),         // 3 bits for u (from 1st byte)
            0b10000000 | ((codePoint >> 12) & 0b00111111), // 2 bits for u (from 2nd byte) + 4 for x
            0b10000000 | ((codePoint >> 6) & 0b00111111), // 6 bits for x
            0b10000000 | (codePoint & 0b00111111)    // 6 bits for x
        ];
    }
    // No 'else' needed here because invalid codePoint (including > 0x10FFFF) is handled at the start.

    // The `processUtf8Bytes` function expects the UTF-8 bytes in the most significant bytes
    // of a 32-bit number. This loop achieves that by left-shifting existing bytes
    // and ORing the new byte, then finally shifting the complete sequence to the left-most position.

    // Pad with trailing zeros in the byte array to ensure it has 4 elements if less are present.
    // This simplifies the packing logic if fewer than 4 bytes are generated.
    while (bytes.length < 4) {
        bytes.push(0);
    }

    // Pack the bytes into a single 32-bit unsigned integer.
    // Example: For 'A' (0x41), bytes = [0x41, 0, 0, 0].
    // result = (0 << 8) | 0x41  -> 0x41
    // result = (0x41 << 8) | 0   -> 0x4100
    // result = (0x4100 << 8) | 0  -> 0x410000
    // result = (0x410000 << 8) | 0 -> 0x41000000
    let result = 0;
    for (let b of bytes) {
        result = (result << 8) | b;
    }

    return result >>> 0; // Ensure unsigned 32-bit integer
}
