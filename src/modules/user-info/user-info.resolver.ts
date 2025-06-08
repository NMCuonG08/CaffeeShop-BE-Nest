import { UserInfo } from '@/gql/model/user-info.model';
import { Resolver, Query, Mutation, Args, Subscription, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserInfoService } from '@/modules/user-info/user-info.service';
import { CreateUserInfoInput } from '@/modules/user-info/dto/create-user-infor.input';
import { Order } from '@/gql/model/order.model';
import { User } from '@/gql/model';
import { UserService } from '@/modules/user/user.service';


@Resolver(() => UserInfo)
export class UserInfoResolver {
    constructor(private readonly userInfoService: UserInfoService,
                private readonly userService : UserService,
                ) {
    }

  @Query(() => UserInfo, { nullable: true })
  async userInfo(@Args('id', { type: () => Int }) id: number): Promise<UserInfo | null> {
    // Trả về data từ DB mà không cần orders field
    return this.userInfoService.findById(id);
  }

  @Mutation(() => UserInfo, { nullable: true })
  async createUserInfo(@Args('createUserInfo') createUserInfoInput: CreateUserInfoInput ): Promise<UserInfo> {
      return this.userInfoService.create(createUserInfoInput)
  }

  @Mutation(() => UserInfo, { nullable: true })
  async updateUserInfo(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserInfo') updateUserInfoInput: CreateUserInfoInput ): Promise<UserInfo> {
    return this.userInfoService.update(id,updateUserInfoInput)
  }

  // ResolveField cho user relation
  @ResolveField(() => User, { nullable: true })
  async user(@Parent() userInfo: UserInfo): Promise<User | null> {
    if (!userInfo.userId) return null;
    return this.userService.findById(userInfo.userId);
  }



}