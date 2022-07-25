import { markdown } from "../deps.js"

const parse = (text, profile) => {
    const data = markdown.parse(text)

    return {
        markdown: text,
        html: data.content,
        meta: data.meta
    }
}

export default {
    extname: ".md",
    parse
}