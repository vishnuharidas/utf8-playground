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

export function getRandomUtf8() {

    const randomUtf8Symbols = [
        { "code": 0x30000000, "letter": "0" },
        { "code": 0x37000000, "letter": "7" },
        { "code": 0x38000000, "letter": "8" },
        { "code": 0x39000000, "letter": "9" },
        { "code": 0x41000000, "letter": "A" },
        { "code": 0x42000000, "letter": "B" },
        { "code": 0x43000000, "letter": "C" },
        { "code": 0x44000000, "letter": "D" },
        { "code": 0x3F000000, "letter": "?" },
        { "code": 0x2E000000, "letter": "." },
        { "code": 0x2C000000, "letter": "," },
        { "code": 0x3B000000, "letter": ";" },
        { "code": 0x3A000000, "letter": ":" },
        { "code": 0x2D000000, "letter": "-" },
        { "code": 0x5F000000, "letter": "_" },
        { "code": 0xC3A10000, "letter": "á" },
        { "code": 0xC3A90000, "letter": "é" },
        { "code": 0xC3AD0000, "letter": "í" },
        { "code": 0xC3B30000, "letter": "ó" },
        { "code": 0xC3BA0000, "letter": "ú" },
        { "code": 0xC3BC0000, "letter": "ü" },
        { "code": 0xC3B10000, "letter": "ñ" },
        { "code": 0xC3A70000, "letter": "ç" },
        { "code": 0xCEB20000, "letter": "β" },
        { "code": 0xCEB40000, "letter": "δ" },
        { "code": 0xCEB50000, "letter": "ε" },
        { "code": 0xCEB60000, "letter": "ζ" },
        { "code": 0xD18F0000, "letter": "я" },
        { "code": 0xD1880000, "letter": "ш" },
        { "code": 0xD0940000, "letter": "Д" },
        { "code": 0xD1890000, "letter": "щ" },
        { "code": 0xD18D0000, "letter": "э" },
        { "code": 0xD0B90000, "letter": "й" },
        { "code": 0xD7900000, "letter": "א" },
        { "code": 0xD7910000, "letter": "ב" },
        { "code": 0xD7920000, "letter": "ג" },
        { "code": 0xD7930000, "letter": "ד" },
        { "code": 0xD7940000, "letter": "ה" },
        { "code": 0xD7960000, "letter": "ז" },
        { "code": 0xD7970000, "letter": "ח" },
        { "code": 0xC4810000, "letter": "ā" },
        { "code": 0xC58B0000, "letter": "ŋ" },
        { "code": 0xF09F9880, "letter": "😀" },
        { "code": 0xF09F9882, "letter": "😂" },
        { "code": 0xF09F988E, "letter": "😎" },
        { "code": 0xF09F918D, "letter": "👍" },
        { "code": 0xF09F8C8E, "letter": "🌎" },
        { "code": 0xF09F8E89, "letter": "🎉" },
        { "code": 0xF09FA494, "letter": "🤔" },
        { "code": 0xF09F998F, "letter": "🙏" },
        { "code": 0xD0960000, "letter": "Ж" },
        { "code": 0xD0810000, "letter": "Ё" },
        { "code": 0xD9B90000, "letter": "ٹ" },
        { "code": 0xD9BB0000, "letter": "ٻ" },
        { "code": 0xDAAF0000, "letter": "گ" },
        { "code": 0xE1B1B100, "letter": "ᱚ" },
        { "code": 0xEAA38000, "letter": "ꯀ" },
        { "code": 0xF0918480, "letter": "𑄀" },
        { "code": 0xF09F988D, "letter": "😍" },
        { "code": 0xE0A48500, "letter": "अ" },
        { "code": 0xE0A48600, "letter": "आ" },
        { "code": 0xE0A48700, "letter": "इ" },
        { "code": 0xE0A49500, "letter": "क" },
        { "code": 0xE0A49700, "letter": "ग" },
        { "code": 0xE0A49A00, "letter": "च" },
        { "code": 0xE0A4A400, "letter": "त" },
        { "code": 0xE0A4A800, "letter": "न" },
        { "code": 0xE0A4AA00, "letter": "प" },
        { "code": 0xE0A4AE00, "letter": "म" },
        { "code": 0xE0A4B000, "letter": "र" },
        { "code": 0xE0A4B600, "letter": "श" },
        { "code": 0xE0A59000, "letter": "ॐ" },
        { "code": 0xE0A68500, "letter": "অ" },
        { "code": 0xE0A68700, "letter": "ই" },
        { "code": 0xE0A69500, "letter": "ক" },
        { "code": 0xE0A69A00, "letter": "চ" },
        { "code": 0xE0A6AC00, "letter": "ব" },
        { "code": 0xE0A6B700, "letter": "ষ" },
        { "code": 0xE0A79C00, "letter": "ড়" },
        { "code": 0xE0A88500, "letter": "ਅ" },
        { "code": 0xE0A88700, "letter": "ਇ" },
        { "code": 0xE0A89500, "letter": "ਕ" },
        { "code": 0xE0A89A00, "letter": "ਚ" },
        { "code": 0xE0A8A800, "letter": "ਨ" },
        { "code": 0xE0A8AA00, "letter": "ਪ" },
        { "code": 0xE0A9B400, "letter": "ੴ" },
        { "code": 0xE0AA8500, "letter": "અ" },
        { "code": 0xE0AA8700, "letter": "ઇ" },
        { "code": 0xE0AA9500, "letter": "ક" },
        { "code": 0xE0AA9A00, "letter": "ચ" },
        { "code": 0xE0AAA800, "letter": "ન" },
        { "code": 0xE0AAB000, "letter": "ર" },
        { "code": 0xE0AAB600, "letter": "શ" },
        { "code": 0xE0AC8500, "letter": "ଅ" },
        { "code": 0xE0AC8700, "letter": "ଇ" },
        { "code": 0xE0AC9500, "letter": "କ" },
        { "code": 0xE0AC9C00, "letter": "ଜ" },
        { "code": 0xE0ACA300, "letter": "ଣ" },
        { "code": 0xE0ACB200, "letter": "ଲ" },
        { "code": 0xE0AD9C00, "letter": "ଡ଼" },
        { "code": 0xE0B08500, "letter": "அ" },
        { "code": 0xE0B08700, "letter": "இ" },
        { "code": 0xE0B09500, "letter": "க" },
        { "code": 0xE0B09A00, "letter": "ச" },
        { "code": 0xE0B0A800, "letter": "ந" },
        { "code": 0xE0B0B400, "letter": "ழ" },
        { "code": 0xE0B0B800, "letter": "ஸ" },
        { "code": 0xE0B18500, "letter": "అ" },
        { "code": 0xE0B18700, "letter": "ఇ" },
        { "code": 0xE0B19500, "letter": "క" },
        { "code": 0xE0B19A00, "letter": "చ" },
        { "code": 0xE0B1A800, "letter": "న" },
        { "code": 0xE0B1B000, "letter": "ర" },
        { "code": 0xE0B1B600, "letter": "శ" },
        { "code": 0xE0B28500, "letter": "ಅ" },
        { "code": 0xE0B28700, "letter": "ಇ" },
        { "code": 0xE0B29500, "letter": "ಕ" },
        { "code": 0xE0B29A00, "letter": "ಚ" },
        { "code": 0xE0B2A800, "letter": "ನ" },
        { "code": 0xE0B2B300, "letter": "ಳ" },
        { "code": 0xE0B2B600, "letter": "ಶ" },
        { "code": 0xE0B48500, "letter": "അ" },
        { "code": 0xE0B48700, "letter": "ഇ" },
        { "code": 0xE0B49500, "letter": "ക" },
        { "code": 0xE0B49A00, "letter": "ച" },
        { "code": 0xE0B4A300, "letter": "ണ" },
        { "code": 0xE0B4B400, "letter": "ഴ" },
        { "code": 0xE0B4B600, "letter": "ശ" },
        { "code": 0xC3810000, "letter": "Á" },
        { "code": 0xC3890000, "letter": "É" },
        { "code": 0xC38D0000, "letter": "Í" },
        { "code": 0xC3930000, "letter": "Ó" },
        { "code": 0xC39A0000, "letter": "Ú" },
        { "code": 0xC3910000, "letter": "Ñ" },
        { "code": 0xC3870000, "letter": "Ç" },
        { "code": 0xC3A00000, "letter": "à" },
        { "code": 0xC3A20000, "letter": "â" },
        { "code": 0xC3AA0000, "letter": "ê" },
        { "code": 0xC3AE0000, "letter": "î" },
        { "code": 0xC3B40000, "letter": "ô" },
        { "code": 0xC5930000, "letter": "œ" },
        { "code": 0xE282AC00, "letter": "€" },
        { "code": 0xC3A40000, "letter": "ä" },
        { "code": 0xC3B60000, "letter": "ö" },
        { "code": 0xC3840000, "letter": "Ä" },
        { "code": 0xC3960000, "letter": "Ö" },
        { "code": 0xC39C0000, "letter": "Ü" },
        { "code": 0xC39F0000, "letter": "ß" },
        { "code": 0xD0910000, "letter": "Б" },
        { "code": 0xD0930000, "letter": "Г" },
        { "code": 0xD09F0000, "letter": "П" },
        { "code": 0xD0A40000, "letter": "Ф" },
        { "code": 0xD0A60000, "letter": "Ц" },
        { "code": 0xD0AB0000, "letter": "Ы" },
        { "code": 0xD8A70000, "letter": "ا" },
        { "code": 0xD8A80000, "letter": "ب" },
        { "code": 0xD8AA0000, "letter": "ت" },
        { "code": 0xD8AC0000, "letter": "ج" },
        { "code": 0xD8AF0000, "letter": "د" },
        { "code": 0xD8B10000, "letter": "ر" },
        { "code": 0xD8B30000, "letter": "س" },
        { "code": 0xD8B90000, "letter": "ع" },
        { "code": 0xE4BDA000, "letter": "你" },
        { "code": 0xE5A5BD00, "letter": "好" },
        { "code": 0xE8B0A200, "letter": "谢" },
        { "code": 0xE4B8AD00, "letter": "中" },
        { "code": 0xE59BBD00, "letter": "国" },
        { "code": 0xE4BABA00, "letter": "人" },
        { "code": 0xE3818200, "letter": "あ" },
        { "code": 0xE382AB00, "letter": "カ" },
        { "code": 0xE697A500, "letter": "日" },
        { "code": 0xE69CAC00, "letter": "本" },
        { "code": 0xE8AA9E00, "letter": "語" },
        { "code": 0xE7A78100, "letter": "私" },
        { "code": 0xED959C00, "letter": "한" },
        { "code": 0xEAB88000, "letter": "글" },
        { "code": 0xEC958800, "letter": "안" },
        { "code": 0xEB859500, "letter": "녕" },
        { "code": 0xEC84B800, "letter": "세" },
        { "code": 0xEC9A9400, "letter": "요" },
 ]

    return randomUtf8Symbols[Math.floor(Math.random() * randomUtf8Symbols.length)];
}

export function lookupUnicode(code: string) {

    console.log(code);
    // If the code has more than 4 characters, then remove the leading 0s
    if (code.length > 4) {
        code = code.replace(/^0+/, '');
    }

    console.log(code);

    return unicodeTable.find(item  => item.code === code);
}