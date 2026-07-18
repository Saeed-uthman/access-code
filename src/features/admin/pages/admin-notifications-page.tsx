import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { useSendBulkNotification } from '@/features/notification/hooks/use-notifications';
import { NOTIFICATION_TYPES } from '@/constants';

const bulkNotificationSchema = z.object({
  notification_type: z.string().min(1, 'Notification type is required'),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  target_audience: z.enum([
    'all_users', 'admin_users', 'regular_users',
    'house_plan_users', 'individual_plan_users', 'business_plan_users',
    'verified_users', 'unverified_users',
  ], {
    required_error: 'Target audience is required',
  }),
});

type BulkNotificationFormValues = z.infer<typeof bulkNotificationSchema>;

const audienceOptions = [
  { value: 'all_users', label: 'All Users' },
  { value: 'verified_users', label: 'Verified Users' },
  { value: 'unverified_users', label: 'Unverified Users' },
  { value: 'admin_users', label: 'Admins Only' },
  { value: 'regular_users', label: 'Regular Users' },
  { value: 'house_plan_users', label: 'House Plan Users' },
  { value: 'individual_plan_users', label: 'Individual Plan Users' },
  { value: 'business_plan_users', label: 'Business Plan Users' },
];

const notificationTypeOptions = NOTIFICATION_TYPES.map((t) => ({
  value: t.value,
  label: t.label,
}));

export default function AdminNotificationsPage() {
  const sendMutation = useSendBulkNotification();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BulkNotificationFormValues>({
    resolver: zodResolver(bulkNotificationSchema),
    defaultValues: {
      notification_type: 'system_announcement',
      target_audience: 'all_users',
    },
  });

  const onSubmit = (data: BulkNotificationFormValues) => {
    sendMutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Send className="h-6 w-6" />
          Send Notification
        </h1>
        <p className="mt-1 text-sm text-gray-500">Send bulk notifications to user segments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Notification Type</label>
                <Select options={notificationTypeOptions} error={errors.notification_type?.message} {...register('notification_type')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Target Audience</label>
                <Select options={audienceOptions} error={errors.target_audience?.message} {...register('target_audience')} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                placeholder="Notification title"
                error={errors.title?.message}
                {...register('title')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <Textarea
                placeholder="Write your notification message..."
                rows={4}
                error={errors.message?.message}
                {...register('message')}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={sendMutation.isPending}>
                <Send className="h-4 w-4 mr-2" />
                {sendMutation.isPending ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
