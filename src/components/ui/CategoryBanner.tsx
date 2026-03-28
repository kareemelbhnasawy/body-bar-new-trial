import React from 'react';
import { CATEGORIES } from '../../lib/categories';

interface CategoryBannerProps {
    filterKey: string;
    /** Override subtitle from CATEGORIES.desc */
    subtitle?: string;
}

export function CategoryBanner({ filterKey, subtitle }: CategoryBannerProps) {
    const cat = CATEGORIES.find(c => c.filterKey === filterKey);
    if (!cat) return null;

    const Icon = cat.icon;

    return (
        <div className="relative overflow-hidden bg-body-card border-b border-body-border">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${cat.img})` }}
            />
            {/* Dark overlay — stronger at left for readability, fades right */}
            <div className="absolute inset-0 bg-linear-to-r from-body-dark/90 via-body-dark/60 to-transparent" />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
                <div className="max-w-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <Icon size={18} style={{ color: cat.color }} />
                        <span
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: cat.color }}
                        >
                            {cat.label}
                        </span>
                    </div>
                    <h1 className="font-display text-5xl sm:text-6xl font-black uppercase text-white tracking-tight text-balance leading-none mb-3">
                        {cat.label === 'Personal Training' ? 'Personal\nTraining' : cat.label}
                    </h1>
                    <p className="text-body-muted text-base max-w-sm text-pretty">
                        {subtitle ?? cat.desc}
                    </p>
                </div>
            </div>
        </div>
    );
}
