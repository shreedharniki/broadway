export type FeaturedCategoryKey = 'ftth' | 'voice' | 'business' | 'security';

export interface FeaturedServiceItem {
  id: FeaturedCategoryKey;
  title: string;
  lines: string[];
  subtitle: string;
  image: string;
  tagline: string;
  overview: string;
  keySpecs: string[];
  equipmentDetails: string[];
  idealFor: string[];
  typicalDeployments: string;
}

export interface ServiceFamily {
  id: string;
  name: string;
  shortDesc: string;
  iconName: string;
  services: {
    name: string;
    description: string;
    featuredKey?: FeaturedCategoryKey;
  }[];
}

export type AudienceKey = 'homes' | 'communities' | 'businesses' | 'institutions';

export interface AudienceSolution {
  id: AudienceKey;
  label: string;
  headline: string;
  description: string;
  recommendedStack: string[];
  deploymentHighlights: string[];
  primaryBenefit: string;
}

export interface ProjectStoryPlaceholder {
  id: string;
  prototypeLabel: string;
  clientType: string;
  location: string;
  infrastructureScope: string[];
  technicalApproach: string;
  deliverables: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  durationHint: string;
  focus: string;
  details: string[];
}

export interface EnquiryFormData {
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  bengaluruZone: string;
  serviceCategory: string;
  audienceType: string;
  requirements: string;
}
