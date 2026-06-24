import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '../EmptyState.vue'

describe('EmptyState', () => {
  it('mounts successfully', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.exists()).toBe(true)
  })

  it('accepts custom description prop', () => {
    const wrapper = mount(EmptyState, { props: { description: '没有工单' } })
    expect(wrapper.props('description')).toBe('没有工单')
  })

  it('has default description prop', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.props('description')).toBe('暂无数据')
  })
})
