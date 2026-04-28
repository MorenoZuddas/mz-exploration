import Image from 'next/image';
import { thumbnailUrl } from '@/lib/cloudinary';
import { useState } from 'react';

export interface ActivityPhoto {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
}

interface ActivityPhotosProps {
  photos?: ActivityPhoto[];
}

export function ActivityPhotos({ photos }: ActivityPhotosProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ActivityPhoto | null>(null);

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((photo) => {
          const src = thumbnailUrl(photo.public_id) || photo.secure_url;

          return (
            <div
              key={photo.public_id}
              className="relative aspect-[3/2] overflow-hidden rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          );
        })}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image
              src={selectedPhoto.secure_url}
              alt=""
              width={selectedPhoto.width || 800}
              height={selectedPhoto.height || 600}
              className="object-contain max-w-full max-h-full"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
