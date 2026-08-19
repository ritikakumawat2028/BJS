import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const customerRole = await prisma.role.findFirst({ where: { name: 'CUSTOMER' } });
  const targetUsers = await prisma.user.findMany({
    where: {
      OR: [
        { roleId: customerRole?.id },
        { email: { in: ['ritikakumari3222@gmail.com', 'ritikakumawat2028@gmail.com', 'test5@example.com', 'ritika@gmail.com'] } }
      ]
    },
    select: { id: true }
  });
  const userIds = targetUsers.map(u => u.id);
  if (userIds.length === 0) { console.log('No users to delete'); return; }
  const orders = await prisma.order.findMany({ where: { userId: { in: userIds } }, select: { id: true } });
  const orderIds = orders.map(o => o.id);
  if (orderIds.length > 0) {
    await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
    await prisma.payment.deleteMany({ where: { orderId: { in: orderIds } } });
    await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
  }
  const carts = await prisma.cart.findMany({ where: { userId: { in: userIds } }, select: { id: true } });
  const cartIds = carts.map(c => c.id);
  if (cartIds.length > 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: { in: cartIds } } });
    await prisma.cart.deleteMany({ where: { id: { in: cartIds } } });
  }
  await prisma.review.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.address.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.wishlist.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.supportTicket.deleteMany({ where: { userId: { in: userIds } } }).catch(() => {});
  const res = await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  console.log('Deleted users:', res.count);
}
main().catch(console.error).finally(() => prisma.$disconnect());