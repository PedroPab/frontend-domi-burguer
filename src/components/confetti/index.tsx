import React from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

interface ConfettiComponentProps {
    active?: boolean;
    numberOfPieces?: number;
    colors?: string[];
}

const ConfettiComponent: React.FC<ConfettiComponentProps> = ({
    numberOfPieces = 200,
}) => {
    const { width, height } = useWindowSize();


    return (
      <Confetti
        width={width}
        height={height}
        recycle={false}
        gravity={0.1}
        // numberOfPieces={numberOfPieces}
        // style={{
        //     position: 'fixed',
        //     top: 0,
        //     left: 0,
        //     zIndex: 10,
        //     pointerEvents: 'none'
        // }}
        />
    );
};

export default ConfettiComponent;