import { Fragment, useState } from 'react';
import { SkillBadge } from './SkillBadge.jsx';
import styles from './DeveloperCard.module.css';

export function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Software Engineer',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240',
  metrics = { commits: 0, projects: 0, a11yScore: 100 },
  skills = [
    { id: 'react', name: 'React 19', level: 'Core' },
    { id: 'javascript', name: 'JavaScript', level: 'Advanced' },
  ],
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className={styles.card} aria-labelledby="developer-card-title">
      <header className={styles.header}>
        {avatarFailed ? (
          <span className={styles.initials} aria-label={`${fullName} initials`}>{initials}</span>
        ) : (
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt={fullName}
            width="64"
            height="64"
            onError={() => setAvatarFailed(true)}
          />
        )}
        <hgroup className={styles.identity}>
          <h2 id="developer-card-title">{fullName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>

      <dl className={styles.metrics} aria-label="Developer metrics">
        {Object.entries(metrics).map(([label, value]) => (
          <Fragment key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <ul className={styles.skills} aria-label="Skills">
        {skills.map((skill) => (
          <li className={styles.skill} key={skill.id}>
            <SkillBadge name={skill.name} level={skill.level} />
          </li>
        ))}
      </ul>
    </article>
  );
}