/** UI projection of a destination returned by the ranking API. */
export interface Destination {
  id: string;
  slug: string;
  code: string;
  name: string;
  province: string;
  brief: string;
  votes: number;
  displayOrder: number;
  rank: number;
  imageUrl: string;
  region?: string;
  regionLabel: string;
  recordCode?: string;
  tags: string[];
}
