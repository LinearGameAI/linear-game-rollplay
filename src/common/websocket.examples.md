# WebSocket 工具使用示例

本文档提供了 `websocket.ts` 工具类的详细使用示例。

## 示例 1: 基本用法

最简单的使用方式，适合快速上手。

```typescript
import { createWebSocket, WebSocketStatus } from '@/src/common/websocket'

// 定义消息类型
interface ChatMessage {
  type: 'chat' | 'system'
  content: string
  timestamp: number
}

// 创建 WebSocket 客户端
const ws = createWebSocket<ChatMessage, ChatMessage>(
  {
    url: 'ws://localhost:8080/chat',
    heartbeatInterval: 30000,
    autoReconnect: true,
    maxReconnectAttempts: 5,
  },
  {
    onOpen: () => {
      console.log('WebSocket 已连接')
    },
    onMessage: (data) => {
      console.log('收到消息:', data)
    },
    onClose: (event) => {
      console.log('WebSocket 已断开:', event.reason)
    },
    onError: (event) => {
      console.error('WebSocket 错误:', event)
    },
    onStatusChange: (status) => {
      console.log('状态变化:', status)
    },
    onReconnect: (attempt) => {
      console.log(`正在重连 (第 ${attempt} 次)...`)
    },
  }
)

// 连接
ws.connect()

// 发送消息
ws.send({
  type: 'chat',
  content: 'Hello, World!',
  timestamp: Date.now(),
})

// 断开连接
ws.disconnect()
```

## 示例 2: React Hook 集成

将 WebSocket 封装为 React Hook，便于在组件中使用。

```typescript
import { useEffect, useRef, useState } from 'react'
import { createWebSocket, WebSocketStatus } from '@/src/common/websocket'

interface Message {
  id: string
  text: string
}

function useWebSocketChat(url: string) {
  const wsRef = useRef<ReturnType<typeof createWebSocket<Message, Message>> | null>(null)
  const [status, setStatus] = useState<WebSocketStatus>(WebSocketStatus.DISCONNECTED)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const ws = createWebSocket<Message, Message>(
      { url },
      {
        onMessage: (data) => {
          setMessages((prev) => [...prev, data])
        },
        onStatusChange: (newStatus) => {
          setStatus(newStatus)
        },
      }
    )

    ws.connect()
    wsRef.current = ws

    return () => {
      ws.disconnect()
    }
  }, [url])

  const sendMessage = (message: Message) => {
    wsRef.current?.send(message)
  }

  return { messages, status, sendMessage }
}

// 在组件中使用
function ChatComponent() {
  const { messages, status, sendMessage } = useWebSocketChat('ws://localhost:8080')

  return (
    <div>
      <div>状态: {status}</div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.text}</div>
      ))}
      <button onClick={() => sendMessage({ id: '1', text: 'Hello' })}>
        发送消息
      </button>
    </div>
  )
}
```

## 示例 3: 实时数据推送服务

使用 WebSocket 实现订阅/取消订阅模式的实时数据服务。

```typescript
import { createWebSocket } from '@/src/common/websocket'

interface StockUpdate {
  symbol: string
  price: number
  change: number
}

interface SubscribeRequest {
  action: 'subscribe' | 'unsubscribe'
  symbols: string[]
}

class StockPriceService {
  private ws: ReturnType<typeof createWebSocket<SubscribeRequest, StockUpdate>>
  private subscribers = new Map<string, (data: StockUpdate) => void>()

  constructor() {
    this.ws = createWebSocket<SubscribeRequest, StockUpdate>(
      {
        url: 'ws://api.example.com/stock-prices',
        heartbeatInterval: 15000,
        autoReconnect: true,
      },
      {
        onMessage: (data) => {
          const callback = this.subscribers.get(data.symbol)
          callback?.(data)
        },
        onOpen: () => {
          // 重连后重新订阅
          if (this.subscribers.size > 0) {
            this.ws.send({
              action: 'subscribe',
              symbols: Array.from(this.subscribers.keys()),
            })
          }
        },
      }
    )
    this.ws.connect()
  }

  subscribe(symbol: string, callback: (data: StockUpdate) => void) {
    this.subscribers.set(symbol, callback)
    this.ws.send({
      action: 'subscribe',
      symbols: [symbol],
    })
  }

  unsubscribe(symbol: string) {
    this.subscribers.delete(symbol)
    this.ws.send({
      action: 'unsubscribe',
      symbols: [symbol],
    })
  }

  destroy() {
    this.ws.disconnect()
    this.subscribers.clear()
  }
}

// 使用
const stockService = new StockPriceService()
stockService.subscribe('AAPL', (data) => {
  console.log(`Apple 股价更新: $${data.price} (${data.change > 0 ? '+' : ''}${data.change}%)`)
})
```

## 示例 4: 动态配置和状态管理

运行时动态调整配置和检查连接状态。

```typescript
import { createWebSocket, WebSocketStatus } from '@/src/common/websocket'

const ws = createWebSocket({
  url: 'ws://localhost:8080',
  autoReconnect: true,
})

// 连接前更新配置
ws.updateOptions({
  heartbeatInterval: 60000,
  maxReconnectAttempts: 10,
})

// 动态更新回调
ws.updateCallbacks({
  onMessage: (data) => {
    console.log('新消息:', data)
  },
})

// 检查连接状态
if (ws.getStatus() === WebSocketStatus.CONNECTED) {
  ws.send({ type: 'ping' })
}
```

## 配置选项说明

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | `string` | - | WebSocket 服务器地址（必填） |
| `heartbeatInterval` | `number` | `30000` | 心跳间隔（毫秒） |
| `heartbeatTimeout` | `number` | `5000` | 心跳超时时间（毫秒） |
| `autoReconnect` | `boolean` | `true` | 是否自动重连 |
| `reconnectInterval` | `number` | `3000` | 重连间隔（毫秒） |
| `maxReconnectAttempts` | `number` | `5` | 最大重连次数 |
| `connectionTimeout` | `number` | `10000` | 连接超时时间（毫秒） |
| `protocols` | `string \| string[]` | - | 自定义协议 |

## 连接状态

- `CONNECTING` - 正在连接
- `CONNECTED` - 已连接
- `DISCONNECTED` - 已断开
- `RECONNECTING` - 正在重连
- `ERROR` - 错误状态

## 最佳实践

1. **类型安全**：始终为发送和接收的消息定义明确的类型
2. **错误处理**：实现 `onError` 回调处理连接错误
3. **资源清理**：在组件卸载时调用 `disconnect()` 方法
4. **重连策略**：根据业务场景调整 `maxReconnectAttempts` 和 `reconnectInterval`
5. **心跳配置**：根据服务器要求调整心跳间隔，避免连接超时
