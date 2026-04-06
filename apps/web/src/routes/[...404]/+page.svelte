<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Page Not Found – Happy Paws Store</title>
</svelte:head>

<div class="flex flex-col items-center justify-center text-center py-24 gap-6">
	<h1 class="text-4xl font-bold text-stone-900">404</h1>
	<p class="text-stone-500 max-w-sm text-lg">
		Looks like this page was not found.<br />
		<span class="text-sm font-mono text-stone-400">{$page.url.pathname}</span>
	</p>

	<div class="flex gap-4">
		<a href="/" class="btn-primary px-8 py-3">Go Home</a>
		<a href="/products" class="btn-secondary px-8 py-3">Browse Products</a>
	</div>
</div>
