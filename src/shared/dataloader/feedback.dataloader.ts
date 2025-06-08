import * as DataLoader from 'dataloader';
import { FeedbackService } from '@/modules/feedback/feedback.service';
import { Feedback } from '@prisma/client';



export function createLoader(feedbackService: FeedbackService): DataLoader<number, Feedback[]> {
    return new DataLoader<number, Feedback[]>(
      async (productIds: readonly number[]) => {
        const feedbacks = await feedbackService.findByProductIds([...productIds]);

        // Group feedbacks by productId
        const feedbackMap = new Map<number, Feedback[]>();
        feedbacks.forEach(feedback => {
          const existing = feedbackMap.get(feedback.productId) || [];
          existing.push(feedback);
          feedbackMap.set(feedback.productId, existing);
        });

        return productIds.map(productId => feedbackMap.get(productId) || []);
      }
    );
  }
