import { Dungeon } from '../types';

export const DUNGEONS: Dungeon[] = [
  {
    id: 'dungeon_1',
    name: 'Krypta Zapomnianych',
    levelReq: 10,
    rooms: 4,
    bossId: 'boss_dungeon_1',
    description: 'Mroczne katakumby, w których słychać jęki potępionych. Idealne miejsce dla początkujących poszukiwaczy przygód.',
  },
  {
    id: 'dungeon_2',
    name: 'Twierdza Wilczych Cieni',
    levelReq: 16,
    rooms: 5,
    bossId: 'boss_dungeon_2',
    description: 'Opuszczona twierdza w górach, przejęta przez stado zmutowanych wilków.',
  },
  {
    id: 'dungeon_3',
    name: 'Sanktuarium Eteru',
    levelReq: 22,
    rooms: 6,
    bossId: 'boss_dungeon_3',
    description: 'Starożytna świątynia pulsująca niestabilną magią. Tylko dla doświadczonych.',
  },
  {
    id: 'dungeon_4',
    name: 'Upadła Cytadela',
    levelReq: 30,
    rooms: 7,
    bossId: 'boss_dungeon_4',
    description: 'Siedziba samego Avatara. Miejsce, z którego nikt nie wraca żywy.',
  }
];

