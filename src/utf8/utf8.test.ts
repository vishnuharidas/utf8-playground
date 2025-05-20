import { lookupUnicode, codePointToUtf8Int, processUtf8Bytes } from './utf8';
import unicodeTableData from './unicode_table.json'; // For actual data reference if needed elsewhere, but we'll mock for tests

// Mock the unicodeTable directly in the test file
jest.mock('./unicode_table.json', () => [
  { code: '0000', name: '<control>' },
  { code: '0041', name: 'LATIN CAPITAL LETTER A' },
  { code: '00A2', name: 'CENT SIGN' },
  { code: '20AC', name: 'EURO SIGN' },
  { code: '1F600', name: 'GRINNING FACE' },
  // Add more mock data if other specific tests require it
]);

describe('UTF-8 Utility Functions', () => {
  describe('lookupUnicode', () => {
    it('should return the entry for U+0000 when code is "0"', () => {
      const result = lookupUnicode('0');
      expect(result).toEqual({ code: '0000', name: '<control>' });
    });

    it('should return the entry for U+0000 when code is "00"', () => {
      const result = lookupUnicode('00');
      expect(result).toEqual({ code: '0000', name: '<control>' });
    });
    
    it('should return "LATIN CAPITAL LETTER A" for code "41"', () => {
      const result = lookupUnicode('41');
      expect(result?.name).toBe('LATIN CAPITAL LETTER A');
    });

    it('should return "LATIN CAPITAL LETTER A" for code "0041"', () => {
      const result = lookupUnicode('0041');
      expect(result?.name).toBe('LATIN CAPITAL LETTER A');
    });

    it('should return "GRINNING FACE" for code "1F600"', () => {
      const result = lookupUnicode('1F600');
      expect(result?.name).toBe('GRINNING FACE');
    });
    
    it('should return "GRINNING FACE" for code "01F600" (handles leading zeros by stripping)', () => {
      const result = lookupUnicode('01F600');
      expect(result?.name).toBe('GRINNING FACE');
    });

    it('should return undefined for a non-existent code "XXXX"', () => {
      const result = lookupUnicode('XXXX');
      expect(result).toBeUndefined();
    });
    
    it('should return entry for U+0000 for code "00000" (handles stripping to "0")', () => {
      const result = lookupUnicode('00000');
      expect(result).toEqual({ code: '0000', name: '<control>' });
    });
  });

  describe('codePointToUtf8Int', () => {
    it('should convert "41" (A) to its 1-byte UTF-8 integer representation', () => {
      // U+0041 -> 0x41. Padded to 4 bytes: 0x41000000
      expect(codePointToUtf8Int('41')).toBe(0x41000000);
    });

    it('should convert "00A2" (¢) to its 2-byte UTF-8 integer representation', () => {
      // U+00A2 -> C2 A2. Padded to 4 bytes: 0xC2A20000
      expect(codePointToUtf8Int('00A2')).toBe(0xC2A20000);
    });

    it('should convert "20AC" (€) to its 3-byte UTF-8 integer representation', () => {
      // U+20AC -> E2 82 AC. Padded to 4 bytes: 0xE282AC00
      expect(codePointToUtf8Int('20AC')).toBe(0xE282AC00);
    });

    it('should convert "1F600" (😀) to its 4-byte UTF-8 integer representation', () => {
      // U+1F600 -> F0 9F 98 80.
      expect(codePointToUtf8Int('1F600')).toBe(0xF09F9880);
    });
    
    it('should convert "0" (Null) to its 1-byte UTF-8 integer representation', () => {
      // U+0000 -> 0x00. Padded to 4 bytes: 0x00000000
      expect(codePointToUtf8Int('0')).toBe(0x00000000);
    });

    it('should return null for an out-of-range hex string "110000"', () => {
      expect(codePointToUtf8Int('110000')).toBeNull();
    });

    it('should return null for an invalid hex string "ZZZ"', () => {
      // parseInt("ZZZ", 16) is NaN. The function should handle this.
      expect(codePointToUtf8Int('ZZZ')).toBeNull();
    });
  });

  describe('processUtf8Bytes', () => {
    // Valid sequences
    it('should process 1-byte sequence 0x41000000 (A) correctly', () => {
      const result = processUtf8Bytes(0x41000000);
      expect(result.character).toBe('A');
      expect(result.codepoint).toBe('U+0041');
      expect(result.utf).toBe('0x41');
      expect(result.error).toBeUndefined();
    });

    it('should process 2-byte sequence 0xC2A20000 (¢) correctly', () => {
      const result = processUtf8Bytes(0xC2A20000);
      expect(result.character).toBe('¢');
      expect(result.codepoint).toBe('U+00A2');
      expect(result.utf).toBe('0xC2A2');
      expect(result.error).toBeUndefined();
    });

    it('should process 3-byte sequence 0xE282AC00 (€) correctly', () => {
      const result = processUtf8Bytes(0xE282AC00);
      expect(result.character).toBe('€');
      expect(result.codepoint).toBe('U+20AC');
      expect(result.utf).toBe('0xE282AC');
      expect(result.error).toBeUndefined();
    });

    it('should process 4-byte sequence 0xF09F9880 (😀) correctly', () => {
      const result = processUtf8Bytes(0xF09F9880);
      expect(result.character).toBe('😀');
      expect(result.codepoint).toBe('U+1F600');
      expect(result.utf).toBe('0xF09F9880');
      expect(result.error).toBeUndefined();
    });

    // Invalid sequences - error messages
    it('should return error for invalid start byte 0x80000000', () => {
      const result = processUtf8Bytes(0x80000000);
      expect(result.error).toContain('First byte cannot start with <code>10xxxxxx</code>');
    });
    
    it('should return error for invalid start byte 0xF8000000', () => {
      const result = processUtf8Bytes(0xF8000000);
      expect(result.error).toContain('First byte cannot start with <code>11111xxx</code>');
    });

    it('should return error for 2-byte sequence with invalid second byte 0xC2410000', () => {
      const result = processUtf8Bytes(0xC2410000);
      expect(result.error).toBe('⚠️ Error: For a 2-byte sequence, the second byte must start with <code>10xxxxxx</code>.');
    });
    
    it('should return error for 3-byte sequence with invalid second byte 0xE2418200', () => {
      const result = processUtf8Bytes(0xE2418200);
      expect(result.error).toBe('⚠️ Error: For a 3-byte sequence, the second and third bytes must start with <code>10xxxxxx</code>.');
    });

    it('should return error for 3-byte sequence with invalid third byte 0xE2824100', () => {
      const result = processUtf8Bytes(0xE2824100);
      expect(result.error).toBe('⚠️ Error: For a 3-byte sequence, the second and third bytes must start with <code>10xxxxxx</code>.');
    });
    
    it('should return error for 4-byte sequence with invalid second byte 0xF0419880', () => {
      const result = processUtf8Bytes(0xF0419880);
      expect(result.error).toBe('⚠️ Error: For a 4-byte sequence, the second, third, and fourth bytes must start with <code>10xxxxxx</code>.');
    });
    
    it('should return error for 4-byte sequence with invalid third byte 0xF09F4180', () => {
      const result = processUtf8Bytes(0xF09F4180);
      expect(result.error).toBe('⚠️ Error: For a 4-byte sequence, the second, third, and fourth bytes must start with <code>10xxxxxx</code>.');
    });

    it('should return error for 4-byte sequence with invalid fourth byte 0xF09F9841', () => {
      const result = processUtf8Bytes(0xF09F9841);
      expect(result.error).toBe('⚠️ Error: For a 4-byte sequence, the second, third, and fourth bytes must start with <code>10xxxxxx</code>.');
    });

    // Overlong encoding
    it('should correctly decode overlong U+0000 (0xC0800000)', () => {
      const result = processUtf8Bytes(0xC0800000);
      // The current function's logic allows this as it only checks control bits.
      expect(result.character).toBe('\u0000'); // Null character
      expect(result.codepoint).toBe('U+0000');
      expect(result.utf).toBe('0xC080');
      expect(result.error).toBeUndefined();
    });
    
    // Overlong encoding for '/' (U+002F)
    // 0xE080AF -> U+002F (overlong 3-byte)
    // 0xF08080AF -> U+002F (overlong 4-byte)
    it('should correctly decode overlong U+002F (0xE080AF00)', () => {
      const result = processUtf8Bytes(0xE080AF00);
      expect(result.character).toBe('/');
      expect(result.codepoint).toBe('U+002F');
      expect(result.utf).toBe('0xE080AF');
      expect(result.error).toBeUndefined();
    });

    // Code points outside valid Unicode range (U+0000 to U+10FFFF)
    it('should return error for encoding of U+110000 (0xF4908080)', () => {
      const result = processUtf8Bytes(0xF4908080);
      // This code point is > 0x10FFFF, so getStrFromCodePoint should error
      expect(result.character).toBe('\uFFFD'); // Replacement character
      expect(result.codepoint).toBe('U+110000');
      expect(result.utf).toBe('0xF4908080');
      expect(result.error).toBe('⚠️ Error converting code point to string.');
    });
    
    // Edge case: Processing 0 (all bytes zero)
    it('should process 0x00000000 (Null character) correctly', () => {
      const result = processUtf8Bytes(0x00000000);
      expect(result.character).toBe('\u0000');
      expect(result.codepoint).toBe('U+0000');
      expect(result.utf).toBe('0x00');
      expect(result.error).toBeUndefined();
    });
  });
});
