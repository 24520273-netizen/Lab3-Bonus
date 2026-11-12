import { StrictMode, act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import SituationshipAnalyzer from '../src/components/SituationshipAnalyzer.jsx'

let nextId

beforeEach(() => {
  nextId = 0
  vi.stubGlobal('crypto', {
    randomUUID: () => `test-message-${++nextId}`,
  })
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function startDating() {
  fireEvent.click(screen.getByRole('button', {
    name: 'Bắt đầu hẹn hò',
  }))
}

function sendMessage() {
  fireEvent.click(screen.getByRole('button', {
    name: 'Gửi tin nhắn',
  }))
}

describe('SituationshipAnalyzer integration', () => {
  it('renders accessible initial state', () => {
    render(<SituationshipAnalyzer />)

    expect(screen.getByRole('article')).toBeTruthy()
    expect(screen.getByText('Bạn bè')).toBeTruthy()
    expect(screen.getByRole('spinbutton', {
      name: 'Số lần tương tác',
    })).toBeTruthy()
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)

    expect(screen.getByRole('button', {
      name: 'Gửi tin nhắn',
    }).disabled).toBe(true)
  })

  it('shows derived Red Flag status correctly', () => {
    render(<SituationshipAnalyzer />)
    startDating()

    expect(screen.getByText(
      'Stable: Điểm EM đang bằng hoặc cao hơn AI ĐÓ.',
    )).toBeTruthy()

    const input = screen.getByRole('spinbutton', {
      name: 'Số lần tương tác',
    })

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', {
      name: 'EM cố gắng',
    }))

    fireEvent.change(input, { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', {
      name: 'AI ĐÓ cố gắng',
    }))

    expect(screen.getByText(
      'Red Flag: Điểm AI ĐÓ đang cao hơn điểm EM.',
    )).toBeTruthy()

    expect(screen.getByLabelText('EM: 10 điểm')).toBeTruthy()
    expect(screen.getByLabelText('AI ĐÓ: 50 điểm')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', {
      name: 'Xác nhận yêu',
    }))

    expect(screen.getByText(
      /Chưa đánh giá: Chỉ kiểm tra Red Flag/,
    )).toBeTruthy()
  })

  it('ghosts after exactly 5000 milliseconds', () => {
    render(<SituationshipAnalyzer />)
    startDating()
    sendMessage()

    act(() => {
      vi.advanceTimersByTime(4999)
    })

    expect(screen.getByText('Hẹn hò nhưng không yêu')).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(screen.getByText('Đã kết thúc mối quan hệ')).toBeTruthy()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cancels timeout when a reply arrives', () => {
    render(<SituationshipAnalyzer />)
    startDating()
    sendMessage()

    fireEvent.click(screen.getByRole('button', {
      name: 'Đã trả lời',
    }))

    expect(vi.getTimerCount()).toBe(0)

    act(() => {
      vi.advanceTimersByTime(6000)
    })

    expect(screen.getByText('Hẹn hò nhưng không yêu')).toBeTruthy()
  })

  it('cancels timeout after phase transition', () => {
    render(<SituationshipAnalyzer />)
    startDating()
    sendMessage()

    fireEvent.click(screen.getByRole('button', {
      name: 'Xác nhận yêu',
    }))

    expect(vi.getTimerCount()).toBe(0)

    act(() => {
      vi.advanceTimersByTime(6000)
    })

    expect(screen.getByText('Mối quan hệ chính thức')).toBeTruthy()
  })

  it('cancels timeout after explicit exit', () => {
    render(<SituationshipAnalyzer />)
    startDating()
    sendMessage()

    fireEvent.click(screen.getByRole('button', {
      name: 'Kết thúc quan hệ',
    }))

    expect(vi.getTimerCount()).toBe(0)
    expect(screen.getByText('Đã kết thúc mối quan hệ')).toBeTruthy()
  })

  it('cleans up timer when component unmounts', () => {
    const view = render(<SituationshipAnalyzer />)
    startDating()
    sendMessage()

    expect(vi.getTimerCount()).toBe(1)

    view.unmount()

    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not create duplicate pending timers', () => {
    render(
      <StrictMode>
        <SituationshipAnalyzer />
      </StrictMode>,
    )

    startDating()
    sendMessage()

    expect(vi.getTimerCount()).toBe(1)

    expect(screen.getByRole('button', {
      name: 'Gửi tin nhắn',
    }).disabled).toBe(true)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByText('Đã kết thúc mối quan hệ')).toBeTruthy()
    expect(vi.getTimerCount()).toBe(0)
  })
})
