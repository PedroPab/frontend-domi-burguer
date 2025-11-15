"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function ConfettiExplosion({ trigger }) {
    useEffect(() => {
        if (!trigger) return;

        confetti({
            particleCount: 250,
            startVelocity: 50,
            spread: 90,
            ticks: 250,
            scalar: 1.2,
            origin: { x: 0.5, y: 0.5 },
            colors: ["#ff4757", "#1e90ff", "#2ed573", "#ffa502", "#e84393"],
        });

    }, [trigger]);

    return null;
}
