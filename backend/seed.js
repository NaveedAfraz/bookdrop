const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('🌱 Seeding Bookdrop with production-quality data...\n');

    // ─── 1. USERS ───────────────────────────────────────────────
    const salt = await bcrypt.genSalt(10);
    const users = [
        { name: 'Admin User', email: 'admin@bookdrop.com', password: await bcrypt.hash('admin123', salt), role: 'admin' },
        { name: 'Arjun Mehta', email: 'arjun@example.com', password: await bcrypt.hash('password123', salt), role: 'user' },
        { name: 'Sophia Lin', email: 'sophia@example.com', password: await bcrypt.hash('password123', salt), role: 'user' },
        { name: 'Marcus Johnson', email: 'marcus@example.com', password: await bcrypt.hash('password123', salt), role: 'user' },
        { name: 'Priya Sharma', email: 'priya@example.com', password: await bcrypt.hash('password123', salt), role: 'user' },
        { name: 'Elena Rivera', email: 'elena@example.com', password: await bcrypt.hash('password123', salt), role: 'user' },
    ];

    // Clear existing data in reverse FK order
    const tablesToClear = [
        'room_messages', 'room_members', 'read_together_rooms',
        'refund_requests', 'reviews', 'courses',
        'bundle_books', 'bundles',
        'user_challenges', 'challenges',
        'book_journey', 'order_items', 'orders',
        'cart_items', 'cart',
        'user_swipes', 'wishlist',
        'second_hand_books', 'chapters', 'addresses',
        'books', 'users'
    ];

    for (const table of tablesToClear) {
        try {
            await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
            await connection.query(`TRUNCATE TABLE ${table};`);
        } catch (e) { /* table may not exist */ }
    }
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('✓ Cleared all existing data');

    // Insert users
    for (const u of users) {
        await connection.query(
            "INSERT INTO users (name, email, password, role, points) VALUES (?, ?, ?, ?, ?)",
            [u.name, u.email, u.password, u.role, Math.floor(Math.random() * 500)]
        );
    }
    console.log(`✓ Seeded ${users.length} users`);

    // ─── 2. BOOKS (30 real books) ───────────────────────────────
    const books = [
        { title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 12.99, stock: 25, category: 'Fiction', country: 'United States', year: 1960, cover: 'https://covers.openlibrary.org/b/id/8228691-L.jpg', desc: 'A gripping tale of racial injustice in the American South seen through the eyes of young Scout Finch. Her father, lawyer Atticus Finch, defends a Black man accused of a terrible crime, forcing the town to confront its deepest prejudices.' },
        { title: '1984', author: 'George Orwell', price: 10.99, stock: 30, category: 'Sci-Fi', country: 'United Kingdom', year: 1949, cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg', desc: 'In a totalitarian future society, Winston Smith dares to think independently in a world where Big Brother controls every aspect of life. A chilling exploration of surveillance, propaganda, and the fragility of truth.' },
        { title: 'Pride and Prejudice', author: 'Jane Austen', price: 9.99, stock: 20, category: 'Romance', country: 'United Kingdom', year: 1813, cover: 'https://covers.openlibrary.org/b/id/12645114-L.jpg', desc: 'The turbulent courtship of Elizabeth Bennet and the proud Mr. Darcy unfolds against the backdrop of Georgian England, weaving wit, social commentary, and timeless romance into one of literature\'s greatest love stories.' },
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 11.50, stock: 18, category: 'Fiction', country: 'United States', year: 1925, cover: 'https://covers.openlibrary.org/b/id/8432047-L.jpg', desc: 'Jay Gatsby\'s obsessive pursuit of the elusive Daisy Buchanan serves as a meditation on the American Dream, wealth, and the green light at the end of the dock that symbolizes our perpetual reach for the unattainable.' },
        { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', price: 14.99, stock: 15, category: 'Fiction', country: 'Colombia', year: 1967, cover: 'https://covers.openlibrary.org/b/id/11527474-L.jpg', desc: 'The epic multigenerational saga of the Buendía family in the mythical town of Macondo. A landmark of magical realism that chronicles love, war, and the cyclical nature of human history across seven generations.' },
        { title: 'Dune', author: 'Frank Herbert', price: 15.99, stock: 22, category: 'Sci-Fi', country: 'United States', year: 1965, cover: 'https://covers.openlibrary.org/b/id/11153217-L.jpg', desc: 'On the desert planet Arrakis, young Paul Atreides must navigate political intrigue, ecological warfare, and an ancient prophecy as he fights for control of the universe\'s most valuable substance: the spice melange.' },
        { title: 'The Alchemist', author: 'Paulo Coelho', price: 13.50, stock: 28, category: 'Philosophy', country: 'Brazil', year: 1988, cover: 'https://covers.openlibrary.org/b/id/11104986-L.jpg', desc: 'A young Andalusian shepherd named Santiago travels from Spain to the Egyptian pyramids in search of a treasure buried near the Pyramids. Along the way, he learns to listen to his heart and read the omens of life.' },
        { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', price: 18.99, stock: 12, category: 'Non-Fiction', country: 'Israel', year: 2011, cover: 'https://covers.openlibrary.org/b/id/10521270-L.jpg', desc: 'From the Stone Age to the Silicon Age, Harari traces 70,000 years of human history to answer the fundamental question: how did an insignificant ape come to dominate the Earth and reshape the planet?' },
        { title: 'Norwegian Wood', author: 'Haruki Murakami', price: 13.99, stock: 16, category: 'Fiction', country: 'Japan', year: 1987, cover: 'https://covers.openlibrary.org/b/id/8166612-L.jpg', desc: 'A nostalgic story of loss and sexuality set in 1960s Tokyo. Toru Watanabe is caught between two very different women—the beautiful yet emotionally fragile Naoko and the outgoing, lively Midori—as he navigates the complexities of desire and grief.' },
        { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', price: 16.50, stock: 10, category: 'Fiction', country: 'Russia', year: 1880, cover: 'https://covers.openlibrary.org/b/id/12761931-L.jpg', desc: 'A passionate philosophical novel that enters deeply into questions of God, free will, and morality through the story of three brothers and their dissolute father\'s murder. Dostoevsky\'s final and most monumental work.' },
        { title: 'Atomic Habits', author: 'James Clear', price: 16.99, stock: 35, category: 'Self-Help', country: 'United States', year: 2018, cover: 'https://covers.openlibrary.org/b/id/10958382-L.jpg', desc: 'No matter your goals, this proven framework for building good habits and breaking bad ones will transform your daily life. Clear reveals how tiny changes in behavior can lead to remarkable results over time.' },
        { title: 'The Silent Patient', author: 'Alex Michaelides', price: 14.99, stock: 19, category: 'Thriller', country: 'United Kingdom', year: 2019, cover: 'https://covers.openlibrary.org/b/id/12813642-L.jpg', desc: 'Alicia Berenson shoots her husband five times and then never speaks another word. Criminal psychotherapist Theo Faber becomes obsessed with uncovering her motive in this twisting, suspenseful debut that shocked millions.' },
        { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', price: 11.99, stock: 14, category: 'Fiction', country: 'Russia', year: 1866, cover: 'https://covers.openlibrary.org/b/id/12760643-L.jpg', desc: 'Raskolnikov, a destitute former student, commits a murder to prove his theory that extraordinary people are above moral law. What follows is a psychological descent into guilt, suffering, and the quest for redemption.' },
        { title: 'Educated', author: 'Tara Westover', price: 15.50, stock: 17, category: 'Non-Fiction', country: 'United States', year: 2018, cover: 'https://covers.openlibrary.org/b/id/8510884-L.jpg', desc: 'Born to survivalists in the mountains of Idaho, Tara Westover was kept out of school until she taught herself enough to enter university at age seventeen. A raw memoir of family loyalty, the pursuit of knowledge, and the courage to remake yourself.' },
        { title: 'The Kite Runner', author: 'Khaled Hosseini', price: 13.99, stock: 21, category: 'Fiction', country: 'Afghanistan', year: 2003, cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', desc: 'Amir and Hassan are childhood friends in Kabul, inseparable despite their different social classes—until a shattering act of betrayal changes everything. A powerful story of friendship, guilt, and redemption against a backdrop of Afghan history.' },
        { title: 'The Midnight Library', author: 'Matt Haig', price: 14.50, stock: 23, category: 'Fiction', country: 'United Kingdom', year: 2020, cover: 'https://covers.openlibrary.org/b/id/10389354-L.jpg', desc: 'Between life and death there is a library where each book offers the chance to try another life you could have lived. Nora Seed must search through infinite possibilities to find the one life worth living.' },
        { title: 'A Brief History of Time', author: 'Stephen Hawking', price: 17.99, stock: 11, category: 'Non-Fiction', country: 'United Kingdom', year: 1988, cover: 'https://covers.openlibrary.org/b/id/8587200-L.jpg', desc: 'From the Big Bang to black holes, Stephen Hawking attempts to explain the universe in non-technical language. A landmark work that made cosmology accessible to millions and forever changed how we think about our place in the cosmos.' },
        { title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', price: 12.99, stock: 20, category: 'Sci-Fi', country: 'Canada', year: 1985, cover: 'https://covers.openlibrary.org/b/id/12476419-L.jpg', desc: 'In the Republic of Gilead, a theocratic military dictatorship formed within the borders of what was once the United States, Offred serves as a Handmaid—valued only for her fertility in a world stripped of women\'s rights.' },
        { title: 'Things Fall Apart', author: 'Chinua Achebe', price: 11.50, stock: 18, category: 'Fiction', country: 'Nigeria', year: 1958, cover: 'https://covers.openlibrary.org/b/id/8474484-L.jpg', desc: 'Okonkwo, a proud warrior in a Nigerian village, watches as colonialism and Christianity unravel the traditions of the Igbo people. Achebe\'s masterpiece gave voice to a continent and redefined postcolonial literature.' },
        { title: 'Siddhartha', author: 'Hermann Hesse', price: 10.50, stock: 24, category: 'Philosophy', country: 'Germany', year: 1922, cover: 'https://covers.openlibrary.org/b/id/8231289-L.jpg', desc: 'A young Indian Brahmin abandons a life of privilege to seek spiritual enlightenment. His journey takes him through asceticism, sensual pleasure, and despair before he discovers that wisdom cannot be taught—only experienced.' },
        { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', price: 12.50, stock: 26, category: 'Sci-Fi', country: 'United Kingdom', year: 1979, cover: 'https://covers.openlibrary.org/b/id/8775080-L.jpg', desc: 'Seconds before Earth is demolished to make way for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect. Together they hitchhike across the cosmos armed with nothing but a towel and a sense of bewilderment.' },
        { title: 'Kafka on the Shore', author: 'Haruki Murakami', price: 14.99, stock: 13, category: 'Fiction', country: 'Japan', year: 2002, cover: 'https://covers.openlibrary.org/b/id/8231550-L.jpg', desc: 'A fifteen-year-old boy runs away from home to escape an oedipal prophecy while an aging simpleton searches for a lost cat. Their parallel journeys interweave into a dreamlike tapestry of metaphysics, music, and memory.' },
        { title: 'Becoming', author: 'Michelle Obama', price: 19.99, stock: 15, category: 'Non-Fiction', country: 'United States', year: 2018, cover: 'https://covers.openlibrary.org/b/id/8513823-L.jpg', desc: 'Michelle Obama invites readers into her world, chronicling the experiences that shaped her—from growing up on the South Side of Chicago to her years as First Lady. An intimate, powerful, and inspiring memoir.' },
        { title: 'The Book Thief', author: 'Markus Zusak', price: 13.50, stock: 20, category: 'Fiction', country: 'Australia', year: 2005, cover: 'https://covers.openlibrary.org/b/id/8306979-L.jpg', desc: 'Narrated by Death, this is the story of Liesel Meminger, a foster girl living outside Munich during World War II. She scratches out a meager existence by stealing books, sharing them with neighbors, and reading in bomb shelters.' },
        { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', price: 17.50, stock: 10, category: 'Non-Fiction', country: 'Israel', year: 2011, cover: 'https://covers.openlibrary.org/b/id/8760208-L.jpg', desc: 'Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind, explaining the two systems that drive the way we think—System 1 (fast, intuitive) and System 2 (slow, deliberate)—and how they shape our judgments and decisions.' },
        { title: 'Anna Karenina', author: 'Leo Tolstoy', price: 12.99, stock: 12, category: 'Romance', country: 'Russia', year: 1878, cover: 'https://covers.openlibrary.org/b/id/12579512-L.jpg', desc: 'The tragic story of a married aristocrat and her passionate affair with the dashing Count Vronsky. Tolstoy weaves together questions of love, family, faith, and the meaning of life in what is often called the greatest novel ever written.' },
        { title: 'Persepolis', author: 'Marjane Satrapi', price: 15.99, stock: 14, category: 'Non-Fiction', country: 'Iran', year: 2000, cover: 'https://covers.openlibrary.org/b/id/6597103-L.jpg', desc: 'A graphic memoir of growing up in Iran during the Islamic Revolution. With striking black-and-white artwork, Satrapi tells her story of childhood rebellion, exile, and the universal desire for freedom and belonging.' },
        { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', price: 14.99, stock: 30, category: 'Self-Help', country: 'United States', year: 2016, cover: 'https://covers.openlibrary.org/b/id/8514367-L.jpg', desc: 'A counterintuitive approach to living a good life. Mark Manson argues that life\'s struggles give it meaning, and the key to happiness is not about being positive all the time, but choosing what is worth suffering for.' },
        { title: 'Circe', author: 'Madeline Miller', price: 15.50, stock: 18, category: 'Fantasy', country: 'United States', year: 2018, cover: 'https://covers.openlibrary.org/b/id/8577067-L.jpg', desc: 'In the house of Helios, god of the sun, a daughter is born. Circe is a strange child—not powerful like her father, nor viciously alluring like her mother. But she discovers her own power: witchcraft, which allows her to transform rivals into monsters.' },
        { title: 'The Name of the Wind', author: 'Patrick Rothfuss', price: 16.99, stock: 16, category: 'Fantasy', country: 'United States', year: 2007, cover: 'https://covers.openlibrary.org/b/id/8572891-L.jpg', desc: 'Told in Kvothe\'s own voice, this is the tale of the magically gifted orphan who grows to be the most notorious wizard his world has ever seen—from his childhood in a troupe of traveling players to years spent as a near-feral orphan to his daring days in a vast university.' },
    ];

    for (const b of books) {
        await connection.query(
            "INSERT INTO books (title, author, description, price, stock, cover_image, category, country, published_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [b.title, b.author, b.desc, b.price, b.stock, b.cover, b.category, b.country, b.year]
        );
    }
    console.log(`✓ Seeded ${books.length} books`);

    // ─── 3. CHAPTERS (sample for first 5 books) ────────────────
    for (let bookId = 1; bookId <= 5; bookId++) {
        for (let ch = 1; ch <= 3; ch++) {
            await connection.query(
                "INSERT INTO chapters (book_id, chapter_number, content, is_free) VALUES (?, ?, ?, ?)",
                [bookId, ch, `This is a preview of Chapter ${ch}. The full content would contain the complete text of the chapter as it appears in the published edition. This sample demonstrates how the reading experience works within the Bookdrop platform.`, ch === 1]
            );
        }
    }
    console.log('✓ Seeded sample chapters');

    // ─── 4. ADDRESSES ───────────────────────────────────────────
    const addresses = [
        { userId: 2, name: 'Arjun Mehta', phone: '9876543210', street: '42 MG Road, Indiranagar', city: 'Bangalore', state: 'Karnataka', pin: '560038' },
        { userId: 3, name: 'Sophia Lin', phone: '4155551234', street: '1847 Haight Street', city: 'San Francisco', state: 'California', pin: '94117' },
        { userId: 4, name: 'Marcus Johnson', phone: '2075553456', street: '12 Camden High Street', city: 'London', state: 'England', pin: 'NW1 0LU' },
        { userId: 5, name: 'Priya Sharma', phone: '9845012345', street: '78 Connaught Place', city: 'New Delhi', state: 'Delhi', pin: '110001' },
        { userId: 6, name: 'Elena Rivera', phone: '5551234567', street: 'Calle Gran Vía 25', city: 'Madrid', state: 'Madrid', pin: '28013' },
    ];

    for (const a of addresses) {
        await connection.query(
            "INSERT INTO addresses (user_id, full_name, phone, street, city, state, pincode, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)",
            [a.userId, a.name, a.phone, a.street, a.city, a.state, a.pin]
        );
    }
    console.log('✓ Seeded addresses');

    // ─── 5. ORDERS + ORDER ITEMS ────────────────────────────────
    const orderData = [
        { userId: 2, addrId: 1, total: 36.48, items: [{ bookId: 1, qty: 1, price: 12.99 }, { bookId: 6, qty: 1, price: 15.99 }, { bookId: 11, qty: 1, price: 16.99 }] },
        { userId: 3, addrId: 2, total: 29.48, items: [{ bookId: 3, qty: 1, price: 9.99 }, { bookId: 9, qty: 1, price: 13.99 }, { bookId: 22, qty: 1, price: 14.99 }] },
        { userId: 4, addrId: 3, total: 44.48, items: [{ bookId: 2, qty: 1, price: 10.99 }, { bookId: 8, qty: 1, price: 18.99 }, { bookId: 12, qty: 1, price: 14.99 }] },
        { userId: 5, addrId: 4, total: 27.48, items: [{ bookId: 5, qty: 1, price: 14.99 }, { bookId: 7, qty: 1, price: 13.50 }] },
        { userId: 2, addrId: 1, total: 31.49, items: [{ bookId: 16, qty: 1, price: 14.50 }, { bookId: 25, qty: 1, price: 17.50 }] },
        { userId: 6, addrId: 5, total: 28.98, items: [{ bookId: 15, qty: 1, price: 13.99 }, { bookId: 19, qty: 1, price: 11.50 }, { bookId: 20, qty: 1, price: 10.50 }] },
    ];

    for (const o of orderData) {
        const days = Math.floor(Math.random() * 30);
        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, address_id, total_amount, payment_status, order_status, created_at) VALUES (?, ?, ?, 'SUCCESS', 'DELIVERED', DATE_SUB(NOW(), INTERVAL ? DAY))",
            [o.userId, o.addrId, o.total, days]
        );
        const orderId = orderResult.insertId;
        for (const item of o.items) {
            await connection.query(
                "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)",
                [orderId, item.bookId, item.qty, item.price]
            );
        }
    }
    console.log(`✓ Seeded ${orderData.length} orders`);

    // ─── 6. REVIEWS ─────────────────────────────────────────────
    const reviews = [
        { bookId: 1, name: 'Emily Chen', text: 'This book changed my perspective on justice and empathy. Atticus Finch is one of the most compelling characters in all of literature. I return to it every few years and find new meaning each time.', rating: 5 },
        { bookId: 1, name: 'David K.', text: 'An essential read that remains painfully relevant. The writing is beautiful, the characters unforgettable. It should be required reading for everyone.', rating: 5 },
        { bookId: 2, name: 'Alex Torres', text: 'Reading this felt more like prophecy than fiction. Orwell\'s vision of surveillance and manufactured truth feels eerily prescient in 2024. Terrifying and essential.', rating: 5 },
        { bookId: 6, name: 'Jordan L.', text: 'The world-building is unparalleled. Herbert created an entire universe with its own ecology, politics, religion, and philosophy. A masterclass in science fiction.', rating: 5 },
        { bookId: 6, name: 'Nisha Patel', text: 'Dense but incredibly rewarding. The spice must flow! I\'ve read it three times and notice new layers of political intrigue with each reading.', rating: 4 },
        { bookId: 8, name: 'Marco V.', text: 'Harari makes you question everything you think you know about humanity. Dense with ideas but written accessibly. The section on the Agricultural Revolution was mind-blowing.', rating: 5 },
        { bookId: 11, name: 'Rachel M.', text: 'I read this in one sitting and immediately started implementing the 1% improvement philosophy. The habit stacking technique alone was worth the price.', rating: 5 },
        { bookId: 12, name: 'Sam K.', text: 'Could not put this down. The twist genuinely shocked me—and I usually see them coming. Masterful psychological suspense that will keep you guessing until the very last page.', rating: 4 },
        { bookId: 15, name: 'Fatima Al-R.', text: 'Heart-wrenching and beautifully written. Hosseini captures the complexity of Afghan culture and the weight of childhood guilt with profound tenderness. I wept at the end.', rating: 5 },
        { bookId: 16, name: 'Tom B.', text: 'What a beautiful concept—a library between life and death where you can try on other lives. It made me grateful for the life I\'m actually living. Truly life-affirming.', rating: 4 },
        { bookId: 3, name: 'Claire H.', text: 'Austen\'s wit is razor-sharp even two centuries later. Elizabeth Bennet is the heroine every generation deserves. The slow-burn romance between her and Darcy is perfection.', rating: 5 },
        { bookId: 9, name: 'Yuki T.', text: 'Murakami captures longing and melancholy like no other author. The Tokyo setting comes alive. A quiet, devastating novel about the irreversibility of loss.', rating: 4 },
        { bookId: 24, name: 'Ben W.', text: 'Death as the narrator is a stroke of genius. Zusak\'s prose is poetic without being pretentious. I highlighted more passages in this book than any other I\'ve ever read.', rating: 5 },
        { bookId: 29, name: 'Ana G.', text: 'Miller breathes fierce new life into Greek mythology. Circe\'s journey from overlooked daughter to powerful witch is both timeless and completely modern.', rating: 5 },
        { bookId: 30, name: 'Leo R.', text: 'The prose is genuinely beautiful—I caught myself re-reading paragraphs just for the pleasure of the language. Kvothe is a flawed, fascinating protagonist. Where is book three, Patrick?!', rating: 5 },
    ];

    for (const r of reviews) {
        await connection.query(
            "INSERT INTO reviews (book_id, name, review_text, rating) VALUES (?, ?, ?, ?)",
            [r.bookId, r.name, r.text, r.rating]
        );
    }
    console.log(`✓ Seeded ${reviews.length} reviews`);

    // ─── 7. SECOND-HAND MARKETPLACE ─────────────────────────────
    const secondHand = [
        { bookId: 1, sellerId: 2, price: 7.99, condition: 'Good' },
        { bookId: 3, sellerId: 3, price: 5.50, condition: 'Fair' },
        { bookId: 4, sellerId: 4, price: 8.99, condition: 'Good' },
        { bookId: 10, sellerId: 5, price: 9.50, condition: 'Good' },
        { bookId: 13, sellerId: 2, price: 6.99, condition: 'Worn' },
        { bookId: 7, sellerId: 6, price: 8.50, condition: 'Good' },
        { bookId: 20, sellerId: 3, price: 6.00, condition: 'Fair' },
        { bookId: 17, sellerId: 4, price: 10.99, condition: 'Good' },
    ];

    for (const sh of secondHand) {
        await connection.query(
            "INSERT INTO second_hand_books (book_id, seller_id, price, condition_desc, status) VALUES (?, ?, ?, ?, 'AVAILABLE')",
            [sh.bookId, sh.sellerId, sh.price, sh.condition]
        );
    }
    console.log(`✓ Seeded ${secondHand.length} second-hand listings`);

    // ─── 8. CHALLENGES ──────────────────────────────────────────
    const challenges = [
        { title: 'Around the World in 5 Books', desc: 'Read books from 5 different countries to earn a Global Reader badge. Explore voices from every continent.', count: 5, days: 60, points: 500 },
        { title: 'Sci-Fi September', desc: 'Dive into 3 science fiction novels this month. From space opera to cyberpunk—expand your universe.', count: 3, days: 30, points: 300 },
        { title: 'Classic Literature Marathon', desc: 'Tackle 4 novels published before 1950. Discover why these works have endured for generations.', count: 4, days: 45, points: 400 },
        { title: 'Philosophy Quest', desc: 'Read 3 philosophy or self-help titles. Question everything, including why you took this challenge.', count: 3, days: 30, points: 350 },
        { title: 'Thriller Weekend', desc: 'Speed through 2 thrillers in a single weekend. Perfect for those who love plot twists and sleepless nights.', count: 2, days: 7, points: 200 },
        { title: 'Non-Fiction Deep Dive', desc: 'Expand your mind with 4 non-fiction books. From memoirs to science—truth can be stranger than fiction.', count: 4, days: 45, points: 450 },
    ];

    for (const c of challenges) {
        await connection.query(
            "INSERT INTO challenges (title, description, book_count, duration_days, reward_points) VALUES (?, ?, ?, ?, ?)",
            [c.title, c.desc, c.count, c.days, c.points]
        );
    }

    // Seed user_challenges
    await connection.query("INSERT INTO user_challenges (user_id, challenge_id, books_read) VALUES (2, 1, 3)");
    await connection.query("INSERT INTO user_challenges (user_id, challenge_id, books_read) VALUES (2, 2, 2)");
    await connection.query("INSERT INTO user_challenges (user_id, challenge_id, books_read, completed_at) VALUES (3, 3, 4, NOW())");
    await connection.query("INSERT INTO user_challenges (user_id, challenge_id, books_read) VALUES (5, 1, 1)");
    console.log('✓ Seeded challenges + user progress');

    // ─── 9. BUNDLES ─────────────────────────────────────────────
    const bundles = [
        { title: 'The Dystopian Essentials', desc: 'Three novels that defined the genre. From Orwell to Atwood, explore societies where control is everything.', discount: 15, bookIds: [2, 18, 6] },
        { title: 'World Literature Starter Pack', desc: 'Five acclaimed novels from five continents. The perfect introduction to global storytelling.', discount: 20, bookIds: [5, 9, 15, 19, 10] },
        { title: 'Career & Mind Mastery', desc: 'Level up your thinking and habits with these bestselling non-fiction guides.', discount: 12, bookIds: [8, 11, 25, 28] },
        { title: 'Epic Fantasy Collection', desc: 'Lose yourself in richly imagined worlds of magic, myth, and adventure.', discount: 18, bookIds: [6, 29, 30] },
    ];

    for (const bundle of bundles) {
        const [bundleResult] = await connection.query(
            "INSERT INTO bundles (title, description, discount_percent) VALUES (?, ?, ?)",
            [bundle.title, bundle.desc, bundle.discount]
        );
        for (const bookId of bundle.bookIds) {
            await connection.query(
                "INSERT INTO bundle_books (bundle_id, book_id) VALUES (?, ?)",
                [bundleResult.insertId, bookId]
            );
        }
    }
    console.log(`✓ Seeded ${bundles.length} bundles`);

    // ─── 10. COURSES ────────────────────────────────────────────
    const courses = [
        { bookId: 8, title: 'The Cognitive Revolution Explained', video: 'https://www.youtube.com/embed/nQqiWLbVEIo', desc: 'A companion lecture exploring the key concepts of the Cognitive Revolution discussed in Sapiens.' },
        { bookId: 8, title: 'Agricultural Revolution: Blessing or Curse?', video: 'https://www.youtube.com/embed/Yocja_N5s1I', desc: 'Dive deeper into Harari\'s controversial argument that farming made humanity worse off.' },
        { bookId: 11, title: 'Building Habits That Stick', video: 'https://www.youtube.com/embed/mNeXuCYiE0U', desc: 'A practical workshop based on the four laws of behavior change from Atomic Habits.' },
        { bookId: 6, title: 'The Ecology of Arrakis', video: 'https://www.youtube.com/embed/AvErbQAyuF0', desc: 'An exploration of the desert ecology and worldbuilding that makes Dune a masterpiece of speculative fiction.' },
        { bookId: 25, title: 'Cognitive Biases in Everyday Life', video: 'https://www.youtube.com/embed/UBVV8pch1dM', desc: 'A companion course exploring the cognitive biases Kahneman describes in Thinking, Fast and Slow.' },
    ];

    for (const c of courses) {
        await connection.query(
            "INSERT INTO courses (book_id, title, video_url, description) VALUES (?, ?, ?, ?)",
            [c.bookId, c.title, c.video, c.desc]
        );
    }
    console.log('✓ Seeded courses');

    // ─── 11. READING ROOMS ──────────────────────────────────────
    const rooms = [
        { bookId: 1, creatorId: 2, code: 'MOCK-001A' },
        { bookId: 6, creatorId: 4, code: 'DUNE-CLUB' },
        { bookId: 9, creatorId: 3, code: 'NORW-WOOD' },
    ];

    for (const room of rooms) {
        const [roomResult] = await connection.query(
            "INSERT INTO read_together_rooms (book_id, created_by, invite_code) VALUES (?, ?, ?)",
            [room.bookId, room.creatorId, room.code]
        );
        await connection.query("INSERT INTO room_members (room_id, user_id) VALUES (?, ?)", [roomResult.insertId, room.creatorId]);
    }

    // Add some messages
    await connection.query("INSERT INTO room_messages (room_id, user_id, message) VALUES (1, 2, 'Just started Chapter 1—Atticus already feels larger than life.')");
    await connection.query("INSERT INTO room_messages (room_id, user_id, message) VALUES (1, 2, 'The way Scout describes her neighbourhood is so vivid. You can almost feel the Alabama heat.')");
    await connection.query("INSERT INTO room_messages (room_id, user_id, message) VALUES (2, 4, 'The world-building in the first 50 pages is insane. I had to re-read the glossary twice.')");
    await connection.query("INSERT INTO room_messages (room_id, user_id, message) VALUES (2, 4, 'Fear is the mind-killer. That litany is going to stick with me.')");
    console.log('✓ Seeded reading rooms + messages');

    // ─── 12. WISHLISTS ──────────────────────────────────────────
    await connection.query("INSERT INTO wishlist (user_id, book_id) VALUES (2, 22), (2, 29), (2, 16)");
    await connection.query("INSERT INTO wishlist (user_id, book_id) VALUES (3, 6), (3, 10)");
    await connection.query("INSERT INTO wishlist (user_id, book_id) VALUES (5, 30), (5, 24), (5, 17)");
    console.log('✓ Seeded wishlists');

    // ─── 13. BOOK JOURNEY (second-hand provenance) ──────────────
    await connection.query("INSERT INTO book_journey (sh_book_id, owner_id, city, note) VALUES (1, 2, 'Bangalore', 'Read this under the monsoon rains. One of the best experiences of my life.')");
    await connection.query("INSERT INTO book_journey (sh_book_id, owner_id, city, note) VALUES (2, 3, 'San Francisco', 'Bought at a vintage bookshop on Haight Street. Smells like old paper and adventure.')");
    await connection.query("INSERT INTO book_journey (sh_book_id, owner_id, city, note) VALUES (3, 4, 'London', 'This copy has seen three countries before reaching me. The margins are full of notes from a stranger.')");
    console.log('✓ Seeded book journey entries');

    // ─── DONE ───────────────────────────────────────────────────
    console.log('\n🎉 Seeding complete! The Bookdrop database is now production-ready.');
    console.log('\n📋 Login credentials:');
    console.log('   Admin:  admin@bookdrop.com / admin123');
    console.log('   User:   arjun@example.com / password123');
    console.log('   User:   sophia@example.com / password123');

    await connection.end();
}

seed().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
