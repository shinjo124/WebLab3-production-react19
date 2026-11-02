export function SkillBadge({ name = 'Skill', level = 'Core' }) {
  return (
    <span aria-label={`${name}: ${level}`}>
      {name} <span>{level}</span>
    </span>
  );
}