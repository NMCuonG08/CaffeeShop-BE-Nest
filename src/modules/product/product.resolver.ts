import { Args, Context, Float, Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Feedback, Product } from '@/gql/model';
import { ProductService } from '@/modules/product/product.service';
import { FeedbackService } from '@/modules/feedback/feedback.service';
import DataLoader from 'dataloader';
import { Query} from '@nestjs/graphql';
import { ProductResponseDto } from '@/modules/product/dto';


@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Query(() => Product, { nullable: true })
  getProduct(@Args('id') id: number,): Promise<ProductResponseDto | null> {
    return this.productService.getProductById(id);
  }

  @ResolveField(() => [Feedback])
  async feedbacks(
    @Parent() product: Product,
    @Context() { feedbackLoader }: { feedbackLoader: DataLoader<number, Feedback[]> }
  ): Promise<Feedback[]> {
    return feedbackLoader.load(product.product_id);
  }

  @ResolveField(() => Float, { nullable: true })
  async averageRating(@Parent() product: Product): Promise<number> {
    const stats = await this.feedbackService.getProductRatingStats(product.product_id);
    return stats.averageRating;
  }

  @ResolveField(() => Int)
  async totalFeedbacks(@Parent() product: Product): Promise<number> {
    const stats = await this.feedbackService.getProductRatingStats(product.product_id);
    return stats.totalFeedbacks;
  }
}