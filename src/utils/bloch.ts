/**
 * Orthographic projection of the unit (Bloch) sphere onto a 240x240 SVG.
 * Shared by the server-rendered figure and its client-side animation.
 */
type Vec = [number, number, number];

export const VIEW = { cx: 120, cy: 120, r: 84 };
/** Polar angle of the drawn qubit state (from |0⟩). */
export const THETA = (52 * Math.PI) / 180;

const elev = (18 * Math.PI) / 180; // camera height above the equator
const azim = (35 * Math.PI) / 180; // camera angle around the z-axis

const toViewer: Vec = [Math.cos(elev) * Math.cos(azim), Math.cos(elev) * Math.sin(azim), Math.sin(elev)];
const right: Vec = [-Math.sin(azim), Math.cos(azim), 0];
const up: Vec = [-Math.sin(elev) * Math.cos(azim), -Math.sin(elev) * Math.sin(azim), Math.cos(elev)];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const project = (p: Vec): [number, number] => [
  VIEW.cx + VIEW.r * dot(p, right),
  VIEW.cy - VIEW.r * dot(p, up),
];

const isFront = (p: Vec) => dot(p, toViewer) >= 0;
const fmt = ([x, y]: [number, number]) => `${x.toFixed(2)} ${y.toFixed(2)}`;

/**
 * Sample a closed curve on the sphere and split it into SVG path data for the
 * visible (front) and hidden (back) halves, so the back can be drawn dashed.
 */
export function sphereCurve(fn: (t: number) => Vec, samples = 120) {
  const paths = { front: "", back: "" };
  let prev: "front" | "back" | null = null;
  let last = "";
  for (let i = 0; i <= samples; i++) {
    const p = fn((i / samples) * 2 * Math.PI);
    const side = isFront(p) ? "front" : "back";
    const pt = fmt(project(p));
    paths[side] += prev === null ? `M${pt}` : side === prev ? `L${pt}` : `M${last}L${pt}`;
    prev = side;
    last = pt;
  }
  return paths;
}

/** Screen positions for the state vector at polar angle `theta` and azimuth `phi`. */
export function stateFrame(theta: number, phi: number) {
  const s = Math.sin(theta);
  const tip: Vec = [s * Math.cos(phi), s * Math.sin(phi), Math.cos(theta)];
  return {
    origin: project([0, 0, 0]),
    tip: project(tip),
    foot: project([tip[0], tip[1], 0]),
    front: isFront(tip),
  };
}
