import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import JsonViewer from '../JsonViewer.vue'

describe('JsonViewer', () => {
  it('renders object as formatted JSON', () => {
    const wrapper = mount(JsonViewer, { props: { data: { a: 1 } } })
    expect(wrapper.find('pre').exists()).toBe(true)
    expect(wrapper.text()).toContain('"a"')
  })

  it('renders string data as parsed JSON', () => {
    const wrapper = mount(JsonViewer, { props: { data: '{"key":"value"}' } })
    expect(wrapper.text()).toContain('"key"')
    expect(wrapper.text()).toContain('"value"')
  })

  it('renders empty text for null data', () => {
    const wrapper = mount(JsonViewer, { props: { data: null, emptyText: 'no-data' } })
    // Null data shows emptyText instead of pre block
    expect(wrapper.find('pre').exists()).toBe(false)
  })

  it('handles plain string gracefully', () => {
    const wrapper = mount(JsonViewer, { props: { data: 'hello' } })
    expect(wrapper.text()).toContain('hello')
  })

  it('does not render HTML via v-html', () => {
    const wrapper = mount(JsonViewer, { props: { data: '<script>alert(1)</script>' } })
    expect(wrapper.html()).not.toContain('<script>')
  })
})
