/**
 * Dialogue Tree System — Branching NPC conversations with conditions, effects,
 * and a DOM renderer.
 *
 * Nodes hold a speaker line and branching options. Options can be gated by
 * conditions (flags, inventory, quests, level) and produce effects (set flags,
 * give/remove items, start/complete quests) when chosen.
 *
 * @example
 * ```ts
 * import {
 *   createDialogueTree,
 *   createDialogueState,
 *   getAvailableOptions,
 *   applyEffects,
 *   createDialogueRenderer,
 * } from './dialogue';
 *
 * // Build a tree from config
 * const tree = createDialogueTree({
 *   id: 'guard_intro',
 *   name: 'Guard Introduction',
 *   startNodeId: 'greet',
 *   nodes: [
 *     {
 *       id: 'greet',
 *       speaker: 'Guard',
 *       text: 'Halt! Who goes there?',
 *       options: [
 *         {
 *           text: 'I am a traveler.',
 *           nextNode: 'traveler',
 *           effects: [{ type: 'setFlag', value: 'met_guard' }],
 *         },
 *         {
 *           text: '[Bribe] Here, take 50 gold.',
 *           nextNode: 'bribe',
 *           conditions: [{ type: 'hasItem', value: 'gold_pouch' }],
 *           effects: [
 *             { type: 'removeItem', value: 'gold_pouch' },
 *             { type: 'setFlag', value: 'guard_bribed' },
 *           ],
 *         },
 *       ],
 *     },
 *     {
 *       id: 'traveler',
 *       speaker: 'Guard',
 *       text: 'A traveler, eh? Pass through.',
 *       options: [],
 *     },
 *     {
 *       id: 'bribe',
 *       speaker: 'Guard',
 *       text: 'Pleasure doing business. Move along.',
 *       options: [],
 *     },
 *   ],
 * });
 *
 * // Create state and check options
 * let state = createDialogueState('greet');
 * const available = getAvailableOptions(tree, state);
 * // available will only include 'I am a traveler.' if the player lacks gold_pouch
 *
 * // Apply effects after a choice
 * state = applyEffects(state, available[0].effects ?? []);
 *
 * // Render to DOM
 * const renderer = createDialogueRenderer({ typewriterSpeed: 30 });
 * renderer.show(tree, state, (option) => {
 *   state = applyEffects(state, option.effects ?? []);
 *   // navigate to option.nextNode...
 * });
 * ```
 *
 * @module game-assets/dialogue
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A condition that gates a dialogue option. */
export interface Condition {
  /** Condition type. */
  type: 'hasItem' | 'questComplete' | 'level' | 'flag';
  /** Expected value — string for items/flags/quests, number for level. */
  value: string | number;
}

/** An effect produced when a dialogue option is chosen. */
export interface Effect {
  /** Effect type. */
  type: 'setFlag' | 'giveItem' | 'removeItem' | 'startQuest' | 'completeQuest';
  /** The flag name, item id, or quest id. */
  value: string;
}

/** A single player choice within a dialogue node. */
export interface DialogueOption {
  /** Unique option id (auto-generated if not provided in config). */
  id: string;
  /** Display text for the player. */
  text: string;
  /** Node to navigate to when this option is chosen. */
  nextNode?: string;
  /** Conditions that must be satisfied for this option to appear. */
  conditions?: Condition[];
  /** Effects applied when this option is chosen. */
  effects?: Effect[];
}

/** A single node in the dialogue tree. */
export interface DialogueNode {
  /** Unique node id. */
  id: string;
  /** Speaker name displayed above the text. */
  speaker: string;
  /** The dialogue text shown to the player. */
  text: string;
  /** Available player options (empty array = end of branch). */
  options: DialogueOption[];
  /** Optional portrait image URL. */
  portrait?: string;
}

/** A complete dialogue tree. */
export interface DialogueTree {
  /** Unique tree id. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** All nodes keyed by id. */
  nodes: Map<string, DialogueNode>;
  /** The node id where conversation begins. */
  startNodeId: string;
}

/** Mutable dialogue state tracking the player's position and world flags. */
export interface DialogueState {
  /** Id of the currently displayed node. */
  currentNodeId: string;
  /** Flags set during conversation (e.g. met_guard, accepted_quest). */
  flags: Set<string>;
  /** Items the player has (used by hasItem / giveItem / removeItem). */
  inventory: string[];
  /** Quest ids the player has completed. */
  completedQuests: string[];
}

