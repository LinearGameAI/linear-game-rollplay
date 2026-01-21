/**
 * WebSocket 连接状态
 */
export enum WebSocketStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR',
}

/**
 * WebSocket 配置选项
 */
export interface WebSocketOptions {
  /** WebSocket URL */
  url: string
  /** 心跳间隔（毫秒），默认 30000ms */
  heartbeatInterval?: number
  /** 心跳超时时间（毫秒），默认 5000ms */
  heartbeatTimeout?: number
  /** 自动重连，默认 true */
  autoReconnect?: boolean
  /** 重连间隔（毫秒），默认 3000ms */
  reconnectInterval?: number
  /** 最大重连次数，默认 5 */
  maxReconnectAttempts?: number
  /** 连接超时时间（毫秒），默认 10000ms */
  connectionTimeout?: number
  /** 自定义协议 */
  protocols?: string | string[]
}

/**
 * WebSocket 事件回调
 */
export interface WebSocketCallbacks<T = unknown> {
  /** 连接打开回调 */
  onOpen?: (event: Event) => void
  /** 收到消息回调 */
  onMessage?: (data: T) => void
  /** 连接关闭回调 */
  onClose?: (event: CloseEvent) => void
  /** 错误回调 */
  onError?: (event: Event) => void
  /** 状态变化回调 */
  onStatusChange?: (status: WebSocketStatus) => void
  /** 重连回调 */
  onReconnect?: (attempt: number) => void
}

/**
 * WebSocket 工具类
 * 提供自动重连、心跳检测、消息队列等功能
 */
export class WebSocketClient<SendType = unknown, ReceiveType = unknown> {
  private ws: WebSocket | null = null
  private options: Required<Omit<WebSocketOptions, 'protocols'>> & Pick<WebSocketOptions, 'protocols'>
  private callbacks: WebSocketCallbacks<ReceiveType> = {}
  private status: WebSocketStatus = WebSocketStatus.DISCONNECTED
  private reconnectAttempts = 0
  private heartbeatTimer: NodeJS.Timeout | null = null
  private heartbeatTimeoutTimer: NodeJS.Timeout | null = null
  private connectionTimer: NodeJS.Timeout | null = null
  private messageQueue: SendType[] = []
  private isManualClose = false

  constructor(options: WebSocketOptions, callbacks?: WebSocketCallbacks<ReceiveType>) {
    this.options = {
      url: options.url,
      heartbeatInterval: options.heartbeatInterval ?? 30000,
      heartbeatTimeout: options.heartbeatTimeout ?? 5000,
      autoReconnect: options.autoReconnect ?? true,
      reconnectInterval: options.reconnectInterval ?? 3000,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 5,
      connectionTimeout: options.connectionTimeout ?? 10000,
      protocols: options.protocols,
    }
    this.callbacks = callbacks || {}
  }

