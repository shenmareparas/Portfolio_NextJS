export interface Education {
  institution: string;
  degree: string;
  year: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  platform?: string;
  year: string;
  link: string;
}

export interface Achievement {
  title: string;
  link?: string;
}
