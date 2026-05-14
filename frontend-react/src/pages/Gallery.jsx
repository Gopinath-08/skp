import { useEffect, useState } from 'react';
import { galleryService, getAssetUrl } from '../services/api';
import '../styles/pages.css';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await galleryService.getAll();
        setImages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="gallery-page">
      <section className="page-header">
        <h1>Gallery</h1>
        <p>Explore our campus and student activities</p>
      </section>

      <section className="gallery-container">
        {loading ? (
          <p>Loading gallery...</p>
        ) : images.length > 0 ? (
          <div className="gallery-grid">
            {images.map((image) => (
              <div 
                key={image._id} 
                className="gallery-item"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={getAssetUrl(image.image || image.url)}
                  alt={image.title}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                />
                <div className="gallery-overlay">
                  <p>{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No images in gallery</p>
        )}
      </section>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedImage(null)}>&times;</span>
            <img 
              src={getAssetUrl(selectedImage.image || selectedImage.url)}
              alt={selectedImage.title}
              onError={(e) => e.target.src = 'https://via.placeholder.com/600'}
            />
            <p>{selectedImage.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
