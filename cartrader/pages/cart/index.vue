<template>
  <div class="cart-page">
    <h1>Shopping Cart</h1>
    <div v-if="cartItems.length">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image" alt="Car Image" class="item-image" />
          <div class="item-details">
            <h2>{{ item.name }}</h2>
            <p>Price: ${{ item.price }}</p>
            <p>Quantity: {{ item.quantity }}</p>
          </div>
        </div>
      </div>
      <div class="cart-summary">
        <h3>Total: ${{ cartTotal }}</h3>
        <button>Checkout</button>
      </div>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [
        {
          id: 1,
          name: 'Toyota Camry',
          price: 25000,
          quantity: 1,
          image: 'https://www.carhelpcanada.com/wp-content/uploads/2019/12/2020-Range-Rover-Evoque-2.jpg'
        },
        {
          id: 2,
          name: 'Honda Accord',
          price: 22000,
          quantity: 2,
          image: 'https://robbreport.com/wp-content/uploads/2021/03/1-5.jpg?w=1000'
        }
      ]
    }
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  }
}
</script>

<style scoped>
.cart-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
}
.cart-items {
  margin-bottom: 2rem;
}
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  background: #fff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.item-image {
  width: 100px;
  height: 60px;
  object-fit: cover;
  margin-right: 1rem;
}
.item-details h2 {
  margin: 0 0 0.5rem 0;
}
.cart-summary {
  text-align: right;
}
.cart-summary button {
  padding: 0.5rem 1.5rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>