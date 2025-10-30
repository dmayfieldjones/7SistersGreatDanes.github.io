'use client'
import './index.css'
import { useState } from 'react'

export default function ClientComponent() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }
  
  const questions = [
    {
      id: 'puppy-timing',
      question: 'When can we take our puppy home?',
      answer: `You may receive your dog 8 weeks after their birth with an
        understanding that they are transitioning through a critical stage of
        development in which exposure to fear can have longer lasting effects
        on behavior. Interestingly, this impact/fear period is well recognized
        among breeders but appears absent from scientific literature.
        Consideration for potential traumatic events should be considered at
        this time, i.g. cropping, unsympathetic discipline, and even
        challenging transport.`
    },
    {
      id: 'purchase-value',
      question: 'What value does our purchase include?',
      answer: `Lifetime breeder support and education on the litter (i.g. health
        testing, pedigree, and our reasoning for parental selection), modified
        Puppy Culture socialization and training, age-appropriate vaccines,
        deworming, vet exams, health guarantee, microchipping and importantly
        microchip registration (
        <a href="https://avmajournals.avma.org/view/journals/javma/235/2/javma.235.2.160.xml">
          greater than 40%
        </a>{' '}
        of microchipped dogs have been found to not be registered), AKC
        registration (to ensure it is done correctly and timely), introduction
        to crate-leash-potty training, and ear cropping if desired.`
    },
    {
      id: 'customized-contracts',
      question: 'Why are your contracts customized?',
      answer: `We believe our customized contracts initiate important conversation
        with our clients and help ensure the safety and health of the dogs we
        whelp. We expect potential owners to feel welcome to ask questions and
        be a participant in actively negotiating contracts.`
    },
    {
      id: 'feeding',
      question: 'What feed and how much?',
      answer: `We value healthy, affordable, safe, and convenient feed for your dog. We argue there is no feed specific to a particular breed. However, Great Dane puppies should not be fed many feeds labeled for puppies because they contain excessively high concentrations of protein and fat. Rehydrating a quality dry kibble and supporting your dog with a variety of additional healthy foods (less than 10% by weight of their diet) will meet the needs of most dogs and satisfy dog lovers. A fresh, or raw, diet can also provide exceptional nutrition for your dog. The amount your Dane will eat depends on age, sex, type of food, and level of activity. Generally, our 8-12 week old puppies will eat 1.5 cups for each of their 3 daily meals. Adults will eat 6-10 cups daily divided roughly between two meals. <a href="/posts/2025-07-17-feeding-your-growing-great-dane">Read our comprehensive nutrition guide for detailed feeding strategies and recommendations.</a>`
    },
    {
      id: 'ear-cropping',
      question: 'Why and how do you crop?',
      answer: `It is the choice of the puppy owner whether or not to crop. We believe
        the minimally invasive surgery on, and following months of maintenance
        for, dogs that are cropped is a benign custom that appeals to
        aesthetic and traditional values shared by many dog lovers. Ear
        cropping continues to be a largely aesthetic choice. We find arguments
        in favor of cropping because of health and/or the natural upright ears
        of undomesticated canids unconvincing. Equally unconvincing are
        arguments discouraging cropping due to a suggested reduced ability to
        communicate, comparisons to amputation or mutilation, and veterinary
        professionals claiming the procedure non-medically necessary or
        lacking a scientific justification. Undeniably, cropping is legally
        prohibited throughout many regions of the world, and the condemning
        and illegalization of cropping has had historical impacts on the
        breeding and popularity of Great Danes. There are no documented
        widespread changes in health or behavior due to cropping. There is no
        evidence for elevated cortisol levels after the wounds have healed in
        7-10 days. We believe from personal experience that it is no more
        traumatic than a pierced ear or a scratched knee in which the wound
        similarly takes a few days to heal. It may be sore and itch, and we
        treat these symptoms. Posting the ear is not painful and much more
        frustrating and worrisome to the human than the dog. Therefore, we
        strongly advocate for and defend the choice of dog lovers and
        veterinarians to continue to crop their dogs as an extension of
        supporting the historical preservation and aesthetic of the Great Dane
        breed Standard and larger breed concept. It is a beautiful thing. We choose and endorse Dr. Anne Midgarden DVM (Ohio) to crop our
        Great Dane puppies for our clients. We present clients with a modified
        care guide for educational purposes only. Cropping considerations and
        care should be made with the guidance of your veterinarian and
        breeders.`
    },
    {
      id: 'euro-lines',
      question: 'Do you breed Euro-lines of Great Danes?',
      answer: `We follow the current <a href="https://gdca.org/wp-content/uploads/TheGreatDane/2021-GDCA-Illustrated-Standard-10_19_21.pdf">standard</a> as approved by the Great Dane Club of America and the American Kennel Club. How this standard has evolved and how previous conformation points were awarded is fascinating and telling of our breed. The traits associated with Euro-lines, sometimes called hyper-exaggerated features, are outside our standard, and others: <a href="https://www.ukcdogs.com/docs/breeds/great-dane.pdf">UKC</a>, <a href="https://www.thekennelclub.org.uk/breed-standards/working/great-dane/#:~:text=General%20appearance,grace%20of%20form%20most%20essential.">KC</a>, and <a href="https://www.fci.be/Nomenclature/Standards/235g02-en.pdf">FCI</a>. We are happy to discuss individual features with curious potential clients.`
    }
  ]

  return (
    <div className="content">
      <div className="post-title">
        <h1>
          Common Questions About <span style={{ color: '#bf141c' }}>7</span>Sisters Great Danes
        </h1>
      </div>
      <main className="content-wrapper">
        <div className="accordion-container">
        {questions.map((item, index) => (
          <div key={item.id} className="accordion-item">
            <button
              className={`accordion ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`${item.id}-panel`}
            >
              <span className="accent-color">{item.question}</span>
            </button>
            <div
              className={`panel ${activeIndex === index ? 'panel-open' : ''}`}
              id={`${item.id}-panel`}
            >
              <p dangerouslySetInnerHTML={{ __html: item.answer }} />
            </div>
          </div>
        ))}
        </div>
      </main>
    </div>
  )
}
