import {
	LexicalEditor,
	$getRoot,
	$createParagraphNode,
} from 'lexical';
import {
	$convertToMarkdownString,
	$convertFromMarkdownString,
	TRANSFORMERS,
	type Transformer,
} from '@lexical/markdown';
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import { BaseExtensionConfig } from '@lexkit/editor/extensions/types';

/**
 * Minimal shape for a Markdown transformer (Lexical markdown plugin style)
 */
export type MarkdownTransformer = Transformer;

export type MarkdownConfig = BaseExtensionConfig & {
	/** Optional debounce (ms) when importing markdown programmatically */
	importDebounce?: number;
	/** Pre-registered custom transformers */
	transformers?: Transformer[];
	/** Alias for transformers (backward compatibility) */
	customTransformers?: Transformer[];
};

export type MarkdownCommands = {
	exportToMarkdown: () => string;
	importFromMarkdown: (markdown: string, opts?: { immediate?: boolean; preventFocus?: boolean }) => Promise<void>;
	registerMarkdownTransformer: (transformer: Transformer) => void;
};

export type MarkdownStateQueries = {};

class MarkdownManager {
	private editor: LexicalEditor;
	private extraTransformers: Transformer[] = [];

	constructor(editor: LexicalEditor, seed: Transformer[] = []) {
		this.editor = editor;
		this.extraTransformers = [...seed];
	}

	registerTransformer(transformer: Transformer) {
		if (!this.extraTransformers.includes(transformer)) {
			this.extraTransformers.push(transformer);
		}
	}

	private getAllTransformers(): Transformer[] {
		// Order: extras first (to override core), then core
		return [...this.extraTransformers, ...TRANSFORMERS];
	}

	export(): string {
		return this.editor.getEditorState().read(() => {
			return $convertToMarkdownString(this.getAllTransformers());
		});
	}

	import(markdown: string, onComplete?: () => void, preventFocus?: boolean) {
		this.editor.update(
			() => {
				const root = $getRoot();
				root.clear();
				const content = markdown ?? '';
				if (!content.trim()) {
					root.append($createParagraphNode());
					return;
				}
				$convertFromMarkdownString(content, this.getAllTransformers());
				if (!preventFocus) {
					$getRoot().selectEnd(); // Reset selection to avoid stale references
				}
			},
			{ discrete: true, onUpdate: onComplete },
		);
	}
}

export class MarkdownExtension extends BaseExtension<
	'markdown',
	MarkdownConfig,
	MarkdownCommands,
	MarkdownStateQueries,
	[]
> {
	private manager: MarkdownManager | null = null;
	private pendingTransformers: Transformer[] = [];
	private importTimer: any = null;

	constructor() {
		super('markdown', [ExtensionCategory.Toolbar]);
		this.config = { importDebounce: 120, transformers: [] };
	}

	configure(config: Partial<MarkdownConfig>): this {
		this.config = { ...this.config, ...config };
		
		// Support both 'transformers' and 'customTransformers' for backward compatibility
		const transformersToAdd = config.transformers || config.customTransformers || [];
		
		// If manager already exists, push new seed transformers now
		if (this.manager && transformersToAdd.length) {
			transformersToAdd.forEach(t => this.manager?.registerTransformer(t));
		} else if (transformersToAdd.length) {
			this.pendingTransformers.push(...transformersToAdd);
		}
		return this;
	}

	/** Allow other extensions to imperatively register transformers before or after we register with the editor */
	registerTransformer = (transformer: Transformer) => {
		if (this.manager) {
			this.manager.registerTransformer(transformer);
		} else {
			this.pendingTransformers.push(transformer);
		}
	};

	register(editor: LexicalEditor): () => void {
		const configTransformers = this.config.transformers || this.config.customTransformers || [];
		this.manager = new MarkdownManager(editor, [
			...configTransformers,
			...this.pendingTransformers,
		]);
		// Clear pending once consumed
		this.pendingTransformers = [];
		return () => {
			this.manager = null;
		};
	}

	getCommands(editor: LexicalEditor): MarkdownCommands {
		return {
			exportToMarkdown: () => {
				if (!this.manager) return '';
				try {
					return this.manager.export();
				} catch (e) {
					console.error('[MarkdownExtension] export failed', e);
					return '';
				}
			},
			importFromMarkdown: (markdown: string, opts?: { immediate?: boolean; preventFocus?: boolean }) => {
				return new Promise((resolve) => {
					if (!this.manager) {
						resolve();
						return;
					}
					const { immediate, preventFocus } = opts || {};
					const delay = immediate ? 0 : this.config.importDebounce || 0;
					if (this.importTimer) clearTimeout(this.importTimer);
					const run = () => {
						this.manager?.import(markdown, () => {
							resolve();
						}, preventFocus);
					};
					if (delay > 0) {
						this.importTimer = setTimeout(run, delay);
					} else {
						run();
					}
				});
			},
			registerMarkdownTransformer: (transformer: Transformer) => {
				this.registerTransformer(transformer);
			},
		};
	}

	getStateQueries(editor: LexicalEditor): MarkdownStateQueries {
		return {};
	}
}

export const markdownExtension = new MarkdownExtension();