---
title: "Darwin's Reversal: What Galápagos Tortoises Taught Me About Dog Breeding"
description: "A dive trip to Darwin and Wolf Islands and a day with wild giant tortoises sent me back to Richard Prum's The Evolution of Beauty, and to some uncomfortable questions about color groups, COI, and what a breed standard really selects for."
date: 2026-10-08
categories: ["Breeding", "Genetics", "Travel"]
tags: ["Galápagos", "Natural Selection", "Genetic Diversity", "Founder Effect"]
featured: true
---

<style>
  html { overflow-x: clip; }
  .gd-bleed { width: 100vw; position: relative; left: 50%; margin-left: -50vw; }
  .gd-hero { position: relative; min-height: 78vh; display: flex; align-items: flex-end; background: #04121f url('/img/galapagos/hammerhead-school.jpg') center / cover no-repeat; color: #fff; margin-top: 1rem; }
  .gd-hero::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(2,10,20,.15) 0%, rgba(2,10,20,.78) 100%); }
  .gd-hero-inner { position: relative; max-width: 800px; margin: 0 auto; padding: 4rem 1.5rem 3.5rem; }
  .gd-kicker { letter-spacing: .22em; text-transform: uppercase; font-size: .78rem; opacity: .85; margin: 0 0 1rem; }
  .gd-hero h2 { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: clamp(1.9rem, 5.2vw, 3.4rem); line-height: 1.12; margin: 0; border: 0; padding: 0; color: #fff; }
  .gd-hero h2 em { color: #ff8b90; font-style: italic; }
  .gd-lede { font-size: 1.15rem; line-height: 1.7; margin: 2.2rem 0; }
  .gd-lede::first-letter { font-family: Georgia, serif; float: left; font-size: 4.2rem; line-height: .8; padding: .35rem .6rem 0 0; color: #bf141c; }
  .gd-num { font-family: Georgia, serif; font-size: 5.5rem; line-height: 1; color: #bf141c; opacity: .9; margin: 3rem 0 0; }
  .gd-lesson h2 { margin-top: .2rem; font-size: clamp(1.6rem, 4vw, 2.2rem); line-height: 1.2; border: 0; padding: 0; }
  .gd-quote { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.4rem, 3.6vw, 2.1rem); line-height: 1.3; text-align: center; max-width: 720px; margin: 3rem auto; padding: 0 1rem; color: #1a1a1a; }
  .gd-quote::before, .gd-quote::after { content: ""; display: block; width: 56px; height: 3px; background: #bf141c; margin: 1.2rem auto; }
  .gd-band { background: #04121f; color: #fff; padding: 4rem 1.5rem; margin-top: 3rem; margin-bottom: 3rem; }
  .gd-band-inner { max-width: 800px; margin: 0 auto; }
  .gd-band h3 { color: #fff; margin-top: 0; font-size: 1.5rem; }
  .gd-band p { color: #d7e3ee; }
  .gd-ladder { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0 0; }
  .gd-ladder-col h4 { margin: 0 0 .8rem; font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; color: #8fb4d6; }
  .gd-step { padding: .85rem 1rem; border-radius: 8px; margin-bottom: .55rem; font-weight: 700; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.18); }
  .gd-step:nth-child(3) { margin-left: 1.2rem; background: rgba(255,255,255,.13); }
  .gd-step:nth-child(4) { margin-left: 2.4rem; background: rgba(191,20,28,.55); border-color: rgba(255,139,144,.6); }
  .gd-step small { display: block; font-weight: 400; opacity: .75; margin-top: .15rem; }
  .gd-duo { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin: 2rem 0; }
  .gd-duo figure, .gd-fig { margin: 0; }
  .gd-duo img, .gd-fig img { width: 100%; display: block; border-radius: 10px; box-shadow: 0 6px 22px rgba(0,0,0,.18); }
  .gd-duo img { height: 100%; object-fit: cover; aspect-ratio: 4 / 5; }
  .gd-figcap { font-size: .85rem; color: #666; font-style: italic; margin-top: .55rem; }
  .gd-wide { margin: 2.5rem 0; }
  .gd-video { margin: 2.5rem auto; text-align: center; }
  .gd-video iframe { width: 100%; max-width: 100%; aspect-ratio: 16 / 9; height: auto; border: 0; border-radius: 12px; box-shadow: 0 8px 28px rgba(0,0,0,.25); }
  .gd-takeaways { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0; }
  .gd-card { background: #f8f8f8; border-left: 4px solid #bf141c; border-radius: 8px; padding: 1.1rem 1.2rem; }
  .gd-card h4 { margin: 0 0 .4rem; font-size: 1.02rem; }
  .gd-card p { margin: 0; font-size: .95rem; line-height: 1.55; }
  .gd-closing { position: relative; min-height: 60vh; display: flex; align-items: center; justify-content: center; text-align: center; background: #101a0e url('/img/galapagos/tortoise-wallow.jpg') center / cover no-repeat; color: #fff; margin-top: 3rem; }
  .gd-closing::before { content: ""; position: absolute; inset: 0; background: rgba(5, 12, 5, .62); }
  .gd-closing p { position: relative; font-family: Georgia, serif; font-size: clamp(1.5rem, 4.2vw, 2.5rem); line-height: 1.3; max-width: 760px; padding: 3rem 1.5rem; margin: 0; color: #fff; }
  @media (max-width: 640px) { .gd-ladder, .gd-duo, .gd-takeaways { grid-template-columns: 1fr; } .gd-duo img { aspect-ratio: 4 / 3; } }
</style>

[← Back to Blog Archive](/archive)

<div class="gd-hero gd-bleed">
  <div class="gd-hero-inner">
    <p class="gd-kicker">Galápagos · Darwin &amp; Wolf · Isabela · Santa Cruz</p>
    <h2>Darwin used dogs to explain evolution. In the Galápagos, I found myself wondering what we are really selecting for.</h2>
  </div>
</div>

<p class="gd-lede">Karen and I took a dive trip to the Galápagos over the holidays. Most of it was a liveaboard out to Darwin and Wolf, the two islands at the far northern end of the archipelago, where the hammerheads school in numbers I didn't think were real. After that we spent a few days on land with giant tortoises. I'm not going to give you a trip report. What I want to write about is what I couldn't stop thinking about the whole time, which is how the animals there got to be the way they are, and what that says about the dogs we breed at home.</p>

<div class="gd-video">
<iframe loading="lazy" src="https://www.youtube.com/embed/DVbgBGMCzh0?si=&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&loop=1&playlist=DVbgBGMCzh0&disablekb=1&enablejsapi=0&origin=https://7sistersgreatdanes.com" title="Approaching Darwin's Arch" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
<div class="gd-figcap">Approaching Darwin's Arch, which is the first thing you see of Darwin Island.</div>
</div>

<div class="gd-lesson">
<p class="gd-num">01</p>

## Islands, and why a breed looks like an archipelago

</div>

Darwin and Wolf are small and far from everything else, with deep water and strong currents all around them. Things that end up on islands like that get cut off from the rest of their species, and given enough time they turn into something a little different. Darwin saw it in the finches and the tortoises. That's the whole reason the islands are famous.

When I was looking at all that, I kept thinking about color groups in Great Danes. Fawn and brindle, harlequin and mantle, black, blue, merle. Most of us breed within our color, for good reasons. There are registry rules, there are coat color genetics that make crossing awkward, and there's just habit. But what that means is that a "Great Dane" isn't one breeding population. It's several populations that happen to share a standard, and each one has its own pedigree history and its own inbreeding trend.

<div class="gd-bleed gd-band">
  <div class="gd-band-inner">
    <h3>The same pattern, in two places</h3>
    <p>Every time a population gets split off from a bigger one, it takes only part of the diversity with it.</p>
    <div class="gd-ladder">
      <div class="gd-ladder-col">
        <h4>Galápagos tortoises</h4>
        <div class="gd-step">Mainland ancestor<small>one source population</small></div>
        <div class="gd-step">Island<small>a few founders cross the water</small></div>
        <div class="gd-step">Volcano<small>split again by lava fields</small></div>
      </div>
      <div class="gd-ladder-col">
        <h4>Great Danes</h4>
        <div class="gd-step">The breed<small>one registry, one standard</small></div>
        <div class="gd-step">Color group<small>mostly bred within itself</small></div>
        <div class="gd-step">Kennel line<small>a handful of dogs behind it</small></div>
      </div>
    </div>
  </div>
</div>

<div class="gd-lesson">
<p class="gd-num">02</p>

## Bottlenecks stack up

</div>

Isabela is the biggest island in the Galápagos, but it was built from several volcanoes that grew until they touched. The giant tortoises on the different volcanoes are genetically distinct from each other, even though they share one island. A bare lava field is enough to keep two populations apart. So the tortoises went through one bottleneck getting to the islands, and then more of them as each island and each volcano was settled.

<div class="gd-video">
<iframe loading="lazy" src="https://www.youtube.com/embed/9BmhxA_Ucm8?si=&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&loop=1&playlist=9BmhxA_Ucm8&disablekb=1&enablejsapi=0&origin=https://7sistersgreatdanes.com" title="Lava channels on Isabela" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
<div class="gd-figcap">Lava channels on Isabela. A field of rock like this is enough to keep two populations from mixing.</div>
</div>

I think about that every time I look at a pedigree now. Once an allele is gone from a small population it stays gone, and the only way to get it back is to bring in animals from outside. I've always known that in theory. It's different when you see a whole island's worth of animals that are the descendants of a few founders.

<div class="gd-duo">
  <figure>
    <img src="/img/galapagos/tortoise-pond.jpg" alt="Giant tortoises gathered around a pond in green grass." loading="lazy" />
  </figure>
  <figure>
    <img src="/img/galapagos/lava-tube.jpg" alt="A lava tube lit along its path, with a person walking far down it." loading="lazy" />
  </figure>
</div>

It also changed how I read a COI. I used to treat it as a number for a litter. Now I care more about where a line is heading and how many founders are really behind it, because a group that looks fine today can still be shrinking underneath.

<div class="gd-bleed" style="margin-top:2.5rem;margin-bottom:2.5rem">
  <img src="/img/galapagos/eagle-rays.jpg" alt="Four spotted eagle rays silhouetted against deep blue water." style="width:100%;max-height:70vh;object-fit:cover;display:block" loading="lazy" />
</div>

<div class="gd-lesson">
<p class="gd-num">03</p>

## What Prum wrote about beauty

</div>

The idea that stuck with me most came from a book, not from anything I saw in the water. It's Richard Prum's *The Evolution of Beauty*, and the islands are the best place I can think of to read it.

Here's the short version of the argument. Darwin proposed two kinds of selection. One was natural selection, where the traits that help you survive get passed on. The other was sexual selection, and for the showy traits he thought it came down to taste. Females choose the males they find attractive, and over many generations that preference shapes the animal. Wallace, who came up with natural selection at the same time, wouldn't accept that. He thought a female's choice had to track something useful, like health or vigor. Beauty was only an advertisement for quality. Prum's book says Wallace's side won, and that science has been stuck with it for 150 years. His claim is that Darwin was right, or at least right more often than we give him credit for. Preferences can evolve on their own, with no connection to quality at all, and then they drive the traits. Beauty happens, as he puts it, because the animals like it.

Most of the book is about birds, and I'll leave the manakins and bowerbirds to him. The part that matters for us is the argument underneath. If a preference can drive evolution without anything useful behind it, then you can end up with traits that are lovely and have no honest signal in them at all. And some of them can be costly.

<div class="gd-video">
<iframe loading="lazy" src="https://www.youtube.com/embed/GPPZaC0YiUw?si=&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&loop=1&playlist=GPPZaC0YiUw&disablekb=1&enablejsapi=0&origin=https://7sistersgreatdanes.com" title="Giant tortoises on Santa Cruz" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
<div class="gd-figcap">Wild giant tortoises in the Santa Cruz highlands.</div>
</div>

Then we got to the tortoises, and they were the opposite. The shell shape of a tortoise follows the vegetation on its island. The ones from drier islands, where food hangs higher, have shells that flare up in front so the neck can reach. Nothing about that is for show. It works or it doesn't. That's what selection looks like when there is no breeder involved.

<div class="gd-fig gd-wide">
  <img src="/img/galapagos/tortoise-wallow.jpg" alt="Four giant tortoises resting in a muddy pool under trees." loading="lazy" />
  <div class="gd-figcap">A wallow in the Santa Cruz highlands. [TODO: caption]</div>
</div>

And that is where the dogs come in, because the breed standard is Darwin's version of the argument with a written rulebook. We are the ones choosing. The standard is our preference, the ring is where it gets rewarded, and the pedigrees carry the result forward. Most of us sincerely believe that what wins in the ring is also what makes a good, healthy Great Dane. Prum's book made me ask how much of that I actually know and how much I've just assumed. If this were Wallace's world, beauty would honestly signal fitness. Does it? For a breed that is as large as ours, and that doesn't live as long as any of us would like, I'm not sure I can say yes without checking.

I'm not saying a standard is a bad idea. A written standard is how a breed stays recognizable, and I love how Great Danes look. But I think I'm more honest with myself about what I'm doing now. When I select for type, I'm acting on a preference, the way a bowerbird does. That's allowed, as long as I don't pretend it automatically means the dog is healthier. The traits that would matter on an island, which are health, soundness, temperament and a long life, I now have to pick on purpose, because nothing else will.

<div class="gd-lesson">
<p class="gd-num">04</p>

## What I'm changing

</div>

[Edit this so it says what you and Karen are actually going to do. This is my guess from what you've written elsewhere.]

<div class="gd-takeaways">
  <div class="gd-card"><h4>Look at color groups one at a time</h4><p>Check how deep the pedigrees really go in each group and how many founders are behind them, instead of talking about the breed as a whole.</p></div>
  <div class="gd-card"><h4>Treat COI as a trend</h4><p>Pay attention to which way a line is moving over generations, not only the number on one litter.</p></div>
  <div class="gd-card"><h4>Outcross sooner</h4><p>Diversity doesn't come back on its own. Bringing it in early is much easier than trying to rescue a line later.</p></div>
  <div class="gd-card"><h4>Put health and temperament first</h4><p>Those are what selection would have kept anywhere else. Type matters, but it comes after.</p></div>
</div>

<div class="gd-closing gd-bleed">
  <p>Nobody was picking the tortoises. We are picking the dogs, so we should be honest about what we're picking for.</p>
</div>

## Sources

[TODO: verify all before publishing]

Prum, R. O. (2017). *The Evolution of Beauty: How Darwin's Forgotten Theory of Mate Choice Shapes the Animal Kingdom*. Doubleday.

Darwin, C. (1859). *On the Origin of Species*. John Murray.

Darwin, C. (1871). *The Descent of Man, and Selection in Relation to Sex*. John Murray.

[TODO: add the Galápagos giant tortoise phylogeography paper(s), likely from the Poulakakis, Caccone, or Russello groups. Confirm the citation and the volcano-by-volcano claims in section 02 before publishing.]
