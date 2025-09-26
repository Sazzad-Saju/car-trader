<script setup>
import { v4 as uuidv4 } from 'uuid';
definePageMeta({
    layout: "custom",
    // middleware: ["auth"], // Ensure the auth middleware is applied
});
const { makes } = useCars();
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const info = useState('adInfo', () => {
    return {
        make: "",
        model: "",
        year: "",
        miles: "",
        price: "",
        city: "",
        seats: "",
        features: "",
        description: "",
        image: null,
    }
});

const errorMessage = ref("");

const onChangeInput = (data, name) => {
    info.value[name] = data;
}

const inputs = [
    {
        id: 1, 
        title: "Model *",
        name: "model",
        placeholder: "Civic"
    },
    {
        id: 2, 
        title: "Year *",
        name: "year",
        placeholder: "2020"
    },
    {
        id: 3, 
        title: "Price *",
        name: "price",
        placeholder: "1000"
    },
    {
        id: 4, 
        title: "Miles *",
        name: "miles",
        placeholder: "10000"
    },
    {
        id: 5, 
        title: "City *",
        name: "city",
        placeholder: "Los Angeles"
    },
    {
        id: 6, 
        title: "Number of Seats *",
        name: "seats",
        placeholder: "5"
    },
    {
        id: 7,
        title: "Features",
        name: "features",
        placeholder: "Leather seats, Sunroof"
    },
]

const isButtonDisabled = computed(() => {
    for(let key in info.value){
        if(!info.value[key]) return true;
    }
    return false;
});

const handleSubmit =  async () => {
    let filename = uuidv4();
     if (info.value.image) {
        const ext = info.value.image.type.split('/')[1];
        filename = `${filename}.${ext}`;
    }
    const {data,error} = await supabase.storage.from('images').upload("public/" + filename, info.value.image);
    
    if(error){
        return errorMessage.value = error.message;
    }
    
    const body = { 
        ...info.value, 
        city: info.value.city.toLowerCase(),
        features: info.value.features.split(', '),
        numberOfSeats: parseInt(info.value.seats),
        miles: parseInt(info.value.miles),
        price: parseInt(info.value.price),
        year: parseInt(info.value.year),
        name: `${info.value.make} ${info.value.model}`,
        listerId: user.value.id,
        image: data.path,
    };
    
    delete body.seats;
    
    try{
        const response = await $fetch("/api/car/listings", {
            method: "POST",
            body
        })
        navigateTo("/profile/listings");
    }catch(err){
        errorMessage.value = err.statusMessage
        supabase.storage.from('images').remove([data.path]);
    }
}
</script>

<template>
    <div>
        <div class="mt-24">
            <h1 class="text-6xl">Create a New Listing</h1>
        </div>
        <div class="shadow rounded p-3 mt-5 flex flex-wrap justify-between">
            <CarAdSelect title="Make *" :options="makes" name="make" @change-input="onChangeInput" />
            <CarAdInput v-for="input in inputs" :key="input.id" :title="input.title" :name="input.name" :placeholder="input.placeholder" @change-input="onChangeInput" />
            <CarAdTextArea title="Description *" name="description" placeholder="" @change-input="onChangeInput" />
            <CarAdImage @change-input="onChangeInput"/>
            <div>
                <button :disabled="isButtonDisabled" @click="handleSubmit" class="bg-blue-400 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600 transition">Submit</button>
                <p v-if="errorMessage" class="mt-3 text-red-400">{{ errorMessage }}</p>
            </div>
        </div>
        
    </div>
</template>