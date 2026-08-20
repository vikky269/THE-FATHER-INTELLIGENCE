import Image from "next/image";

/**
 * Hero visual.
 *
 * The artwork is 2.1:1, so the container matches that ratio — a square box
 * left the source rectangle visible as hard edges against the page. The PNG
 * carries a feathered alpha channel so it dissolves into the background
 * instead of ending at a border; the halo behind it does the rest.
 */
export default function HeroVisual() {
  return (
    <div className="relative aspect-[2.1/1] w-full">
      <div className="globe-halo" aria-hidden />

      <img src="/globe-network.png"  className="h-[90vh]"   />
    </div>
  );
}
