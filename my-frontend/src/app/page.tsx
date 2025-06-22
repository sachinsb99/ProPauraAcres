import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import GlowingEffectDemo from "@/components/ui/glowing-effect-demo";
import CardHoverEffectDemo from "@/components/card-hover-effect-demo";
import { BackgroundBeams } from "@/components/ui/background-beams";
import HouseViewer from "@/components/HouseViewer";
// import ThreeDMarqueeDemo from "@/components/ui/3d-marquee";
import { ThreeDMarqueeDemoSecond } from "@/components/3d-marquee-demo";
import BackgroundGradientDemo from "@/components/background-gradient-demo";

// export default function HomePage() {
//   return (
//     <main>
//       <BackgroundGradientDemo />
//     </main>
//   );
// }


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Next.js Template for Startup and SaaS",
  description: "This is Home for Startup Nextjs Template",
  // other metadata
};

// export default function Home() {
//   return (
// <main className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-10">
//   <h1 className="text-4xl font-bold mb-8 text-white">
//     Drag to explore the house
//   </h1>
//   <HouseViewer />
// </main>
//   );
// }

export default function Home() {
  return (
    <>
      <ScrollUp />
      {/* <main className="min-h-screen bg-black text-white"> */}
      {/* Any existing content here */}
      <ThreeDMarqueeDemoSecond />
      {/* <main>
      <BackgroundGradientDemo />
    </main> */}
    {/* </main> */}
      {/* <Hero /> */}
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-stone-950 p-10">
        <h1 className="mb-8 text-4xl font-bold text-white">
          Drag to explore the house
        </h1>
        <HouseViewer />
      </main> */}

      {/* <BackgroundBeams /> */}
      <GlowingEffectDemo />
      <Features />
      {/* <CardHoverEffectDemo /> */}
      <Video />
      <Brands />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
      <Contact />
    </>
  );
}
