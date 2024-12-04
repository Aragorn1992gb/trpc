<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { trpc } from '../trpc';

const notificationMessage = ref('');
const notifications = ref<{ id: number; message: string; timestamp: string }[]>([]);

const sendNotification = async () => {
  try {
    const result = await trpc.sendNotification.mutate({ message: notificationMessage.value });
    if (result.success) {
      alert('Notification sent!');
      notificationMessage.value = ''; // Clear the input
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

const fetchNotifications = async () => {
      try {
        const data = await trpc.getNotifications.query();
        notifications.value = data; // Store the notifications in the frontend state
        console.log("data", notifications.value);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

const subscribeToNotifications = () => {
    trpc.notifications.subscribe(undefined, {
    onData(newNotification) {
      notifications.value.push(newNotification); // Add new notification to the list
    },
    onError(err) {
      console.error('Subscription error:', err);
    },
  });
};

// Fetch notifications on page load
onMounted(() => {
  fetchNotifications(); // Fetch existing notifications
  subscribeToNotifications(); // Start the real-time subscription
});
    
</script>

<template>
  <div>
    <h1>Send Notification</h1>
    <input v-model="notificationMessage" placeholder="Enter your message" />
    <button @click="sendNotification">Send</button>
    <h2>Notification List</h2>
    <ul>
      <li v-for="notification in notifications" :key="notification.id">
        {{ notification.message }} - {{ notification.timestamp }}
      </li>
    </ul>
    
  </div>
</template>

