/**
 * Public profile model for searching archers
 */
export interface PublicProfile {
  id: string;
  name: string;
  club?: string;
  image?: string;
  skytternr?: string;
}
