import { mysteryCategory } from './cases/mystery.js';
import { astronomyCategory } from './cases/astronomy.js';
import { biologyCategory } from './cases/biology.js';
import { geographyCategory } from './cases/geography.js';
import { everydayCategory } from './cases/everyday.js';

function normalizeCase(category, caseFile) {
  const rawFinale = Array.isArray(caseFile.finale)
    ? { intro: 'Use the complete evidence trail to agree on all three findings.', parts: caseFile.finale }
    : caseFile.finale;
  const finale = {
    ...rawFinale,
    parts: rawFinale.parts.map((part) => ({
      ...part,
      answer: Number.isInteger(part.answer) ? part.options[part.answer]?.id : part.answer
    }))
  };
  return {
    ...caseFile,
    categoryId: category.id,
    categoryName: category.name,
    categoryIcon: category.icon,
    sections: caseFile.sections.map((section) => ({
      ...section,
      name: section.name || section.title,
      icon: section.icon || category.icon,
      description: section.description || `Examine the ${String(section.name || section.title).toLowerCase()} evidence.`
    })),
    finale
  };
}

export const CASE_LIBRARY = [
  mysteryCategory,
  astronomyCategory,
  biologyCategory,
  geographyCategory,
  everydayCategory
].map((category) => ({
  ...category,
  cases: category.cases.map((caseFile) => normalizeCase(category, caseFile))
}));

export const ALL_CASES = CASE_LIBRARY.flatMap((category) => category.cases);

export function categoryById(categoryId) {
  return CASE_LIBRARY.find((category) => category.id === categoryId) || null;
}

export function caseById(caseId) {
  return ALL_CASES.find((caseFile) => caseFile.id === caseId) || null;
}

export function roundCount(caseFile) {
  return caseFile.sections.reduce((total, section) => total + section.rounds.length, 0);
}
