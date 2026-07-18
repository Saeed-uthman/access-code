import { useState, useRef } from 'react';
import { Images, Trash2, Upload } from 'lucide-react';
import { Button, Card, CardContent, FullPageLoader } from '@/shared/components';
import { useGalleryPhotos, useUploadPhoto, useDeletePhoto } from '../hooks/use-admin';
import { formatDate } from '@/utils/format';

export default function AdminGalleryPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: photos, isLoading } = useGalleryPhotos();
  const uploadMutation = useUploadPhoto();
  const deleteMutation = useDeletePhoto();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('photo', selectedFile);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Images className="h-6 w-6" />
          Gallery Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">Upload and manage gallery photos</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Upload New Photo</h3>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : 'Choose Image'}
              </Button>
            </div>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <img src={previewUrl} alt="Preview" className="h-32 rounded-lg object-cover" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos && photos.length > 0 ? (
          photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <img
                src={photo.photo}
                alt="Gallery photo"
                className="h-48 w-full object-cover"
              />
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(photo.date_uploaded)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
            <Images className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No photos in the gallery yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
