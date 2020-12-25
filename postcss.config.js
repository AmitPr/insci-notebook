const postcssNested = require('postcss-nested')
const tailwindcss = require('tailwindcss')
module.exports = {
    plugins: [
        tailwindcss(),
        postcssNested()
    ]
}