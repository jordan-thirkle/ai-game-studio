import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'AI Game Studio';
  const score = searchParams.get('score');
  const status = searchParams.get('status') || '';

  const scoreDisplay = score ? `${score}/3.0` : '';
  const subtitle = status
    ? `${status.toUpperCase()} · Self-Improving AI Agents`
    : 'Building Games with Self-Improving Agents';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0a0f0a 0%, #1a2e1a 50%, #0a0f0a 100%)',
          position: 'relative',
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(74, 138, 58, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #4a8a3a, #f0d890, #4a8a3a)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '32px' }}>🎮</span>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#a0a090',
              letterSpacing: '0.05em',
            }}
          >
            AI Game Studio
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: score ? '48px' : '56px',
            fontWeight: 800,
            color: '#e8e0d0',
            lineHeight: 1.1,
            marginBottom: '20px',
            maxWidth: '800px',
            position: 'relative',
          }}
        >
          {title}
        </div>

        {/* Score badge */}
        {scoreDisplay && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                fontFamily: 'monospace',
                color: '#f0d890',
                background: 'rgba(240, 216, 144, 0.1)',
                padding: '8px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(240, 216, 144, 0.2)',
              }}
            >
              {scoreDisplay}
            </div>
          </div>
        )}

        {/* Subtitle */}
        <div
          style={{
            fontSize: '22px',
            color: '#4a8a3a',
            fontWeight: 500,
            position: 'relative',
          }}
        >
          {subtitle}
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4a8a3a',
            }}
          />
          <span style={{ fontSize: '16px', color: '#606060' }}>
            ai-game-studio.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
