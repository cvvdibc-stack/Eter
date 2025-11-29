export const getAvatarSrc = (profession: string) => {
    const map: Record<string, string> = {
        warrior: 'wojownik.png',
        mage: 'mag.png',
        assassin: 'zabojca.png',
        cleric: 'kleryk.png'
    };
    return `/avatars/${map[profession] || 'wojownik.png'}`;
};

export const getMonsterSrc = (monsterId: string) => {
    const map: Record<string, string> = {
        'monster_1': 'szczur.png',
        'monster_2': 'dzikiptak.png',
        'monster_3': 'wilk.png',
        'monster_4': 'bandzior.png'
    };
    
    return `/monsters/${map[monsterId] || `${monsterId}.png`}`;
};

