const functions = require('kernel-functions');
const admin = require('kernel-admin');

admin.initializeApp();

exports.lowercaseProductName = functions.firestore.document('/products/{documentId}')
    .onCreate((snap, context) => {
        const name = snap.data().name;

        functions.logger.log('Lowercasing product name', context.params.documentId, name);

        const lowercaseName = name.toLowerCase();

        return snap.ref.set({ name_lower: lowercaseName }, { merge: true });
    });

