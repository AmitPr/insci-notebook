import { Cells, Cell } from "../../../Cells";
import { Plugin } from "../../Plugin";
import { MarkdownCell } from "./markdownCell";
import marked from 'marked';
import katex from 'katex';

import './Markdown.css';

@Plugin
class Markdown {
    static format(content: string): string {
        let formatted: string;
        if (!content) {
            formatted = marked("*Empty markdown cell*");
        } else {
            formatted = marked(content);
        }
        return formatted;
    }
    constructor() {
        Cells.builtins["markdown"] = MarkdownCell;
    }
}

export { Markdown }