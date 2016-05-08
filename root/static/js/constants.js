angular.module('starter', ['ngRoute'])

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})

.constant('API_ENDPOINT', {
  url: 'http://127.0.0.1:3002/api'
});
