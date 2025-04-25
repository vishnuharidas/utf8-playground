import { lookupUnicode, processUtf8Bytes } from "../utf8/utf8";

interface CodePointDisplayProps {
    codePoint: number;
    className?: string;
}

function CodePointDisplay(props: CodePointDisplayProps) {

    const { utf, codepoint, character, error } = processUtf8Bytes(props.codePoint);

    const unicodeLookup = codepoint ? lookupUnicode(codepoint.replace(/^U\+/, "")) : null;

    return (
        <div className={props.className}>
            <div className="flex flex-row flex-wrap space-x-20 space-y-2 md:space-y-1">
                <div>
                    <h2 className="text-lg md:text-xl">UTF-8 Encoded Value</h2>
                    <p className='font-mono text-xl md:text-2xl'>{utf ?? "—"}</p>
                </div>
                <div>
                    <h2 className="text-lg md:text-xl">Unicode Code Point</h2>
                    <p className='font-mono text-xl md:text-2xl'>{codepoint ?? "—"}</p>
                </div>
                <div>
                    <h2 className="text-lg md:text-xl">Official Name <sup><a className="text-[8pt]" target="_blank" href="https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt">source↗</a></sup></h2>
                    <p className='font-mono text-xl md:text-2xl'>{unicodeLookup ? unicodeLookup.name : "—"}</p>
                </div>
            </div>
            <div className="border-dashed border-2 w-full h-full flex items-center justify-center">
                {
                    error ? (
                        <div className="text-red-700 bg-amber-100 p-10 border-2 border-amber-300 text-xl text-center" dangerouslySetInnerHTML={{ __html: error }} />
                    ) : (
                        <div className='text-[60pt] md:text-[12vw] w-full h-full flex items-center justify-center'>
                            {character}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default CodePointDisplay;