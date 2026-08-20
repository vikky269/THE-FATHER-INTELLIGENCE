/**
 * Hero visual: a wireframe globe with a connection lattice.
 *
 * Built as inline SVG rather than the mockup's raster image so it scales to
 * any viewport, follows the light/dark palette, and needs no asset. Node
 * positions are fixed (not random) so server and client render identically.
 */

const NODES: { x: number; y: number; r: number }[] = [
  { x: 148, y: 118, r: 3.2 },
  { x: 205, y: 92, r: 2.4 },
  { x: 262, y: 140, r: 3.6 },
  { x: 118, y: 196, r: 2.6 },
  { x: 196, y: 178, r: 4.2 },
  { x: 276, y: 224, r: 2.8 },
  { x: 152, y: 268, r: 3.4 },
  { x: 228, y: 292, r: 2.4 },
  { x: 300, y: 186, r: 2.2 },
  { x: 96, y: 148, r: 2.2 },
];

const ARCS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 4],
  [4, 2],
  [3, 4],
  [4, 5],
  [3, 6],
  [6, 7],
  [7, 5],
  [2, 8],
  [8, 5],
  [9, 0],
  [9, 3],
  [4, 6],
];

export default function GlobeNetwork() {
  const cx = 200;
  const cy = 200;
  const r = 150;

  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full"
      role="img"
      aria-label="Stylised globe showing a network of connected global markets"
    >
      <defs>
        <radialGradient id="globe-core" cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.20" />
          <stop offset="55%" stopColor="var(--royal)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.16" />
        </radialGradient>

        <linearGradient id="arc-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--royal)" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r + 34} fill="url(#globe-glow)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#globe-core)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--gold)" strokeOpacity="0.45" />

      {/* Latitudes — ellipses flattened toward the poles */}
      {[-0.78, -0.42, 0, 0.42, 0.78].map((t) => (
        <ellipse
          key={`lat-${t}`}
          cx={cx}
          cy={cy + t * r}
          rx={r * Math.sqrt(Math.max(0, 1 - t * t))}
          ry={r * 0.09 * Math.sqrt(Math.max(0.08, 1 - t * t))}
          fill="none"
          stroke="var(--gold)"
          strokeOpacity="0.2"
        />
      ))}

      {/* Longitudes */}
      {[0.22, 0.52, 0.82, 1].map((k) => (
        <ellipse
          key={`lon-${k}`}
          cx={cx}
          cy={cy}
          rx={r * k}
          ry={r}
          fill="none"
          stroke="var(--gold)"
          strokeOpacity="0.16"
        />
      ))}

      {/* Connection lattice */}
      <g stroke="url(#arc-line)" fill="none" strokeWidth="1">
        {ARCS.map(([a, b], i) => {
          const p = NODES[a];
          const q = NODES[b];
          // Bow each link outward from the centre so it reads as a sphere.
          const mx = (p.x + q.x) / 2;
          const my = (p.y + q.y) / 2;
          const bow = 0.22;
          const ctrlX = mx + (mx - cx) * bow;
          const ctrlY = my + (my - cy) * bow;
          return (
            <path
              key={i}
              d={`M ${p.x} ${p.y} Q ${ctrlX} ${ctrlY} ${q.x} ${q.y}`}
              strokeOpacity={0.5}
              style={{
                animation: `arc-pulse 4s ease-in-out ${(i % 7) * 0.35}s infinite`,
              }}
            />
          );
        })}
      </g>

      {/* Nodes */}
      {NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r * 2.6} fill="var(--gold)" fillOpacity="0.12" />
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill="var(--gold-hi)"
            style={{ animation: `node-pulse 3.2s ease-in-out ${(i % 5) * 0.4}s infinite` }}
          />
        </g>
      ))}
    </svg>
  );
}