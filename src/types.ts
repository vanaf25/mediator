export interface Mediator {
  id: string;
  fullName: string;
  expertise: string[];
  experience: string;
  technology: string;
  testimonials:string[];
  education: string[];
  licenses: string[];
  state: string;
  email:string;
  city: string;
  languages?: string[];
  certifications?: string[];
  hourlyRate?: string;
  profileImage?: string;
  services:string[],
  phone:string,
  missionStatement?:string
}