// ---------------------------------------------------------------------------
// Config types (input to createDialogueTree)
// ---------------------------------------------------------------------------

/** Config for a single dialogue option. */
export interface DialogueOptionConfig {
  /** Display text for the player. */
  text: string;
  /** Node to navigate to when chosen. */
  nextNode?: string;
  /** Conditions gating this option. */
  conditions?: Condition[];
  /** Effects produced when chosen. */
  effects?: Effect[];
}

/** Config for a single dialogue node. */
export interface DialogueNodeConfig {
  /** Unique node id. */
  id: string;
  /** Speaker name. */
  speaker: string;
  /** Dialogue text. */
  text: string;
  /** Player options. */
  options: DialogueOptionConfig[];
  /** Optional portrait image URL. */
  portrait?: string;
}

/** Top-level config for building a DialogueTree. */
export interface DialogueTreeConfig {
  /** Unique tree id. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Node configs. */
  nodes: DialogueNodeConfig[];
  /** Starting node id. */
  startNodeId: string;
}

// ---------------------------------------------------------------------------
// Renderer types
// ---------------------------------------------------------------------------

/** Configuration for the DOM dialogue renderer. */
export interface DialogueRendererConfig {
  /** Parent element to append the renderer to (defaults to document.body). */
  parentElement?: HTMLElement;
  /** CSS class name applied to the root container. */
  className?: string;
  /** Typewriter reveal speed in ms per character (default 40). */
  typewriterSpeed?: number;
}

