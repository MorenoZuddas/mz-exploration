import Image from 'next/image';
import { thumbnailUrl } from '@/lib/cloudinary';

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
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {photos.map((photo) => {
        const src = thumbnailUrl(photo.public_id) || photo.secure_url;

        return (
          <div
            key={photo.public_id}
            className="relative aspect-[3/2] overflow-hidden rounded-xl"
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
  );
}

