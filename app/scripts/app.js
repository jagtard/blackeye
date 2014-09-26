'use strict';

/**
 * @ngdoc overview
 * @name ngNewsApp
 * @description
 * # ngNewsApp
 *
 * Main module of the application.
 */
 /* global app:ture */

 var app = angular
  .module('ngNewsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ]);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/posts/:postId', {
        templateUrl: 'views/showpost.html',
        controller: 'PostViewCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  app.constant('FIREBASE_URL', 'https://luminous-torch-9677.firebaseio.com/');

  app.factory('Post',
    function($firebase, FIREBASE_URL) {
      var ref = new Firebase(FIREBASE_URL + 'posts');

      var posts = $firebase(ref).$asArray();

      var Post = {
        all: posts,
        create: function (post) {
          return posts.$add(post);
        },
        find: function (postId) {
          return $firebase(ref.child(postId)).$asObject();
        },
        delete: function (post) {
          return posts.$remove(post);
        }
      };

      return Post;

    });

app.factory('Auth',
  function ($firebaseSimpleLogin, FIREBASE_URL, $rootScope) {
    var ref = new Firebase(FIREBASE_URL);

    var auth = $firebaseSimpleLogin(ref);

    var Auth = {
      register: function (user) {
        return auth.$createUser(user.email, user.password);
      },
      signedIn: function () {
        return auth.user !== null;
      },
      login: function (user) {
        return auth.$login('password', user);
      },
      logout: function () {
        auth.$logout();
      }
    };

    $rootScope.signedIn = function () {
      return Auth.signedIn();
    };

    return Auth;
  });
  