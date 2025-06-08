import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Injectable, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from '@/gql/model';
import { CreateFeedbackInput } from './dto/create-feedback.input';
import { UpdateFeedbackInput } from './dto/update-feedback.input';
import { GetUser, GetUserFromGQL } from '@/modules/auth/decorator/get-user.decorator';
import { FeedbackStatus, FeedbackType } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GqlAuthGuard } from '@/modules/auth/guard/gql-auth.guard';

// Constants for subscription events
const FEEDBACK_EVENTS = {
  FEEDBACK_CREATED: 'feedbackCreated',
  FEEDBACK_UPDATED: 'feedbackUpdated',
  FEEDBACK_DELETED: 'feedbackDeleted',
  FEEDBACK_STATUS_CHANGED: 'feedbackStatusChanged',
} as const;

@Injectable()
@Resolver(() => Feedback)
export class FeedbackResolver {
  private pubSub = new PubSub();

  constructor(private readonly feedbackService: FeedbackService) {}

  // Mutations with real-time events
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Feedback)
  async createFeedback(
    @Args('createFeedbackInput') createFeedbackInput: CreateFeedbackInput,
    @GetUserFromGQL('id') id: number,
  ): Promise<Feedback> {
    const feedback = await this.feedbackService.create(createFeedbackInput, id);

    this.pubSub.publish(FEEDBACK_EVENTS.FEEDBACK_CREATED, {
      [FEEDBACK_EVENTS.FEEDBACK_CREATED]: feedback,
    });

    return feedback;
  }

  @Mutation(() => Feedback)
  @UseGuards(GqlAuthGuard)
  async updateFeedback(
    @Args('id') id: number,
    @Args('updateFeedbackInput') updateFeedbackInput: UpdateFeedbackInput,
    @GetUserFromGQL() user: User,
  ): Promise<Feedback> {
    const feedback = await this.feedbackService.update(id, updateFeedbackInput, user.id);

    // Publish event for real-time updates
    this.pubSub.publish(FEEDBACK_EVENTS.FEEDBACK_UPDATED, {
      [FEEDBACK_EVENTS.FEEDBACK_UPDATED]: feedback,
    });

    return feedback;
  }

  @Mutation(() => Feedback)
  @UseGuards(GqlAuthGuard)
  async removeFeedback(
    @Args('id') id: number,
    @GetUserFromGQL() user: User,
  ): Promise<Feedback> {
    const feedback = await this.feedbackService.remove(id, user.id);

    // Publish event for real-time updates
    this.pubSub.publish(FEEDBACK_EVENTS.FEEDBACK_DELETED, {
      [FEEDBACK_EVENTS.FEEDBACK_DELETED]: feedback,
    });

    return feedback;
  }

  // Admin mutations with events
  @Mutation(() => Feedback)
  async approveFeedback(@Args('id') id: number): Promise<Feedback> {
    const feedback = await this.feedbackService.updateStatus(id, FeedbackStatus.APPROVED);

    this.pubSub.publish(FEEDBACK_EVENTS.FEEDBACK_STATUS_CHANGED, {
      [FEEDBACK_EVENTS.FEEDBACK_STATUS_CHANGED]: feedback,
    });

    return feedback;
  }

  @Mutation(() => Feedback)
  async rejectFeedback(@Args('id') id: number): Promise<Feedback> {
    const feedback = await this.feedbackService.updateStatus(id, FeedbackStatus.REJECTED);

    this.pubSub.publish(FEEDBACK_EVENTS.FEEDBACK_STATUS_CHANGED, {
      [FEEDBACK_EVENTS.FEEDBACK_STATUS_CHANGED]: feedback,
    });

    return feedback;
  }

  // Existing queries remain the same
  @Query(() => [Feedback])
  async feedbacks(
    @Args('productId', { nullable: true }) productId?: number,
    @Args('userId', { nullable: true }) userId?: number,
    @Args('type', { nullable: true }) type?: FeedbackType,
    @Args('status', { nullable: true }) status?: FeedbackStatus,
    @Args('minRating', { nullable: true }) minRating?: number,
    @Args('maxRating', { nullable: true }) maxRating?: number,
  ): Promise<Feedback[]> {
    return this.feedbackService.findAll({
      productId,
      userId,
      type,
      status,
      minRating,
      maxRating,
    });
  }

  @Query(() => Feedback)
  async feedback(@Args('id') id: number): Promise<Feedback> {
    return this.feedbackService.findOne(id);
  }

  @Query(() => [Feedback])
  async feedbacksByProduct(@Args('productId') productId: number): Promise<Feedback[]> {
    return this.feedbackService.findAll({
      productId,
      status: FeedbackStatus.APPROVED
    });
  }

  @Query(() => [Feedback])
  @UseGuards(AuthGuard('jwt'))
  async myFeedbacks(@GetUser() user: any): Promise<Feedback[]> {
    return this.feedbackService.findAll({ userId: user.id });
  }

  // Subscriptions for real-time updates
  @Subscription(() => Feedback, {
    name: FEEDBACK_EVENTS.FEEDBACK_CREATED,
    filter: (payload, variables) => {
      // Optional: Filter by productId if provided
      if (variables.productId) {
        return payload[FEEDBACK_EVENTS.FEEDBACK_CREATED].productId === variables.productId;
      }
      return true;
    },
  })
  feedbackCreated(
    @Args('productId', { nullable: true }) productId?: number,
  ) {
    return this.pubSub.asyncIterableIterator(FEEDBACK_EVENTS.FEEDBACK_CREATED);
  }

  @Subscription(() => Feedback, {
    name: FEEDBACK_EVENTS.FEEDBACK_UPDATED,
    filter: (payload, variables) => {
      if (variables.productId) {
        return payload[FEEDBACK_EVENTS.FEEDBACK_UPDATED].productId === variables.productId;
      }
      return true;
    },
  })
  feedbackUpdated(
    @Args('productId', { nullable: true }) productId?: number,
  ) {
    return this.pubSub.asyncIterableIterator(FEEDBACK_EVENTS.FEEDBACK_UPDATED);
  }

  @Subscription(() => Feedback, {
    name: FEEDBACK_EVENTS.FEEDBACK_DELETED,
    filter: (payload, variables) => {
      if (variables.productId) {
        return payload[FEEDBACK_EVENTS.FEEDBACK_DELETED].productId === variables.productId;
      }
      return true;
    },
  })
  feedbackDeleted(
    @Args('productId', { nullable: true }) productId?: number,
  ) {
    return this.pubSub.asyncIterableIterator(FEEDBACK_EVENTS.FEEDBACK_DELETED);
  }

  @Subscription(() => Feedback, {
    name: FEEDBACK_EVENTS.FEEDBACK_STATUS_CHANGED,
    filter: (payload, variables) => {
      if (variables.productId) {
        return payload[FEEDBACK_EVENTS.FEEDBACK_STATUS_CHANGED].productId === variables.productId;
      }
      return true;
    },
  })
  feedbackStatusChanged(
    @Args('productId', { nullable: true }) productId?: number,
  ) {
    return this.pubSub.asyncIterableIterator(FEEDBACK_EVENTS.FEEDBACK_STATUS_CHANGED);
  }
}