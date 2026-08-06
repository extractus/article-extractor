// utils -> similarity.ts

import { compareTwoStrings, isArray, isString } from "@pwshub/bellajs";

interface MatchResult {
  target: string;
  rating: number;
}

interface BestMatchResult {
  ratings: MatchResult[];
  bestMatch: MatchResult;
  bestMatchIndex: number;
}

const areArgsValid = (mainString: unknown, targetStrings: unknown): boolean => {
  return isString(mainString) && isArray(targetStrings) &&
    (targetStrings as unknown[]).length > 0 &&
    (targetStrings as string[]).every((s) => isString(s));
};

export const findBestMatch = (
  mainString: string,
  targetStrings: string[],
): BestMatchResult => {
  if (!areArgsValid(mainString, targetStrings)) {
    throw new Error(
      "Bad arguments: First argument should be a string, second should be an array of strings",
    );
  }

  const ratings: MatchResult[] = [];
  let bestMatchIndex = 0;

  for (let i = 0; i < targetStrings.length; i++) {
    const currentTargetString = targetStrings[i];
    const currentRating = compareTwoStrings(mainString, currentTargetString);
    ratings.push({ target: currentTargetString, rating: currentRating });
    if (currentRating > ratings[bestMatchIndex].rating) {
      bestMatchIndex = i;
    }
  }

  const bestMatch = ratings[bestMatchIndex];

  return { ratings, bestMatch, bestMatchIndex };
};
