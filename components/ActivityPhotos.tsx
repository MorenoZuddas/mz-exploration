import React from 'react';
import Image from 'next/image';
import { thumbnailUrl } from '@/lib/cloudinary-utils';
import type { ActivityPhoto } from '@/types/activity';

interface ActivityPhotosProps {
  photos?: ActivityPhoto[];
}

export function ActivityPhotos({ photos }: ActivityPhotosProps): React.JSX.Element | null {
  if (!photos?.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Foto attività</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((photo, index) => {
          const src = thumbnailUrl(photo.public_id);
          if (!src) {
            return null;
          }

          return (
            <div
              key={photo.public_id}
              className="relative aspect-[3/2] overflow-hidden rounded-xl"
            >
              <Image
                src={src}
                alt={`Foto attività ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

