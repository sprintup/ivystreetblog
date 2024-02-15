# Install Node.js dependencies
npm install

# Install Python dependencies
pip install --user -r requirements.txt

# Generate Prisma client
npx prisma generate

# Run the Next.js development server and the Prisma migration (if needed) in parallel
npx prisma migrate dev & npm run dev
