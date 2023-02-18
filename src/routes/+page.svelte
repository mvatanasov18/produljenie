<script lang="ts">
	import { concurrent } from 'svelte-typewriter';
</script>

<div class="center-items">
	<h1 >
		<span class="first-half">Star </span>
		<span class="second-half">Index</span>
	</h1>
	<section style="position: absolute;top:20%;">
		<p />
		<div class="center-items">
		<p use:concurrent={{ interval: 30 }}>
			Welcome to StarIndex! 
			Your ultimate guide to the night sky.
		</p>
		<p use:concurrent={{ interval: 30 }}>
			Step into the world of stargazing and discover the beauty of the universe with our 3D map.
			Create an account, log in, upload a photo of the night sky, and watch as we create a map of
			the stars just for you.
		</p>
		<img src="starDust.jpeg" alt="prahulqk" />
		<p use:concurrent={{ interval: 30 }}>
			With high-quality photos, you can be sure to get an accurate map of the stars. Explore the
			surrounding stars and even create your own personal constellation. Name it, and share it with
			the world when it's approved by our admin.
		</p>
		<img src="OshtePrahulqk.png" alt="prahulqk" />
		<p use:concurrent={{ interval: 30 }}>
			So what are you waiting for? Sign up now and start exploring the universe!
		</p>
		</div>
	</section>
</div>

<style>
:global(body) {
		overflow-x: hidden;
	}
	p {
		text-align: center;
		white-space: pre-line;
	}
	.first-half {
		top: 10%;
		position: absolute;

		opacity: 0;
		animation: move-to-center-reverse 2s ease forwards;
	}

	.second-half {
		top: 10%;
		position: absolute;
		opacity: 0;
		animation: move-to-center 2s ease forwards;
	}
	img{
		max-width: 100%;
		animation: fadeIn 7s;
	}

	@keyframes move-to-center {
		0% {
			left: 80%;
			opacity: 0;
		}
		20% {
			left: 75%;
			opacity: 0.009;
		}
		99.99% {
			left: 49.5%;
			opacity: 1;
		}
		100% {
			left: 49.5%;
			opacity: 1;
		}
	}
	@keyframes move-to-center-reverse {
		0% {
			right: 80%;
			opacity: 0;
		}
		20% {
			right: 75%;
			opacity: 0.009;
		}
		99.99% {
			right: 50.5%;
			opacity: 1;
		}
		100% {
			right: 50.5%;
			opacity: 1;
		}
	}
	@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
