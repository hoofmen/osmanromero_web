# osmanromero.com

> My resume, but you have to rocket-jump to read it.

A Quake 3 defrag-inspired 3D first-person experience built as a personal portfolio site. Spawn into a dark crimson arena, strafe-jump and rocket-jump your way through the map, shoot 5 bullseye targets to reveal bio sections. No enemies — just movement, music, and an unconventional way to present who I am.

## Stack

| | |
|---|---|
| React 18 + TypeScript | UI, HUD, menus |
| Three.js via @react-three/fiber | 3D rendering |
| @react-three/rapier (Rapier WASM) | Physics, capsule-collider FPS controller |
| Zustand | Game state, weapon state, settings |
| Vite | Build |
| Vercel | Deploy |

## Running locally

```bash
npm install
npm run dev
```

## Controls

**Desktop** — WASD to move, mouse to look, left-click to fire, right-click to jump, Space to zoom, Q/E to switch weapons, ESC to pause.

**Mobile** — left joystick to move, right joystick to look, FIRE / JUMP / SWAP buttons on the right. Landscape mode required.

## Features

- Quake-style strafe-jumping and bunny-hopping
- Two weapons: Railgun (hitscan) and Rocket Launcher (projectile + rocket-jump)
- 5 wall-mounted bullseye targets, each revealing a bio section when shot
- Procedural FBM nebula skybox
- Brightness settings (dark / dim / bright), skybox and particle toggles
- Full mobile support with virtual touch controls
- Background music: *Dragged Through Hellfire* by Zander Noriega (CC-BY 3.0)
