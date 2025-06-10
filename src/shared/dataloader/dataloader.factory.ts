import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PrismaService } from '@/shared/prisma';
import { FeedbackService } from '@/modules/feedback/feedback.service';
import { Feedback } from '@prisma/client';

@Injectable()
export class DataLoaderFactory {
  constructor(private prisma: PrismaService,  private feedbackService: FeedbackService) {}

  // Product Image Loader
  createProductImageLoader() {
    return new DataLoader<number, string | null>(async (productIds: readonly number[]) => {
      const images = await this.prisma.image.findMany({
        where: {
          product: {
            some: {
              product_id: { in: [...productIds] }
            }
          }
        },
        select: {
          url: true,
          product: {
            select: {
              product_id: true
            }
          }
        }
      });

      return productIds.map(productId => {
        // Tìm image có chứa productId này
        const image = images.find(img =>
          img.product.some(p => p.product_id === productId)
        );
        return image?.url || null;
      });
    });
  }

  // User Info Loader
  createUserInfoLoader() {
    return new DataLoader<number, any>(async (userIds: readonly number[]) => {
      const userInfos = await this.prisma.userInfo.findMany({
        where: {
          userId: { in: [...userIds] }
        }
      });

      return userIds.map(userId => {
        return userInfos.find(info => info.userId === userId) || null;
      });
    });
  }

  createLoader(feedbackService: FeedbackService): DataLoader<number, Feedback[]> {
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

  createAllLoaders() {
    return {
      productImage: this.createProductImageLoader(),
      userInfo: this.createUserInfoLoader(),
      feedbackLoader: this.createLoader(this.feedbackService)
    };
  }
}