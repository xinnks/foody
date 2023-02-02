<template>
  <div class="bg-light flex flex-col min-h-[100vh]">
    <NavigationBar>
    </NavigationBar>
    <main class="flex-1 flex flex-col w-full md:max-w-6xl mx-auto relative z-0">
        <slot></slot>
    </main>
    <AppFooter/>
  </div>
</template>