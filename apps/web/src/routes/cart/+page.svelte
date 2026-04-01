<script lang="ts">
	import { cartItems, cartTotal, removeFromCart, updateQuantity } from '$lib/stores/cart.svelte.js';

	let loading = $state(false);
	let checkoutError = $state('');

	async function handleCheckout() {
		loading = true;
		checkoutError = '';

		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: cartItems.value.map((i) => ({
						productId: i.product.id,
						quantity: i.quantity
					}))
				})
			});

			if (!res.ok) {
				const data = await res.json();
				checkoutError = data?.message ?? 'Checkout failed. Please try again.';
				return;
			}

			const { url } = await res.json();
			window.location.href = url;
		} catch {
			checkoutError = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	function formatPrice(cents: number): string {
		return (cents / 100).toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
	}
</script>

<svelte:head>
	<title>Cart – Happy Paws Store</title>
</svelte:head>

<h1 class="text-3xl font-bold text-stone-900 mb-8">Your Cart</h1>

{#if cartItems.value.length === 0}
	<div class="text-center py-24 flex flex-col items-center gap-4 text-stone-400">
		<p class="text-lg">Your cart is empty.</p>
		<a href="/products" class="btn-primary">Browse Products</a>
	</div>
{:else}
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

		<!-- Line items -->
		<ul class="lg:col-span-2 flex flex-col gap-4 list-none p-0 m-0">
			{#each cartItems.value as item (item.product.id)}
				<li class="card flex gap-4 p-4 items-start">
					<img
						src={item.product.imageUrl}
						alt={item.product.name}
						class="w-24 h-24 object-cover rounded-xl bg-stone-100 shrink-0"
					/>

					<div class="flex-1 flex flex-col gap-2">
						<div class="flex items-start justify-between gap-2">
							<a
								href="/products/{item.product.id}"
								class="font-semibold text-stone-900 hover:text-amber-600 leading-snug"
							>
								{item.product.name}
							</a>
							<button
								onclick={() => removeFromCart(item.product.id)}
								class="btn-ghost text-stone-400 hover:text-red-500 p-1 shrink-0"
								aria-label="Remove item"
							>
								✕
							</button>
						</div>

						<p class="text-sm text-stone-500">{formatPrice(item.product.price)} each</p>

						<div class="flex items-center gap-3 mt-1">
							<button
								onclick={() => updateQuantity(item.product.id, item.quantity - 1)}
								class="btn-secondary h-8 w-8 p-0 text-lg leading-none"
								aria-label="Decrease quantity"
							>−</button>

							<span class="w-8 text-center font-semibold tabular-nums">{item.quantity}</span>

							<button
								onclick={() => updateQuantity(item.product.id, item.quantity + 1)}
								class="btn-secondary h-8 w-8 p-0 text-lg leading-none"
								disabled={item.quantity >= item.product.stock}
								aria-label="Increase quantity"
							>+</button>

							<span class="ml-auto font-bold text-stone-900">
								{formatPrice(item.product.price * item.quantity)}
							</span>
						</div>
					</div>
				</li>
			{/each}
		</ul>

		<!-- Order summary -->
		<div class="card p-6 flex flex-col gap-5 lg:sticky lg:top-24">
			<h2 class="text-xl font-bold text-stone-900">Order Summary</h2>

			<div class="flex flex-col gap-2 text-sm text-stone-600">
				{#each cartItems.value as item (item.product.id)}
					<div class="flex justify-between">
						<span>{item.product.name} × {item.quantity}</span>
						<span>{formatPrice(item.product.price * item.quantity)}</span>
					</div>
				{/each}
			</div>

			<div class="border-t border-stone-200 pt-4 flex justify-between font-bold text-stone-900 text-lg">
				<span>Total</span>
				<span>{formatPrice(cartTotal())}</span>
			</div>

			{#if checkoutError}
				<p class="text-sm text-red-600">{checkoutError}</p>
			{/if}

			<button
				onclick={handleCheckout}
				disabled={loading}
				class="btn-primary w-full py-3 text-base"
			>
				{loading ? 'Redirecting…' : 'Proceed to Checkout'}
			</button>
		</div>

	</div>
{/if}
