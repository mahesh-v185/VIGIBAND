
import { Slide } from './types';

export const SLIDES: Slide[] = [
  {
    id: 1,
    title: "VigiBand",
    subtitle: "Life-Saving Wearable for Seizures & Falls",
    content: ["Founder: [YOUR NAME] | Bengaluru", "First-time founder | AI + Hardware engineer"],
    duration: 10,
    type: 'title',
    script: "Hi everyone! My name is [NAME], and I'm building VigiBand. We are creating India's first affordable, life-saving wearable specifically for seizure and fall detection."
  },
  {
    id: 2,
    title: "Why I'm Building This",
    subtitle: "The Personal Connection",
    content: [
      "50M+ people with epilepsy worldwide.",
      "75% can't afford existing detection devices.",
      "Technical Mission: Solving the gap between ₹1.2K manufacturing and ₹40K market prices."
    ],
    duration: 20,
    type: 'story',
    script: "Most seizures happen when you're ALONE. No one's watching. No one's coming. I realized that while medical devices cost 40,000 rupees, manufacturing is only 1,200. That gap is the opportunity I'm here to solve."
  },
  {
    id: 3,
    title: "The Reality: Seizures Kill Silently",
    content: [
      "SUDEP kills 1 in 1,000 patients every year.",
      "Elderly fall every 11 seconds.",
      "India has 2.5M cases with NO affordable local devices.",
      "Imported solutions: ₹8K–₹15K (Out of reach for most)."
    ],
    duration: 30,
    type: 'problem',
    script: "Paint the picture: 50 million people. 1 in 1,000 die from SUDEP. In India, there's a complete lack of affordable detection. Families live in constant fear. Help doesn't arrive in time because no one knows it happened."
  },
  {
    id: 4,
    title: "VigiBand: Detection in Your Pocket",
    subtitle: "Real-Time AI-Powered Protection",
    content: [
      "AI detects seizures & falls in real-time.",
      "Alerts wrist + caregiver phone instantly.",
      "10-second cancel button for safety.",
      "Price: ₹3,999 (75% cheaper than imports)."
    ],
    duration: 30,
    type: 'solution',
    script: "VigiBand detects seizures in real-time using AI. It alerts the wearer and the caregiver instantly. We've included a 10-second cancel button for false positives. And the best part? It's just 3,999 rupees."
  },
  {
    id: 5,
    title: "How It Works",
    subtitle: "3-Step Seamless System",
    content: [
      "DETECT: ESP32 + MPU6050 monitors motion 24/7.",
      "ALERT: Instant vibration on wrist + app notification.",
      "RESPOND: Caregiver confirms or emergency services contacted."
    ],
    duration: 20,
    type: 'how-it-works',
    script: "Our system is simple. The wristband monitors motion 24/7. When our AI recognizes a pattern, it triggers a vibration and an app alert. The caregiver can then respond or clear the alarm."
  },
  {
    id: 6,
    title: "Market Opportunity",
    subtitle: "A Validated ₹2B+ Market",
    content: [
      "₹2B+ Asia-Pacific market (2026-2033).",
      "17.5% CAGR growth.",
      "Demand is already proven by expensive imports.",
      "Targeting 2.5M epilepsy cases in India alone."
    ],
    duration: 15,
    type: 'market',
    script: "We're not creating demand—it's already there. Parents and NGOs are desperately looking for affordable options. We're targeting a 2 billion rupee market that is growing rapidly at 17% a year."
  },
  {
    id: 7,
    title: "Business Model",
    subtitle: "Sustainable & Scalable",
    content: [
      "Hardware Sales: ₹3,999 (50-60% Margin).",
      "App Ecosystem: ₹99/month optional features.",
      "B2B: Partnering with NGOs and Hospitals.",
      "Year 1 Goal: 10,000 units sold."
    ],
    duration: 15,
    type: 'business-model',
    script: "We make money through hardware sales with healthy 60% margins. We're also building an app ecosystem for recurring revenue. Our goal for Year 1 is 10,000 units, generating over 2 crore rupees."
  },
  {
    id: 8,
    title: "The VigiBand Advantage",
    subtitle: "Why We Win",
    content: [
      "75% cheaper than medical imports.",
      "Seizure-specific algorithms (Not generic health).",
      "India-first design: Hindi support, Low data.",
      "Built by a team that understands the local context."
    ],
    duration: 20,
    type: 'competitive',
    script: "Apple Watches are generic. Imported devices are too expensive. VigiBand is seizure-specific, built for India, and affordable for the average family. We aren't in the wearables market; we are in the 'save lives' market."
  },
  {
    id: 9,
    title: "12-Month Roadmap",
    subtitle: "From Prototype to 10K Units",
    content: [
      "Q1: Build Prototype + Regulatory Filing.",
      "Q2: 50-Patient Clinical Pilot at NIMHANS.",
      "Q3: Manufacturing & E-commerce Launch.",
      "Q4: Reach 10,000 Units Sold."
    ],
    duration: 15,
    type: 'roadmap',
    script: "Execution is key. We'll have a working prototype in Q1, validate with patients in Q2, launch on Amazon and Flipkart in Q3, and hit our scale target of 10,000 units by the end of next year."
  },
  {
    id: 10,
    title: "The Ask",
    subtitle: "Seeking ₹20 Lakhs Seed Funding",
    content: [
      "₹3L Prototype | ₹4L Pilot Study",
      "₹5L Regulatory | ₹5L First Production",
      "₹3L Marketing & Launch."
    ],
    duration: 15,
    type: 'ask',
    script: "We're seeking 20 Lakhs. This capital will fund our clinical pilot, regulatory clearance, and our first batch of production. This isn't just an ask for money—it's an ask to change how India handles seizure care."
  },
  {
    id: 11,
    title: "The Real Impact",
    subtitle: "10,000 Families Sleeping Better",
    content: [
      "First medical-grade seizure device built in India.",
      "Proof of Indian health-tech innovation.",
      "Success: Peace of mind for rural and urban families."
    ],
    duration: 20,
    type: 'impact',
    script: "What does success look like? It's a mother in rural Karnataka who can finally sleep at night knowing her son is protected. It's proving that we can build world-class medical tech right here in India."
  },
  {
    id: 12,
    title: "Let's Build Together",
    subtitle: "Join the VigiBand Mission",
    content: [
      "Email: founder@vigiband.com",
      "Phone: +91 XXXXX XXXXX",
      "GitHub: [Link to technical work]"
    ],
    duration: 10,
    type: 'thank-you',
    script: "I'm excited to meet you, learn from you, and together, save lives. I'm open for questions. Let's talk!"
  }
];
