interface NotesPanelProps {
    className: string;
    onClick?: (code: number) => void;
}

function NotesPanel(props: NotesPanelProps) {
    return (
        <div className={`${props.className} overflow-y-auto`}>
            <h2 className="text-2xl font-bold mb-2">UFT-8 Encoding</h2>
            <div className="text-gray-700 text-md space-y-3">
                <p>UTF-8 is a variable-width character encoding used for representing every character in the Unicode character set, which includes characters from most of the world's writing systems.</p>
                <p>UTF-8 uses <strong>one to four bytes</strong> to encode characters. The first 128 characters (U+0000 to U+007F) are encoded using a single byte, while other characters use two, three, or four bytes. This makes UTF-8 backward compatible with ASCII encoding.</p>

                <p>The first bit of the first byte indicates the number of bytes in the character:</p>
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
                <p>The remaining bits in the first byte and the subsequent bytes are used to represent the character's code point. A code point is a pointer to a character in the Unicode character set.</p>
                <h3 className="text-lg font-bold mt-6">An Example - <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => props.onClick && props.onClick(0xE0A48500)}>Hindi letter "अ"</span> <span className="font-normal">(click to load)</span></h3>
                <p>
                    The character Hindi letter "अ" is represented in UTF-8 as:<br /><br />
                    <code className="border-1 border-gray-400 p-0.5 font-bold">11100000</code> <code className="border-1 border-gray-400 p-0.5 font-bold">10100100</code> <code className="border-1 border-gray-400 p-0.5 font-bold">10000101</code>
                </p>
                <p>Here,</p>
                <p>First byte <code className="border-1 border-gray-400 p-0.5">11100000</code> says that there are 3 bytes in this character.</p>
                <p>Remaining bits of the 3 bytes (
                    <code className="border-1 border-gray-400 p-0.5">xxxx0000</code> <code className="border-1 border-gray-400 p-0.5">xx100100</code> <code className="border-1 border-gray-400 p-0.5">xx000101</code>
                    ) together becomes <code>00001001 00000101</code> (<code>0x0905</code>), which is the code point (<code>U+0905</code>) that represents the character Hindi letter "अ" in the Unicode character set.</p>

            </div>
            <h3 className="text-lg font-bold mt-6">Sample Codeblocks</h3>
            <p>
                Most of the characters in the Unicode character set are represented in blocks. Each block contains a range of code points that represent a specific set of characters. Here are some examples of code blocks for you to explore. Click on any block to load the first recognizable character in that block.
            </p>
            <ul className="list-disc list-inside mt-4">
                {
                    [
                        { "name": "Basic Latin", "start": 0x41000000 }, // Starts with 0x41 ('A')
                        { "name": "Latin-1 Supplement", "start": 0xC3800000 }, // Starts with 0xC3 ('Ã')
                        { "name": "Latin Extended-A", "start": 3296722944 },
                        { "name": "Greek and Coptic", "start": 3450863616 },
                        { "name": "Cyrillic", "start": 3498049536 },
                        { "name": "Hebrew", "start": 3599761408 },
                        { "name": "Arabic", "start": 3632267264 },
                        { "name": "Devanagari", "start": 0xE0A48500 },
                        { "name": "Tamil", "start": 0xE0AE8500 },
                        { "name": "Malayalam", "start": 0xE0B48500 },
                        { "name": "CJK Unified Ideographs", "start": 3837296640 },
                        { "name": "Emoticons", "start": 4036991104 }
                    ].map((block) => (
                        <li key={block.name} className="mb-2">
                            <button
                                className="rounded hover:font-bold cursor-pointer"
                                onClick={() => props.onClick && props.onClick(block.start)}>
                                {block.name}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}
export default NotesPanel;