import publicContentJson from "./data/public-content.json";

type PublicSocialProof = {
  families: string;
  tributes: string;
  visits: string;
};

type PublicLanding = {
  headline: string;
  subheadline: string;
  benefits: string[];
  socialProof: PublicSocialProof;
};

type PublicPlanPreview = {
  name: string;
  price: string;
  note: string;
};

type PublicAbout = {
  mission: string;
  story: string;
  values: string[];
};

type PublicPlan = {
  name: string;
  price: string;
  description: string;
  cta: string;
  features: string[];
  highlight?: boolean;
};

type PublicContactChannel = {
  label: string;
  value: string;
};

type PublicFaq = {
  question: string;
  answer: string;
};

export type PublicContent = {
  brand: {
    name: string;
    tagline: string;
  };
  landing: PublicLanding;
  plansPreview: PublicPlanPreview[];
  about: PublicAbout;
  plans: PublicPlan[];
  contact: {
    channels: PublicContactChannel[];
  };
  faq: PublicFaq[];
};

export const publicContent: PublicContent = publicContentJson as PublicContent;
