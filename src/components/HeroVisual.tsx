// // import Image from "next/image";

// // /**
// //  * Hero visual.
// //  *
// //  * The artwork is ~1.9:1, so the container matches it — a square box left
// //  * the source rectangle visible as hard edges. The image carries a feathered
// //  * alpha channel, so it dissolves into the page rather than ending at a
// //  * border, and the halo behind it only has to add atmosphere.
// //  *
// //  * The aspect-[] class is load-bearing: `fill` positions the image against
// //  * its parent, so without a height here the container collapses to zero and
// //  * nothing renders.
// //  */
// // export default function HeroVisual() {
// //   return (
// //     <div className="relative aspect-[1.89/1] w-full">
// //       <div className="globe-halo" aria-hidden />

// //       <Image
// //         src="/globe-network.png"
// //         alt="Global macro intelligence network"
// //         fill
// //         priority
// //         sizes="(max-width: 1024px) 92vw, 48vw"
// //         className="object-contain h-[90vh]"
// //       />
// //     </div>
// //   );
// // }



// import Image from "next/image";

// /**
//  * Hero visual.
//  *
//  * The artwork is 2.1:1, so the container matches that ratio — a square box
//  * left the source rectangle visible as hard edges against the page. The PNG
//  * carries a feathered alpha channel so it dissolves into the background
//  * instead of ending at a border; the halo behind it does the rest.
//  */
// export default function HeroVisual() {
//   return (
//     <div className="relative aspect-[2.1/1] w-full">
//       <div className="globe-halo" aria-hidden />

//       <img src="/globe-network.png"  className="h-[90vh]"   />
//     </div>
//   );
// }




import Image from "next/image";

/**
 * Hero visual.
 *
 * The artwork is gold on near-black, so on the new white canvas it cannot
 * be left free-floating — its dark interior would read as a black blob.
 * It sits inside a `.stage` panel (dark midnight purple in BOTH themes),
 * the same treatment the design mockup gives its terminal widget.
 *
 * The aspect-[] class is load-bearing: `fill` positions the image against
 * its parent, so without a height here the container collapses to zero and
 * nothing renders.
 */
export default function HeroVisual() {
  return (
    <div className="stage aspect-[1.89/1] w-full">
      <Image
        src="/globe-network.webp"
        alt="Global macro intelligence network"
        fill
        priority
        sizes="(max-width: 1024px) 92vw, 48vw"
        className="object-cover"
      />

      {/* Deepens the lower edge so the artwork settles into the frame */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--stage) 70%, transparent), transparent 55%)",
        }}
        aria-hidden
      />
    </div>
  );
}