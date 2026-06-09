import { useEffect, useMemo, useState } from 'react';
import { galleryService, getAssetUrl } from '../services/api';
import '../styles/pages.css';

const fallbackImages = [
  {
    _id: 'lab',
    title: 'Computer Lab Practice',
    category: 'Campus',
    description: 'Students practicing computer skills in a guided lab environment.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'class',
    title: 'Classroom Training',
    category: 'Students',
    description: 'Focused classroom sessions for office, accounting, and programming skills.',
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'certificate',
    title: 'Certificate Support',
    category: 'Achievements',
    description: 'Course completion support for students building their profile.',
    image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'project',
    title: 'Project Work',
    category: 'Events',
    description: 'Practical assignments help students apply concepts with confidence.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
  },
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await galleryService.getAll();
        setImages(response.data.length > 0 ? response.data : fallbackImages);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setImages(fallbackImages);
        setApiMessage('Showing sample gallery while the live server is unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = useMemo(
    () => ['all', ...new Set(images.map((image) => image.category).filter(Boolean))],
    [images]
  );
  const filteredImages = filter === 'all'
    ? images
    : images.filter((image) => image.category === filter);

  return (
    <div className="gallery-page">
      <section className="page-header page-header-gallery">
        <div>
          <span>Campus gallery</span>
          <h1>See learning in action</h1>
          <p>Explore lab practice, classroom sessions, events, and student achievements.</p>
        </div>
      </section>

      <section className="gallery-container page-shell">
        <div className="gallery-toolbar">
          <div>
            <h2>Gallery</h2>
            <p>Filter by category and open any image for a larger view.</p>
          </div>
          <div className="filter-pills">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {apiMessage && <div className="notice-inline">{apiMessage}</div>}
        {loading ? (
          <p className="center-message">Loading gallery...</p>
        ) : filteredImages.length > 0 ? (
          <div className="gallery-grid">
            {filteredImages.map((image) => (
              <button
                key={image.id || image._id || image.image}
                className="gallery-item"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={getAssetUrl(image.image || image.url)}
                  alt={image.title}
                  onError={(event) => {
                    event.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80';
                  }}
                />
                <span className="gallery-category">{image.category || 'Gallery'}</span>
                <div className="gallery-overlay">
                  <h3>{image.title}</h3>
                  <p>{image.description || 'Ideal Computer Education'}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="empty-state">No gallery items found.</p>
        )}
      </section>

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setSelectedImage(null)} aria-label="Close gallery image">
              x
            </button>
            <img
              src={getAssetUrl(selectedImage.image || selectedImage.url)}
              alt={selectedImage.title}
              onError={(event) => {
                event.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="modal-caption">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description || selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
