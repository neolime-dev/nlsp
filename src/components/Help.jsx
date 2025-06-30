import React, { useState, useEffect } from 'react';
import Settings from './Settings';

const Help = ({ commands, onClose }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showKeys, setShowKeys] = useState(
    JSON.parse(localStorage.getItem('showKeysCookie') || 'false')
  );
  const [invertedColors, setInvertedColors] = useState(
    JSON.parse(localStorage.getItem('invertColorCookie') || 'false')
  );

  // Organizar comandos por categoria
  const categorizedCommands = commands.reduce((acc, cmd) => {
    if (!cmd.category) return acc;
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  // Comandos especiais
  const specialCommands = [
    { key: '?', description: 'Abrir esta ajuda' },
    { key: 'q!', description: 'Quick Launch (abrir sites favoritos)' },
    { key: '1!', description: 'Abrir categoria General' },
    { key: '2!', description: 'Abrir categoria Programming' },
    { key: '3!', description: 'Abrir categoria Social' },
    { key: '4!', description: 'Abrir categoria Entertainment' },
    { key: 'invert!', description: 'Inverter cores (tema claro/escuro)' },
    { key: 'keys!', description: 'Alternar entre ícones e teclas' },
    { key: 'settings!', description: 'Abrir configurações' }
  ];

  // Handlers
  const handleQuickLaunch = () => {
    commands.filter(cmd => cmd.quickLaunch).forEach(cmd => {
      window.open(cmd.url, '_blank');
    });
    onClose();
  };

  const handleToggleKeys = () => {
    const newValue = !showKeys;
    setShowKeys(newValue);
    localStorage.setItem('showKeysCookie', JSON.stringify(newValue));
  };

  const handleInvertColors = () => {
    const newValue = !invertedColors;
    setInvertedColors(newValue);
    localStorage.setItem('invertColorCookie', JSON.stringify(newValue));
    
    // Aplicar tema imediatamente
    const root = document.documentElement;
    const body = document.body;
    
    if (newValue) {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#000000');
      body.classList.add('light-theme');
    } else {
      root.style.setProperty('--background', '#101010');
      root.style.setProperty('--foreground', '#d4d4d4');
      body.classList.remove('light-theme');
    }
  };

  const handleCategoryLaunch = (categoryIndex) => {
    const categories = Object.keys(categorizedCommands);
    const targetCategory = categories[categoryIndex];
    if (targetCategory && categorizedCommands[targetCategory]) {
      categorizedCommands[targetCategory].forEach(cmd => {
        window.open(cmd.url, '_blank');
      });
    }
    onClose();
  };

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showSettings]);

  if (showSettings) {
    return <Settings onClose={() => setShowSettings(false)} />;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          border: `1px solid ${invertedColors ? '#e0e0e0' : '#333333'}`,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: `1px solid ${invertedColors ? '#e0e0e0' : '#333333'}`,
          paddingBottom: '16px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Ajuda - sttp
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--foreground)',
              opacity: 0.7,
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Botões de ação rápida */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <button
            onClick={handleQuickLaunch}
            style={{
              padding: '12px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            🚀 Quick Launch
          </button>
          
          <button
            onClick={handleToggleKeys}
            style={{
              padding: '12px 16px',
              backgroundColor: showKeys ? '#FF9800' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            {showKeys ? '🔤' : '🎯'} {showKeys ? 'Mostrar Ícones' : 'Mostrar Teclas'}
          </button>
          
          <button
            onClick={handleInvertColors}
            style={{
              padding: '12px 16px',
              backgroundColor: invertedColors ? '#9C27B0' : '#607D8B',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            {invertedColors ? '🌙' : '☀️'} {invertedColors ? 'Tema Escuro' : 'Tema Claro'}
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            style={{
              padding: '12px 16px',
              backgroundColor: '#795548',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            ⚙️ Configurações
          </button>
        </div>

        {/* Grid de conteúdo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Comandos Especiais */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'var(--foreground)'
            }}>
              Comandos Especiais
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {specialCommands.map((cmd, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    backgroundColor: invertedColors ? '#f5f5f5' : '#1a1a1a',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <code style={{
                    backgroundColor: invertedColors ? '#e0e0e0' : '#333333',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginRight: '12px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {cmd.key}
                  </code>
                  <span style={{ opacity: 0.8 }}>{cmd.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Categorias de comandos */}
          {Object.entries(categorizedCommands).map(([category, cmds], categoryIndex) => (
            <div key={category}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0,
                  color: 'var(--foreground)'
                }}>
                  {category}
                </h3>
                <button
                  onClick={() => handleCategoryLaunch(categoryIndex)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${invertedColors ? '#cccccc' : '#444444'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: 'var(--foreground)',
                    opacity: 0.7
                  }}
                >
                  {categoryIndex + 1}! Abrir todos
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {cmds.map((cmd, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: invertedColors ? '#f5f5f5' : '#1a1a1a',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <code style={{
                      backgroundColor: cmd.color || (invertedColors ? '#e0e0e0' : '#333333'),
                      color: cmd.color ? 'white' : 'inherit',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginRight: '12px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {cmd.key}
                    </code>
                    <span style={{ opacity: 0.8 }}>{cmd.name}</span>
                    {cmd.quickLaunch && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '12px',
                        opacity: 0.6
                      }}>
                        ⭐
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Exemplos de uso */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: invertedColors ? '#f0f0f0' : '#1a1a1a',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Exemplos de uso:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
            <div><code style={{ backgroundColor: invertedColors ? '#e0e0e0' : '#333333', padding: '2px 6px', borderRadius: '3px' }}>g:react</code> → Buscar "react" no GitHub</div>
            <div><code style={{ backgroundColor: invertedColors ? '#e0e0e0' : '#333333', padding: '2px 6px', borderRadius: '3px' }}>r/programming</code> → Ir para r/programming</div>
            <div><code style={{ backgroundColor: invertedColors ? '#e0e0e0' : '#333333', padding: '2px 6px', borderRadius: '3px' }}>so:javascript</code> → Buscar no Stack Overflow</div>
            <div><code style={{ backgroundColor: invertedColors ? '#e0e0e0' : '#333333', padding: '2px 6px', borderRadius: '3px' }}>y:tutorial</code> → Buscar no YouTube</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;