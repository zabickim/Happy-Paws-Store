<script lang="ts">
	import { clearCart } from '$lib/stores/cart.svelte.js';
	import { onMount } from 'svelte';

	onMount(() => {
		clearCart();
	});
</script>

<svelte:head>
	<title>Order Confirmed – Happy Paws Store</title>
</svelte:head>

<div class="flex flex-col items-center justify-center text-center py-24 gap-6">
	<h1 class="text-3xl font-bold text-stone-900">Order confirmed!</h1>
	<p class="text-stone-500 max-w-sm">
		Thank you for your purchase. Your furry friend is going to love it!
		A confirmation will be sent once payment is processed.
	</p>

	<a href="/products" class="btn-primary px-8 py-3">Continue Shopping</a>
</div>
