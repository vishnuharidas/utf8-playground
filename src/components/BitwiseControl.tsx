import { getControlBits, getEnabledBytes } from "../utf8/utf8";
import SingleByte from "./SingleByte";

interface BitwiseControlProps {
    value: number;
    onChange: (newValue: number) => void,
    className: string;
}


function BitwiseControl(props: BitwiseControlProps) {

    const shifts = [24, 16, 8, 0];
    const bytes = shifts.map(shift => (props.value >> shift) & 0xff); // Extract bytes from the value

    const enabeldBytes = getEnabledBytes(props.value);
    const controlBits = getControlBits(props.value); // To show the control bits in Black color
    const controlBytes = shifts.map(shift => (controlBits >> shift) & 0xff); // Extract control bytes from the value

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
        <div className={`${props.className}`}>
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
            <div className="text-lg">
                Control the bits of available 4-byte encoding.
            </div>

            <div className="flex flex-row flex-wrap space-x-4 space-y-4">
                {
                    bytes.map((byte, i) => {
                        const byteClass = `h-fit border-3 ${enabeldBytes[i] ? `border-green-600 bg-green-50` : `border-gray-300`} max-w-fit p-2`
                        return (
                            <SingleByte
                                key={i}
                                byteNumber={i + 1}
                                enabled={enabeldBytes[i]}
                                controlBits={controlBytes[i]}
                                className={byteClass}
                                value={byte}
                                onChange={(newByte) => handleByteChange(i, newByte)}
                            />
                        )
                    })
                }
            </div>

        </div>
    );
};

export default BitwiseControl;
