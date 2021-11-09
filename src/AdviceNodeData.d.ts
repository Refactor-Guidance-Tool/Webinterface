import type { Advice } from "./advice/advice";

type AdviceNodeData = {
    advice: Advice,
    parent: AdviceNodeData,
    children: AdviceNodeData[]
};