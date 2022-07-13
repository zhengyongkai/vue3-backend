import { ref, reactive } from 'vue';
export function usePageHelper() {
  const query = reactive({
    limit: 5,
    page: 1,
    pages: 1,
  });
  const tableData = ref([]);
  return {
    query,
    tableData,
  };
}
