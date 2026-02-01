import { useState, useEffect } from 'react';

const creatorShowcase = [
  {
    id: 1,
    name: "Sarah Chen",
    description: "Creating digital art tutorials",
    supporters: 2847,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: 2,
    name: "Alex Kumar",
    description: "Building open source tools",
    supporters: 1523,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    id: 3,
    name: "Maya Rodriguez",
    description: "Teaching web development",
    supporters: 3201,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya"
  },
  {
    id: 4,
    name: "Jordan Lee",
    description: "Creating music & podcasts",
    supporters: 892,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan"
  },
  {
    id: 5,
    name: "Emma Wilson",
    description: "Writing tech articles",
    supporters: 1654,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
  },
  {
    id: 6,
    name: "Chris Park",
    description: "Indie game development",
    supporters: 2103,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris"
  }
];

function FloatingCreators() {
  const [hoveredId, setHoveredId] = useState(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 100;
      const fadeEnd = 400;
      
      if (scrollY <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        const opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setScrollOpacity(opacity);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const leftCreators = creatorShowcase.slice(0, 3);
  const rightCreators = creatorShowcase.slice(3, 6);

  return (
    <>
      {/* Left Side Creators */}
      <div 
        className="floating-creators floating-left"
        style={{ opacity: scrollOpacity, pointerEvents: scrollOpacity > 0 ? 'all' : 'none' }}
      >
        {leftCreators.map((creator, index) => (
          <div
            key={creator.id}
            className={`creator-card ${hoveredId === creator.id ? 'hovered' : ''}`}
            style={{ animationDelay: `${index * 0.2}s` }}
            onMouseEnter={() => setHoveredId(creator.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="creator-avatar">
              <img src={creator.avatar} alt={creator.name} />
            </div>
            <div className="creator-info">
              <h4 className="creator-card-name">{creator.name}</h4>
              <p className="creator-card-desc">{creator.description}</p>
              <div className="creator-supporters">
                <span className="heart-icon">♥</span>
                <span className="supporter-count">
                  {creator.supporters.toLocaleString()} supporters
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side Creators */}
      <div 
        className="floating-creators floating-right"
        style={{ opacity: scrollOpacity, pointerEvents: scrollOpacity > 0 ? 'all' : 'none' }}
      >
        {rightCreators.map((creator, index) => (
          <div
            key={creator.id}
            className={`creator-card ${hoveredId === creator.id ? 'hovered' : ''}`}
            style={{ animationDelay: `${index * 0.2}s` }}
            onMouseEnter={() => setHoveredId(creator.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="creator-avatar">
              <img src={creator.avatar} alt={creator.name} />
            </div>
            <div className="creator-info">
              <h4 className="creator-card-name">{creator.name}</h4>
              <p className="creator-card-desc">{creator.description}</p>
              <div className="creator-supporters">
                <span className="heart-icon">♥</span>
                <span className="supporter-count">
                  {creator.supporters.toLocaleString()} supporters
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default FloatingCreators;
