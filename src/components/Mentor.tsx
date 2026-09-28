import styles from './Mentor.module.css'

type MentorProps = {
  message: string
  /**
   * default — scoring/explanation sidebar
   * hero — large name + dialogue (legacy)
   * presenting — phone home: character only (problem card sits to her right)
   */
  size?: 'default' | 'hero' | 'presenting'
}

/** Mentor「美椎（ミーシー）」— adult female learning-method consultant (placeholder SVG). */
export function Mentor({ message, size = 'default' }: MentorProps) {
  const isHero = size === 'hero'
  const isPresenting = size === 'presenting'
  const rootClass = [
    styles.mentor,
    isHero ? styles.mentorHero : '',
    isPresenting ? styles.mentorPresenting : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={rootClass} aria-label="メンター 美椎">
      <div className={styles.portrait} aria-hidden="true">
        <svg viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7d4b8" />
              <stop offset="100%" stopColor="#e8b896" />
            </linearGradient>
            <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3d2a1f" />
              <stop offset="100%" stopColor="#1a100c" />
            </linearGradient>
            <linearGradient id="blouse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c9cff" />
              <stop offset="100%" stopColor="#4f6fd8" />
            </linearGradient>
          </defs>
          {/* torso */}
          <ellipse cx="80" cy="200" rx="52" ry="28" fill="url(#blouse)" />
          <path
            d="M40 175 Q80 155 120 175 L128 220 L32 220 Z"
            fill="url(#blouse)"
          />
          {/* right arm extended (presenting gesture) */}
          {isPresenting && (
            <path
              d="M118 178 Q148 168 152 148"
              stroke="url(#blouse)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {/* neck */}
          <rect x="70" y="118" width="20" height="28" rx="6" fill="url(#skin)" />
          {/* face */}
          <ellipse cx="80" cy="88" rx="38" ry="42" fill="url(#skin)" />
          {/* hair back */}
          <path
            d="M42 70 Q40 30 80 22 Q120 30 118 70 Q122 110 110 130 Q100 100 80 98 Q60 100 50 130 Q38 110 42 70 Z"
            fill="url(#hair)"
          />
          {/* bangs */}
          <path
            d="M45 70 Q55 48 80 45 Q105 48 115 70 Q100 58 80 56 Q60 58 45 70 Z"
            fill="url(#hair)"
          />
          {/* eyes */}
          <ellipse cx="66" cy="90" rx="5" ry="6" fill="#2a1f18" />
          <ellipse cx="94" cy="90" rx="5" ry="6" fill="#2a1f18" />
          <circle cx="67.5" cy="88" r="1.5" fill="#fff" />
          <circle cx="95.5" cy="88" r="1.5" fill="#fff" />
          {/* brows */}
          <path
            d="M58 78 Q66 74 74 78"
            stroke="#2a1f18"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M86 78 Q94 74 102 78"
            stroke="#2a1f18"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* smile */}
          <path
            d="M70 108 Q80 116 90 108"
            stroke="#c47a6a"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* cheek blush */}
          <ellipse cx="55" cy="100" rx="7" ry="4" fill="#f0a090" opacity="0.45" />
          <ellipse cx="105" cy="100" rx="7" ry="4" fill="#f0a090" opacity="0.45" />
        </svg>
      </div>
      {!isPresenting && (
        <div className={styles.identity}>
          <p className={isHero ? styles.nameHero : styles.name}>美椎</p>
          {isHero && <p className={styles.nameEn}>Meese</p>}
          {!isHero && <p className={styles.nameSub}>（ミーシー）</p>}
          <div className={styles.dialogue} role="status">
            <p>{message}</p>
          </div>
        </div>
      )}
      {isPresenting && (
        <p className={styles.presentingName}>
          美椎<span className={styles.presentingNameEn}>Meese</span>
        </p>
      )}
    </aside>
  )
}
