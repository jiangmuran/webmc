# M12 — Enchanting / Brewing / Trading (Design Note)

**Master Plan reference:** M12 — `~25h`. DONE-when = XP orb system; enchantment table + bookshelf power; brewing stand + 10 potions; villager trading with profession progression; anvil repair/rename.

Wiki refs (cached): `Experience.wikitext`, `Enchantment.wikitext`, `Brewing_Stand.wikitext`, `Villager.wikitext`, `Anvil.wikitext`.

## Sub-tasks

```
M12.1  XP pool + level curve in PlayerState                  [2h]  ✓ this iteration
M12.2  Enchantment registry + apply logic                    [3h]
M12.3  Enchantment table tile-entity + bookshelf power count [3h]
M12.4  Potion effect registry + player status effects        [3h]
M12.5  Brewing stand tile-entity + recipe list               [3h]
M12.6  Villager trade offers + profession progression        [4h]
M12.7  Anvil tile-entity: repair + rename + enchant merge    [3h]
M12.8  Unit + e2e tests                                      [2h]
M12.9  verify:m12 + retro + close                            [2h]
```

## Notes

- **XP curve** matches MC: levels 1–16 each take `2n+7` XP, 17–31 each `5n-38`, 32+ each `9n-158`.
- **Enchantment levels**: I–V typical; cost ≤ 30 XP.
- **Potion effects**: per-tick via PlayerState `tick(dtSec, env)` — add new `effects: Map<EffectId, {amplifier, remainingSec}>`.
- **Villager offers**: JSON-driven recipe list per profession; offer lock after N uses with per-tick cooldown.

## DONE

1. `npm run verify:m12` green.
2. XP orbs spawn on mob kill; player xpLevel / xpProgress render in HUD.
3. Enchantment table: place, open UI → applies up to level-30 enchantment to a tool for XP.
4. Brewing stand: ingredient + base potion + fuel → finished potion after 20 s.
5. Villager trades: emerald → wheat; emerald → arrows; etc. profession-gated.
6. Anvil: combine two tools, renamed, XP cost.
7. Retro.
