
import React from 'react';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageProvider';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { 
      code: 'pt' as const, 
      name: 'Português (Brasil)', 
      nativeName: 'Português',
      flag: '🇧🇷',
      region: 'Brasil'
    },
    { 
      code: 'de' as const, 
      name: 'Deutsch (Deutschland)', 
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      region: 'Deutschland'
    },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-auto px-2 gap-2 hover:bg-muted transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block text-xs font-medium">
            {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
          </span>
          <span className="sr-only">
            {t('language.choose')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            {t('language.choose')}
          </p>
        </div>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
              language === lang.code 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <span className="text-lg" role="img" aria-label={lang.region}>
              {lang.flag}
            </span>
            <div className="flex-1">
              <div className="font-medium text-sm">
                {lang.nativeName}
              </div>
              <div className="text-xs text-muted-foreground">
                {lang.region}
              </div>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground">
            {t('language.more_coming')}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
