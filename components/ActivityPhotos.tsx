'use client';

import Image from 'next/image';
import { thumbnailUrl } from '@/lib/cloudinary';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface ActivityPhoto {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
}

interface ActivityPhotosProps {
  photos?: ActivityPhoto[];
  className?: string;
  gridClassName?: string;
  imageClassName?: string;
  clickable?: boolean;
  showModal?: boolean;
  columns?: 2 | 3 | 4;
  tone?: 'current' | 'blue' | 'purple' | 'black';
}

const gridByColumns: Record<NonNullable<ActivityPhotosProps['columns']>, string> = {
  2: 'grid-cols-2 md:grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
};

const modalToneByVariant: Record<NonNullable<ActivityPhotosProps['tone']>, string> = {
  current: 'bg-black/80',
  blue: 'bg-blue-950/85',
  purple: 'bg-violet-950/85',
  black: 'bg-black/90',
};

export function ActivityPhotos({
  photos,
  className = '',
  gridClassName = '',
  imageClassName = '',
  clickable = true,
  showModal = true,
  columns = 3,
  tone = 'current',
}: ActivityPhotosProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ActivityPhoto | null>(null);

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`grid gap-3 ${gridByColumns[columns]} ${gridClassName} ${className}`}>
        {photos.map((photo) => {
          const src = thumbnailUrl(photo.public_id) || photo.secure_url;

          return (
            <div
              key={photo.public_id}
              className={`relative aspect-[3/2] overflow-hidden rounded-xl transition-opacity ${clickable && showModal ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => {
                if (clickable && showModal) setSelectedPhoto(photo);
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                className={`object-cover ${imageClassName}`}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          );
        })}
      </div>

      {selectedPhoto && showModal && (
        <div
          className={`fixed inset-0 z-50 p-3 md:p-6 ${modalToneByVariant[tone]}`}
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative mx-auto h-full w-full max-w-6xl">
            <Button
              variant="secondary"
              tone="black"
              size="icon"
              className="absolute right-2 top-2 z-10 h-10 w-10 rounded-full bg-black/60 text-2xl text-white hover:bg-black/75"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
              aria-label="Chiudi anteprima"
            >
              ×
            </Button>

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
