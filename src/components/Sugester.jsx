import React, { useState, useEffect, useRef } from 'react';

const Sugester = ({ enabled = true, limit = 6 }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Configuração completa de comandos baseada no config.js
  const commands = [
    // General
    { name: 'Gmail', key: 'm', url: 'https://gmail.com', search: '/#search/text={}', color: 'linear-gradient(135deg, #dd5145, #dd5145)' },
    { name: 'Drive', key: 'd', url: 'https://drive.google.com', search: '/drive/search?q={}', color: 'linear-gradient(135deg, #FFD04B, #1EA362, #4688F3)' },
    { name: 'Telegram', key: 'tg', url: 'https://web.telegram.org', color: '#5682a3' },
    { name: 'WhatsApp', key: 'w', url: 'https://web.whatsapp.com', color: 'linear-gradient(135deg, #25D366, #128C7E, #075E54)' },
    { name: 'Discord', key: 'dc', url: 'https://discord.com/app', color: '#7289da' },

    // Programming
    { name: 'GitHub', key: 'g', url: 'https://github.com', search: '/search?q={}', color: 'linear-gradient(135deg, #2b2b2b, #3b3b3b)' },
    { name: 'StackOverflow', key: 'st', url: 'https://stackoverflow.com', search: '/search?q={}', color: 'linear-gradient(135deg, #53341C, #F48024)' },
    { name: 'HackerNews', key: 'h', url: 'https://news.ycombinator.com/', search: '/search?stories[query]={}', color: 'linear-gradient(135deg, #FF6600, #DC5901)' },
    { name: 'MDN', key: 'md', url: 'https://developer.mozilla.org/en-US', search: '/search?q={}', color: '#212121' },
    { name: 'DevDocs', key: 'dd', url: 'https://devdocs.io', color: 'linear-gradient(135deg, #33373A, #484949)' },

    // Fun
    { name: 'YouTube', key: 'y', url: 'https://youtube.com', search: '/results?search_query={}', color: 'linear-gradient(135deg, #cd201f, #cd4c1f)' },
    { name: 'Reddit', key: 'r', url: 'https://reddit.com', search: '/search?q={}', color: 'linear-gradient(135deg, #FF8456, #FF4500)' },
    { name: 'Netflix', key: 'n', url: 'https://www.netflix.com', color: 'linear-gradient(135deg, #E50914, #CB020C)' },
    { name: 'Spotify', key: 's', url: 'https://open.spotify.com/', search: '/search/{}', color: '#1dd35e' },
    { name: 'Twitch', key: 'tw', url: 'https://www.twitch.tv', search: '/directory/game/{}', color: 'linear-gradient(135deg, #6441a5, #4b367c)' },

    // Social/Other
    { name: 'Twitter', key: 't', url: 'https://www.twitter.com', search: '/search?q={}&src=typed_query', color: 'linear-gradient(135deg, #1DA1F2, #19608F)' },
    { name: 'Instagram', key: 'i', url: 'https://www.instagram.com', color: 'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)' },
    { name: 'LinkedIn', key: 'l', url: 'https://linkedin.com', search: '/search/results/all/?keywords={}', color: 'linear-gradient(135deg, #006CA4, #0077B5)' },
    { name: 'Notion', key: 'ns', url: 'https://www.notion.so', color: 'linear-gradient(135deg, #FFF, #3F3F3F)' },
    { name: 'Translate', key: 'tr', url: 'https://translate.google.com/', search: '/#view=home&op=translate&sl=auto&tl=en&text={}', color: '#1a73e8' },

    // Adicionais do seu sistema atual
    { name: 'Monkeytype', key: 'mk', url: 'https://monkeytype.com/', color: '#323437' },
    { name: 'HackTheBox', key: 'htb', url: 'https://hackthebox.com/', color: 'linear-gradient(135deg, #1A2332, #111927)' },
    { name: 'TryHackMe', key: 'thm', url: 'https://tryhackme.com/', color: 'linear-gradient(135deg, #1C2538, #161E2D)' },
    { name: 'Prime Video', key: 'pv', url: 'https://primevideo.com/', color: '#1b242f' },
    { name: 'Pinterest', key: 'p', url: 'https://pinterest.com/', color: '#c42027' },
    { name: 'AliExpress', key: 'a', url: 'https://aliexpress.com/', color: 'linear-gradient(135deg, #E52D03, #FD9300)' },
    { name: 'Trello', key: 'tr', url: 'https://trello.com/', color: '#0077bd' },
    { name: 'ChatGPT', key: 'c', url: 'https://chat.openai.com/', color: '#343541' },
    { name: 'Outlook', key: 'o', url: 'https://outlook.com/', color: '#0f6cbd' },
    { name: 'Habbo', key: 'hb', url: 'https://habbo.com/', color: '#f7c600' },
    { name: 'Canva', key: 'cv', url: 'https://canva.com/', color: 'linear-gradient(135deg, #01c3cc, #7d2ae7)' },
    { name: 'Zoho', key: 'z', url: 'https://zoho.com/', color: 'linear-gradient(135deg, #e42527, #089949, #226db4, #f9b21d)' },
    { name: 'Shopee', key: 'sh', url: 'https://shopee.com.br/', color: 'linear-gradient(135deg, #f53d2d, #fe6432)' },
    { name: 'Mercado Livre', key: 'ml', url: 'https://mercadolivre.com.br/', color: '#ffe600' },
    { name: 'Speed Test', key: 'speed', url: 'https://speedtest.net/', color: '#141526' },
    { name: 'Figma', key: 'f', url: 'https://figma.com/', color: '#2c2c2c' }
  ];

  // Sugestões padrão baseadas no defaultSuggestions do config.js
  const defaultSuggestions = {
    g: ['github.com/issues', 'github.com/pulls', 'gist.github.com', 'github.com/trending'],
    r: ['reddit.com/r/unixporn', 'reddit.com/r/startpages', 'reddit.com/r/webdev', 'reddit.com/r/technology', 'reddit.com/r/programming'],
    y: ['youtube.com/trending', 'youtube.com/subscriptions', 'youtube.com/watch?v=', 'youtube.com/playlist'],
    s: ['spotify.com/search', 'spotify.com/browse/featured', 'spotify.com/browse/podcasts', 'spotify.com/browse/charts'],
    t: ['twitter.com/home', 'twitter.com/explore', 'twitter.com/notifications', 'twitter.com/messages'],
    i: ['instagram.com/explore', 'instagram.com/reels', 'instagram.com/stories', 'instagram.com/direct'],
    n: ['netflix.com/browse', 'netflix.com/latest', 'netflix.com/my-list', 'netflix.com/search'],
    m: ['gmail.com/inbox', 'gmail.com/sent', 'gmail.com/drafts', 'gmail.com/starred'],
    d: ['drive.google.com/drive/my-drive', 'drive.google.com/drive/shared-with-me', 'drive.google.com/drive/recent'],
    l: ['linkedin.com/feed', 'linkedin.com/mynetwork', 'linkedin.com/jobs', 'linkedin.com/messaging'],
    tw: ['twitch.tv/directory', 'twitch.tv/following', 'twitch.tv/browse/categories'],
    st: ['stackoverflow.com/questions', 'stackoverflow.com/tags', 'stackoverflow.com/users', 'stackoverflow.com/jobs']
  };

  // Sites populares para sugestões gerais
  const popularSites = [
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
    'linkedin.com', 'github.com', 'stackoverflow.com', 'reddit.com', 'netflix.com',
    'spotify.com', 'twitch.tv', 'discord.com', 'whatsapp.com', 'telegram.org',
    'gmail.com', 'outlook.com', 'drive.google.com', 'dropbox.com', 'notion.so',
    'trello.com', 'slack.com', 'zoom.us', 'microsoft.com', 'apple.com',
    'amazon.com', 'ebay.com', 'aliexpress.com', 'mercadolivre.com.br', 'shopee.com.br',
    'wikipedia.org', 'medium.com', 'dev.to', 'hackernews.com', 'producthunt.com',
    'figma.com', 'canva.com', 'adobe.com', 'unsplash.com', 'pexels.com'
  ];

  // Função para obter domínio de uma URL
  const getDomain = (url) => {
    try {
      const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Função para gerar sugestões baseadas no input
  const getSuggestions = (input) => {
    if (!input || input.length < 1) return [];
    
    const suggestions = new Set();
    const inputLower = input.toLowerCase();

    // 1. Comandos que começam com a tecla
    commands.forEach(command => {
      if (command.key.startsWith(inputLower)) {
        suggestions.add(`${command.key} → ${command.name}`);
      }
    });

    // 2. Sugestões padrão para comandos específicos
    if (defaultSuggestions[inputLower]) {
      defaultSuggestions[inputLower].forEach(suggestion => {
        suggestions.add(suggestion);
      });
    }

    // 3. Sites que começam com o input
    popularSites.forEach(site => {
      if (site.toLowerCase().startsWith(inputLower)) {
        suggestions.add(site);
      }
    });

    // 4. Sites que contêm o input
    popularSites.forEach(site => {
      if (site.toLowerCase().includes(inputLower) && !site.toLowerCase().startsWith(inputLower)) {
        suggestions.add(site);
      }
    });

    // 5. Comandos que contêm o input no nome
    commands.forEach(command => {
      if (command.name.toLowerCase().includes(inputLower) && !command.key.startsWith(inputLower)) {
        suggestions.add(`${command.key} → ${command.name}`);
      }
    });

    // 6. URLs de comandos que começam com o input
    commands.forEach(command => {
      const domain = getDomain(command.url);
      if (domain.startsWith(inputLower)) {
        suggestions.add(command.url);
      }
    });

    // 7. Sugestões de busca populares
    const searchSuggestions = [
      'how to', 'what is', 'best', 'tutorial', 'guide', 'review', 'vs', 'free',
      'download', 'online', 'course', 'learn', 'tips', 'tricks', 'news', 'update'
    ];

    searchSuggestions.forEach(suggestion => {
      if (suggestion.startsWith(inputLower)) {
        suggestions.add(`🔍 ${suggestion}`);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  };

  // Função para destacar texto correspondente
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<b>$1</b>');
  };

  // Handler para clique em sugestão
  const handleSuggestionClick = (suggestion) => {
    const searchInput = document.getElementById('Search');
    if (!searchInput) return;

    // Remove emojis e indicadores
    let cleanSuggestion = suggestion.replace(/🔍\s/, '').replace(/\s→.*$/, '');
    
    // Se é um comando (contém →), usa apenas a chave
    if (suggestion.includes('→')) {
      cleanSuggestion = suggestion.split(' →')[0];
    }

    searchInput.value = cleanSuggestion;
    
    // Simula Enter para processar a sugestão
    const enterEvent = new KeyboardEvent('keypress', {
      code: 'Enter',
      key: 'Enter'
    });
    searchInput.dispatchEvent(enterEvent);
    
    setShowSuggestions(false);
  };

  // Handler para navegação com teclado
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.code) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const searchInput = document.getElementById('Search');
    if (!searchInput) return;

    // Handler para input - agora funciona a partir de 1 caractere
    const handleInput = (e) => {
      const value = e.target.value.trim();
      if (value.length >= 1) {
        const newSuggestions = getSuggestions(value);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
        setHighlightedIndex(-1);
      } else {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    };

    // Handler para focus
    const handleFocus = () => {
      const value = searchInput.value.trim();
      if (value.length >= 1) {
        const newSuggestions = getSuggestions(value);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
      }
    };

    // Handler para blur (com delay para permitir cliques)
    const handleBlur = () => {
      setTimeout(() => {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }, 150);
    };

    // Adiciona event listeners
    searchInput.addEventListener('input', handleInput);
    searchInput.addEventListener('focus', handleFocus);
    searchInput.addEventListener('blur', handleBlur);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      searchInput.removeEventListener('input', handleInput);
      searchInput.removeEventListener('focus', handleFocus);
      searchInput.removeEventListener('blur', handleBlur);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, suggestions, highlightedIndex, showSuggestions]);

  if (!enabled || !showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      ref={suggestionsRef}
      className="search-suggestions"
      style={{
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderRadius: '12px',
        padding: '8px 0',
        minWidth: '350px',
        maxWidth: '600px',
        zIndex: 1000,
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {suggestions.map((suggestion, index) => (
          <li key={suggestion}>
            <button
              type="button"
              className={`search-suggestion ${index === highlightedIndex ? 'highlight' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                width: '100%',
                padding: '12px 20px',
                border: 'none',
                background: index === highlightedIndex ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: suggestion.includes('→') ? '#4CAF50' : suggestion.startsWith('🔍') ? '#2196F3' : '#d4d4d4',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'monospace',
                transition: 'all 0.2s ease',
                borderRadius: index === highlightedIndex ? '8px' : '0',
                margin: index === highlightedIndex ? '2px 8px' : '0'
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              dangerouslySetInnerHTML={{
                __html: highlightMatch(suggestion, document.getElementById('Search')?.value || '')
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sugester;