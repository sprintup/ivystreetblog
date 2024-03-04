// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     // Create a new book
//     const { title, author, isbn, publicationDate, tags, amazonLink } = req.body;
//     try {
//       const book = await prisma.book.create({
//         data: {
//           title,
//           author,
//           isbn,
//           publicationDate,
//           tags: tags.split(','),
//           amazonLink,
//         },
//       });
//       res.status(201).json(book);
//     } catch (error) {
//       res.status(500).json({ error: 'Error creating book' });
//     }
//   } else if (req.method === 'GET') {
//     // Get all books
//     try {
//       const books = await prisma.book.findMany();
//       res.status(200).json(books);
//     } catch (error) {
//       res.status(500).json({ error: 'Error retrieving books' });
//     }
//   } else {
//     res.status(405).end(); // Method Not Allowed
//   }
// }