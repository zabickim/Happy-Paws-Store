<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error {$page.status} – Happy Paws Store</title>
</svelte:head>

<div class="flex flex-col items-center justify-center text-center py-24 gap-6">
	<h1 class="text-4xl font-bold text-stone-900">{$page.status}</h1>
	<p class="text-stone-500 max-w-sm text-lg">
		{#if $page.status === 404}
			We couldn't find what you were looking for.
		{:else if $page.status === 500}
			Something went wrong. Please try again.
		{:else}
			{$page.error?.message ?? 'An unexpected error occurred.'}
		{/if}
	</p>

	<a href="/" class="btn-primary px-8 py-3">Go Home</a>
</div>
