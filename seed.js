require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const User = require('./src/models/user.model');
const Product = require('./src/models/product.model');
const Category = require('./src/models/category.model');
const Cart = require('./src/models/cart.model');
const Blog = require('./src/models/blog.model');
const Order = require('./src/models/order.model');
// const Image = require("./src/models/image.model");

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding Database...');

    // Clear existing data

    // await User.deleteMany();
    // await Product.deleteMany();
    // await Category.deleteMany();
    // await Cart.deleteMany();
    // await Blog.deleteMany();
    // await Order.deleteMany();
    // await Image.deleteMany();

    // ======================
    // 1. Create Users
    // ======================
    // const users = await User.insertMany([
    //   {
    //     username: "Haleem",
    //     email: "Haleemo777@example.com",
    //     password: "haleemo236!",
    //     role: "ADMIN",
    //     phone: "01126105400",
    //   },
    //   {
    //     username: "Mohamed",
    //     email: "Mohamed236236@gmail.com",
    //     password: "hiiiii263!",
    //     phone: "01126105400",
    //   },
    // ]);

    // ======================
    // 2. Create Categories
    // ======================
    // const categories = await Category.insertMany([
    //   {
    //     name: "beds",
    //     description:
    //       "Beds are essential furniture pieces designed for sleeping and resting. They come in various styles, sizes, and materials to suit different preferences and needs.",
    //     image:
    //       "https://res.cloudinary.com/dddhappm3/image/upload/v1742566578/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-6_fypo21.jpg",
    //   },
    // ]);

    // ======================
    // 3. Create Products
    // ======================

    const products = await Product.insertMany([
      {
        name: 'Streiko bed',
        subtitle: ' streiko bed is comfortable',
        price: 1900.99,
        sale: 15,
        categories: ['67f1986686cf275218e0ad06'],
        description:
          " The Streiko bed is a stylish and comfortable sleeping solution that combines modern design with functionality. Its sleek lines and premium fabric upholstery create an elegant look, while the sturdy construction ensures durability. The bed features a plush mattress for optimal comfort, making it perfect for a restful night's sleep. Available in various colors, including light gray and dark gray, the Streiko bed seamlessly fits into any bedroom decor. With its contemporary aesthetic and cozy feel, this bed is an excellent choice for those seeking both style and comfort.",
        brand: 'IkEA',
        colors: [
          {
            name: 'walnut',
            hex: '#8B4513',

            images: [
              {
                public_id:
                  'categories/beds/Streiko Bed/walnut/Streiko_Bed-7_x7f4fk',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742566618/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-7_x7f4fk.png',
              },
              {
                public_id:
                  'categories/beds/Streiko Bed/walnut/Streiko_Bed-6_fypo21',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742566578/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-6_fypo21.jpg',
              },
              {
                public_id:
                  'categories/beds/Streiko Bed/walnut/Streiko_Bed-8_jw5ewj',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742566578/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-8_jw5ewj.jpg',
              },
              {
                public_id:
                  'categories/beds/Streiko Bed/walnut/Streiko_Bed-5_r88fyc',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742566578/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-5_r88fyc.jpg',
              },
              {
                public_id:
                  'categories/beds/Streiko Bed/walnut/Streiko_Bed-4_ceyiib',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742566578/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-4_ceyiib.png',
              },
              {
                public_id:
                  'categories/beds/Streiko Bed/walnut/Streiko_Bed-1_g5kumg',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742566577/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-1_g5kumg.png',
              },
              {
                public_id:
                  'categories/beds/Streiko Bed/walnut/Streiko_Bed-2_ryeui0',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742566577/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-2_ryeui0.jpg',
              },
              {
                public_id:
                  'categories/beds/Streiko Bed/walnut/Streiko_Bed-3_kjgtza',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742566577/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-3_kjgtza.jpg',
              },
            ],
            quantity: 9,
          },
          // {
          //   name: "Dark Blue",
          //   hex: "#0000FF",

          //   images: [
          //     {
          //       public_id:
          //         "categories/sofas/smedstorp/dark blue/smedstorp-5_vyl6bu",
          //       url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871593/categories/sofas/smedstorp/dark%20blue/smedstorp-5_vyl6bu.jpg",
          //     },
          //     {
          //       public_id:
          //         "categories/sofas/smedstorp/dark blue/smedstorp-2_q2od9s",
          //       url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871591/categories/sofas/smedstorp/dark%20blue/smedstorp-2_q2od9s.jpg",
          //     },
          //     {
          //       public_id:
          //         "categories/sofas/smedstorp/dark blue/smedstorp-3_o2y8hh",
          //       url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871590/categories/sofas/smedstorp/dark%20blue/smedstorp-3_o2y8hh.jpg",
          //     },
          //     {
          //       public_id:
          //         "categories/sofas/smedstorp/dark blue/smedstorp-6_ap5orh",
          //       url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871584/categories/sofas/smedstorp/dark%20blue/smedstorp-6_ap5orh.jpg",
          //     },
          //     {
          //       public_id:
          //         "categories/sofas/smedstorp/dark blue/smedstorp-4_gmoerw",
          //       url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871579/categories/sofas/smedstorp/dark%20blue/smedstorp-4_gmoerw.jpg",
          //     },
          //     {
          //       public_id:
          //         "categories/sofas/smedstorp/dark blue/smedstorp-1_kqekak",
          //       url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871574/categories/sofas/smedstorp/dark%20blue/smedstorp-1_kqekak.jpg",
          //     },
          //   ],
          //   quantity: 10,
          // },
        ],

        additionalInformation: {
          general: {
            salesPackage: 'bed ',
            modelNumber: 'bed--123',
            configuration: 'Fixed sleep',
            upholsteryMaterial: 'Velvet',
            upholsteryColor: 'Black',
          },
          productDetails: {
            fillingMaterial: 'Foam',
            finishType: 'Matte',
            adjustableHeadrest: false,
            maximumLoadCapacity: 300,
            originOfManufacture: 'USA',
          },
          dimensions: {
            width: 200,
            height: 85,
            depth: 90,
            seatHeight: 45,
            legHeight: 10,
          },
          warranty: {
            summary: '1 Year Warranty',
            serviceType: 'Onsite Service',
            covered: 'Manufacturing Defects',
            notCovered: 'Physical Damage',
            domesticWarranty: 'Yes',
          },
        },
      },
      {
        name: 'Slattum',
        subtitle: ' slattum bed is comfortable bed ',
        price: 1450.99,
        sale: 7.5,
        categories: ['67f1986686cf275218e0ad06'],
        description:
          " The Slattum bed is a stylish and comfortable sleeping solution that combines modern design with functionality. Its sleek lines and premium fabric upholstery create an elegant look, while the sturdy construction ensures durability. The bed features a plush mattress for optimal comfort, making it perfect for a restful night's sleep. Available in various colors, including light gray and dark gray, the Slattum bed seamlessly fits into any bedroom decor. With its contemporary aesthetic and cozy feel, this bed is an excellent choice for those seeking both style and comfort.",
        brand: 'IkEA',
        colors: [
          {
            name: 'Dark Gray',
            hex: '#A9A9A9',

            images: [
              {
                public_id: 'categories/beds/slattum/dark gray/slattum-5_yphje9',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871931/categories/beds/slattum/dark%20gray/slattum-5_yphje9.jpg',
              },
              {
                public_id: 'categories/beds/slattum/dark gray/slattum-1_gyiggf',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871931/categories/beds/slattum/dark%20gray/slattum-1_gyiggf.jpg',
              },
              {
                public_id: 'categories/beds/slattum/dark gray/slattum-2_m1tsg5',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871930/categories/beds/slattum/dark%20gray/slattum-2_m1tsg5.jpg',
              },
              {
                public_id: 'categories/beds/slattum/dark gray/slattum-6_azojr6',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871928/categories/beds/slattum/dark%20gray/slattum-6_azojr6.jpg',
              },
              {
                public_id: 'categories/beds/slattum/dark gray/slattum-4_jcunut',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871927/categories/beds/slattum/dark%20gray/slattum-4_jcunut.jpg',
              },
            ],
            quantity: 3,
          },
          {
            name: 'Light Blue',
            hex: '#ADD8E6',

            images: [
              {
                public_id:
                  'categories/beds/slattum/light blue/slattum-5_ekky4m',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871980/categories/beds/slattum/light%20blue/slattum-5_ekky4m.jpg',
              },
              {
                public_id:
                  'categories/beds/slattum/light blue/slattum-6_dqcpkw',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871980/categories/beds/slattum/light%20blue/slattum-6_dqcpkw.jpg',
              },
              {
                public_id:
                  'categories/beds/slattum/light blue/slattum-2_bdlret',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871977/categories/beds/slattum/light%20blue/slattum-2_bdlret.jpg',
              },
              {
                public_id:
                  'categories/beds/slattum/light blue/slattum-3_pzovdz',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871975/categories/beds/slattum/light%20blue/slattum-3_pzovdz.jpg',
              },
              {
                public_id:
                  'categories/beds/slattum/light blue/slattum-4_juxrob',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871967/categories/beds/slattum/light%20blue/slattum-4_juxrob.jpg',
              },
              {
                public_id:
                  'categories/beds/slattum/light blue/slattum-1_kd8wy5',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743871952/categories/beds/slattum/light%20blue/slattum-1_kd8wy5.jpg',
              },
            ],
            quantity: 11,
          },
        ],

        additionalInformation: {
          general: {
            salesPackage: 'Bed ',
            modelNumber: 'confo-bed--135',
            configuration: 'Fixed',
            upholsteryMaterial: 'Velvet',
            upholsteryColor: 'Black',
          },
          productDetails: {
            fillingMaterial: 'Foam',
            finishType: 'Matte',
            adjustableHeadrest: false,
            maximumLoadCapacity: 300,
            originOfManufacture: 'USA',
          },
          dimensions: {
            width: 200,
            height: 85,
            depth: 90,
            seatHeight: 45,
            legHeight: 10,
          },
          warranty: {
            summary: '1 Year Warranty',
            serviceType: 'Onsite Service',
            covered: 'Manufacturing Defects',
            notCovered: 'Physical Damage',
            domesticWarranty: 'Yes',
          },
        },
      },
      {
        name: 'Tarva',
        subtitle: 'tarva bed is a stylish and comfortable bed',
        price: 1600.99,
        sale: 14,
        categories: ['67f1986686cf275218e0ad06'],
        description:
          " The Tarva bed is a stylish and comfortable sleeping solution that combines modern design with functionality. Its sleek lines and premium fabric upholstery create an elegant look, while the sturdy construction ensures durability. The bed features a plush mattress for optimal comfort, making it perfect for a restful night's sleep. Available in various colors, including light gray and dark gray, the Tarva bed seamlessly fits into any bedroom decor. With its contemporary aesthetic and cozy feel, this bed is an excellent choice for those seeking both style and comfort.",
        brand: 'IkEA',
        colors: [
          {
            name: 'Pine',
            hex: '#DEB887',

            images: [
              {
                public_id: 'categories/beds/tarva/pine/tarva-5_mtkd9x',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872025/categories/beds/tarva/pine/tarva-5_mtkd9x.jpg',
              },
              {
                public_id: 'categories/beds/tarva/pine/tarva-4_pbjhos',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872022/categories/beds/tarva/pine/tarva-4_pbjhos.jpg',
              },
              {
                public_id: 'categories/beds/tarva/pine/tarva-3_pb6q5h',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872020/categories/beds/tarva/pine/tarva-3_pb6q5h.jpg',
              },
              {
                public_id: 'categories/beds/tarva/pine/tarva-6_pnnqky',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872020/categories/beds/tarva/pine/tarva-6_pnnqky.jpg',
              },
              {
                public_id: 'categories/beds/tarva/pine/tarva-1_mdx7j4',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872013/categories/beds/tarva/pine/tarva-1_mdx7j4.jpg',
              },
              {
                public_id: 'categories/beds/tarva/pine/tarva-2_xpaeqy',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872001/categories/beds/tarva/pine/tarva-2_xpaeqy.jpg',
              },
            ],
            quantity: 11,
          },
          {
            name: 'White Stained',
            hex: '#F5F5F5',

            images: [
              {
                public_id: 'categories/beds/tarva/white stained/tarva-2_icpu7d',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872056/categories/beds/tarva/white%20stained/tarva-2_icpu7d.jpg',
              },
              {
                public_id: 'categories/beds/tarva/white stained/tarva-3_bd0tyk',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872055/categories/beds/tarva/white%20stained/tarva-3_bd0tyk.jpg',
              },
              {
                public_id: 'categories/beds/tarva/white stained/tarva-5_ifcu3z',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872054/categories/beds/tarva/white%20stained/tarva-5_ifcu3z.jpg',
              },
              {
                public_id: 'categories/beds/tarva/white stained/tarva-4_amgcvj',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872053/categories/beds/tarva/white%20stained/tarva-4_amgcvj.jpg',
              },
              {
                public_id: 'categories/beds/tarva/white stained/tarva-1_yj1z3d',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1743872041/categories/beds/tarva/white%20stained/tarva-1_yj1z3d.jpg',
              },
            ],
            quantity: 9,
          },
        ],

        additionalInformation: {
          general: {
            salesPackage: 'bed ',
            modelNumber: 'bedd-135',
            configuration: 'Fixed Seat',
            upholsteryMaterial: 'Velvet',
            upholsteryColor: 'Black',
          },
          productDetails: {
            fillingMaterial: 'Foam',
            finishType: 'Matte',
            adjustableHeadrest: false,
            maximumLoadCapacity: 300,
            originOfManufacture: 'USA',
          },
          dimensions: {
            width: 200,
            height: 85,
            depth: 90,
            seatHeight: 45,
            legHeight: 10,
          },
          warranty: {
            summary: '1 Year Warranty',
            serviceType: 'Onsite Service',
            covered: 'Manufacturing Defects',
            notCovered: 'Physical Damage',
            domesticWarranty: 'Yes',
          },
        },
      },
      {
        name: 'Valt Bed',
        subtitle: ' valt bed is a stylish and comfortable bed',
        price: 999.99,
        sale: 11.5,
        categories: ['67f1986686cf275218e0ad06'],
        description:
          " The Valt bed is a stylish and comfortable sleeping solution that combines modern design with functionality. Its sleek lines and premium fabric upholstery create an elegant look, while the sturdy construction ensures durability. The bed features a plush mattress for optimal comfort, making it perfect for a restful night's sleep. Available in various colors, including light gray and dark gray, the Valt bed seamlessly fits into any bedroom decor. With its contemporary aesthetic and cozy feel, this bed is an excellent choice for those seeking both style and comfort.",
        brand: 'IkEA',
        colors: [
          {
            name: 'Oak',
            hex: '#FFD700',
            images: [
              {
                public_id: 'categories/beds/Valt Bed/oak/Valt_Bed-5_bmtn6t',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742567068/categories/beds/Valt%20Bed/oak/Valt_Bed-5_bmtn6t.jpg',
              },
              {
                public_id: 'categories/beds/Valt Bed/oak/Valt_Bed-7_bultft',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742567064/categories/beds/Valt%20Bed/oak/Valt_Bed-7_bultft.jpg',
              },
              {
                public_id: 'categories/beds/Valt Bed/oak/Valt_Bed-6_jd0ta3',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742567051/categories/beds/Valt%20Bed/oak/Valt_Bed-6_jd0ta3.png',
              },
              {
                public_id: 'categories/beds/Valt Bed/oak/Valt_Bed-1_fcssyg',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742567050/categories/beds/Valt%20Bed/oak/Valt_Bed-1_fcssyg.jpg',
              },
              {
                public_id: 'categories/beds/Valt Bed/oak/Valt_Bed-4_ohgfkr',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742567048/categories/beds/Valt%20Bed/oak/Valt_Bed-4_ohgfkr.png',
              },
              {
                public_id: 'categories/beds/Valt Bed/oak/Valt_Bed-3_woi4xn',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742567040/categories/beds/Valt%20Bed/oak/Valt_Bed-3_woi4xn.jpg',
              },
              {
                public_id: 'categories/beds/Valt Bed/oak/Valt_Bed-2_j3dm78',
                url: 'https://res.cloudinary.com/dddhappm3/image/upload/v1742567040/categories/beds/Valt%20Bed/oak/Valt_Bed-2_j3dm78.jpg',
              },
            ],
            quantity: 19,
          },
        ],

        additionalInformation: {
          general: {
            salesPackage: 'bed ',
            modelNumber: 'comfoo--135',
            configuration: 'Fixed Seat',
            upholsteryMaterial: 'Velvet',
            upholsteryColor: 'Black',
          },
          productDetails: {
            fillingMaterial: 'Foam',
            finishType: 'Matte',
            adjustableHeadrest: false,
            maximumLoadCapacity: 300,
            originOfManufacture: 'USA',
          },
          dimensions: {
            width: 200,
            height: 85,
            depth: 90,
            seatHeight: 45,
            legHeight: 10,
          },
          warranty: {
            summary: '1 Year Warranty',
            serviceType: 'Onsite Service',
            covered: 'Manufacturing Defects',
            notCovered: 'Physical Damage',
            domesticWarranty: 'Yes',
          },
        },
      },
    ]);

    // ======================
    // 5. Create Carts
    // ======================
    // const carts = await Cart.insertMany([
    //   {
    //     userId: users[1]._id,
    //     products: [
    //       {
    //         id: products[0]._id,
    //         quantity: 2,
    //       },
    //       {
    //         id: products[1]._id,
    //         quantity: 1,
    //       },
    //     ],
    //   },
    //   {
    //     userId: users[0]._id,
    //     products: [
    //       {
    //         id: products[0]._id,
    //         quantity: 2,
    //       },
    //       {
    //         id: products[1]._id,
    //         quantity: 4,
    //       },
    //     ],
    //   },
    // ]);
    // // ======================
    // // 6. Create Orders
    // // ======================
    // const orders = await Order.insertMany([
    //   {
    //     userId: users[1]._id,
    //     orderItems: [
    //       {
    //         id: products[0]._id,
    //         quantity: 1,
    //       },
    //     ],
    //     shippingAddress: {
    //       street: "123 Main Street",
    //       city: "New York",
    //       province: "NY",
    //       zipCode: "10001",
    //       country: "USA",
    //     },
    //     totalAmount: products[0].price * 0.9, // 10% discount
    //     paymentMethod: "Direct Bank Transfer",
    //     status: "Delivered",
    //     transactionId: "TX123456789",
    //   },
    // ]);

    // ======================
    // 7. Create Images
    // ======================
    // const images = await Image.insertMany([
    //   {
    //     public_id: "living_room_1",
    //     url: "https://example.com/living-room.jpg",
    //   },
    //   {
    //     public_id: "bedroom_1",
    //     url: "https://example.com/bedroom.jpg",
    //   },
    // ]);

    console.log('Database Seeding Completed ✅');
    // console.log(`Summary:
    //    Products: ${products.length}`);

    await mongoose.connection.close();
    console.log('MongoDB Connection Closed 🔌');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed ❌', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
