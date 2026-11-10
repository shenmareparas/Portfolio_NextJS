---
name: web-haptics
description: Add haptic feedback to web apps using the web-haptics library. Use when building mobile-facing UIs that need tactile feedback on buttons, toggles, forms, pickers, and other interactive elements.
license: MIT
metadata:
  author: lochie
  version: "1.2"
---

Install `web-haptics` (`bun add web-haptics`) and add haptic feedback to the app following these rules:

## Package: web-haptics

Repository: https://github.com/lochie/web-haptics | License: MIT | Zero dependencies (installed: `0.0.6`)
Uses the Web Vibration API (`navigator.vibrate`) on supported Android/mobile browsers and falls back to an injected `<input switch>` toggle click on unsupported mobile platforms like iOS Safari. Silently no-ops on non-vibrating desktop hardware unless debug audio is enabled. No error handling or feature detection is required before triggering.

## Trigger Types & Presets

`WebHaptics.trigger(input?, options?)` and `useWebHaptics().trigger(input?, options?)` accept a preset string, custom pattern, `HapticPreset`, or duration in ms (omitting `input` defaults to a `"medium"` impact). Per-vibration durations are clamped at `1000ms` (`MAX_PHASE_MS`).

Notification (task outcomes):

- `"success"` -- form saved, payment confirmed, upload complete
- `"warning"` -- destructive action ahead, approaching limit, irreversible step
- `"error"` -- validation failure, network error, permission denied

Impact (physical collisions):

- `"light"` -- small toggle, subtle tap, minor interaction
- `"medium"` -- button press, card snap-to-position, drop into place
- `"heavy"` -- major state change, heavy element landed, force press
- `"soft"` -- cushioned feedback, gentle transition
- `"rigid"` -- crisp, firm mechanical response

Selection (discrete stepping):

- `"selection"` -- picker scroll, stepper increment, slider detent, segment switch

Specialty:

- `"nudge"` -- strong tap followed by a soft tap
- `"buzz"` -- sustained vibration alert (`1000ms`)

### Custom Patterns, Presets & Durations

You can pass `defaultPatterns.*`, custom pattern structures, or intensity overrides directly to `WebHaptics.trigger()` or `useWebHaptics().trigger()`:

```ts
import { WebHaptics, defaultPatterns } from "web-haptics";

const haptics = new WebHaptics();
haptics.trigger(defaultPatterns.light);
haptics.trigger(200); // single vibration duration (ms)
haptics.trigger([100, 50, 100]); // number[] alternating on/off durations
haptics.trigger([
  { duration: 80, intensity: 0.8 },
  { delay: 50, duration: 100 },
]); // Vibration[]
haptics.trigger({
  pattern: [{ duration: 50 }, { delay: 50, duration: 50 }],
}); // HapticPreset
haptics.trigger("success", { intensity: 0.8 }); // override default intensity (0.0 to 1.0; default 0.5)
```

## Complete API Surface

- `new WebHaptics(options?)`: Class instance accepting `WebHapticsOptions` (`{ debug?: boolean; showSwitch?: boolean }`).
- `WebHaptics.isSupported`: Static boolean (`true` when `navigator.vibrate` is available).
- `haptics.trigger(input?, options?)`: Trigger a preset, duration, `HapticPattern`, or `HapticPreset`. Returns `Promise<void>`.
- `haptics.cancel()`: Stop any active pattern and cancel vibration (`navigator.vibrate(0)`).
- `haptics.destroy()`: Stop patterns, remove injected DOM elements, and close `AudioContext` resources.
- `haptics.setDebug(debug: boolean)`: Enable or disable simulated audio click feedback for desktop testing.
- `haptics.setShowSwitch(show: boolean)`: Show or hide the fallback `<input switch>` debug control.
- `useWebHaptics(options?)` (`web-haptics/react`): Returns `{ trigger, cancel, isSupported }`, where `trigger` returns `Promise<void> | undefined`.
- Exported TypeScript types (`web-haptics`): `Vibration`, `HapticPattern`, `HapticPreset`, `HapticInput`, `TriggerOptions`, `WebHapticsOptions`, plus `defaultPatterns` and `version`.

## Framework Imports & Conventions

