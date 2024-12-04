<script lang="ts" setup>
import { ref } from 'vue';
import { trpc } from '../trpc';

const name = ref<string>('');
const users = ref<string[]>([]);

// const { mutate: createUser } = trpc.createUser.useMutation({
//   onSuccess: () => {
//     alert('User created!');
//   },
// });

// Fetch users
// const { data, isLoading } = trpc.userList.useQuery();
const prova = await trpc.userList.useQuery();
// const t = trpc;

// if (data) {
//   users.value = data.map((user) => user.name);
// }
</script>

<template>
  <div>
    <h1>Create User:</h1>
    <!-- <input v-model="name" placeholder="Enter name" /> -->
    <!-- <button @click="() => createUser({ name })">Create</button> -->

    <h1>Users:</h1>
    <ul>
      <!-- <li v-for="user in users" :key="user">{{ user }}</li> -->
      <li> ciao </li>
    </ul>
    <!-- <p v-if="isLoading">Loading...</p> -->
  </div>
</template>
