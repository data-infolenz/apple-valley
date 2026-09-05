const particles = [
  { left: '4%', top: '16%', delay: '-3s', duration: '19s', size: 4 },
  { left: '10%', top: '66%', delay: '-11s', duration: '25s', size: 3 },
  { left: '24%', top: '91%', delay: '-7s', duration: '22s', size: 4 },
  { left: '43%', top: '8%', delay: '-14s', duration: '28s', size: 3 },
  { left: '68%', top: '94%', delay: '-5s', duration: '24s', size: 3 },
  { left: '89%', top: '35%', delay: '-17s', duration: '26s', size: 4 },
  { left: '96%', top: '77%', delay: '-9s', duration: '21s', size: 3 },
];

export default function BackgroundParticles() {
  return (
    <div className="background-particles" aria-hidden="true">
      <div className="background-circle background-circle-left" />
      <div className="background-circle background-circle-right" />
      <div className="background-circle background-circle-small" />
      {particles.map((particle, index) => (
        <span key={index} style={{
          left: particle.left,
          top: particle.top,
          width: particle.size,
          height: particle.size,
          animationDelay: particle.delay,
          animationDuration: particle.duration,
        }} />
      ))}
    </div>
  );
}
