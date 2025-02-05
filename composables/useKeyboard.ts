
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { projects } from '~/data/projects'

export function useKeyboard() {
  const router = useRouter()

  const handleKeydown = (e: KeyboardEvent) => {
    // Number keys 1-9 for direct project navigation
    if (e.key >= '1' && e.key <= '9') {
      const projectIndex = parseInt(e.key) - 1
      if (projectIndex < projects.length) {
        router.push(`/projects/${projects[projectIndex].id}`)
      }
    }

    // Arrow keys for project navigation
    if (e.key === 'ArrowRight') {
      const currentId = parseInt(router.currentRoute.value.params.id as string)
      const nextId = currentId < projects.length ? currentId + 1 : 1
      router.push(`/projects/${nextId}`)
    }

    if (e.key === 'ArrowLeft') {
      const currentId = parseInt(router.currentRoute.value.params.id as string)
      const prevId = currentId > 1 ? currentId - 1 : projects.length
      router.push(`/projects/${prevId}`)
    }

    // ESC to go back to projects page
    if (e.key === 'Escape') {
      router.push('/projects')
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
