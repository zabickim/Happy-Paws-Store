<script lang="ts">
	import type { PageData } from './$types.js';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	function formatPrice(cents: number): string {
		return (cents / 100).toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
	}
</script>

<svelte:head>
	<title>Products – Happy Paws Store</title>
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-stone-900">All Products</h1>
	<p class="mt-1 text-stone-500">Everything your dog could ever want</p>
</div>

{#if data.products.length === 0}
	<div class="text-center py-24 text-stone-400">
		<p class="text-lg">No products available yet.</p>
	</div>
{:else}
	<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
		{#each data.products as product (product.id)}
			<li>
				<a
					href="/products/{product.id}"
					class="card group flex flex-col h-full hover:shadow-md transition-shadow no-underline"
				>
					<div class="aspect-square w-full overflow-hidden bg-stone-100">
						<img
							src={product.imageUrl}
							alt={product.name}
							class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					</div>

					<div class="flex flex-col flex-1 p-5 gap-3">
						<div class="flex-1">
							<h2 class="text-base font-semibold text-stone-900 leading-snug">
								{product.name}
							</h2>
							<p class="mt-1 text-sm text-stone-500 line-clamp-2">{product.description}</p>
						</div>

						<div class="flex items-center justify-between mt-auto">
							<span class="text-lg font-bold text-amber-600">{formatPrice(product.price)}</span>

							{#if product.stock > 0}
								<span class="badge-green">In stock</span>
							{:else}
								<span class="badge-red">Out of stock</span>
							{/if}
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
{/if}
