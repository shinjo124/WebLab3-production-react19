import { Fragment, useState } from 'react';
import { SkillBadge } from './SkillBadge.jsx';

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
    <article aria-labelledby="developer-card-title">
      <header>
        {avatarFailed ? (
          <span aria-label={`${fullName} initials`}>{initials}</span>
        ) : (
          <img
            src={avatarUrl}
            alt={fullName}
            width="64"
            height="64"
            onError={() => setAvatarFailed(true)}
          />
        )}
        <hgroup>
          <h2 id="developer-card-title">{fullName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>

      <dl aria-label="Developer metrics">
        {Object.entries(metrics).map(([label, value]) => (
          <Fragment key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <ul aria-label="Skills">
        {skills.map((skill) => (
          <li key={skill.id}>
            <SkillBadge name={skill.name} level={skill.level} />
          </li>
        ))}
      </ul>
    </article>
  );
}