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

<style>
  .gd-car { position: relative; background: #04121f; color: #fff; margin-top: 1rem; user-select: none; }
  .gd-stage { position: relative; height: min(80vh, 56.25vw); min-height: 320px; overflow: hidden; }
  .gd-slide { position: absolute; inset: 0; margin: 0; opacity: 0; transition: opacity .9s ease; pointer-events: none; }
  .gd-slide.is-active { opacity: 1; pointer-events: auto; }
  .gd-slide img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .gd-slide.is-portrait img { object-fit: contain; z-index: 1; }
  .gd-slide .gd-blur { position: absolute; inset: -30px; background-size: cover; background-position: center; filter: blur(28px) brightness(.55); }
  .gd-slide figcaption { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; padding: 3rem 1.5rem 1.1rem; background: linear-gradient(180deg, rgba(2,8,14,0), rgba(2,8,14,.78)); font-size: .95rem; }
  .gd-slide figcaption, .gd-count { text-shadow: 0 1px 4px rgba(0,0,0,.6); }
  .gd-car button { position: absolute; top: 50%; transform: translateY(-50%); z-index: 3; background: rgba(0,0,0,.35); color: #fff; border: 0; border-radius: 50%; width: 52px; height: 52px; font-size: 1.9rem; line-height: 1; cursor: pointer; transition: background .2s; }
  .gd-car button:hover, .gd-car button:focus-visible { background: rgba(0,0,0,.65); }
  .gd-car .gd-prev { left: 14px; } .gd-car .gd-next { right: 14px; }
  .gd-badge { position: absolute; top: 1rem; left: 1rem; z-index: 3; background: rgba(0,0,0,.5); color: #fff; font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; padding: .45rem .8rem; border-radius: 999px; backdrop-filter: blur(4px); }
  .gd-count { position: absolute; right: 1.2rem; bottom: 1rem; z-index: 3; font-size: .85rem; letter-spacing: .08em; opacity: .9; }
  .gd-bar { position: absolute; left: 0; bottom: 0; height: 3px; width: 0; background: #bf141c; z-index: 3; }
  .gd-intro { max-width: 800px; margin: 2.5rem auto 0; padding: 0 1.5rem; }
  .gd-intro .gd-kicker { color: #bf141c; opacity: 1; }
  .gd-intro h2 { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: clamp(1.7rem, 4.4vw, 2.6rem); line-height: 1.18; margin: 0; border: 0; padding: 0; }
  @media (max-width: 640px) { .gd-stage { height: 68vh; } .gd-badge { font-size: .64rem; letter-spacing: .06em; padding: .4rem .65rem; max-width: calc(100% - 2rem); } .gd-car button { width: 42px; height: 42px; font-size: 1.5rem; } }
</style>

<div class="gd-car gd-bleed" id="gd-car" aria-roledescription="carousel" aria-label="Photos from the trip">
  <div class="gd-stage">
    <figure class="gd-slide is-active"><img src="/img/galapagos/gallery/hammerhead-school.jpg" alt="A school of hammerheads in the hazy blue" /><figcaption>A school of hammerheads in the hazy blue</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/sea-lion-underwater.jpg" alt="A sea lion twisting over the reef" /><figcaption>A sea lion twisting over the reef</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/green-turtle.jpg" alt="A green turtle working the sand" /><figcaption>A green turtle working the sand</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/hammerhead-single.jpg" alt="A hammerhead cruising over rocky reef" /><figcaption>A hammerhead cruising over rocky reef</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/fish-ball.jpg" alt="A ball of fish with a ray below" /><figcaption>A ball of fish with a ray below</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/pufferfish.jpg" alt="A yellow pufferfish in the green algae" /><figcaption>A yellow pufferfish in the green algae</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/marine-iguanas.jpg" alt="A pile of marine iguanas warming on a stone ledge" /><figcaption>A pile of marine iguanas warming on a stone ledge</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/blue-footed-booby.jpg" alt="A blue-footed booby standing on its nest ground" /><figcaption>A blue-footed booby standing on its nest ground</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/sunset-orange.jpg" alt="A deep orange sunset over an island silhouette" /><figcaption>A deep orange sunset over an island silhouette</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/sea-lion-chair.jpg" alt="A sea lion fast asleep on a lounge chair" /><figcaption>A sea lion fast asleep on a lounge chair</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/hammerhead-school-2.jpg" alt="A haze of hammerheads in the blue" /><figcaption>A haze of hammerheads in the blue</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/sea-star.jpg" alt="A red sea star on bright blue reef" /><figcaption>A red sea star on bright blue reef</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/prickly-pear.jpg" alt="A tree-sized Galápagos prickly pear against a stormy sky" /><figcaption>A tree-sized Galápagos prickly pear against a stormy sky</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/sally-lightfoot.jpg" alt="A Sally Lightfoot crab in the spray" /><figcaption>A Sally Lightfoot crab in the spray</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/sea-lion-shadow.jpg" alt="A sea lion gliding beneath an overhang" /><figcaption>A sea lion gliding beneath an overhang</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/pelican-dusk.jpg" alt="A brown pelican at dusk" /><figcaption>A brown pelican at dusk</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/booby-boat.jpg" alt="A booby peering over the rail of the boat" /><figcaption>A booby peering over the rail of the boat</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/hammerhead-rock.jpg" alt="A hammerhead above a rock pinnacle" /><figcaption>A hammerhead above a rock pinnacle</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/marine-iguana-portrait.jpg" alt="A marine iguana close-up on black lava" /><figcaption>A marine iguana close-up on black lava</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/pelican-landing.jpg" alt="A pelican skimming the shallows" /><figcaption>A pelican skimming the shallows</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/young-frigatebird.jpg" alt="A young frigatebird beside a bush" /><figcaption>A young frigatebird beside a bush</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/liveaboard-dusk.jpg" alt="The liveaboard at anchor under a stormy dusk sky" /><figcaption>The liveaboard at anchor under a stormy dusk sky</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/iguana-lava.jpg" alt="A marine iguana on lava rock" /><figcaption>A marine iguana on lava rock</figcaption></figure>
    <figure class="gd-slide"><img data-src="/img/galapagos/gallery/sunset-sea.jpg" alt="Sunset over open water and distant islands" /><figcaption>Sunset over open water and distant islands</figcaption></figure>
    <button type="button" class="gd-prev" aria-label="Previous photo">&#8249;</button>
    <button type="button" class="gd-next" aria-label="Next photo">&#8250;</button>
    <div class="gd-badge">Our photos · Galápagos, Dec 2025 – Jan 2026</div>
    <div class="gd-count" aria-live="off"></div>
    <div class="gd-bar"></div>
  </div>
</div>

<div class="gd-intro">
  <p class="gd-kicker">Galápagos · Darwin &amp; Wolf · Isabela · Santa Cruz</p>
  <h2>Darwin used dogs to explain evolution. In the Galápagos, I found myself wondering what we are really selecting for.</h2>
  <p style="color:#666;font-size:.95rem;font-style:italic;margin-top:1rem">Every photo and video in this post is from our own trip, taken between December 2025 and January 2026.</p>
</div>

<script>
(function () {
  var car = document.getElementById('gd-car'); if (!car) return;
  var slides = Array.prototype.slice.call(car.querySelectorAll('.gd-slide')), n = slides.length, i = 0, timer = null, x0 = null;
  var count = car.querySelector('.gd-count'), bar = car.querySelector('.gd-bar');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DWELL = 6000;
  function prep(s) {
    var img = s.querySelector('img'); if (!img) return;
    if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
    function fit() {
      if (img.naturalHeight > img.naturalWidth * 1.05 && !s.classList.contains('is-portrait')) {
        s.classList.add('is-portrait'); var b = document.createElement('div'); b.className = 'gd-blur'; b.style.backgroundImage = 'url(' + img.src + ')'; s.insertBefore(b, img);
      }
    }
    if (img.complete) fit(); else img.addEventListener('load', fit);
  }
  function show(k) {
    slides[i].classList.remove('is-active'); i = (k + n) % n; slides[i].classList.add('is-active');
    prep(slides[i]); prep(slides[(i + 1) % n]);
    count.textContent = (i + 1) + ' / ' + n; restart();
  }
  function restart() {
    bar.style.transition = 'none'; bar.style.width = '0';
    if (timer) clearTimeout(timer); if (still || car.dataset.paused) return;
    void bar.offsetWidth; bar.style.transition = 'width ' + DWELL + 'ms linear'; bar.style.width = '100%';
    timer = setTimeout(function () { show(i + 1); }, DWELL);
  }
  function pause() { car.dataset.paused = '1'; if (timer) clearTimeout(timer); bar.style.transition = 'none'; bar.style.width = '0'; }
  car.querySelector('.gd-prev').addEventListener('click', function () { pause(); show(i - 1); });
  car.querySelector('.gd-next').addEventListener('click', function () { pause(); show(i + 1); });
  car.setAttribute('tabindex', '0');
  car.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { pause(); show(i - 1); } if (e.key === 'ArrowRight') { pause(); show(i + 1); } });
  car.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  car.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { pause(); show(i + (dx < 0 ? 1 : -1)); } x0 = null; });
  prep(slides[0]); prep(slides[1]); count.textContent = '1 / ' + n; restart();
})();
</script>

<p class="gd-lede">Karen and I took a dive trip to the Galápagos over the holidays. Most of it was a liveaboard out to Darwin and Wolf, the two islands at the far northern end of the archipelago, where the hammerheads school in numbers I didn't think were real. Afterward we spent a few days on land with giant tortoises. I'm not going to give you a trip report. I spent the whole time doing what I always do, which is to look at a small population and ask how it got that way, and it sent me back to some questions I've been working through in our Great Dane program.</p>

<div class="gd-video">
<iframe loading="lazy" src="https://www.youtube.com/embed/DVbgBGMCzh0?si=&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&loop=1&playlist=DVbgBGMCzh0&disablekb=1&enablejsapi=0&origin=https://7sistersgreatdanes.com" title="Approaching Darwin's Arch" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
<div class="gd-figcap">Approaching Darwin's Arch, the first thing you see of Darwin Island.</div>
</div>

<div class="gd-lesson">
<p class="gd-num">01</p>

## A breed is a set of small populations

</div>

Darwin and Wolf are small, remote and surrounded by deep water and strong currents. Anything that gets established on islands like that is cut off from the rest of its species, and from there drift and local selection do their work. This is the textbook case for the founder effect: a few individuals carry only a sample of the source population's alleles, and in a small population drift keeps removing alleles by chance, at a rate that goes up as the effective population size goes down.

That last phrase is what I keep coming back to as a breeder. The number that matters is effective population size, Ne, not how many dogs are registered. A handful of popular sires can pull Ne far below the census count, and a Great Dane color group can sit well below the breed as a whole. Fawn and brindle, harlequin and mantle, black, blue and merle are mostly bred within themselves, for sensible reasons: registry rules, coat color genetics, and habit. Functionally that makes them semi-isolated populations that share a standard. Each has its own founders, its own sire pool and its own drift.

<div class="gd-bleed gd-band">
  <div class="gd-band-inner">
    <h3>The same pattern, in two places</h3>
    <p>Each time a population is split off from a bigger one, it takes only part of the diversity with it.</p>
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
        <div class="gd-step">Kennel line<small>a handful of sires behind it</small></div>
      </div>
    </div>
  </div>
</div>

<div class="gd-lesson">
<p class="gd-num">02</p>

## What the tortoises say about bottlenecks, and what a COI misses

</div>

Isabela is the biggest island in the Galápagos, built from several volcanoes that grew until they merged. Microsatellite work found that tortoises on several of its northern volcanoes (Wolf, Darwin and Alcedo) differ significantly from one another, while the two southern volcanoes are much closer, which fits a more recent colonization. Later work found that the Wolf volcano population itself is the product of two lineages that arrived separately from Santiago and then merged. So the islands show both halves of the story: isolation produces divergence, and gene flow, when it happens, mixes things back together.

<div class="gd-video">
<iframe loading="lazy" src="https://www.youtube.com/embed/9BmhxA_Ucm8?si=&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&loop=1&playlist=9BmhxA_Ucm8&disablekb=1&enablejsapi=0&origin=https://7sistersgreatdanes.com" title="Lava channels on Isabela" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
<div class="gd-figcap">Lava channels on Isabela. A field of bare rock like this is enough to keep two populations from mixing.</div>
</div>

Alleles lost in a bottleneck don't come back by waiting. Only gene flow brings them back. And the cost of losing them isn't evenly spread, because small populations expose recessive deleterious alleles in long stretches of homozygosity. In dogs, runs of homozygosity longer than about 5 Mb have been shown to be enriched for deleterious variants (Sams and Boyko).

This is where I think the way we usually track inbreeding falls short. A pedigree COI is an expectation. It tells you the average proportion of the genome that should be identical by descent, given the pedigree, and it only knows about the generations you have recorded. Two dogs with the same COI can have very different amounts of their genome actually in ROH, because recombination is random, and a shallow pedigree misses ancient relatedness entirely. The genomic measure, F<sub>ROH</sub>, looks at what the dog actually inherited. The [Canine Genome Browser](/GreatDaneGenomeBrowser) we built on Dog10K data is aimed at exactly this kind of genome-level view.

<div class="gd-duo">
  <figure>
    <img src="/img/galapagos/tortoise-pond.jpg" alt="Giant tortoises gathered around a pond in green grass." loading="lazy" />
  </figure>
  <figure>
    <img src="/img/galapagos/lava-tube.jpg" alt="A lava tube lit along its path, with a person walking far down it." loading="lazy" />
  </figure>
</div>

The practical consequence for me is that I look at trends. A color group can have a respectable average COI and still have a small number of founders and a shrinking Ne, and that is the pattern I'd worry about.

<div class="gd-bleed" style="margin-top:2.5rem;margin-bottom:2.5rem">
  <img src="/img/galapagos/eagle-rays.jpg" alt="Four spotted eagle rays silhouetted against deep blue water." style="width:100%;max-height:70vh;object-fit:cover;display:block" loading="lazy" />
</div>

<div class="gd-lesson">
<p class="gd-num">03</p>

## Prum, and what a breed standard selects for

</div>

The idea that stuck with me most came from a book, not from anything I saw in the water. It's Richard Prum's *The Evolution of Beauty*, and the islands are a good place to think about it.

Darwin argued that natural selection wasn't enough to explain showy traits, and proposed a second process, sexual selection, in which animals choose mates by something like taste. Wallace, who had co-discovered natural selection, disagreed. His view was that a preference only evolves if it tracks something useful, so beauty is an honest advertisement of quality. That adaptive view is what most of the field has built on since, in the form of good-genes and costly-signaling models. Prum's argument is that this left out Darwin's actual idea. In the Fisher and Lande–Kirkpatrick runaway models, a preference and the trait it favors become genetically correlated through assortative mating, and the two can then drive each other forward with no quality signal at all. He calls it "Beauty Happens," and he argues that the arbitrary-preference model should be the starting hypothesis, with adaptive explanations accepted only when the evidence demands them. Plenty of researchers think he undersells the good-genes evidence, and I can see both sides. What I took from it is the question it forces: when a preference is shaping a trait, is the trait telling you anything real?

<div class="gd-video">
<iframe loading="lazy" src="https://www.youtube.com/embed/GPPZaC0YiUw?si=&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&loop=1&playlist=GPPZaC0YiUw&disablekb=1&enablejsapi=0&origin=https://7sistersgreatdanes.com" title="Giant tortoises on Santa Cruz" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
<div class="gd-figcap">Wild giant tortoises in the Santa Cruz highlands.</div>
</div>

The tortoises are the contrast case. Shell shape follows the vegetation on each island, and tortoises from drier islands, where food is higher off the ground, tend to have shells that flare up at the front so they can reach it. Nobody chose that for looks. It's selection with no breeder in the loop.

<div class="gd-fig gd-wide">
  <img src="/img/galapagos/tortoise-wallow.jpg" alt="Four giant tortoises resting in a muddy pool under trees." loading="lazy" />
  <div class="gd-figcap">A wallow in the Santa Cruz highlands. [TODO: caption]</div>
</div>

Dog breeding is Darwin's side of the argument with a written rulebook. We're the choosers. The breed standard is the preference, the ring is where it's rewarded, and the pedigree carries it forward. Most breeders, me included, believe that what wins also tends to be a sound, healthy dog, which is the Wallace position. Prum's book made me realize I should be testing that, not assuming it. We breed a giant dog that doesn't live as long as any of us would like, and that carries real risks like bloat and dilated cardiomyopathy. Whether type in the ring tracks health is an empirical question, and I don't think anyone has answered it well for our breed.

Our own coat colors are a good example of what a preference can cost. A harlequin Great Dane needs merle, a SINE insertion in *PMEL*, plus a second mutation in *PSMB7*, the H allele described by Clark and colleagues. Harlequin is dominant, but nobody has found a dog with two copies of H, and it's presumed to be embryonic lethal. So every harlequin is heterozygous, you cannot breed one true, and two harlequins mated together would be expected to lose a quarter of their conceptions. That is a beautiful pattern, and the breed built a standard around it, but it comes with a fixed genetic cost. I'm not telling anyone to stop breeding harlequins. My point is that a preference can lock in something that costs the population, and we should know the price when we pay it.

<div class="gd-lesson">
<p class="gd-num">04</p>

## What I'm changing

</div>

[Edit this so it says what you and Karen are actually going to do. This is my guess from what you've written elsewhere.]

<div class="gd-takeaways">
  <div class="gd-card"><h4>Think in Ne, one color group at a time</h4><p>Count founders and sire pools within each color group, because that is the population that is actually drifting.</p></div>
  <div class="gd-card"><h4>Look past the pedigree COI</h4><p>Use trends over generations, and genomic measures like ROH where they're available, since a pedigree only knows what was recorded.</p></div>
  <div class="gd-card"><h4>Bring in diversity early</h4><p>Lost alleles only return through gene flow, and it is much easier to do that before a line has narrowed.</p></div>
  <div class="gd-card"><h4>Keep asking what the standard is selecting for</h4><p>Health, temperament and longevity are the traits selection would have kept anywhere else. Type comes after.</p></div>
</div>

<div class="gd-closing gd-bleed">
  <p>Nobody was picking the tortoises. We are picking the dogs, so we should be honest about what we're picking for.</p>
</div>

## Sources

[TODO: verify all citations before publishing]

Prum, R. O. (2017). *The Evolution of Beauty: How Darwin's Forgotten Theory of Mate Choice Shapes the Animal Kingdom*. Doubleday.

Darwin, C. (1859). *On the Origin of Species*. John Murray.

Darwin, C. (1871). *The Descent of Man, and Selection in Relation to Sex*. John Murray.

Clark, L. A., Tsai, K. L., Starr, A. N., Nowend, K. L., & Murphy, K. E. (2011). A missense mutation in the 20S proteasome β2 subunit of Great Danes having harlequin coat patterning. *Genomics*, 97(4), 244–248.

Ciofi, C., Milinkovitch, M. C., Gibbs, J. P., Caccone, A., & Powell, J. R. (2002). Microsatellite analysis of genetic divergence among populations of giant Galápagos tortoises. *Molecular Ecology*, 11, 2265–2283. [verify]

Garrick, R. C., et al. (2014). Lineage fusion in Galápagos giant tortoises. *Molecular Ecology*. [verify authors, volume and pages]

Sams, A. J., & Boyko, A. R. (2019). Fine-scale resolution of runs of homozygosity reveal patterns of inbreeding and substantial overlap with recessive disease genotypes in domestic dogs. *G3*, 9(1), 117–123. [verify]