/** Handle to a mounted dialogue renderer. */
export interface DialogueRenderer {
  /**
   * Display a dialogue node from the given tree.
   * @param dialogue - The dialogue tree.
   * @param state - Current dialogue state (determines visible options).
   * @param onChoice - Callback fired when the player selects an option.
   */
  show(
    dialogue: DialogueTree,
    state: DialogueState,
    onChoice: (option: DialogueOption) => void,
  ): void;
  /** Hide the dialogue UI. */
  hide(): void;
  /** Returns whether the renderer is currently visible. */
  isVisible(): boolean;
  /** Remove the renderer from the DOM and clean up. */
  dispose(): void;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

let _optionIdCounter = 0;

/** Generate a unique option id. */
function nextOptionId(): string {
  return `opt_${++_optionIdCounter}`;
}

/**
 * Evaluate a single condition against a dialogue state.
 * Returns `true` when the condition is met.
 */
function evaluateCondition(condition: Condition, state: DialogueState): boolean {
  switch (condition.type) {
    case 'flag':
      return state.flags.has(condition.value as string);
    case 'hasItem':
      return state.inventory.includes(condition.value as string);
    case 'questComplete':
      return state.completedQuests.includes(condition.value as string);
    case 'level':
      return false; // level must be provided externally — base system has no
                     // concept of "player level". Override via a wrapper.
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build a {@link DialogueTree} from a config object.
 *
 * Validates that every `nextNode` reference points to an existing node and that
 * `startNodeId` exists.
 *
 * @throws {Error} If a node references a non-existent `nextNode` or `startNodeId`.
 */
export function createDialogueTree(config: DialogueTreeConfig): DialogueTree {
  const nodes = new Map<string, DialogueNode>();

  // Build nodes and assign unique option ids
  for (const nc of config.nodes) {
    if (nodes.has(nc.id)) {
      throw new Error(`Duplicate node id: "${nc.id}"`);
    }
    const options: DialogueOption[] = nc.options.map((oc) => ({
      id: nextOptionId(),
      text: oc.text,
      nextNode: oc.nextNode,
      conditions: oc.conditions,
      effects: oc.effects,
    }));
    nodes.set(nc.id, {
      id: nc.id,
      speaker: nc.speaker,
      text: nc.text,
      options,
      portrait: nc.portrait,
    });
  }

  // Validate start node exists
  if (!nodes.has(config.startNodeId)) {
    throw new Error(
      `startNodeId "${config.startNodeId}" does not reference an existing node`,
    );
  }

  // Validate all nextNode references
  for (const node of nodes.values()) {
    for (const opt of node.options) {
      if (opt.nextNode !== undefined && !nodes.has(opt.nextNode)) {
        throw new Error(
          `Node "${node.id}" option "${opt.id}" references non-existent node "${opt.nextNode}"`,
        );
      }
    }
  }

  return {
    id: config.id,
    name: config.name,
    nodes,
    startNodeId: config.startNodeId,
  };
}

/**
 * Get the options available to the player at the current node.
 *
 * Filters the current node's options by evaluating each option's conditions
 * against the provided state.
 *
 * @param tree - The dialogue tree.
 * @param state - Current dialogue state.
 * @returns Array of options the player can select (may be empty).
 */
export function getAvailableOptions(
  tree: DialogueTree,
  state: DialogueState,
): DialogueOption[] {
  const node = tree.nodes.get(state.currentNodeId);
  if (!node) return [];

  if (!node.options || node.options.length === 0) return [];

  return node.options.filter((opt) => {
    if (!opt.conditions || opt.conditions.length === 0) return true;
    return opt.conditions.every((c) => evaluateCondition(c, state));
  });
}

/**
 * Apply a list of effects to a dialogue state, returning a **new** state.
 *
 * State is immutable — the original is not modified.
 *
 * @param state - Current dialogue state.
 * @param effects - Effects to apply.
 * @returns A new DialogueState with the effects applied.
 */
export function applyEffects(state: DialogueState, effects: Effect[]): DialogueState {
  const next: DialogueState = {
    currentNodeId: state.currentNodeId,
    flags: new Set(state.flags),
    inventory: [...state.inventory],
    completedQuests: [...state.completedQuests],
  };

  for (const fx of effects) {
    switch (fx.type) {
      case 'setFlag':
        next.flags.add(fx.value);
        break;
      case 'giveItem':
        if (!next.inventory.includes(fx.value)) {
          next.inventory.push(fx.value);
        }
        break;
      case 'removeItem':
        next.inventory = next.inventory.filter((i) => i !== fx.value);
        break;
      case 'startQuest':
        // startQuest is a marker; quest completion is tracked separately.
        next.flags.add(`quest_started:${fx.value}`);
        break;
      case 'completeQuest':
        if (!next.completedQuests.includes(fx.value)) {
          next.completedQuests.push(fx.value);
        }
        break;
    }
  }

  return next;
}

/**
 * Create an initial dialogue state at the given start node.
 *
 * @param startNodeId - The node id where conversation begins.
 * @returns A fresh DialogueState with empty flags, inventory, and quests.
 */
export function createDialogueState(startNodeId: string): DialogueState {
  return {
    currentNodeId: startNodeId,
    flags: new Set<string>(),
    inventory: [],
    completedQuests: [],
  };
}

// ---------------------------------------------------------------------------
// DOM Renderer
// ---------------------------------------------------------------------------

/**
 * Create a DOM-based dialogue renderer with dark theme styling matching the
 * game's Tooltip component.
 *
 * @param config - Optional renderer configuration.
 * @returns A DialogueRenderer handle.
 *
 * @example
 * ```ts
 * const renderer = createDialogueRenderer({
 *   parentElement: document.getElementById('game-ui')!,
 *   typewriterSpeed: 25,
 * });
 *
 * renderer.show(tree, state, (option) => {
 *   state = applyEffects(state, option.effects ?? []);
 *   state.currentNodeId = option.nextNode ?? state.currentNodeId;
 *   renderer.show(tree, state, onChoice);
 * });
 * ```
 */
export function createDialogueRenderer(
  config?: DialogueRendererConfig,
): DialogueRenderer {
  const parent = config?.parentElement ?? document.body;
  const speed = config?.typewriterSpeed ?? 40;

  // -- Root container -------------------------------------------------------
  const root = document.createElement('div');
  root.setAttribute('data-dialogue', '');
  Object.assign(root.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(640px, 92vw)',
    maxWidth: '640px',
    padding: '0',
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid #16a34a',
    boxShadow:
      '0 4px 24px rgba(0,0,0,0.6), 0 0 16px rgba(22,163,74,0.15)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#e2e8f0',
    fontSize: '14px',
    fontFamily: 'system-ui, sans-serif',
    lineHeight: '1.6',
    zIndex: '10000',
    display: 'none',
    opacity: '0',
    transition: 'opacity 0.2s ease-out',
    boxSizing: 'border-box',
  });
  if (config?.className) {
    root.className = config.className;
  }

  // -- Speaker bar ----------------------------------------------------------
  const speakerBar = document.createElement('div');
  Object.assign(speakerBar.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px 0 16px',
  });

  const portraitEl = document.createElement('div');
  Object.assign(portraitEl.style, {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'rgba(22, 163, 74, 0.15)',
    border: '1px solid rgba(22, 163, 74, 0.4)',
    display: 'none',
    overflow: 'hidden',
    flexShrink: '0',
  });

  const portraitImg = document.createElement('img');
  Object.assign(portraitImg.style, {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  });
  portraitEl.appendChild(portraitImg);

  const speakerName = document.createElement('div');
  Object.assign(speakerName.style, {
    fontWeight: '700',
    fontSize: '15px',
    color: '#facc15',
  });

  speakerBar.appendChild(portraitEl);
  speakerBar.appendChild(speakerName);

  // -- Text area ------------------------------------------------------------
  const textEl = document.createElement('div');
  Object.assign(textEl.style, {
    padding: '8px 16px 12px 16px',
    color: '#e2e8f0',
    minHeight: '1.6em',
  });

  // -- Options container ----------------------------------------------------
  const optionsEl = document.createElement('div');
  Object.assign(optionsEl.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '0 16px 14px 16px',
  });

