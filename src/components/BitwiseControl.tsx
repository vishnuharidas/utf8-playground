import SingleByte from "./SingleByte";

interface BitwiseControlProps {
    value: number;
    onChange: (newValue: number) => void,
    className: string;
}


function BitwiseControl(props: BitwiseControlProps) {

    const shifts = [24, 16, 8, 0];
    const bytes = shifts.map(shift => (props.value >> shift) & 0xff); // Extract bytes from the value

    // Combine the bytes into a single value
    const handleByteChange = (index: number, newByte: number) => {
        const newBytes = [...bytes];
        newBytes[index] = newByte & 0xff;
        const combined = newBytes.reduce(
            (acc, byte, i) => acc | (byte << shifts[i]),
            0
        );
        props.onChange(combined >>> 0); // Ensure the value is treated as unsigned
    };

    return (
        <div className={`${props.className} container`}>
            <div className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-bold">Bitwise Control</h2>
                <button
                    type="button"
                    className="bg-red-500 text-white text-sm px-2 py-1 rounded cursor-pointer hover:bg-red-600"
                    onClick={() => props.onChange(0)}
                >
                    Reset
                </button>
            </div>
            {/* Future controls for bitwise editing will go here */}
            <div className="mt-2 text-lg font-mono">
                {bytes
                    .map((byte, i) => `B${i + 1}: ${byte.toString(16).padStart(2, '0').toUpperCase()}`)
                    .join(' _ ')
                }
            </div>

            <div className="border-1 border-b-blue-500 flex flex-row flex-wrap space-x-4">
                {
                    bytes.map((byte, i) => (
                        <SingleByte
                            key={i}
                            className="border-3 border-green-600 max-w-fit"
                            value={byte}
                            onChange={(newByte) => handleByteChange(i, newByte)}
                        />
                    ))
                }
            </div>

        </div>
    );
};

export default BitwiseControl;
