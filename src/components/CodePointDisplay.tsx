import { processUtf8Bytes } from "../utf8/utf8";

interface CodePointDisplayProps {
    codePoint: number;
    className?: string;
}

function CodePointDisplay(props: CodePointDisplayProps) {

    const { utf, codepoint, character, error } = processUtf8Bytes(props.codePoint);

    return (
        <div className={props.className}>
            <div className="flex flex-row space-x-20">
                <div>
                    <h2 className="text-xl">UTF-8 Encoded Value</h2>
                    <p className='text-3xl font-mono'>{utf}</p>
                </div>
                <div>
                    <h2 className="text-xl">Unicode Code Point</h2>
                    <p className='text-3xl font-mono'>{codepoint}</p>
                </div>
            </div>
            <div className='text-[10vw] border-dashed border-2 w-full h-full flex items-center justify-center'>
                {character}
            </div>
            {
                error ? (
                    <div className="text-red-700 text-lg">
                        {error}
                    </div>
                ) : null
            }
        </div>
    );
}

export default CodePointDisplay;