  root.appendChild(speakerBar);
  root.appendChild(textEl);
  root.appendChild(optionsEl);
  parent.appendChild(root);

  // -- Internal state -------------------------------------------------------
  let visible = false;
  let typewriterTimer: ReturnType<typeof setInterval> | null = null;
  let currentTree: DialogueTree | null = null;
  let currentState: DialogueState | null = null;
  let currentOnChoice: ((option: DialogueOption) => void) | null = null;

  /** Cancel an in-progress typewriter animation. */
  function cancelTypewriter(): void {
    if (typewriterTimer !== null) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }
  }

  /**
   * Start the typewriter animation for `text` into `target`, then invoke
   * `onComplete` when finished.
   */
  function typewrite(
    target: HTMLElement,
    text: string,
    onComplete: () => void,
  ): void {
    cancelTypewriter();
    target.textContent = '';
    let i = 0;
    typewriterTimer = setInterval(() => {
      if (i < text.length) {
        target.textContent += text[i];
        i++;
      } else {
        cancelTypewriter();
        onComplete();
      }
    }, speed);
  }

  /** Render options for the current node into the options container. */
  function renderOptions(): void {
    // Clear existing buttons
    while (optionsEl.firstChild) {
      optionsEl.removeChild(optionsEl.firstChild);
    }

    if (!currentTree || !currentState || !currentOnChoice) return;

    const options = getAvailableOptions(currentTree, currentState);
    if (options.length === 0) return;

    for (const opt of options) {
      const btn = document.createElement('button');
      btn.textContent = opt.text;
      Object.assign(btn.style, {
        display: 'block',
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid rgba(22, 163, 74, 0.4)',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        color: '#e2e8f0',
        fontSize: '13px',
        fontFamily: 'inherit',
        lineHeight: '1.5',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = 'rgba(22, 163, 74, 0.25)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'rgba(22, 163, 74, 0.1)';
      });
      btn.addEventListener('click', () => {
        const cb = currentOnChoice;
        if (cb) cb(opt);
      });

      optionsEl.appendChild(btn);
    }
  }

  // -- Public renderer API --------------------------------------------------
  return {
    show(
      dialogue: DialogueTree,
      state: DialogueState,
      onChoice: (option: DialogueOption) => void,
    ): void {
      cancelTypewriter();

      currentTree = dialogue;
      currentState = state;
      currentOnChoice = onChoice;

      const node = dialogue.nodes.get(state.currentNodeId);
      if (!node) {
        // Unknown node — hide instead of crashing
        this.hide();
        return;
      }

      // Speaker name
      speakerName.textContent = node.speaker;

      // Portrait
      if (node.portrait) {
        portraitImg.src = node.portrait;
        portraitEl.style.display = 'block';
      } else {
        portraitEl.style.display = 'none';
      }

      // Typewrite text, then reveal options
      typewrite(textEl, node.text, () => {
        renderOptions();
      });

      // Show with fade
      root.style.display = 'block';
      requestAnimationFrame(() => {
        root.style.opacity = '1';
      });
      visible = true;
    },

    hide(): void {
      cancelTypewriter();
      root.style.opacity = '0';
      setTimeout(() => {
        root.style.display = 'none';
      }, 200);
      visible = false;
    },

    isVisible(): boolean {
      return visible;
    },

    dispose(): void {
      cancelTypewriter();
      root.parentElement?.removeChild(root);
    },
  };
}
