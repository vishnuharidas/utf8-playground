interface NotesPanelProps {
    className: string;
    onClick?: (code: number) => void;
}

function NotesPanel(props: NotesPanelProps) {
    return (
        <div className={`${props.className} overflow-y-auto`}>
            <h2 className="text-2xl font-bold mb-2">UFT-8 Encoding</h2>
            <div className="text-grey-700 text-md space-y-3">
                <p>UTF-8 is a variable-width character encoding designed to represent every character in the Unicode character set, encompassing characters from most of the world's writing systems.</p>
                <p>It encodes characters using <strong>one to four bytes</strong>. The first 128 characters (U+0000 to U+007F) are encoded with a single byte, ensuring backward compatibility with ASCII, while other characters require two, three, or four bytes.</p>
                <p>The <strong>leading bits of the first byte</strong> determine the total number of bytes in the character. These bits follow one of four specific patterns, which indicate how many continuation bytes follow.</p>
                <ul className="list-disc list-inside mt-2 space-y-2">
                    <li>
                        <code>0xxxxxxx</code>: 1 byte
                        <ul className="list-none list-inside ml-4">
                            <li><code className="border-1 border-gray-400 p-0.5">0xxxxxxx</code></li>
                        </ul>
                    </li>
                    <li>
                        <code>110xxxxx</code>: 2 bytes
                        <ul className="list-none list-inside ml-4">
                            <li><code className="border-1 border-gray-400 p-0.5">110xxxxx</code> <code className="border-1 border-gray-400 p-0.5">10xxxxxx</code></li>
                        </ul>
                    </li>
                    <li>
                        <code>1110xxxx</code>: 3 bytes
                        <ul className="list-none list-inside ml-4">
                            <li><code className="border-1 border-gray-400 p-0.5">1110xxxx</code> <code className="border-1 border-gray-400 p-0.5">10xxxxxx</code> <code className="border-1 border-gray-400 p-0.5">10xxxxxx</code></li>
                        </ul>
                    </li>
                    <li>
                        <code>11110xxx</code>: 4 bytes
                        <ul className="list-none list-inside ml-4">
                            <li><code className="border-1 border-gray-400 p-0.5">11110xxx</code> <code className="border-1 border-gray-400 p-0.5">10xxxxxx</code> <code className="border-1 border-gray-400 p-0.5">10xxxxxx</code> <code className="border-1 border-gray-400 p-0.5">10xxxxxx</code></li>
                        </ul>
                    </li>
                </ul>
                <p>The second, third, and fourth bytes in a multi-byte sequence always start with <code>10</code>. This indicates that these bytes are continuation bytes, following the main byte.</p>
                <p>The remaining bits in the main byte, along with the bits in the continuation bytes, are combined to form the character's <strong>code point.</strong> A code point serves as a unique identifier for a character in the Unicode character set.</p>
                <h3 className="text-2xl font-bold mt-6">Example: Hindi Letter "अ" <a href="#" className="text-lg font-light" onClick={(e) => { e.preventDefault(); props.onClick && props.onClick(0xE0A48500) }}>(click to load)</a></h3>
                <p>
                    The Hindi letter "अ" (officially <i>"Devanagari Letter A"</i>) is represented in UTF-8 as:
                </p>
                <div className="mt-2 space-x-1">
                    <code className="border-1 border-gray-400 p-0.5 font-bold">11100000</code>
                    <code className="border-1 border-gray-400 p-0.5 font-bold">10100100</code>
                    <code className="border-1 border-gray-400 p-0.5 font-bold">10000101</code>
                </div>
                <p className="mt-4">Here:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>
                        The first byte <code className="border-1 border-gray-400 p-0.5">11100000</code> indicates that the character is encoded using 3 bytes.
                    </li>
                    <li>
                        The remaining bits of the three bytes:
                        <div className="space-x-0.5">
                            <code className="border-1 border-gray-400 p-0.5">xxxx0000</code>
                            <code className="border-1 border-gray-400 p-0.5">xx100100</code>
                            <code className="border-1 border-gray-400 p-0.5">xx000101</code>
                        </div>
                        are combined to form the binary sequence <code>00001001 00000101</code> (<code>0x0905</code> in hexadecimal). This is the code point of the character, represented as <code>U+0905</code>.
                    </li>
                    <li>
                        The code point <strong><code>U+0905</code></strong><sup><a href="https://www.unicode.org/charts/PDF/U0900.pdf" target="_blank">official chart↗</a></sup> represents the Hindi letter "अ" in the Unicode character set.
                    </li>
                </ul>

                <h3 className="text-2xl font-bold mt-6">Sample Code Blocks</h3>
                <p>
                    Unicode characters are grouped into blocks, each containing a range of code points representing specific sets of characters. Below are some examples of code blocks. Click on any block to load a generally identifiable character in that block.
                </p>
                <ul className="list-disc list-inside mt-4">
                    {[
                        { name: "Basic Latin", start: 0x41000000, block: "U+0000..U+007F", official_chart: "https://www.unicode.org/charts/PDF/U0000.pdf" },
                        { name: "Latin-1 Supplement", start: 0xC3800000, block: "U+0080..U+00FF", official_chart: "https://www.unicode.org/charts/PDF/U0080.pdf" },
                        { name: "Latin Extended-A", start: 0xC5A00000, block: "U+0100..U+017F", official_chart: "https://www.unicode.org/charts/PDF/U0100.pdf" },
                        { name: "Greek and Coptic", start: 0xCEA90000, block: "U+0370..U+03FF", official_chart: "https://www.unicode.org/charts/PDF/U0370.pdf" },
                        { name: "Thai", start: 0xE0B88B00, block: "U+0E00..U+0E7F", official_chart: "https://www.unicode.org/charts/PDF/U0E00.pdf" },
                        { name: "Hiragana", start: 0xE3818200, block: "U+3040..U+309F", official_chart: "https://www.unicode.org/charts/PDF/U3040.pdf" },
                        { name: "Hebrew", start: 0xD7900000, block: "U+0590..U+05FF", official_chart: "https://www.unicode.org/charts/PDF/U0590.pdf" },
                        { name: "Arabic", start: 0xD8B40000, block: "U+0600..U+06FF", official_chart: "https://www.unicode.org/charts/PDF/U0600.pdf" },
                        { name: "Devanagari", start: 0xE0A48500, block: "U+0900..U+097F", official_chart: "https://www.unicode.org/charts/PDF/U0900.pdf" },
                        { name: "Tamil", start: 0xE0AE8500, block: "U+0B80..U+0BFF", official_chart: "https://www.unicode.org/charts/PDF/U0B80.pdf" },
                        { name: "Malayalam", start: 0xE0B48500, block: "U+0D00..U+0D7F", official_chart: "https://www.unicode.org/charts/PDF/U0D00.pdf" },
                        { name: "Emoticons", start: 4036991104, block: "U+1F600..U+1F64F", official_chart: "https://www.unicode.org/charts/PDF/U1F600.pdf" },
                    ]

                        .map((block) => (
                            <li key={block.name} className="mb-2 group relative">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.onClick && props.onClick(block.start);
                                    }}
                                >
                                    {block.name}
                                </a>
                                <span className="text-gray-500 font-mono text-sm"> ({block.block})</span>
                                <sup className="text-[10px] ml-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                                    <a href={block.official_chart} target="_blank" rel="noopener noreferrer">
                                        official chart↗
                                    </a>
                                </sup>
                            </li>
                        ))}
                </ul>

                <h3 className="text-2xl font-bold mt-6">Other Unicode Encoding Options</h3>
                <p>
                    Unicode provides several encoding options, including UTF-8, UTF-16, and UTF-32.
                </p>
                <p>
                    UTF-8 is the most popular Unicode encoding due to its versatility and efficiency. It is backward-compatible with ASCII, making it ideal for systems that need to support legacy data. Additionally, its variable-width nature ensures that it uses minimal space for common characters while still supporting the entire Unicode range.
                </p>
                <p>
                    UTF-8 has become the standard encoding for the web and is supported by all major operating systems, programming languages, and protocols. Its widespread adoption ensures seamless data exchange across different platforms and systems.
                </p>

                <h3 className="text-2xl font-bold mt-6">Character Name Lookup</h3>
                <p>
                    The character name details are obtained from the Unicode lookup table. The lookup table contains information about each character, including its name, code point, and other properties. The table is used to map code points to their corresponding characters and names.
                    Unicode lookup table source: <a className="text-blue-500 underline hover:text-blue-700" target="_blank" href="https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt">UnicodeData.txt↗</a>
                </p>

                <br />
                <p className="text-sm text-gray-600 border-t-1 border-t-gray-400 pt-4">
                    Copyright (c) 2025 Vishnu Haridas
                    <br />
                    This software is published under MIT License. See <a href="https://github.com/vishnuharidas/utf8-playground" target="_blank"> repository↗</a> for more details.
                </p>
            </div>
        </div>
    );
}
export default NotesPanel;