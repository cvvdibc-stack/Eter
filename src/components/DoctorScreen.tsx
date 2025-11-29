import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Heart, Sparkles, FlaskConical, Coins } from 'lucide-react';
import { calculateDerivedStats } from '../utils/formulas';

interface Service {
    id: string;
    name: string;
    price: number;
    description: string;
    effectLabel: string;
    icon: React.ReactNode;
    rarity: 'common' | 'unique' | 'heroic' | 'legendary';
    action: () => void;
}

export const DoctorScreen: React.FC = () => {
    const { character, healCharacter, payGold, addLog, updateHp } = useGame();
    const [hoveredService, setHoveredService] = useState<{ service: Service, rect: DOMRect } | null>(null);

    if (!character) return null;

    const stats = calculateDerivedStats(
        character.baseStats, 
        character.level, 
        character.profession, 
        character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
        character.activeTalismans || []
    );

    // Logic
    const handleHealFull = () => {
        // Fixed cost 100g as requested in new query (or dynamic if preferred, but user said "100zlota")
        // Let's keep dynamic cost in grid service, but header button is shortcut?
        // User said "przycisk pelnego uzdrowienia 100zlota", implies overriding cost logic or just UI label.
        // Let's make it consistent. I'll use the button in header for the quick heal.
        const cost = 100; 
        if (character.currentHp >= stats.maxHp) {
            addLog("Jesteś już w pełni zdrowy.");
            return;
        }
        // Override default healCharacter check? healCharacter takes cost.
        // But healCharacter in context sets to maxHp.
        healCharacter(cost);
    };

    const handlePotion = (size: 'small' | 'medium' | 'large') => {
        let cost = 0;
        let label = "";
        let healPct = 0;
        
        if (size === 'small') { cost = 20; label = "Mała Mikstura"; healPct = 0.25; }
        else if (size === 'medium') { cost = 45; label = "Średnia Mikstura"; healPct = 0.50; }
        else { cost = 80; label = "Duża Mikstura"; healPct = 0.80; } 

        if (character.currentHp >= stats.maxHp) {
            addLog("Jesteś już w pełni zdrowy.");
            return;
        }

        if (payGold(cost)) {
            const healAmount = Math.floor(stats.maxHp * healPct);
            updateHp(character.currentHp + healAmount);
            addLog(`Kupiono i wypito: ${label} (+${healAmount} HP).`);
        } else {
            addLog("Nie masz wystarczająco złota!");
        }
    };

    const handleCleanse = () => {
        if (payGold(50)) {
            addLog("Oczyszczono z klątw i trucizn.");
        } else {
            addLog("Brak złota.");
        }
    };

    const services: Service[] = [
        { 
            id: 'heal_full', 
            name: 'Pełne Uzdrowienie', 
            price: 100, 
            description: "Medyk opatrzy twoje rany do pełna.", 
            effectLabel: "Leczy 100% HP",
            icon: <Heart size={24} className="text-green-500" fill="currentColor" />,
            rarity: 'legendary',
            action: handleHealFull
        },
        { 
            id: 'pot_s', 
            name: 'Mała Mikstura', 
            price: 20, 
            description: "Szybki łyk na drobne zadrapania.", 
            effectLabel: "Leczy 25% HP",
            icon: <FlaskConical size={24} className="text-blue-400" />,
            rarity: 'common',
            action: () => handlePotion('small')
        },
        { 
            id: 'pot_m', 
            name: 'Średnia Mikstura', 
            price: 45, 
            description: "Solidna dawka życiodajnej energii.", 
            effectLabel: "Leczy 50% HP",
            icon: <FlaskConical size={24} className="text-purple-400" />,
            rarity: 'unique',
            action: () => handlePotion('medium')
        },
        { 
            id: 'pot_l', 
            name: 'Duża Mikstura', 
            price: 80, 
            description: "Potężny eliksir dla weteranów.", 
            effectLabel: "Leczy 80% HP",
            icon: <FlaskConical size={24} className="text-red-500" />,
            rarity: 'heroic',
            action: () => handlePotion('large')
        },
        { 
            id: 'cleanse', 
            name: 'Oczyszczenie', 
            price: 50, 
            description: "Rytuał usuwający negatywne efekty.", 
            effectLabel: "Usuwa Debuffy",
            icon: <Sparkles size={24} className="text-amber-200" />,
            rarity: 'unique',
            action: handleCleanse
        }
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-80px)] flex gap-6 animate-in fade-in duration-300 items-start">
            {/* NPC Panel (Left) */}
            <div className="w-72 bg-slate-900 rounded-xl border-2 border-slate-700 relative overflow-hidden shadow-2xl flex flex-col shrink-0">
                <div className="h-[350px] w-full bg-black/40 relative flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                        src="/avatars/medyk.png" 
                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Medyk'}
                        alt="Medyk" 
                        className="h-full w-full object-cover object-top opacity-90"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent h-16"></div>
                </div>
                <div className="p-4 flex flex-col items-center text-center bg-slate-900">
                    <h2 className="text-2xl font-serif text-blue-400 font-bold leading-none">Medyk</h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Uzdrowiciel</p>
                    
                    <div className="mt-4 p-3 bg-black/30 rounded border border-white/5 w-full">
                        <p className="text-sm text-slate-300 italic leading-relaxed">
                            „Jesteś ranny? Zaraz się tobą zajmę. Mam lekarstwa na każdą dolegliwość.”
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content (Right) */}
            <div className="flex-1 flex flex-col gap-4 h-full min-h-0 items-start">
                
                {/* Header (Reduced Width & Added Button) */}
                <div className="bg-[#1a1d24] border-2 border-blue-900/30 p-4 rounded-lg shadow-inner flex justify-between items-center shrink-0 w-full max-w-[500px]">
                    <div>
                        <h3 className="text-blue-100 font-bold text-lg">Gabinet Lekarski</h3>
                    </div>
                    <button 
                        onClick={handleHealFull}
                        className="px-3 py-1 bg-green-800 hover:bg-green-700 text-white text-xs font-bold rounded border border-green-600 flex items-center gap-2"
                    >
                        <Heart size={14} fill="currentColor" />
                        Ulecz (100 <Coins size={10} className="inline"/>)
                    </button>
                </div>

                {/* Services Grid Container (Reduced Size) */}
                <div className="bg-[#161b22] border border-white/10 rounded-xl p-4 flex flex-col relative h-[380px] w-full max-w-[500px]">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5 shrink-0">
                        <h4 className="font-bold text-slate-200 flex items-center gap-2">
                            <Heart size={18} className="text-green-500"/> Usługi
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-2 content-start">
                        {services.map((service) => (
                            <div 
                                key={service.id}
                                onClick={service.action}
                                onMouseEnter={(e) => setHoveredService({ service, rect: e.currentTarget.getBoundingClientRect() })}
                                onMouseLeave={() => setHoveredService(null)}
                                className={`w-12 h-12 border-2 rounded flex items-center justify-center relative group cursor-pointer transition-colors
                                    bg-[#1a1d24] border-slate-700 hover:border-green-500`}
                            >
                                {service.icon}
                            </div>
                        ))}
                        {/* Empty slots filler to look like grid */}
                        {Array.from({ length: 24 - services.length }).map((_, i) => (
                            <div key={i} className="w-12 h-12 border-2 border-white/5 rounded bg-[#0b0d10]"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom Tooltip for Services */}
            {hoveredService && (
                <div 
                    className="fixed z-[9999] w-64 bg-[#0f1115] border border-slate-600 p-0 rounded shadow-2xl pointer-events-none overflow-hidden"
                    style={{ 
                        top: hoveredService.rect.top < 350 ? hoveredService.rect.bottom + 8 : hoveredService.rect.top - 8, 
                        left: hoveredService.rect.left + (hoveredService.rect.width / 2) - 128,
                        transform: hoveredService.rect.top < 350 ? 'translate(0, 0)' : 'translate(0, -100%)'
                    }}
                >
                    <div className="bg-black/50 p-2 border-b border-slate-700">
                        <h4 className={`font-bold text-base ${
                            hoveredService.service.rarity === 'legendary' ? 'text-orange-400' :
                            hoveredService.service.rarity === 'heroic' ? 'text-blue-400' :
                            hoveredService.service.rarity === 'unique' ? 'text-green-400' : 'text-slate-300'
                        }`}>{hoveredService.service.name}</h4>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Usługa Medyczna</div>
                    </div>
                    <div className="p-3 space-y-2">
                        <div className="text-sm text-slate-200 italic">{hoveredService.service.description}</div>
                        <div className="flex justify-between text-sm font-bold text-green-400 border-t border-white/10 pt-2">
                            <span>Efekt</span>
                            <span>{hoveredService.service.effectLabel}</span>
                        </div>
                    </div>
                    <div className="bg-black/30 p-2 border-t border-slate-700 flex justify-between text-amber-500 font-bold text-xs">
                        <span>Koszt:</span>
                        <span>{hoveredService.service.price} złota</span>
                    </div>
                </div>
            )}
        </div>
    );
};
