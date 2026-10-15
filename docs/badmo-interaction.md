# BadMo interaction

- Default and nearby-pointer poses use row 0, cell 0. Other idle cells have isolated tail fragments, so automatic blinking is disabled until clean frames are supplied. The original sprite image is preserved.
- Drag the pet with mouse or touch. Motion over 6px starts dragging; pointer capture retains the gesture outside the button. Dragging cancels the current action. Release does not trigger dialogue or the global paw effect.
- Position is stored as viewport-relative coordinates in localStorage under `badmo-position-v1`. Resizing clamps it back into the viewport. Invalid/unavailable storage falls back to the default position.
- The reset button appears on hover/focus, and is always available on touch devices. It clears the saved position and restores the lower-right anchor.
- Keyboard: focus the pet and use arrow keys; Shift + arrow moves farther. Enter/Space retain click interaction.
- Bubble placement is independent of the pet anchor and switches sides near viewport edges.
- Motion logic: `components/BadMo/BadMo.tsx`; drag and position logic: `components/BadMo/usePetDrag.ts`; sequences: `components/BadMo/animations.ts`.
