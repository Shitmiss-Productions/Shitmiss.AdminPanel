import { Packet } from "tournament-assistant-client";

type Match = {
    user: {
        score: bigint,
        acc: Float32Array,
        fc: boolean
    }

};

export { Match }