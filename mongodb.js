const { MongoClient } = require('mongodb');

// Setup for MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function createBooksCollection() {
    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db('library');
        const books = db.collection('books');

        // Insert sample book data if the collection is empty
        const existingBooks = await books.countDocuments();
        if (existingBooks === 0) {
            await books.insertMany([
                { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', year: 1937 },
                { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', year: 1960 },
                { title: '1984', author: 'George Orwell', genre: 'Dystopian', year: 1949 },
            ]);
            console.log('Sample books inserted');
        } else {
            console.log('Books already exist in the collection');
        }
    } catch (err) {
        console.error('Error while creating collection or inserting data:', err);
    }
}

// Retrieve all books by searched author
async function findBooksByAuthor(author) {
    try {
        const db = client.db('library');
        const books = db.collection('books');
        const result = await books.find({ author }).toArray();
        console.log(`Books by ${author}:`, result);
    } catch (err) {
        console.error('Error finding books by author:', err);
    }
}

// Find a book and update the genre
async function updateBookGenre(title, newGenre) {
    try {
        const db = client.db('library');
        const books = db.collection('books');
        const result = await books.updateOne({ title }, { $set: { genre: newGenre } });
        
        if (result.modifiedCount > 0) {
            console.log(`Genre of "${title}" updated to "${newGenre}"`);
        } else {
            console.log(`No book found with title "${title}"`);
        }
    } catch (err) {
        console.error('Error updating book genre:', err);
    }
}

// Delete a book by searching the title
async function deleteBook(title) {
    try {
        const db = client.db('library');
        const books = db.collection('books');
        const result = await books.deleteOne({ title });

        if (result.deletedCount > 0) {
            console.log(`Book "${title}" deleted`);
        } else {
            console.log(`No book found with title "${title}"`);
        }
    } catch (err) {
        console.error('Error deleting book:', err);
    }
}

// Using the functions as a test
(async function() {
    try {
        // Make sure the sample books are in the collection first
        await createBooksCollection(); 

        // Example operations for the write queries:
        await findBooksByAuthor('J.R.R. Tolkien'); // Find all the books by J.R.R. Tolkien
        await updateBookGenre('1984', 'Science Fiction'); // Update the genre of "1984"
        await deleteBook('The Hobbit'); // Delete "The Hobbit"
        
    } catch (err) {
        console.error('Error in execution:', err);
    } finally {
        // Close the MongoDB connection after it's done working
        await client.close();
    }
})();


