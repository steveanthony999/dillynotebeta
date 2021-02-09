const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

// Fetch categories from database
exports.getCategories = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection('categories')
    .get()
    .then((data) => {
      let categories = [];
      data.forEach((doc) => {
        categories.push(doc.data());
      });
      return res.json(categories);
    })
    .catch((err) => console.error(err));
});

// Create category
exports.createCategory = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not allowed' });
  }

  const newCategory = {
    title: req.body.title,
    username: req.body.username,
    userId: req.body.userId,
    parentId: null,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    list: [],
    path: [],
  };

  admin
    .firestore()
    .collection('categories')
    .add(newCategory)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
});
