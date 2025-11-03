import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ThumbsUp, ThumbsDown, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackFormProps {
  productId: string;
  onSubmit: (vote: 'up' | 'down', comment: string, images: string[]) => void;
  initialVote?: 'up' | 'down';
}

export function FeedbackForm({ productId, onSubmit, initialVote }: FeedbackFormProps) {
  const [vote, setVote] = useState<'up' | 'down' | null>(initialVote || null);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Limit to 3 images
    if (images.length + files.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload only image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!vote) {
      toast.error('Please select thumbs up or thumbs down');
      return;
    }

    if (!comment.trim() && images.length === 0) {
      toast.error('Please provide a comment or upload proof images');
      return;
    }

    onSubmit(vote, comment, images);
    setComment('');
    setImages([]);
  };

  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          Was this EcoScore accurate?
        </Label>
        <div className="flex gap-3">
          <Button
            variant={vote === 'up' ? 'default' : 'outline'}
            onClick={() => setVote('up')}
            className="flex-1"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Accurate
          </Button>
          <Button
            variant={vote === 'down' ? 'default' : 'outline'}
            onClick={() => setVote('down')}
            className="flex-1"
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            Inaccurate
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="feedback-comment" className="text-sm font-semibold mb-2 block">
          Your feedback (optional)
        </Label>
        <Textarea
          id="feedback-comment"
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      <div>
        <Label className="text-sm font-semibold mb-2 block">
          Upload proof images (optional, max 3)
        </Label>
        
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-background">
                <img
                  src={img}
                  alt={`Proof ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {images.length < 3 && (
          <label className="cursor-pointer">
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent/50 transition-colors">
              <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload images
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Submit Feedback
      </Button>
    </div>
  );
}
