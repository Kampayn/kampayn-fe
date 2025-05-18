<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { computed } from 'vue'

interface Props {
  defaultValue?: string | number
  modelValue?: string | number
  class?: string
  isIcon?: boolean
  iconPosition?: 'left' | 'right'
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
  min?: number | string
  max?: number | string
  step?: number | string
  minlength?: number | string
  maxlength?: number | string
  pattern?: string
  autocomplete?: string
  name?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  isIcon: false,
  iconPosition: 'left',
  type: 'text',
})

const emits = defineEmits<{
  'update:modelValue': [payload: string | number]
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

// Extract only the input-related attributes
const inputAttrs = computed(() => ({
  type: props.type,
  placeholder: props.placeholder,
  disabled: props.disabled,
  required: props.required,
  readonly: props.readonly,
  min: props.min,
  max: props.max,
  step: props.step,
  minlength: props.minlength,
  maxlength: props.maxlength,
  pattern: props.pattern,
  autocomplete: props.autocomplete,
  name: props.name,
  id: props.id,
}))

// Base input classes
const baseInputClasses = [
  // Base styling
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
  'dark:bg-input/30 border-input',
  'flex h-10 w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs',
  'transition-[color,box-shadow] outline-none',

  // File input styling
  'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',

  // Disabled state
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

  // Responsive text size
  'md:text-sm',

  // Focus states
  'focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2',

  // Invalid states
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
]

// Dynamic padding classes based on icon configuration
const paddingClasses = computed(() => {
  if (!props.isIcon) {
    return 'px-3 py-1'
  }

  const basePadding = 'py-1'
  const leftPadding = props.iconPosition === 'left' ? 'pl-10 pr-3' : 'pl-3'
  const rightPadding = props.iconPosition === 'right' ? 'pr-10' : ''

  return `${basePadding} ${leftPadding} ${rightPadding}`.trim()
})

// Complete input classes
const inputClasses = computed(() => cn(baseInputClasses, paddingClasses.value, props.class))

// Icon container classes
const iconClasses = computed(() =>
  cn('absolute inset-y-0 flex items-center justify-center px-2', {
    'left-0': props.iconPosition === 'left',
    'right-0': props.iconPosition === 'right',
  }),
)
</script>

<template>
  <div v-if="isIcon" class="relative w-full">
    <input v-bind="inputAttrs" v-model="modelValue" data-slot="input" :class="inputClasses" />
    <span :class="iconClasses">
      <slot />
    </span>
  </div>

  <input v-else v-bind="inputAttrs" v-model="modelValue" data-slot="input" :class="inputClasses" />
</template>
