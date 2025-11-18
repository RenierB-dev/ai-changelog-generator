export interface Commit {
  hash: string;
  date: string;
  message: string;
  author: string;
  body: string;
}

export interface ChangelogOptions {
  from: string;
  to: string;
  output?: string;
}

export interface ChangelogSection {
  title: string;
  items: string[];
}

export interface Changelog {
  version: string;
  date: string;
  sections: ChangelogSection[];
}
