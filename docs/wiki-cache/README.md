# Wiki Cache

Raw wikitext from `minecraft.wiki` (CC BY-NC-SA 4.0), used as the **only** behavioral reference source for webmc's clean-room reimplementation.

- Populated by `scripts/wiki-fetch.ts` via the MediaWiki `?action=raw` endpoint.
- Seed the foundation pages: `npm run wiki:seed`.
- Refresh every cached page: `tsx scripts/wiki-fetch.ts --refresh`.
- Add a specific page: `tsx scripts/wiki-fetch.ts "Ender Dragon"`.

**Never commit** decompiled source, Mojang-copyrighted textures/audio/models, or other proprietary material into this directory. Only wikitext.

Attribution: content here is © minecraft.wiki contributors, licensed CC BY-NC-SA 4.0. See <https://minecraft.wiki/w/Minecraft_Wiki:Licensing>.
