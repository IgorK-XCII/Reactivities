import React, { useRef } from 'react';
import 'cropperjs/dist/cropper.css';
import { Cropper } from 'react-cropper';

interface IProps {
    imagePreview: string;
    setImage: (image: Blob | null) => void;
}

const PhotoWidgetCropper: React.FC<IProps> = ({ setImage, imagePreview }) => {
    const cropperRef = useRef<HTMLImageElement>(null);

    const cropImage = () => {
        const imageElement: any  = cropperRef?.current;
        const cropper = imageElement?.cropper;
        
        cropper.getCroppedCanvas().toBlob((blob: any) => {
            setImage(blob);
        }, 'image/jpeg');
    };

    return (
        <Cropper
            ref={cropperRef}
            src={imagePreview}
            style={{ height: 200, width: '100%' }}
            // Cropper.js options
            initialAspectRatio={1 / 1}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            dragMode='move'
            scalable={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            crop={cropImage}
        />
    );
};

export default PhotoWidgetCropper;
