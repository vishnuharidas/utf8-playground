import React from "react";

interface SingleByteProps {
    value: number;
    onChange: (newValue: number) => void;
    className: string;
}

function SingleByte(props: SingleByteProps) {

    // Toggle a specific bit in the byte by using XOR operation
    const toggleBit = (bit: number) =>
        props.onChange(props.value ^ (1 << bit));

    return (
        <div className={`${props.className} flex`}>
            {[...Array(8)]
                .map((_, i) => 7 - i)  // Reverse the order to display bits from 7 to 0 - MSB to LSB
                .map(bit => {

                    const isOn = (props.value & (1 << bit)) !== 0;
                    const btnClasses = [
                        "w-10 h-20 border-1 border-gray-300 font-mono text-4xl flex items-center justify-center",
                        "cursor-pointer",
                        isOn && "bg-amber-200",
                    ]
                        .filter(Boolean) // Filter out falsy values (especially for the background color)
                        .join(" ");

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

                            <span className="absolute bottom-1 text-xs text-gray-400"
                                style={{ left: "50%", transform: "translateX(-50%)" }}>{`${bit}`}</span>
                        </button>
                    );
                })}
        </div>
    );
};

export default React.memo(SingleByte); // Memoize the component to prevent unnecessary re-renders