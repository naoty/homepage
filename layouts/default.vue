<template>
  <main>
    <nuxt />
  </main>
</template>

<style>
main {
  background-color: #fff;
  padding: 1rem;
}

main *:last-child {
  margin-bottom: 0;
}

@media (max-width: 36rem) {
  main {
    min-height: 100vh;
  }
}

@media (min-width: 36rem) {
  main {
    width: 36rem;
    margin: 2rem auto;
    padding: 2rem;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1), 3px 0 5px rgba(0, 0, 0, 0.1),
      -3px 0 5px rgba(0, 0, 0, 0.1);
  }
}

@media (prefers-color-scheme: dark) {
  main {
    background-color: #3b4252;
  }
}
</style>
