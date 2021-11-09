import { Advice } from "./advice";

export class Option {
    constructor(message: string, advice: Advice) {
        this.message = message;
        this.advice = new Advice(advice.title, advice.messages, advice.hazards, advice.options);
    }

    message: string;
    advice: Advice;
}