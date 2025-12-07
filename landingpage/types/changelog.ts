import { ChangelogVersion, ChangelogEntry } from './index';

export interface ChangelogVersionWithEntries extends ChangelogVersion {
  entries: ChangelogEntry[];
}

export type ChangelogEntryType = 'balancing' | 'content' | 'bugfix' | 'feature';



