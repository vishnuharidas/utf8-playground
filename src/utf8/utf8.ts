import unicodeTable from './unicode_table.json';

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

function isValidFollowingByte(byte: number): boolean {
    return (byte >> 6 | 0) === 0b10;
}

export function processUtf8Bytes(
    num: number
): {
    utf?: string,
    codepoint?: string,
    character?: string,
    error?: string
} {

    const byte1 = (num >> 24) & 0xFF;
    const byte2 = (num >> 16) & 0xFF;
    const byte3 = (num >> 8) & 0xFF;
    const byte4 = num & 0xFF;

    let stringValue = "";
    let codePoint: string | undefined = undefined;
    let utfEncoding: string | undefined = undefined;
    let error: string | undefined = undefined;

    // There are better ways process UTF-8, but this is for simplicity and clarity.


    // Rule out control bit errors first.

    // If the first byte starts with 0b10xxxxxx, it's an invalid UTF-8 sequence.
    if ((byte1 >> 6) === 0b10) {
        return {
            error: "⚠️ Error: First byte cannot start with <code>10xxxxxx</code>. <br/>Possible options are <code>0xxxxxxx</code>, <code>110xxxxx</code>, <code>1110xxxx</code>, or <code>11110xxx</code>."
        };
    }

    // If the first byte starts with 0b11111xxx, it's an invalid UTF-8 sequence.
    if ((byte1 >> 3) === 0b11111) {
        return {
            error: "⚠️ Error: First byte cannot start with <code>11111xxx</code>.<br/>Possible options are <code>0xxxxxxx</code>, <code>110xxxxx</code>, <code>1110xxxx</code>, or <code>11110xxx</code>."
        };
    }

    // If the first byte starts with 0b110xxxyyy, it's a 2-byte character.
    // First byte: 0b110xxxyy, second byte: 10yyzzzz
    if ((byte1 >> 5) === 0b110 && !isValidFollowingByte(byte2)) {
        return {
            error: "⚠️ Error: Second byte must start with <code>10xxxxxx</code>."
        };
    }

    // If the first byte starts with 0b1110xxxx, it's a 3-byte character.
    // First byte: 0b1110wwww, Second byte: 10xxxxyy, third byte: 10yyzzzz
    if ((byte1 >> 4) === 0b1110 && (!isValidFollowingByte(byte2) || !isValidFollowingByte(byte3))) {
        return {
            error: "⚠️ Error: Second and third bytes must start with <code>10xxxxxx</code>."
        };
    }

    // If the first byte starts with 0b11110uvv, it's a 4-byte character.
    // First byte: 11110uvv, second byte: 10vvwwww, third byte: 10xxxxyy, fourth byte: 10yyzzzz
    if ((byte1 >> 3) === 0b11110 && (!isValidFollowingByte(byte2) || !isValidFollowingByte(byte3) || !isValidFollowingByte(byte4))) {
        return {
            error: "⚠️ Error: Second, third, and fourth bytes must start with <code>10xxxxxx</code>."
        };
    }

    // If control bits are okay, we can process the bytes.

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

export function getEnabledBytes(num: number): boolean[] {

    const byte1 = (num >> 24) & 0xFF;

    return [
        true,
        (byte1 >> 5 | 0) === 0b110 || (byte1 >> 4 | 0) === 0b1110 || (byte1 >> 3 | 0) === 0b11110,
        (byte1 >> 4 | 0) === 0b1110 || (byte1 >> 3 | 0) === 0b11110,
        (byte1 >> 3 | 0) === 0b11110,
    ];
}

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

export function getRandomUtf8Int() {

    return codePointToUtf8Int(
        unicodeTable[Math.floor(Math.random() * unicodeTable.length)].code
    ) ?? Math.floor(Math.random() * 500);

}

export function lookupUnicode(code: string) {

    console.log(code);
    // If the code has more than 4 characters, then remove the leading 0s
    if (code.length > 4) {
        code = code.replace(/^0+/, '');
    }

    console.log(code);

    return unicodeTable.find(item => item.code === code);
}

export function codePointToUtf8Int(hexString: string): number | null {
    const codePoint = parseInt(hexString, 16);

    let bytes: number[] = [];

    if (codePoint <= 0x7F) {
        // 1-byte UTF-8
        bytes = [codePoint];
    } else if (codePoint <= 0x7FF) {
        // 2-byte UTF-8
        bytes = [
            0b11000000 | (codePoint >> 6),
            0b10000000 | (codePoint & 0b00111111)
        ];
    } else if (codePoint <= 0xFFFF) {
        // 3-byte UTF-8
        bytes = [
            0b11100000 | (codePoint >> 12),
            0b10000000 | ((codePoint >> 6) & 0b00111111),
            0b10000000 | (codePoint & 0b00111111)
        ];
    } else if (codePoint <= 0x10FFFF) {
        // 4-byte UTF-8
        bytes = [
            0b11110000 | (codePoint >> 18),
            0b10000000 | ((codePoint >> 12) & 0b00111111),
            0b10000000 | ((codePoint >> 6) & 0b00111111),
            0b10000000 | (codePoint & 0b00111111)
        ];
    } else {
        return null;
    }

    // Pad with trailing zeros to always have 4 bytes
    while (bytes.length < 4) {
        bytes.push(0);
    }

    // Pack the bytes into a single 32-bit unsigned integer
    let result = 0;
    for (let b of bytes) {
        result = (result << 8) | b;
    }

    return result >>> 0; // Ensure unsigned 32-bit
}
