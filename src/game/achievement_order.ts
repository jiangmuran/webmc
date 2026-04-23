export interface AchievementNode {
  id: string;
  title: string;
  parent?: string;
  hidden?: boolean;
}

export const ACHIEVEMENTS: readonly AchievementNode[] = [
  { id: 'root/story', title: 'Minecraft' },
  { id: 'story/mine_stone', title: 'Stone Age', parent: 'root/story' },
  { id: 'story/upgrade_tools', title: 'Getting an Upgrade', parent: 'story/mine_stone' },
  { id: 'story/smelt_iron', title: 'Acquire Hardware', parent: 'story/upgrade_tools' },
  { id: 'story/obtain_armor', title: 'Suit Up', parent: 'story/smelt_iron' },
  { id: 'story/enter_the_nether', title: 'We Need to Go Deeper', parent: 'story/obtain_armor' },
  { id: 'story/cure_zombie_villager', title: 'Zombie Doctor', parent: 'story/enter_the_nether' },
  { id: 'story/follow_ender_eye', title: 'Eye Spy', parent: 'story/enter_the_nether' },
  { id: 'story/enter_the_end', title: 'The End?', parent: 'story/follow_ender_eye' },
  { id: 'end/kill_dragon', title: 'Free the End', parent: 'story/enter_the_end' },
];

export function childrenOf(id: string): readonly AchievementNode[] {
  return ACHIEVEMENTS.filter((a) => a.parent === id);
}

export function unlockOrder(): readonly string[] {
  const roots = ACHIEVEMENTS.filter((a) => a.parent === undefined).map((a) => a.id);
  const out: string[] = [];
  const walk = (id: string): void => {
    out.push(id);
    for (const c of childrenOf(id)) walk(c.id);
  };
  for (const r of roots) walk(r);
  return out;
}
