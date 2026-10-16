/**
 * Loads the JSON content files, checks them, and exposes them as typed `GAME_CONTENT`.
 * A broken content edit (duplicate IDs, empty lists, …) fails loudly at startup with a clear
 * message instead of causing weird bugs mid-game.
 */
import aboutMeJson from '@/data/about-me.json';
import alienCitiesJson from '@/data/alien-cities.json';
import alienNamesJson from '@/data/alien-names.json';
import alienPortraitsJson from '@/data/alien-portraits.json';
import interestsJson from '@/data/interests.json';
import playerAvatarsJson from '@/data/player-avatars.json';
import searchingStepsJson from '@/data/searching-steps.json';
import { GAME_CONFIG } from '@/game/config';
import type {
  AboutMeEntry,
  GameContent,
  InterestCategory,
  InterestId,
  InterestWithCategory,
  PlayerAvatar,
} from '@/types/content';

const ALIEN_PORTRAIT_DIR = '/aliens/';
const PLAYER_AVATAR_DIR = '/avatars/';

class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`[content] src/data/${file}: ${message}`);
    this.name = 'ContentError';
  }
}

function assertUniqueIds(file: string, ids: readonly string[]): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) throw new ContentError(file, `duplicate id "${id}"`);
    seen.add(id);
  }
}

function cleanStringList(file: string, values: readonly string[]): string[] {
  const cleaned = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  if (cleaned.length === 0) throw new ContentError(file, 'list must not be empty');
  return cleaned;
}

function loadInterests(): {
  categories: InterestCategory[];
  byId: Map<InterestId, InterestWithCategory>;
} {
  const file = 'interests.json';
  const categories: InterestCategory[] = interestsJson.categories;
  assertUniqueIds(
    file,
    categories.map((category) => category.id),
  );

  const byId = new Map<InterestId, InterestWithCategory>();
  for (const category of categories) {
    if (category.interests.length === 0) {
      throw new ContentError(file, `category "${category.id}" has no interests`);
    }
    for (const interest of category.interests) {
      if (byId.has(interest.id)) throw new ContentError(file, `duplicate id "${interest.id}"`);
      byId.set(interest.id, { ...interest, categoryId: category.id });
    }
  }

  // A card needs enough interests the player did NOT pick to fill the remaining tags.
  const minimum =
    GAME_CONFIG.profile.requiredInterestCount + GAME_CONFIG.candidate.interestsPerCard;
  if (byId.size < minimum) {
    throw new ContentError(file, `needs at least ${minimum} interests in total (has ${byId.size})`);
  }
  return { categories, byId };
}

function loadAboutMe(): AboutMeEntry[] {
  const entries: AboutMeEntry[] = aboutMeJson.entries.filter((entry) => entry.text.trim() !== '');
  if (entries.length === 0) throw new ContentError('about-me.json', 'list must not be empty');
  assertUniqueIds(
    'about-me.json',
    entries.map((entry) => entry.id),
  );
  return entries;
}

function loadPlayerAvatars(): PlayerAvatar[] {
  const avatars = playerAvatarsJson.avatars.map((avatar) => ({
    id: avatar.id,
    label: avatar.label,
    src: PLAYER_AVATAR_DIR + avatar.file,
  }));
  if (avatars.length === 0) throw new ContentError('player-avatars.json', 'list must not be empty');
  assertUniqueIds(
    'player-avatars.json',
    avatars.map((avatar) => avatar.id),
  );
  return avatars;
}

function loadContent(): GameContent {
  const interests = loadInterests();
  return {
    interestCategories: interests.categories,
    interestsById: interests.byId,
    alienNames: cleanStringList('alien-names.json', alienNamesJson.names),
    alienCities: cleanStringList('alien-cities.json', alienCitiesJson.cities),
    aboutMeEntries: loadAboutMe(),
    portraitSrcs: cleanStringList('alien-portraits.json', alienPortraitsJson.files).map(
      (file) => ALIEN_PORTRAIT_DIR + file,
    ),
    playerAvatars: loadPlayerAvatars(),
    searching: {
      title: searchingStepsJson.title,
      subtitle: searchingStepsJson.subtitle,
      steps: cleanStringList('searching-steps.json', searchingStepsJson.steps),
    },
  };
}

export const GAME_CONTENT: GameContent = loadContent();

/** Used by <AlienImage> when a portrait file fails to load. */
export const FALLBACK_PORTRAIT_SRC = `${ALIEN_PORTRAIT_DIR}fallback.svg`;
