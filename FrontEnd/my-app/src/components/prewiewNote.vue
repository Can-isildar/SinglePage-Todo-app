<template>
    <div>
        <h3>{{ note }}</h3>
    </div>
</template>

<script>
import { getNotes } from '@/services/api';
export default {
    methods: {
        async showNote() {
            const note = await getNotes()
            console.log(note);
        }
    },
}
</script>