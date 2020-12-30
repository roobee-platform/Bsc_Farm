import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/index'
import Farming from '../pages/farming'
import FarmingPancake from '../pages/farming-pancake'
import About from '../pages/about'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'index',
    component: Home,
    meta: {
      title: 'RoobeeFinance',
      metaTags: [{
          name: 'description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        },
        {
          property: 'og:description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        }
      ]
    }
  },
  {
    path: '/farming',
    redirect: '/'
  },
  {
    path: '/farming_pancake',
    name: 'farming pancake',
    component: FarmingPancake,
    meta: {
      title: 'RoobeeFinance',
      metaTags: [{
          name: 'description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        },
        {
          property: 'og:description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        }
      ]
    }
  },
  {
    path: '/farming_bnb',
    name: 'farming bnb',
    component: Farming,
    meta: {
      title: 'RoobeeFinance',
      metaTags: [{
          name: 'description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        },
        {
          property: 'og:description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        }
      ]
    }
  },
  {
    path: '/farming_burger',
    name: 'farming burger',
    component: Farming,
    meta: {
      title: 'RoobeeFinance',
      metaTags: [{
          name: 'description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        },
        {
          property: 'og:description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        }
      ]
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'RoobeeFinance',
      metaTags: [{
          name: 'description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        },
        {
          property: 'og:description',
          content: 'The idea is simple, we give Roobee to liquidity providers of Roobee/ETH pool'
        }
      ]
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  // const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
      const tag = document.createElement('meta');

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute('data-vue-router-controlled', '');

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router
