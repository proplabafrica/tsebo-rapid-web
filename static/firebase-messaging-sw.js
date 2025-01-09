
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
)
firebase.initializeApp({ "apiKey": "AIzaSyCvdG8ivxCnHCIjyFRMYtwCuxOmbyFceOg", "authDomain": "Tsebo-Rapid-c5b1c.firebaseapp.com", "databaseURL": "https:\u002F\u002FTsebo-Rapid-c5b1c.firebaseio.com", "projectId": "Tsebo-Rapid-c5b1c", "storageBucket": "Tsebo-Rapid-c5b1c.appspot.com", "messagingSenderId": "911700488348", "appId": "1:911700488348:web:a29271024c7b3ec46bfd59", "measurementId": "${config.measurementId}" })

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

// Setup event listeners for actions provided in the config:
self.addEventListener('notificationclick', function (e) {
  const actions = [{ "action": "randomName", "url": "http:\u002F\u002F127.0.0.1:3333\u002Fdashboard\u002Fadmin" }]
  const action = actions.find(x => x.action === e.action)
  const notification = e.notification

  if (!action) return

  if (action.url) {
    clients.openWindow(action.url)
    notification.close()
  }
})
