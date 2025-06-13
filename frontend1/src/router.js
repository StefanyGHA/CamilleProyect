import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/LoginForm.vue'),
        meta: { public: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/components/RegisterForm.vue'),
        meta: { public: true }
    },
     {
        path: '/logout',
        name: 'logout',
        beforeEnter: async (to, from, next) => {
        const authStore = useAuthStore()
        await authStore.logout()
        next('/login')
        }
    },
    {
        path: '/perfil',
        name: 'perfil',
        component: () => import('@/components/ProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pago/tarejta',
        name: 'pago',
        component: () => import('@/components/CardPayment.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/components/navbar.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/carrito',
        name: 'Cart',
        component: () => import('@/components/CartView.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    if(to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next('/login')
    }
    
    
    if(to.meta.public && authStore.isAuthenticated) {
        return next('/dashboard')
    }
    
    next()
})

export default router