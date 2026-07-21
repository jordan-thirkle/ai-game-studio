import { describe, it, expect } from 'vitest';
import { createDialogueTree, getAvailableOptions, applyEffects, createDialogueState } from '../dialogue';

describe('Dialogue Tree', () => {
  const tree = createDialogueTree({
    id: 'test',
    name: 'Test',
    startNodeId: 'start',
    nodes: [
      { id: 'start', speaker: 'NPC', text: 'Hello!', options: [
        { text: 'Hi', nextNode: 'greet' },
        { text: 'Bye' }
      ]},
      { id: 'greet', speaker: 'NPC', text: 'Nice to meet you', options: [] }
    ]
  });
  it('creates tree with nodes', () => {
    expect(tree.nodes.size).toBe(2);
  });
  it('getAvailableOptions returns all options for empty state', () => {
    const state = createDialogueState('start');
    const opts = getAvailableOptions(tree, state);
    expect(opts.length).toBe(2);
  });
  it('applyEffects sets flags', () => {
    const state = createDialogueState('start');
    const newState = applyEffects(state, [{ type: 'setFlag', value: 'talked' }]);
    expect(newState.flags.has('talked')).toBe(true);
  });
});
