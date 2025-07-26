// @ts-check

import {MarkdownPageEvent} from "typedoc-plugin-markdown";

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
	app.renderer.on(MarkdownPageEvent.END, (page) => {
		page.contents = page.contents.replace(
			/\*\*@medrunner\/api-client\*\*\n\n\*\*\*\n\n# @medrunner\/api-client/,
			'# List of available types'
		).replace(
			/\[\*\*@medrunner\/api-client\*\*\]\(\.\.\/index\.md\)\n\n\*\*\*/,
			''
		).replace(
			/\[@medrunner\/api-client\]\(\.\.\/index\.md\) \/ \w+/,
			''
		);
	});

	app.renderer.markdownHooks.on(
		'page.begin',
		() => `---\nnext: false\nprev:\n  text: 'Back to types'\n  link: '/reference/types/'\n---`,
	);
}
