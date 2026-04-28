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
          className="fixed inset-0 z-50 bg-black/80 p-3 md:p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative mx-auto h-full w-full max-w-6xl">
            <button
              className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
              aria-label="Chiudi anteprima"
            >
              ×
            </button>

            <div
              className="h-full w-full overflow-auto rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex min-h-full items-center justify-center p-4">
                <Image
                  src={selectedPhoto.secure_url}
                  alt="Foto attività"
                  width={selectedPhoto.width || 1600}
                  height={selectedPhoto.height || 1200}
                  className="h-auto w-auto max-h-[88vh] max-w-full object-contain"
                  sizes="95vw"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
