import React, { useState, useEffect, useRef } from 'react';
import QueryParser from './QueryParser';
import Help from './Help';
import Settings from './Settings';

const SearchHandler = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [invertedColors, setInvertedColors] = useState(
    JSON.parse(localStorage.getItem('invertColorCookie') || 'false')
  );
  const inputRef = useRef(null);

  // Configuração dos sites/comandos
  const commands = [
    // General
    { key: 'g', name: 'GitHub', url: 'https://github.com', search: '/search?q={}', category: 'General', color: '#333', quickLaunch: true },
    { key: 'gm', name: 'Gmail', url: 'https://mail.google.com', category: 'General', color: '#EA4335' },
    { key: 'gd', name: 'Google Drive', url: 'https://drive.google.com', category: 'General', color: '#4285F4' },
    { key: 'cal', name: 'Google Calendar', url: 'https://calendar.google.com', category: 'General', color: '#4285F4' },
    
    // Programming
    { key: 'so', name: 'Stack Overflow', url: 'https://stackoverflow.com', search: '/search?q={}', category: 'Programming', color: '#F48024' },
    { key: 'mdn', name: 'MDN Web Docs', url: 'https://developer.mozilla.org', search: '/en-US/search?q={}', category: 'Programming', color: '#000' },
    { key: 'npm', name: 'NPM', url: 'https://npmjs.com', search: '/search?q={}', category: 'Programming', color: '#CB3837' },
    { key: 'gh', name: 'GitHub Issues', url: 'https://github.com/issues', category: 'Programming', color: '#333' },
    
    // Social
    { key: 'r', name: 'Reddit', url: 'https://reddit.com', search: '/search?q={}', category: 'Social', color: '#FF4500', quickLaunch: true },
    { key: 'tw', name: 'Twitter', url: 'https://twitter.com', search: '/search?q={}', category: 'Social', color: '#1DA1F2' },
    { key: 'li', name: 'LinkedIn', url: 'https://linkedin.com', search: '/search/results/all/?keywords={}', category: 'Social', color: '#0077B5' },
    
    // Entertainment
    { key: 'y', name: 'YouTube', url: 'https://youtube.com', search: '/results?search_query={}', category: 'Entertainment', color: '#FF0000', quickLaunch: true },
    { key: 'n', name: 'Netflix', url: 'https://netflix.com', search: '/search?q={}', category: 'Entertainment', color: '#E50914' },
    { key: 'sp', name: 'Spotify', url: 'https://open.spotify.com', search: '/search/{}', category: 'Entertainment', color: '#1DB954' },
    
    // Default search
    { key: '*', name: 'Google Search', url: 'https://google.com', search: '/search?q={}', category: 'Search', color: '#4285F4' }
  ];

  const queryParser = new QueryParser(commands);

  // Aplicar tema
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (invertedColors) {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#000000');
      body.classList.add('light-theme');
    } else {
      root.style.setProperty('--background', '#101010');
      root.style.setProperty('--foreground', '#d4d4d4');
      body.classList.remove('light-theme');
    }
  }, [invertedColors]);

  // Aplicar background baseado no comando
  const applyBackground = (query) => {
    const parsed = queryParser.parse(query);
    const body = document.body;

    if (parsed.command && parsed.command.color && query) {
      const color = parsed.command.color;
      const opacity = invertedColors ? '0.05' : '0.1';
      body.style.background = `linear-gradient(135deg, ${color}${opacity.replace('0.', '')}, transparent)`;
    } else if (!query) {
      body.style.background = '';
    }
  };

  // Processar comandos especiais
  const handleSpecialCommands = (query) => {
    queryParser.processSpecialCommand(query, {
      onHelp: () => setShowHelp(true),
      onQuickLaunch: () => {
        commands.filter(cmd => cmd.quickLaunch).forEach(cmd => {
          window.open(cmd.url, '_blank');
        });
        hideSearch();
      },
      onInvertColors: () => {
        const newValue = !invertedColors;
        setInvertedColors(newValue);
        localStorage.setItem('invertColorCookie', JSON.stringify(newValue));
        hideSearch();
      },
      onToggleKeys: () => {
        const currentValue = JSON.parse(localStorage.getItem('showKeysCookie') || 'false');
        localStorage.setItem('showKeysCookie', JSON.stringify(!currentValue));
        hideSearch();
      },
      onCategoryLaunch: (categoryIndex) => {
        const categories = [...new Set(commands.map(cmd => cmd.category).filter(Boolean))];
        const targetCategory = categories[categoryIndex];
        if (targetCategory) {
          commands.filter(cmd => cmd.category === targetCategory).forEach(cmd => {
            window.open(cmd.url, '_blank');
          });
        }
        hideSearch();
      }
    });

    // Comando settings! adicional
    if (query === 'settings!') {
      setShowSettings(true);
      hideSearch();
    }
  };

  // Processar input
  const handleSubmit = (value = inputValue) => {
    if (!value.trim()) return;

    const parsed = queryParser.parse(value);

    if (parsed.isSpecialCommand || value === 'settings!') {
      handleSpecialCommands(value);
      return;
    }

    if (parsed.redirect) {
      window.open(parsed.redirect, '_blank');
      hideSearch();
    }
  };

  // Mostrar busca
  const showSearch = () => {
    setIsVisible(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Esconder busca
  const hideSearch = () => {
    setIsVisible(false);
    setInputValue('');
    applyBackground('');
  };

  // Handlers de eventos
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    applyBackground(value);

    // Auto-redirect para comandos simples se configurado
    // Só ativar se o valor foi digitado (não apagado) e tem exatamente 1 caractere
    const instantRedirect = JSON.parse(localStorage.getItem('instantRedirect') || 'false');
    const parsed = queryParser.parse(value);

    // Verificar se é uma adição de caractere (não remoção)
    const isAddingCharacter = value.length > inputValue.length;

    if (instantRedirect && parsed.isKey && value.length === 1 && isAddingCharacter) {
      setTimeout(() => handleSubmit(value), 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      hideSearch();
    }
  };

  const handleInputBlur = () => {
    // Delay para permitir cliques em sugestões
    setTimeout(() => {
      if (!inputValue.trim()) {
        hideSearch();
      }
    }, 150);
  };

  // Event listeners globais
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ignorar se já estiver digitando ou modais abertos
      if (isVisible || showHelp || showSettings) {
        return;
      }

      // Ignorar se o foco está em um input, textarea ou elemento editável
      if (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.isContentEditable ||
          e.target.closest('input') ||
          e.target.closest('textarea')) {
        return;
      }

      // Mostrar busca apenas para teclas de caracteres (não para teclas especiais como Backspace)
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        showSearch();

        // Adicionar a tecla pressionada ao input
        setInputValue(e.key);
        applyBackground(e.key);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isVisible, showHelp, showSettings]);

  return (
    <>
      {/* Search Form */}
      {isVisible && (
        <>
          {/* Overlay */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 998,
              backdropFilter: 'blur(2px)'
            }}
            onClick={hideSearch}
          />
          
          {/* Search Container */}
          <div 
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 999,
              width: '90%',
              maxWidth: '600px',
              pointerEvents: 'auto'
            }}
          >
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: `var(--background)`,
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                border: `1px solid ${invertedColors ? '#cccccc' : '#333333'}`,
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
                placeholder="Digite um comando ou URL..."
                style={{
                  flex: 1,
                  padding: '20px 24px',
                  fontSize: '18px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--foreground)',
                  fontFamily: 'Geist, sans-serif'
                }}
              />
              
              {/* Indicador do comando atual */}
              {inputValue && (
                <div style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  opacity: 0.7,
                  borderLeft: `1px solid ${invertedColors ? '#cccccc' : '#333333'}`,
                  color: 'var(--foreground)'
                }}>
                  {(() => {
                    const parsed = queryParser.parse(inputValue);
                    if (parsed.isSpecialCommand || inputValue === 'settings!') return '⚡ Comando especial';
                    if (parsed.isUrl) return '🌐 URL';
                    if (parsed.isSearch) return `🔍 Buscar em ${parsed.command?.name}`;
                    if (parsed.isPath) return `📁 Ir para ${parsed.command?.name}`;
                    if (parsed.isKey) return `➡️ ${parsed.command?.name}`;
                    return '🔍 Busca padrão';
                  })()}
                </div>
              )}
            </form>

            {/* Dicas rápidas */}
            {!inputValue && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: 'var(--background)',
                borderRadius: '8px',
                fontSize: '12px',
                opacity: 0.8,
                border: `1px solid ${invertedColors ? '#e0e0e0' : '#333333'}`,
                color: 'var(--foreground)'
              }}>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Comandos rápidos:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '4px' }}>
                  <div><code style={{ backgroundColor: invertedColors ? '#f0f0f0' : '#2a2a2a', padding: '2px 4px', borderRadius: '3px' }}>?</code> → Ajuda</div>
                  <div><code style={{ backgroundColor: invertedColors ? '#f0f0f0' : '#2a2a2a', padding: '2px 4px', borderRadius: '3px' }}>q!</code> → Quick Launch</div>
                  <div><code style={{ backgroundColor: invertedColors ? '#f0f0f0' : '#2a2a2a', padding: '2px 4px', borderRadius: '3px' }}>settings!</code> → Configurações</div>
                  <div><code style={{ backgroundColor: invertedColors ? '#f0f0f0' : '#2a2a2a', padding: '2px 4px', borderRadius: '3px' }}>g:react</code> → Buscar no GitHub</div>
                  <div><code style={{ backgroundColor: invertedColors ? '#f0f0f0' : '#2a2a2a', padding: '2px 4px', borderRadius: '3px' }}>r/programming</code> → Subreddit</div>
                  <div><code style={{ backgroundColor: invertedColors ? '#f0f0f0' : '#2a2a2a', padding: '2px 4px', borderRadius: '3px' }}>invert!</code> → Inverter cores</div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Help Modal */}
      {showHelp && (
        <Help 
          commands={commands}
          onClose={() => setShowHelp(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
};

export default SearchHandler;