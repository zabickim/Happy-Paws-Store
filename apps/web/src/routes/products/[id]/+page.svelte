<script lang="ts">
	import type { PageData } from './$types.js';
	import { addToCart } from '$lib/stores/cart.svelte.js';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const { product } = data;

	let added = $state(false);

	function handleAddToCart() {
		addToCart(product);
		added = true;
		setTimeout(() => (added = false), 1500);
	}

	function formatPrice(cents: number): string {
		return (cents / 100).toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
	}
</script>

<svelte:head>
	<title>{product.name} – Happy Paws Store</title>
</svelte:head>

<div class="mb-6">
	<a href="/products" class="text-sm text-stone-500 hover:text-amber-600 transition-colors">
		← Back to products
	</a>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
	<!-- Product image -->
	<div class="card overflow-hidden aspect-square bg-stone-100">
		<img
			src={product.imageUrl}
			alt={product.name}
			class="h-full w-full object-cover"
		/>
	</div>

	<!-- Product info -->
	<div class="flex flex-col gap-6">
		<div>
			<h1 class="text-3xl font-bold text-stone-900 leading-tight">{product.name}</h1>
			<p class="mt-3 text-stone-500 leading-relaxed">{product.description}</p>
		</div>

		<div class="flex items-center gap-4">
			<span class="text-3xl font-bold text-amber-600">{formatPrice(product.price)}</span>
			{#if product.stock > 0}
				<span class="badge-green">In stock ({product.stock} left)</span>
			{:else}
				<span class="badge-red">Out of stock</span>
			{/if}
		</div>

		<div class="pt-2">
			<button
				onclick={handleAddToCart}
				class="btn-primary w-full py-3 text-base"
				disabled={product.stock === 0}
			>
				{added ? '✓ Added to Cart' : 'Add to Cart'}
			</button>
		</div>
	</div>
</div>
