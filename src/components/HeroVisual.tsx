// import Image from "next/image";

// /**
//  * Hero visual.
//  *
//  * The artwork is ~1.9:1, so the container matches it — a square box left
//  * the source rectangle visible as hard edges. The image carries a feathered
//  * alpha channel, so it dissolves into the page rather than ending at a
//  * border, and the halo behind it only has to add atmosphere.
//  *
//  * The aspect-[] class is load-bearing: `fill` positions the image against
//  * its parent, so without a height here the container collapses to zero and
//  * nothing renders.
//  */
// export default function HeroVisual() {
//   return (
//     <div className="relative aspect-[1.89/1] w-full">
//       <div className="globe-halo" aria-hidden />

//       <Image
//         src="/globe-network.png"
//         alt="Global macro intelligence network"
//         fill
//         priority
//         sizes="(max-width: 1024px) 92vw, 48vw"
//         className="object-contain h-[90vh]"
//       />
//     </div>
//   );
// }



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