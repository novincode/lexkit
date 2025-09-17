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
// We wrap the core Transformer type so external extensions can pass partials without
// fighting strict typing; we normalize later.
export type MarkdownTransformer = Partial<Transformer> & { type: string };

export type MarkdownConfig = BaseExtensionConfig & {
	/** Optional debounce (ms) when importing markdown programmatically */
	importDebounce?: number;
	/** Pre-registered custom transformers */
	transformers?: MarkdownTransformer[];
};

export type MarkdownCommands = {
	exportToMarkdown: () => string;
	importFromMarkdown: (markdown: string, opts?: { immediate?: boolean }) => Promise<void>;
	/** Register a transformer at runtime (extensions can call this) */
	registerMarkdownTransformer: (transformer: MarkdownTransformer) => void;
};

export type MarkdownStateQueries = {};

class MarkdownManager {
	private editor: LexicalEditor;
	private extraTransformers: Transformer[] = [];

	constructor(editor: LexicalEditor, seed: MarkdownTransformer[] = []) {
		this.editor = editor;
		this.extraTransformers = seed.map(t => ({
			// @ts-ignore allow partial
			...t,
			dependencies: (t as any).dependencies || [],
			type: t.type as any,
		}) as Transformer);
	}

	registerTransformer(transformer: MarkdownTransformer) {
		// Normalize into a proper Transformer object (fallbacks to avoid undefined fields)
		const normalized: Transformer = {
			// @ts-ignore allow spread of partial
			...transformer,
			dependencies: (transformer as any).dependencies || [],
			type: transformer.type as any,
		} as Transformer;
		if (!this.extraTransformers.includes(normalized)) {
			this.extraTransformers.push(normalized);
		}
	}

	private getAllTransformers(): Transformer[] {
		// Order: extras first (to override core), then core
		return [...this.extraTransformers, ...TRANSFORMERS];
	}

	export(): string {
		return this.editor.getEditorState().read(() => {
			const root = $getRoot();
			const children = root.getChildren();
			return $convertToMarkdownString(this.getAllTransformers());
		});
	}

	import(markdown: string, onComplete?: () => void) {
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
				$getRoot().selectEnd(); // Reset selection to avoid stale references
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
	private pendingTransformers: MarkdownTransformer[] = [];
	private importTimer: any = null;

	constructor() {
		super('markdown', [ExtensionCategory.Toolbar]);
		this.config = { importDebounce: 120, transformers: [] };
	}

	configure(config: Partial<MarkdownConfig>): this {
		this.config = { ...this.config, ...config };
		// If manager already exists, push new seed transformers now
		if (this.manager && config.transformers?.length) {
			config.transformers.forEach(t => this.manager?.registerTransformer(t));
		} else if (config.transformers?.length) {
			this.pendingTransformers.push(...config.transformers);
		}
		return this;
	}

	/** Allow other extensions to imperatively register transformers before or after we register with the editor */
	registerTransformer = (transformer: MarkdownTransformer) => {
		if (this.manager) {
			this.manager.registerTransformer(transformer);
		} else {
			this.pendingTransformers.push(transformer);
		}
	};

	register(editor: LexicalEditor): () => void {
		this.manager = new MarkdownManager(editor, [
			...(this.config.transformers || []),
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
			importFromMarkdown: (markdown: string, opts?: { immediate?: boolean }) => {
				return new Promise((resolve) => {
					if (!this.manager) {
						resolve();
						return;
					}
					const { immediate } = opts || {};
					const delay = immediate ? 0 : this.config.importDebounce || 0;
					if (this.importTimer) clearTimeout(this.importTimer);
					const run = () => {
						this.manager?.import(markdown, () => {
							resolve();
						});
					};
					if (delay > 0) {
						this.importTimer = setTimeout(run, delay);
					} else {
						run();
					}
				});
			},
			registerMarkdownTransformer: (transformer: MarkdownTransformer) => {
				this.registerTransformer(transformer);
			},
		};
	}

	getStateQueries(editor: LexicalEditor): MarkdownStateQueries {
		return {};
	}
}

export const markdownExtension = new MarkdownExtension();