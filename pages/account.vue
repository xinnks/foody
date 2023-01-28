<script setup>
definePageMeta({
    middleware: 'auth',
    layout: 'dashboard'
})

const user = useSupabaseUser();
const client = useSupabaseClient();

const { user_metadata: customer } = user;

const userData = {...user.value.user_metadata};
const allowEditing = reactive({
    phoneNumber: false,
    address: false
});

const firstName = (text) => user.value.user_metadata.full_name.split(' ')[0];

async function updateAccountInfo(){
    let data = {};
    if(
        !userData.email !== user.value.user_metadata.email
    ) data['email'] = userData.email;
    if(
        !userData.phone !== user.value.user_metadata.phone
    ) data['phone'] = userData.phone;
    if(
        !userData.address !== user.value.user_metadata.address
    ) data['address'] = userData.address;
    const response = await client
        .from('profiles')
        .upsert({id: user.value.id, ...data, full_name: user.value.user_metadata.full_name})
        .select();
}

const { data: orders } = await useAsyncData('orders', async () => client.from('orders').select('*, profiles!inner(*), order_dishes(*, dishes(*))').match({profile_id: user.value.id}), {
    transform: (result) => result.data
})

useHead({
  title: 'Account',
  meta: [
    { name: 'description', content: 'User account dashboard.' }
  ]
})
</script>

<template>
    <div class="flex flex-col px-4 space-y-4">
        <div class="flex justify-end space-y-2 px-2">
            <h1
                class="flex text-primary text-2xl font-semibold py-2"
            >
                {{ userData.full_name }}.
            </h1>
        </div>
        <hr>
        <div class="flex flex-col space-y-2 px-2">
            <h2
                class="flex text-primary text-xl font-semibold py-1"
            >Account Information</h2>
            <ul class="px-2">
                <li class="p-1">
                    {{ userData.email }}
                </li>
                <li class="p-1">
                    <span v-if="user.user_metadata.phone && !allowEditing.phone">
                        {{ userData.phone }}
                        <button
                            @click="allowEditing.phone = true"
                            class="hover:underline text-primary-500 cursor-pointer"
                        >Edit</button>
                    </span>
                    <span v-else>
                        <input
                            v-model="userData.phone"
                            placeholder="Phone Number"
                            class="outline outline-secondary-400 active:outline-secondary-500 px-1"
                            type="text"
                        >
                    </span>
                </li>
                <li class="p-1">
                    <span v-if="user.user_metadata.address && !allowEditing.address">
                        {{ userData.address }}
                        <button
                            @click="allowEditing.address = true"
                            class="hover:underline text-primary-500 cursor-pointer"
                        >Edit</button> {{ allowEditing.address + ' : ' + user.user_metadata.address }}
                    </span>
                    <span v-else>
                        <input
                            v-model="userData.address"
                            placeholder="Address"
                            class="outline outline-secondary-400 active:outline-secondary-500 px-1"
                            type="text"
                        >
                    </span>
                </li>
                <li class="p-2">
                    <button @click="updateAccountInfo()" class="px-3 py-1 rounded bg-primary-400 hover:bg-primary-500 text-white">Update</button>
                </li>
            </ul>
        </div>
        <hr>
        <div class="flex flex-col px-2 pb-8">

            <h1
                class="flex text-primary text-xl font-semibold py-2"
            >
                My Orders
            </h1>

            <div
                v-if="!orders"
                class="p-2 text-gray-700"
            >
                No Orders
            </div>

            <div
                v-else
                class="flex flex-col space-y-2 px-2 pb-8"
            >
                <OrderCard
                    v-for="(order, key) of orders"
                    :key="key"
                    :order="order"
                ></OrderCard>
            </div>
        </div>
    </div>
</template>