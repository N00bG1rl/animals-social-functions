const functions = require("firebase-functions")
const app = require('express')()
const FBAuth = require('./util/fbAuth')
const { db } = require('./util/admin')

const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream } = require('./handlers/screams')
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require('./handlers/users')
const fbAuth = require("./util/fbAuth")

/* SCREAM ROUTES */

// Get all screams
app.get('/screams', getAllScreams)

// Post one scream
app.post('/scream', FBAuth, postOneScream)

// Get one scream
app.get('/scream/:screamId', getScream)

// Delete scream
app.delete('/scream/:screamId', FBAuth, deleteScream)

// Like a scream
app.get('/scream/:screamId/like', FBAuth, likeScream)

// Unlike a scream 
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream)

// Comment on scream
app.post('/scream/:screamId/comment', FBAuth, commentOnScream)

/* USER ROUTES */
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)
app.get('/user/:handle', fbAuth, getUserDetails)
app.post('/notifications', fbAuth, markNotificationsRead)

/* Change default database route */
exports.api = functions.region('europe-west1').https.onRequest(app)

/* Create like notification */
exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}')
  .onCreate(snapshot => {
    return db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          })
        }
      })
      .catch(err => console.error(err))
  })

/* Undo like-notification */
exports.deleteNotificationOnUnlike = functions.region('europe-west1').firestore.document('likes/{id}')
  .onDelete(snapshot => {
    return db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err)
        return
      })
  })

/* Create comment notification */
exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comments/{id}')
  .onCreate(snapshot => {
    return db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          })
        }
      })
      .catch(err => {
        console.error(err)
        return
      })
  })

/* Change user image */
exports.onUserImageChange = functions.region('europe-west1').firestore.document('/users/{userId}')
  .onUpdate(change => {
    console.log(change.before.data())
    console.log(change.after.data())
    if(change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('Image has change')
      let batch = db.batch()
      return db.collection('screams').where('userHandle', '==', change.before.data().handle).get()
        .then(data => {
          data.forEach(doc => {
            const scream = db.doc(`/screams/${doc.id}`)
            batch.update(scream, { userImage: change.after.data().imageUrl })
          })
          return batch.commit()
        })
    } else return true
  })

/* Remove comments, likes and notifications when post is deleted */
exports.onScreamDelete = functions.region('europe-west1').firestore.document('/screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId
    const batch = db.batch()
    return db.collection('comments').where('screamId', '==', screamId).get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`))
        })
        return db.collection('likes').where('screamId', '==', screamId).get()
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`))
        })
        return db.collection('notifications').where('screamId', '==', screamId).get()
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`))
        })
        return batch.commit()
      })
      .catch(err => console.error(err))
  })

