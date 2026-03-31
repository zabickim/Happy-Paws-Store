import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Leather Dog Collar",
    description:
      "Premium full-grain leather collar with a sturdy brass buckle. Soft on your dog's neck, built to last for years.",
    price: 2999, // $29.99
    imageUrl:
      "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600&q=80",
    stock: 50,
  },
  {
    name: "Rope Tug Toy",
    description:
      "Heavy-duty braided cotton rope toy. Perfect for interactive play and keeping teeth clean. Safe for all breeds.",
    price: 1299, // $12.99
    imageUrl:
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&q=80",
    stock: 100,
  },
  {
    name: "Orthopedic Dog Bed",
    description:
      "Memory foam orthopedic bed with a washable cover. Provides joint support — ideal for senior dogs or large breeds.",
    price: 7999, // $79.99
    imageUrl:
      "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&q=80",
    stock: 25,
  },
  {
    name: "Stainless Steel Bowl Set",
    description:
      "Set of two non-slip stainless steel bowls. Dishwasher safe, rust-proof, and sized for medium to large dogs.",
    price: 1899, // $18.99
    imageUrl:
      "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&q=80",
    stock: 75,
  },
  {
    name: "Retractable Dog Leash",
    description:
      "16-foot retractable leash with one-button brake and lock. Ergonomic handle with anti-slip grip. Up to 110 lbs.",
    price: 2499, // $24.99
    imageUrl:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
    stock: 60,
  },
  {
    name: "Dog Raincoat",
    description:
      "Waterproof hooded raincoat with reflective strips for night visibility. Adjustable fit for small to medium dogs.",
    price: 3499, // $34.99
    imageUrl:
      "https://images.unsplash.com/photo-1610041321327-b794c052db27?w=600&q=80",
    stock: 40,
  },
  {
    name: "Interactive Puzzle Feeder",
    description:
      "Slow-feed puzzle toy that makes mealtime a brain game. Reduces bloat and boredom. Dishwasher safe.",
    price: 2199, // $21.99
    imageUrl:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    stock: 45,
  },
  {
    name: "Dog Backpack Harness",
    description:
      "Lightweight hiking backpack harness with saddlebags. Lets your dog carry their own treats and water on trails.",
    price: 4999, // $49.99
    imageUrl:
      "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=600&q=80",
    stock: 30,
  },
];

async function main() {
  console.log("Seeding products...");

  // Clear existing products first (safe for dev resets)
  await prisma.product.deleteMany();

  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`${product.name}`);
  }

  console.log(`\n Seeded ${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
