import React from "react";

interface SingleByteProps {
    byteNumber: number;
    value: number;
    controlBits: number;
    enabled: boolean;
    onChange: (newValue: number) => void;
    className: string;
}

function SingleByte(props: SingleByteProps) {

    // Toggle a specific bit in the byte by using XOR operation
    const toggleBit = (bit: number) =>
        props.onChange(props.value ^ (1 << bit));

    return (
        <div className={`${props.className} flex flex-col ${props.enabled ? `` : `border-dotted`}`}>
            <div className={`text-center text-sm ${props.enabled ? `font-bold  text-black` : `font-bold text-gray-400`}`}>
                {`Byte ${props.byteNumber} ${props.enabled ? "" : "(Disabled)"}`}
            </div>
            <div className="flex flex-row items-center justify-center gap-1">
                {[...Array(8)]
                    .map((_, i) => 7 - i)  // Reverse the order to display bits from 7 to 0 - MSB to LSB
                    .map(bit => {

                        const isOn = (props.value & (1 << bit)) !== 0;

                        // Choose colors based on the state of the bit and whether the byte is enabled
                        const colors =
                            props.controlBits & (1 << bit)      // Dark green for control bits
                                ? props.enabled
                                    ? "bg-green-900 text-white"
                                    : "bg-gray-300 text-gray-400"
                                : props.enabled                 // Light green for data bits        
                                    ? "bg-green-300 text-black"
                                    : "bg-gray-300 text-gray-400"

                        const btnClasses = `w-10 h-20 border-1 border-gray-300 font-mono text-4xl flex items-center justify-center cursor-pointer ${colors}`;

                        return (
                            <button
                                key={bit}
                                type="button"
                                className={`${btnClasses} relative`} // This relative class is needed for the absolute positioning of the span
                                aria-pressed={isOn}
                                onClick={() => toggleBit(bit)}
                            >
                                {isOn ? "1" : "0"}
                                <span className="sr-only">{`Toggle bit ${bit}`}</span>

                                <span className="absolute bottom-1 text-[10px] text-gray-500"
                                    style={{ left: "50%", transform: "translateX(-50%)" }}>{`${bit}`}</span>
                            </button>
                        );
                    })}
            </div>
        </div>

    );
};

export default React.memo(SingleByte); // Memoize the component to prevent unnecessary re-renders