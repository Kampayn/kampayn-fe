import { ref, shallowRef, type Component } from 'vue'

export interface ModalOptions {
  component: Component
  props?: Record<string, unknown>
  isAlert?: boolean
}

export interface RegistModalProps {
  title: string
  desc: string
  type: string
}

const show = ref(false)
const showAlert = ref(false)
const component = shallowRef<Component | null>(null)
const componentProps = ref<Record<string, unknown>>({})
const isAlert = ref(false)

export function useModal() {
  const openModal = (options: ModalOptions) => {
    component.value = options.component
    componentProps.value = options.props || {}
    isAlert.value = options.isAlert || false

    if (options.isAlert) {
      showAlert.value = true
    } else {
      show.value = true
    }
  }

  const closeModal = () => {
    show.value = false
    showAlert.value = false
    component.value = null
    componentProps.value = {}
    isAlert.value = false
  }

  return {
    show,
    showAlert,
    component,
    componentProps,
    isAlert,
    openModal,
    closeModal,
  }
}
