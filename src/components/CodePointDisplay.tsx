import { useState } from "react";
import { lookupUnicode, processUtf8Bytes } from "../utf8/utf8";

interface CodePointDisplayProps {
    codePoint: number;
    className?: string;
    onChangeCodePoint: (codepoint: string) => void;
}

function CodePointDisplay(props: CodePointDisplayProps) {

    const { utf, codepoint, character, error } = processUtf8Bytes(props.codePoint);

    const unicodeLookup = codepoint ? lookupUnicode(codepoint.replace(/^U\+/, "")) : null;
    const [nextCodepoint, setNextCodepoint] = useState(codepoint);

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!nextCodepoint) return;
        props.onChangeCodePoint(nextCodepoint.replace('U+', ''));
    }

    return (
        <div className={props.className}>
            <div className="flex flex-col md:flex-wrap md:flex-row md:space-x-10 space-y-2 md:space-y-1">
                <div className="border-b-gray-300 border-b-1 md:border-none items-center md:items-start flex flex-row justify-between md:justify-normal flex-grow md:flex-col md:flex-none">
                    <h2 className="text-sm md:text-xl">UTF-8 Encoded Value</h2>
                    <p className='font-mono text-xl md:text-2xl'>{utf ?? "—"}</p>
                </div>
                <div className="border-b-gray-300 border-b-1 md:border-none items-center md:items-start flex flex-row justify-between md:justify-normal flex-grow md:flex-col md:flex-none">
                    <h2 className="text-sm md:text-xl">Unicode Code Point</h2>
                    <p className='font-mono text-xl md:text-2xl'>
                        <form
                            onSubmit={submit}
                        >
                            <input
                                type="text"
                                value={nextCodepoint ?? codepoint ?? "—"}
                                onChange={e => setNextCodepoint(e.target.value)}
                            />
                        </form>
                    </p>
                </div>
                <div>
                    <h2 className="text-sm md:text-xl">Official Name <sup><a className="text-[8pt]" target="_blank" href="https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt">source↗</a></sup></h2>
                    <p className='font-mono text-md md:text-2xl'>{unicodeLookup ? unicodeLookup.name : "—"}</p>
                </div>
            </div>
            <div className="border-dashed border-2 w-full h-full flex items-center justify-center">
                {
                    error ? (
                        <div className="text-red-700 bg-amber-100 p-10 border-2 border-amber-300 text-xl text-center" dangerouslySetInnerHTML={{ __html: error }} />
                    ) : (
                        <div className='text-[80pt] md:text-[12vw] w-full h-full flex items-center justify-center'>
                            {character}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default CodePointDisplay;