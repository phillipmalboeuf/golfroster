const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.newMessage = functions.firestore
  .document('chatrooms/{chatroomId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const message = snapshot.data();
    return admin
      .firestore()
      .collection('chatrooms')
      .doc(context.params.chatroomId)
      .update({
        latest: {
          body: message.body,
          player_id: message.player_id,
          date: message.date,
        },
      });
  });
