import React from 'react';
import { Item, ItemType } from '../types';
import { Sword, Shield, Shirt, Crown, Footprints, CircleDot, Gem, Ghost, Hand } from 'lucide-react';

interface ItemIconProps {
    item: Item;
    size?: number;
    showRarityBorder?: boolean;
}

const RARITY_BG = {
    common: 'bg-gradient-to-br from-slate-700 to-slate-600',
    unique: 'bg-gradient-to-br from-green-700 to-green-600',
    heroic: 'bg-gradient-to-br from-blue-800 to-blue-600',
    legendary: 'bg-gradient-to-br from-orange-700 to-orange-600',
    mythic: 'bg-gradient-to-br from-red-900 to-red-600',
    talisman: 'bg-gradient-to-br from-emerald-900 to-emerald-600',
};

const TYPE_ICONS: Record<ItemType, React.ElementType> = {
    weapon: Sword,
    shield: Shield,
    armor: Shirt,
    helmet: Crown,
    boots: Footprints,
    ring: CircleDot,
    amulet: Gem,
    talisman: Ghost,
    gloves: Hand
};

export const ItemIcon: React.FC<ItemIconProps> = ({ item, size = 40, showRarityBorder = false }) => {
    const IconComponent = TYPE_ICONS[item.type] || Sword;
    const bgClass = RARITY_BG[item.rarity] || RARITY_BG.common;
    
    const isLegendary = item.rarity === 'legendary';
    const isMythic = item.rarity === 'mythic';

    return (
        <div className={`
            relative flex items-center justify-center rounded shadow-inner overflow-hidden
            ${bgClass}
            ${showRarityBorder ? 'border border-white/20' : ''}
            ${isLegendary ? 'shadow-[0_0_10px_rgba(245,158,11,0.3)]' : ''}
            ${isMythic ? 'shadow-[0_0_15px_rgba(220,38,38,0.5)]' : ''}
        `} style={{ width: size, height: size }}>
            
            {/* Icon */}
            <IconComponent 
                size={size * 0.6} 
                className={`
                    text-white/90 drop-shadow-lg transform
                    ${isLegendary ? 'text-amber-100' : ''}
                    ${isMythic ? 'text-red-100' : ''}
                `} 
                strokeWidth={1.5}
            />
            
            {/* Inner Glow / Shine */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/10 pointer-events-none" />
            
            {/* Legendary/Mythic Particles Effect (CSS only) */}
            {(isLegendary || isMythic) && (
                <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
            )}
        </div>
    );
};
