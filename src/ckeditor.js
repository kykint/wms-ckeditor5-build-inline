import {InlineEditor as InlineEditorBase} from '@ckeditor/ckeditor5-editor-inline';
import {Essentials} from '@ckeditor/ckeditor5-essentials';
import {Autoformat} from '@ckeditor/ckeditor5-autoformat';
import {Bold, Italic, Subscript, Superscript, Underline} from '@ckeditor/ckeditor5-basic-styles';
import {HorizontalLine} from '@ckeditor/ckeditor5-horizontal-line';
import {Alignment} from '@ckeditor/ckeditor5-alignment';
import {PageBreak} from '@ckeditor/ckeditor5-page-break';
import {SpecialCharacters, SpecialCharactersEssentials} from '@ckeditor/ckeditor5-special-characters';
import {FontColor, FontSize} from '@ckeditor/ckeditor5-font';
import {Plugin} from '@ckeditor/ckeditor5-core';
import {Collection} from '@ckeditor/ckeditor5-utils';
import {ViewModel, addListToDropdown, createDropdown} from '@ckeditor/ckeditor5-ui';
import {AutoLink, Link} from '@ckeditor/ckeditor5-link';
import {Heading} from '@ckeditor/ckeditor5-heading';
import {Indent, IndentBlock} from '@ckeditor/ckeditor5-indent';
import imageIcon from './archive.svg';
import HyphensFactory from 'hyphens/Resources/Private/Scripts/HyphensEditor/src/plugins/hyphens';

const INSERT_TEMPLATE_TITLE = 'Insert template';

function HyphensPlugin(editor) {
	editor.keystrokes.set('CTRL+SHIFT+Space', 'insertNbspEntity');
	editor.keystrokes.set('CTRL+Space', 'insertNbspEntity');
	editor.keystrokes.set('CTRL+SHIFT+ALT+Space', 'insertShyEntity');
	editor.keystrokes.set('CTRL+ALT+Space', 'insertShyEntity');
}

class TemplatesDropdown extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('templateDropdown', locale => {
			const dropdownView = createDropdown(locale);
			dropdownView.buttonView.set({
				label: locale.t(INSERT_TEMPLATE_TITLE),
				icon: imageIcon,
				tooltip: true
			});
			const items = new Collection();

			const values = editor.config.get('templateDropdownValues');
			if (values) {
				for (const value of values) {
					items.add({
						type: 'button',
						model: new ViewModel({
							withText: true,
							label: value.name,
							pasteText: value.text
						})
					});
				}
			}
			dropdownView.on('execute', function (data) {
				const viewFragment = editor.data.processor.toView(data.source.pasteText);
				const modelFragment = editor.data.toModel(viewFragment);
				editor.model.insertContent(modelFragment, editor.model.document.selection);
			});

			addListToDropdown(dropdownView, items);
			return dropdownView;
		});
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

		conversion.for('upcast').attributeToAttribute({
			view: {
				styles: {
					[marginProperty]: /[\s\S]+/
				}
			},
			model: {
				key: 'blockIndent',
				value: viewElement => viewElement.getStyle(marginProperty)
			}
		});

		conversion.for('downcast').attributeToAttribute({
			model: 'blockIndent',
			view: modelAttributeValue => {
				return {
					key: 'style',
					value: {
						[marginProperty]: modelAttributeValue
					}
				};
			}
		});
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
	FontColor,
	Essentials,
	// Paragraph,
	TemplatesDropdown,
	FontSize,
	Heading,
	HyphensFactory({}),
	HyphensPlugin
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
			'fontColor',
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
	licenseKey: 'GPL',
	fontSize: {
		options: [
			8, 10, 12, 14, 'default', 18, 20, 24, 28
		]
	}
};

const t = window.CKEDITOR_TRANSLATIONS = window.CKEDITOR_TRANSLATIONS || {};
t.ru = t.ru || {dictionary: {}};
t.en = t.en || {dictionary: {}};
t.lt = t.lt || {dictionary: {}};
t.ru.dictionary[INSERT_TEMPLATE_TITLE] = 'Вставить шаблон';
t.en.dictionary[INSERT_TEMPLATE_TITLE] = 'Insert template';
t.lt.dictionary[INSERT_TEMPLATE_TITLE] = 'Įterpti šabloną';
