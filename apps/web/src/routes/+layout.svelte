<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<nav>
		<a href="/">Happy Paws Store</a>
		<a href="/cart">Cart</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer>
	<p>© 2026 Happy Paws Store</p>
</footer>
