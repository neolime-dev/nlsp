import React, { useState, useEffect } from 'react';

const Settings = ({ onClose }) => {
  // Estados das configurações
  const [settings, setSettings] = useState({
    invertedColors: JSON.parse(localStorage.getItem('invertColorCookie') || 'false'),
    showKeys: JSON.parse(localStorage.getItem('showKeysCookie') || 'false'),
    twentyFourHourClock: JSON.parse(localStorage.getItem('twentyFourHourClock') || 'false'),
    clockDelimiter: localStorage.getItem('clockDelimiter') || ':',
    showDate: JSON.parse(localStorage.getItem('showDate') || 'true'),
    showClockIndicators: JSON.parse(localStorage.getItem('showClockIndicators') || 'true'),
    instantRedirect: JSON.parse(localStorage.getItem('instantRedirect') || 'false'),
    openInNewTab: JSON.parse(localStorage.getItem('openInNewTab') || 'true'),
    enableSuggestions: JSON.parse(localStorage.getItem('enableSuggestions') || 'true'),
    maxSuggestions: parseInt(localStorage.getItem('maxSuggestions') || '5'),
    searchDelimiter: localStorage.getItem('searchDelimiter') || ':',
    pathDelimiter: localStorage.getItem('pathDelimiter') || '/'
  });

  // Aplicar configuração
  const applySetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(
      key === 'invertedColors' ? 'invertColorCookie' :
      key === 'showKeys' ? 'showKeysCookie' :
      key,
      typeof value === 'boolean' ? JSON.stringify(value) : value.toString()
    );

    // Aplicar tema imediatamente se for cores invertidas
    if (key === 'invertedColors') {
      const root = document.documentElement;
      const body = document.body;
      
      if (value) {
        root.style.setProperty('--background', '#ffffff');
        root.style.setProperty('--foreground', '#000000');
        body.classList.add('light-theme');
      } else {
        root.style.setProperty('--background', '#101010');
        root.style.setProperty('--foreground', '#d4d4d4');
        body.classList.remove('light-theme');
      }
    }

    // Disparar evento customizado para outras partes da aplicação
    window.dispatchEvent(new Event('settingsChanged'));
  };

  // Exportar configurações
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sttp-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Importar configurações
  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        
        // Validar e aplicar configurações
        Object.entries(importedSettings).forEach(([key, value]) => {
          if (settings.hasOwnProperty(key)) {
            applySetting(key, value);
          }
        });
        
        alert('Configurações importadas com sucesso!');
      } catch (error) {
        alert('Erro ao importar configurações. Verifique se o arquivo é válido.');
      }
    };
    reader.readAsText(file);
  };

  // Reset configurações
  const resetSettings = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
      const defaultSettings = {
        invertedColors: false,
        showKeys: false,
        twentyFourHourClock: false,
        clockDelimiter: ':',
        showDate: true,
        showClockIndicators: true,
        instantRedirect: false,
        openInNewTab: true,
        enableSuggestions: true,
        maxSuggestions: 5,
        searchDelimiter: ':',
        pathDelimiter: '/'
      };

      Object.entries(defaultSettings).forEach(([key, value]) => {
        applySetting(key, value);
      });
    }
  };

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
        zIndex: 10001,
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
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          border: `1px solid ${settings.invertedColors ? '#e0e0e0' : '#333333'}`,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: `1px solid ${settings.invertedColors ? '#e0e0e0' : '#333333'}`,
          paddingBottom: '16px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '600'
          }}>
            ⚙️ Configurações
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

        {/* Configurações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Aparência */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--foreground)' }}>
              🎨 Aparência
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.invertedColors}
                  onChange={(e) => applySetting('invertedColors', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Tema claro (cores invertidas)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.showKeys}
                  onChange={(e) => applySetting('showKeys', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Mostrar teclas ao invés de ícones</span>
              </label>
            </div>
          </div>

          {/* Relógio */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--foreground)' }}>
              🕐 Relógio
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.twentyFourHourClock}
                  onChange={(e) => applySetting('twentyFourHourClock', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Formato 24 horas</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.showDate}
                  onChange={(e) => applySetting('showDate', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Mostrar data abaixo do relógio</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.showClockIndicators}
                  onChange={(e) => applySetting('showClockIndicators', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Mostrar indicadores do relógio (12h/24h, delimitador)</span>
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>Delimitador do relógio:</span>
                <select
                  value={settings.clockDelimiter}
                  onChange={(e) => applySetting('clockDelimiter', e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${settings.invertedColors ? '#cccccc' : '#444444'}`,
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '14px'
                  }}
                >
                  <option value=":">: (dois pontos)</option>
                  <option value=" "> (espaço)</option>
                  <option value=".">. (ponto)</option>
                  <option value="-">- (hífen)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--foreground)' }}>
              🌐 Navegação
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.instantRedirect}
                  onChange={(e) => applySetting('instantRedirect', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Redirecionamento instantâneo para comandos simples</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.openInNewTab}
                  onChange={(e) => applySetting('openInNewTab', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Abrir links em nova aba</span>
              </label>
            </div>
          </div>

          {/* Sugestões */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--foreground)' }}>
              💡 Sugestões
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.enableSuggestions}
                  onChange={(e) => applySetting('enableSuggestions', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Ativar sugestões</span>
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>Máximo de sugestões:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={settings.maxSuggestions}
                  onChange={(e) => applySetting('maxSuggestions', parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '30px', textAlign: 'center' }}>{settings.maxSuggestions}</span>
              </div>
            </div>
          </div>

          {/* Delimitadores */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--foreground)' }}>
              🔧 Delimitadores
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ minWidth: '120px' }}>Busca (g:termo):</span>
                <input
                  type="text"
                  value={settings.searchDelimiter}
                  onChange={(e) => applySetting('searchDelimiter', e.target.value)}
                  maxLength="1"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${settings.invertedColors ? '#cccccc' : '#444444'}`,
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '14px',
                    width: '60px',
                    textAlign: 'center'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ minWidth: '120px' }}>Path (r/sub):</span>
                <input
                  type="text"
                  value={settings.pathDelimiter}
                  onChange={(e) => applySetting('pathDelimiter', e.target.value)}
                  maxLength="1"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${settings.invertedColors ? '#cccccc' : '#444444'}`,
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '14px',
                    width: '60px',
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: `1px solid ${settings.invertedColors ? '#e0e0e0' : '#333333'}`
        }}>
          <button
            onClick={exportSettings}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📤 Exportar
          </button>

          <label style={{ flex: 1 }}>
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              style={{ display: 'none' }}
            />
            <div style={{
              padding: '12px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              📥 Importar
            </div>
          </label>

          <button
            onClick={resetSettings}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;