### Next.js (App Router) & React 19 (Portfolio Pattern)

In this project, always use the dedicated viewport-guarded hook `@/hooks/use-mobile-haptics` (`hooks/use-mobile-haptics.ts`) for standard components:

```tsx
"use client";

import { useMobileHaptics } from "@/hooks/use-mobile-haptics";

export function ActionButton() {
  const haptic = useMobileHaptics();

  return (
    <button
      onClick={() => {
        haptic.trigger("medium");
        // do action
      }}
    >
      Tap me
    </button>
  );
}
```

_Implementation notes:_

- `useMobileHaptics(webHapticsOptions?: WebHapticsOptions)` uses React 19's `useSyncExternalStore` on `(max-width: 768px)` (`getServerSnapshot` returns `false`) to avoid hydration mismatches and restrict haptic execution strictly to mobile viewports across all client routes (including `app/qr/qr-content.tsx`).
- In `hooks/use-mobile-haptics.ts`, `trigger(input?: HapticInput, options?: TriggerOptions)` forwards the full `useWebHaptics()` signature (presets, numeric ms, `number[]`, `Vibration[]`, `HapticPreset`, and `TriggerOptions`) and returns `Promise<void> | undefined`, alongside `cancel` and `isSupported`.

### Standard React

```tsx
import { useWebHaptics } from "web-haptics/react";

const haptic = useWebHaptics();

<button onClick={() => haptic.trigger()}>Tap me</button>;
```

### Vue

```vue
<script setup>
import { useWebHaptics } from "web-haptics/vue";
const haptic = useWebHaptics();
</script>

<template>
  <button @click="haptic.trigger()">Tap me</button>
</template>
```

### Svelte

```svelte
<script>
  import { createWebHaptics } from "web-haptics/svelte";
  import { onDestroy } from "svelte";
  const haptic = createWebHaptics();
  onDestroy(() => haptic.destroy());
</script>

<button on:click={() => haptic.trigger()}>Tap me</button>
```

### Vanilla JS

```js
import { WebHaptics } from "web-haptics";

const haptics = new WebHaptics();
haptics.trigger(); // medium impact
haptics.trigger("success");
```

### SSR & Client Boundaries

- Next.js: add `"use client"` to any component importing `useMobileHaptics()` or `useWebHaptics()`.
- Nuxt / SvelteKit: works directly; the library guards DOM/navigator access during SSR.

## Apple HIG Design Rules -- FOLLOW THESE

1. Haptics supplement, never replace. Always pair with visual feedback. UI must work fully without haptics.
2. Build causal relationships. The haptic must feel like a direct physical consequence of the user action.
3. Match intensity to significance. Light interactions = light/selection. Standard = medium/success. Major = heavy/error/warning.
4. Do not overuse. If every tap vibrates, nothing feels special. Reserve for meaningful moments only.
5. Synchronize perfectly. Fire haptic at the exact instant the visual change occurs.
6. Respect conventions. success=positive, error=negative, warning=cautionary, selection=discrete ticks only.
7. For async ops, trigger when the RESULT arrives, synced with the visual state change:
   ```js
   try {
     await submit();
     haptic.trigger("success");
   } catch {
     haptic.trigger("error");
   }
   ```

## Interaction to Type Quick Reference

Primary button tap = "medium" | Secondary button = "light"
Form success = "success" | Validation error = "error" | Network error = "error"
Toggle switch = "light" | Delete before confirm = "warning"
Picker/wheel = "selection" | Slider detents = "selection" | Tab switch = "selection"
Drag-drop snap = "medium" | Long press = "heavy" | Modal appear = "medium"
Pull-to-refresh threshold = "light" | Swipe dismiss threshold = "light"
Payment confirmed = "success"

## Anti-Patterns -- AVOID

- Haptic on every tap (fatigue)
- "error" for non-errors (breaks conventions)
- Haptic without visual feedback (some devices cannot vibrate)
- Haptic on page load or passive scroll (invasive)
- "heavy" for minor interactions (jarring)
- Long continuous vibrations (web haptics = brief transient pulses)

## Before implementing, confirm with the user:

- Which interactive elements to target
- Whether to add at shared component level or individual call sites
