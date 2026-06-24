import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' },
      },
      {
        path: 'tickets',
        name: 'TicketList',
        component: () => import('@/views/TicketListView.vue'),
        meta: { title: '工单管理', icon: 'List' },
      },
      {
        path: 'tickets/:ticketId',
        name: 'TicketDetail',
        component: () => import('@/views/TicketDetailView.vue'),
        meta: { title: '工单详情', hidden: true },
      },
      {
        path: 'agent-runs/:runId',
        name: 'AgentRun',
        component: () => import('@/views/AgentRunView.vue'),
        meta: { title: 'Agent 执行', hidden: true },
      },
      {
        path: 'agent-runs/:runId/execution-tree',
        name: 'ExecutionTree',
        component: () => import('@/views/ExecutionTreeView.vue'),
        meta: { title: '执行树', hidden: true },
      },
      {
        path: 'approvals',
        name: 'Approvals',
        component: () => import('@/views/ApprovalView.vue'),
        meta: { title: '审批中心', icon: 'Stamp' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
