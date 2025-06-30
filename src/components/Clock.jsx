import React, { useState, useEffect } from 'react';

const Clock = ({ onToggleHelp }) => {
  const [time, setTime] = useState(new Date());
  const [twentyFourHour, setTwentyFourHour] = useState(
    JSON.parse(localStorage.getItem('twentyFourHourClock') || 'false')
  );
  const [delimiter, setDelimiter] = useState(
    localStorage.getItem('clockDelimiter') || ':'
  );
  const [showDate, setShowDate] = useState(
    JSON.parse(localStorage.getItem('showDate') || 'true')
  );
  const [showClockIndicators, setShowClockIndicators] = useState(
    JSON.parse(localStorage.getItem('showClockIndicators') || 'true')
  );

  // Atualizar tempo a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Escutar mudanças no localStorage para atualizar configurações em tempo real
  useEffect(() => {
    const handleStorageChange = () => {
      setTwentyFourHour(JSON.parse(localStorage.getItem('twentyFourHourClock') || 'false'));
      setDelimiter(localStorage.getItem('clockDelimiter') || ':');
      setShowDate(JSON.parse(localStorage.getItem('showDate') || 'true'));
      setShowClockIndicators(JSON.parse(localStorage.getItem('showClockIndicators') || 'true'));
    };

    // Escutar mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Também escutar mudanças customizadas (para quando mudanças são feitas na mesma aba)
    window.addEventListener('settingsChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settingsChanged', handleStorageChange);
    };
  }, []);

  // Formatar tempo
  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    let amPm = '';

    if (!twentyFourHour) {
      amPm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }

    const formattedHours = twentyFourHour ? 
      hours.toString().padStart(2, '0') : 
      hours.toString();
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return {
      time: `${formattedHours}${delimiter}${formattedMinutes}`,
      amPm: amPm
    };
  };

  const { time: formattedTime, amPm } = formatTime();

  // Toggle formato 12h/24h ao clicar com Ctrl
  const handleClick = (e) => {
    if (e.ctrlKey) {
      const newFormat = !twentyFourHour;
      setTwentyFourHour(newFormat);
      localStorage.setItem('twentyFourHourClock', JSON.stringify(newFormat));
      // Disparar evento customizado para outras partes da aplicação
      window.dispatchEvent(new Event('settingsChanged'));
    } else if (e.shiftKey) {
      // Alternar delimitador com Shift+Click
      const delimiters = [':', ' ', '.', '-'];
      const currentIndex = delimiters.indexOf(delimiter);
      const nextDelimiter = delimiters[(currentIndex + 1) % delimiters.length];
      setDelimiter(nextDelimiter);
      localStorage.setItem('clockDelimiter', nextDelimiter);
      // Disparar evento customizado para outras partes da aplicação
      window.dispatchEvent(new Event('settingsChanged'));
    } else {
      // Clique normal abre ajuda
      if (onToggleHelp) onToggleHelp();
    }
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        userSelect: 'none',
        textAlign: 'center',
        zIndex: 100,
        pointerEvents: 'auto'
      }}
      title="Clique para abrir ajuda • Ctrl+Click para alternar 12h/24h • Shift+Click para mudar delimitador"
    >
      <div style={{
        fontSize: 'clamp(4rem, 12vw, 8rem)',
        fontWeight: '300',
        color: 'var(--foreground)',
        letterSpacing: '-0.02em',
        lineHeight: '1',
        fontFamily: 'Geist, system-ui, -apple-system, sans-serif',
        transition: 'all 0.3s ease',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
      }}>
        {formattedTime}
        {amPm && (
          <span style={{
            fontSize: '0.3em',
            opacity: 0.7,
            marginLeft: '0.2em',
            verticalAlign: 'top'
          }}>
            {amPm}
          </span>
        )}
      </div>
      
      {/* Data - Condicional */}
      {showDate && (
        <div style={{
          fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
          opacity: 0.6,
          marginTop: '0.5rem',
          color: 'var(--foreground)',
          fontWeight: '400'
        }}>
          {time.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )}

      {/* Indicadores de funcionalidade - Condicional */}
      {showClockIndicators && (
        <div style={{
          position: 'absolute',
          bottom: showDate ? '-60px' : '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.7rem',
          opacity: 0.4,
          whiteSpace: 'nowrap',
          color: 'var(--foreground)',
          transition: 'bottom 0.3s ease'
        }}>
          {twentyFourHour ? '24h' : '12h'} • {delimiter === ':' ? 'dois pontos' : delimiter === ' ' ? 'espaço' : delimiter === '.' ? 'ponto' : 'hífen'}
        </div>
      )}
    </div>
  );
};

export default Clock;