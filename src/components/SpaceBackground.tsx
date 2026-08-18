function SpaceBackground() {
  const stars = Array.from({ length: 26 });

  return (
    <div className="space-background" aria-hidden="true">
      <div className="nebula nebula-one" />
      <div className="nebula nebula-two" />

      <div className="moon" />
      <div className="moon-glow" />

      {stars.map((_, index) => (
        <span
          key={index}
          className={`star star-${index + 1}`}
        />
      ))}

      <span className="meteor meteor-1" />
      <span className="meteor meteor-2" />
      <span className="meteor meteor-3" />
    </div>
  );
}

export default SpaceBackground;