export const algeriaCities = [
  "Algiers, Algeria",
  "Oran, Algeria",
  "Setif, Algeria",
  "Bordj Bou Arreridj, Algeria",
  "Tlemcen, Algeria"
] as const

export type AlgerianCity = typeof algeriaCities[number] 