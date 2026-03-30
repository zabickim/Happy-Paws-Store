<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';

	interface Props { children: Snippet }

	let { children }: Props = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="site-header">
	<nav class="site-nav">
		<a href="/" class="site-nav__brand">Happy Paws Store</a>
		<div class="site-nav__links">
			<a href="/products">Products</a>
			<a href="/cart" class="btn-primary text-sm px-4 py-2">Cart</a>
		</div>
	</nav>
</header>

<main class="site-main">{@render children()}</main>
<footer class="site-footer"><p>© 2026 Happy Paws Store - Made with love for dogs</p></footer>
