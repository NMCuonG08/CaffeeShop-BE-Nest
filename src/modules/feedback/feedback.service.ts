import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma';
import { CreateFeedbackInput } from './dto/create-feedback.input';
import { UpdateFeedbackInput } from './dto/update-feedback.input';
import { Feedback, FeedbackStatus, FeedbackType, Prisma } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  // Tạo feedback mới
  async create(createFeedbackInput: CreateFeedbackInput, userId: number): Promise<Feedback> {
    console.log("id"+ userId);
    // Kiểm tra user đã feedback cho product này chưa
    const existingFeedback = await this.prisma.feedback.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: createFeedbackInput.productId,
        },
      },
    });

    if (existingFeedback) {
      throw new ConflictException('Bạn đã feedback cho sản phẩm này rồi');
    }

    // Kiểm tra product có tồn tại không
    const product = await this.prisma.product.findUnique({
      where: { product_id: createFeedbackInput.productId },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    return this.prisma.feedback.create({
      data: {
        ...createFeedbackInput,
        status:'APPROVED',
        userId,
      },
      include: {
        user: true,
        product: true,
      },
    });
  }

  // Lấy tất cả feedbacks
  async findAll(filters?: {
    productId?: number;
    userId?: number;
    type?: FeedbackType;
    status?: FeedbackStatus;
    minRating?: number;
    maxRating?: number;
  }): Promise<Feedback[]> {
    const where: Prisma.FeedbackWhereInput = {};

    if (filters?.productId) where.productId = filters.productId;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;

    if (filters?.minRating || filters?.maxRating) {
      where.rating = {};
      if (filters.minRating) where.rating.gte = filters.minRating;
      if (filters.maxRating) where.rating.lte = filters.maxRating;
    }


    return this.prisma.feedback.findMany({
      where,
      include: {
        user: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Lấy feedback theo ID
  async findOne(id: number): Promise<Feedback> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback không tồn tại');
    }

    return feedback;
  }

  // Lấy feedbacks theo product ID (cho DataLoader)
  async findByProductIds(productIds: number[]): Promise<Feedback[]> {
    return this.prisma.feedback.findMany({
      where: {
        productId: { in: productIds },
        status: FeedbackStatus.APPROVED,
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Cập nhật feedback
  async update(id: number, updateFeedbackInput: UpdateFeedbackInput, userId: number): Promise<Feedback> {
    const feedback = await this.findOne(id);

    // Chỉ cho phép user sở hữu feedback hoặc admin cập nhật
    if (feedback.userId !== userId) {
      throw new ForbiddenException('Bạn chỉ có thể sửa feedback của mình');
    }

    return this.prisma.feedback.update({
      where: { id },
      data: updateFeedbackInput,
      include: {
        user: true,
        product: true,
      },
    });
  }

  // Xóa feedback
  async remove(id: number, userId: number): Promise<Feedback> {
    const feedback = await this.findOne(id);

    if (feedback.userId !== userId) {
      throw new ForbiddenException('Bạn chỉ có thể xóa feedback của mình');
    }

    return this.prisma.feedback.delete({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });
  }

  // Admin: Duyệt/từ chối feedback
  async updateStatus(id: number, status: FeedbackStatus): Promise<Feedback> {
    return this.prisma.feedback.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        product: true,
      },
    });
  }

  // Tính average rating cho product
  async getProductRatingStats(productId: number) {
    const stats = await this.prisma.feedback.aggregate({
      where: {
        productId,
        status: FeedbackStatus.APPROVED,
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      averageRating: stats._avg.rating || 0,
      totalFeedbacks: stats._count.rating || 0,
    };
  }

  // Thống kê rating theo từng mức
  async getRatingDistribution(productId: number) {
    const distribution = await this.prisma.feedback.groupBy({
      by: ['rating'],
      where: {
        productId,
        status: FeedbackStatus.APPROVED,
      },
      _count: { rating: true },
      orderBy: { rating: 'desc' },
    });

    return distribution.map(item => ({
      rating: item.rating,
      count: item._count.rating,
    }));
  }
}