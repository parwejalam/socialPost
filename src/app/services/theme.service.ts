import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

export interface ThemeConfig {
    name: Theme;
    colors: {
        bgStart: string;
        bgEnd: string;
        text: string;
        textSecondary: string;
        border: string;
        card: string;
        hover: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private currentTheme: Theme = 'light';
    private themeSubject = new BehaviorSubject<Theme>(this.currentTheme);

    // Theme configurations with your specified colors
    private themeConfigs: Record<Theme, ThemeConfig> = {
        light: {
            name: 'light',
            colors: {
                bgStart: '#c7ddeb',
                bgEnd: '#a0b3c1',
                text: '#1f2937',
                textSecondary: '#6b7280',
                border: '#e5e7eb',
                card: '#ffffff',
                hover: '#f3f4f6'
            }
        },
        dark: {
            name: 'dark',
            colors: {
                bgStart: '#394553',
                bgEnd: '#0d1f31',
                text: '#f9fafb',
                textSecondary: '#d1d5db',
                border: '#374151',
                card: '#1f2937',
                hover: '#374151'
            }
        }
    };

    constructor() {
        // Load theme from localStorage or default to light
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
        }
        this.applyTheme();
    }

    // Get current theme as observable
    getTheme() {
        return this.themeSubject.asObservable();
    }

    // Get current theme value
    getCurrentTheme(): Theme {
        return this.currentTheme;
    }

    // Get theme configuration
    getThemeConfig(theme?: Theme): ThemeConfig {
        return this.themeConfigs[theme || this.currentTheme];
    }

    // Toggle between light and dark theme
    toggleTheme(): void {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        this.themeSubject.next(this.currentTheme);
    }

    // Set specific theme
    setTheme(theme: Theme): void {
        if (theme !== this.currentTheme) {
            this.currentTheme = theme;
            this.applyTheme();
            this.saveTheme();
            this.themeSubject.next(this.currentTheme);
        }
    }

    // Apply theme to document
    private applyTheme(): void {
        const root = document.documentElement;
        const config = this.themeConfigs[this.currentTheme];

        // Remove existing theme classes
        root.classList.remove('light', 'dark');

        // Add current theme class
        root.classList.add(this.currentTheme);

        // Set CSS custom properties for dynamic theming
        root.style.setProperty('--theme-bg-start', config.colors.bgStart);
        root.style.setProperty('--theme-bg-end', config.colors.bgEnd);
        root.style.setProperty('--theme-text', config.colors.text);
        root.style.setProperty('--theme-text-secondary', config.colors.textSecondary);
        root.style.setProperty('--theme-border', config.colors.border);
        root.style.setProperty('--theme-card', config.colors.card);
        root.style.setProperty('--theme-hover', config.colors.hover);
    }

    // Save theme to localStorage
    private saveTheme(): void {
        localStorage.setItem('theme', this.currentTheme);
    }

    // Method to dynamically update colors (for future customization)
    updateThemeColors(theme: Theme, colors: Partial<ThemeConfig['colors']>): void {
        this.themeConfigs[theme].colors = {
            ...this.themeConfigs[theme].colors,
            ...colors
        };

        // Apply immediately if it's the current theme
        if (theme === this.currentTheme) {
            this.applyTheme();
        }
    }

    // Update specific color for current theme
    updateCurrentThemeColor(colorKey: keyof ThemeConfig['colors'], colorValue: string): void {
        this.themeConfigs[this.currentTheme].colors[colorKey] = colorValue;
        this.applyTheme();
    }

    // Get current theme colors
    getCurrentColors(): ThemeConfig['colors'] {
        return this.themeConfigs[this.currentTheme].colors;
    }

    // Reset theme to default colors
    resetThemeToDefault(theme: Theme): void {
        const defaultConfigs = {
            light: {
                bgStart: '#c7ddeb',
                bgEnd: '#a0b3c1',
                text: '#1f2937',
                textSecondary: '#6b7280',
                border: '#e5e7eb',
                card: '#ffffff',
                hover: '#f3f4f6'
            },
            dark: {
                bgStart: '#394553',
                bgEnd: '#0d1f31',
                text: '#f9fafb',
                textSecondary: '#d1d5db',
                border: '#374151',
                card: '#1f2937',
                hover: '#374151'
            }
        };

        this.themeConfigs[theme].colors = defaultConfigs[theme];

        if (theme === this.currentTheme) {
            this.applyTheme();
        }
    }

    // Get gradient class for current theme
    getGradientClass(): string {
        return this.currentTheme === 'light' ? 'bg-gradient-light' : 'bg-gradient-dark';
    }

    // Check if current theme is dark
    isDarkTheme(): boolean {
        return this.currentTheme === 'dark';
    }

    // Export current theme configuration (for backup/sharing)
    exportThemeConfig(): Record<Theme, ThemeConfig> {
        return JSON.parse(JSON.stringify(this.themeConfigs));
    }

    // Import theme configuration (for restore/sharing)
    importThemeConfig(configs: Record<Theme, ThemeConfig>): void {
        this.themeConfigs = configs;
        this.applyTheme();
    }
}
