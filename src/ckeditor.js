import InlineEditorBase from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from './archive.svg';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Link from '@ckeditor/ckeditor5-link/src/link';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';

class TemplatesDropdown extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add( 'templateDropdown', locale => {
			const dropdownView = createDropdown( locale );
			dropdownView.buttonView.set( {
				label: 'Вставить шаблон',
				icon: imageIcon,
				tooltip: true
			} );
			const items = new Collection();

			const values = editor.config.get( 'templateDropdownValues' );
			if ( values ) {
				for ( const value of values ) {
					items.add( {
						type: 'button',
						model: new Model( {
							withText: true,
							label: value.name,
							pasteText: value.text
						} )
					} );
				}
			}
			dropdownView.on( 'execute', function( data ) {
				const viewFragment = editor.data.processor.toView( data.source.pasteText );
				const modelFragment = editor.data.toModel( viewFragment );
				editor.model.insertContent( modelFragment, editor.model.document.selection );
			} );

			addListToDropdown( dropdownView, items );
			return dropdownView;
		} );
	}
}

class IndentBlockFixed extends IndentBlock {
	/**
	 * Setups conversion for using offset indents.
	 *
	 * @private
	 */
	_setupConversionUsingOffset() {
		const conversion = this.editor.conversion;
		const marginProperty = 'text-indent'; // единственное изменение

		conversion.for( 'upcast' ).attributeToAttribute( {
			view: {
				styles: {
					[ marginProperty ]: /[\s\S]+/
				}
			},
			model: {
				key: 'blockIndent',
				value: viewElement => viewElement.getStyle( marginProperty )
			}
		} );

		conversion.for( 'downcast' ).attributeToAttribute( {
			model: 'blockIndent',
			view: modelAttributeValue => {
				return {
					key: 'style',
					value: {
						[ marginProperty ]: modelAttributeValue
					}
				};
			}
		} );
	}
}

export default class InlineEditor extends InlineEditorBase {
}

// Plugins to include in the build.
InlineEditor.builtinPlugins = [
	Autoformat,
	AutoLink,
	Bold,
	Indent,
	IndentBlockFixed,
	Italic,
	Alignment,
	HorizontalLine,
	Link,
	PageBreak,
	SpecialCharacters,
	SpecialCharactersEssentials,
	Subscript,
	Superscript,
	Underline,
	Essentials,
	// Paragraph,
	TemplatesDropdown,
	FontSize,
	Heading
];

// Editor configuration.
InlineEditor.defaultConfig = {
	toolbar: {
		items: [
			'undo',
			'redo',
			'|',
			'heading',
			'fontSize',
			'|',
			'bold',
			'italic',
			'underline',
			'subscript',
			'superscript',
			'|',
			'indent',
			'outdent',
			'|',
			'alignment',
			'specialCharacters',
			'link',
			'horizontalLine',
			'pageBreak'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'ru',
	fontSize: {
		options: [
			8, 10, 12, 14, 'default', 18, 20, 24, 28
		]
	}
};
