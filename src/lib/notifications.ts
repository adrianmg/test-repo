export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
}

// TODO: implement WebSocket connection
// TODO: implement persistence layer
