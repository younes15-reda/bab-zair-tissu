import React, { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [dots, setDots] = useState(1);
  const [progress, setProgress] = useState(15);

  // Animation des points de chargement
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(d => (d % 3) + 1);
    }, 500);
    return () => clearInterval(dotsInterval);
  }, []);

  // Barre de progression simulée (s'arrête à 85% en attendant Firestore)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 85) return 85;
        return p + Math.random() * 8;
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdf6f0 0%, #fff8f3 50%, #fef3e8 100%)',
        fontFamily: "'Segoe UI', 'Arial', sans-serif",
      }}
    >
      {/* Cercles décoratifs d'arrière-plan */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(194,120,60,0.08) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        left: '-60px',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(194,120,60,0.06) 0%, transparent 70%)',
      }} />

      {/* Contenu principal */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', zIndex: 1 }}>

        {/* Logo / Icône animée */}
        <div style={{ position: 'relative', width: '90px', height: '90px' }}>
          {/* Anneau extérieur animé */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#c2783c',
            borderRightColor: '#c2783c',
            animation: 'spin 1s linear infinite',
          }} />
          {/* Anneau intérieur animé (sens inverse) */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: '#e8a56a',
            borderLeftColor: '#e8a56a',
            animation: 'spinReverse 0.8s linear infinite',
          }} />
          {/* Icône tissu au centre */}
          <div style={{
            position: 'absolute',
            inset: '20px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c2783c, #e8a56a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}>
            🧵
          </div>
        </div>

        {/* Nom du magasin */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#2c1810',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px',
          }}>
            Le Tissu Bab Zir 2
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#8b6a4e',
            margin: 0,
            fontWeight: '500',
          }}>
            اقمشة وسكاي باب زير 2 · تلمسان
          </p>
        </div>

        {/* Barre de progression */}
        <div style={{ width: '220px' }}>
          <div style={{
            height: '4px',
            background: '#f0e0d0',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, #c2783c, #e8a56a)',
              borderRadius: '10px',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <p style={{
            textAlign: 'center',
            marginTop: '10px',
            fontSize: '12px',
            color: '#b08060',
            fontWeight: '600',
          }}>
            Chargement{'.'.repeat(dots)}
          </p>
        </div>

        {/* Points de chargement */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '-10px' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#c2783c',
                opacity: dots > i ? 1 : 0.25,
                transform: dots > i ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Animations CSS inline */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
