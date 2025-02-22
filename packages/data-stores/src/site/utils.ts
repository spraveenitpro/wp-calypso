export const createCustomHomeTemplateContent = (
	stylesheet: string,
	hasHeader: boolean,
	hasFooter: boolean,
	hasSections: boolean,
	mainHtml = ''
): string => {
	const content: string[] = [];
	if ( hasHeader ) {
		content.push(
			`<!-- wp:template-part {"slug":"header","tagName":"header","theme":"${ stylesheet }"} /-->`
		);
	}

	if ( hasSections ) {
		content.push( `
<!-- wp:group {"tagName":"main"} -->
	<main class="wp-block-group">
		${ mainHtml }
	</main>
<!-- /wp:group -->` );
	}

	if ( hasFooter ) {
		content.push(
			`<!-- wp:template-part {"slug":"footer","tagName":"footer","theme":"${ stylesheet }","className":"site-footer-container"} /-->`
		);
	}

	if ( content.length ) {
		return content.join( '\n' );
	}

	// If no layout is selected, return the paragraph block to start with blank content to avoid the StartModal showing.
	// See https://github.com/WordPress/gutenberg/blob/343fd27a51ae549c013bc30f51f13aad235d0d4a/packages/edit-site/src/components/start-template-options/index.js#L162
	return '<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->';
};
