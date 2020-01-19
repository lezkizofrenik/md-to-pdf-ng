const marked = require('marked');
const { getLanguage, highlight } = require('highlight.js');
const fs = require('fs');
const path = require('path');

//let nodePath = process.env.NODE_PATH;
let nodePath = process.env;
console.log('nodePath:', __dirname);

const mermaidCode = fs.readFileSync(__dirname + '/mermaid.min.js', 'utf8');
console.log('mermaidCode:', mermaidCode.length);

/**
 * Get a marked renderer with an attached highlighter.
 *
 * @param {Object} options Marked configuration object
 *
 * @returns a marked renderer with highlight.js parser attached
 */
module.exports = options => {
	const renderer = options.renderer || new marked.Renderer();

	if (!Object.prototype.hasOwnProperty.call(renderer, 'code')) {
		renderer.code = (code, language) => {
			if (language && language.match(/\bmermaid\b/i)) {
				console.log('is mermaid');
				return `
					<script>
					${mermaidCode}
					</script>
					<!-- <script src="https://unpkg.com/browse/mermaid@8.4.5/dist/mermaid.min.js"></script> -->
					<script>mermaid.initialize({startOnLoad:true});</script>
					<div class="mermaid">${code}</div>`;
			}

			// if the given language is not available in highlight.js, fall back to plaintext
			language = (getLanguage(language) && language) || 'plaintext';

			return `<pre><code class="hljs ${language}">${highlight(language, code).value}</code></pre>`;
		};
	}

	marked.setOptions({ ...options, renderer });

	return marked;
};
