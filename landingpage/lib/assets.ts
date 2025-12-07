// Helper function to get avatar source (matching the main game)
export function getAvatarSrc(profession: string): string {
  const avatars: Record<string, string> = {
    warrior: '/avatars/wojownik.png',
    mage: '/avatars/mag.png',
    assassin: '/avatars/zabojca.png',
    cleric: '/avatars/kleryk.png',
  };
  return avatars[profession] || '/avatars/wojownik.png';
}



