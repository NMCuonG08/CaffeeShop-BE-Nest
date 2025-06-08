import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import {Feedback} from '@/gql/model/feedback.model';

// Register Role enum
registerEnumType(Role, {
  name: 'Role',
  description: 'User roles',
});

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => String)
  email: string;

  @Field(() => String)
  hash?: string | null;

  @Field(() => String)
  firstName?: string | null;

  @Field(() => String)
  lastName?: string | null;

  @Field(() => String)
  picture?: string | null;

  @Field(() => String)
  provider?: string | null;

  @Field(() => String)
  providerId?: string | null;

  @Field(() => Int )
  home_store?: number | null;

  @Field(() => String)
  customer_since?: Date | null;

  @Field(() => String)
  loyalty_card_number?: string | null;

  @Field(() => String)
  birthdate?: Date | null;

  @Field(() => String)
  gender?: string | null;

  @Field(() => Int)
  birth_year?: number | null;

  @Field(() => Role)
  role: Role;

  // Relations (optional - có thể bỏ nếu không cần)
  @Field(() => [Feedback])
  feedbacks?: Feedback[];
}