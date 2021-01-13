import { Cells } from "../../../Cells";
import { Plugin, IPlugin} from "../../Plugin";
import { MarkdownCell } from "./markdownCell";
import marked from 'marked';
//import katex from 'katex';

import './Markdown.css';
/**
 * Builtin Markdown Cell Plugin.
 */
@Plugin
class Markdown implements IPlugin{
    /**
     * Transforms a markdown string into the html representation using `marked`.
     * 
     * @remarks
     * If the `content` parameter is empty, the function will return `*Empty Markdown String*`'s html representation.
     * 
     * @param content The content to format to markdown.
     */
    static format(content: string): string {
        let formatted: string;
        if (!content) {
            formatted = marked("*Empty markdown cell*");
        } else {
            formatted = marked(content);
        }
        return formatted;
    }
    /**
     * Registers the markdown cell in the [[Cells]] builtin list.
     */
    constructor() {
        Cells.builtins["markdown"] = MarkdownCell;
    }
}

export { Markdown }