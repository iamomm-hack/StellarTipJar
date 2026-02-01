import { useState, useEffect } from 'react';

function CreatorProfile({ creatorData, stellarAddress, totalTips, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(creatorData);

  useEffect(() => {
    setFormData(creatorData);
  }, [creatorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(creatorData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <section className="section creator-profile">
        <h2 className="section-title">Edit Creator Profile</h2>
        
        <div className="profile-form">
          <div className="form-group">
            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="profile-input"
              placeholder="Your name or creator handle"
            />
          </div>

          <div className="form-group">
            <label className="label">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="profile-textarea"
              placeholder="Tell supporters about yourself..."
              rows="3"
            />
          </div>

          <div className="social-links-form">
            <h3 className="subsection-title">Social Links</h3>
            
            <div className="form-group">
              <label className="label">Twitter</label>
              <input
                type="text"
                name="social.twitter"
                value={formData.social.twitter}
                onChange={handleChange}
                className="profile-input"
                placeholder="@username or full URL"
              />
            </div>

            <div className="form-group">
              <label className="label">GitHub</label>
              <input
                type="text"
                name="social.github"
                value={formData.social.github}
                onChange={handleChange}
                className="profile-input"
                placeholder="username or full URL"
              />
            </div>

            <div className="form-group">
              <label className="label">Website</label>
              <input
                type="url"
                name="social.website"
                value={formData.social.website}
                onChange={handleChange}
                className="profile-input"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Save Profile
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section creator-profile">
      <div className="profile-header">
        <h2 className="section-title">Creator Profile</h2>
        <button className="btn-edit" onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          {creatorData.avatar && (
            <img 
              src={creatorData.avatar} 
              alt={creatorData.name || 'Creator'} 
              className="profile-avatar"
            />
          )}
          
          <div className="profile-info">
            {creatorData.name && (
              <h3 className="profile-name">{creatorData.name}</h3>
            )}
            {creatorData.bio && (
              <p className="profile-bio">{creatorData.bio}</p>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <label className="label">Total Tips Received</label>
            <p className="detail-value">{totalTips.toFixed(2)} XLM</p>
          </div>

          {(creatorData.social.twitter || creatorData.social.github || creatorData.social.website) && (
            <div className="social-links">
              <label className="label">Connect</label>
              <div className="social-buttons">
                {creatorData.social.twitter && (
                  <a 
                    href={creatorData.social.twitter.startsWith('http') ? creatorData.social.twitter : `https://twitter.com/${creatorData.social.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Twitter
                  </a>
                )}
                {creatorData.social.github && (
                  <a 
                    href={creatorData.social.github.startsWith('http') ? creatorData.social.github : `https://github.com/${creatorData.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    GitHub
                  </a>
                )}
                {creatorData.social.website && (
                  <a 
                    href={creatorData.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="tips-counter">
            <label className="label">Total Tips Received</label>
            <div className="tips-amount">
              <span className="tips-value">{totalTips.toFixed(2)}</span>
              <span className="tips-currency">XLM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreatorProfile;
