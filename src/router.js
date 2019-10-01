import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      alias: '/index',
      name: 'home',
      component: Home,
      redirect: '/home',
      children: [{
        path: 'home',
        name: 'blog-home',
        component: () => import(/* webpackChunkName: "blog-home" */ './views/blog/Home.vue')
      }, {
        path: 'read',
        name: 'blog-read',
        component: () => import(/* webpackChunkName: "blog-read" */ './views/blog/Read.vue')
      }, {
        path: 'article',
        name: 'blog-article',
        component: () => import(/* webpackChunkName: "blog-article" */ './views/blog/Article.vue')
      }, {
        path: 'category',
        name: 'blog-category',
        component: () => import(/* webpackChunkName: "blog-category" */ './views/blog/Category.vue')
      }, {
        path: 'file',
        name: 'blog-file',
        component: () => import(/* webpackChunkName: "blog-file" */ './views/blog/File.vue')
      }, {
        path: 'about',
        name: 'blog-about',
        component: () => import(/* webpackChunkName: "blog-about" */ './views/blog/About.vue')
      }, {
        path: 'search',
        name: 'blog-search',
        component: () => import(/* webpackChunkName: "blog-search" */ './views/blog/SearchPage.vue')
      }
      ]
    }, {
      path: '/book',
      name: 'book',
      component: () => import(/* webpackChunkName: "book" */ './views/Book.vue'),
      redirect: '/book/bookshelf',
      children: [{
        path: 'bookshelf',
        name: 'book-bookshelf',
        component: () => import(/* webpackChunkName: "book-bookshelf" */ './views/book/Bookshelf.vue')
      }, {
        path: 'read',
        name: 'book-read',
        component: () => import(/* webpackChunkName: "book-read" */ './views/book/Read.vue')
      }]
    }
  ]
})
