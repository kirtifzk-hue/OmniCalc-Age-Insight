export interface AgeDetails {
  years: number;
  months: number;
  days: number;
}

export interface NextBirthday {
  months: number;
  days: number;
  weekday: string;
}

export interface BirthdayInsights {
  zodiac: string;
  zodiacTrait: string;
  historicalFacts: string[];
}

export enum AppMode {
  CALCULATOR = 'CALCULATOR',
  AGE = 'AGE'
}