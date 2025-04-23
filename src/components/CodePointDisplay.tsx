
interface CodePointDisplayProps {
    codePoint: number;
    className?: string;
}

function CodePointDisplay(props: CodePointDisplayProps) {

    const hexValue = props.codePoint.toString(16).padStart(8, '0').toUpperCase()
    const stringValue = String.fromCharCode(props.codePoint)

    return (
        <div className={props.className}>
            <h2 className="text-xl font-semibold">Code Point</h2>
            <p className='text-3xl font-mono'>U+{hexValue}</p>
            <div className='text-[10vw] border-dashed border-2 w-full h-full flex items-center justify-center'>
                {stringValue}
            </div>
        </div>
    );
}

export default CodePointDisplay;