  /**
   * 连接 WebSocket
   */
  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already connected')
      return
    }

    this.isManualClose = false
    this.setStatus(WebSocketStatus.CONNECTING)

    try {
      this.ws = new WebSocket(this.options.url, this.options.protocols)
      this.setupEventListeners()
      this.startConnectionTimeout()
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      this.setStatus(WebSocketStatus.ERROR)
      this.handleReconnect()
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.isManualClose = true
    this.clearTimers()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.setStatus(WebSocketStatus.DISCONNECTED)
    this.messageQueue = []
  }

  /**
   * 发送消息
   */
  send(data: SendType): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data)
        this.ws.send(message)
      } catch (error) {
        console.error('Failed to send message:', error)
        this.messageQueue.push(data)
      }
    } else {
      console.warn('WebSocket is not connected, message queued')
      this.messageQueue.push(data)
    }
  }

  /**
   * 获取当前状态
   */
  getStatus(): WebSocketStatus {
    return this.status
  }

  /**
   * 更新配置
   */
  updateOptions(options: Partial<WebSocketOptions>): void {
    this.options = { ...this.options, ...options }
  }

  /**
   * 更新回调
   */
  updateCallbacks(callbacks: Partial<WebSocketCallbacks<ReceiveType>>): void {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    if (!this.ws) return

    this.ws.onopen = (event) => {
      this.clearConnectionTimeout()
      this.setStatus(WebSocketStatus.CONNECTED)
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.flushMessageQueue()
      this.callbacks.onOpen?.(event)
    }

    this.ws.onmessage = (event) => {
      this.resetHeartbeat()
      try {
        const data = JSON.parse(event.data) as ReceiveType
        this.callbacks.onMessage?.(data)
      } catch (error) {
        // 如果不是 JSON，直接传递原始数据
        this.callbacks.onMessage?.(event.data as ReceiveType)
      }
    }

    this.ws.onclose = (event) => {
      this.clearTimers()
      this.setStatus(WebSocketStatus.DISCONNECTED)
      this.callbacks.onClose?.(event)

      if (!this.isManualClose && this.options.autoReconnect) {
        this.handleReconnect()
      }
    }

    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event)
      this.setStatus(WebSocketStatus.ERROR)
      this.callbacks.onError?.(event)
    }
  }

  /**
   * 处理重连
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached')
      this.setStatus(WebSocketStatus.DISCONNECTED)
      return
    }

    this.reconnectAttempts++
    this.setStatus(WebSocketStatus.RECONNECTING)
    this.callbacks.onReconnect?.(this.reconnectAttempts)

    setTimeout(() => {
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.options.maxReconnectAttempts}`)
      this.connect()
    }, this.options.reconnectInterval)
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.clearHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat()
    }, this.options.heartbeatInterval)
  }

  /**
   * 发送心跳
   */
  private sendHeartbeat(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }))
      this.startHeartbeatTimeout()
    }
  }

  /**
   * 启动心跳超时计时器
   */
  private startHeartbeatTimeout(): void {
    this.clearHeartbeatTimeout()
    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.warn('Heartbeat timeout, reconnecting...')
      this.ws?.close()
    }, this.options.heartbeatTimeout)
  }

  /**
   * 重置心跳
   */
  private resetHeartbeat(): void {
    this.clearHeartbeatTimeout()
  }

  /**
   * 清除心跳
   */
  private clearHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    this.clearHeartbeatTimeout()
  }

  /**
   * 清除心跳超时计时器
   */
  private clearHeartbeatTimeout(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  /**
   * 启动连接超时计时器
   */
  private startConnectionTimeout(): void {
    this.clearConnectionTimeout()
    this.connectionTimer = setTimeout(() => {
      if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
        console.error('Connection timeout')
        this.ws.close()
        this.handleReconnect()
      }
    }, this.options.connectionTimeout)
  }

  /**
   * 清除连接超时计时器
   */
  private clearConnectionTimeout(): void {
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer)
      this.connectionTimer = null
    }
  }

  /**
   * 清除所有计时器
   */
  private clearTimers(): void {
    this.clearHeartbeat()
    this.clearConnectionTimeout()
  }

  /**
   * 刷新消息队列
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message) {
        this.send(message)
      }
    }
  }

  /**
   * 设置状态
   */
  private setStatus(status: WebSocketStatus): void {
    if (this.status !== status) {
      this.status = status
      this.callbacks.onStatusChange?.(status)
    }
  }
}

/**
 * 创建 WebSocket 实例的便捷函数
 * 
 * @see {@link file:///Users/chen/working/lineargame/LGRollPlay/frontend/src/common/websocket.examples.md} 查看使用示例
 */
export function createWebSocket<SendType = unknown, ReceiveType = unknown>(
  options: WebSocketOptions,
  callbacks?: WebSocketCallbacks<ReceiveType>
): WebSocketClient<SendType, ReceiveType> {
  return new WebSocketClient<SendType, ReceiveType>(options, callbacks)
}
