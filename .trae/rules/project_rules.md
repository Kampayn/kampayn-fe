# 📘 Project Rules & Conventions

This document outlines the technical guidelines, project structure, and best practices for maintaining consistency and scalability in this Vue 3 project using TypeScript, Tailwind CSS v4, and shadcn-vue.

---

## 🔧 Tech Stack

- **Vue 3**: Using `<script setup>`, Composition API, and full TypeScript support.
- **Tailwind CSS v4**: Utility-first CSS framework with enhanced performance and modern defaults.
- **shadcn-vue**: For UI components built with accessibility and consistency in mind.

---

## 🧱 Project Structure

```
src/
├── assets/             # Static assets (images, fonts, etc.)
│   └── styles/         # Global styles or Tailwind config extensions
├── components/         # Reusable UI components
│   └── ui/             # Components from or based on shadcn-vue
├── composables/        # Custom Composition API functions
├── layouts/            # Layout components (e.g. MainLayout.vue)
├── pages/              # Route-level components (use Vue Router)
├── router/             # Routing config (index.ts, guards)
├── services/           # External API/service logic (e.g. auth.ts)
├── stores/             # Pinia stores
├── types/              # Global TypeScript type declarations
├── utils/              # Helper utilities (formatters, validators, etc.)
├── App.vue             # Root component
└── main.ts             # Entry point
```

> ✅ Use `@/` alias for `src/` to simplify imports.

---

## ✅ General Rules

### Vue (TypeScript + `<script setup>`)
- Use **`<script setup lang="ts">`** in all components.
- Define `props` and `emits` with TypeScript.
- Group reusable logic in `composables/`.
- Avoid direct DOM manipulation, use `ref` or `watch`.

### Tailwind CSS v4
- Prefer using Tailwind utilities over custom CSS unless necessary.
- Follow the design system in `tailwind.config.ts`.

### shadcn-vue
- Use UI primitives from `shadcn-vue` where available.
- Wrap custom behavior in `components/ui/`.
- Keep styling consistent with shadcn design.

---

## 📂 Naming Conventions

| Item              | Convention             | Example              |
|-------------------|------------------------|----------------------|
| Files/Folders     | kebab-case             | `user-profile.vue`   |
| Components        | PascalCase             | `UserCard.vue`       |
| Composables       | useX naming            | `useUser.ts`         |
| Stores (Pinia)    | useXStore              | `useAuthStore.ts`    |
| Types             | PascalCase + `Type`    | `UserType.ts`        |

---

## 🔌 Service Layer Guide (`src/services/`)

### 1. Create Type Definitions (`src/types/`)
```ts
// types/user.ts
export interface GetUserParams { id: string }
export interface UpdateUserBody { name: string; email: string }
export interface UserResponse { id: string; name: string; email: string }
```

### 2. Create the Service (`src/services/`)
```ts
// services/userService.ts
import { api } from '@/lib/axios'
import type { GetUserParams, UpdateUserBody, UserResponse } from '@/types/user'

export const userService = {
  async getUser({ id }: GetUserParams): Promise<UserResponse> {
    const { data } = await api.get(`/users/${id}`)
    return data
  },
  async updateUser(id: string, body: UpdateUserBody): Promise<UserResponse> {
    const { data } = await api.put(`/users/${id}`, body)
    return data
  }
}
```

### 3. Use in Views or Components
```ts
// views/UserPage.vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { userService } from '@/services/userService'
import type { UserResponse } from '@/types/user'

const user = ref<UserResponse | null>(null)
onMounted(async () => { user.value = await userService.getUser({ id: '123' }) })
</script>
```

### 4. With Params & Body
```ts
export interface SubmitFormParams { query: string }
export interface SubmitFormBody { answers: string[] }

export const formService = {
  async submitForm(params: SubmitFormParams, body: SubmitFormBody): Promise<FormResponse> {
    const { data } = await api.post(`/form?query=${params.query}`, body)
    return data
  }
}
```

---

## 📦 When to Use Services in Pinia

Use Pinia when:
- Shared state is needed globally.
- Caching API responses.
- Actions call services and mutate state.

```ts
export const useUserStore = defineStore('user', {
  state: () => ({ currentUser: null, isLoading: false }),
  actions: {
    async fetchUser(id: string) {
      this.isLoading = true
      try { this.currentUser = await userService.getUser({ id }) }
      catch (error) { showError(error, 'Failed to fetch user') }
      finally { this.isLoading = false }
    }
  }
})
```

---

## ❗ Error Handling & Loading State

### In Views/Components
```ts
const isLoading = ref(false)
const errorMessage = ref('')

try {
  isLoading.value = true
  user.value = await userService.getUser({ id: '123' })
} catch (error) {
  errorMessage.value = error.message || 'Failed to fetch user'
  toast.error(errorMessage.value)
} finally {
  isLoading.value = false
}
```

### Global Loading Suggestion
Combine `isLoading` from multiple stores using a computed property to show a global loader.

---