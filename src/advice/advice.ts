import type { Hazard } from "./hazard";
import { Option } from "./option";

export type AdviceData = {
  messages: string[];
  hazards: { title: string, message: string }[];
}

export class Advice {
  constructor(title: string, messages: string[], hazards: Hazard[], options: Option[] = []) {
    this.title = title;
    this.messages = messages;
    this.hazards = hazards;
    this.options = options.map(o => {
      return new Option(o.message, o.advice);
    });
  }

  getData(message: string): AdviceData {
    const regex = new RegExp(/\[(\d*?),(.*?)\]/);
    let array = regex.exec(message);

    const messages = [];
    const hazards = [];

    while (array !== null && array.length === 3) {
      const replacer = array[0];
      const id = parseInt(array[1]);
      const text = array[2];

      // If we can find the corresponding hazard, replace the match with the html representation of the hazard.
      // Then, try searching again for the regex.
      const hazard = this.findHazard(id);
      if (hazard !== null) {
        messages.push(message.substring(0, message.indexOf(replacer)));
        hazards.push({title: text, message: `${hazard.name}: line ${hazard.line} in file ${hazard.file}`});

        message = message.substring(message.indexOf(array[0]) + array[0].length);
        array = regex.exec(message);
      }
    }

    messages.push(message);
    return { messages: messages, hazards: hazards };
  }

  findHazard(id: number): Hazard {
    for (const hazard of this.hazards) {
      if (hazard.id === id) {
        return hazard;
      }
    }

    return null;
  }

  findNewAdvice(idx: number): Advice {
    return this.options[idx].advice;
  }

  title = "";
  
  messages: string[] = [];
  checkedMessages: boolean[] = [];

  options: Option[] = [];
  hazards: Hazard[] = [];
}