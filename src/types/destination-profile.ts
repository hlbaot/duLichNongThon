export type ProfileSectionKind = "product" | "community" | "sustainability" | "digital" | "fact" | "highlight" | "general";

export interface ProfileSection {
  id: string;
  label: string;
  content: string;
  kind: ProfileSectionKind;
  headingOnly?: boolean;
}

export interface DestinationProfile {
  code: string;
  codeLabel: string;
  address: string;
  addressLabel: string;
  heading: string;
  sections: ProfileSection[];
}

export interface ProfileMetric {
  id: string;
  label: string;
  displayValue: string;
  value: number;
  precision: number;
  prefix: string;
  suffix: string;
}
