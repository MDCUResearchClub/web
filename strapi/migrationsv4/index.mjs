import { migrateDepartments } from './departments.mjs';
import { migrateDivisions } from './divisions.mjs';
import { migrateKeywords } from './keywords.mjs';
import { migrateNewsArticles } from './news-articles.mjs';
import { migrateOpportunities } from './opportunities.mjs';
import { migratResearchTalks } from './research-talks.mjs';
import { migrateResearchers } from './researchers.mjs';

await migrateDepartments()

await migrateDivisions()

await migrateKeywords()

await migrateNewsArticles()

await migrateOpportunities()

await migratResearchTalks()

await migrateResearchers()