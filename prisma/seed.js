const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleProducts = [
  {
    slug: 'crepe-special-maison',
    nameAr: 'كريب سبيسيال نوتيلا ومكسرات',
    nameFr: 'Crêpe Spéciale Nutella & Fruits Secs',
    descAr: 'كريب محشو بالنوتيلا الفاخرة مع طبقات من الشوكولاتة والمكسرات المحمصة المقرمشة.',
    descFr: "Crêpe gourmande généreusement garnie de Nutella avec coulis de chocolat et éclats de fruits secs croquants.",
    price: 450,
    image: '/images/crepe-1.jpeg',
    available: true,
    featured: true
  },
  {
    slug: 'crepe-duo-chocolat',
    nameAr: 'كريب ديو شوكولاتة وفواكه',
    nameFr: 'Crêpe Duo Chocolat & Fruits',
    descAr: 'مزيج فاخر من الشوكولاتة الداكنة والبيضاء مع شرائح الفواكه الطازجة وصوص الكراميل.',
    descFr: "Délicieuse combinaison de chocolat noir et blanc avec fruits frais et filet de caramel fondant.",
    price: 500,
    image: '/images/crepe-2.jpeg',
    available: true,
    featured: true
  },
  {
    slug: 'crepe-supreme-pistache',
    nameAr: 'كريب سوبريم لوتس وفستق',
    nameFr: 'Crêpe Suprême Lotus & Pistache',
    descAr: 'كريمة لوتس الأصلية مع فتات بسكويت سبيكولوس ورشة فستق حلبي فاخر.',
    descFr: "Crème de Spéculoos Lotus onctueuse, brisures de biscuits et pistaches concassées de premier choix.",
    price: 550,
    image: '/images/crepe-3.jpeg',
    available: true,
    featured: true
  },
  {
    slug: 'crepe-nutella-classique',
    nameAr: 'كريب نوتيلا كلاسيك',
    nameFr: 'Crêpe Nutella Classique',
    descAr: 'كريب فرنسي أصيل محشو بنوتيلا ذائبة ومحضّر طازجاً على الفور.',
    descFr: "La classique et indémodable crêpe française au Nutella fondant préparée minute.",
    price: 350,
    image: '/images/crepe-1.jpeg',
    available: true,
    featured: false
  },
  {
    slug: 'crepe-banane-nutella',
    nameAr: 'كريب موز ونوتيلا',
    nameFr: 'Crêpe Banane & Nutella',
    descAr: 'قطع الموز الطازجة مع طبقة سخية من نوتيلا وصوص الشوكولاتة.',
    descFr: "Rondelles de bananes fraîches associées au Nutella crémeux.",
    price: 400,
    image: '/images/crepe-2.jpeg',
    available: true,
    featured: false
  },
  {
    slug: 'crepe-kinder-bueno',
    nameAr: 'كريب كيندر بوينو وايت',
    nameFr: 'Crêpe Kinder Bueno White',
    descAr: 'كريمة بوينو البيضاء اللذيذة مع أصابع كيندر المقرمشة.',
    descFr: "Crème onctueuse noisette chocolat blanc avec morceaux de Kinder Bueno.",
    price: 600,
    image: '/images/crepe-3.jpeg',
    available: true,
    featured: false
  }
];

async function main() {
  console.log('Seeding products with your custom crepe images...');
  for (const p of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p
    });
  }
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });