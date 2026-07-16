import BuyCard from "@/components/BuyCard";
import CtaBand from "@/components/CtaBand";
import Diagnostic from "@/components/Diagnostic";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { LandingProvider } from "@/components/LandingProvider";
import Moment from "@/components/Moment";
import Nav from "@/components/Nav";
import Preorder from "@/components/Preorder";
import Product from "@/components/Product";
import Scents from "@/components/Scents";
import Stats from "@/components/Stats";
import Trust from "@/components/Trust";

export default function Page() {
  return (
    // 진단 결과 → 사전주문 폼으로 흐르는 상태를 이 경계가 소유한다
    <LandingProvider>
      <Nav />
      <main>
        <Hero />
        <Moment />
        <Product />
        <Scents />
        <Stats />
        <Diagnostic />
        <Trust />
        <CtaBand />
        <Faq />
        <Preorder />
      </main>
      <Footer />
      <BuyCard />
    </LandingProvider>
  );
}
