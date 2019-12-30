<template>
  <section v-html="body"></section>
</template>

<style scoped>
section {
  line-height: 2;
}

section >>> h1,
section >>> h2,
section >>> h3,
section >>> h4,
section >>> h5,
section >>> h6 {
  margin: 2rem 0 1rem 0;
  padding: 0;
}

section >>> h1 {
  font-size: 1.5rem;
}

section >>> h2 {
  font-size: 1.3rem;
}

section >>> p,
section >>> table,
section >>> pre {
  margin: 0 0 1rem 0;
  padding: 0;
}

section >>> pre,
section >>> code {
  font-family: "SF Mono", Menlo, "Courier", monospace;
}

section >>> pre {
  font-size: 0.75rem;
  line-height: 1.8;
  padding: 0.5rem;
  overflow-x: auto;
}

section >>> img {
  display: block;
  width: 100%;
}

section >>> ul,
section >>> ol {
  margin: 0 0 1rem 0;
  padding: 0 0 0 2rem;
}

section >>> li {
  margin: 0 0 0.5rem 0;
  padding: 0;
}

section >>> table,
section >>> th,
section >>> td {
  border: 1px solid #333;
}

section >>> table {
  border-collapse: collapse;
  margin: 0 0 1rem 0;
  padding: 0;
  width: 100%;
}

section >>> th,
section >>> td {
  padding: 0.25rem;
}

section >>> hr {
  margin: 2rem 0;
}
</style>

<script>
import "prismjs/themes/prism-tomorrow.css";

export default {
  props: {
    body: String
  }
};
</script>
