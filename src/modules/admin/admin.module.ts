import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DashboardController } from './dashboard/dashboard.controller';
import { AdminCategoriesController } from './categories/admin-categories.controller';
import { AdminTransactionsController } from './transactions/admin-transactions.controller';
import { ComplaintsController } from './complaints/complaints.controller';
import { ComplaintDetailController } from './complaints/[id]/complaint-detail.controller';
import { UserDetailController } from './users/[id]/user-detail.controller';
import { VerificationController } from './verification/verification.controller';
import { VerificationDetailController } from './verification/[id]/verification-detail.controller';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    CategoriesModule,
    TransactionsModule,
  ],
  controllers: [
    AdminController,
    DashboardController,
    AdminCategoriesController,
    AdminTransactionsController,
    ComplaintsController,
    ComplaintDetailController,
    UserDetailController,
    VerificationController,
    VerificationDetailController,
  ],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
